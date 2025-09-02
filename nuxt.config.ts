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
      link: [
        // **PERF-04**: Preconnects para domínios críticos do Firebase
        { rel: 'preconnect', href: 'https://soccer-maneger.firebaseapp.com' },
        { rel: 'preconnect', href: 'https://www.googleapis.com' },
        { rel: 'preconnect', href: 'https://identitytoolkit.googleapis.com' },
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