// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
   modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  // SEC-03: Use runtimeConfig to expose environment variables
  // to the server-side only. Never expose secrets to the public client-side bundle.
  runtimeConfig: {
    // These values are only available on the server
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL
  },

  app: {
    head: {
      title: 'Nuxt', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    }
  },
})
