import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDHzM8-aTmrxXDqdlhKXPVBzWcl2H0xHO8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-mentor-19ce9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-mentor-19ce9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-mentor-19ce9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "450460021935",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:450460021935:web:6b0b53110a48dcdce7d05a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3QLCEHKTQ5"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return {
      user: result.user,
      idToken
    };
  } catch (error) {
    console.error("Firebase Google sign-in failed:", error);
    throw error;
  }
};

export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("Firebase sign out warning:", err);
  }
};
