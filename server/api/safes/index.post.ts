import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { householdId } = await requireAuth(event);
    const db = getFirestore();
    const body = await readBody(event);

    // SEC-01: Input validation remains crucial.
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
        throw createError({ statusCode: 400, statusMessage: 'Bad Request: Name is required.' });
    }
    if (!body.goal || typeof body.goal !== 'number' || body.goal <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Bad Request: Goal must be a positive number.' });
    }

    const newSafeData = {
        name: body.name.trim(),
        goal: body.goal,
        current: 0,
    };

    const docRef = await db.collection('households').doc(householdId).collection('safes').add(newSafeData);

    return { id: docRef.id, ...newSafeData };
});