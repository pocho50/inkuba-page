<script setup lang="ts">
import { formatInlineTitle } from "~/utils/formatInlineTitle";
import SearchScene from "~/components/iasearch/SearchScene.vue";

const props = defineProps<{
  section: {
    headline?: string;
    title: string;
    description: string;
    features: Array<{ title: string; description: string; icon: string }>;
    link: { label: string; to: string };
  };
}>();

const links = computed(() => [
  {
    label: props.section.link.label,
    to: props.section.link.to,
    trailingIcon: "i-lucide-arrow-right",
    size: "xl" as const,
  },
]);
</script>

<template>
  <UPageSection
    id="ia-search"
    :headline="section.headline"
    :title="section.title"
    :description="section.description"
    :features="section.features"
    :links="links"
    orientation="horizontal"
    class="relative overflow-hidden"
    :ui="{
      title: 'text-left',
      description: 'text-left',
    }"
  >
    <div
      class="absolute -right-24 top-1/4 size-[420px] rounded-full bg-primary/15 blur-[150px]"
    />

    <template #title>
      <span v-html="formatInlineTitle(section.title)" />
    </template>

    <template #description>
      <p class="text-lg leading-relaxed text-muted">
        {{ section.description }}
      </p>
    </template>

    <div class="relative isolate">
      <div
        class="absolute inset-x-4 inset-y-8 -z-10 -rotate-3 rounded-3xl border border-primary/40 bg-linear-to-br from-primary/40 to-primary/5"
      />
      <SearchScene play-on-view />
    </div>
  </UPageSection>
</template>
