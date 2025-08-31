import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { idToken, inviteToken } = await readBody(event);
    if (!idToken) throw createError({ statusCode: 400, statusMessage: 'Missing idToken' });

    const auth = getAuth();
    const db = getFirestore();
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    const userRef = db.collection('users').doc(uid);
    let userSnap = await userRef.get();
    if (!userSnap.exists) {
        let householdId: string;
        if (inviteToken) {
            const householdQuery = await db.collection('households').where('inviteToken', '==', inviteToken).limit(1).get();
            if (!householdQuery.empty) {
                const householdDoc = householdQuery.docs[0];
                householdId = householdDoc.id;
                await householdDoc.ref.update({ inviteToken: FieldValue.delete() });
            } else { throw createError({ statusCode: 400, statusMessage: 'Invalid invite token' }); }
        } else {
            const newHouseholdRef = await db.collection('households').add({ owner: uid, createdAt: new Date() });
            householdId = newHouseholdRef.id;
        }
        await userRef.set({ email, name, photoURL: picture, householdId });
        userSnap = await userRef.get();
    }

    // **AÇÃO CRÍTICA:** Definir o token de ID como um cookie HttpOnly seguro.
    setCookie(event, 'auth-token', idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return { uid, ...userSnap.data() };
});