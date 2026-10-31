<script setup lang="ts">
import SearchScene from "~/components/iasearch/SearchScene.vue";
import ProductVisual from "~/components/iasearch/ProductVisual.vue";

useHead({ htmlAttrs: { lang: "es" } });
useSeoMeta({
  title: "Buscador de productos con IA para Ecommerce | Inkuba",
  description:
    "Transformá la búsqueda de tu tienda online con IA. Entendé lo que buscan tus clientes, recomendá productos relevantes y generá oportunidades de venta.",
  ogTitle: "IA Search · Búsqueda inteligente para tu ecommerce",
  ogDescription:
    "Ayudá a tus clientes a encontrar lo que necesitan. Conocé IA Search de Inkuba.",
});

const landing = ref<HTMLElement | null>(null);
useScrollReveal(landing);

const { open: openContactModal } = useContactModal();

const steps = [
  {
    number: "01",
    title: "Conocemos tu negocio",
    text: "Conversamos sobre tu catálogo, tus clientes y las consultas que recibís.",
  },
  {
    number: "02",
    title: "Definimos la experiencia",
    text: "Evaluamos los datos disponibles y el alcance de la integración en tu sitio.",
  },
  {
    number: "03",
    title: "Probamos con vos",
    text: "Revisamos búsquedas y respuestas para ajustar la experiencia antes de publicarla.",
  },
];
const faqs = [
  {
    question: "¿Es un buscador o un asistente?",
    answer:
      "La propuesta reúne ambos: descubrir productos a partir de una necesidad y continuar la conversación para orientar la elección.",
  },
  {
    question: "¿Se puede usar con mi catálogo?",
    answer:
      "En la demo revisamos cómo está organizado tu catálogo y qué información tenés disponible. Con eso podemos definir el alcance y los pasos de integración para tu negocio.",
  },
  {
    question: "¿Qué vamos a ver en la demo?",
    answer:
      "Recorremos la experiencia de búsqueda, conversamos sobre tus casos de uso y evaluamos cómo podría adaptarse a tu sitio. IA Search está en desarrollo: el alcance se define con cada proyecto.",
  },
];
const cta = {
  title: "Conocé IA Search en una demo",
  description:
    "Descubrí cómo funciona la búsqueda inteligente y las recomendaciones de productos para tu tienda.",
  buttonLabel: "Solicitar una demo",
  modal: {
    title: "Conocé IA Search",
    description:
      "Dejanos tus datos y contanos sobre tu negocio para coordinar una demo.",
  },
  form: {
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Email",
    emailPlaceholder: "vos@tuempresa.com",
    projectLabel: "Tu negocio",
    projectPlaceholder:
      "¿Qué productos vendés? Si tenés un sitio, compartinos el enlace.",
    cancelLabel: "Cancelar",
    submitLabel: "Solicitar una demo",
  },
  successToast: {
    title: "Solicitud recibida",
    description:
      "Gracias por tu interés en IA Search. Te contactaremos para coordinar la demo.",
  },
  errorToast: {
    title: "No pudimos enviar tu solicitud",
    description: "Por favor, intentá nuevamente en unos minutos.",
  },
};
</script>

