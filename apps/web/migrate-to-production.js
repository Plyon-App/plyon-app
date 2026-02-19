const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
  apiKey: "AIzaSyDz4OrhHg8p8kmbJGfZaOAyyodieuzBa-0",
  authDomain: "plyon-production.firebaseapp.com",
  projectId: "plyon-production",
  storageBucket: "plyon-production.firebasestorage.app",
  messagingSenderId: "44475337879",
  appId: "1:44475337879:web:28afc9a778708b93286dd2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const USER_ID = 'tNDGVWYPZhMO5bPIel1Q4r9kYX93';

async function migrate() {
  console.log('\n🚀 MIGRANDO DATOS A PLYON-PRODUCTION\n');
  
  // Leer JSON
  const backupPath = '/mnt/user-data/uploads/plyon-backup-2026-02-18_14-23.json';
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  
  const oldProfile = backup.playerProfile;
  const matches = backup.matches || [];
  const tournaments = backup.tournaments || [];
  
  console.log(`📦 Datos a migrar:`);
  console.log(`   - Partidos: ${matches.length}`);
  console.log(`   - Torneos: ${tournaments.length}`);
  console.log(`   - Usuario: ${oldProfile.name}`);
  
  // 1. Crear perfil con nueva estructura
  console.log('\n🏗️  Creando perfil...');
  const newProfile = {
    uid: USER_ID,
    name: oldProfile.name,
    username: oldProfile.username,
    email: oldProfile.email || '',
    dob: oldProfile.dob,
    weight: oldProfile.weight,
    height: oldProfile.height,
    
    friends: oldProfile.friends || [],
    blockedUsers: oldProfile.blockedUsers || [],
    friendRequestsSent: oldProfile.friendRequestsSent || [],
    friendRequestsReceived: oldProfile.friendRequestsReceived || [],
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
  
  await setDoc(doc(db, 'users', USER_ID), newProfile);
  console.log('✅ Perfil creado');
  
  // 2. Migrar partidos
  console.log(`\n⚽ Migrando ${matches.length} partidos...`);
  let count = 0;
  for (const match of matches) {
    await setDoc(
      doc(db, 'users', USER_ID, 'football_activities', match.id),
      {
        ...match,
        myYellowCards: match.myYellowCards || 0,
        myRedCards: match.myRedCards || 0
      }
    );
    count++;
    if (count % 30 === 0) {
      console.log(`   ${count}/${matches.length}...`);
    }
  }
  console.log(`✅ ${matches.length} partidos migrados`);
  
  // 3. Migrar torneos
  console.log(`\n🏆 Migrando ${tournaments.length} torneos...`);
  for (const tournament of tournaments) {
    await setDoc(
      doc(db, 'users', USER_ID, 'football_tournaments', tournament.id),
      tournament
    );
  }
  console.log(`✅ ${tournaments.length} torneos migrados`);
  
  console.log('\n🎉 ¡MIGRACIÓN COMPLETA!\n');
  console.log('📊 Resumen:');
  console.log(`   ✅ Perfil migrado con estructura v2`);
  console.log(`   ✅ ${matches.length} partidos en football_activities`);
  console.log(`   ✅ ${tournaments.length} torneos en football_tournaments`);
  console.log(`   ✅ Modo carrera: ${oldProfile.activeWorldCupMode || 'ninguno'}`);
  console.log(`\n✨ Base de datos: plyon-production`);
  
  process.exit(0);
}

migrate().catch(err => {
  console.error('\n❌ Error:', err);
  process.exit(1);
});
