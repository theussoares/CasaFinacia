import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
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

    // 3. Processa o resultado do redirecionamento do login
    // Esta função só retorna um resultado se o utilizador acabou de ser redirecionado do Google.
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            const idToken = await result.user.getIdToken();
            // Obtém o token de convite que guardámos antes do redirecionamento
            const inviteToken = localStorage.getItem('invite_token');

            // Sincroniza com o backend, que irá criar o utilizador/sessão e definir o cookie
            await $fetch('/api/auth/google', {
                method: 'POST',
                body: { idToken, inviteToken },
            });

            // Limpa o token de convite para que não seja reutilizado
            if (inviteToken) {
                localStorage.removeItem('invite_token');
            }
        }
    } catch (error) {
        console.error("Erro ao processar o resultado do redirecionamento:", error);
    }

    // 4. Ouve continuamente as mudanças de estado para manter a UI sincronizada
    onAuthStateChanged(auth, async (user) => {
        if (user && !sessionStore.user) {
            try {
                const { user: appUser } = await $fetch('/api/auth/me');
                sessionStore.setUser(appUser);
            } catch (e) {
                sessionStore.setUser(null);
            }
        } else if (!user) {
            sessionStore.setUser(null);
        }

        if (!sessionStore.isAuthReady) {
            sessionStore.setAuthReady();
        }
    });

    // 5. Aguarda a verificação inicial antes de desbloquear a aplicação
    await new Promise<void>(resolve => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            if (sessionStore.isAuthReady) {
                unsubscribe();
                resolve();
            }
        });
    });
});