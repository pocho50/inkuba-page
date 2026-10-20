<script setup lang="ts">
const route = useRoute();
const { open: openContactModal } = useContactModal();

const isMenuOpen = ref(false);

const items = [
  {
    label: "Inicio",
    to: "/",
  },
  {
    label: "IA Search",
    to: "/ia-search",
  },
  {
    label: "Blog",
    to: "/blog",
  },
];

const isActive = (item: { to: string }) =>
  route.path === item.to && !route.hash;

const onContactClick = () => {
  isMenuOpen.value = false;
  openContactModal();
};
</script>

<template>
  <UHeader v-model:open="isMenuOpen">
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
        <button
          type="button"
          class="cursor-pointer text-sm text-muted transition-colors hover:text-highlighted"
          @click="onContactClick"
        >
          Contacto
        </button>
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
        <button
          type="button"
          class="cursor-pointer rounded-md px-2.5 py-2 text-left text-sm text-muted transition-colors hover:bg-muted/40 hover:text-highlighted"
          @click="onContactClick"
        >
          Contacto
        </button>
      </nav>
    </template>
  </UHeader>
</template>
