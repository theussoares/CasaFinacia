<template>
  <div
    class="w-full h-screen md:bg-grayplay-100 p-4 md:p-28 flex flex-col justify-center items-center"
  >
    <div
      class="w-4/5 h-4/5 text-center bg-white md:border md:border-grayplay-100 rounded-2xl flex flex-col justify-center items-center"
    >
      <h1 class="font-medium text-2xl mb-2">Oops!</h1>
      <h2 class="font-medium text-xl mb-4">
        {{
          error?.statusCode === 404
            ? "Não encontramos a página que você está procurando"
            : "Não encontramos o que você está procurando"
        }}
        {{ error }}
        {{  error.stack }}
      </h2>
      <button
        class="bg-[#4D7C0F] hover:opacity-80 font-inter px-6 h-12 text-white rounded-md justify-center items-center font-medium"
        @click="handleAppError"
      >
        Voltar a pagina principal
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError
});

const handleAppError = () => {
  clearError({ redirect: "/" });
};
</script>
