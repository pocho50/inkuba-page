---
title: "Cómo usar WebSockets con Nuxt: guía práctica"
description: "Aprende a implementar comunicación en tiempo real con Nuxt usando defineWebSocketHandler en el servidor y useWebSocket en el cliente."
date: "2026-02-28"
category: "Nuxt"
icon: "i-lucide-radio-tower"
image: "/images/blog/websocket-nuxt.png"
---

Si quieres actualizar la UI en tiempo real sin hacer polling constante, WebSocket es una excelente opción.

En este artículo veremos una implementación completa en Nuxt basada en dos piezas:

1. Un endpoint WebSocket en el servidor (Nitro).
2. Un composable cliente que escucha y emite eventos con `useWebSocket`.

---

## ¿Cuándo usar WebSocket?

Usa WebSocket cuando necesites eventos en tiempo real, por ejemplo:

- cambios de estado de tareas,
- notificaciones colaborativas,
- seguimiento de sesiones activas,
- dashboards que se actualizan solos.

Si solo necesitas refrescos ocasionales, una petición HTTP puede ser suficiente. Pero si hay interacción frecuente entre usuarios, WebSocket es mejor.

---

## 1) Habilitar WebSocket en Nuxt

En Nuxt (Nitro), habilita la funcionalidad WebSocket en `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
```

Con esto, Nitro puede servir rutas WS como `/api/**/ws/**`.

---

## 2) Crear el endpoint WebSocket (servidor)

En este ejemplo, el endpoint está en:

`server/api/ws/tasks.ts`

La idea es simple:

- cuando un cliente se conecta, se suscribe a una sala,
- cuando llega un mensaje, se publica a toda la sala.

```ts
import type { Peer, Message } from "crossws";

const room = "tasks";

export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe(room);
  },
  close(peer) {
    console.log("closed WS");
  },
  error(peer, error) {
    console.log("error on WS", error);
  },
  message(peer, message) {
    peer.publish(room, message.text());
  },
});
```

### Qué está pasando aquí

- `open`: cada cliente entra a la sala `tasks`.
- `message`: cualquier mensaje recibido se reenvía a todos los suscritos.
- `close/error`: útiles para observabilidad y debugging.

---

## 3) Instalar VueUse (`useWebSocket`)

El composable `useWebSocket` viene de [VueUse](https://vueuse.org/core/useWebSocket/), una colección de utilidades para Vue y Nuxt. Proporciona una API reactiva para trabajar con WebSockets: gestiona la conexión, expone el estado (`status`), los datos recibidos (`data`) y una función `send` para enviar mensajes.

Para usarlo en Nuxt, instala el módulo oficial:

```bash
npx nuxt@latest module add vueuse
```

Esto añade `@vueuse/nuxt` a tus dependencias y lo registra en `nuxt.config.ts` automáticamente. Una vez instalado, todos los composables de VueUse (incluido `useWebSocket`) estarán disponibles por auto-import en tu proyecto, sin necesidad de importarlos manualmente.

---

## 4) Consumir WebSocket desde un composable (cliente)

La implementación cliente está en:

`composables/useWsTasks.ts`

Puntos importantes del composable:

- encapsula toda la lógica WS en un solo composable reutilizable,
- construye la URL WS dinámicamente (`ws://` o `wss://` según protocolo),
- escucha cambios con `watch(wsData, ...)`,
- evita procesar dos veces el mismo evento con `lastUpdate`.

```ts
type WsTasksCallback = () => void | Promise<void>;

export function useWsTasks(callback?: WsTasksCallback) {
  const lastUpdate = ref<string | null>(null);

  if (!import.meta.client) {
    return {
      sendData: (_message: string) => false,
      lastUpdate,
      wsStatus: ref("CLOSED"),
    };
  }

  const url = useRequestURL();
  const wsProtocol = url.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsProtocol}://${url.host}/api/ws/tasks`;

  const { status: wsStatus, data: wsData, send } = useWebSocket(wsUrl);

  watch(wsData, async (newVal) => {
    if (!newVal) return;

    if (newVal !== lastUpdate.value) {
      lastUpdate.value = newVal;
      if (callback) {
        await callback();
      }
    }
  });

  function sendData(message: string) {
    lastUpdate.value = message;
    send(message);
  }

  return {
    sendData,
    lastUpdate,
    wsStatus,
  };
}
```

### Por qué `lastUpdate` es útil

Cuando tú envías un evento, el servidor lo re-publica a todos, incluido el emisor. Con `lastUpdate` evitas disparar lógica duplicada en el cliente que originó el mensaje.

---

## 5) Uso en una página o componente

Patrón recomendado:

1. montas `useWsTasks` con un callback (por ejemplo, recargar tareas),
2. cuando haces una acción local (crear/editar una tarea), llamas `sendData(...)`,
3. el resto de clientes recibe el evento y ejecuta su callback.

Ejemplo:

```ts
const { sendData, wsStatus } = useWsTasks(async () => {
  await refreshTasks();
});

async function onTaskUpdated() {
  await saveTask();
  sendData(`task-updated:${Date.now()}`);
}
```

---

## 6) Buenas prácticas en producción

- **Mensajes estructurados**: mejor JSON que texto plano.
  - Ejemplo: `{ "type": "task-updated", "taskId": "123" }`
- **Autenticación/autorización**: valida quién puede conectarse y publicar.
- **Reconexión**: maneja desconexiones temporales de red.
- **Filtrado por canal/sala**: evita que todos los clientes reciban todo.
- **Logs y métricas**: clave para depurar problemas en tiempo real.

---

## 7) Problemas comunes

1. **No conecta en producción con HTTPS**
   - Usa `wss://`, no `ws://`.

2. **Eventos duplicados**
   - Implementa deduplicación (`lastUpdate`, ids de evento, etc.).

3. **La conexión se abre en SSR**
   - Protege el código con `import.meta.client`.

4. **No llega ningún mensaje**
   - Verifica que el cliente se suscriba a la misma sala que el servidor publica.

---

## Conclusión

Con Nuxt, montar WebSockets es bastante directo:

- servidor con `defineWebSocketHandler`,
- cliente con `useWebSocket`,
- y un composable para centralizar la lógica de conexión.

Este enfoque te da una base sólida para funcionalidades colaborativas en tiempo real, manteniendo una arquitectura limpia y reusable.
