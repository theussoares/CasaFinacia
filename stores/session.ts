import { defineStore } from 'pinia';
import { ref } from 'vue';

type User = {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  token: string;
};

export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);

  // Restaura usuário do localStorage ao iniciar
  if (import.meta.client && !user.value) {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        user.value = JSON.parse(saved);
      } catch {}
    }
  }

  function setUser(u: User) {
    user.value = u;
    if (import.meta.client) {
      localStorage.setItem('invite_token', u.token);
      localStorage.setItem('user', JSON.stringify(u));
    }
  }

  function clearUser() {
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('invite_token');
      localStorage.removeItem('user');
    }
  }

  return { user, loading, setUser, clearUser };
});
