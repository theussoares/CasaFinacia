<template>
  <section class="bg-white p-6 rounded-xl shadow-md mb-6">
    <h2 class="text-2xl font-bold text-stone-700 mb-2">Guardar Dinheiro</h2>
    <p class="text-stone-600 mb-4">Adicione um valor abaixo para distribuir igualmente entre todos os cofres.</p>
    <div class="flex flex-col sm:flex-row gap-2">
      <label for="distribute-amount" class="sr-only">Valor a ser distribuído</label>
      <input 
        id="distribute-amount"
        v-model="amountToDistribute"
        @input="handleInput"
        inputmode="decimal"
        type="number" 
        placeholder="Ex: 500.00"
        class="flex-grow p-3 border border-gray-300 rounded-lg text-right"
      />
      <button 
        @click="handleDistribution"
        class="px-6 py-3 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors"
      >
        Distribuir Igualmente
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useWeddingStore } from '~/stores/wedding';

const store = useWeddingStore();
const amountToDistribute = ref<number | null>(null);

// Função para sanitizar input numérico
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  
  // Substitui vírgula por ponto
  value = value.replace(/,/g, '.');
  
  // Remove qualquer caracter que não seja dígito ou ponto
  value = value.replace(/[^0-9.]/g, '');
  
  // Garante apenas um ponto decimal
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  
  target.value = value;
  amountToDistribute.value = value ? parseFloat(value) : null;
};

const handleDistribution = () => {
  if (amountToDistribute.value && amountToDistribute.value > 0) {
    store.distributeFunds(amountToDistribute.value);
    amountToDistribute.value = null; // Reset input
  }
};
</script>