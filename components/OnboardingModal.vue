<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
      <DialogContent class="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[90vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg z-50 focus:outline-none">
        
        <div v-if="step === 1" class="text-center">
          <DialogTitle class="text-2xl font-serif font-bold text-pink-700 mb-4">
            Bem-vindos ao CasaFinacia!
          </DialogTitle>
          <DialogDescription class="text-gray-600 mb-6">
            Vamos começar a planejar o casamento dos seus sonhos em apenas 3 passos rápidos.
          </DialogDescription>
          <button @click="step = 2" class="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition-colors">
            Vamos começar!
          </button>
        </div>

        <div v-if="step === 2">
          <DialogTitle class="text-xl font-bold text-gray-800 mb-2">
            Qual é a data do grande dia?
          </DialogTitle>
          <DialogDescription class="text-gray-600 mb-6">
            Essa data nos ajudará a calcular suas metas mensais de economia.
          </DialogDescription>
          <input 
            type="date" 
            v-model="weddingStore.weddingDate"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <div class="mt-6 flex justify-end gap-4">
            <button @click="step = 1" class="text-gray-600 hover:text-gray-800 font-medium">Voltar</button>
            <button @click="handleDateSubmit" class="bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-pink-700 transition-colors" :disabled="!weddingStore.weddingDate">
              Próximo
            </button>
          </div>
        </div>

        <div v-if="step === 3">
          <DialogTitle class="text-xl font-bold text-gray-800 mb-2">
            Crie seu primeiro cofre
          </DialogTitle>
          <DialogDescription class="text-gray-600 mb-6">
            Para o que vocês estão economizando primeiro? Ex: "Vestido da Noiva", "Decoração", "Lua de Mel".
          </DialogDescription>
          <form @submit.prevent="handleSafeSubmit">
            <fieldset class="mb-4">
              <label class="text-sm font-medium text-gray-700 block mb-1" for="safe-name">Nome do Cofre</label>
              <input id="safe-name" v-model="form.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400" required />
            </fieldset>
            <fieldset class="mb-6">
              <label class="text-sm font-medium text-gray-700 block mb-1" for="safe-goal">Meta (R$)</label>
              <input id="safe-goal" v-model.number="form.goal" type="number" step="0.01" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400" required />
            </fieldset>
            <div class="mt-6 flex justify-end gap-4">
              <button @click="step = 2" type="button" class="text-gray-600 hover:text-gray-800 font-medium">Voltar</button>
              <button type="submit" class="bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-pink-700 transition-colors">
                Concluir
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from 'radix-vue';
import { useWeddingStore } from '~/stores/wedding';

defineProps<{ open: boolean }>();
const emit = defineEmits(['update:open']);

const weddingStore = useWeddingStore();
const step = ref(1);
const form = ref({ name: '', goal: 0 });

function handleDateSubmit() {
  if (weddingStore.weddingDate) {
    weddingStore.updateWeddingDate(weddingStore.weddingDate);
    step.value = 3;
  }
}

async function handleSafeSubmit() {
  if (form.value.name.trim() && form.value.goal > 0) {
    await weddingStore.createSafe({ ...form.value });
    emit('update:open', false);
  }
}
</script>