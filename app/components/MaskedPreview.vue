<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    maskSrc: string;
    wrapperClass?: string;
    maskClass?: string;
    imageClass?: string;
  }>(),
  {
    alt: "",
    wrapperClass:
      "relative place-self-center w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[500px] lg:h-[500px]",
    maskClass:
      "w-full h-full mask-contain mask-no-repeat bg-linear-150 from-primary to-[#eb3505]",
    imageClass:
      "w-[90%] h-[90%] object-contain drop-shadow-[0_0_14px_rgba(227,132,67,0.2)]",
  },
);
</script>

<template>
  <div :class="props.wrapperClass">
    <div :class="['mask-[url(' + props.maskSrc + ')]', props.maskClass]" />
    <div class="absolute inset-0 flex items-center justify-center">
      <img :src="props.src" :alt="props.alt" :class="props.imageClass" />
    </div>
  </div>
</template>
