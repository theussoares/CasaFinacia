import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { requireAuth } from '../../utils/auth';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { householdId } = await requireAuth(event);
    const db = getFirestore();

    const inviteToken = uuidv4();
    const householdRef = db.collection('households').doc(householdId);

    await householdRef.update({
        inviteToken: inviteToken
    });

    // Best practice: The server should return the full URL to prevent client-side mistakes.
    const config = useRuntimeConfig();
    const inviteUrl = `${config.public.siteUrl}/convite?invite_token=${inviteToken}`;

    return { inviteUrl };
});