<template>
  <div ref="landing" class="ia-landing">
    <section class="hero" aria-labelledby="ia-title">
      <HeroBackground
        class="hero-top-glow pointer-events-none"
        aria-hidden="true"
      />
      <div class="hero-orb" aria-hidden="true" />
      <div class="wrap hero-layout">
        <div class="hero-copy">
          <h1 id="ia-title" class="hero-in" style="--d: 0ms">
            Buscador de productos con IA <span>para ecommerce</span>
          </h1>
          <p class="hero-description hero-in" style="--d: 90ms">
            Tus clientes encuentran lo que necesitan, sin esfuerzo.
          </p>
          <div class="hero-actions hero-in" style="--d: 270ms">
            <button
              type="button"
              class="primary-link"
              @click="openContactModal"
            >
              Solicitar una demo
              <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
            </button>
          </div>
          <p class="hero-note hero-in" style="--d: 360ms">
            Búsqueda inteligente y recomendaciones para tu ecommerce.
          </p>
        </div>
        <div class="hero-product">
          <div class="product-callout">
            <UIcon name="i-lucide-sparkles" aria-hidden="true" />
            <span>Entiende búsquedas complejas</span>
          </div>
          <div class="window-label">
            <UBadge
              color="primary"
              variant="solid"
              size="lg"
              class="rounded-full bg-primary text-white"
            >
              Búsqueda inteligente en tu tienda
            </UBadge>
          </div>
          <SearchScene />
          <div class="product-result-note">
            <span class="result-icon"
              ><UIcon name="i-lucide-check" aria-hidden="true"
            /></span>
            <span>Sugiere productos relevantes</span>
            <UIcon name="i-lucide-move-up-right" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>

    <section
      id="beneficios"
      class="wrap benefits section-space"
      aria-labelledby="benefits-title"
    >
      <header class="section-heading" data-reveal>
        <div>
          <p class="eyebrow">IA SEARCH PARA TU ECOMMERCE</p>
          <h2 id="benefits-title">
            Entiende lo que buscan.<br /><span
              >Recomienda lo que necesitan.</span
            >
          </h2>
        </div>
        <p>
          Búsquedas en lenguaje natural, productos relevantes y nuevas
          oportunidades de venta.
        </p>
      </header>
      <div class="benefit-grid">
        <article class="benefit understanding" data-reveal>
          <div class="benefit-copy">
            <span class="chapter"
              ><span class="chapter-icon"
                ><UIcon name="i-lucide-search" aria-hidden="true"
              /></span>
              BÚSQUEDA SEMÁNTICA</span
            >
            <h3>Entiende búsquedas complejas</h3>
            <p>En lenguaje natural, como si hablaras con una persona.</p>
          </div>
          <figure class="intent-scene">
            <div class="query-bubble">
              <UIcon name="i-lucide-search" aria-hidden="true" />
              <p>
                “Busco un regalo para mi hermana. Le gusta entrenar en casa.”
              </p>
            </div>
            <div class="intent-line" aria-hidden="true" />
            <div class="intent-tags">
              <span style="--i: 0">Un regalo</span
              ><span style="--i: 1">Entrenamiento</span
              ><span style="--i: 2">En casa</span>
            </div>
          </figure>
        </article>
        <article
          class="benefit recommendations"
          data-reveal
          style="--delay: 120ms"
        >
          <div class="benefit-copy">
            <span class="chapter"
              ><span class="chapter-icon"
                ><UIcon name="i-lucide-sparkles" aria-hidden="true"
              /></span>
              RECOMENDACIONES INTELIGENTES</span
            >
            <h3>Sugiere productos relevantes</h3>
            <p>Analiza tu catálogo y encuentra las mejores opciones.</p>
          </div>
          <figure class="recommend-scene">
            <div class="recommend-products">
              <div style="--i: 0">
                <ProductVisual product="bar" /><strong>Barra de pilates</strong
                ><span>Para entrenar en casa</span>
              </div>
              <div style="--i: 1">
                <ProductVisual product="weights" /><strong
                  >Pesas de muñeca</strong
                ><span>Para su rutina</span>
              </div>
            </div>
          </figure>
        </article>
        <article class="benefit opportunities" data-reveal>
          <div class="benefit-copy">
            <span class="chapter"
              ><span class="chapter-icon"
                ><UIcon name="i-lucide-users-round" aria-hidden="true"
              /></span>
              CAPTACIÓN DE LEADS</span
            >
            <h3>Capta leads</h3>
            <p>
              La IA solicita nombre, email y WhatsApp para que tu equipo de
              ventas contacte a los interesados y continúe la conversación.
            </p>
          </div>
          <div
            class="contact-scene"
            aria-label="Conversación de captación de leads"
          >
            <div class="customer-message chat-step" style="--i: 0">
              <span class="speaker-label">CLIENTE</span>
              <p>
                Me interesa equipar mi gimnasio. ¿Puede contactarme un asesor?
              </p>
            </div>
            <div class="contact-intent chat-step" style="--i: 1">
              <span class="contact-icon"
                ><UIcon name="i-lucide-sparkles" aria-hidden="true"
              /></span>
              <div>
                <strong>IA Search</strong>
                <p>
                  ¡Claro! Pasame tu nombre, email y WhatsApp para que te
                  contacte un asesor.
                </p>
              </div>
            </div>
            <div
              class="customer-message lead-response chat-step"
              style="--i: 2"
            >
              <span class="speaker-label">CLIENTE</span>
              <p>
                Soy Sofía. Mi email es
                <span class="contact-value">sofia@example.com</span> y mi
                WhatsApp es
                <span class="contact-value">+54 9 11 XXXX XXXX</span>.
              </p>
            </div>
            <p class="lead-handoff chat-step" style="--i: 3">
              <UIcon name="i-lucide-user-round-check" aria-hidden="true" />
              Datos de contacto e interés de compra para tu equipo de ventas.
            </p>
          </div>
        </article>
      </div>
    </section>

    <section
      class="wrap integrations section-space"
      aria-labelledby="integrations-title"
    >
      <header class="section-heading" data-reveal>
        <div>
          <p class="eyebrow">INTEGRACIÓN SIMPLE</p>
          <h2 id="integrations-title">
            Tu plataforma,<br /><span>nuestra integración.</span>
          </h2>
        </div>
        <p>
          Sumá IA Search a cualquier ecommerce de forma sencilla. No importa qué
          tecnología use tu tienda. Nos adaptamos a ella para que puedas empezar
          sin complicaciones.
        </p>
      </header>
      <ul
        class="platform-list"
        aria-label="Plataformas de ecommerce"
        data-reveal
      >
        <li style="--i: 0">
          <span class="platform-icon">
            <UIcon name="i-simple-icons-woocommerce" aria-hidden="true" />
          </span>
          <span class="platform-copy">
            <strong>WooCommerce</strong>
            <span>Tiendas sobre WordPress</span>
          </span>
        </li>
        <li style="--i: 1">
          <span class="platform-icon">
            <UIcon name="i-simple-icons-shopify" aria-hidden="true" />
          </span>
          <span class="platform-copy">
            <strong>Shopify</strong>
            <span>Shopify y Shopify Plus</span>
          </span>
        </li>
        <li style="--i: 2">
          <span class="platform-icon">
            <UIcon name="i-lucide-code-xml" aria-hidden="true" />
          </span>
          <span class="platform-copy">
            <strong>Desarrollos a medida</strong>
            <span>Integración personalizada</span>
          </span>
        </li>
      </ul>
      <p class="platform-note" data-reveal style="--delay: 200ms">
        ¿Usás otra plataforma? Nos adaptamos a tu stack.
      </p>
    </section>

    <section class="adoption" aria-labelledby="adoption-title">
      <div class="wrap">
        <header class="section-heading" data-reveal>
          <div>
            <p class="eyebrow">TU TIENDA, EL PUNTO DE PARTIDA</p>
            <h2 id="adoption-title">
              Incorporá IA Search<br /><span>a tu ecommerce.</span>
            </h2>
          </div>
          <p>
            No reemplaza tu tienda. Evaluamos juntos cómo sumar esta experiencia
            a tu negocio.
          </p>
        </header>
        <ol class="steps">
          <li
            v-for="(step, index) in steps"
            :key="step.number"
            data-reveal
            :style="{ '--delay': `${index * 140}ms` }"
          >
            <span class="step-number">{{ step.number }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="wrap faq section-space" aria-labelledby="faq-title">
      <div data-reveal>
        <p class="eyebrow">ANTES DE CONVERSAR</p>
        <h2 id="faq-title">Lo que querés saber.</h2>
        <p class="faq-note">
          Cada catálogo es distinto.<br />Conversemos sobre el tuyo.
        </p>
      </div>
      <div class="faq-list">
        <details
          v-for="(faq, index) in faqs"
          :key="faq.question"
          data-reveal
          :style="{ '--delay': `${index * 100}ms` }"
        >
          <summary>
            {{ faq.question
            }}<span class="faq-icon"
              ><UIcon name="i-lucide-plus" aria-hidden="true"
            /></span>
          </summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </section>

    <USeparator />

    <div id="demo" class="demo">
      <HomeCtaSection :cta="cta" />
    </div>
  </div>
</template>

<style scoped>
.ia-landing {
  --accent: #e38443;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  background: #141414;
  color: #f5f2ed;
  overflow: clip;
}
.wrap {
  width: 100%;
  max-width: var(--ui-container);
  padding-inline: 16px;
  margin-inline: auto;
}

/* Scroll reveal: content stays visible without JS or with reduced motion */
[data-reveal] {
  transition:
    opacity 0.9s var(--ease-out) var(--delay, 0ms),
    transform 0.9s var(--ease-out) var(--delay, 0ms);
}
.reveal-ready [data-reveal]:not(.is-visible) {
  opacity: 0;
  transform: translateY(32px);
}

/* Hero */
.hero {
  position: relative;
  isolation: isolate;
  padding-block: 48px 72px;
  background: radial-gradient(ellipse at 90% 50%, #54352466, transparent 60%);
  border-bottom: 1px solid #ffffff15;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    linear-gradient(#ffffff08 1px, transparent 1px),
    linear-gradient(90deg, #ffffff08 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(
    ellipse 70% 60% at 72% 45%,
    #000 10%,
    transparent 70%
  );
  pointer-events: none;
}
.hero-top-glow {
  left: 0;
  z-index: -1;
}
.hero-orb {
  position: absolute;
  z-index: -1;
  top: 12%;
  right: 8%;
  width: min(520px, 60vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, #e3844338, transparent 65%);
  filter: blur(20px);
  animation: orb-drift 14s ease-in-out infinite alternate;
  pointer-events: none;
}
.hero-layout {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 48px;
  align-items: center;
}
.hero-copy,
.hero-product {
  min-width: 0;
}
.hero-in {
  animation: hero-in 0.9s var(--ease-out) var(--d, 0ms) both;
}
.hero-product {
  position: relative;
  isolation: isolate;
  padding-block: 32px 28px;
  animation: hero-product-in 1.1s var(--ease-out) 0.15s both;
}
.hero-product::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 62px -12px 32px;
  background: linear-gradient(145deg, #754326, #38291f 65%, #251e19);
  border: 1px solid #e3844380;
  border-radius: 24px;
  box-shadow:
    0 20px 48px #0003,
    0 0 80px #e3844322;
  transform: rotate(-3deg);
  animation: card-tilt 1.2s var(--ease-out) 0.35s both;
  pointer-events: none;
}
.product-callout {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  margin: -28px 12px 18px auto;
  padding: 12px 16px;
  border: 1px solid #edb58c50;
  border-radius: 12px 12px 0 12px;
  background: #33261fe6;
  backdrop-filter: blur(8px);
  color: #f5c49e;
  font-size: 14px;
  box-shadow: 0 12px 30px #0004;
  animation: pop-in 0.7s var(--ease-spring) 1s both;
}
.product-callout .iconify {
  font-size: 20px;
  animation: sparkle 2.4s ease-in-out infinite;
}
.product-result-note {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  max-width: calc(100% - 24px);
  margin: -10px 12px -12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #e0efdf;
  color: #294335;
  box-shadow: 0 12px 30px #0003;
  font-size: 14px;
  font-weight: 500;
  animation: pop-in 0.7s var(--ease-spring) 3s both;
}
.result-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #315a42;
  color: white;
}
.product-result-note > .iconify {
  flex-shrink: 0;
  margin-left: 8px;
}
.eyebrow {
  font-size: 13px;
  letter-spacing: 0.13em;
  font-weight: 600;
  line-height: 1.6;
  color: #edab7c;
}
h1 {
  font-size: clamp(38px, 3.5vw, 52px);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.045em;
  margin: 24px 0;
}
h1 span {
  background: linear-gradient(
    90deg,
    #f0b58b,
    #e38443 30%,
    #f7d2b4 55%,
    #f0b58b 80%
  );
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: text-shine 7s ease-in-out infinite alternate;
}
.hero-description {
  color: #c7c0b9;
  font-size: clamp(24px, 2.2vw, 30px);
  font-weight: 500;
  line-height: 1.4;
  max-width: 440px;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 22px;
  align-items: center;
  margin-top: 28px;
}
.primary-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  padding-block: 14px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding-inline: 20px;
  border-radius: 8px;
  background: var(--accent);
  color: #26180e;
  box-shadow: 0 8px 24px #e3844333;
  transition:
    background 0.2s,
    transform 0.3s var(--ease-out),
    box-shadow 0.3s;
}
.primary-link::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 30%,
    #ffffff66 50%,
    transparent 70%
  );
  transform: translateX(-120%);
  transition: transform 0.7s var(--ease-out);
}
.primary-link .iconify {
  transition: transform 0.3s var(--ease-out);
}
.primary-link:hover {
  background: #f3a56e;
  transform: translateY(-2px);
  box-shadow: 0 14px 32px #e3844355;
}
.primary-link:hover::after {
  transform: translateX(120%);
}
.primary-link:hover .iconify {
  transform: translate(2px, -2px);
}
.hero-note {
  font-size: 13px;
  color: #b6ada5;
  margin-top: 18px;
}
.window-label {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 0 6px 14px;
  font-size: 13px;
  color: #e0d1c4;
}

