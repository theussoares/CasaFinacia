import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { householdId } = await requireAuth(event);
    const db = getFirestore();

    try {
        // SEC-01: Buscar todos os usuários do household
        const usersQuery = await db
            .collection('users')
            .where('householdId', '==', householdId)
            .get();
        
        const users = usersQuery.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));

        return { users };
    } catch (error) {
        console.error('Error fetching household users:', error);
        throw createError({ 
            statusCode: 500, 
            statusMessage: 'Error fetching household data' 
        });
    }
});
