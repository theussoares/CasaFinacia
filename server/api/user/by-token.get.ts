import { getFirestore } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token');
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Missing token' });
  }
  setupFirebase();
  const db = getFirestore();
  const usersRef = db.collection('users');
  const query = await usersRef.where('token', '==', token).limit(1).get();
  if (query.empty) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }
  const userDoc = query.docs[0];
  const userData = userDoc.data();
  return { uid: userDoc.id, ...userData };
});
