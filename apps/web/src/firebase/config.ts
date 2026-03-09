
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// --- CONFIGURACIÓN ---
// Asegúrate de que estos valores sean correctos según tu consola de Firebase.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || "AIzaSyAjrOzU7xjsdXNaS-6oQH2Y7uE6y1k-jwc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || "plyon-production.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "plyon-production",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || "plyon-production.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "418195848680",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || "1:418195848680:web:02dec4fc506f14429a385d",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-19RNN6F1VM"
};

let app = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;
let initializationError: string | null = null;

try {
  // Validación básica para evitar error 400 inmediato si las claves son placeholders
  if (firebaseConfig.apiKey.includes("AIzaSy") === false || firebaseConfig.apiKey.length < 10) {
      throw new Error("La API Key de Firebase parece inválida o no ha sido configurada.");
  }

  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firestore without persistent cache to avoid iframe issues
  db = getFirestore(app);

  // Initialize Auth
  auth = getAuth(app);

  // Initialize Analytics (solo en navegador)
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }

} catch (error: any) {
  console.error("Error inicializando Firebase:", error);
  initializationError = error.message;
}

export { app, db, auth, analytics, initializationError };
