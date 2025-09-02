<template>
  <header class="flex-shrink-0 bg-white border-b border-rose-100 w-full md:hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <div class="flex items-center gap-4">
          <!-- <button @click="emit('openSidebar')" class="p-2 rounded-md text-gray-500 hover:bg-rose-100 hover:text-pink-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button> -->
          <!-- <button @click="emit('openSidebar')" class="p-2 rounded-md text-gray-500 hover:bg-rose-100 hover:text-pink-600 md:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button> -->
          <div class="flex items-center gap-2">
            <span class="text-gray-700 font-medium">
                Olá <b class="text-rose-500">{{ session.user?.name ? session.user.name.split(' ')[0] : 'Usuário' }}</b>
                <span v-if="session.user && 'isConjugue' in session.user && (session.user as any).isConjugue">
                     ou olá cônjuge do <b class="text-rose-500">{{ session.user?.name ? session.user.name.split(' ')[0] : 'Usuário' }}</b>
                </span>
            </span>
          </div>
        </div>
        
        <div v-if="session.user" class="flex items-center gap-4"
        >
          <span class="text-gray-700 font-medium hidden md:block">Bem-vindo(a), {{ session.user?.name ? session.user.name.split(' ')[0] : 'Usuário' }}!</span>
          
          <DropdownMenuRoot>
            <DropdownMenuTrigger as-child>
              <button class="focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full">
                <UserAvatar 
                  :photo-url="session.user?.photoURL" 
                  :name="session.user?.name" 
                  size="md"
                />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuPortal>
              <DropdownMenuContent 
                class="bg-white rounded-lg shadow-lg border border-gray-100 w-56 p-2 z-50"
                :side-offset="5"
              >
                <!-- Convite removido da versão mobile - usar CoupleInfo -->
                <DropdownMenuSeparator class="h-px bg-gray-100 my-1" />
                <DropdownMenuItem @click="logout" class="flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 cursor-pointer focus:outline-none">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>
      </div>
    </div>
</header>
<div v-if="session.user" class="hidden md:flex items-center gap-4 md:fixed md:top-10 md:right-4"
    >
      <span class="text-gray-700 font-medium hidden md:block">Bem-vindo(a), {{ session.user?.name ? session.user.name.split(' ')[0] : 'Usuário' }}!</span>
      
      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <button class="focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full">
            <UserAvatar 
              :photo-url="session.user?.photoURL" 
              :name="session.user?.name" 
              size="md"
            />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuPortal>
          <DropdownMenuContent 
            class="bg-white rounded-lg shadow-lg border border-gray-100 w-56 p-2 z-50"
            :side-offset="5"
          >
            <DropdownMenuItem @click="shareInvite" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-rose-50 hover:text-pink-700 cursor-pointer focus:outline-none">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
               <span>{{ copied ? 'Link Copiado!' : 'Convidar Cônjuge' }}</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="shareInviteWhatsApp" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-rose-50 hover:text-pink-700 cursor-pointer focus:outline-none">
               <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
               <span>Enviar via WhatsApp</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator class="h-px bg-gray-100 my-1" />
            <DropdownMenuItem @click="logout" class="flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 cursor-pointer focus:outline-none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </div>
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

const emit = defineEmits(['openSidebar']);

const session = useSessionStore();
const copied = ref(false);

// Ação de logout corrigida para usar a store, que chama o endpoint da API
async function logout() {
  await session.logout();
}

// Ação de partilha corrigida para chamar o endpoint correto da API
async function shareInvite() {
  copied.value = false;
  try {
    // SEC-03: Chama o endpoint seguro para gerar um link de convite.
    const { inviteUrl } = await $fetch('/api/household/invite', {
      method: 'POST',
    });
    
    await navigator.clipboard.writeText(inviteUrl);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2500);
  } catch (error: any) {
    console.error("Falha ao gerar o link de convite:", error);
    // Fornece feedback claro ao utilizador
    alert(`Não foi possível gerar o link de convite: ${error.data?.statusMessage || 'Erro de comunicação com o servidor.'}`);
  }
}

// Ação para compartilhar via WhatsApp
async function shareInviteWhatsApp() {
  try {
    // SEC-03: Chama o endpoint seguro para gerar um link de convite.
    const { inviteUrl } = await $fetch('/api/household/invite', {
      method: 'POST',
    });
    
    const message = `Oi! 💕 Te convido para planejarmos juntos nosso casamento no Planejando a Dois! 

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