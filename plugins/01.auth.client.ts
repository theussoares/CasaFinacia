import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
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

    // 3. Ouve CONTINUAMENTE as mudanças de estado de autenticação
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Se o utilizador fez login (ou já estava logado),
            // sincronizamos o nosso estado interno com o backend.
            try {
                const { user: appUser } = await $fetch('/api/auth/me');
                sessionStore.setUser(appUser);
            } catch (e) {
                console.error("Failed to fetch user data from /api/auth/me", e);
                sessionStore.setUser(null);
            }
        } else {
            // Se o utilizador fez logout ou não está logado.
            sessionStore.setUser(null);
        }

        // Se a verificação inicial ainda não tinha terminado, marca-a como pronta.
        if (!sessionStore.isAuthReady) {
            sessionStore.setAuthReady();
        }
    });

    // Aguarda apenas a primeira execução do listener para desbloquear a app
    await new Promise<void>(resolve => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            unsubscribe();
            resolve();
        });
    });
});