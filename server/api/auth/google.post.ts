import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.idToken) {
    throw createError({ statusCode: 400, statusMessage: 'Missing idToken' });
  }
  setupFirebase();
  const auth = getAuth();
  const db = getFirestore();
  // Verify Google ID token
  const decoded = await auth.verifyIdToken(body.idToken);
  const uid = decoded.uid;
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  let token;
  const userData = userSnap.data();
  if (userSnap.exists && userData && userData.token) {
    token = userData.token;
  } else {
    token = uuidv4();
    await userRef.set({
      email: decoded.email,
      name: decoded.name,
      photoURL: decoded.picture,
      token,
      createdAt: new Date(),
    }, { merge: true });
  }
  return { token, uid, email: decoded.email, name: decoded.name, photoURL: decoded.picture };
});
