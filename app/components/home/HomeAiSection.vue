<script setup lang="ts">
import { formatInlineTitle } from "~/utils/formatInlineTitle";

const requestURL = useRequestURL();
const aiVideoSrc = computed(() =>
  new URL("/video/ia-vercel.mp4", requestURL.origin).toString(),
);

defineProps<{
  section: {
    title: string;
    description: string;
    collapsibleLabel?: string;
    features: Array<{ title: string; description: string; icon: string }>;
  };
}>();
</script>

<template>
  <UPageSection
    id="ai"
    :title="section.title"
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
      <span
        class="*:leading-9 *:my-0"
        v-html="formatInlineTitle(section.title)"
      />
    </template>

    <template #description>
      <div class="w-full!">
        <p class="text-lg leading-relaxed text-muted">
          {{ section.description }}
        </p>
      </div>
    </template>

    <UContainer>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AiFeatureCard
          v-for="(feature, index) in section.features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
          :delay="index * 120"
        />
      </div>

      <!-- <UCollapsible
        class="mx-auto mt-10 w-full max-w-6xl rounded-2xl border border-primary/20 bg-linear-to-b from-primary/5 to-transparent p-2 shadow-sm shadow-primary/10"
      >
        <UButton
          :label="
            section.collapsibleLabel ||
            'Ver ejemplo de IA integrada a una aplicación'
          "
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-chevron-down"
          block
          class="justify-between rounded-xl text-sm font-semibold hover:bg-transparent"
        />
        <template #content>
          <div class="mt-3 px-2 pb-2">
            <video
              class="mx-auto w-full rounded-2xl shadow-2xl shadow-black/30"
              controls
              playsinline
              preload="metadata"
            >
              <source :src="aiVideoSrc" type="video/mp4" />
              Tu navegador no soporta video HTML5.
            </video>
          </div>
        </template>
      </UCollapsible> -->
    </UContainer>
  </UPageSection>
</template>
