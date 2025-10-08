<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
      <DialogContent class="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-40 focus:outline-none">
        
        <DialogTitle class="text-stone-800 text-xl font-bold mb-4">
          Confirmar Exclusão
        </DialogTitle>
        <DialogDescription class="text-stone-600 mb-6 text-sm leading-relaxed">
          Tem certeza que deseja excluir o cofre <strong class="text-stone-800">"{{ safeName }}"</strong>?
          <br><br>
          Esta ação não pode ser desfeita. Todo o progresso e valores guardados serão perdidos.
        </DialogDescription>
        
        <div class="flex justify-end gap-3">
          <DialogClose as-child>
            <button 
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="button"
              :disabled="isDeleting"
            >
              Cancelar
            </button>
          </DialogClose>
          <button 
            class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2" 
            type="button"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            <svg 
              v-if="isDeleting" 
              class="animate-spin h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isDeleting ? 'Excluindo...' : 'Excluir' }}</span>
          </button>
        </div>

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

const props = defineProps<{ 
  open: boolean;
  safeId: string;
  safeName: string;
}>();

const emit = defineEmits(['update:open', 'deleted']);

const store = useWeddingStore();
const isDeleting = ref(false);

async function handleDelete() {
  if (isDeleting.value) return;
  
  isDeleting.value = true;
  
  try {
    await store.deleteSafe(props.safeId);
    emit('deleted');
    emit('update:open', false);
  } catch (error) {
    console.error('Erro ao excluir cofre:', error);
    // O erro já é tratado no store, aqui apenas mantém o modal aberto
  } finally {
    isDeleting.value = false;
  }
}
</script>
