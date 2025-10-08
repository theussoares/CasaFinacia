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
            <input 
              id="name" 
              v-model="form.name" 
              :class="[
                'w-full p-2 border rounded-md',
                errors.name ? 'border-red-500' : 'border-gray-300'
              ]" 
              placeholder="Ex: Fotografia" 
              required 
              @input="clearErrors"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </fieldset>
          
          <fieldset class="mb-6">
            <label class="text-sm font-medium text-stone-700 block mb-1" for="goal">
              Meta (R$)
            </label>
            <input 
              id="goal" 
              v-model="displayGoal"
              v-currency-mask
              type="text" 
              inputmode="numeric"
              :class="[
                'w-full p-2 border rounded-md focus:ring-2 focus:ring-stone-400 focus:border-transparent',
                errors.goal ? 'border-red-500' : 'border-gray-300'
              ]" 
              placeholder="R$ 0,00" 
              @currency-input="handleGoalInput"
            />
            <p v-if="errors.goal" class="text-red-500 text-xs mt-1">{{ errors.goal }}</p>
          </fieldset>
          
          <div class="flex justify-end gap-4">
            <DialogClose as-child>
              <button 
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="button"
                :disabled="isSubmitting"
              >
                Cancelar
              </button>
            </DialogClose>
            <button 
              class="px-4 py-2 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2" 
              type="submit"
              :disabled="isSubmitting"
            >
              <svg 
                v-if="isSubmitting" 
                class="animate-spin h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Criando...' : 'Salvar' }}</span>
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

// **PERF-01**: Estados para a máscara de moeda no campo goal
const displayGoal = ref<string>('');

// **UX-02**: Estado para mensagens de erro
const errors = ref({ name: '', goal: '' });

// **UX-05**: Estado para controlar loading do botão
const isSubmitting = ref(false);

// **UX-01**: Handler para capturar valor numérico da diretiva
const handleGoalInput = (event: CustomEvent) => {
  console.log('Currency input event:', event);
  const detail = event.detail as { formatted: string; numeric: number };
  
  // Garante que sempre temos um número válido
  if (detail && typeof detail.numeric === 'number' && !isNaN(detail.numeric)) {
    displayGoal.value = detail.formatted;
    form.value.goal = detail.numeric;
    console.log('Form goal updated to:', form.value.goal, typeof form.value.goal);
    
    // Limpa erro da meta quando valor válido é inserido
    if (form.value.goal > 0) {
      errors.value.goal = '';
    }
  }
};

// **UX-03**: Função para limpar erros
const clearErrors = () => {
  errors.value = { name: '', goal: '' };
};

// **UX-04**: Função para validar formulário
const validateForm = () => {
  clearErrors();
  let isValid = true;
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Nome é obrigatório';
    isValid = false;
  }
  
  if (!form.value.goal || form.value.goal <= 0) {
    errors.value.goal = 'Meta deve ser maior que zero';
    isValid = false;
  }
  
  return isValid;
};

async function handleSubmit() {
  console.log('Submitting form:', form.value);
  
  if (!validateForm()) {
    console.error('Formulário inválido:', errors.value);
    return;
  }
  
  // **UX-06**: Previne múltiplos cliques durante o submit
  if (isSubmitting.value) {
    console.log('Já está submetendo, ignorando clique duplicado');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    await store.createSafe({ ...form.value });
    // **UX-07**: Reseta o formulário e fecha o modal
    form.value = { name: '', goal: 0 };
    displayGoal.value = '';
    clearErrors();
    emit('update:open', false);
  } catch (error) {
    console.error('Erro ao criar cofre:', error);
    // Mantém o modal aberto em caso de erro para o usuário tentar novamente
  } finally {
    isSubmitting.value = false;
  }
}
</script>