import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export const ADMIN_EMAILS = ["admin@todo.com"];

const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    }),
  });
}

export const adminAuth = getAuth();

// Function to check if a user is an admin
export async function isUserAdmin(email: string): Promise<boolean> {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
