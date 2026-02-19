import { db } from './firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import * as fs from 'fs';

// Leer JSON
const backupData = JSON.parse(
  fs.readFileSync('/mnt/user-data/uploads/plyon-backup-2026-02-18_14-23.json', 'utf-8')
);

async function migrateFromJSON(userId: string) {
  console.log('\n🚀 Migrando desde JSON backup...\n');
  
  const oldProfile = backupData.playerProfile;
  const matches = backupData.matches || [];
  const tournaments = backupData.tournaments || [];
  
  // 1. Construir nuevo perfil
  console.log('🏗️  Construyendo nuevo perfil...');
  const newProfile = {
    uid: userId,
    name: oldProfile.name,
    username: oldProfile.username,
    email: oldProfile.email || '',
    dob: oldProfile.dob,
    weight: oldProfile.weight,
    height: oldProfile.height,
    friends: oldProfile.friends || [],
    blockedUsers: oldProfile.blockedUsers || [],
    reputation: oldProfile.reputation,
    favoriteTeam: oldProfile.favoriteTeam,
    tutorialsSeen: oldProfile.tutorialsSeen || {},
    
    lastSportPlayed: 'football',
    activeSports: ['football'],
    
    sports: {
      football: {
        level: oldProfile.level || 1,
        xp: oldProfile.xp || 0,
        careerPoints: oldProfile.careerPoints || 0,
        careerMode: oldProfile.activeWorldCupMode ? {
          type: oldProfile.activeWorldCupMode === 'qualifiers' ? 'qualifiers' : 'worldcup',
          active: true,
          currentCampaign: oldProfile.qualifiersProgress?.campaignNumber || 1,
          progress: oldProfile.qualifiersProgress || oldProfile.worldCupProgress,
          history: oldProfile.qualifiersHistory || oldProfile.worldCupHistory || []
        } : undefined
      }
    },
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('✅ Perfil construido');
  
  // 2. Guardar perfil
  console.log('\n💾 Guardando perfil en Firestore...');
  await setDoc(doc(db, 'users', userId), newProfile);
  console.log('✅ Perfil guardado');
  
  // 3. Migrar partidos
  console.log(`\n📦 Migrando ${matches.length} partidos...`);
  let count = 0;
  for (const match of matches) {
    await setDoc(
      doc(db, 'users', userId, 'football_activities', match.id),
      {
        ...match,
        myYellowCards: match.myYellowCards || 0,
        myRedCards: match.myRedCards || 0
      }
    );
    count++;
    if (count % 20 === 0) {
      console.log(`   ${count}/${matches.length}...`);
    }
  }
  console.log(`✅ ${matches.length} partidos migrados`);
  
  // 4. Migrar torneos
  console.log(`\n🏆 Migrando ${tournaments.length} torneos...`);
  for (const tournament of tournaments) {
    await setDoc(
      doc(db, 'users', userId, 'football_tournaments', tournament.id),
      tournament
    );
  }
  console.log(`✅ ${tournaments.length} torneos migrados`);
  
  console.log('\n🎉 ¡MIGRACIÓN COMPLETA!\n');
  console.log('📊 Resumen:');
  console.log(`   - Perfil: ✅`);
  console.log(`   - Partidos: ${matches.length}`);
  console.log(`   - Torneos: ${tournaments.length}`);
  console.log(`   - Modo Carrera: ${oldProfile.activeWorldCupMode || 'ninguno'}`);
}

// Ejecutar
const USER_ID = 'TU_USER_ID_AQUI';  // ← NECESITO TU UID
migrateFromJSON(USER_ID);
