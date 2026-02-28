<script setup lang="ts">
const props = defineProps<{
  title: string;
  description?: string;
  image?: string;
}>();
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <slot name="background" />
    </div>

    <div class="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div
        class="flex lg:flex-row flex-col items-center justify-center lg:gap-10"
      >
        <div v-if="props.image" class="flex justify-center lg:justify-end">
          <HeroImage :src="props.image" :alt="props.title" />
        </div>
        <div class="text-center lg:text-left max-w-[600px]">
          <MDC
            :value="props.title"
            unwrap="p"
            tag="h1"
            class="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:mx-0 lg:text-6xl [&_p]:m-0"
          />

          <p
            v-if="props.description"
            class="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg lg:mx-0"
          >
            {{ props.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
