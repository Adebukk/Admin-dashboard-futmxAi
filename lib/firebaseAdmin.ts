import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Prevent multiple initialization instances during Next.js hot-reloading (HMR)
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The .replace handles newline character escaping issues common in cloud environments like Vercel
        privateKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

// Export the auth service instance for your API routes
const auth = getAuth();

export { auth };