/* Sections */
.section-space {
  padding-block: 96px;
}
.section-heading {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  align-items: end;
  gap: 64px;
  margin-bottom: 40px;
}
h2 {
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.2;
  letter-spacing: -0.035em;
  font-weight: 500;
  margin-top: 16px;
}
h2 span {
  color: #b9afa7;
}
.section-heading > p,
.faq-note {
  font-size: 18px;
  line-height: 1.8;
  color: #bbb3ac;
  max-width: 380px;
}

/* Benefits */
.benefit-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 20px;
}
.benefit {
  position: relative;
  border-radius: 20px;
  padding: 32px;
  color: #302a24;
  overflow: hidden;
  box-shadow: 0 1px 0 #ffffff40 inset;
  transition:
    opacity 0.9s var(--ease-out) var(--delay, 0ms),
    transform 0.9s var(--ease-out) var(--delay, 0ms),
    translate 0.4s var(--ease-out),
    box-shadow 0.4s ease;
}
@media (hover: hover) {
  .benefit:hover {
    translate: 0 -4px;
    box-shadow:
      0 1px 0 #ffffff40 inset,
      0 28px 56px #0006;
  }
}
.benefit-copy h3 {
  font-size: clamp(25px, 2.6vw, 34px);
  font-weight: 550;
  line-height: 1.2;
  letter-spacing: -0.035em;
  margin-top: 18px;
  max-width: 420px;
}
.benefit-copy > p {
  font-size: 16px;
  line-height: 1.7;
  margin-top: 12px;
  max-width: 430px;
}
.chapter {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.09em;
  font-weight: 600;
}
.chapter-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: #ffffff80;
  font-size: 20px;
  transition: transform 0.4s var(--ease-spring);
}
.benefit:hover .chapter-icon {
  transform: rotate(-8deg) scale(1.08);
}
.understanding {
  background: linear-gradient(160deg, #f6f1e8, #ece3d4);
}
.recommendations {
  background: linear-gradient(160deg, #ebe6f4, #ddd5ec);
}
figure {
  margin: 30px 0 0;
}
.query-bubble {
  display: flex;
  gap: 16px;
  align-items: center;
  background: #fffdf8;
  border: 1px solid #d9cdbd;
  border-radius: 16px 16px 16px 0;
  padding: 22px;
  box-shadow: 0 10px 24px #57402c0a;
}
.query-bubble .iconify {
  font-size: 26px;
  flex-shrink: 0;
  color: #a35522;
}
.query-bubble p {
  font-size: 20px;
  line-height: 1.55;
  letter-spacing: -0.015em;
}
.intent-line {
  position: relative;
  height: 28px;
  width: 1px;
  background: #bba68e;
  margin-left: 35px;
  transform-origin: top;
  transition: transform 0.6s var(--ease-out) 0.5s;
}
.intent-line::after {
  content: "";
  position: absolute;
  left: -3px;
  bottom: -3px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a35522;
}
.intent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.intent-tags span {
  background: #dfd4c2;
  border-radius: 30px;
  padding: 8px 14px;
  font-size: 15px;
  transition:
    opacity 0.5s ease calc(0.9s + var(--i) * 0.12s),
    transform 0.6s var(--ease-spring) calc(0.9s + var(--i) * 0.12s),
    background 0.2s;
}
.intent-tags span:hover {
  background: #d3c4ad;
}
.reveal-ready .benefit:not(.is-visible) .intent-line {
  transform: scaleY(0);
}
.reveal-ready .benefit:not(.is-visible) .intent-tags span {
  opacity: 0;
  transform: translateY(8px) scale(0.85);
}
.recommend-products {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.recommend-products > div {
  background: #fffdfb;
  padding: 10px 10px 16px;
  border-radius: 14px;
  box-shadow: 0 8px 20px #3f285b0a;
  transition:
    opacity 0.6s ease calc(0.5s + var(--i) * 0.15s),
    transform 0.8s var(--ease-out) calc(0.5s + var(--i) * 0.15s),
    translate 0.3s var(--ease-out),
    box-shadow 0.3s ease;
}
@media (hover: hover) {
  .recommend-products > div:hover {
    translate: 0 -6px;
    box-shadow: 0 16px 32px #3f285b26;
  }
}
.reveal-ready .benefit:not(.is-visible) .recommend-products > div {
  opacity: 0;
  transform: translateY(24px) rotate(-2deg);
}
.recommend-products strong,
.recommend-products span {
  display: block;
  padding-inline: 4px;
  font-size: 16px;
  margin-top: 10px;
}
.recommend-products span {
  font-size: 15px;
  color: #655d67;
  margin-top: 4px;
}
.opportunities {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 40px;
  align-items: center;
  background: linear-gradient(145deg, #2a4239, #1f322b);
  color: #eff7f1;
  padding: 32px;
}
.opportunities .chapter {
  color: #b5d9c6;
}
.opportunities .chapter-icon {
  background: #ffffff14;
}
.opportunities .benefit-copy > p {
  color: #d3e1d9;
}
.contact-scene {
  margin: 0;
  min-width: 0;
}
.chat-step {
  transition:
    opacity 0.6s ease calc(0.4s + var(--i) * 0.45s),
    transform 0.7s var(--ease-out) calc(0.4s + var(--i) * 0.45s);
}
.reveal-ready .benefit:not(.is-visible) .chat-step {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
.speaker-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #4b6557;
  margin-bottom: 8px;
}
.lead-response {
  margin-top: 12px;
}
.contact-value {
  font-weight: 600;
  overflow-wrap: anywhere;
  padding: 1px 6px;
  border-radius: 6px;
  background: #c9e2cf;
}
.lead-handoff {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 18px 0 0;
  color: #d3e1d9;
  font-size: 14px;
  line-height: 1.6;
}
.lead-handoff .iconify {
  flex-shrink: 0;
  font-size: 20px;
  margin-top: 2px;
  color: #b8d7bf;
}
.customer-message {
  background: #edf4eb;
  color: #2c4437;
  border-radius: 14px 14px 0 14px;
  margin-left: 28px;
  padding: 14px 18px;
  font-size: 16px;
  line-height: 1.6;
}
.contact-intent {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  margin-top: 12px;
  border: 1px solid #8fbaa34f;
  border-radius: 14px;
  background: #314d40;
}
.contact-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #b8d7bf;
  color: #294733;
  flex-shrink: 0;
  font-size: 24px;
  box-shadow: 0 0 0 0 #b8d7bf66;
  animation: soft-ring 2.6s ease-out infinite;
}
.contact-intent strong {
  font-size: 17px;
  font-weight: 600;
}
.contact-intent p {
  font-size: 16px;
  line-height: 1.6;
  color: #d0e0d6;
  margin-top: 6px;
}

/* Integrations */
.integrations {
  border-top: 1px solid #ffffff15;
}
.integrations .section-heading {
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
.integrations .section-heading > p {
  max-width: none;
  font-size: 20px;
  line-height: 1.55;
}
.platform-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 16px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.platform-list li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 26px 24px;
  border: 1px solid #ffffff1f;
  border-radius: 18px;
  background: linear-gradient(160deg, #24211e, #1a1917);
  box-shadow: 0 1px 0 #ffffff12 inset;
  overflow: hidden;
  transition:
    opacity 0.6s ease calc(var(--i) * 0.12s),
    transform 0.7s var(--ease-out) calc(var(--i) * 0.12s),
    translate 0.3s var(--ease-out),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}
.platform-list li::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, #f0b58b66, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.reveal-ready .platform-list:not(.is-visible) li {
  opacity: 0;
  transform: translateY(20px);
}
@media (hover: hover) {
  .platform-list li:hover {
    translate: 0 -4px;
    border-color: #edab7c44;
    box-shadow:
      0 1px 0 #ffffff12 inset,
      0 20px 40px #0005;
  }
  .platform-list li:hover::before {
    opacity: 1;
  }
}
.platform-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border: 1px solid #edab7c33;
  border-radius: 15px;
  background: linear-gradient(160deg, #edab7c26, #edab7c0a);
  color: #f0b58b;
  font-size: 27px;
  transition:
    transform 0.4s var(--ease-spring),
    border-color 0.3s ease;
}
.platform-list li:hover .platform-icon {
  transform: rotate(-6deg) scale(1.06);
  border-color: #edab7c66;
}
.platform-copy {
  display: grid;
  gap: 4px;
}
.platform-copy strong {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.015em;
}
.platform-copy > span {
  font-size: 14px;
  color: #a89f96;
}
.platform-note {
  margin-top: 24px;
  font-size: 15px;
  color: #a89f96;
}

/* Adoption */
.adoption {
  padding-block: 80px;
  background: linear-gradient(180deg, #1d1c1a, #191816);
  border-block: 1px solid #ffffff12;
}
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;
  padding: 0;
  list-style: none;
  margin-top: 48px;
}
.steps li {
  position: relative;
  border-top: 1px solid #63514166;
  padding-top: 24px;
}
.steps li::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), #e3844300);
  transform-origin: left;
  transition: transform 1.2s var(--ease-out) calc(var(--delay, 0ms) + 0.25s);
}
.reveal-ready .steps li:not(.is-visible)::before {
  transform: scaleX(0);
}
.step-number {
  display: inline-block;
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.04em;
  background: linear-gradient(180deg, #f3be97, #b0643099);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: transform 0.4s var(--ease-spring);
}
.steps li:hover .step-number {
  transform: translateY(-4px);
}
.steps h3 {
  font-size: 21px;
  margin-top: 16px;
  font-weight: 500;
}
.steps p {
  color: #beb6ae;
  font-size: 16px;
  line-height: 1.8;
  margin-top: 12px;
}

/* FAQ */
.faq {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
}
.faq-note {
  margin-top: 24px;
}
.faq-list {
  interpolate-size: allow-keywords;
}
.faq-list details {
  border-bottom: 1px solid #ffffff25;
}
.faq-list details::details-content {
  block-size: 0;
  overflow: hidden;
  transition:
    block-size 0.45s var(--ease-out),
    content-visibility 0.45s allow-discrete;
}
.faq-list details[open]::details-content {
  block-size: auto;
}
.faq-list summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
  font-size: 18px;
  cursor: pointer;
  list-style: none;
  transition: color 0.2s;
}
.faq-list summary:hover,
.faq-list details[open] summary {
  color: #f0b58b;
}
.faq-list summary::-webkit-details-marker {
  display: none;
}
.faq-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 1px solid #edab7c55;
  border-radius: 50%;
  color: #edab7c;
  transition:
    transform 0.35s var(--ease-out),
    background 0.2s,
    color 0.2s;
}
.faq-list summary:hover .faq-icon {
  background: #edab7c1f;
}
.faq-list details[open] .faq-icon {
  transform: rotate(45deg);
  background: var(--accent);
  color: #26180e;
}
.faq-list p {
  font-size: 16px;
  line-height: 1.8;
  color: #c4bbb3;
  padding-bottom: 24px;
  max-width: 560px;
}

