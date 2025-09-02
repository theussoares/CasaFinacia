<template>
  <div class="min-h-screen bg-rose-50">
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/40 z-30 md:hidden"
      aria-hidden="true"
    />
    
    <div class="flex flex-col flex-1">
      <DashboardHeader @open-sidebar="isSidebarOpen = true" />
      
      <main class="px-4 py-2 flex flex-col">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);
</script>