<template>
  <div v-if="session.isAuthReady && session.user" class="p-4 sm:p-6 lg:p-8 flex-col">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 font-serif">
        Painel de Controle
      </h1>
      <p class="text-gray-500 mt-1">
        Sua visão geral financeira para o grande dia.
      </p>
    </header>

    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <SummaryCard />
      <DistributeCard />
    </div>

    <div
      class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
    >
      <h2 class="text-2xl font-bold text-gray-800">
        Seus Cofres de Economia
      </h2>
      <button
        @click="isAddSafeModalOpen = true"
        class="w-full sm:w-auto px-5 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors shadow-md"
      >
        + Adicionar Cofre
      </button>
    </div>

    <main id="safes-container">
      <div
        v-if="weddingStore.loading"
        class="text-center py-10 text-gray-500"
      >
        + A carregar os seus dados... +
      </div>

      <div
        v-else-if="safes.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <SafeCard v-for="safe in safes" :key="safe.id" :safe="safe" />
      </div>

      <div v-else class="text-center py-10 bg-white rounded-lg shadow">
        <p class="text-gray-500">
          Ainda não tem cofres. Adicione um para começar!
        </p>
      </div>
    </main>

    <OnboardingModal
      :open="isOnboardingModalOpen"
      @update:open="isOnboardingModalOpen = $event"
    />
    <AddSafeModal
      :open="isAddSafeModalOpen"
      @update:open="isAddSafeModalOpen = $event"
    />
  </div>

  <div v-else-if="session.isAuthReady && !session.user" class="flex flex-col justify-center min-h-screen">
    <p class="text-gray-500 text-center">
      Ocorreu um erro ao carregar a sua sessão. Por favor, tente fazer login novamente.
    </p>
  </div>

  <div v-else class="flex flex-col justify-center min-h-screen">
    <p class="text-gray-500 text-center">A verificar sessão...</p>
  </div>
</template>

<script setup lang="ts">
import { useWeddingStore } from "~/stores/wedding";
import { useSessionStore } from '~/stores/session';

// Aplica o middleware de autenticação a esta página
definePageMeta({
  layout: "home", // Usa o novo layout que criamos
});

const session = useSessionStore();
const weddingStore = useWeddingStore();
const { safes, loading, weddingDate } = storeToRefs(weddingStore);

const isOnboardingModalOpen = ref(false);
const isAddSafeModalOpen = ref(false);

// Usar watch para reagir à mudança de estado do utilizador
watch(() => session.user, (newUser) => {
  if (newUser) {
    weddingStore.initialize();
  }
}, { immediate: true });

// Lógica para o onboarding modal
watch([safes, loading, () => session.isAuthReady], ([safesValue, loadingValue, authReadyValue]) => {
  if (authReadyValue && !loadingValue && safesValue.length === 0) {
    isOnboardingModalOpen.value = true;
  }
});
</script>
