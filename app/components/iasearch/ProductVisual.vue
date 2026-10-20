<script setup lang="ts">
withDefaults(defineProps<{ product?: 'band' | 'bar' | 'weights' }>(), { product: 'bar' })
const positions = { band: '2.2% 42.6%', bar: '26.3% 42.6%', weights: '50.4% 42.6%' }
const names = { band: 'Smartband deportiva', bar: 'Barra de pilates', weights: 'Pesas de muñeca' }
</script>

<template>
  <div
    class="product-visual"
    :style="{ backgroundPosition: positions[product] }"
    role="img"
    :aria-label="names[product]"
  />
</template>

<style scoped>
.product-visual { aspect-ratio: 10 / 7; background: #faf9fc url('/images/iasearch/ia-market.png') no-repeat; background-size: 556.5% auto; border-radius: 12px; }
</style>
