import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// ========================================
// PLYON PRODUCTION (plyon.app@gmail.com)
// ========================================
const firebaseConfig = {
  apiKey: "AIzaSyDz4OrhHg8p8kmbJGfZaOAyyodieuzBa-0",
  authDomain: "plyon-production.firebaseapp.com",
  projectId: "plyon-production",
  storageBucket: "plyon-production.firebasestorage.app",
  messagingSenderId: "44475337879",
  appId: "1:44475337879:web:28afc9a778708b93286dd2",
  measurementId: "G-KWWZG7ZHEY"
};

let app = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;
let initializationError: string | null = null;

try {
  app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  auth = getAuth(app);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error: any) {
  console.error("Error inicializando Firebase:", error);
  initializationError = error.message;
}

export { app, db, auth, analytics, initializationError };
