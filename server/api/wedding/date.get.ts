import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { householdId } = await requireAuth(event);
    const db = getFirestore();

    const docRef = db.collection('households').doc(householdId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        throw createError({ statusCode: 404, statusMessage: 'Household not found' });
    }

    const data = docSnap.data() || {};
    return { weddingDate: data.weddingDate || null };
});