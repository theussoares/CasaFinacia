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
                <!-- <DropdownMenuItem @click="shareInvite" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-rose-50 hover:text-pink-700 cursor-pointer focus:outline-none">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                   <span>{{ copied ? 'Link Copiado!' : 'Convidar Cônjuge' }}</span>
                </DropdownMenuItem> -->
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
</script>