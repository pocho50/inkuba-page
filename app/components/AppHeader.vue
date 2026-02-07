<script setup lang="ts">
const items = [
  {
    label: "Inicio",
    to: "/",
  },
  {
    label: "Blog",
    to: "/blog",
  },
  {
    label: "Contacto",
    to: "/#cta",
  },
];
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-12 shrink-0" />
      </NuxtLink>
    </template>

    <template #right>
      <UNavigationMenu :items="items" variant="link" class="hidden lg:block" />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
