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
    lang: 'pt-BR' // Acessibilidade e SEO
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
  title: 'Planejando a dois | Planejador Financeiro para Casamentos',
  ogTitle: 'Planejando a dois | Seu Casamento Organizado',
  description: 'Acompanhe e organize as economias para o grande dia! Crie metas, distribua valores e veja seu sonho se realizar.',
  ogDescription: 'A ferramenta completa para organizar as finanças do seu casamento.',
  // SEO: A URL da imagem é dinâmica e absoluta, essencial para redes sociais.
  ogImage: `${config.public.siteUrl}/social-share.png`, // Crie esta imagem e coloque na pasta /public
  twitterCard: 'summary_large_image',
})
</script>

<style>
/* Estilos globais para a aplicação */
body {
  font-family: 'Inter', sans-serif;
  background-color: #fdf2f8; /* Fundo rosa bem clarinho para um toque delicado */
  padding: 0 !important;
}
</style>