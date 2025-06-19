import vuetify from 'vite-plugin-vuetify'
import { readFileSync } from 'fs'
import { VitePWA } from 'vite-plugin-pwa'

export default defineNuxtConfig({

  app: {
    head: {
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },
  // Транспиляция Vuetify для корректной работы CSS
  build: {
    transpile: ['vuetify'],
  },

  // Глобальные стили Vuetify и иконок
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.css',
  ],

  ssr: false,

  vite: {
    plugins: [
      vuetify({
        autoImport: true,
      }),
    ],
  },

  ssr: false,

  modules: ['@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Starling',
      short_name: 'starling',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ebc934',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL,
      keycloakRealm: process.env.VITE_KEYCLOAK_REALM,
      keycloakClientId: process.env.VITE_KEYCLOAK_CLIENT_ID,
    },
  }
})
