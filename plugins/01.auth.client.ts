import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { useSessionStore } from '~/stores/session';

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig().public;
    const sessionStore = useSessionStore();

    // 1. Inicializa o Firebase
    const firebaseApp = initializeApp({
        apiKey: config.firebaseApiKey as string,
        authDomain: config.firebaseAuthDomain as string,
        projectId: config.firebaseProjectId as string,
        storageBucket: config.firebaseStorageBucket as string,
        messagingSenderId: config.firebaseMessagingSenderId as string,
        appId: config.firebaseAppId as string,
    });

    const auth = getAuth(firebaseApp);

    // 2. Fornece os helpers para a aplicação
    nuxtApp.provide('firebase', {
        getFirebaseAuth: () => auth,
        getGoogleProvider: () => new GoogleAuthProvider()
    });

    // 3. Processa o resultado de um login por redirecionamento
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            // Se houver um resultado, o utilizador acabou de fazer login.
            const idToken = await result.user.getIdToken();
            const inviteToken = localStorage.getItem('invite_token');

            // Esta é a chamada única que sincroniza tudo: cria o utilizador,
            // define o cookie de sessão e retorna os dados do utilizador.
            const userData = await $fetch('/api/auth/google', {
                method: 'POST',
                body: { idToken, inviteToken },
            });

            sessionStore.setUser(userData as any);

            // Limpa o token de convite para que não seja reutilizado.
            if (inviteToken) {
                localStorage.removeItem('invite_token');
            }
        }
    } catch (error) {
        console.error("Erro ao processar o resultado do redirecionamento:", error);
    }

    // 4. Ouve as mudanças de estado para manter a sessão atualizada
    // (essencial para o logout e para a verificação inicial)
    onAuthStateChanged(auth, async (user) => {
        if (user && !sessionStore.user) {
            // Se o utilizador está logado no Firebase mas não na nossa store, sincroniza
            try {
                const { user: appUser } = await $fetch('/api/auth/me');
                sessionStore.setUser(appUser);
            } catch (e) {
                sessionStore.setUser(null);
            }
        } else if (!user) {
            sessionStore.setUser(null);
        }

        // Marca a autenticação como pronta para renderizar a página
        sessionStore.setAuthReady();
    });

    // 5. Aguarda que a verificação inicial termine antes de renderizar a aplicação
    await new Promise<void>(resolve => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            if (sessionStore.isAuthReady) {
                unsubscribe();
                resolve();
            }
        });
    });
});