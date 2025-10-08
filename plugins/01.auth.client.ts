import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { useSessionStore } from '~/stores/session';

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig().public;
    const sessionStore = useSessionStore();

    // **LAYOUT-SHIFT-FIX**: Sistema de cache eterno otimizado
    const getEternalCache = () => {
        try {
            const userData = localStorage.getItem('user-data-eternal');
            const isAuth = localStorage.getItem('user-auth-eternal');
            const timestamp = localStorage.getItem('user-cache-timestamp');
            
            if (!userData || !isAuth || !timestamp) {
                return { user: null, isAuthenticated: false, timestamp: 0 };
            }
            
            const user = JSON.parse(userData);
            
            // **FIX**: Garante que photoURL está presente
            if (user && !user.photoURL) {
                console.warn('⚠️ Cache sem photoURL, será necessário recarregar dados');
                return { user: null, isAuthenticated: false, timestamp: 0 };
            }
            
            return {
                user,
                isAuthenticated: isAuth === 'true',
                timestamp: parseInt(timestamp)
            };
        } catch (e) {
            console.warn('⚠️ Erro ao ler cache eterno:', e);
            return { user: null, isAuthenticated: false, timestamp: 0 };
        }
    };

    const setEternalCache = (user: any) => {
        try {
            // **FIX**: Valida que todos os campos essenciais estão presentes
            if (!user || !user.uid || !user.photoURL) {
                console.warn('⚠️ Tentativa de salvar usuário incompleto no cache:', user);
                return;
            }
            
            console.log('💾 Salvando dados completos no cache eterno:', {
                uid: user.uid,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                householdId: user.householdId
            });
            
            localStorage.setItem('user-data-eternal', JSON.stringify(user));
            localStorage.setItem('user-auth-eternal', 'true');
            localStorage.setItem('user-cache-timestamp', Date.now().toString());
        } catch (e) {
            console.warn('❌ Erro ao salvar cache eterno:', e);
        }
    };

    const clearEternalCache = () => {
        try {
            localStorage.removeItem('user-data-eternal');
            localStorage.removeItem('user-auth-eternal');
            localStorage.removeItem('user-cache-timestamp');
        } catch {
            // Silencioso
        }
    };

    // **PERF-01**: Verifica cache eterno primeiro (instantâneo)
    const eternalCache = getEternalCache();
    if (eternalCache.user && eternalCache.isAuthenticated) {
        console.log('✅ Carregando usuário completo do cache eterno:', {
            name: eternalCache.user.name,
            email: eternalCache.user.email,
            photoURL: eternalCache.user.photoURL ? 'PRESENTE' : 'AUSENTE',
            uid: eternalCache.user.uid
        });
        
        sessionStore.setUser(eternalCache.user);
        sessionStore.setAuthReady();
        
        // Verifica se o cache não está muito antigo (mais de 12h para permitir atualizações)
        const isOldCache = Date.now() - eternalCache.timestamp > 12 * 60 * 60 * 1000;
        if (!isOldCache) {
            console.log('✅ Cache eterno válido, inicializando Firebase em background');
            initFirebaseInBackground();
            return;
        } else {
            console.log('⏳ Cache antigo, mas mantendo dados enquanto atualiza em background');
            // Mantém os dados atuais mas força refresh em background
        }
    }

    // **PERF-02**: Se não há cache válido ou cache antigo, faz verificação otimizada
    sessionStore.setAuthReady(); // Marca como pronto para não bloquear
    
    try {
        console.log('🔍 Verificando/atualizando sessão no servidor...');
        const { user } = await $fetch('/api/auth/me') as { user: any };
        if (user) {
            console.log('✅ Dados do servidor recebidos:', {
                name: user.name,
                email: user.email,
                photoURL: user.photoURL ? 'PRESENTE' : 'AUSENTE',
                uid: user.uid
            });
            
            // **FIX**: Só atualiza se os dados são realmente diferentes ou mais completos
            const currentUser = sessionStore.user;
            const shouldUpdate = !currentUser || 
                               currentUser.uid !== user.uid ||
                               currentUser.photoURL !== user.photoURL ||
                               !currentUser.photoURL; // Força update se não tem foto
            
            if (shouldUpdate) {
                console.log('🔄 Atualizando dados do usuário na store');
                sessionStore.setUser(user);
                setEternalCache(user); // Salva no cache eterno
            } else {
                console.log('✅ Dados já estão atualizados');
            }
        } else {
            console.log('❌ Nenhuma sessão ativa no servidor');
            if (sessionStore.user) {
                sessionStore.setUser(null);
            }
            clearEternalCache();
        }
    } catch (error) {
        console.log('❌ Erro ao verificar sessão:', error);
        // **FIX**: Se há cache válido, não limpa mesmo com erro de rede
        if (!eternalCache.user) {
            clearEternalCache();
        }
    }

    // Inicializa Firebase em background
    await initFirebaseInBackground();

    // Função para inicializar Firebase sem bloquear
    async function initFirebaseInBackground() {
        // Verifica se as configurações do Firebase existem
        if (!config.firebaseApiKey || !config.firebaseAuthDomain || !config.firebaseProjectId) {
            console.error('❌ Configurações do Firebase não encontradas');
            nuxtApp.provide('firebase', {
                getFirebaseAuth: () => null,
                getGoogleProvider: () => null
            });
            return;
        }

        let auth: any = null;
        let firebaseApp: any = null;

        try {
            console.log('🔥 Inicializando Firebase...');
            firebaseApp = initializeApp({
                apiKey: config.firebaseApiKey as string,
                authDomain: config.firebaseAuthDomain as string,
                projectId: config.firebaseProjectId as string,
                storageBucket: config.firebaseStorageBucket as string,
                messagingSenderId: config.firebaseMessagingSenderId as string,
                appId: config.firebaseAppId as string,
            });

            auth = getAuth(firebaseApp);
            console.log('✅ Firebase inicializado com sucesso');

            nuxtApp.provide('firebase', {
                getFirebaseAuth: () => auth,
                getGoogleProvider: () => new GoogleAuthProvider()
            });
        } catch (error) {
            console.error('❌ Erro ao inicializar Firebase:', error);
            nuxtApp.provide('firebase', {
                getFirebaseAuth: () => null,
                getGoogleProvider: () => null
            });
            return;
        }

        if (!auth) {
            console.error('Auth não pôde ser inicializado');
            return;
        }

        // **AUTH-FIX**: Observer assíncrono com refresh automático de token
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // **AUTH-01**: Atualiza o token no cookie periodicamente
                try {
                    console.log('🔑 Renovando token de autenticação...');
                    const idToken = await firebaseUser.getIdToken(true); // force refresh
                    
                    // Atualiza o cookie no servidor
                    await $fetch('/api/auth/session', {
                        method: 'POST',
                        body: { idToken }
                    });
                    
                    console.log('✅ Token renovado com sucesso');
                    
                    // Sincroniza dados do usuário se necessário
                    if (!sessionStore.user) {
                        const { user } = await $fetch('/api/auth/me');
                        if (user) {
                            sessionStore.setUser(user as any);
                            setEternalCache(user);
                        }
                    }
                } catch (e) {
                    console.error('❌ Erro ao renovar token:', e);
                }
            } else if (!firebaseUser && sessionStore.user) {
                sessionStore.setUser(null);
                clearEternalCache();
            }
        });

        // **AUTH-02**: Configura renovação automática do token a cada 50 minutos (antes de expirar)
        setInterval(async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    console.log('🔄 Renovação automática do token...');
                    const idToken = await currentUser.getIdToken(true);
                    await $fetch('/api/auth/session', {
                        method: 'POST',
                        body: { idToken }
                    });
                    console.log('✅ Token renovado automaticamente');
                } catch (e) {
                    console.error('❌ Erro na renovação automática:', e);
                }
            }
        }, 50 * 60 * 1000); // 50 minutos

        // **AUTH-03**: Renova token quando a aba fica visível novamente
        document.addEventListener('visibilitychange', async () => {
            if (!document.hidden && auth.currentUser) {
                try {
                    console.log('👁️ Aba visível novamente, verificando token...');
                    const idToken = await auth.currentUser.getIdToken(true);
                    await $fetch('/api/auth/session', {
                        method: 'POST',
                        body: { idToken }
                    });
                    console.log('✅ Token verificado e atualizado');
                } catch (e) {
                    console.error('❌ Erro ao verificar token:', e);
                }
            }
        });
    }
});