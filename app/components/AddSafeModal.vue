<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
      <DialogContent class="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-40 focus:outline-none">
        
        <DialogTitle class="text-stone-800 text-xl font-bold mb-4">
          Cadastrar Novo Cofre
        </DialogTitle>
        <DialogDescription class="text-stone-600 mb-5 text-sm">
          Defina um nome e uma meta de economia para o seu novo cofre.
        </DialogDescription>
        
        <form @submit.prevent="handleSubmit">
          <fieldset class="mb-4">
            <label class="text-sm font-medium text-stone-700 block mb-1" for="name">
              Nome do Cofre
            </label>
            <input id="name" v-model="form.name" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: Fotografia" required />
          </fieldset>
          
          <fieldset class="mb-6">
            <label class="text-sm font-medium text-stone-700 block mb-1" for="goal">
              Meta (R$)
            </label>
            <input id="goal" v-model.number="form.goal" type="number" step="0.01" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: 2500.00" required />
          </fieldset>
          
          <div class="flex justify-end gap-4">
            <DialogClose as-child>
              <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200" type="button">
                Cancelar
              </button>
            </DialogClose>
            <button class="px-4 py-2 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800" type="submit">
              Salvar
            </button>
          </div>
        </form>

        <DialogClose class="text-stone-500 hover:text-stone-700 absolute top-3 right-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogRoot, DialogPortal, DialogOverlay, DialogContent,
  DialogTitle, DialogDescription, DialogClose,
} from 'radix-vue';
import { useWeddingStore } from '~/stores/wedding';

// Controla a visibilidade do modal via props/events
defineProps<{ open: boolean }>();
const emit = defineEmits(['update:open']);

const store = useWeddingStore();
const form = ref({ name: '', goal: 0 });

async function handleSubmit() {
  if (form.value.name.trim() && form.value.goal > 0) {
    await store.createSafe({ ...form.value });
    // Reseta o formulário e fecha o modal
    form.value = { name: '', goal: 0 };
    emit('update:open', false);
  }
}
</script>