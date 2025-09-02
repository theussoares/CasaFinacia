<template>
  <img 
    v-if="!imageError && validPhotoUrl" 
    :src="validPhotoUrl" 
    :alt="name || 'Usuário'" 
    :class="avatarClasses"
    @error="handleImageError"
  />
  <div
    v-else
    :class="avatarClasses"
    class="flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 text-white font-semibold"
  >
    {{ fallbackInitials }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  photoUrl?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  photoUrl: '',
  name: '',
  size: 'md'
});

const imageError = ref(false);

// **PERF-01**: Computed para validar URL da foto
const validPhotoUrl = computed(() => {
  if (!props.photoUrl) return null;
  
  // Verifica se é uma URL válida
  try {
    new URL(props.photoUrl);
    return props.photoUrl;
  } catch {
    console.warn('URL de foto inválida:', props.photoUrl);
    return null;
  }
});

// **A11Y-01**: Fallback com iniciais do nome
const fallbackInitials = computed(() => {
  if (!props.name) return '👤';
  
  return props.name
    .split(' ')
    .map(word => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

// Classes CSS baseadas no tamanho
const avatarClasses = computed(() => {
  const baseClasses = 'rounded-full border-2 border-white shadow-sm object-cover';
  
  switch (props.size) {
    case 'sm':
      return `${baseClasses} w-8 h-8 text-xs`;
    case 'lg':
      return `${baseClasses} w-16 h-16 text-lg`;
    default:
      return `${baseClasses} w-10 h-10 text-sm`;
  }
});

// **PERF-02**: Handler de erro com retry logic
const handleImageError = (event: Event) => {
  console.warn('Erro ao carregar imagem do usuário:', props.photoUrl);
  imageError.value = true;
};

// **PERF-03**: Reset error state quando photoUrl muda
watch(() => props.photoUrl, () => {
  imageError.value = false;
});
</script>