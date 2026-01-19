import admin from 'firebase-admin';

// Protect against multiple initializations
if (!admin.apps.length) {
  // Use environment variables for service account credentials (server-side only)
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
