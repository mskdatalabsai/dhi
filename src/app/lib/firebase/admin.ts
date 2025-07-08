// lib/firebase/admin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Create the configuration object
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

// Initialize Firebase Admin
const app = !getApps().length
  ? initializeApp(firebaseAdminConfig)
  : getApps()[0];

// Get Firestore instance
const adminDb = getFirestore(app);

// Use global variable to track if settings have been applied
// This persists across hot reloads in development
const globalForFirebase = global as typeof globalThis & {
  firestoreSettingsApplied?: boolean;
};

// Apply settings only once
if (!globalForFirebase.firestoreSettingsApplied) {
  adminDb.settings({
    ignoreUndefinedProperties: true,
  });
  globalForFirebase.firestoreSettingsApplied = true;
}

export { adminDb };
export default adminDb;
