import { useSessionStore } from '~/stores/session';

export default defineNuxtPlugin(() => {
  if (process.client) {
    const store = useSessionStore();
    if (!store.user) {
      const saved = localStorage.getItem('user');
      if (saved) {
        try {
          store.setUser(JSON.parse(saved));
        } catch {}
      }
    }
  }
});
