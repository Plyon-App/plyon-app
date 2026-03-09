import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { type Match } from '../../../types';
import Card from '../../common/Card';
import StatCard from '../../StatCard';
import RecentForm from '../../RecentForm';
import YearFilter from '../../YearFilter';
import { parseLocalDate } from '../../../utils/analytics';

interface TennisStreaksWidgetProps {
  matches: Match[];
}

const TennisStreaksWidget: React.FC<TennisStreaksWidgetProps> = ({ matches }) => {
  const { theme } = useTheme();

  const availableYears = useMemo(() => {
    const yearSet = new Set(matches.map(m => parseLocalDate(m.date).getFullYear()));
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [matches]);
  
  const [selectedYear, setSelectedYear] = useState<string | 'all'>(availableYears.length > 0 ? availableYears[0].toString() : 'all');

  const { activeStreaks, last5MatchesStats, currentStreaks } = useMemo(() => {
    let filteredMatches = matches;
    if (selectedYear !== 'all') {
        filteredMatches = matches.filter(m => parseLocalDate(m.date).getFullYear().toString() === selectedYear);
    }

    const sortedMatches = [...filteredMatches].sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime());
    
    let last5Stats = null;
    if (sortedMatches.length > 0) {
        const last5 = sortedMatches.slice(0, 5);
        const wins = last5.filter(m => m.result === 'VICTORIA').length;
        const losses = last5.filter(m => m.result === 'DERROTA').length;
        
        last5Stats = {
            record: `${wins}V - ${losses}D`,
            efectividad: `${((wins / last5.length) * 100).toFixed(1)}%`
        };
    }

    if (sortedMatches.length === 0) {
      return { activeStreaks: [], last5MatchesStats: last5Stats, currentStreaks: { win: 0, loss: 0 } };
    }

    let currentWinStreak = 0;
    let currentLossStreak = 0;

    for (const match of sortedMatches) {
      if (match.result === 'VICTORIA') {
        if (currentLossStreak > 0) break;
        currentWinStreak++;
      } else if (match.result === 'DERROTA') {
        if (currentWinStreak > 0) break;
        currentLossStreak++;
      }
    }

    const streaks = [];
    if (currentWinStreak >= 2) streaks.push({ type: 'win', count: currentWinStreak, label: 'Victorias seguidas', icon: '🔥', color: theme.colors.win });
    if (currentLossStreak >= 2) streaks.push({ type: 'loss', count: currentLossStreak, label: 'Derrotas seguidas', icon: '📉', color: theme.colors.loss });

    return { 
        activeStreaks: streaks, 
        last5MatchesStats: last5Stats,
        currentStreaks: { win: currentWinStreak, loss: currentLossStreak }
    };
  }, [matches, selectedYear, theme.colors]);

  const styles: { [key: string]: React.CSSProperties } = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: theme.spacing.medium, marginTop: theme.spacing.medium },
    streakCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.medium, borderRadius: theme.borderRadius.medium, border: `1px solid ${theme.colors.border}`, display: 'flex', alignItems: 'center', gap: theme.spacing.medium },
    streakIcon: { fontSize: '2rem' },
    streakInfo: { display: 'flex', flexDirection: 'column' },
    streakCount: { fontSize: '1.5rem', fontWeight: 700 },
    streakLabel: { fontSize: '0.75rem', color: theme.colors.secondaryText, textTransform: 'uppercase', letterSpacing: '0.05em' },
    sectionTitle: { fontSize: '1rem', fontWeight: 600, color: theme.colors.primaryText, margin: `0 0 ${theme.spacing.medium} 0`, display: 'flex', alignItems: 'center', gap: '0.5rem' },
    recentFormContainer: { marginTop: theme.spacing.large, paddingTop: theme.spacing.large, borderTop: `1px solid ${theme.colors.border}` }
  };

  return (
    <Card title="Rachas y Momento">
      <div style={{ marginBottom: theme.spacing.medium }}>
          <YearFilter years={availableYears} selectedYear={selectedYear} onSelectYear={setSelectedYear} size="small" allTimeLabel="General" />
      </div>

      {activeStreaks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.medium }}>
          <h4 style={styles.sectionTitle}>Rachas Activas</h4>
          <div style={styles.grid}>
            {activeStreaks.map((streak, index) => (
              <div key={index} style={{...styles.streakCard, borderColor: `${streak.color}40`}}>
                <span style={styles.streakIcon}>{streak.icon}</span>
                <div style={styles.streakInfo}>
                  <span style={{...styles.streakCount, color: streak.color}}>{streak.count}</span>
                  <span style={styles.streakLabel}>{streak.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: theme.spacing.large, color: theme.colors.secondaryText, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.medium }}>
          No hay rachas activas destacables en este momento.
        </div>
      )}

      <div style={styles.recentFormContainer}>
        <h4 style={styles.sectionTitle}>Forma Reciente</h4>
        <RecentForm matches={matches.filter(m => selectedYear === 'all' || parseLocalDate(m.date).getFullYear().toString() === selectedYear)} limit={5} />
        
        {last5MatchesStats && (
          <div style={styles.grid}>
            <StatCard label="Últimos 5 partidos" value={last5MatchesStats.record} />
            <StatCard label="% Efectividad (Últ. 5)" value={last5MatchesStats.efectividad} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default TennisStreaksWidget;
