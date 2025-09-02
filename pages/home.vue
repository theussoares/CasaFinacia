<template>
  <div v-if="session.isAuthReady && session.user" class="p-4 sm:p-6 lg:p-8 flex-col">
    <!-- Banner de convite se não tem parceiro -->
    <InvitePartnerBanner v-if="!hasPartner && !partnerLoading" @invite="shareInviteWhatsApp" />
    
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

// **LAYOUT-SHIFT-FIX**: Aplica middleware otimizado
definePageMeta({
  layout: "home",
});

const session = useSessionStore();
const weddingStore = useWeddingStore();
const { safes, loading, weddingDate } = storeToRefs(weddingStore);

const isOnboardingModalOpen = ref(false);
const isAddSafeModalOpen = ref(false);
const hasPartner = ref(false);
const partnerLoading = ref(true);

// **PERF-01**: Cache persistente para dados de household
const getHouseholdCache = () => {
  if (process.server) return null;
  try {
    const cached = localStorage.getItem('household-data-cache');
    const timestamp = localStorage.getItem('household-cache-timestamp');
    
    if (cached && timestamp) {
      const now = Date.now();
      const cacheTime = parseInt(timestamp);
      // Cache válido por 10 minutos
      if (now - cacheTime < 10 * 60 * 1000) {
        return JSON.parse(cached);
      }
    }
  } catch {
    return null;
  }
  return null;
};

const setHouseholdCache = (data: any) => {
  if (process.server) return;
  try {
    localStorage.setItem('household-data-cache', JSON.stringify(data));
    localStorage.setItem('household-cache-timestamp', Date.now().toString());
  } catch {
    // Silencioso
  }
};

// **PERF-02**: Carrega dados de household do cache primeiro
const householdCache = getHouseholdCache();
if (householdCache) {
  hasPartner.value = householdCache.hasPartner;
  partnerLoading.value = false;
}

// **PERF-03**: Fetch otimizado para household com cache
const { data: householdData, refresh: refreshHousehold } = await useLazyFetch('/api/household/users', {
  key: 'household-users',
  server: false,
  default: () => ({ users: [], hasPartner: false }),
  transform: (data: any) => {
    const users = data.users || [];
    const otherUsers = users.filter((user: any) => user.uid !== session.user?.uid);
    const result = { hasPartner: otherUsers.length > 0, users };
    
    // Atualiza cache
    setHouseholdCache(result);
    
    return result;
  }
});

// **PERF-04**: Reatividade otimizada
watchEffect(() => {
  if (householdData.value) {
    hasPartner.value = householdData.value.hasPartner;
    partnerLoading.value = false;
  }
});

// **PERF-05**: Inicialização otimizada sem bloqueio
onMounted(async () => {
  // Se usuário já está logado, inicializa dados imediatamente
  if (session.user) {
    weddingStore.initialize(); // Carrega do cache primeiro
  }
});

// **PERF-06**: Watch otimizado para mudanças de usuário
watch(() => session.user, async (newUser) => {
  if (newUser && !weddingStore.safes.length) {
    // Só inicializa se não há dados ainda
    await weddingStore.initialize();
  }
}, { immediate: false }); // Não executa imediatamente pois onMounted já cuida

// **PERF-07**: Lógica otimizada para onboarding modal
watch([safes, loading, () => session.isAuthReady], ([safesValue, loadingValue, authReadyValue]) => {
  // Só abre modal se realmente carregou e não há cofres
  if (authReadyValue && !loadingValue && safesValue.length === 0) {
    nextTick(() => {
      if (!loading.value && safes.value.length === 0) {
        isOnboardingModalOpen.value = true;
      }
    });
  }
});

// Função para scroll até as opções de convite (no header)
async function shareInviteWhatsApp() {
  try {
    const { inviteUrl } = await $fetch('/api/household/invite', {
      method: 'POST',
    });
    
    const message = `Oi amor! 💕 Te convido para planejarmos juntos nosso casamento no Planejando a Dois! 

É super fácil: clique no link abaixo para acessar nossa conta compartilhada e começar a economizar juntos para o grande dia! 

${inviteUrl}

Vamos tornar nosso sonho realidade! 💍✨`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  } catch (error: any) {
    console.error("Falha ao gerar o link de convite:", error);
    alert(`Não foi possível gerar o link de convite: ${error.data?.statusMessage || 'Erro de comunicação com o servidor.'}`);
  }
}

// Usar watch para reagir à mudança de estado do utilizador
watch(() => session.user, (newUser) => {
  if (newUser) {
    console.log('👤 Usuário carregado na home:', {
      name: newUser.name,
      photoURL: newUser.photoURL ? 'PRESENTE' : 'AUSENTE',
      uid: newUser.uid
    });
    weddingStore.initialize();
  }
}, { immediate: true });

// **DEBUG**: Watch para mudanças na foto do usuário
watch(() => session.user?.photoURL, (newPhotoURL, oldPhotoURL) => {
  console.log('📸 PhotoURL mudou:', {
    old: oldPhotoURL ? 'PRESENTE' : 'AUSENTE',
    new: newPhotoURL ? 'PRESENTE' : 'AUSENTE',
    url: newPhotoURL
  });
});

// Lógica para o onboarding modal
watch([safes, loading, () => session.isAuthReady], ([safesValue, loadingValue, authReadyValue]) => {
  if (authReadyValue && !loadingValue && safesValue.length === 0) {
    isOnboardingModalOpen.value = true;
  }
});
</script>
