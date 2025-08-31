<template>
  <div class="bg-stone-50 min-h-screen p-6 relative">
    <div class="max-w-4xl mx-auto">
      <AppHeader />
      
      <SummaryCard />

      <DistributeCard />

      <div class="mb-6 text-right">
        <button @click="isModalOpen = true" class="px-5 py-2 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors shadow">
          + Adicionar Cofre
        </button>
      </div>
      
      <main id="safes-container" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SafeCard 
          v-for="safe in safes" 
          :key="safe.id" 
          :safe="safe" 
        />
      </main>

      <AddSafeModal v-model:open="isModalOpen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeddingStore } from '~/stores/wedding';

// State para controlar a visibilidade do modal
const isModalOpen = ref(false);
const config = useRuntimeConfig()

const store = useWeddingStore();
const { safes, loading, error, weddingDate } = storeToRefs(store); // Also get weddingDate reactively

// Call the single, optimized initialize action on page load
await useAsyncData('initial-data', async () => {
  await store.initialize();
  return {
    safes: store.safes,
    weddingDate: store.weddingDate
  };
});

// Watch for changes on the date picker and call the update action
watch(weddingDate, (newDate) => {
    if (newDate) {
        store.updateWeddingDate(newDate);
    }
});

useSeoMeta({
  title: 'Nosso Casamento | Planejador Financeiro',
  ogTitle: 'Nosso Casamento | Planejador Financeiro',
  description: 'Acompanhe e organize as economias para o grande dia! Calcule metas, distribua valores e veja seu sonho se realizar.',
  ogDescription: 'Acompanhe e organize as economias para o grande dia!',
  ogImage: `${config.public.siteUrl}/android-chrome-512x512.png`,
  twitterCard: 'summary_large_image',
})
</script>