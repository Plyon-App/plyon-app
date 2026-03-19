import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Match } from '../../../types';
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
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [matches]);
  
  const [selectedYear, setSelectedYear] = useState<string | 'all'>(
    availableYears.length > 0 ? availableYears[0].toString() : 'all'
  );

  const stats = useMemo(() => {
    let filtered = selectedYear === 'all' ? matches : matches.filter(m => parseLocalDate(m.date).getFullYear().toString() === selectedYear);
    
    const wins = filtered.filter(m => m.result === 'VICTORIA').length;
    const losses = filtered.filter(m => m.result === 'DERROTA').length;
    
    return {
      total: filtered.length,
      wins,
      losses,
      winRate: filtered.length > 0 ? ((wins / filtered.length) * 100).toFixed(1) : '0.0'
    };
  }, [matches, selectedYear]);

  return (
    <Card title={
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>Resumen</span>
        <YearFilter years={availableYears} selectedYear={selectedYear} onChange={setSelectedYear} />
      </div>
    }>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: theme.spacing.medium }}>
        <StatCard label="Partidos" value={stats.total.toString()} />
        <StatCard label="Efectividad" value={`${stats.winRate}%`} />
        <StatCard label="Victorias" value={stats.wins.toString()} color="win" />
        <StatCard label="Derrotas" value={stats.losses.toString()} color="loss" />
      </div>
    </Card>
  );
};

export default TennisSummaryWidget;
