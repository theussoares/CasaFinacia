import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    setupFirebase();
    
    const token = getCookie(event, 'auth-token');
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        const db = getFirestore();
        
        // Obtém o ID do cofre da query string
        const query = getQuery(event);
        const safeId = query.id as string;
        
        if (!safeId) {
            throw createError({ statusCode: 400, statusMessage: 'Missing safe ID' });
        }

        // Busca o documento do usuário para obter o householdId
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) {
            throw createError({ statusCode: 404, statusMessage: 'User not found' });
        }

        const userData = userDoc.data();
        const householdId = userData?.householdId;
        
        if (!householdId) {
            throw createError({ statusCode: 400, statusMessage: 'No household found' });
        }

        // Deleta o cofre
        const safeRef = db.collection('households').doc(householdId).collection('safes').doc(safeId);
        const safeDoc = await safeRef.get();
        
        if (!safeDoc.exists) {
            throw createError({ statusCode: 404, statusMessage: 'Safe not found' });
        }

        await safeRef.delete();

        return { success: true, message: 'Safe deleted successfully' };
    } catch (error: any) {
        console.error('Error deleting safe:', error);
        throw createError({ 
            statusCode: error.statusCode || 500, 
            statusMessage: error.statusMessage || 'Failed to delete safe' 
        });
    }
});
