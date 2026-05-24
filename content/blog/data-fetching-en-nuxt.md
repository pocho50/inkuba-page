---
title: "Data Fetching en Nuxt: $fetch, useFetch, useAsyncData y todo lo que necesitás saber"
description: "Aprendé cuándo usar $fetch, useFetch y useAsyncData, qué cambia con await, cómo funciona lazy mode y cómo compartir o refrescar datos con useNuxtData y refreshNuxtData."
date: "2026-05-02"
category: "Nuxt"
draft: true
icon: "i-lucide-cloud-download"
image: ""
---

Una de las dudas más comunes en Nuxt es: **¿cuándo conviene usar `$fetch`, `useFetch` o `useAsyncData`?**

Los tres sirven para obtener datos, pero no resuelven exactamente el mismo problema. Elegir bien evita doble requests, estados inconsistentes y pantallas que cargan más lento de lo necesario.

Vamos directo a lo práctico.

---

## Resumen rápido

| Caso                                             | Usá                           |
| ------------------------------------------------ | ----------------------------- |
| Enviar un formulario, hacer click, guardar datos | `$fetch`                      |
| Cargar datos simples desde una API               | `useFetch`                    |
| Combinar varias requests o transformar datos     | `useAsyncData`                |
| No bloquear la navegación mientras carga         | `lazy: true` / `useLazyFetch` |
| Compartir datos cacheados entre componentes      | `useNuxtData`                 |
| Refrescar datos por key desde cualquier lugar    | `refreshNuxtData`             |

---

## `$fetch`: para requests directas

`$fetch` es el cliente HTTP global de Nuxt, basado en `ofetch`. Lo usás cuando querés hacer una petición directa, especialmente en acciones del usuario.

```ts
async function enviarFormulario() {
  await $fetch("/api/contact", {
    method: "POST",
    body: {
      name: "Juan",
      email: "juan@email.com",
    },
  });
}
```

Es ideal para:

- enviar formularios,
- crear, editar o eliminar recursos,
- ejecutar acciones después de un click,
- llamar APIs desde server routes.

### Ojo con usar `$fetch` para datos iniciales

Si usás `$fetch` directamente en una página renderizada con SSR, Nuxt **no guarda automáticamente esa respuesta en el payload** para reutilizarla en el cliente.

```vue
<script setup lang="ts">
// Evitalo para data inicial de página
const posts = await $fetch("/api/posts");
</script>
```

Para datos que la página necesita renderizar, normalmente conviene `useFetch` o `useAsyncData`.

---

## `useFetch`: para cargar datos desde una URL

`useFetch` es la opción más cómoda cuando querés obtener datos desde una API.

```vue
<script setup lang="ts">
const { data: posts, status, error, refresh } = await useFetch("/api/posts");
</script>

<template>
  <div v-if="status === 'pending'">Cargando...</div>
  <div v-else-if="error">No se pudieron cargar los posts</div>
  <ul v-else>
    <li v-for="post in posts" :key="post.id">
      {{ post.title }}
    </li>
  </ul>
</template>
```

`useFetch` combina dos cosas:

- `$fetch`, para hacer la request,
- `useAsyncData`, para integrarse con SSR, hydration, cache y estado reactivo.

Por eso te devuelve:

```ts
const { data, status, pending, error, refresh, execute, clear } =
  await useFetch("/api/posts");
```

### Query params reactivos

Una ventaja importante es que las opciones pueden ser reactivas:

```vue
<script setup lang="ts">
const page = ref(1);
const search = ref("");

const { data } = await useFetch("/api/posts", {
  query: { page, search },
});
</script>
```

Cuando `page` o `search` cambian, Nuxt vuelve a ejecutar la request.

Si no querés ese comportamiento:

```ts
const { data } = await useFetch("/api/posts", {
  query: { page, search },
  watch: false,
});
```

---

## `useAsyncData`: para lógica más flexible

`useAsyncData` es más general. No está atado a una URL. Recibe una función async y guarda el resultado en el sistema de datos de Nuxt.

Usalo cuando necesitás:

- hacer varias requests en paralelo,
- combinar resultados,
- transformar datos,
- usar una librería que no sea `$fetch`,
- controlar la key manualmente.

```vue
<script setup lang="ts">
const { data, error } = await useAsyncData("dashboard", async () => {
  const [user, stats, notifications] = await Promise.all([
    $fetch("/api/user"),
    $fetch("/api/stats"),
    $fetch("/api/notifications"),
  ]);

  return {
    user,
    stats,
    notifications,
  };
});
</script>
```

La key (`'dashboard'`) es importante porque Nuxt la usa para cache, deduplicación y para acceder luego con `useNuxtData`.

> Regla práctica: si solo vas a pegarle a una URL, `useFetch`. Si necesitás lógica extra, `useAsyncData`.

---

## ¿Con `await` o sin `await`?

Esta diferencia cambia bastante la experiencia de carga.

### Con `await`

```vue
<script setup lang="ts">
const { data } = await useFetch("/api/posts");
</script>
```

La página espera a que la data esté lista antes de renderizar. Es útil cuando:

- la página no tiene sentido sin esos datos,
- el contenido es importante para SEO,
- preferís entregar HTML completo desde el servidor.

### Sin `await`

