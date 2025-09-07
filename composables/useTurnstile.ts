/**
 * Composable para integração com Cloudflare Turnstile CAPTCHA
 * **SEC-01**: Proteção contra bots e ataques automatizados
 */

type TurnstileOptions = {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  language?: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
};

type TurnstileInstance = {
  render: (element: string | HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string;
};

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
    onTurnstileLoad?: () => void;
  }
}

export const useTurnstile = () => {
  const config = useRuntimeConfig();
  const isLoaded = ref(false);
  const isReady = ref(false);
  const currentWidgetId = ref<string | null>(null);
  const currentToken = ref<string | null>(null);
  const isVerified = ref(false);
  const error = ref<string | null>(null);

  // **SEC-02**: Função para carregar o script do Turnstile
  const loadTurnstileScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (process.server) {
        reject(new Error('Turnstile only works on client side'));
        return;
      }

      // Se já foi carregado, resolve imediatamente
      if (window.turnstile && isLoaded.value) {
        isReady.value = true;
        resolve();
        return;
      }

      // Se script já existe, aguarda carregar
      const existingScript = document.querySelector('script[src*="challenges.cloudflare.com"]');
      if (existingScript) {
        window.onTurnstileLoad = () => {
          isLoaded.value = true;
          isReady.value = true;
          resolve();
        };
        return;
      }

      // **PERF-01**: Carrega script dinamicamente
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
      script.async = true;
      script.defer = true;

      window.onTurnstileLoad = () => {
        isLoaded.value = true;
        isReady.value = true;
        resolve();
      };

      script.onerror = () => {
        error.value = 'Falha ao carregar CAPTCHA. Verifique sua conexão.';
        reject(new Error('Failed to load Turnstile script'));
      };

      document.head.appendChild(script);
    });
  };

  // **SEC-03**: Função para renderizar o widget
  const renderWidget = (
    element: string | HTMLElement, 
    options: Partial<TurnstileOptions> = {}
  ) => {
    return new Promise<string>((resolve, reject) => {
      if (!window.turnstile) {
        reject(new Error('Turnstile not loaded'));
        return;
      }

      if (!config.public.turnstileSiteKey) {
        reject(new Error('Turnstile site key not configured'));
        return;
      }

      // **PERF-01**: Verificar se o elemento existe no DOM
      let targetElement: HTMLElement | null = null;
      
      if (typeof element === 'string') {
        // Remove o # se estiver presente para usar getElementById
        const elementId = element.startsWith('#') ? element.slice(1) : element;
        targetElement = document.getElementById(elementId);
        
        if (!targetElement) {
          reject(new Error(`Element with ID "${elementId}" not found`));
          return;
        }
      } else {
        targetElement = element;
      }

      try {
        const widgetId = window.turnstile.render(targetElement, {
          sitekey: config.public.turnstileSiteKey as string,
          theme: 'auto',
          size: 'normal',
          ...options,
          callback: (token: string) => {
            currentToken.value = token;
            isVerified.value = true;
            error.value = null;
            options.callback?.(token);
          },
          'error-callback': () => {
            currentToken.value = null;
            isVerified.value = false;
            error.value = 'Erro na verificação. Tente novamente.';
            options['error-callback']?.();
          },
          'expired-callback': () => {
            currentToken.value = null;
            isVerified.value = false;
            error.value = 'Verificação expirada. Refaça o CAPTCHA.';
            options['expired-callback']?.();
          }
        });

        currentWidgetId.value = widgetId;
        resolve(widgetId);
      } catch (err) {
        reject(err);
      }
    });
  };

  // **SEC-04**: Função para resetar o widget
  const resetWidget = () => {
    if (window.turnstile && currentWidgetId.value) {
      window.turnstile.reset(currentWidgetId.value);
      currentToken.value = null;
      isVerified.value = false;
      error.value = null;
    }
  };

  // **SEC-05**: Função para remover o widget
  const removeWidget = () => {
    if (window.turnstile && currentWidgetId.value) {
      window.turnstile.remove(currentWidgetId.value);
      currentWidgetId.value = null;
      currentToken.value = null;
      isVerified.value = false;
      error.value = null;
    }
  };

  // **UI-01**: Função para obter o token atual
  const getToken = () => {
    if (window.turnstile && currentWidgetId.value) {
      return window.turnstile.getResponse(currentWidgetId.value);
    }
    return currentToken.value;
  };

  // **UX-01**: Função de inicialização completa
  const initialize = async (element: string | HTMLElement, options: Partial<TurnstileOptions> = {}) => {
    try {
      // **PERF-02**: Aguardar o script carregar
      await loadTurnstileScript();
      
      // **PERF-03**: Se elemento for string, aguardar estar no DOM
      if (typeof element === 'string') {
        const elementId = element.startsWith('#') ? element.slice(1) : element;
        let attempts = 0;
        const maxAttempts = 10;
        
        // **UX-02**: Tentar encontrar o elemento com retry
        while (attempts < maxAttempts) {
          const targetElement = document.getElementById(elementId);
          if (targetElement) {
            break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (attempts >= maxAttempts) {
          throw new Error(`Element with ID "${elementId}" not found after ${maxAttempts} attempts`);
        }
      }
      
      await renderWidget(element, options);
      return true;
    } catch (err: any) {
      console.error('Turnstile initialization error:', err);
      error.value = err.message || 'Falha ao carregar verificação de segurança.';
      return false;
    }
  };

  // **PERF-02**: Cleanup ao desmontar componente
  onBeforeUnmount(() => {
    removeWidget();
  });

  return {
    isLoaded: readonly(isLoaded),
    isReady: readonly(isReady),
    isVerified: readonly(isVerified),
    currentToken: readonly(currentToken),
    error: readonly(error),
    
    loadTurnstileScript,
    renderWidget,
    resetWidget,
    removeWidget,
    getToken,
    initialize
  };
};
