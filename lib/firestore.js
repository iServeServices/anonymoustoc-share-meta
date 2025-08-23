// /lib/firestore.js
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId   = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.warn("⚠ Missing Firebase Admin env vars");
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

export const db = getFirestore(app);

export async function getPostFromFirestore(postId) {
  const col = process.env.FIREBASE_COLLECTION || "feeds";
  const snap = await db.collection(col).doc(postId).get();
  if (!snap.exists) return null;
  return snap.data();
}
