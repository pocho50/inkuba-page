<script setup lang="ts">
const route = useRoute();

const items = [
  {
    label: "Inicio",
    to: "/",
    path: "/",
  },
  {
    label: "Blog",
    to: "/blog",
    path: "/blog",
  },
  {
    label: "Contacto",
    to: "/#contact",
    path: "/",
    hash: "#contact",
  },
];

const isActive = (item: { path: string; hash?: string }) => {
  if (item.hash) {
    return route.path === item.path && route.hash === item.hash;
  }

  return route.path === item.path && !route.hash;
};
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-12 shrink-0" />
      </NuxtLink>
    </template>

    <template #right>
      <nav class="hidden items-center gap-6 lg:flex">
        <NuxtLink
          v-for="item in items"
          :key="item.label"
          :to="item.to"
          class="text-sm transition-colors"
          :class="
            isActive(item)
              ? 'text-primary font-medium'
              : 'text-muted hover:text-highlighted'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </template>

    <template #body>
      <nav class="-mx-2.5 flex flex-col gap-1">
        <NuxtLink
          v-for="item in items"
          :key="`mobile-${item.label}`"
          :to="item.to"
          class="rounded-md px-2.5 py-2 text-sm transition-colors"
          :class="
            isActive(item)
              ? 'text-primary bg-primary/10 font-medium'
              : 'text-muted hover:text-highlighted hover:bg-muted/40'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </template>
  </UHeader>
</template>
