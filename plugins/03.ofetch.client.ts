import { ofetch } from 'ofetch';
import { getAuth } from 'firebase/auth';
import { useSessionStore } from '~/stores/session';

export default defineNuxtPlugin((nuxtApp) => {
    const { $firebase } = useNuxtApp() as any;
    const sessionStore = useSessionStore();

    // Configura o ofetch global para intercetar todos os pedidos $fetch
    globalThis.$fetch = ofetch.create({
        async onRequest({ options }) {
            // Não precisamos de verificar sessionStore.user aqui, apenas se o Firebase tem um utilizador
            const auth = $firebase.getFirebaseAuth();
            if (auth.currentUser) {
                try {
                    const token = await auth.currentUser.getIdToken(true);
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${token}`,
                    };
                } catch (e) {
                    console.error('Could not get auth token for API request', e);
                }
            }
        },
        async onResponseError({ response }) {
            if (response.status === 401 && sessionStore.user) {
                console.warn('Session expired. Logging out.');
                await sessionStore.logout();
            }
        }
    });
});