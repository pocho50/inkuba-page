<script setup lang="ts">
const colorMode = useColorMode();

// Forzar modo oscuro
colorMode.preference = "dark";
colorMode.value = "dark";

const color = computed(() => "#171717");

useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  ogImage: "https://ui.nuxt.com/assets/templates/nuxt/landing-light.png",
  twitterImage: "https://ui.nuxt.com/assets/templates/nuxt/landing-light.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp :toaster="{ expand: false }">
    <AppHeader />

    <UMain>
      <NuxtPage />
    </UMain>

    <AppFooter />
  </UApp>
</template>
