// lib/firestore.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app;
if (!global._firebaseApp) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  global._firebaseApp = app;
} else {
  app = global._firebaseApp;
}

export const db = getFirestore(app);

export async function getPostFromFirestore(postId) {
  const doc = await db.collection("feeds").doc(postId).get();
  if (!doc.exists) return null;
  return doc.data();
}
