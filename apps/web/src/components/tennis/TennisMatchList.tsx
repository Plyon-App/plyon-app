import React, { useState, useEffect } from 'react';
import type { Match } from '../../types';
import TennisMatchCard from './TennisMatchCard';
import { useTheme } from '../../contexts/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { TrophyIcon } from '../icons/TrophyIcon';

interface TennisMatchListProps {
  matches: Match[];
  onDeleteMatch?: (matchId: string) => void;
  isReadOnly?: boolean;
}

const TennisMatchList: React.FC<TennisMatchListProps> = ({ matches, onDeleteMatch, isReadOnly = false }) => {
  const { theme } = useTheme();
  const haptics = useHaptics();
  
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const handleDeleteWithAnimation = (matchId: string) => {
      haptics.heavy();
      setRemovingIds(prev => [...prev, matchId]);
      setTimeout(() => {
          if (onDeleteMatch) onDeleteMatch(matchId);
          setRemovingIds(prev => prev.filter(id => id !== matchId));
      }, 400);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    emptyState: {
      textAlign: 'center', padding: '3rem 2rem', backgroundColor: theme.colors.surface,
      borderRadius: '12px', border: `1px dashed ${theme.colors.border}`, color: theme.colors.secondaryText,
    },
    emptyStateIcon: { marginBottom: '1rem' },
    emptyStateTitle: { margin: '0 0 0.5rem 0', color: theme.colors.primaryText, fontSize: '1.25rem' },
    emptyStateText: { margin: 0, fontSize: '0.9rem' },
  };
  
  if (matches.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyStateIcon}><TrophyIcon color={theme.colors.secondaryText} /></div>
        <h3 style={styles.emptyStateTitle}>No hay partidos registrados</h3>
        <p style={styles.emptyStateText}>Añade tu primer partido para empezar a ver tu historial.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleOut {
          0% { opacity: 1; transform: scale(1); max-height: 200px; margin-bottom: 1rem; }
          100% { opacity: 0; transform: scale(0.9); max-height: 0; margin-bottom: 0; }
        }
        .match-card-enter {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0; 
        }
        .match-card-exit {
            animation: scaleOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            overflow: hidden;
            pointer-events: none;
        }
      `}</style>
      <div style={styles.list}>
        {matches.map((match, index) => (
          <div 
            key={match.id} 
            className={removingIds.includes(match.id) ? "match-card-exit" : "match-card-enter"}
            style={{ animationDelay: removingIds.includes(match.id) ? '0s' : `${Math.min(index * 0.05, 0.5)}s` }}
          >
            <TennisMatchCard 
              match={match} 
              onDelete={onDeleteMatch ? () => handleDeleteWithAnimation(match.id) : undefined}
              isReadOnly={isReadOnly}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default TennisMatchList;
