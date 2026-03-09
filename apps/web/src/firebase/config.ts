import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// PLYON PRODUCTION
const firebaseConfig = {
  apiKey: "AIzaSyDz4OrhHg8p8kmbJGfZaOAyyodieuzBa-0",
  authDomain: "plyon-production.firebaseapp.com",
  projectId: "plyon-production",
  storageBucket: "plyon-production.firebasestorage.app",
  messagingSenderId: "44475337879",
  appId: "1:44475337879:web:28afc9a778708b93286dd2",
  measurementId: "G-BT717YK58S"
};

let app = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;
let initializationError: string | null = null;

try {
  app = initializeApp(firebaseConfig);
  
  // FIX: usar getFirestore en vez de persistentLocalCache
  db = getFirestore(app);
  
  auth = getAuth(app);
  
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error: any) {
  console.error("Error inicializando Firebase:", error);
  initializationError = error.message;
}

export { app, db, auth, analytics, initializationError };
