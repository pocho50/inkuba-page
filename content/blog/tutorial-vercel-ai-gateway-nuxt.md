---
title: "Implementando un Chat con IA en Nuxt usando Vercel AI Gateway"
description: "Este tutorial te muestra cómo implementar un asistente de IA en Nuxt 4 usando Vercel AI SDK y Vercel AI Gateway. Si estás pensando en añadir inteligencia artificial a tu proyecto, esta guía te dará una visión general clara de cómo hacerlo."
date: "2025-12-15"
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

El sistema tiene tres partes principales:

1. **El servidor** (`/server/api/chat.ts`): Donde se procesan los mensajes y se definen las herramientas
2. **La interfaz** (`/app/pages/ia.vue`): El chat donde el usuario interactúa
3. **Las herramientas** (`/shared/utils/tools/`): Funciones especiales que la IA puede usar

---

## Paso 1: Configuración del Servidor

Vamos al corazón del sistema: el endpoint de chat. Se usa el SDK de Vercel que facilita enormemente el streaming de respuestas.

### Estructura básica

```typescript
// /server/api/chat.ts
import { streamText, createGateway, tool, UIMessage } from "ai";

export default defineLazyEventHandler(async () => {
  // 1. Se crea el gateway con la API key
  const apiKey = useRuntimeConfig().aiGatewayApiKey;
  const gateway = createGateway({ apiKey });

  // 2. Se define el modelo que se usará
  const model = gateway("anthropic/claude-opus-4.5");

  // 3. Retornamos el handler que procesa las peticiones
  return defineEventHandler(async (event) => {
    const { messages }: { messages: UIMessage[] } = await readBody(event);

    const result = streamText({
      model,
      system: "Eres un asistente útil...",
      messages,
    });

    return result.toUIMessageStreamResponse();
  });
});
```

### ¿Por qué `streamText`?

El método `streamText` permite que la respuesta llegue palabra por palabra al usuario, en lugar de esperar a que todo el texto se genere. Esto crea una experiencia mucho más fluida y natural.

---

## Paso 2: Las Herramientas (Tools)

Aquí viene lo interesante. La IA no solo responde preguntas, **puede ejecutar acciones**. Se definen "herramientas" que la IA puede invocar según necesite.

### Ejemplo: Crear un gráfico

```typescript
// /shared/utils/tools/chartLineTool.ts
import { tool } from "ai";
import { z } from "zod";
import type { UIToolInvocation } from "ai";

export type ChartUIToolInvocation = UIToolInvocation<typeof chartLineTool>;

export const chartLineTool = tool({
  description:
    "Create a line chart visualization with one or multiple data series. Use this tool to display time-series data, trends, or comparisons between different metrics over time.",
  inputSchema: z.object({
    title: z.string().optional().describe("Title of the chart"),
    data: z
      .array(z.record(z.string(), z.union([z.string(), z.number()])))
      .min(1)
      .describe(
        "REQUIRED: Array of data points (minimum 1 point). Each object must contain the xKey property and all series keys",
      ),
    xKey: z
      .string()
      .describe(
        'The property name in data objects to use for x-axis values (e.g., "month", "date")',
      ),
    series: z
      .array(
        z.object({
          key: z
            .string()
            .describe(
              "The property name in data objects for this series (must exist in all data points)",
            ),
          name: z
            .string()
            .describe("Display name for this series in the legend"),
          color: z
            .string()
            .describe(
              'Hex color code for this line (e.g., "#3b82f6" for blue, "#10b981" for green)',
            ),
        }),
      )
      .min(1)
      .describe(
        "Array of series configurations (minimum 1 series). Each series represents one line on the chart",
      ),
    xLabel: z.string().optional().describe("Optional label for x-axis"),
    yLabel: z.string().optional().describe("Optional label for y-axis"),
  }),
  execute: async ({ title, data, xKey, series, xLabel, yLabel }) => {
    // Create a delay to simulate the input-available state
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      title,
      data,
      xKey,
      series,
      xLabel,
      yLabel,
    };
  },
});
```

### ¿Cómo funciona?

1. **Descripción clara**: Se le dice a la IA cuándo debe usar esta herramienta
2. **Validación con Zod**: Se definen qué datos se esperan
3. **Ejecución segura**: La función recibe datos validados y retorna el resultado

### Configuración en el endpoint:

