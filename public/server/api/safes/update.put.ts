// server/api/safes/update.put.ts

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const db = getFirestore();
    const body = await readBody(event);

    if (!body.id || typeof body.id !== 'string' || !body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request: Invalid ID or amount provided.',
        });
    }

    const safeRef = db.collection('safes').doc(body.id);

    await safeRef.update({
        current: FieldValue.increment(body.amount),
    });

    return { success: true, message: `Safe ${body.id} updated.` };
});