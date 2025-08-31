// server/utils/firebase.ts

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const setupFirebase = () => {
    const apps = getApps();
    if (apps.length > 0) {
        return getFirestore();
    }

    const config = useRuntimeConfig();
    const serviceAccount = JSON.parse(config.firebaseServiceAccount as string);

    initializeApp({
        credential: cert(serviceAccount),
    });

    return getFirestore();
};