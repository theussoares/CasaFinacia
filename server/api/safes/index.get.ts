import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { householdId } = await requireAuth(event);
    const db = getFirestore();

    const safesCol = db.collection('households').doc(householdId).collection('safes');
    const snapshot = await safesCol.get();

    const safes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
    return safes;
});