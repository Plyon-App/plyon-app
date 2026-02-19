import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore';

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
  console.log('🚀 Migrando datos a subcolecciones...\n');
  
  // 1. Leer documento principal
  const userDoc = await getDoc(doc(db, 'users', USER_ID));
  if (!userDoc.exists()) {
    console.error('❌ Usuario no encontrado');
    return;
  }
  
  const data = userDoc.data();
  console.log('📖 Usuario encontrado:', data.name);
  
  // 2. Migrar goals array → football_goals subcolección
  if (data.goals && Array.isArray(data.goals)) {
    console.log(`\n⚽ Migrando ${data.goals.length} metas...`);
    for (const goal of data.goals) {
      await setDoc(doc(db, 'users', USER_ID, 'football_goals', goal.id), goal);
    }
    console.log(`✅ ${data.goals.length} metas migradas`);
  }
  
  console.log('\n🎉 Migración completa!');
  console.log('\n⚠️  Ahora necesitas RE-IMPORTAR el JSON desde Settings');
  process.exit(0);
}

migrate().catch(err => {
  console.error('\n❌ Error:', err);
  process.exit(1);
});
