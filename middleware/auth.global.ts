import { useSessionStore } from '~/stores/session';

export default defineNuxtRouteMiddleware((to) => {
    const sessionStore = useSessionStore();

    // Se a verificação de auth ainda não terminou, não faz nada e espera.
    // A página `home.vue` irá mostrar o ecrã de "A verificar sessão...".
    if (!sessionStore.isAuthReady) {
        return;
    }

    // Se o utilizador está logado E tenta aceder à página de login
    if (sessionStore.user && to.path === '/') {
        return navigateTo('/home');
    }

    // Se o utilizador NÃO está logado E tenta aceder a uma página protegida
    if (!sessionStore.user && to.path !== '/') {
        return navigateTo('/');
    }
});