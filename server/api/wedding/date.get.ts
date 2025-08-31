// server/api/wedding/date.get.ts (Refactored)

// Use Nuxt's alias `~/` for robust paths
import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async () => {
    const db = setupFirebase();
    const docRef = db.collection('settings').doc('wedding');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return { weddingDate: null };
    }

    const data = docSnap.data() || {};
    return { weddingDate: data.weddingDate || null };
});