<template>
  <div class="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 mb-6 border border-pink-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex -space-x-2">
          <!-- Avatar do usuário principal -->
          <UserAvatar 
            v-if="session.user"
            :photo-url="session.user.photoURL" 
            :name="session.user.name" 
            size="lg"
            class="border-2 border-white shadow-lg relative z-10"
          />
          <!-- Avatar placeholder para cônjuge -->
          <div v-if="!hasPartner" class="w-12 h-12 bg-pink-200 border-2 border-white shadow-lg rounded-full flex items-center justify-center relative z-0">
            <svg class="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
        </div>
        
        <div class="space-y-1">
          <h3 class="font-serif text-xl font-bold text-pink-800">
            {{ greeting }}
          </h3>
          <p class="text-pink-600 text-sm">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- Botão de convite -->
      <div v-if="!hasPartner" class="text-right space-y-2">
        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <button class="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-lg text-sm">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                Convidar Parceiro(a)
              </span>
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuPortal>
            <DropdownMenuContent 
              class="bg-white rounded-lg shadow-xl border border-gray-100 w-64 p-2 z-50"
              :side-offset="5"
            >
              <DropdownMenuItem @click="shareInvite" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-pink-50 hover:text-pink-700 cursor-pointer focus:outline-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span>{{ copied ? '✅ Link Copiado!' : '📋 Copiar Link' }}</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem @click="shareInviteWhatsApp" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 cursor-pointer focus:outline-none">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>💚 Enviar via WhatsApp</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
        
        <p class="text-xs text-pink-500">
          Plantem juntos!
        </p>
      </div>
    </div>

    <!-- Indicador de sucesso quando há parceiro -->
    <div v-if="hasPartner" class="mt-4 flex items-center gap-2 text-green-600 text-sm">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      <span class="font-medium">Vocês estão planejando juntos! 🎉</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session';
import { 
  DropdownMenuRoot, 
  DropdownMenuTrigger, 
  DropdownMenuPortal, 
  DropdownMenuContent, 
  DropdownMenuItem
} from 'radix-vue';

const session = useSessionStore();
const copied = ref(false);

// TODO: Implementar lógica para verificar se já existe um parceiro
const hasPartner = computed(() => {
  // Por enquanto, assumimos que não há parceiro
  // Isso deveria vir dos dados do household
  return false;
});

const greeting = computed(() => {
  const isConjugue = session.user && 'isConjugue' in session.user && (session.user as any).isConjugue;
  const firstName = session.user?.name?.split(' ')[0] || 'Usuário';
  
  if (hasPartner.value) {
    return `${firstName} e Parceiro(a)`;
  } else if (isConjugue) {
    return `Bem-vindo(a), ${firstName}!`;
  } else {
    return `Olá, ${firstName}!`;
  }
});

const subtitle = computed(() => {
  const isConjugue = session.user && 'isConjugue' in session.user && (session.user as any).isConjugue;
  
  if (hasPartner.value) {
    return 'Vocês estão planejando juntos o grande dia! 💕';
  } else if (isConjugue) {
    return 'Você aceitou o convite e agora podem planejar juntos! ✨';
  } else {
    return 'Convide seu parceiro(a) para planejar juntos! 💍';
  }
});

// Funções de convite (reutilizadas do DashboardHeader)
async function shareInvite() {
  copied.value = false;
  try {
    const { inviteUrl } = await $fetch('/api/household/invite', {
      method: 'POST',
    });
    
    await navigator.clipboard.writeText(inviteUrl);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2500);
  } catch (error: any) {
    console.error("Falha ao gerar o link de convite:", error);
    alert(`Não foi possível gerar o link de convite: ${error.data?.statusMessage || 'Erro de comunicação com o servidor.'}`);
  }
}

async function shareInviteWhatsApp() {
  try {
    const { inviteUrl } = await $fetch('/api/household/invite', {
      method: 'POST',
    });
    
    const message = `Oi amor! 💕 Te convido para planejarmos juntos nosso casamento no Planejando a Dois! 

É super fácil: clique no link abaixo para acessar nossa conta compartilhada e começar a economizar juntos para o grande dia! 

${inviteUrl}

Vamos tornar nosso sonho realidade! 💍✨`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  } catch (error: any) {
    console.error("Falha ao gerar o link de convite:", error);
    alert(`Não foi possível gerar o link de convite: ${error.data?.statusMessage || 'Erro de comunicação com o servidor.'}`);
  }
}
</script>
