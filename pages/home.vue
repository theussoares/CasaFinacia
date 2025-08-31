<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 font-serif">Painel de Controle</h1>
      <p class="text-gray-500 mt-1">Sua visão geral financeira para o grande dia.</p>
    </header>
    
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <SummaryCard />
      <DistributeCard />
    </div>

    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-2xl font-bold text-gray-800">Seus Cofres de Economia</h2>
      <button @click="isAddSafeModalOpen = true" class="w-full sm:w-auto px-5 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors shadow-md">
        + Adicionar Cofre
      </button>
    </div>

    <main id="safes-container">
      <div v-if="loading" class="text-center py-10 text-gray-500">
        Carregando seus dados...
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SafeCard v-for="safe in safes" :key="safe.id" :safe="safe" />
      </div>
    </main>

    <OnboardingModal v-model:open="isOnboardingModalOpen" />
    <AddSafeModal v-model:open="isAddSafeModalOpen" />
  </div>
</template>

<script setup lang="ts">
import { useWeddingStore } from '~/stores/wedding';

// Aplica o middleware de autenticação a esta página
definePageMeta({
  layout: 'home', // Usa o novo layout que criamos
  middleware: 'auth'
});

const weddingStore = useWeddingStore();
const { safes, loading, weddingDate } = storeToRefs(weddingStore);

const isOnboardingModalOpen = ref(false);
const isAddSafeModalOpen = ref(false);

onMounted(async () => {
  await weddingStore.initialize();
  if (safes.value.length === 0 && !loading.value) {
    isOnboardingModalOpen.value = true;
  }
});

watch(weddingDate, (newDate, oldDate) => {
  if (newDate && newDate !== oldDate) {
    weddingStore.updateWeddingDate(newDate);
  }
});
</script>