<script setup lang="ts">
const route = useRoute();
const { data: article } = await useAsyncData(route.path, () =>
  queryCollection("blog").path(route.path).first(),
);

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Artículo no encontrado",
    fatal: true,
  });
}

useSeoMeta({
  title: article.value.title,
  ogTitle: article.value.title,
  description: article.value.description,
  ogDescription: article.value.description,
});
</script>

<template>
  <div class="relative">
    <div
      class="absolute left-1/2 top-0 size-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-[180px]"
    />

    <UContainer class="relative py-12 sm:py-20">
      <div class="mb-8">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-200 hover:text-primary"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4" />
          Volver al blog
        </NuxtLink>
      </div>

      <article class="mx-auto max-w-3xl">
        <header class="mb-10">
          <div class="mb-4 flex items-center gap-3">
            <UBadge
              v-if="article?.category"
              :label="article.category"
              variant="subtle"
              size="sm"
            />
            <span v-if="article?.date" class="text-xs text-muted">
              {{ article.date }}
            </span>
          </div>

          <h1
            class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl lg:text-5xl"
          >
            {{ article?.title }}
          </h1>

          <p
            v-if="article?.description"
            class="mt-4 text-lg leading-relaxed text-muted"
          >
            {{ article.description }}
          </p>

          <USeparator class="mt-8" :ui="{ border: 'border-primary/20' }" />
        </header>

        <div class="prose prose-primary dark:prose-invert max-w-none">
          <ContentRenderer v-if="article" :value="article" />
        </div>

        <USeparator class="mt-12" :ui="{ border: 'border-primary/20' }" />

        <div class="mt-8 flex justify-center">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 rounded-lg border border-default px-5 py-2.5 text-sm font-medium text-muted transition-all duration-300 hover:border-primary/40 hover:text-primary"
          >
            <UIcon name="i-lucide-arrow-left" class="size-4" />
            Ver todos los artículos
          </NuxtLink>
        </div>
      </article>
    </UContainer>
  </div>
</template>
