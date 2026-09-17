import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Lazy on purpose: constructing the Auth instance validates the config
// (throws immediately on a missing/invalid API key), so this must never run
// at module load time - only when actually called from the browser, after
// real Firebase credentials exist in the environment. Eager initialization
// here breaks `next build`'s prerender pass when credentials aren't set yet.
let cachedAuth: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(getFirebaseApp());
  }
  return cachedAuth;
}
