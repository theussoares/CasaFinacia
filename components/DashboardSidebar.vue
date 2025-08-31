<template>
  <aside 
    class="fixed top-0 left-0 h-full w-64 bg-white border-r border-rose-100 flex flex-col transition-transform duration-300 ease-in-out z-40 md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="h-20 flex items-center justify-between px-4 border-b border-rose-100 flex-shrink-0">
      <NuxtLink to="/home" class="flex items-center gap-2">
        <NuxtImg src="/apple-touch-icon.png" alt="Logo Planejando a Dois" width="32" height="32" />
        <span class="font-bold text-lg text-gray-800">Planejando a Dois</span>
      </NuxtLink>
      <button @click="emit('close')" class="p-2 rounded-md text-gray-500 hover:bg-rose-100 hover:text-pink-600">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2">
      <NuxtLink to="/home" class="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 bg-rose-100 font-semibold">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        Painel
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);
</script>