```vue
<script setup lang="ts">
const { data, status } = useFetch("/api/posts");
</script>
```

La página puede renderizar antes de que termine la request. En ese caso tenés que manejar loading states:

```vue
<template>
  <USkeleton v-if="status === 'pending'" class="h-8 w-full" />
  <PostList v-else :posts="data" />
</template>
```

Esto suele sentirse más rápido cuando podés mostrar skeletons o placeholders.

---

## `lazy: true` y `useLazyFetch`

Por defecto, `useFetch` y `useAsyncData` pueden bloquear la navegación hasta resolver los datos. Si querés que la navegación no espere, usá `lazy: true`.

```ts
const { data, status } = useFetch("/api/posts", {
  lazy: true,
});
```

También podés usar el alias:

```ts
const { data, status } = useLazyFetch("/api/posts");
```

Y para `useAsyncData`:

```ts
const { data } = useLazyAsyncData("posts", () => $fetch("/api/posts"));
```

### `server: false`

Si querés que una request se ejecute **solo en el cliente**, usá `server: false`.

```ts
const { data } = useFetch("/api/private-client-data", {
  server: false,
});
```

Importante: aunque le pongas `await`, si `server: false`, la data no estará disponible durante SSR. Se cargará después de la hydration en el cliente.

---

## Compartir datos con `useNuxtData`

`useNuxtData` permite acceder al valor cacheado de un `useFetch` o `useAsyncData` usando su key.

Primero definís una key explícita:

```vue
<script setup lang="ts">
const { data: posts } = await useFetch("/api/posts", {
  key: "posts",
});
</script>
```

Después, en otro componente o página:

```vue
<script setup lang="ts">
const { data: posts } = useNuxtData("posts");
</script>
```

Esto no hace una request nueva. Solo lee el dato cacheado y lo mantiene reactivo.

Es útil para:

- compartir datos entre componentes,
- usar datos de una lista como placeholder en una página detalle,
- implementar optimistic updates.

Ejemplo de placeholder:

```vue
<script setup lang="ts">
const route = useRoute();
const { data: posts } = useNuxtData("posts");

const { data: post } = useLazyFetch(`/api/posts/${route.params.id}`, {
  key: `post-${route.params.id}`,
  default() {
    return posts.value?.find((post) => post.id === route.params.id);
  },
});
</script>
```

Mientras llega el detalle real, mostrás el post que ya tenías en la lista.

---

## Refrescar datos con `refreshNuxtData`

Cada `useFetch` o `useAsyncData` te devuelve su propio `refresh()`:

```ts
const { data, refresh } = await useFetch("/api/posts", { key: "posts" });

await refresh();
```

Pero si querés refrescar datos desde otro componente, podés usar `refreshNuxtData`.

```ts
await refreshNuxtData("posts");
```

También acepta varias keys:

```ts
await refreshNuxtData(["posts", "user"]);
```

O sin argumentos, refresca todo:

```ts
await refreshNuxtData();
```

Un caso típico: hacés una mutation con `$fetch` y después revalidás la lista.

```ts
async function crearPost() {
  await $fetch("/api/posts", {
    method: "POST",
    body: { title: "Nuevo post" },
  });

  await refreshNuxtData("posts");
}
```

---

## Errores comunes

### 1. Usar `$fetch` para data inicial

```ts
// Evitar para SSR data
const posts = await $fetch("/api/posts");

// Mejor
const { data: posts } = await useFetch("/api/posts");
```

### 2. No usar keys explícitas cuando querés compartir datos

```ts
// Más difícil de reutilizar con useNuxtData
const { data } = await useFetch("/api/posts");

// Mejor
const { data } = await useFetch("/api/posts", { key: "posts" });
```

### 3. No manejar estados de carga y error

```vue
<template>
  <div v-if="status === 'pending'">Cargando...</div>
  <div v-else-if="error">Ocurrió un error</div>
  <div v-else>{{ data }}</div>
</template>
```

### 4. Confundir `refresh()` con `refreshNuxtData()`

- `refresh()` refresca esa instancia puntual.
- `refreshNuxtData('posts')` refresca las instancias registradas con esa key.

---

## Tabla final

| Herramienta       | Cuándo usarla                                              |
| ----------------- | ---------------------------------------------------------- |
| `$fetch`          | Acciones directas: submit, click, mutations, server routes |
| `useFetch`        | Cargar datos desde una URL con soporte SSR/hydration       |
| `useAsyncData`    | Lógica async personalizada o múltiples requests            |
| `useLazyFetch`    | Igual que `useFetch`, pero sin bloquear navegación         |
| `useNuxtData`     | Leer datos cacheados por key                               |
| `refreshNuxtData` | Refrescar datos por key desde cualquier lugar              |

---

## Conclusión

La regla práctica es simple:

- **Para acciones del usuario**, usá `$fetch`.
- **Para cargar datos de una API**, usá `useFetch`.
- **Para lógica más compleja**, usá `useAsyncData`.
- **Para no bloquear la navegación**, usá `lazy: true` o `useLazyFetch`.
- **Para compartir datos cacheados**, usá `useNuxtData` con key explícita.
- **Para revalidar datos globalmente**, usá `refreshNuxtData`.

Con esto cubrís la mayoría de casos reales de data fetching en Nuxt sin tener que memorizar toda la API.
