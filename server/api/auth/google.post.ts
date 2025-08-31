import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const auth = getAuth();
    const db = getFirestore();

    const { idToken, inviteToken } = await readBody(event);
    if (!idToken) {
        throw createError({ statusCode: 400, statusMessage: 'Missing idToken' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    let householdId: string | null = null;

    if (userSnap.exists) {
        householdId = userSnap.data()?.householdId || null;
    } else if (inviteToken) {
        // New user with an invite token: find the household and join it.
        const householdQuery = await db.collection('households').where('inviteToken', '==', inviteToken).limit(1).get();
        if (!householdQuery.empty) {
            const householdDoc = householdQuery.docs[0];
            householdId = householdDoc.id;

            await userRef.set({ email, name, photoURL: picture, householdId });
            // SEC-01: Invalidate the invite token after use
            await householdDoc.ref.update({ inviteToken: FieldValue.delete() });
        }
    }

    if (!householdId) {
        // New user without an invite token: create a new household.
        const newHouseholdRef = db.collection('households').doc();
        await newHouseholdRef.set({ owner: uid, createdAt: new Date() });
        householdId = newHouseholdRef.id;
        await userRef.set({ email, name, photoURL: picture, householdId });
    }

    // SEC-03: Create a custom token for session management and set it as a secure, HttpOnly cookie.
    const customToken = await auth.createCustomToken(uid);
    setCookie(event, 'auth-token', customToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return { uid, email, name, photoURL: picture };
});