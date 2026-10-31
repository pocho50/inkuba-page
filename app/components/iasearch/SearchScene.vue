<script setup lang="ts">
import ProductVisual from "./ProductVisual.vue";

const props = defineProps<{ playOnView?: boolean }>();

const scene = ref<HTMLElement | null>(null);
const paused = ref(props.playOnView);
let observer: IntersectionObserver | undefined;

onMounted(() => {
  if (!paused.value || !scene.value) return;
  if (!("IntersectionObserver" in window)) {
    paused.value = false;
    return;
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      paused.value = false;
      observer?.disconnect();
    },
    { threshold: 0.35 },
  );
  observer.observe(scene.value);
});

onBeforeUnmount(() => observer?.disconnect());

const products = [
  {
    name: "Smartband deportiva",
    detail: "Actividad diaria",
    image: "band" as const,
  },
  {
    name: "Barra de pilates",
    detail: "Entrenamiento en casa",
    image: "bar" as const,
  },
  {
    name: "Pesas de muñeca",
    detail: "Pilates y yoga",
    image: "weights" as const,
  },
];
</script>

<template>
  <figure ref="scene" class="scene" :class="{ 'is-paused': paused }">
    <div class="scene-bar">
      <span class="scene-brand"
        ><UIcon name="i-lucide-sparkles" aria-hidden="true" /> IA Search</span
      >
      <span class="scene-caption">Tu catálogo, en conversación</span>
    </div>
    <div class="conversation">
      <div class="query">
        <UIcon name="i-lucide-search" aria-hidden="true" />
        <p>Busco un regalo para mi hermana. Le gusta entrenar en casa.</p>
      </div>
      <div class="answer">
        <span class="assistant-icon"
          ><UIcon name="i-lucide-sparkles" aria-hidden="true"
        /></span>
        <div class="answer-body">
          <span class="thinking" aria-hidden="true"><i /><i /><i /></span>
          <p>
            Un regalo que siga su ritmo.<br /><span
              >Estas opciones pueden acompañarla en su próxima rutina.</span
            >
          </p>
        </div>
      </div>
      <div class="products">
        <div
          v-for="(product, index) in products"
          :key="product.name"
          class="product"
          :style="{ '--i': index }"
        >
          <div class="product-media">
            <ProductVisual :product="product.image" />
          </div>
          <div class="product-copy">
            <strong class="product-name">{{ product.name }}</strong>
            <p>{{ product.detail }}</p>
            <span class="product-action" aria-hidden="true">
              Ver detalles
              <UIcon name="i-lucide-arrow-right" />
            </span>
          </div>
        </div>
      </div>
      <div class="follow-up">
        <UIcon name="i-lucide-message-circle" aria-hidden="true" /><span
          >¿Preferís algo para pilates o para una rutina más intensa?</span
        >
      </div>
    </div>
  </figure>
</template>

