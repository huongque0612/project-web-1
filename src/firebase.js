import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hzuedoanmonhoc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

export const firebaseProjectId = firebaseConfig.projectId;

const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

export async function fetchCollection(collectionName) {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function saveRecord(collectionName, record) {
  if (!db) return null;
  const payload = {
    ...record,
    updatedAt: serverTimestamp(),
  };

  if (record.id) {
    const { id, ...data } = payload;
    await setDoc(doc(db, collectionName, id), data, { merge: true });
    return id;
  }

  const created = await addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return created.id;
}

export async function patchRecord(collectionName, id, patch) {
  if (!db) return;
  await updateDoc(doc(db, collectionName, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function seedFirestore(seedData) {
  if (!db) return;
  const batch = writeBatch(db);
  Object.entries(seedData).forEach(([collectionName, rows]) => {
    rows.forEach((row) => {
      const { id, ...data } = row;
      const ref = doc(db, collectionName, id);
      batch.set(ref, { ...data, seededAt: serverTimestamp() }, { merge: true });
    });
  });
  await batch.commit();
}
