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

    // 3. Ouve as mudanças de estado de autenticação e atualiza a store
    onAuthStateChanged(auth, async (user) => {
        // Se o estado do Firebase e o da nossa store não estiverem sincronizados, sincronizamo-los.
        if (user && !sessionStore.user) {
            try {
                // O endpoint /api/auth/me lê o cookie e obtém os dados completos do utilizador
                const { user: appUser } = await $fetch('/api/auth/me');
                sessionStore.setUser(appUser);
            } catch (e) {
                console.error("Falha ao obter dados do utilizador após mudança de estado.", e);
                sessionStore.setUser(null);
            }
        } else if (!user && sessionStore.user) {
            sessionStore.setUser(null);
        }

        // Se a verificação inicial ainda não terminou, marca-a como pronta.
        if (!sessionStore.isAuthReady) {
            sessionStore.setAuthReady();
        }
    });

    // 4. Aguarda APENAS a verificação inicial antes de desbloquear a aplicação
    await new Promise<void>(resolve => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            // Este listener temporário corre uma vez, resolve a promise e desliga-se.
            // O listener principal (acima) continua a funcionar.
            unsubscribe();
            resolve();
        });
    });
});