---
title: "Implementando un Chat con IA en Nuxt usando Vercel AI Gateway"
description: "Este tutorial te muestra cómo implementar un asistente de IA en Nuxt 4 usando Vercel AI SDK y Vercel AI Gateway. Si estás pensando en añadir inteligencia artificial a tu proyecto, esta guía te dará una visión general clara de cómo hacerlo."
date: "15 de diciembre de 2025"
category: "Inteligencia Artificial"
icon: "i-lucide-brain-circuit"
image: "/images/blog/ai-gateway.png"
---

## ¿Qué es Vercel AI Gateway?

Antes de entrar en código, hablemos de **Vercel AI Gateway**. Es un servicio que permite gestionar múltiples proveedores de IA desde un único punto de entrada. Esto significa que puedes usar modelos de Anthropic (Claude), OpenAI (GPT), Google (Gemini) y otros, sin cambiar tu implementación cada vez.

### Ventajas principales:

- **Una clave, cientos de modelos**: Accedé a modelos de múltiples proveedores con una sola API key.
- **API Unificada**: Cambiá entre proveedores y modelos con cambios mínimos en el código.
- **Alta fiabilidad**: Reintenta automáticamente las solicitudes con otros proveedores si uno falla.
- **Soporte de embeddings**: Generá embeddings vectoriales para búsqueda, recuperación y otras tareas.
- **Monitoreo de gastos**: Monitoreá tus gastos en los diferentes proveedores.
- **Sin recargo en tokens**: Los tokens cuestan lo mismo que directamente con el proveedor, sin ningún recargo, incluso con Bring Your Own Key (BYOK).

## Arquitectura General

El sistema tiene cuatro partes principales:

1. **El servidor** (`/server/api/chat.ts`): Donde se procesan los mensajes y se definen las herramientas
2. **La interfaz** (`/app/pages/ia.vue`): El chat donde el usuario interactúa
3. **Las herramientas** (`/shared/utils/tools/`): Funciones especiales que la IA puede usar
4. **Componentes Personalizados** (`/app/components/Tools/`): Componentes Vue que renderizan el resultado de cada herramienta

---

## Prerrequisitos

Antes de empezar, necesitás registrarte en dos servicios:

