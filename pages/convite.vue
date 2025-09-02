<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-6">
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
      
      <!-- Loading State -->
      <div v-if="loading" class="py-8">
        <svg class="animate-spin h-12 w-12 text-pink-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <p class="text-gray-600">Verificando convite...</p>
      </div>

      <!-- Valid Invite -->
      <div v-else-if="inviteValid && !session.user" class="space-y-6">
        <div class="space-y-2">
          <svg class="w-16 h-16 text-pink-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <h1 class="text-3xl font-serif font-bold text-pink-700">
            Você foi convidado! 💕
          </h1>
          <p class="text-gray-600 text-lg">
            Seu parceiro(a) te convidou para planejar o casamento juntos no <strong>Planejando a Dois</strong>.
          </p>
        </div>

        <div class="bg-pink-50 border border-pink-200 rounded-xl p-4 space-y-2">
          <h3 class="font-semibold text-pink-800">O que vocês vão poder fazer juntos:</h3>
          <ul class="text-sm text-pink-700 space-y-1 text-left">
            <li>✨ Criar cofres de economia para cada sonho</li>
            <li>📊 Acompanhar o progresso das metas</li>
            <li>💰 Definir valores mensais juntos</li>
            <li>🎯 Alcançar o casamento dos seus sonhos</li>
          </ul>
        </div>

        <div class="space-y-3">
          <p class="text-gray-600 text-sm">
            Faça login para aceitar o convite e começar a planejar:
          </p>
          <Login />
        </div>
      </div>

      <!-- Already Logged In -->
      <div v-else-if="session.user" class="space-y-6">
        <div class="space-y-2">
          <svg class="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 class="text-3xl font-serif font-bold text-green-700">
            Bem-vindo ao time! 🎉
          </h1>
          <p class="text-gray-600 text-lg">
            Olá, <strong>{{ session.user.name?.split(' ')[0] }}</strong>! Você já está conectado e pode começar a planejar.
          </p>
        </div>

        <button 
          @click="navigateHome"
          class="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
        >
          Ir para o Painel 🚀
        </button>
      </div>

      <!-- Invalid Invite -->
      <div v-else class="space-y-6">
        <div class="space-y-2">
          <svg class="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h1 class="text-3xl font-serif font-bold text-red-600">
            Convite Inválido 😔
          </h1>
          <p class="text-gray-600 text-lg">
            Este link de convite não é válido ou já foi usado.
          </p>
        </div>

        <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
          <h3 class="font-semibold text-gray-700">Possíveis motivos:</h3>
          <ul class="text-sm text-gray-600 space-y-1 text-left">
            <li>• O convite já foi aceito por outra pessoa</li>
            <li>• O link expirou ou foi revogado</li>
            <li>• Houve um erro na URL</li>
          </ul>
        </div>

        <div class="space-y-3">
          <p class="text-gray-600 text-sm">
            Peça ao seu parceiro(a) para enviar um novo convite ou crie sua própria conta:
          </p>
          <button 
            @click="navigateHome"
            class="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
          >
            Criar Minha Conta
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500">
          Planejando a Dois • Seu casamento organizado
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session';
import { useRouter, useRoute } from 'vue-router';

// SEO and meta tags
useHead({
  title: 'Convite de Casamento - Planejando a Dois',
  meta: [
    { name: 'description', content: 'Você foi convidado para planejar um casamento no Planejando a Dois!' },
    { property: 'og:title', content: 'Convite de Casamento - Planejando a Dois' },
    { property: 'og:description', content: 'Aceite o convite e comece a planejar o casamento dos seus sonhos!' },
  ]
});

const session = useSessionStore();
const router = useRouter();
const route = useRoute();

const loading = ref(true);
const inviteValid = ref(false);

// Check invite validity on mount
onMounted(async () => {
  const inviteToken = route.query.invite_token as string;
  
  if (!inviteToken) {
    loading.value = false;
    inviteValid.value = false;
    return;
  }

  try {
    // Validate invite token
    const response = await $fetch('/api/household/validate-invite', {
      method: 'POST',
      body: { inviteToken }
    }) as { valid: boolean };
    
    inviteValid.value = response.valid;
  } catch (error) {
    console.error('Error validating invite:', error);
    inviteValid.value = false;
  } finally {
    loading.value = false;
  }
});

function navigateHome() {
  router.push('/home');
}
</script>
