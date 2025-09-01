<template>
  <div class="bg-white p-8 text-center w-full">
    <h2 class="text-gray-900 mb-2 text-2xl font-bold">Acesse sua conta</h2>
    <p class="text-gray-500 mb-8">Comece a planejar o casamento dos seus sonhos.</p>
    <button
      class="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed"
      @click="loginWithGoogle"
      :disabled="loading"
    >
      <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 11.045 8.955 20 20 20z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 7.585l6.19 5.238C42.012 35.845 44 30.137 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
      <span v-if="!loading">Entrar com Google</span>
      <span v-else class="flex items-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Entrando...</span>
    </button>
    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { signInWithRedirect } from 'firebase/auth';

const loading = ref(false);
const error = ref<string | null>(null);
const { $firebase } = useNuxtApp() as any;

const route = useRoute();
const inviteToken = ref(route.query.invite_token || null);

// AÇÃO CRÍTICA: Guardar o token de convite no localStorage para que ele
// sobreviva ao redirecionamento para a página do Google e de volta.
if (inviteToken.value && typeof inviteToken.value === 'string' && import.meta.client) {
  localStorage.setItem('invite_token', inviteToken.value);
}

async function loginWithGoogle() {
  loading.value = true;
  error.value = null;
  try {
    const auth = $firebase.getFirebaseAuth();
    const provider = $firebase.getGoogleProvider();
    
    // Inicia o fluxo de redirecionamento. A execução do código aqui para,
    // pois o navegador irá navegar para a página do Google.
    await signInWithRedirect(auth, provider);

  } catch (e: any) {
    console.error("A iniciação do login por redirecionamento falhou:", e);
    error.value = e.data?.statusMessage || e.message || 'Não foi possível iniciar o login.';
    loading.value = false;
  }
}
</script>