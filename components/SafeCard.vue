<template>
  <article class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div class="flex justify-between items-baseline mb-2">
      <h3 class="text-xl font-bold text-gray-800">{{ safe.name }}</h3>
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-gray-500">Meta: {{ formatCurrency(safe.goal) }}</span>
        <button
          @click="showDeleteModal = true"
          class="text-gray-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
          :aria-label="`Excluir cofre ${safe.name}`"
          title="Excluir cofre"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    </div>

    <p class="text-gray-600 mb-4">{{ formatCurrency(safe.current) }} guardados</p>

    <div class="bg-pink-100 rounded-full h-7 w-full mb-4 overflow-hidden">
      <div 
        class="bg-gradient-to-r from-pink-500 to-pink-700 h-full rounded-full flex items-center justify-center text-gray-600 font-bold text-sm transition-all duration-700 ease-out"
        :style="{ width: `${percentage}%` }"
      >
        <span class="ml-10">{{ percentage.toFixed(1) }}%</span>
      </div>
    </div>

    <form @submit.prevent="handleAddMoney" class="flex gap-2 flex-col sm:!flex-row">
      <input 
        v-model="displayValue"
        v-currency-mask
        type="text"
        inputmode="numeric"
        :aria-label="`Adicionar valor para ${safe.name}`"
        placeholder="R$ 0,00" 
        class="flex-grow p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-pink-400 focus:border-transparent"
        @currency-input="handleCurrencyInput"
      />
      <button 
        type="submit"
        :disabled="!numericValue || numericValue <= 0"
        class="px-4 py-2 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Guardar
      </button>
    </form>
    
    <!-- Modal de confirmação de exclusão -->
    <DeleteSafeModal
      v-model:open="showDeleteModal"
      :safe-id="safe.id"
      :safe-name="safe.name"
      @deleted="handleDeleted"
    />
  </article>
</template>

<script setup lang="ts">
import { useWeddingStore } from '~/stores/wedding';

type Safe = { id: string; name: string; goal: number; current: number; };
const props = defineProps<{ safe: Safe; }>();
const store = useWeddingStore();
const { formatCurrency } = useCurrency();

// **PERF-01**: Estados para a máscara de moeda
const displayValue = ref<string>('');
const numericValue = ref<number>(0);

// **UX-03**: Estado para controlar o modal de exclusão
const showDeleteModal = ref(false);

const percentage = computed(() => {
  if (props.safe.goal <= 0) return 0;
  return Math.min((props.safe.current / props.safe.goal) * 100, 100);
});

// **UX-01**: Handler para capturar valor numérico da diretiva
const handleCurrencyInput = (event: CustomEvent) => {
  const detail = event.detail as { formatted: string; numeric: number };
  displayValue.value = detail.formatted;
  numericValue.value = detail.numeric;
};

// **PERF-02**: Handler otimizado para adicionar dinheiro
const handleAddMoney = () => {
  if (numericValue.value && numericValue.value > 0) {
    store.addMoneyToSafe(props.safe.id, numericValue.value);
    // **UX-02**: Limpa o input após adicionar
    displayValue.value = '';
    numericValue.value = 0;
  }
};

// **UX-04**: Handler para quando o cofre for excluído
const handleDeleted = () => {
  console.log('✅ Cofre excluído com sucesso');
};
</script>