<style scoped>
.scene {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  margin: 0;
  border: 1px solid #e7dacd;
  border-radius: 20px;
  background: #f8f5ef;
  color: #29251f;
  box-shadow:
    0 24px 70px #0003,
    0 2px 0 #fff inset;
  overflow: hidden;
  text-align: left;
}
.scene-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 16px 20px;
  border-bottom: 1px solid #ded7ce;
  background: linear-gradient(180deg, #fbf9f5, #f5f1ea);
}
.scene-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 650;
  color: #29251f;
}
.scene-brand .iconify {
  color: #e38443;
}
.scene-caption {
  font-size: 13px;
  color: #635b53;
}
.conversation {
  padding: 16px;
}
.query {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 580px;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #e6bea0;
  border-radius: 14px 14px 3px 14px;
  background: #f2d4bb;
  color: #422b1b;
  transform-origin: right bottom;
  animation: bubble-in 0.6s var(--ease-out) 0.5s both;
}
.query .iconify,
.follow-up .iconify {
  flex-shrink: 0;
  font-size: 20px;
}
.query p,
.answer p {
  margin: 0;
  line-height: 1.6;
}
.answer {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin: 16px 0;
  color: #29251f;
  font-size: 16px;
}
.answer-body {
  position: relative;
  min-width: 0;
}
.answer p {
  animation: fade-up 0.6s var(--ease-out) 2s both;
}
.answer p span {
  color: #635b53;
  font-size: 15px;
}
.assistant-icon {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #e9dfd1;
  color: #71401e;
  animation:
    fade-up 0.5s var(--ease-out) 1.1s both,
    thinking-ring 1s ease-out 1.2s 2;
}
.thinking {
  position: absolute;
  top: 6px;
  left: 0;
  display: flex;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 12px;
  background: #ece4d8;
  animation: thinking 1s ease 1.1s both;
}
.thinking i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9c7a5d;
  animation: dot 0.9s ease-in-out infinite;
}
.thinking i:nth-child(2) {
  animation-delay: 0.15s;
}
.thinking i:nth-child(3) {
  animation-delay: 0.3s;
}
.products {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.product {
  display: flex;
  flex-direction: column;
  border: 1px solid #e6dfd6;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  animation: card-in 0.7s var(--ease-out) calc(2.3s + var(--i) * 0.15s) both;
  transition:
    translate 0.3s var(--ease-out),
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.product-media {
  overflow: hidden;
}
.product-media > .product-visual {
  transition: transform 0.5s var(--ease-out);
}
@media (hover: hover) {
  .product:hover {
    translate: 0 -4px;
    border-color: #e6bea0;
    box-shadow: 0 14px 28px #57402c1f;
  }
  .product:hover .product-visual {
    transform: scale(1.06);
  }
}
.product-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px;
}
.product-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: auto;
  padding: 8px 12px;
  border: 1px solid #e6bea0;
  border-radius: 8px;
  background: #fbefe5;
  color: #854c26;
  font-size: 14px;
  font-weight: 600;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}
.product-action .iconify {
  flex-shrink: 0;
  transition: transform 0.3s var(--ease-out);
}
@media (hover: hover) {
  .product:hover .product-action {
    background: #e38443;
    border-color: #e38443;
    color: #fff;
  }
  .product:hover .product-action .iconify {
    transform: translateX(3px);
  }
}
.product .product-name {
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
  margin: 0 0 8px;
  color: #29251f;
}
.product p {
  font-size: 15px;
  line-height: 1.6;
  color: #635b53;
  margin: 0 0 12px;
}
.follow-up {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #635b53;
  font-size: 15px;
  line-height: 1.5;
  margin-top: 14px;
  animation: fade-up 0.6s var(--ease-out) 3s both;
}
.follow-up .iconify {
  color: #854c26;
}
.scene.is-paused *,
.scene.is-paused *::before,
.scene.is-paused *::after {
  animation-play-state: paused;
}

@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes thinking {
  0% {
    opacity: 0;
    transform: translateY(6px);
  }
  15%,
  80% {
    opacity: 1;
    transform: none;
  }
  100% {
    opacity: 0;
    transform: none;
  }
}
@keyframes dot {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
@keyframes thinking-ring {
  from {
    box-shadow: 0 0 0 0 #e3844366;
  }
  to {
    box-shadow: 0 0 0 10px #e3844300;
  }
}

@media (max-width: 640px) {
  .scene-bar {
    padding: 16px;
  }
  .scene-caption {
    display: none;
  }
  .conversation {
    padding: 18px;
  }
  .query {
    padding: 14px;
  }
  .products {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .product {
    display: grid;
    grid-template-columns: 105px 1fr;
    align-items: center;
  }
  .product-copy {
    padding: 14px;
  }
  .follow-up {
    align-items: flex-start;
    line-height: 1.6;
  }
}
@media (prefers-reduced-motion: reduce) {
  .scene *,
  .scene *::before,
  .scene *::after {
    animation: none !important;
    transition: none !important;
  }
  .thinking {
    display: none;
  }
}
</style>
