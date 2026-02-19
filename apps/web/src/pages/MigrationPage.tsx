import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export const MigrationPage: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const migrate = async () => {
    if (!user || !db) {
      setStatus('❌ No autenticado');
      return;
    }

    setLoading(true);
    setStatus('🚀 Iniciando migración...\n');

    try {
      const input = document.getElementById('jsonInput') as HTMLTextAreaElement;
      if (!input.value) {
        setStatus('❌ Pegá el JSON primero');
        setLoading(false);
        return;
      }

      const data = JSON.parse(input.value);
      const oldProfile = data.playerProfile;
      const matches = data.matches || [];
      const tournaments = data.tournaments || [];

      setStatus(prev => prev + `📦 ${matches.length} partidos, ${tournaments.length} torneos\n`);

      const newProfile = {
        uid: user.uid,
        name: oldProfile.name,
        username: oldProfile.username,
        email: user.email || '',
        dob: oldProfile.dob,
        friends: oldProfile.friends || [],
        lastSportPlayed: 'football' as const,
        activeSports: ['football'] as const,
        sports: {
          football: {
            level: oldProfile.level || 1,
            xp: oldProfile.xp || 0,
            careerPoints: oldProfile.careerPoints || 0
          }
        }
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      setStatus(prev => prev + '✅ Perfil migrado\n');

      for (let i = 0; i < matches.length; i++) {
        await setDoc(doc(db, 'users', user.uid, 'football_activities', matches[i].id), matches[i]);
        if (i % 30 === 0) setStatus(prev => prev + `⚽ ${i}/${matches.length}...\n`);
      }
      setStatus(prev => prev + `✅ ${matches.length} partidos\n`);

      for (const t of tournaments) {
        await setDoc(doc(db, 'users', user.uid, 'football_tournaments', t.id), t);
      }
      setStatus(prev => prev + `✅ ${tournaments.length} torneos\n\n🎉 ¡COMPLETO! Recargá (Cmd+R)`);
      
    } catch (err: any) {
      setStatus(prev => prev + `\n❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Migración Multi-Deporte</h1>
      <p>Pegá el JSON:</p>
      <textarea id="jsonInput" style={{ width: '100%', height: '200px', fontFamily: 'monospace' }} />
      <button onClick={migrate} disabled={loading} style={{ marginTop: '20px', padding: '10px 20px' }}>
        {loading ? 'Migrando...' : 'Migrar'}
      </button>
      <pre style={{ marginTop: '20px', background: '#f5f5f5', padding: '10px', whiteSpace: 'pre-wrap' }}>
        {status}
      </pre>
    </div>
  );
};
