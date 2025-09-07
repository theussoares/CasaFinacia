/**
 * **PERF-01**: Diretiva para máscara de valores monetários brasileiros
 * Implementa formatação em tempo real com R$ e separadores de milhares
 */

// **A11Y-01**: Função para formatar valor como moeda brasileira
function formatToCurrency(value: string): string {
  // Remove tudo que não é número
  const numbersOnly = value.replace(/\D/g, '');
  
  if (!numbersOnly) return '';
  
  // Converte para centavos (divide por 100)
  const amount = parseInt(numbersOnly) / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// **PERF-02**: Função para extrair o valor numérico da string formatada
function extractNumericValue(formattedValue: string): number {
  const numbersOnly = formattedValue.replace(/\D/g, '');
  return numbersOnly ? parseInt(numbersOnly) / 100 : 0;
}

// **A11Y-02**: Função para posicionar cursor corretamente
function setCursorPosition(element: HTMLInputElement, position: number) {
  requestAnimationFrame(() => {
    element.setSelectionRange(position, position);
  });
}

export const currencyMaskDirective = {
  mounted(el: HTMLInputElement) {
    // **PERF-03**: Armazena o valor anterior para comparação
    let previousValue = '';
    let previousCursorPosition = 0;

    // **UX-01**: Handler principal para formatação
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const currentValue = target.value;
      const cursorPosition = target.selectionStart || 0;
      
      // Formata o valor
      const formattedValue = formatToCurrency(currentValue);
      
      if (formattedValue !== currentValue) {
        target.value = formattedValue;
        
        // **A11Y-03**: Calcula nova posição do cursor
        const lengthDifference = formattedValue.length - currentValue.length;
        const newCursorPosition = Math.min(
          cursorPosition + lengthDifference,
          formattedValue.length
        );
        
        setCursorPosition(target, newCursorPosition);
        
        // **PERF-04**: Dispara evento personalizado com valor numérico
        const numericValue = extractNumericValue(formattedValue);
        target.dispatchEvent(new CustomEvent('currency-input', {
          detail: { 
            formatted: formattedValue, 
            numeric: numericValue 
          }
        }));
        
        // Dispara evento input para atualizar v-model
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      previousValue = target.value;
      previousCursorPosition = target.selectionStart || 0;
    };

    // **UX-02**: Handler para teclas especiais
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLInputElement;
      const key = event.key;
      
      // **A11Y-04**: Permite teclas de navegação e edição
      const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'PageUp', 'PageDown'
      ];
      
      // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(key.toLowerCase())) {
        return;
      }
      
      // Permite teclas de navegação
      if (allowedKeys.includes(key)) {
        return;
      }
      
      // **SEC-01**: Bloqueia caracteres não numéricos
      if (!/^\d$/.test(key)) {
        event.preventDefault();
        return;
      }
    };

    // **UX-03**: Handler para paste
    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      const pastedText = event.clipboardData?.getData('text') || '';
      
      // Extrai apenas números do texto colado
      const numbersOnly = pastedText.replace(/\D/g, '');
      
      if (numbersOnly) {
        const currentNumbers = target.value.replace(/\D/g, '');
        const newValue = currentNumbers + numbersOnly;
        const formattedValue = formatToCurrency(newValue);
        
        target.value = formattedValue;
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    // **PERF-05**: Adiciona event listeners
    el.addEventListener('input', handleInput);
    el.addEventListener('keydown', handleKeyDown);
    el.addEventListener('paste', handlePaste);

    // **A11Y-05**: Configura atributos de acessibilidade
    el.setAttribute('inputmode', 'numeric');
    el.setAttribute('pattern', '[0-9]*');
    
    // **UX-04**: Configura placeholder se não existir
    if (!el.placeholder) {
      el.placeholder = 'R$ 0,00';
    }
  },

  // **PERF-06**: Cleanup ao desmontar
  unmounted(el: HTMLInputElement) {
    el.removeEventListener('input', () => {});
    el.removeEventListener('keydown', () => {});
    el.removeEventListener('paste', () => {});
  }
};

// **PERF-07**: Helper para componentes que precisam do valor numérico
export const useCurrencyMask = () => {
  const formatToCurrencyValue = formatToCurrency;
  const getNumericValue = extractNumericValue;
  
  return {
    formatToCurrency: formatToCurrencyValue,
    getNumericValue
  };
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('currency-mask', currencyMaskDirective);
});
