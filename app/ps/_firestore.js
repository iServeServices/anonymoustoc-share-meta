// lib/firestore.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Expect these to be set in Vercel Project Settings → Environment Variables
// FIREBASE_PROJECT_ID
// FIREBASE_CLIENT_EMAIL
// FIREBASE_PRIVATE_KEY  (paste exactly; this code fixes \n escapes automatically)
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Admin SDK once (important in serverless environments)
const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(firebaseConfig) });

export const db = getFirestore(app);

/**
 * Fetch a post document from Firestore by ID.
 * Collection: "feeds"
 * Returns: { id, ...data } or null if not found
 */
export async function getPostFromFirestore(postId) {
  if (!postId) return null;
  try {
    const snap = await db.collection('feeds').doc(postId).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error('getPostFromFirestore error:', err);
    return null;
  }
}
