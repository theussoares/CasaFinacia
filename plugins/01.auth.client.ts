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

    // 3. Tenta processar o resultado de um login por redirecionamento
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            // Se houver um resultado, o utilizador acabou de fazer login.
            const idToken = await result.user.getIdToken();
            const inviteToken = localStorage.getItem('invite_token');

            // ESTA É A CHAMADA ÚNICA E AUTORITÁRIA.
            // Ela cria o utilizador, define o cookie E retorna os dados do utilizador.
            const userData = await $fetch('/api/auth/google', {
                method: 'POST',
                body: { idToken, inviteToken },
            });

            sessionStore.setUser(userData as any);

            if (inviteToken) {
                localStorage.removeItem('invite_token');
            }
        }
    } catch (error) {
        console.error("Erro ao processar o resultado do redirecionamento:", error);
    }

    // 4. Se não houve redirecionamento, verifica a sessão existente via /api/auth/me
    if (!sessionStore.user) {
        try {
            const { user } = await $fetch('/api/auth/me');
            sessionStore.setUser(user);
        } catch (e) {
            // É normal falhar se não houver sessão, não precisa de logar erro.
        }
    }

    // 5. Sinaliza que a autenticação está pronta
    sessionStore.setAuthReady();
});