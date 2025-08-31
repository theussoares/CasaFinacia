<template>
  <article class="bg-white rounded-xl shadow-md p-6 transition-transform hover:-translate-y-1">
    <div class="flex justify-between items-baseline mb-2">
      <h3 class="text-xl font-bold text-stone-700">{{ safe.name }}</h3>
      <span class="text-sm font-medium text-gray-500">Meta: {{ formatCurrency(safe.goal) }}</span>
    </div>

    <p class="text-gray-600 mb-4">{{ formatCurrency(safe.current) }} guardados</p>

    <div class="bg-gray-200 rounded-full h-7 w-full mb-4 overflow-hidden" role="progressbar" :aria-valuenow="percentage.toFixed(0)" aria-valuemin="0" aria-valuemax="100">
      <div 
        class="bg-gradient-to-r from-stone-500 to-stone-700 h-full rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-700 ease-out"
        :style="{ width: `${percentage}%` }"
      >
        <span class="ml-12">{{ percentage.toFixed(1) }}%</span>
      </div>
    </div>

    <div class="flex gap-2">
      <input 
        v-model.number="amountToAdd"
        type="number" 
        :aria-label="`Adicionar valor para ${safe.name}`"
        placeholder="Valor" 
        class="flex-grow p-2 border border-gray-300 rounded-lg text-right"
        step="0.01"
        @keyup.enter="handleAddMoney"
      />
      <button 
        @click="handleAddMoney"
        class="px-4 py-2 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors"
      >
        Guardar
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency';
import { useWeddingStore } from '~/stores/wedding';

// It's good practice to define complex prop types.
type Safe = {
  id: string;
  name: string;
  goal: number;
  current: number;
};

// Use defineProps for strongly-typed component props.
const props = defineProps<{
  safe: Safe;
}>();

const store = useWeddingStore();
const { formatCurrency } = useCurrency();

// Local state for the input field.
const amountToAdd = ref<number | null>(null);

// PERF-03: Using a computed property is efficient. The percentage is only
// recalculated when `safe.current` or `safe.goal` changes.
const percentage = computed(() => {
  if (props.safe.goal <= 0) return 0;
  // Cap the percentage at 100% for the visual display.
  return Math.min((props.safe.current / props.safe.goal) * 100, 100);
});

// The handler function encapsulates the logic for updating the store.
const handleAddMoney = () => {
  if (amountToAdd.value && amountToAdd.value > 0) {
    store.addMoneyToSafe(props.safe.id, amountToAdd.value);
    amountToAdd.value = null; // Reset input for better UX
  }
};
</script>