import { useSessionStore } from '~/stores/session';

export default defineNuxtRouteMiddleware((to) => {
    const sessionStore = useSessionStore();

    console.log('🔍 Middleware auth - Rota:', to.path);
    console.log('🔍 Auth ready:', sessionStore.isAuthReady);
    console.log('🔍 User logado:', !!sessionStore.user);

    // Se a verificação de auth ainda não terminou, não faz nada e espera.
    // A página `home.vue` irá mostrar o ecrã de "A verificar sessão...".
    if (!sessionStore.isAuthReady) {
        console.log('⏳ Aguardando auth ficar pronto...');
        return;
    }

    // Se o utilizador está logado E tenta aceder à página de login
    if (sessionStore.user && to.path === '/') {
        console.log('🔄 Usuário logado tentando acessar login, redirecionando para /home');
        return navigateTo('/home');
    }

    // Se o utilizador NÃO está logado E tenta aceder a uma página protegida
    if (!sessionStore.user && to.path !== '/') {
        console.log('🔄 Usuário não logado tentando acessar página protegida, redirecionando para /');
        return navigateTo('/');
    }

    console.log('✅ Middleware auth - passando pela rota');
});