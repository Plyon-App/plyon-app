import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { type Match } from '../../../types';
import Card from '../../common/Card';
import StatCard from '../../StatCard';
import YearFilter from '../../YearFilter';
import { parseLocalDate } from '../../../utils/analytics';

interface TennisSummaryWidgetProps {
  matches: Match[];
}

const TennisSummaryWidget: React.FC<TennisSummaryWidgetProps> = ({ matches }) => {
  const { theme } = useTheme();

  const availableYears = useMemo(() => {
    const yearSet = new Set(matches.map(m => parseLocalDate(m.date).getFullYear()));
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [matches]);
  
  const [selectedYear, setSelectedYear] = useState<string | 'all'>(
    availableYears.length > 0 ? availableYears[0].toString() : 'all'
  );

  const stats = useMemo(() => {
    let filteredMatches = matches;
    if (selectedYear !== 'all') {
      filteredMatches = matches.filter(
        m => parseLocalDate(m.date).getFullYear().toString() === selectedYear
      );
    }

    const totalMatches = filteredMatches.length;
    const wins = filteredMatches.filter(m => m.result === 'VICTORIA').length;
    const losses = filteredMatches.filter(m => m.result === 'DERROTA').length;
    const efectividad = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0.0';

    let setsWon = 0;
    let setsLost = 0;
    let gamesWon = 0;
    let gamesLost = 0;

    filteredMatches.forEach(match => {
      if (match.tennisScore && match.tennisScore.sets) {
        match.tennisScore.sets.forEach(set => {
          if (set.myGames > set.opponentGames) {
            setsWon++;
          } else if (set.opponentGames > set.myGames) {
            setsLost++;
          }
          gamesWon += set.myGames;
          gamesLost += set.opponentGames;
        });
      }
    });

    return { totalMatches, wins, losses, efectividad, setsWon, setsLost, gamesWon, gamesLost };
  }, [matches, selectedYear]);

  const styles = {
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: theme.spacing.medium,
    },
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>Resumen</span>
          <YearFilter years={availableYears} selectedYear={selectedYear} onChange={setSelectedYear} />
        </div>
      }
    >
      <div style={styles.statsGrid}>
        <StatCard label="Partidos" value={stats.totalMatches.toString()} />
        <StatCard label="Efectividad" value={`${stats.efectividad}%`} />
        <StatCard label="Victorias" value={stats.wins.toString()} color="win" />
        <StatCard label="Derrotas" value={stats.losses.toString()} color="loss" />
        <StatCard label="Sets Ganados" value={stats.setsWon.toString()} />
        <StatCard label="Sets Perdidos" value={stats.setsLost.toString()} />
        <StatCard label="Games Ganados" value={stats.gamesWon.toString()} />
        <StatCard label="Games Perdidos" value={stats.gamesLost.toString()} />
      </div>
    </Card>
  );
};

export default TennisSummaryWidget;
