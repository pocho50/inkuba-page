<script setup lang="ts">
const { data: page } = await useAsyncData("index", () =>
  queryCollection("content").first(),
);
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value.seo?.title || page.value.title,
  ogTitle: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
  ogDescription: page.value.seo?.description || page.value.description,
});
</script>

<template>
  <div v-if="page" class="relative">
    <HomeHeroSection
      :title="page.title"
      :description="page.description"
      :image="page.image"
    />

    <HomeTechSection :section="page.section" />

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <HomeVueNuxtSection :section="page.vuenuxt" />

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <HomeAiSection :section="page.ai" />

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <HomeBlogSection :section="page.blog" />

    <USeparator />

    <HomeCtaSection :cta="page.cta" />
  </div>
</template>
