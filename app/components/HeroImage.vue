<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    sizeClass?: string;
    floating?: boolean;
  }>(),
  {
    sizeClass: "h-44 sm:h-56 lg:h-72",
    floating: true,
  },
);

const classes = computed(() => {
  return [
    props.sizeClass,
    "w-auto object-contain",
    props.floating ? "hero-float" : "",
    "transition-transform transition-filter duration-300 ease-out",
    "hover:-translate-y-1 hover:rotate-1 hover:scale-[1.02]",
    "hover:drop-shadow-[0_0_22px_rgba(227,132,67,0.35)]",
  ]
    .filter(Boolean)
    .join(" ");
});
</script>

<template>
  <img :src="props.src" :alt="props.alt" :class="classes" />
</template>

<style scoped>
@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.hero-float {
  animation: hero-float 6s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-float {
    animation: none;
  }
}
</style>
