import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { useSessionStore } from '~/stores/session';

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig().public;
    const sessionStore = useSessionStore();

    // 1. Primeiro, verifica se já existe uma sessão ativa no servidor
    try {
        console.log('🔍 Verificando sessão existente...');
        const { user } = await $fetch('/api/auth/me');
        if (user) {
            console.log('✅ Sessão encontrada:', user);
            sessionStore.setUser(user as any);
        } else {
            console.log('❌ Nenhuma sessão ativa');
        }
    } catch (error) {
        console.log('❌ Erro ao verificar sessão:', error);
    }
    
    // Marca como pronto após verificar a sessão
    sessionStore.setAuthReady();

    // Verifica se as configurações do Firebase existem
    if (!config.firebaseApiKey || !config.firebaseAuthDomain || !config.firebaseProjectId) {
        console.error('Configurações do Firebase não encontradas');
        return;
    }

    let auth: any = null;

    try {
        // 2. Inicializa o Firebase
        const firebaseApp = initializeApp({
            apiKey: config.firebaseApiKey as string,
            authDomain: config.firebaseAuthDomain as string,
            projectId: config.firebaseProjectId as string,
            storageBucket: config.firebaseStorageBucket as string,
            messagingSenderId: config.firebaseMessagingSenderId as string,
            appId: config.firebaseAppId as string,
        });

        auth = getAuth(firebaseApp);

        // 3. Fornece os helpers para a aplicação
        nuxtApp.provide('firebase', {
            getFirebaseAuth: () => auth,
            getGoogleProvider: () => new GoogleAuthProvider()
        });
    } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
        return;
    }

    if (!auth) {
        console.error('Auth não pôde ser inicializado');
        return;
    }

    // 4. Setup assíncrono do observer - mantém sincronizado com Firebase
    onAuthStateChanged(auth, async (firebaseUser) => {
        // Se o usuário do Firebase mudou, sincroniza com nossa store
        if (firebaseUser && !sessionStore.user) {
            try {
                const { user } = await $fetch('/api/auth/me');
                if (user) {
                    sessionStore.setUser(user as any);
                }
            } catch (e) {
                console.error('Erro ao sincronizar usuário:', e);
            }
        } else if (!firebaseUser && sessionStore.user) {
            // Se logout no Firebase, limpa nossa store
            sessionStore.setUser(null);
        }
    });
});