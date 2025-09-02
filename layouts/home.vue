<template>
  <div class="min-h-screen bg-rose-50">
    <div class="flex flex-col flex-1">
      <UnifiedHeader />
      
      <main class="md:!px-4 py-2 flex flex-col">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout sem sidebar, header simplificado
</script>