<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  icon: string;
  delay?: number;
}>();

const cardRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            isVisible.value = true;
          }, props.delay || 0);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  if (cardRef.value) {
    observer.observe(cardRef.value);
  }

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<template>
  <div
    ref="cardRef"
    class="ai-card group relative flex flex-col gap-4 rounded-xl border border-default bg-default/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    :class="isVisible ? 'ai-card--visible' : 'ai-card--hidden'"
  >
    <div
      class="absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    />

    <div class="relative z-10 flex items-center gap-3">
      <div
        class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/20"
      >
        <UIcon :name="icon" class="size-5 text-primary" />
      </div>
      <h3 class="text-lg font-semibold text-highlighted">
        {{ title }}
      </h3>
    </div>

    <p class="relative z-10 text-sm leading-relaxed text-muted">
      {{ description }}
    </p>

    <div
      class="absolute -bottom-px left-1/2 h-px w-0 -translate-x-1/2 bg-linear-to-r from-transparent via-primary to-transparent transition-all duration-500 group-hover:w-3/4"
    />
  </div>
</template>

<style scoped>
.ai-card--hidden {
  opacity: 0;
  transform: translateY(30px);
}

.ai-card--visible {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
