import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { householdId } = await requireAuth(event);
    const db = getFirestore();
    const body = await readBody(event);

    if (!body.weddingDate || typeof body.weddingDate !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Invalid weddingDate' });
    }

    const docRef = db.collection('households').doc(householdId);
    await docRef.set({ weddingDate: body.weddingDate }, { merge: true });

    return { success: true, weddingDate: body.weddingDate };
});