/* Demo */
.demo {
  scroll-margin-top: 90px;
}
a:focus-visible,
button:focus-visible,
summary:focus-visible {
  outline: 2px solid #f0b58b;
  outline-offset: 5px;
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(18px);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
@keyframes hero-product-in {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes card-tilt {
  from {
    transform: rotate(0deg) scale(0.96);
    opacity: 0;
  }
  to {
    transform: rotate(-3deg);
    opacity: 1;
  }
}
@keyframes pop-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.85);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes sparkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.15) rotate(12deg);
  }
}
@keyframes soft-ring {
  0% {
    box-shadow: 0 0 0 0 #b8d7bf66;
  }
  70%,
  100% {
    box-shadow: 0 0 0 12px #b8d7bf00;
  }
}
@keyframes text-shine {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}
@keyframes orb-drift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(-40px, 30px) scale(1.12);
  }
}

@media (min-width: 640px) {
  .wrap {
    padding-inline: 24px;
  }
}
@media (min-width: 1024px) {
  .wrap {
    padding-inline: 32px;
  }
}
@media (max-width: 1023px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .hero-copy {
    max-width: 680px;
  }
  .hero-description {
    max-width: 600px;
  }
  .hero-product {
    width: 100%;
  }
  .section-heading {
    gap: 28px;
  }
  .benefit {
    padding: 26px;
  }
  .opportunities {
    gap: 26px;
  }
}
@media (max-width: 639px) {
  .hero {
    padding-block: 32px 48px;
  }
  h1 {
    font-size: 39px;
  }
  .hero-actions {
    gap: 8px;
  }
  .section-space {
    padding-block: 56px;
  }
  .section-heading,
  .integrations .section-heading,
  .benefit-grid,
  .opportunities,
  .steps,
  .faq {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .section-heading {
    margin-bottom: 28px;
  }
  .benefit {
    padding: 24px;
    border-radius: 16px;
  }
  .benefit-copy h3 {
    font-size: 29px;
  }
  .query-bubble {
    padding: 18px;
    gap: 12px;
  }
  .query-bubble p {
    font-size: 18px;
  }
  .recommend-products {
    gap: 8px;
  }
  .recommend-products > div {
    padding: 8px;
  }
  .recommend-products strong {
    font-size: 15px;
  }
  .recommend-products span {
    font-size: 15px;
  }
  .customer-message {
    margin-left: 12px;
  }
  .contact-intent {
    padding: 16px;
    gap: 12px;
  }
  .adoption {
    padding-block: 52px;
  }
  .steps {
    margin-top: 32px;
  }
  .steps h3 {
    margin-top: 10px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ia-landing *,
  .ia-landing *::before,
  .ia-landing *::after {
    animation: none !important;
    transition: none !important;
  }
  .primary-link:hover,
  .benefit:hover,
  .recommend-products > div:hover {
    transform: none;
    translate: none;
  }
}
</style>
