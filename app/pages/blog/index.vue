<script setup lang="ts">
const { data: articles } = await useAsyncData("blog-list", () =>
  queryCollection("blog").order("date", "DESC").all(),
);

useSeoMeta({
  title: "Blog | Inkuba",
  ogTitle: "Blog | Inkuba",
  description:
    "Exploramos tendencias, compartimos conocimiento y documentamos nuestro camino en el desarrollo de software y la inteligencia artificial.",
  ogDescription:
    "Exploramos tendencias, compartimos conocimiento y documentamos nuestro camino en el desarrollo de software y la inteligencia artificial.",
});
</script>

<template>
  <div class="relative">
    <div
      class="absolute left-1/2 top-0 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[200px]"
    />

    <UContainer class="relative py-16 sm:py-24">
      <div class="mb-12 text-center">
        <h1
          class="blog-hero text-4xl font-bold tracking-tight text-highlighted sm:text-5xl"
        >
          Nuestro <span class="text-primary">Blog</span>
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Exploramos tendencias, compartimos conocimiento y documentamos nuestro
          camino en el desarrollo de software y la inteligencia artificial.
        </p>
      </div>

      <div
        v-if="articles?.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="(article, index) in articles"
          :key="article.path"
          :to="article.path"
          class="blog-list-card group flex flex-col overflow-hidden rounded-xl border border-default bg-default/50 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          :style="{ '--blog-list-delay': `${index * 100}ms` }"
        >
          <div
            class="relative h-48 overflow-hidden bg-elevated"
          >
            <div
              class="absolute inset-0 flex items-center justify-center bg-primary/5"
            >
              <UIcon
                :name="article.icon || 'i-lucide-file-text'"
                class="size-16 text-primary/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/50"
              />
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-3 p-5">
            <div class="flex items-center justify-between gap-3">
              <UBadge
                :label="article.category"
                variant="subtle"
                size="sm"
              />
              <span class="text-xs text-muted">{{ article.date }}</span>
            </div>

            <h2
              class="text-lg font-semibold text-highlighted transition-colors duration-300 group-hover:text-primary"
            >
              {{ article.title }}
            </h2>

            <p class="flex-1 text-sm leading-relaxed text-muted">
              {{ article.description }}
            </p>

            <div
              class="mt-2 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
            >
              Leer artículo
              <UIcon name="i-lucide-arrow-right" class="size-4" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-20 text-center">
        <UIcon name="i-lucide-notebook-pen" class="mx-auto size-12 text-muted" />
        <p class="mt-4 text-lg text-muted">
          Próximamente publicaremos nuevos artículos.
        </p>
      </div>
    </UContainer>
  </div>
</template>
