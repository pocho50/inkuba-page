// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "@nuxt/content"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
    storage: false,
  },

  mdc: {
    highlight: {
      noApiRoute: false,
    },
  },

  runtimeConfig: {
    mailgunApiKey: "",
    mailgunDomain: "",
    mailgunFrom: "",
    mailgunTo: "",
  },

  compatibilityDate: "2025-01-15",

  nitro: {
    prerender: {
      routes: ["/"],
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
