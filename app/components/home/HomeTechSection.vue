<script setup lang="ts">
import { formatInlineTitle } from "~/utils/formatInlineTitle";

defineProps<{
  section: {
    title: string;
    description: string;
    features: any[];
    images?: {
      desktop?: string;
    };
  };
}>();
</script>

<template>
  <UPageSection
    id="tech-section"
    :title="section.title"
    :description="section.description"
    :features="section.features"
    orientation="horizontal"
    :ui="{
      container: 'lg:px-0 2xl:px-20 mx-0 max-w-none md:mr-10',
      features: 'gap-0',
    }"
    reverse
  >
    <template #title>
      <span v-html="formatInlineTitle(section.title)" />
    </template>

    <template #description>
      <p class="text-lg text-muted leading-relaxed text-left">
        {{ section.description }}
      </p>
    </template>

    <MaskedPreview
      :src="section.images?.desktop || ''"
      :alt="section.title"
      mask-src="/mask-code.png"
      wrapper-class="relative place-self-center mt-8 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:mt-0 lg:w-[500px] lg:h-[500px] pt-10"
    />
  </UPageSection>
</template>
