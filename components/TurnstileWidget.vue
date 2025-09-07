<template>
  <ClientOnly>
    <div class="turnstile-wrapper">
      <!-- **A11Y-01**: Container com ID único para o widget -->
      <div 
        :id="containerId" 
        class="turnstile-container"
        :class="{ 
          'opacity-50': loading, 
          'border-red-200': hasError,
          'border-green-200': isVerified 
        }"
      ></div>
    
    <!-- **UX-01**: Loading state -->
    <div v-if="loading" class="text-center py-2">
      <div class="inline-flex items-center gap-2 text-sm text-gray-600">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Carregando verificação...
      </div>
    </div>
    
    <!-- **A11Y-02**: Mensagens de erro acessíveis -->
    <div 
      v-if="hasError" 
      class="text-red-600 text-sm mt-2"
      role="alert"
      aria-live="polite"
    >
      {{ errorMessage }}
    </div>
    
    <!-- **UX-02**: Indicador de sucesso -->
    <div 
      v-if="isVerified" 
      class="text-green-600 text-sm mt-2 flex items-center gap-1"
      aria-live="polite"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Verificação concluída
    </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  autoLoad?: boolean;
}

interface Emits {
  verified: [token: string];
  error: [error: string];
  expired: [];
  loaded: [];
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'auto',
  size: 'normal',
  autoLoad: true
});

const emit = defineEmits<Emits>();

// **PERF-01**: Composable para Turnstile
const {
  isLoaded,
  isReady,
  isVerified,
  currentToken,
  error,
  initialize,
  resetWidget,
  removeWidget
} = useTurnstile();

// **UX-03**: Estados locais
const loading = ref(true);
const containerId = ref(`turnstile-${Math.random().toString(36).substr(2, 9)}`);

// **UX-04**: Computed para estados de UI
const hasError = computed(() => !!error.value);
const errorMessage = computed(() => error.value || 'Erro na verificação');

// **PERF-02**: Inicialização do widget
const initializeWidget = async () => {
  // **SSR-01**: Só executa no cliente
  if (process.server) return;
  
  try {
    loading.value = true;
    
    // **DOM-01**: Aguarda elemento estar disponível no DOM
    await nextTick();
    
    let attempts = 0;
    const maxAttempts = 20; // Aumentei para 20 tentativas
    const elementId = containerId.value;
    
    // **UX-01**: Função para verificar se elemento existe
    const waitForElement = (): Promise<HTMLElement> => {
      return new Promise((resolve, reject) => {
        const checkElement = () => {
          const element = document.getElementById(elementId);
          if (element) {
            console.log(`✅ Elemento ${elementId} encontrado no DOM`);
            resolve(element);
            return;
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error(`Elemento ${elementId} não encontrado no DOM após ${maxAttempts} tentativas`));
            return;
          }
          
          console.log(`⏳ Tentativa ${attempts}/${maxAttempts} - Aguardando elemento ${elementId}...`);
          setTimeout(checkElement, 100);
        };
        
        checkElement();
      });
    };
    
    // **DOM-02**: Aguarda elemento estar disponível
    const element = await waitForElement();
    
    const success = await initialize(element, {
      theme: props.theme,
      size: props.size,
      callback: (token: string) => {
        emit('verified', token);
      },
      'error-callback': () => {
        emit('error', error.value || 'Erro na verificação');
      },
      'expired-callback': () => {
        emit('expired');
      }
    });

    if (success) {
      emit('loaded');
    }
  } catch (err: any) {
    console.error('Failed to initialize Turnstile:', err);
    emit('error', err.message || 'Falha ao carregar verificação de segurança');
  } finally {
    loading.value = false;
  }
};

// **UX-05**: Método público para reset
const reset = () => {
  resetWidget();
};

// **UX-06**: Método público para obter token atual
const getToken = () => {
  return currentToken.value;
};

// **PERF-03**: Auto-inicialização
onMounted(async () => {
  if (props.autoLoad) {
    // **UX-02**: Aguardar múltiplos ticks para garantir que o DOM esteja pronto
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno delay adicional
    
    initializeWidget();
  }
});

// **PERF-04**: Cleanup
onBeforeUnmount(() => {
  removeWidget();
});

// **UX-07**: Expor métodos para componente pai
defineExpose({
  reset,
  getToken,
  initialize: initializeWidget,
  isVerified: readonly(isVerified),
  isReady: readonly(isReady),
  hasError: readonly(hasError)
});
</script>

<style scoped>
.turnstile-container {
  transition: all 0.2s;
  border-radius: 0.5rem;
  min-height: 65px; /* Altura mínima para evitar layout shift */
}

.turnstile-wrapper {
  width: 100%;
}

/* **A11Y-03**: Estilos para diferentes temas */
@media (prefers-color-scheme: dark) {
  .turnstile-container {
    background-color: #1f2937;
  }
}
</style>
