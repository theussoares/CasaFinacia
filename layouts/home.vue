<template>
  <div class="min-h-screen bg-rose-50">
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/30 z-30"
    />

    <!-- <DashboardSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" /> -->
    
    <div class="flex-1 flex flex-col">
      <DashboardHeader @open-sidebar="isSidebarOpen = true" />
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);
</script>