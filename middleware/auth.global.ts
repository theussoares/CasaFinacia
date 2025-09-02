import { useSessionStore } from '~/stores/session';

export default defineNuxtRouteMiddleware((to) => {
    // **PERF-01**: Cache eterno de autenticação - verifica localStorage primeiro
    const hasEternalCache = () => {
        if (process.server) return false;
        try {
            return localStorage.getItem('user-auth-eternal') === 'true';
        } catch {
            return false;
        }
    };

    // **PERF-02**: No servidor, estratégia otimizada sem redirecionamentos agressivos
    if (process.server) {
        const sessionCookie = useCookie('session-token', { 
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            sameSite: 'lax',
            secure: true 
        });
        
        // **LAYOUT-SHIFT-FIX**: Só redireciona se realmente necessário
        // Se tem cache eterno, permite acesso direto à home
        if (to.path === '/home') {
            // Permite acesso direto à home - verificação será feita no cliente
            return;
        }
        
        // Se não há cookie E não tem cache eterno E tenta acessar página protegida
        if (!sessionCookie.value && to.path !== '/' && to.path !== '/convite') {
            return navigateTo('/');
        }
        
        // Se tem cookie e tenta acessar login, redireciona
        if (sessionCookie.value && to.path === '/') {
            return navigateTo('/home');
        }
        
        return; // Permite que SSR continue
    }

    // **PERF-03**: No cliente, estratégia não-bloqueante
    const sessionStore = useSessionStore();

    console.log('🔍 Middleware auth - Rota:', to.path);
    console.log('🔍 Auth ready:', sessionStore.isAuthReady);
    console.log('🔍 User logado:', !!sessionStore.user);
    console.log('🔍 Cache eterno:', hasEternalCache());

    // **LAYOUT-SHIFT-FIX**: Se está indo para home e tem cache eterno, permite
    if (to.path === '/home' && hasEternalCache()) {
        console.log('✅ Acesso direto à home com cache eterno');
        // **DEBUG**: Verifica se a store já tem dados
        if (sessionStore.user) {
            console.log('✅ Store já possui dados do usuário:', {
                name: sessionStore.user.name,
                photoURL: sessionStore.user.photoURL ? 'PRESENTE' : 'AUSENTE'
            });
        } else {
            console.log('⚠️ Cache eterno presente mas store vazia - dados serão carregados pelo plugin');
        }
        return;
    }

    // **PERF-04**: Só redireciona após auth estar pronto
    if (!sessionStore.isAuthReady) {
        console.log('⏳ Auth não pronto, permitindo navegação...');
        return;
    }

    // Se o utilizador está logado E tenta aceder à página de login
    if (sessionStore.user && to.path === '/') {
        console.log('🔄 Usuário logado tentando acessar login, redirecionando para /home');
        return navigateTo('/home');
    }

    // Se o utilizador NÃO está logado E tenta aceder a uma página protegida
    if (!sessionStore.user && to.path !== '/' && to.path !== '/convite') {
        console.log('🔄 Usuário não logado tentando acessar página protegida, redirecionando para /');
        return navigateTo('/');
    }

    console.log('✅ Middleware auth - passando pela rota');
});