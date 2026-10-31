<script setup lang="ts">
const colorMode = useColorMode();

// Forzar modo oscuro
colorMode.preference = "dark";
colorMode.value = "dark";

const color = computed(() => "#171717");
const route = useRoute()
const canonicalUrl = computed(() => `https://inkuba.com${route.path}`)

useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    { rel: 'canonical', href: canonicalUrl }
  ],
  htmlAttrs: {
    lang: "es",
  },
});

useSeoMeta({
  ogImage: 'https://inkuba.com/images/inkuba-social.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogImageAlt: 'Inkuba: desarrollamos apps y sitios web. Tecnología e inteligencia artificial para tu negocio',
  twitterImage: 'https://inkuba.com/images/inkuba-social.png',
  twitterImageAlt: 'Inkuba: desarrollamos apps y sitios web. Tecnología e inteligencia artificial para tu negocio',
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
