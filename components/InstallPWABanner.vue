<template>
  <Transition name="slide-up">
    <div 
      v-if="showInstallPrompt" 
      class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-600 to-pink-700 text-white p-4 shadow-2xl z-50 border-t-4 border-pink-400"
    >
      <div class="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 flex-1">
          <div class="bg-white/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold text-sm sm:text-base">Adicione à Tela Inicial</p>
            <p class="text-xs sm:text-sm text-pink-100">Acesse rapidamente e use offline</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            @click="dismissPrompt"
            class="px-3 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            Agora não
          </button>
          <button
            @click="installApp"
            class="px-4 py-2 bg-white text-pink-600 font-semibold rounded-lg hover:bg-pink-50 transition-colors text-sm sm:text-base shadow-lg"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const showInstallPrompt = ref(false);
let deferredPrompt: any = null;

onMounted(() => {
  // **PWA-01**: Verifica se já foi instalado
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ App já está instalado');
    return;
  }

  // **PWA-02**: Verifica se o usuário já dispensou o prompt
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (dismissed) {
    const dismissedDate = new Date(dismissed);
    const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Mostra novamente após 7 dias
    if (daysSinceDismissed < 7) {
      console.log('ℹ️ Usuário dispensou recentemente, não mostrando prompt');
      return;
    }
  }

  // **PWA-03**: Listener para o evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostra o prompt após 3 segundos para não ser intrusivo
    setTimeout(() => {
      showInstallPrompt.value = true;
    }, 3000);
  });

  // **PWA-04**: Listener para quando o app for instalado
  window.addEventListener('appinstalled', () => {
    console.log('✅ App instalado com sucesso!');
    showInstallPrompt.value = false;
    deferredPrompt = null;
  });

  // **iOS-01**: Detecta iOS e mostra instruções específicas
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS && !window.navigator.standalone) {
    // Para iOS, mostra instruções diferentes após alguns segundos
    const iosPromptDismissed = localStorage.getItem('ios-install-dismissed');
    if (!iosPromptDismissed) {
      setTimeout(() => {
        showInstallPrompt.value = true;
      }, 5000);
    }
  }
});

async function installApp() {
  if (!deferredPrompt) {
    // Para iOS, apenas fecha o banner (usuário precisa usar Share > Add to Home Screen)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      alert('Para instalar no iOS:\n1. Toque no botão Compartilhar\n2. Role para baixo\n3. Toque em "Adicionar à Tela de Início"');
      showInstallPrompt.value = false;
      localStorage.setItem('ios-install-dismissed', new Date().toISOString());
    }
    return;
  }

  // Mostra o prompt nativo
  deferredPrompt.prompt();
  
  // Aguarda a escolha do usuário
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} instalar o app`);
  
  if (outcome === 'accepted') {
    showInstallPrompt.value = false;
  }
  
  deferredPrompt = null;
}

function dismissPrompt() {
  showInstallPrompt.value = false;
  localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  console.log('ℹ️ Usuário dispensou o prompt de instalação');
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
