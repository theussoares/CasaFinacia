<template>
  <section class="bg-white p-6 rounded-xl shadow-md mb-6">
    <h2 class="text-2xl font-bold text-stone-700 mb-2">Guardar Dinheiro</h2>
    <p class="text-stone-600 mb-4">Adicione um valor abaixo para distribuir igualmente entre todos os cofres.</p>
    <div class="flex flex-col sm:flex-row gap-2">
      <label for="distribute-amount" class="sr-only">Valor a ser distribuído</label>
      <input 
        id="distribute-amount"
        v-model="displayValue"
        v-currency-mask
        inputmode="numeric"
        type="text" 
        placeholder="R$ 0,00"
        class="flex-grow p-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-stone-400 focus:border-transparent"
        @currency-input="handleCurrencyInput"
      />
      <button 
        @click="handleDistribution"
        :disabled="!numericValue || numericValue <= 0"
        class="px-6 py-3 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Distribuir Igualmente
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useWeddingStore } from '~/stores/wedding';

const store = useWeddingStore();

// **PERF-01**: Estados para a máscara de moeda
const displayValue = ref<string>('');
const numericValue = ref<number>(0);

// **UX-01**: Handler para capturar valor numérico da diretiva
const handleCurrencyInput = (event: CustomEvent) => {
  const detail = event.detail as { formatted: string; numeric: number };
  displayValue.value = detail.formatted;
  numericValue.value = detail.numeric;
};

// **PERF-02**: Handler otimizado para distribuição
const handleDistribution = () => {
  if (numericValue.value && numericValue.value > 0) {
    store.distributeFunds(numericValue.value);
    // **UX-02**: Limpa o input após distribuir
    displayValue.value = '';
    numericValue.value = 0;
  }
};
</script>