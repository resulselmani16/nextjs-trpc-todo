import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Validate required environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL",
  "NEXT_PUBLIC_FIREBASE_PRIVATE_KEY",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ),
  }),
};

let app;
let auth: import("firebase-admin/auth").Auth;

try {
  app =
    getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
  auth = getAuth(app);
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  throw error;
}

export { app, auth };
