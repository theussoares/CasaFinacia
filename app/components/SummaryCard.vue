<template>
  <section class="bg-white p-6 rounded-xl shadow-md mb-6">
    <h2 class="text-2xl font-bold text-stone-700 text-center mb-4">Resumo Geral</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <h3 class="text-sm font-medium text-stone-500">Meta Total</h3>
        <span class="text-2xl font-bold text-stone-800">{{ formatCurrency(store.totalGoal) }}</span>
      </div>
      <div>
        <h3 class="text-sm font-medium text-stone-500">Total Guardado</h3>
        <span class="text-2xl font-bold text-stone-800">{{ formatCurrency(store.totalSaved) }}</span>
      </div>
      <div>
        <h3 class="text-sm font-medium text-stone-500">Meses Restantes</h3>
        <span class="text-2xl font-bold text-stone-800">{{ store.monthsLeft }}</span>
      </div>
      <div>
        <h3 class="text-sm font-medium text-stone-500">Guardar por Mês</h3>
        <span class="text-2xl font-bold text-green-700">{{ formatCurrency(store.monthlySaving) }}</span>
      </div>
    </div>
    <div class="mt-6 flex flex-col items-center">
      <label for="wedding-date" class="font-medium text-stone-700 mb-2">Selecione a data do casamento:</label>
      <input 
        id="wedding-date"
        type="date" 
        v-model="store.weddingDate"
        class="p-2 border border-gray-300 rounded-lg cursor-pointer"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency';
import { useWeddingStore } from '~/stores/wedding';

const store = useWeddingStore();
const { formatCurrency } = useCurrency();
</script>