// server/api/wedding/date.put.ts (Refactored)

import { getFirestore } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body.weddingDate || typeof body.weddingDate !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Invalid weddingDate' });
    }

    const db = setupFirebase();
    const docRef = getFirestore().doc('settings/wedding');

    // Using set with merge:true is equivalent to update but creates the doc if it doesn't exist
    await docRef.set({ weddingDate: body.weddingDate }, { merge: true });

    return { success: true, weddingDate: body.weddingDate };
});