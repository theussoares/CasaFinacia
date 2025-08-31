<template>
  <article class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div class="flex justify-between items-baseline mb-2">
      <h3 class="text-xl font-bold text-gray-800">{{ safe.name }}</h3>
      <span class="text-sm font-medium text-gray-500">Meta: {{ formatCurrency(safe.goal) }}</span>
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
        v-model.number="amountToAdd"
        type="number" 
        :aria-label="`Adicionar valor para ${safe.name}`"
        placeholder="Valor" 
        class="flex-grow p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-pink-400 focus:border-transparent"
        step="0.01"
      />
      <button 
        type="submit"
        class="px-4 py-2 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors"
      >
        Guardar
      </button>
    </form>
  </article>
</template>

<script setup lang="ts">
import { useWeddingStore } from '~/stores/wedding';

type Safe = { id: string; name: string; goal: number; current: number; };
const props = defineProps<{ safe: Safe; }>();
const store = useWeddingStore();
const { formatCurrency } = useCurrency();
const amountToAdd = ref<number | null>(null);

const percentage = computed(() => {
  if (props.safe.goal <= 0) return 0;
  return Math.min((props.safe.current / props.safe.goal) * 100, 100);
});

const handleAddMoney = () => {
  if (amountToAdd.value && amountToAdd.value > 0) {
    store.addMoneyToSafe(props.safe.id, amountToAdd.value);
    amountToAdd.value = null;
  }
};
</script>