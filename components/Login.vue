<template>
  <div class="bg-white p-4 sm:p-8 text-center w-full max-w-md mx-auto">
    <h2 class="text-gray-900 mb-3 text-xl sm:text-2xl font-bold">Acesse sua conta</h2>
    <p class="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">Comece a planejar o casamento dos seus sonhos.</p>
    
    <!-- **SEC-01**: Widget do Turnstile CAPTCHA -->
    <div class="mb-4 sm:mb-6 flex justify-center">
      <TurnstileWidget
        ref="turnstileRef"
        theme="light"
        size="normal"
        @verified="handleTurnstileVerified"
        @error="handleTurnstileError"
        @expired="handleTurnstileExpired"
      />
    </div>
    
    <button
      class="flex items-center justify-center gap-2 sm:gap-3 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base min-h-[48px] touch-manipulation"
      @click="loginWithGoogle"
      :disabled="loading || !isTurnstileVerified"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 11.045 8.955 20 20 20z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 7.585l6.19 5.238C42.012 35.845 44 30.137 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
      <span v-if="!loading" class="truncate">
        {{ isTurnstileVerified ? 'Entrar com Google' : 'Complete a verificação' }}
      </span>
      <span v-else class="flex items-center gap-2">
        <svg class="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span class="truncate">Entrando...</span>
      </span>
    </button>
    
    <!-- **A11Y-01**: Mensagem de erro acessível -->
    <p v-if="error" class="text-red-600 mt-3 sm:mt-4 text-sm leading-relaxed" role="alert" aria-live="polite">{{ error }}</p>
    
    <!-- **UX-01**: Informação sobre o CAPTCHA -->
    <p class="text-xs text-gray-400 mt-3 sm:mt-4 leading-relaxed px-2">
      Protegido por Cloudflare Turnstile para prevenir spam e abuso.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { signInWithPopup } from 'firebase/auth';
import { useSessionStore } from '~/stores/session';
import { useRouter } from 'vue-router';

const loading = ref(false);
const error = ref<string | null>(null);
const { $firebase } = useNuxtApp() as any;
const store = useSessionStore();
const router = useRouter();

// **SEC-01**: Estados do Turnstile
const turnstileRef = ref();
const isTurnstileVerified = ref(false);
const turnstileToken = ref<string | null>(null);

// **SEC-02**: Handlers para eventos do Turnstile
const handleTurnstileVerified = (token: string) => {
  turnstileToken.value = token;
  isTurnstileVerified.value = true;
  error.value = null;
  console.log('✅ CAPTCHA verificado com sucesso');
};

const handleTurnstileError = (errorMsg: string) => {
  turnstileToken.value = null;
  isTurnstileVerified.value = false;
  error.value = `Erro no CAPTCHA: ${errorMsg}`;
  console.error('❌ Erro no CAPTCHA:', errorMsg);
};

const handleTurnstileExpired = () => {
  turnstileToken.value = null;
  isTurnstileVerified.value = false;
  error.value = 'CAPTCHA expirado. Por favor, refaça a verificação.';
  console.warn('⏰ CAPTCHA expirado');
};

async function loginWithGoogle() {
  // **SEC-03**: Verifica se CAPTCHA foi validado
  if (!isTurnstileVerified.value || !turnstileToken.value) {
    error.value = 'Por favor, complete a verificação de segurança primeiro.';
    return;
  }

  loading.value = true;
  error.value = null;
  
  try {
    // **SEC-04**: Verifica se Firebase foi carregado
    if (!$firebase || !$firebase.getFirebaseAuth) {
      throw new Error('Firebase não foi carregado. Recarregue a página e tente novamente.');
    }
    
    const auth = $firebase.getFirebaseAuth();
    const provider = $firebase.getGoogleProvider();
    
    if (!auth) {
      throw new Error('Serviço de autenticação não disponível.');
    }
    
    // **SEC-05**: Primeiro, verifica o token do CAPTCHA no servidor
    const { verifyToken } = useTurnstile();
    const isCaptchaValid = await verifyToken(turnstileToken.value);
    
    if (!isCaptchaValid) {
      // Reset do CAPTCHA se verificação falhar
      turnstileRef.value?.reset();
      isTurnstileVerified.value = false;
      turnstileToken.value = null;
      throw new Error('Verificação de segurança falhou. Tente novamente.');
    }
    
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    
    // **SEC-06**: Detectar invite_token da URL de forma segura
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get('invite_token');
    
    // **SEC-07**: Envia tanto o idToken quanto o turnstileToken para validação dupla
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        idToken, 
        inviteToken,
        turnstileToken: turnstileToken.value // Token CAPTCHA para validação adicional
      }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Backend error:', errorText);
      throw new Error('Falha ao autenticar.');
    }
    
    const data = await res.json();
    
    store.setUser({
      uid: data.uid,
      email: data.email,
      name: data.name,
      photoURL: data.photoURL,
      householdId: data.householdId,
    });
    
    // Redirect to home
    router.push('/home');
  } catch (e: any) {
    console.error('Login error:', e);
    error.value = e.message || 'Erro desconhecido.';
    
    // **UX-01**: Reset CAPTCHA em caso de erro para nova tentativa
    if (turnstileRef.value) {
      turnstileRef.value.reset();
      isTurnstileVerified.value = false;
      turnstileToken.value = null;
    }
  } finally {
    loading.value = false;
  }
}
</script>