// server/api/safes/index.get.ts

import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    try {
        const db = setupFirebase();
        const safesCol = db.collection('safes');
        const snapshot = await safesCol.get();

        const safes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return safes;
    } catch (error) {
        console.error('Error fetching safes:', error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch safes from database'
        }));
    }
});