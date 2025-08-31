import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
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

    // 3. No arranque da aplicação, tenta obter a sessão a partir do cookie do servidor.
    // Isto trata dos casos de F5 na página ou de acesso direto a uma rota protegida.
    if (process.client) {
        try {
            const { user } = await $fetch('/api/auth/me');
            sessionStore.setUser(user);
        } catch (e) {
            console.error("Could not fetch initial session.", e);
            sessionStore.setUser(null);
        }
    }

    // 4. Sinaliza que a verificação inicial terminou.
    sessionStore.setAuthReady();
});