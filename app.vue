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
  meta: [
    // **PWA-01**: Meta tag para cor da barra de status
    { name: 'theme-color', content: '#ec4899', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#831843', media: '(prefers-color-scheme: dark)' },
  ],
})

// useSeoMeta cuida das tags de SEO e de compartilhamento em redes sociais
useSeoMeta({
  title: 'Casa Financia - Planejando a Dois | Planejador Financeiro para Casamentos',
  ogTitle: 'Casa Financia - Planejando a Dois | Seu Casamento Organizado',
  description: 'Acompanhe e organize as economias para o grande dia! Crie metas, distribua valores e veja seu sonho se realizar.',
  ogDescription: 'A ferramenta completa para organizar as finanças do seu casamento.',
  // SEO: A URL da imagem é dinâmica e absoluta, essencial para redes sociais.
  ogImage: `${config.public.siteUrl}/feature-dashboard.webp`,
  ogUrl: config.public.siteUrl,
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