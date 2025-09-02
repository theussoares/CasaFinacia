<template>
  <div class="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-6 mb-6">
    <div class="flex flex-col gap-4 md:!flex-row items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="bg-pink-100 p-3 rounded-full">
          <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-pink-800 mb-1">
            Convide seu parceiro(a)! 💕
          </h3>
          <p class="text-pink-600 text-sm">
            Planeje o casamento juntos e acompanhem o progresso em tempo real.
          </p>
        </div>
      </div>
      
      <div class="text-right">
        <button 
          @click="$emit('invite')"
          class="bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-md"
        >
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Convidar
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['invite']);
</script>
