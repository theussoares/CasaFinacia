<template>
  <header class="bg-white border-b border-rose-100 w-full sticky top-0 z-40">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 ">
      <div class="flex items-center justify-between h-16">
        <!-- Avatares e Informações -->
        <div class="flex items-center gap-3">
          <div class="flex -space-x-2">
            <!-- Avatar do usuário atual -->
            <UserAvatar 
              v-if="session.user"
              :photo-url="session.user?.photoURL" 
              :name="session.user?.name" 
              size="md"
              class="border-2 border-white shadow-lg relative z-10"
            />
            
            <!-- Avatar do cônjuge ou placeholder -->
            <UserAvatar 
              v-if="partner"
              :photo-url="partner?.photoURL" 
              :name="partner?.name" 
              size="md"
              class="border-2 border-white shadow-lg relative z-0"
            />
            <div v-else class="w-10 h-10 bg-pink-200 border-2 border-white shadow-lg rounded-full flex items-center justify-center relative z-0">
              <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
          </div>
          
          <!-- Informações do usuário -->
          <div class="hidden sm:flex sm:flex-col sm:min-w-0 sm:flex-1">
            <p class="text-gray-800 font-semibold text-sm truncate">
              {{ greeting }}
            </p>
            <p class="text-gray-500 text-xs truncate">
              {{ subtitle }}
            </p>
          </div>
        </div>

        <!-- Menu de Ações -->
        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <button class="p-2 rounded-full hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuPortal>
            <DropdownMenuContent 
              class="bg-white rounded-lg shadow-xl border border-gray-100 w-64 p-2 z-50"
              :side-offset="5"
              :align="'end'"
            >
              <!-- Informações do usuário (mobile) -->
              <div class="px-3 py-2 border-b border-gray-100 sm:hidden">
                <p class="font-medium text-gray-800">{{ session.user?.name?.split(' ')[0] }}</p>
                <p class="text-xs text-gray-500">{{ session.user?.email }}</p>
              </div>

              <!-- Opções de Convite (se não tiver parceiro) -->
              <template v-if="!partner">
                <div class="px-3 py-2">
                  <p class="text-xs text-gray-500 font-medium mb-2">CONVIDAR PARCEIRO(A)</p>
                </div>
                
                <DropdownMenuItem @click="shareInvite" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-pink-50 hover:text-pink-700 cursor-pointer focus:outline-none">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <div class="flex-1">
                    <span>{{ copied ? '✅ Link Copiado!' : '📋 Copiar Link' }}</span>
                    <p class="text-xs text-gray-500">Link de convite</p>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem @click="shareInviteWhatsApp" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 cursor-pointer focus:outline-none">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <div class="flex-1">
                    <span>💚 Enviar WhatsApp</span>
                    <p class="text-xs text-gray-500">Convite via mensagem</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator class="h-px bg-gray-100 my-2" />
              </template>

              <!-- Status do Casal (se tiver parceiro) -->
              <template v-else>
                <div class="px-3 py-2 border-b border-gray-100">
                  <div class="flex items-center gap-2 text-green-600 text-sm">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="font-medium">Planejando juntos! 🎉</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Você e {{ partner.name?.split(' ')[0] }}</p>
                </div>
              </template>

              <!-- Logout -->
              <DropdownMenuItem @click="logout" class="flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 cursor-pointer focus:outline-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Sair da Conta</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session';
import { 
  DropdownMenuRoot, 
  DropdownMenuTrigger, 
  DropdownMenuPortal, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from 'radix-vue';

const session = useSessionStore();
const copied = ref(false);
const partner = ref(null);
const loading = ref(true);

// Computed values para greeting e subtitle
const greeting = computed(() => {
  const isConjugue = session.user && 'isConjugue' in session.user && (session.user as any).isConjugue;
  const firstName = session.user?.name?.split(' ')[0] || 'Usuário';
  
  if (partner.value) {
    return `${firstName} e ${(partner.value as any).name?.split(' ')[0]}`;
  } else if (isConjugue) {
    return `Bem-vindo(a), ${firstName}!`;
  } else {
    return `Olá, ${firstName}!`;
  }
});

const subtitle = computed(() => {
  const isConjugue = session.user && 'isConjugue' in session.user && (session.user as any).isConjugue;
  
  if (partner.value) {
    return 'Planejando juntos o grande dia! 💕';
  } else if (isConjugue) {
    return 'Agora podem planejar juntos! ✨';
  } else {
    return 'Convide seu parceiro(a)! 💍';
  }
});

// Buscar dados do household ao montar o componente
onMounted(async () => {
  if (session.user) {
    try {
      const response = await $fetch('/api/household/users') as { users: any[] };
      const otherUsers = response.users.filter((user: any) => user.uid !== session.user?.uid);
      if (otherUsers.length > 0) {
        partner.value = otherUsers[0];
      }
    } catch (error) {
      console.error('Error fetching household users:', error);
    } finally {
      loading.value = false;
    }
  }
});

// Funções de convite
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

async function logout() {
  await session.logout();
}
</script>
