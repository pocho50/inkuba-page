<script setup lang="ts">
import { formatInlineTitle } from "~/utils/formatInlineTitle";

defineProps<{
  section: {
    title: string;
    description: string;
    reasons: Array<{ title: string; description: string; icon: string }>;
    highlights: Array<{ label: string; description: string }>;
  };
}>();
</script>

<template>
  <UPageSection
    id="vuenuxt"
    :title="section.title"
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
      <span v-html="formatInlineTitle(section.title)" />
    </template>

    <template #description>
      <p class="text-lg leading-relaxed text-muted">
        {{ section.description }}
      </p>
    </template>

    <UContainer>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(reason, index) in section.reasons"
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
          v-for="(highlight, index) in section.highlights"
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
</template>