```typescript
const result = streamText({
  model,
  system: "Eres un asistente útil...",
  messages,

  // Se registran las herramientas disponibles
  tools: {
    chartLineTool,
    // ... más herramientas
  },

  // Se limitan los pasos para evitar bucles infinitos
  stopWhen: stepCountIs(8),
});
```

---

## Paso 3: La Interfaz de Usuario con Nuxt UI

Para el frontend, no es necesario construir todo desde cero. Se puede aprovechar **Nuxt UI**, una librería de componentes que incluye componentes específicos para chat con IA.

### UChatMessages: el componente estrella

`UChatMessages` es un componente de Nuxt UI que gestiona automáticamente:

- **Renderizado de mensajes**: Muestra texto del usuario y de la IA
- **Indicadores de escritura**: Animación mientras la IA "piensa"
- **Auto-scroll**: Desplazamiento automático a mensajes nuevos
- **Estados de error**: Muestra cuando algo falla

Sin este componente, habría que implementar manualmente toda la lógica de streaming, scroll y formateo de mensajes.

### Código del componente:

```vue
<!-- /app/pages/ia.vue -->
<script setup lang="ts">
import { Chat } from "@ai-sdk/vue";

const messages = ref([]);
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
  <div class="chat-container">
    <!-- Lista de mensajes -->
    <UChatMessages :messages="chat.messages" :status="chat.status">
      <template #content="{ message }">
        <!-- Iterar sobre las partes del mensaje -->
        <template v-for="part in message.parts" :key="part.type">
          <!-- Texto normal -->
          <MDC v-if="part.type === 'text'" :value="part.text" />

          <!-- Gráfico de líneas -->
          <ToolsChartLine
            v-else-if="part.type === 'tool-chartLineTool'"
            :invocation="part"
          />

          <!-- Otros tools... -->
        </template>
      </template>
    </UChatMessages>

    <!-- Input del usuario -->
    <UChatPrompt v-model="input" @submit="onSubmit">
      <UChatPromptSubmit
        :status="chat.status"
        @stop="chat.stop()"
        @reload="chat.regenerate()"
      />
    </UChatPrompt>
  </div>
</template>
```

### ¿Qué hace la clase `Chat`?

El SDK de Vue proporciona una clase `Chat` que maneja todo el estado:

- **`chat.messages`**: Array con el historial de conversación
- **`chat.status`**: Estado actual ('ready', 'streaming', etc.)
- **`chat.sendMessage()`**: Envía un nuevo mensaje
- **`chat.stop()`**: Detiene la generación
- **`chat.regenerate()`**: Reintenta la última respuesta

### UChatPrompt: el input inteligente

Además de `UChatMessages`, se usa `UChatPrompt` que ofrece:

- **Input de texto** con placeholder personalizable
- **Botón de enviar** que se adapta al estado (enviar/stop/regenerar)
- **Manejo de errores**: Muestra mensajes de error del chat
- **Accesibilidad**: Navegación con teclado lista para usar

### Resumen de componentes Nuxt UI utilizados:

| Componente          | Función                            |
| ------------------- | ---------------------------------- |
| `UChatMessages`     | Lista de mensajes con auto-scroll  |
| `UChatPrompt`       | Input de texto con botón de acción |
| `UChatPromptSubmit` | Botón que cambia según el estado   |

Gracias a Nuxt UI, se puede implementar toda la interfaz en menos de 100 líneas de código, sin preocuparse por animaciones, scroll o estados de carga.

---

## Flujo de Funcionamiento

1. **Usuario escribe**: "Muestrame las reservas de este mes en un gráfico"

2. **Frontend envía**: El mensaje va al endpoint `/api/chat`

3. **IA procesa**: Claude recibe el mensaje y decide qué hacer

4. **Tool invocation**: La IA decide llamar a `chartLineTool` para crear el gráfico

5. **Respuesta al usuario**: El frontend recibe el resultado y renderiza el gráfico

---

## Conclusión

Implementar un chat con IA en Nuxt usando Vercel AI Gateway es sorprendentemente sencillo:

1. **Configuras el gateway** una vez
2. **Defines herramientas** para las acciones que necesitas
3. **Usas componentes Vue** que ya manejan el streaming

El resultado es un asistente inteligente que no solo conversa, **actúa**: por ejemplo puede generar gráficos, exportar archivos, enviar emails, etc. Las posibilidades son infinitas.
