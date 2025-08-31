// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true, // Mantemos o SSR para performance e SEO
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image', // Módulo de imagem para otimização (PERF-01)
  ],
  runtimeConfig: {
    // Variáveis disponíveis apenas no servidor (segurança)
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    // Variáveis públicas (disponíveis no cliente e servidor)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    }
  },
})