import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';

// Este endpoint lê o cookie do browser para obter a sessão do utilizador.
export default defineEventHandler(async (event) => {
    setupFirebase();
    const token = getCookie(event, 'auth-token');

    if (!token) {
        // Se não houver cookie, não há utilizador.
        return { user: null };
    }

    try {
        // Se houver um cookie, validamo-lo.
        const decodedToken = await getAuth().verifyIdToken(token);
        const userDoc = await getFirestore().collection('users').doc(decodedToken.uid).get();

        if (!userDoc.exists) {
            return { user: null };
        }

        const userData = userDoc.data();
        return { user: { uid: decodedToken.uid, ...userData } };
    } catch (error) {
        // Se o token for inválido (expirado, etc.), limpa o cookie e retorna nulo.
        setCookie(event, 'auth-token', '', { maxAge: -1 });
        return { user: null };
    }
});