1. **Vercel AI Gateway**: Creá una cuenta en [Vercel](https://vercel.com) para poder obtener el API key del AI Gateway.

2. **API Ninjas**: Para el ejemplo práctico de este tutorial vamos a usar una API externa de horóscopos. Registrate en [https://api-ninjas.com/](https://api-ninjas.com/) y obtené tu API key.

---

## Configuración del Servidor

Vamos al corazón del sistema: el endpoint de chat. Se usa el SDK de Vercel que facilita enormemente el streaming de respuestas.

### Estructura básica

```typescript
// /server/api/chat.ts
import { streamText, UIMessage, createGateway, stepCountIs } from "ai";
import { horoscopeTool } from "../../shared/utils/tools/horoscopeTool";

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().aiGatewayApiKey; // debes configurar esta variable en tu .env, mas info https://nuxt.com/docs/4.x/api/composables/use-runtime-config

  if (!apiKey) throw new Error("Missing AI Gateway API key");

  const gateway = createGateway({ apiKey });
  const model = gateway("anthropic/claude-sonnet-4-20250514");

  return defineEventHandler(async (event) => {
    const { messages }: { messages: UIMessage[] } = await readBody(event);

    const result = streamText({
      model,
      system: "Eres un asistente útil.",
      messages,
      tools: {
        horoscopeTool,
      },
      stopWhen: stepCountIs(8),
    });

    return result.toUIMessageStreamResponse();
  });
});
```

### ¿Por qué `streamText`?

El método `streamText` permite que la respuesta llegue palabra por palabra al usuario, en lugar de esperar a que todo el texto se genere. Esto crea una experiencia mucho más fluida y natural.

### ¿Qué hace `stopWhen: stepCountIs(8)`?

Limita la cantidad de pasos que la IA puede ejecutar en una sola respuesta. Esto evita bucles infinitos si la IA decide llamar herramientas repetidamente.

---

## Las Herramientas (Tools)

Aquí viene lo interesante. La IA no solo responde preguntas, **puede ejecutar acciones**. Se definen "herramientas" que la IA puede invocar según necesite.

### Ejemplo: Consultar el horóscopo

Vamos a crear una herramienta que consulta el horóscopo diario usando la API de API Ninjas:

```typescript
// /shared/utils/tools/horoscopeTool.ts
import { tool } from "ai";
import type { UIToolInvocation } from "ai";
import { z } from "zod";

export type HoroscopeUIToolInvocation = UIToolInvocation<typeof horoscopeTool>;

type HoroscopeOutput = {
  date: string;
  sign: string;
  horoscope: string;
};

export const horoscopeTool = tool({
  description: "Returns the daily horoscope for a specific zodiac sign.",
  inputSchema: z.object({
    zodiac: z
      .literal([
        "aries",
        "taurus",
        "gemini",
        "cancer",
        "leo",
        "virgo",
        "libra",
        "scorpio",
        "sagittarius",
        "capricorn",
        "aquarius",
        "pisces",
      ])
      .describe("The zodiac sign to get a horoscope for."),
  }),
  execute: async ({ zodiac }: { zodiac: string }) => {
    const url = `https://api.api-ninjas.com/v1/horoscope?zodiac=${zodiac}`;

    try {
      const data: HoroscopeOutput = await $fetch(url, {
        headers: {
          "X-Api-Key": "YOUR_API_NINJAS_KEY", // idealmente deberías obtener esto de una variable de entorno
        },
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to fetch horoscope: ${String(error)}`);
    }
  },
});
```

### ¿Cómo funciona?

1. **Descripción clara**: Se le dice a la IA cuándo debe usar esta herramienta
2. **Validación con Zod**: Se definen qué datos se esperan (en este caso, un signo zodiacal válido usando `z.literal()` con un array de valores permitidos)
3. **Ejecución segura**: La función recibe datos validados, consulta la API externa y retorna el resultado

La IA lee la descripción y el schema, y decide por sí sola cuándo invocar la herramienta. Si el usuario pregunta "¿Cuál es mi horóscopo? Soy Leo", la IA llamará automáticamente a `horoscopeTool` con `zodiac: "leo"`.

---

## La Interfaz de Usuario con Nuxt UI

Para el frontend, no es necesario construir todo desde cero. Se puede aprovechar **Nuxt UI**, una librería de componentes que incluye componentes específicos para chat con IA.

### UChatMessages: el componente estrella

`UChatMessages` es un componente de Nuxt UI que gestiona automáticamente:

- **Renderizado de mensajes**: Muestra texto del usuario y de la IA
- **Indicadores de escritura**: Animación mientras la IA "piensa"
- **Auto-scroll**: Desplazamiento automático a mensajes nuevos
- **Estados de error**: Muestra cuando algo falla

Sin este componente, habría que implementar manualmente toda la lógica de streaming, scroll y formateo de mensajes.

### Código de la página:

```vue
<!-- /app/pages/ia.vue -->
<script setup lang="ts">
import { Chat } from "@ai-sdk/vue";
import type { UIMessage } from "ai";
import type { HoroscopeUIToolInvocation } from "~~/shared/utils/tools/horoscopeTool";

const messages: UIMessage[] = [];
const input = ref("");
const chat = new Chat({ messages });

const onSubmit = (e: Event) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  chat.sendMessage({ text });
  input.value = "";
};
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden pt-5">
    <UChatMessages
      :messages="chat.messages"
      :status="chat.status"
      class="flex-1 min-h-0 overflow-y-auto pb-6"
    >
      <template #content="{ message }">
        <template
          v-for="(part, index) in message.parts"
          :key="`${message.id}-${part.type}-${index}`"
        >
          <!-- Texto del asistente -->
          <MDC
            v-if="part.type === 'text' && message.role === 'assistant'"
            :value="part.text"
          />

          <!-- Texto del usuario -->
          <p
            v-else-if="part.type === 'text' && message.role === 'user'"
            class="whitespace-pre-wrap"
          >
            {{ part.text }}
          </p>

          <!-- Horóscopo -->
          <ToolsHoroscope
            v-else-if="part.type === 'tool-horoscopeTool'"
            :invocation="part as HoroscopeUIToolInvocation"
          />
        </template>
      </template>
    </UChatMessages>

    <div class="sticky bottom-5 p-4">
      <UChatPrompt
        v-model="input"
        placeholder="Escribe tu mensaje"
        :error="chat.error"
        @submit="onSubmit"
      >
        <UChatPromptSubmit
          :status="chat.status"
          @stop="chat.stop()"
          @reload="chat.regenerate()"
        />
      </UChatPrompt>
    </div>
  </div>
</template>
```

### El componente personalizado del horóscopo

Cuando la IA invoca `horoscopeTool`, el frontend recibe el resultado como una "parte" del mensaje con `type: 'tool-horoscopeTool'`. Necesitamos un componente que renderice ese resultado:

```vue
<!-- /app/components/Tools/Horoscope.vue -->
<script setup lang="ts">
import type { HoroscopeUIToolInvocation } from "~~/shared/utils/tools/horoscopeTool";

const props = defineProps<{
  invocation: HoroscopeUIToolInvocation;
}>();
</script>

<template>
  <!-- Loading state -->
  <div
    v-if="invocation.state !== 'output-available'"
    class="my-5 rounded-xl bg-muted px-5 py-6 flex items-center justify-center"
  >
    <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin mr-2" />
    <span class="text-sm">Consultando los astros...</span>
  </div>

  <!-- Result -->
  <div v-else class="my-5 rounded-xl border border-default bg-elevated/40 p-5">
    <div class="flex items-center gap-2 mb-3">
      <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
      <h3 class="text-base font-semibold text-highlighted capitalize">
        {{ invocation.output.sign }}
      </h3>
      <span class="text-xs text-muted ml-auto">
        {{ invocation.output.date }}
      </span>
    </div>
    <p class="text-sm text-muted leading-relaxed">
      {{ invocation.output.horoscope }}
    </p>
  </div>
</template>
```

El componente maneja dos estados:

- **Cargando**: Mientras la herramienta se ejecuta, muestra un spinner con el mensaje "Consultando los astros..."
- **Resultado**: Cuando la respuesta llega, muestra una card con el signo, la fecha y el texto del horóscopo

### ¿Qué hace la clase `Chat`?

El SDK de Vue proporciona una clase `Chat` que maneja todo el estado:

- **`chat.messages`**: Array con el historial de conversación
- **`chat.status`**: Estado actual ('ready', 'streaming', etc.)
- **`chat.sendMessage()`**: Envía un nuevo mensaje
- **`chat.stop()`**: Detiene la generación
- **`chat.regenerate()`**: Reintenta la última respuesta

### Resumen de componentes Nuxt UI utilizados:

| Componente          | Función                            |
| ------------------- | ---------------------------------- |
| `UChatMessages`     | Lista de mensajes con auto-scroll  |
| `UChatPrompt`       | Input de texto con botón de acción |
| `UChatPromptSubmit` | Botón que cambia según el estado   |

Gracias a Nuxt UI, se puede implementar toda la interfaz en menos de 100 líneas de código, sin preocuparse por animaciones, scroll o estados de carga.

---

## Flujo de Funcionamiento

1. **Usuario escribe**: "¿Cuál es mi horóscopo? Soy Aries"

2. **Frontend envía**: El mensaje va al endpoint `/api/chat`

3. **IA procesa**: Claude recibe el mensaje y decide qué hacer

4. **Tool invocation**: La IA decide llamar a `horoscopeTool` con `zodiac: "aries"`

5. **API externa**: La herramienta consulta API Ninjas y devuelve el horóscopo

6. **Respuesta al usuario**: El frontend recibe el resultado y renderiza la card del horóscopo

---

## Conclusión

Implementar un chat con IA en Nuxt usando Vercel AI Gateway es sorprendentemente sencillo:

1. **Configuras el gateway** una vez
2. **Defines herramientas** para las acciones que necesitas
3. **Creas componentes Vue** para renderizar los resultados
4. **Usas los componentes de Nuxt UI** que ya manejan el streaming

El resultado es un asistente inteligente que no solo conversa, **actúa**: consulta APIs externas, muestra resultados con componentes personalizados y mantiene una conversación fluida gracias al streaming. A partir de aquí, podés agregar más herramientas (gráficos, envío de emails, exportación de archivos, etc.). La posibilidades son infinitas.
