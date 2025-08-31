<template>
	<main class="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
		<div class="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 border border-red-200">
			<h1 class="text-3xl font-bold text-red-700 mb-2 flex items-center gap-2">
				<svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"/></svg>
				Ocorreu um erro
			</h1>
			<p class="text-lg text-red-800 font-semibold mb-4" v-if="error.statusCode">
				Erro {{ error.statusCode }}: {{ error.statusMessage || error.message }}
			</p>
			<p class="text-base text-stone-700 mb-4" v-else>
				{{ error.message }}
			</p>
			<details class="bg-stone-100 rounded p-4 text-xs text-stone-600 select-all" v-if="error.stack">
				<summary class="cursor-pointer font-semibold text-stone-500 mb-2">Ver detalhes técnicos (stack trace)</summary>
				<pre class="whitespace-pre-wrap break-all">{{ error.stack }}</pre>
			</details>
			<button class="mt-6 px-4 py-2 bg-stone-700 text-white rounded hover:bg-stone-800 transition-colors" @click="reload">Recarregar página</button>
		</div>
	</main>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string; stack?: string } }>()
const reload = () => window.location.reload()
</script>
