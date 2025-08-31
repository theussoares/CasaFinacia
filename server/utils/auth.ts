import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { H3Event } from 'h3';

// Esta função agora lê o cookie, que é o método correto para obter a sessão no servidor.
export async function requireAuth(event: H3Event) {
    const token = getCookie(event, 'auth-token');
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }
    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        const userDoc = await getFirestore().collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) throw new Error('User not found');
        const userData = userDoc.data()!;
        if (!userData.householdId) throw new Error('User not in a household');
        return { uid: decodedToken.uid, householdId: userData.householdId, user: userData };
    } catch (error) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }
}