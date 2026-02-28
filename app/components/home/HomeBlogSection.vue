<script setup lang="ts">
import { formatInlineTitle } from "~/utils/formatInlineTitle";

defineProps<{
  section: {
    title: string;
    description: string;
    readMoreLabel: string;
    viewAllLabel: string;
    viewAllTo: string;
  };
  articles: Array<{
    path: string;
    category: string;
    date: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}>();
</script>

<template>
  <UPageSection
    id="blog"
    :title="section.title"
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
      <span v-html="formatInlineTitle(section.title)" />
    </template>

    <template #description>
      <p class="text-lg leading-relaxed text-muted">
        {{ section.description }}
      </p>
    </template>

    <UContainer>
      <div
        v-if="articles?.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="(article, index) in articles"
          :key="article.path"
          :to="article.path"
          class="blog-card group flex flex-col overflow-hidden rounded-xl border border-default bg-default/50 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          :style="{ '--blog-delay': `${index * 150}ms` }"
        >
          <div class="relative h-40 overflow-hidden bg-elevated">
            <div class="absolute inset-0 flex items-center justify-center bg-primary/5">
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
              {{ section.readMoreLabel }}
              <UIcon name="i-lucide-arrow-right" class="size-4" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-10 flex justify-center">
        <NuxtLink
          :to="section.viewAllTo"
          class="inline-flex items-center gap-2 rounded-lg border border-default px-6 py-3 text-sm font-medium text-muted transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-md hover:shadow-primary/5"
        >
          {{ section.viewAllLabel }}
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </NuxtLink>
      </div>
    </UContainer>
  </UPageSection>
</template>
