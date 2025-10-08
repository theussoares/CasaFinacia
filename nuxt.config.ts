// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-09-02',
  devtools: { enabled: true },
  ssr: true, // Mantemos o SSR para performance e SEO
  
  // **PERF-01**: Configurações de otimização
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        // Configuração para cache em produção (comentado para desenvolvimento)
        // host: process.env.REDIS_HOST || 'localhost',
        // port: process.env.REDIS_PORT || 6379
      }
    },
    routeRules: {
      // **PERF-02**: Headers de cache para recursos estáticos
      '/api/**': { 
        headers: { 
          'Cache-Control': 'max-age=0, s-maxage=60', // Cache no CDN por 1 minuto
        } 
      },
      // **PERF-03**: Cache para dados menos críticos
      '/api/household/users': { 
        headers: { 
          'Cache-Control': 'max-age=30, s-maxage=120' // Cache local por 30s, CDN por 2min
        } 
      }
    }
  },
  
  app: {
    head: {
      title: 'Casa Financia - Planejando a Dois',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes' },
        { name: 'description', content: 'Planeje seu casamento e gerencie suas economias de forma inteligente' },
        
        // **PWA-01**: Meta tags para PWA
        { name: 'application-name', content: 'Casa Financia' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Casa Financia' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#ec4899' },
        
        // **SEO-01**: Open Graph
        { property: 'og:title', content: 'Casa Financia - Planejando a Dois' },
        { property: 'og:description', content: 'Planeje seu casamento e gerencie suas economias de forma inteligente' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'pt_BR' },
        
        // **SEO-02**: Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Casa Financia - Planejando a Dois' },
        { name: 'twitter:description', content: 'Planeje seu casamento e gerencie suas economias de forma inteligente' },
      ],
      link: [
        // **PERF-04**: Preconnects para domínios críticos do Firebase
        { rel: 'preconnect', href: 'https://soccer-maneger.firebaseapp.com' },
        { rel: 'preconnect', href: 'https://www.googleapis.com' },
        { rel: 'preconnect', href: 'https://identitytoolkit.googleapis.com' },
        
        // **PWA-02**: Links para ícones e manifest
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ec4899' },
      ]
    }
  },
  
  // **PERF-05**: Otimizações de build e runtime
  experimental: {
    payloadExtraction: false, // Reduz o tamanho do payload inicial
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image', // Módulo de imagem para otimização
    '@nuxtjs/critters' // Critical CSS inlining
  ],
  
  // **PERF-06**: Otimização de imagens
  image: {
    quality: 85,
    format: ['webp', 'avif', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  
  runtimeConfig: {
    // Variáveis disponíveis apenas no servidor (segurança)
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
    // Variáveis públicas (disponíveis no cliente e servidor)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY,
    }
  },
})