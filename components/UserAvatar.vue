<template>
  <img 
    :src="photoUrl" 
    :alt="name || 'Usuário'" 
    :class="avatarClasses"
    @error="handleImageError"
  />
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

// Classes CSS baseadas no tamanho
const avatarClasses = computed(() => {
  const baseClasses = 'rounded-full border-2 border-white shadow-sm object-cover';
  
  switch (props.size) {
    case 'sm':
      return `${baseClasses} w-8 h-8`;
    case 'lg':
      return `${baseClasses} w-16 h-16`;
    default:
      return `${baseClasses} w-10 h-10`;
  }
});

// Se a imagem falhar, define uma imagem padrão
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik0xMiAxNkMxMiAxMi42ODYzIDE0LjY4NjMgMTAgMTggMTBIMjJDMjUuMzEzNyAxMCAyOCAxMi42ODYzIDI4IDE2VjI0QzI4IDI3LjMxMzcgMjUuMzEzNyAzMCAyMiAzMEgxOEMxNC42ODYzIDMwIDEyIDI3LjMxMzcgMTIgMjRWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzFfMSIgeDE9IjIwIiB5MT0iMCIgeDI9IjIwIiB5Mj0iNDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0VDNDA5OSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGODcxNzEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K';
};
</script>
