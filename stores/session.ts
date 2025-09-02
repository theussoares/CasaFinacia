import { defineStore } from 'pinia';
import { getAuth, signOut } from 'firebase/auth';

type User = {
    uid: string;
    email: string;
    name: string;
    photoURL: string;
    householdId: string;
    isConjugue?: boolean; // Indica se o usuário entrou via convite
};

export const useSessionStore = defineStore('session', () => {
    const user = ref<User | null>(null);
    const isAuthReady = ref(false); // Flag para controlar o estado de "loading"

    function setUser(newUser: User | null) {
        user.value = newUser;
    }

    function setAuthReady() {
        isAuthReady.value = true;
    }

    async function logout() {
        const { $firebase } = useNuxtApp() as any;
        const { clearAllCache } = useCacheManager();
        
        // **LAYOUT-SHIFT-FIX**: Limpa todo cache persistente no logout
        clearAllCache();
        
        // Limpa o cookie do servidor
        await $fetch('/api/auth/logout', { method: 'POST' });
        
        // Faz logout do Firebase no cliente
        if ($firebase?.getFirebaseAuth()) {
            await signOut($firebase.getFirebaseAuth());
        }
        
        setUser(null);
        await navigateTo('/');
    }

    return { user, isAuthReady, setUser, setAuthReady, logout };
});