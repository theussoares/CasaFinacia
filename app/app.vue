<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Acessa as variáveis de ambiente que configuramos no nuxt.config.ts
const config = useRuntimeConfig()

// useHead gerencia o <head> do seu HTML
useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  },
  link: [
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
})

// useSeoMeta cuida das tags de SEO e de compartilhamento em redes sociais
useSeoMeta({
  title: 'Nosso Casamento | Planejador Financeiro',
  ogTitle: 'Nosso Casamento | Planejador Financeiro',
  description: 'Acompanhe e organize as economias para o grande dia! Calcule metas, distribua valores e veja seu sonho se realizar.',
  ogDescription: 'Acompanhe e organize as economias para o grande dia!',
  // A URL da imagem é construída dinamicamente
  ogImage: `${config.public.siteUrl}/imagem-social.png`,
  twitterCard: 'summary_large_image',
})
</script>

<style>
/* Estilos globais para a aplicação */
body {
  font-family: 'Inter', sans-serif; /* Exemplo de fonte global */
  background-color: #f9fafb; /* Um cinza bem claro */
}
</style>