import { useSessionStore } from '~/stores/session';
import { navigateTo } from '#app';

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/') return;
  if (!process.client) return; // Só executa no client
  const store = useSessionStore();
  let token: string | null = null;
  const urlToken = new URLSearchParams(window.location.search).get('token');
  token = urlToken || localStorage.getItem('invite_token');
  if (urlToken) {
    localStorage.setItem('invite_token', urlToken);
  }
  if (!token) {
    return navigateTo('/');
  }
  // Se já está autenticado e o token bate, não faz fetch nem redireciona
  if (store.user && store.user.token === token) return;
  try {
    store.loading = true;
    const { data } = await useFetch(`/api/user/by-token/${token}`);
    if (!data.value) throw new Error('Invalid token');
    const { uid, email, name, photoURL, token: userToken } = data.value as any;
    store.setUser({ uid, email, name, photoURL, token: userToken });
  } catch (e) {
    store.clearUser();
    return navigateTo('/');
  } finally {
    store.loading = false;
  }
});
