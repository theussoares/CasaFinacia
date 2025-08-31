import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { householdId } = await requireAuth(event);
    const db = getFirestore();
    const body = await readBody(event);

    if (!body.id || typeof body.id !== 'string' || !body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Bad Request: Invalid ID or amount.' });
    }

    const safeRef = db.collection('households').doc(householdId).collection('safes').doc(body.id);
    await safeRef.update({
        current: FieldValue.increment(body.amount),
    });

    return { success: true };
});