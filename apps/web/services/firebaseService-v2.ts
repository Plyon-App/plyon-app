import { db, auth } from '../firebase/config';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, onSnapshot, 
  arrayUnion, arrayRemove, writeBatch, 
  Timestamp, deleteField, 
  addDoc,
  documentId,
  increment,
  startAfter,
  QueryDocumentSnapshot,
  serverTimestamp,
  or
} from 'firebase/firestore';
import type { 
    Match, 
    Goal, 
    CustomAchievement, 
    AIInteraction, 
    PlayerProfileData, 
    Tournament,
    Notification,
    FriendRequest,
    PendingMatch,
    SocialActivity,
    PublicProfile,
    RankingUser,
    ChatMessage
} from '../types';
import { v4 as uuidv4 } from 'uuid';

// ==========================================
// MATCHES/ACTIVITIES SERVICE (V2)
// ==========================================
export const matchesService = {
    add: async (userId: string, match: Match) => {
        if (!db) return;
        // Nueva colección: football_activities
        await setDoc(doc(db, 'users', userId, 'football_activities', match.id), match);
    },
    update: async (userId: string, match: Match) => {
        if (!db) return;
        await updateDoc(doc(db, 'users', userId, 'football_activities', match.id), match as any);
    },
    delete: async (userId: string, matchId: string) => {
        if (!db) return;
        await deleteDoc(doc(db, 'users', userId, 'football_activities', matchId));
    }
};

export const ensureProfileConsistency = async (userId: string) => {
    if (!db) return;
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        const data = snap.data();
        if (!data.searchName || !data.searchEmail) {
            await updateDoc(userRef, {
                searchName: (data.name || '').toLowerCase(),
                searchEmail: (data.email || '').toLowerCase()
            });
        }
    }
};

// ==========================================
// SUBSCRIBE TO USER DATA (V2)
// ==========================================
export const subscribeToUserData = (userId: string, callback: (data: any) => void) => {
    if (!db) return () => {};
    
    // Listener for User Profile & Settings (V2 structure)
    const userUnsub = onSnapshot(doc(db, 'users', userId), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Extract football config from v2 structure
            const footballConfig = data.sports?.football || {};
            
            // Build playerProfile compatible with existing code
            const playerProfile = {
                ...data,
                level: footballConfig.level || data.level || 1,
                xp: footballConfig.xp || data.xp || 0,
                careerPoints: footballConfig.careerPoints || data.careerPoints || 0,
                // Map careerMode back to old structure for compatibility
                activeWorldCupMode: footballConfig.careerMode?.type || data.activeWorldCupMode,
                worldCupProgress: footballConfig.careerMode?.progress || data.worldCupProgress,
                worldCupHistory: footballConfig.careerMode?.history || data.worldCupHistory || [],
                qualifiersProgress: footballConfig.careerMode?.type === 'qualifiers' ? footballConfig.careerMode.progress : data.qualifiersProgress,
                qualifiersHistory: footballConfig.careerMode?.type === 'qualifiers' ? footballConfig.careerMode.history : data.qualifiersHistory || [],
            };
            
            callback({
                playerProfile,
                goals: data.goals || [],
                customAchievements: data.customAchievements || [],
                tournaments: data.tournaments || [],
                isOnboardingComplete: data.isOnboardingComplete
            });
        }
    });

    // Listener for Football Activities (V2)
    const qMatches = query(
        collection(db, 'users', userId, 'football_activities'), 
        orderBy('date', 'desc')
    );
    const matchesUnsub = onSnapshot(qMatches, (snapshot) => {
        const matches = snapshot.docs.map(d => d.data() as Match);
        callback({ matches });
    });

    // Listener for Football Goals (V2)
    const qGoals = query(collection(db, 'users', userId, 'football_goals'));
    const goalsUnsub = onSnapshot(qGoals, (snapshot) => {
        const goals = snapshot.docs.map(d => d.data() as Goal);
        callback({ goals });
    });

    // Listener for Football Tournaments (V2)
    const qTournaments = query(collection(db, 'users', userId, 'football_tournaments'));
    const tournamentsUnsub = onSnapshot(qTournaments, (snapshot) => {
        const tournaments = snapshot.docs.map(d => d.data() as Tournament);
        callback({ tournaments });
    });

    // Listener for Football Achievements (V2)
    const qAchievements = query(collection(db, 'users', userId, 'football_achievements'));
    const achievementsUnsub = onSnapshot(qAchievements, (snapshot) => {
        const customAchievements = snapshot.docs.map(d => d.data() as CustomAchievement);
        callback({ customAchievements });
    });

    // Listener for Football AI Interactions (V2)
    const qAI = query(
        collection(db, 'users', userId, 'football_ai_interactions'), 
        orderBy('date', 'desc'), 
        limit(50)
    );
    const aiUnsub = onSnapshot(qAI, (snapshot) => {
        const aiInteractions = snapshot.docs.map(d => d.data() as AIInteraction);
        callback({ aiInteractions });
    });

    return () => {
        userUnsub();
        matchesUnsub();
        goalsUnsub();
        tournamentsUnsub();
        achievementsUnsub();
        aiUnsub();
    };
};

// ==========================================
// HELPER: Update Profile (V2 compatible)
// ==========================================
export const updatePlayerProfile = async (userId: string, updates: Partial<PlayerProfileData>) => {
    if (!db) return;
    
    // If updating career-related fields, put them in sports.football
    const profileUpdates: any = { ...updates };
    
    if (updates.level !== undefined || updates.xp !== undefined || updates.careerPoints !== undefined) {
        profileUpdates['sports.football.level'] = updates.level;
        profileUpdates['sports.football.xp'] = updates.xp;
        profileUpdates['sports.football.careerPoints'] = updates.careerPoints;
        
        delete profileUpdates.level;
        delete profileUpdates.xp;
        delete profileUpdates.careerPoints;
    }
    
    await updateDoc(doc(db, 'users', userId), profileUpdates);
};

