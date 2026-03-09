// [COPIAR TODO el contenido actual hasta matchesService]
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, collection, query, where, orderBy, onSnapshot, setDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, limit, Timestamp } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import type { Match, Goal, CustomAchievement, AIInteraction, PlayerProfileData, Tournament, Notification, FriendRequest, PendingMatch, SocialActivity, SportType } from '../types';
import { v4 as uuidv4 } from 'uuid';

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
  db = getFirestore(app);
  auth = getAuth(app);
  
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error: any) {
  console.error("Error inicializando Firebase:", error);
  initializationError = error.message;
}

// ==========================================
// MATCHES/ACTIVITIES SERVICE (MULTI-SPORT)
// ==========================================
const getCollectionName = (sport: SportType): string => {
    return `${sport}_activities`;
};

export const matchesService = {
    add: async (userId: string, match: Match) => {
        if (!db) return;
        const collectionName = getCollectionName(match.sport);
        await setDoc(doc(db, 'users', userId, collectionName, match.id), match);
    },
    update: async (userId: string, match: Match) => {
        if (!db) return;
        const collectionName = getCollectionName(match.sport);
        await updateDoc(doc(db, 'users', userId, collectionName, match.id), match as any);
    },
    delete: async (userId: string, matchId: string, sport: SportType) => {
        if (!db) return;
        const collectionName = getCollectionName(sport);
        await deleteDoc(doc(db, 'users', userId, collectionName, matchId));
    }
};
