<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  image?: string;
}>();
</script>

<template>
  <div>
    <div class="hidden lg:block">
      <UColorModeImage
        light="/images/light/line-1.svg"
        dark="/images/dark/line-1.svg"
        class="absolute pointer-events-none pb-10 left-0 top-0 object-cover h-[650px]"
      />
    </div>

    <AppHeroHeader :title="title || ''" :description="description" :image="image">
      <template #background>
        <HeroBackground />
      </template>
    </AppHeroHeader>
  </div>
</template>
