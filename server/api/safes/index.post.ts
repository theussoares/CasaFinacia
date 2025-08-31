// server/api/safes/index.post.ts

import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // SEC-01: A validação rigorosa de entrada é obrigatória.
    // Nunca confie nos dados vindos do cliente.
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
        throw createError({ statusCode: 400, statusMessage: 'Bad Request: Name is required.' });
    }
    if (!body.goal || typeof body.goal !== 'number' || body.goal <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Bad Request: Goal must be a positive number.' });
    }

    try {
        const db = setupFirebase();
        const safesCol = db.collection('safes');

        const newSafeData = {
            name: body.name.trim(),
            goal: body.goal,
            current: 0, // Um novo cofre sempre começa com 0
        };

        const docRef = await safesCol.add(newSafeData);

        // Retorna o novo documento criado com seu ID
        return {
            id: docRef.id,
            ...newSafeData,
        };
    } catch (error) {
        console.error("Error creating safe:", error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to create safe in Firestore.' });
    }
});