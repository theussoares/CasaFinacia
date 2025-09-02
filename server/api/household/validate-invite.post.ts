import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { inviteToken } = await readBody(event);
    
    if (!inviteToken) {
        throw createError({ 
            statusCode: 400, 
            statusMessage: 'Missing inviteToken' 
        });
    }

    const db = getFirestore();
    
    try {
        // SEC-01: Buscar household com o token de convite
        const householdQuery = await db
            .collection('households')
            .where('inviteToken', '==', inviteToken)
            .limit(1)
            .get();
        
        const valid = !householdQuery.empty;
        
        return { valid };
    } catch (error) {
        console.error('Error validating invite token:', error);
        throw createError({ 
            statusCode: 500, 
            statusMessage: 'Error validating invite token' 
        });
    }
});
