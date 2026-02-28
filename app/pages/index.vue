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

const { data: blogArticles } = await useAsyncData("home-blog", () =>
  queryCollection("blog").order("date", "DESC").limit(3).all(),
);

useSeoMeta({
  title: page.value.seo?.title || page.value.title,
  ogTitle: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
  ogDescription: page.value.seo?.description || page.value.description,
});
</script>

<template>
  <div v-if="page" class="relative">
    <div class="hidden lg:block">
      <UColorModeImage
        light="/images/light/line-1.svg"
        dark="/images/dark/line-1.svg"
        class="absolute pointer-events-none pb-10 left-0 top-0 object-cover h-[650px]"
      />
    </div>

    <AppHeroHeader
      :title="page?.title"
      :description="page?.description"
      :image="page?.image"
    >
      <template #background>
        <HeroBackground />
      </template>
    </AppHeroHeader>

    <UPageSection
      id="tech-section"
      :title="page.section.title"
      :description="page.section.description"
      :features="page.section.features"
      orientation="horizontal"
      :ui="{
        container: 'lg:px-0 2xl:px-20 mx-0 max-w-none md:mr-10',
        features: 'gap-0',
      }"
      reverse
    >
      <template #title>
        <MDC :value="page?.section?.title || ''" tag="span" unwrap="p" />
      </template>

      <template #description>
        <p class="text-lg text-muted leading-relaxed text-left">
          {{ page?.section?.description }}
        </p>
      </template>

      <MaskedPreview
        :src="page?.section?.images?.desktop || ''"
        :alt="page?.section?.title"
        mask-src="/mask-code.png"
        wrapper-class="relative place-self-center mt-8 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:mt-0 lg:w-[500px] lg:h-[500px] pt-10"
      />
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="vuenuxt"
      :title="page.vuenuxt.title"
      class="relative overflow-hidden"
      :ui="{
        title: 'text-left',
        description: 'text-left',
      }"
    >
      <div
        class="absolute -right-20 top-1/3 size-[400px] rounded-full bg-primary/10 blur-[150px]"
      />

      <template #headline>
        <div class="flex items-center gap-4">
          <UIcon
            name="i-simple-icons-vuedotjs"
            class="size-10 text-[#4FC08D] transition-transform duration-500 hover:rotate-12"
          />
          <UIcon name="i-lucide-plus" class="size-4 text-muted" />
          <UIcon
            name="i-simple-icons-nuxtdotjs"
            class="size-10 text-[#00DC82] transition-transform duration-500 hover:rotate-12"
          />
        </div>
      </template>

      <template #title>
        <MDC :value="page?.vuenuxt?.title || ''" tag="span" unwrap="p" />
      </template>

      <template #description>
        <p class="text-lg leading-relaxed text-muted">
          {{ page?.vuenuxt?.description }}
        </p>
      </template>

      <UContainer>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(reason, index) in page?.vuenuxt?.reasons"
            :key="index"
            class="vuenuxt-reason group flex flex-col gap-3 rounded-lg border border-default bg-default/50 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
            :style="{ '--vuenuxt-delay': `${index * 100}ms` }"
          >
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20"
            >
              <UIcon :name="reason.icon" class="size-5 text-primary" />
            </div>
            <h4 class="text-lg font-semibold text-highlighted">
              {{ reason.title }}
            </h4>
            <p class="text-sm leading-relaxed text-muted">
              {{ reason.description }}
            </p>
          </div>
        </div>

        <div
          class="mt-10 flex flex-wrap items-center justify-center gap-10 border-t border-default pt-8"
        >
          <div
            v-for="(highlight, index) in page?.vuenuxt?.highlights"
            :key="index"
            class="flex flex-col items-center"
          >
            <span class="text-2xl font-bold text-primary">
              {{ highlight.label }}
            </span>
            <span class="text-xs text-muted">
              {{ highlight.description }}
            </span>
          </div>
        </div>
      </UContainer>
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="ai"
      :title="page.ai.title"
      class="relative overflow-hidden"
      :ui="{
        title: 'text-left @container relative',
        description: 'text-left',
      }"
    >
      <div
        class="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-10 blur-[180px]"
      />
      <div
        class="absolute -left-20 top-20 size-[300px] rounded-full bg-primary/20 blur-[120px] animate-pulse"
      />
      <div
        class="absolute -right-20 bottom-20 size-[250px] rounded-full bg-primary/15 blur-[100px] animate-pulse"
        style="animation-delay: 1s"
      />

      <template #headline>
        <div class="hidden @min-[1020px]:block">
          <UColorModeImage
            light="/images/light/line-2.svg"
            dark="/images/dark/line-2.svg"
            class="absolute top-0 right-0 size-full scale-95 translate-x-[70%]"
          />
        </div>
      </template>

      <template #title>
        <MDC
          :value="page?.ai?.title || ''"
          tag="span"
          unwrap="p"
          class="*:leading-9 *:my-0"
        />
      </template>

      <template #description>
        <div class="w-full!">
          <p class="text-lg leading-relaxed text-muted">
            {{ page?.ai?.description }}
          </p>
        </div>
      </template>

      <UContainer>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AiFeatureCard
            v-for="(feature, index) in page?.ai?.features"
            :key="index"
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
            :delay="index * 120"
          />
        </div>
      </UContainer>
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="blog"
      :title="page.blog.title"
      class="relative overflow-hidden"
      :ui="{
        description: 'text-left sm:text-center',
      }"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-3.svg"
          dark="/images/dark/line-3.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>

      <template #title>
        <MDC :value="page?.blog?.title || ''" tag="span" unwrap="p" />
      </template>

      <template #description>
        <p class="text-lg leading-relaxed text-muted">
          {{ page?.blog?.description }}
        </p>
      </template>

      <UContainer>
        <div
          v-if="blogArticles?.length"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <NuxtLink
            v-for="(article, index) in blogArticles"
            :key="article.path"
            :to="article.path"
            class="blog-card group flex flex-col overflow-hidden rounded-xl border border-default bg-default/50 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            :style="{ '--blog-delay': `${index * 150}ms` }"
          >
            <div class="relative h-40 overflow-hidden bg-elevated">
              <div
                class="absolute inset-0 flex items-center justify-center bg-primary/5"
              >
                <UIcon
                  :name="article.icon || 'i-lucide-file-text'"
                  class="size-14 text-primary/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/50"
                />
              </div>
            </div>

            <div class="flex flex-1 flex-col gap-3 p-5">
              <div class="flex items-center justify-between gap-3">
                <UBadge :label="article.category" variant="subtle" size="sm" />
                <span class="text-xs text-muted">{{ article.date }}</span>
              </div>

              <h3
                class="text-lg font-semibold text-highlighted transition-colors duration-300 group-hover:text-primary"
              >
                {{ article.title }}
              </h3>

              <p class="flex-1 text-sm leading-relaxed text-muted">
                {{ article.description }}
              </p>

              <div
                class="mt-2 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
              >
                Leer más
                <UIcon name="i-lucide-arrow-right" class="size-4" />
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-10 flex justify-center">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 rounded-lg border border-default px-6 py-3 text-sm font-medium text-muted transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-md hover:shadow-primary/5"
          >
            Ver todos los artículos
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </NuxtLink>
        </div>
      </UContainer>
    </UPageSection>

    <USeparator />

    <UPageCTA
      v-bind="page?.cta"
      variant="naked"
      class="overflow-hidden @container"
    >
      <template #headline>
        <div class="@max-[1280px]:hidden">
          <UColorModeImage
            light="/images/light/line-6.svg"
            dark="/images/dark/line-6.svg"
            class="absolute left-10 -top-10 sm:top-0 h-full"
          />
          <UColorModeImage
            light="/images/light/line-7.svg"
            dark="/images/dark/line-7.svg"
            class="absolute right-0 bottom-0 h-full"
          />
        </div>
      </template>

      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
