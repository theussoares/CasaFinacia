import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { H3Event } from 'h3';

// SEC-03: This utility centralizes authentication logic for API routes.
// It reads a secure, HttpOnly cookie instead of a client-side token.
export async function requireAuth(event: H3Event) {
    const token = getCookie(event, 'auth-token');
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    try {
        const auth = getAuth();
        const decodedToken = await auth.verifyIdToken(token);
        const db = getFirestore();
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();

        if (!userDoc.exists) {
            throw createError({ statusCode: 404, statusMessage: 'User not found' });
        }

        const userData = userDoc.data()!;
        if (!userData.householdId) {
            throw createError({ statusCode: 403, statusMessage: 'User not associated with a household' });
        }

        return {
            uid: decodedToken.uid,
            householdId: userData.householdId as string,
            user: userData,
        };
    } catch (error) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
    }
}