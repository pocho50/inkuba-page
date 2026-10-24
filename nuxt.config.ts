// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/content'],
  $production: {
    app: {
      head: {
        script: [
          {
            'defer': true,
            'src': 'https://analytics.inkuba.com/script.js',
            'data-website-id': 'd1c6cf3d-7c50-4dea-8983-ad2447f173a4'
          }
        ]
      }
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  runtimeConfig: {
    mailgunApiKey: '',
    mailgunDomain: '',
    mailgunFrom: '',
    mailgunTo: ''
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
