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
    <div class="hidden lg:block">
      <UColorModeImage
        light="/images/light/line-1.svg"
        dark="/images/dark/line-1.svg"
        class="absolute pointer-events-none pb-10 left-0 top-0 object-cover h-[650px]"
      />
    </div>

    <AppHeroHeader
      :title="page.title"
      :description="page.description"
      :image="page.image"
    >
      <template #background>
        <HeroBackground />
      </template>
    </AppHeroHeader>

    <UPageSection
      id="tech-section"
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
        <MDC :value="page.section.title" class="sm:*:leading-11" />
      </template>

      <template #description>
        <p class="text-lg text-muted leading-relaxed">
          {{ page.section.description }}
        </p>
      </template>

      <MaskedPreview
        :src="page.section.images.desktop || ''"
        :alt="page.section.title"
        mask-src="/mask-code.png"
        wrapper-class="relative place-self-center mt-8 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:mt-0 lg:w-[500px] lg:h-[500px] pt-10"
      />
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="ai"
      class="relative overflow-hidden"
      :ui="{
        title: 'text-left @container relative',
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

      <template #title>
        <MDC :value="page.ai.title" class="*:leading-9 *:my-0" />

        <div class="hidden @min-[1020px]:block">
          <UColorModeImage
            light="/images/light/line-2.svg"
            dark="/images/dark/line-2.svg"
            class="absolute top-0 right-0 size-full scale-95 translate-x-[70%]"
          />
        </div>
      </template>

      <template #description>
        <div class="w-full!">
          <p class="text-lg leading-relaxed text-muted">
            {{ page.ai.description }}
          </p>
        </div>
      </template>

      <UContainer>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AiFeatureCard
            v-for="(feature, index) in page.ai.features"
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
      :description="page.blog.description"
      class="relative overflow-hidden"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-3.svg"
          dark="/images/dark/line-3.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>
      <template #title>
        <MDC :value="page.blog.title" />
      </template>

      <template #features>
        <UPageCard
          v-for="(article, index) in page.blog.articles"
          :key="index"
          :to="article.to"
          class="group blog-card"
          :style="{ '--blog-delay': `${index * 150}ms` }"
          :ui="{
            container: 'p-5 sm:p-6',
            title: 'flex items-center gap-2',
          }"
        >
          <div class="flex items-center justify-between gap-3">
            <UBadge :label="article.category" variant="subtle" size="sm" />
            <span class="text-xs text-muted">{{ article.date }}</span>
          </div>

          <div class="mt-4 flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20"
            >
              <UIcon :name="article.icon" class="size-5 text-primary" />
            </div>
            <div class="flex flex-col gap-2">
              <span
                class="text-lg font-semibold text-highlighted transition-colors duration-300 group-hover:text-primary"
              >
                {{ article.title }}
              </span>
              <span class="text-sm leading-relaxed text-muted">
                {{ article.description }}
              </span>
            </div>
          </div>

          <div
            class="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
          >
            Leer más
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </div>
        </UPageCard>
      </template>
    </UPageSection>

    <UPageSection
      id="testimonials"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
      :items="page.testimonials.items"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-5.svg"
          dark="/images/dark/line-5.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>
      <template #title>
        <MDC :value="page.testimonials.title" />
      </template>

      <UContainer>
        <UPageColumns class="xl:columns-3">
          <UPageCard
            v-for="(testimonial, index) in page.testimonials.items"
            :key="index"
            variant="subtle"
            :description="testimonial.quote"
            :ui="{
              description:
                'before:content-[open-quote] after:content-[close-quote]',
            }"
          >
            <template #footer>
              <UUser v-bind="testimonial.user" size="xl" />
            </template>
          </UPageCard>
        </UPageColumns>
      </UContainer>
    </UPageSection>

    <USeparator />

    <UPageCTA
      v-bind="page.cta"
      variant="naked"
      class="overflow-hidden @container"
    >
      <template #title>
        <MDC :value="page.cta.title" />

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
