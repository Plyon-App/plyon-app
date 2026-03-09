
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { TableIcon } from '../components/icons/TableIcon';
import RadarChart from '../components/charts/RadarChart';
import Card from '../components/common/Card';
import { parseLocalDate } from '../utils/analytics';
import { useTutorial } from '../hooks/useTutorial';
import TutorialModal from '../components/modals/TutorialModal';
import { ActivityIcon } from '../components/icons/ActivityIcon';
import { InfoIcon } from '../components/icons/InfoIcon';
import { ShareIcon } from '../components/icons/ShareIcon';
import ShareViewModal from '../components/modals/ShareViewModal';
import SectionHelp from '../components/common/SectionHelp';
import { TrophyIcon } from '../components/icons/TrophyIcon';

// Football Interfaces
interface YearlyStats {
  year: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  winRate: number;
  efectividad: number;
  goals: number;
  assists: number;
  gpm: number;
  apm: number;
  contributions: number;
  cpm: number;
}

interface TournamentStats {
  name: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  winRate: number;
  efectividad: number;
  goals: number;
  assists: number;
  gpm: number;
  apm: number;
  contributions: number;
  cpm: number;
}

// Tennis Interfaces
interface TennisYearlyStats {
  year: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
}

interface TennisTournamentStats {
  name: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
  lastMatchDate: string;
}

const radarMetrics: { label: string; key: keyof YearlyStats }[] = [
    { label: 'PJ', key: 'matchesPlayed' },
    { label: 'V', key: 'wins' },
    { label: 'E', key: 'draws' },
    { label: 'D', key: 'losses' },
    { label: '%V', key: 'winRate' },
    { label: 'Efect.', key: 'efectividad' },
    { label: 'G', key: 'goals' },
    { label: 'A', key: 'assists' },
    { label: 'G/P', key: 'gpm' },
    { label: 'A/P', key: 'apm' },
];

const TablePage: React.FC = () => {
  const { theme } = useTheme();
  const { matches, isShareMode, currentSport } = useData();
  const { isTutorialSeen, markTutorialAsSeen } = useTutorial('table');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  const [visibleYears, setVisibleYears] = useState<Set<number>>(new Set());
  const [isTutorialOpen, setIsTutorialOpen] = useState(!isTutorialSeen && !isShareMode);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isTennisOrPaddle = currentSport === 'tennis' || currentSport === 'paddle';

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'year', direction: 'desc' });
  const [tournamentSortConfig, setTournamentSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: isTennisOrPaddle ? 'matchesPlayed' : 'points', direction: 'desc' });

  const yearlyTableRef = useRef<HTMLDivElement>(null);
  const [isYearlyTableScrollable, setIsYearlyTableScrollable] = useState(false);
  const tournamentTableRef = useRef<HTMLDivElement>(null);
  const [isTournamentTableScrollable, setIsTournamentTableScrollable] = useState(false);

  // Sync tutorial state
  useEffect(() => {
      if (isTutorialSeen) setIsTutorialOpen(false);
  }, [isTutorialSeen]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- DATA CALCULATION ---

  const sportMatches = useMemo(() => {
    return matches.filter(m => m.sport === currentSport || (!m.sport && currentSport === 'football'));
  }, [matches, currentSport]);

  // Football Data
  const yearlyData = useMemo(() => {
    if (isTennisOrPaddle) return [];
    const statsByYear: Record<number, Omit<YearlyStats, 'year' | 'winRate' | 'gpm' | 'apm' | 'contributions' | 'cpm' | 'efectividad'>> = {};
    sportMatches.forEach(match => {
      const year = parseLocalDate(match.date).getFullYear();
      if (!statsByYear[year]) { statsByYear[year] = { matchesPlayed: 0, wins: 0, draws: 0, losses: 0, points: 0, goals: 0, assists: 0 }; }
      const yearStats = statsByYear[year];
      yearStats.matchesPlayed++;
      if (match.result === 'VICTORIA') { yearStats.wins++; yearStats.points += 3; } else if (match.result === 'EMPATE') { yearStats.draws++; yearStats.points += 1; } else { yearStats.losses++; }
      yearStats.goals += match.myGoals; yearStats.assists += match.myAssists;
    });
    return Object.entries(statsByYear).map(([year, stats]) => {
      const { matchesPlayed, wins, goals, assists, points } = stats;
      const efectividad = matchesPlayed > 0 ? (points / (matchesPlayed * 3)) * 100 : 0;
      return { ...stats, year: Number(year), winRate: matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0, gpm: matchesPlayed > 0 ? goals / matchesPlayed : 0, apm: matchesPlayed > 0 ? assists / matchesPlayed : 0, contributions: goals + assists, cpm: matchesPlayed > 0 ? (goals + assists) / matchesPlayed : 0, efectividad };
    });
  }, [sportMatches, isTennisOrPaddle]);

  const tournamentData = useMemo(() => {
    if (isTennisOrPaddle) return [];
    const statsByTournament: Record<string, Omit<TournamentStats, 'name' | 'winRate' | 'gpm' | 'apm' | 'contributions' | 'cpm' | 'efectividad'>> = {};
    sportMatches.forEach(match => {
        if (match.tournament && match.tournament.trim() !== '') {
            const tournamentName = match.tournament;
            if (!statsByTournament[tournamentName]) { statsByTournament[tournamentName] = { matchesPlayed: 0, wins: 0, draws: 0, losses: 0, points: 0, goals: 0, assists: 0 }; }
            const tourStats = statsByTournament[tournamentName];
            tourStats.matchesPlayed++;
            if (match.result === 'VICTORIA') { tourStats.wins++; tourStats.points += 3; } else if (match.result === 'EMPATE') { tourStats.draws++; tourStats.points += 1; } else { tourStats.losses++; }
            tourStats.goals += match.myGoals; tourStats.assists += match.myAssists;
        }
    });
    return Object.entries(statsByTournament).map(([name, stats]) => {
        const { matchesPlayed, wins, goals, assists, points } = stats;
        const efectividad = matchesPlayed > 0 ? (points / (matchesPlayed * 3)) * 100 : 0;
        return { ...stats, name, winRate: matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0, gpm: matchesPlayed > 0 ? goals / matchesPlayed : 0, apm: matchesPlayed > 0 ? assists / matchesPlayed : 0, contributions: goals + assists, cpm: matchesPlayed > 0 ? (goals + assists) / matchesPlayed : 0, efectividad };
    });
  }, [sportMatches, isTennisOrPaddle]);

  // Tennis Data
  const tennisYearlyData = useMemo(() => {
    if (!isTennisOrPaddle) return [];
    const statsByYear: Record<number, Omit<TennisYearlyStats, 'year' | 'winRate'>> = {};
    
    sportMatches.forEach(match => {
        const year = parseLocalDate(match.date).getFullYear();
        if (!statsByYear[year]) {
            statsByYear[year] = { matchesPlayed: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, gamesWon: 0, gamesLost: 0 };
        }
        const stats = statsByYear[year];
        stats.matchesPlayed++;
        if (match.result === 'VICTORIA') stats.wins++;
        else stats.losses++;

        if (match.tennisScore) {
            match.tennisScore.sets.forEach(set => {
                stats.gamesWon += set.myGames;
                stats.gamesLost += set.opponentGames;
                if (set.myGames > set.opponentGames) stats.setsWon++;
                else if (set.opponentGames > set.myGames) stats.setsLost++;
            });
        }
    });

    return Object.entries(statsByYear).map(([year, stats]) => ({
        ...stats,
        year: Number(year),
        winRate: stats.matchesPlayed > 0 ? (stats.wins / stats.matchesPlayed) * 100 : 0
    }));
  }, [sportMatches, isTennisOrPaddle]);

  const tennisTournamentData = useMemo(() => {
    if (!isTennisOrPaddle) return [];
    const statsByTournament: Record<string, Omit<TennisTournamentStats, 'name' | 'winRate' | 'lastMatchDate'>> & { lastMatchDate: string } = {} as any;

    sportMatches.forEach(match => {
        if (match.tournament && match.tournament.trim() !== '') {
            const name = match.tournament;
            if (!statsByTournament[name]) {
                statsByTournament[name] = { matchesPlayed: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, gamesWon: 0, gamesLost: 0, lastMatchDate: match.date };
            }
            const stats = statsByTournament[name];
            stats.matchesPlayed++;
            if (match.result === 'VICTORIA') stats.wins++;
            else stats.losses++;

            if (match.tennisScore) {
                match.tennisScore.sets.forEach(set => {
                    stats.gamesWon += set.myGames;
                    stats.gamesLost += set.opponentGames;
                    if (set.myGames > set.opponentGames) stats.setsWon++;
                    else if (set.opponentGames > set.myGames) stats.setsLost++;
                });
            }
            if (new Date(match.date) > new Date(stats.lastMatchDate)) {
                stats.lastMatchDate = match.date;
            }
        }
    });

    return Object.entries(statsByTournament).map(([name, stats]) => ({
        ...stats,
        name,
        winRate: stats.matchesPlayed > 0 ? (stats.wins / stats.matchesPlayed) * 100 : 0
    }));
  }, [sportMatches, isTennisOrPaddle]);

  // --- MAX VALUES ---
  const maxValues = useMemo(() => {
    if (isTennisOrPaddle) return {}; // TODO: Implement for tennis if needed
    if (yearlyData.length === 0) return {};
    const maxes: any = {};
    const keysToCompare = ['matchesPlayed', 'wins', 'draws', 'losses', 'points', 'winRate', 'efectividad', 'goals', 'assists', 'gpm', 'apm', 'contributions', 'cpm'];
    keysToCompare.forEach(key => { maxes[key] = Math.max(...yearlyData.map(d => (d as any)[key])); });
    return maxes;
  }, [yearlyData, isTennisOrPaddle]);

  const tournamentMaxValues = useMemo(() => {
      if (isTennisOrPaddle) return {}; // TODO: Implement for tennis
      if (tournamentData.length === 0) return {};
      const maxes: any = {};
      const keysToCompare = ['matchesPlayed', 'wins', 'draws', 'losses', 'points', 'winRate', 'efectividad', 'goals', 'assists', 'gpm', 'apm', 'contributions', 'cpm'];
      keysToCompare.forEach(key => { maxes[key] = Math.max(...tournamentData.map(d => (d as any)[key])); });
      return maxes;
  }, [tournamentData, isTennisOrPaddle]);

  // --- SORTING ---
  const sortedData = useMemo(() => {
      const data = isTennisOrPaddle ? tennisYearlyData : yearlyData;
      return [...data].sort((a, b) => {
          const aVal = (a as any)[sortConfig.key];
          const bVal = (b as any)[sortConfig.key];
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [yearlyData, tennisYearlyData, sortConfig, isTennisOrPaddle]);

  const sortedTournamentData = useMemo(() => {
      const data = isTennisOrPaddle ? tennisTournamentData : tournamentData;
      return [...data].sort((a, b) => {
          const key = tournamentSortConfig.key;
          const direction = tournamentSortConfig.direction;
          if (key === 'name') {
              return direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          }
          const aVal = (a as any)[key];
          const bVal = (b as any)[key];
          if (aVal < bVal) return direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [tournamentData, tennisTournamentData, tournamentSortConfig, isTennisOrPaddle]);

  // --- HELPERS ---
  const requestSort = (key: string) => {
      let direction: 'asc' | 'desc' = 'desc';
      if (sortConfig.key === key && sortConfig.direction === 'desc') { direction = 'asc'; }
      setSortConfig({ key, direction });
  };
  const requestTournamentSort = (key: string) => {
      let direction: 'asc' | 'desc' = 'desc';
      if (tournamentSortConfig.key === key && tournamentSortConfig.direction === 'desc') { direction = 'asc'; }
      setTournamentSortConfig({ key, direction });
  };
  const getSortIndicator = (key: string, config: any) => {
      if (config.key !== key) return null;
      return config.direction === 'desc' ? ' ↓' : ' ↑';
  };

  // --- RADAR CHART (Football Only) ---
  const historicalMaxValuesForRadar = useMemo(() => {
    if (yearlyData.length === 0) return radarMetrics.map(() => 1);
    const maxMatchesPlayed = Math.max(...yearlyData.map(y => y.matchesPlayed), 1);
    return radarMetrics.map(metric => { if (['matchesPlayed', 'wins', 'draws', 'losses'].includes(metric.key)) { return maxMatchesPlayed; } if (metric.key === 'winRate' || metric.key === 'efectividad') { return 100; } return Math.max(...yearlyData.map(y => (y as any)[metric.key] as number), 1); });
  }, [yearlyData]);
  
  const radarChartData = useMemo(() => {
    if (yearlyData.length === 0) return [];
    const colors = [theme.colors.accent1, theme.colors.accent2, theme.colors.accent3, theme.colors.win, theme.colors.draw, '#FF7043', '#7E57C2', '#26A69A'];
    const sortedVisibleData = [...yearlyData].sort((a,b) => b.year - a.year);
    const currentYear = new Date().getFullYear();
    return sortedVisibleData.filter(yearStat => visibleYears.has(yearStat.year)).map((yearStat, index) => ({ name: yearStat.year.toString(), color: colors[index % colors.length], isDashed: yearStat.year === currentYear, data: radarMetrics.map(metric => ({ label: metric.label, value: (yearStat as any)[metric.key] as number })), }));
  }, [yearlyData, visibleYears, theme.colors]);

  useEffect(() => { if (yearlyData.length > 0) { setVisibleYears(new Set(yearlyData.map(d => d.year))); } }, [yearlyData]);
  const toggleYearVisibility = (year: number) => { setVisibleYears(prev => { const newSet = new Set(prev); if (newSet.has(year)) newSet.delete(year); else newSet.add(year); return newSet; }); };

  // --- HEADERS ---
  const footballYearlyHeaders = [{ key: 'year', label: 'Año' }, { key: 'points', label: 'Pts' }, { key: 'matchesPlayed', label: 'PJ' }, { key: 'wins', label: 'V' }, { key: 'draws', label: 'E' }, { key: 'losses', label: 'D' }, { key: 'winRate', label: '% V' }, { key: 'efectividad', label: 'Efect.' }, { key: 'goals', label: 'G' }, { key: 'assists', label: 'A' }, { key: 'gpm', label: 'G/P' }, { key: 'apm', label: 'A/P' }, { key: 'contributions', label: 'G+A' }, { key: 'cpm', label: 'G+A/P' }];
  const footballTournamentHeaders = [{ key: 'name', label: 'Torneo' }, { key: 'points', label: 'Pts' }, { key: 'matchesPlayed', label: 'PJ' }, { key: 'wins', label: 'V' }, { key: 'draws', label: 'E' }, { key: 'losses', label: 'D' }, { key: 'winRate', label: '% V' }, { key: 'efectividad', label: 'Efect.' }, { key: 'goals', label: 'G' }, { key: 'assists', label: 'A' }, { key: 'gpm', label: 'G/P' }, { key: 'apm', label: 'A/P' }];

  const tennisYearlyHeaders = [
      { key: 'year', label: 'Año' },
      { key: 'matchesPlayed', label: 'PJ' },
      { key: 'wins', label: 'V' },
      { key: 'losses', label: 'D' },
      { key: 'setsWon', label: 'Sets W' },
      { key: 'setsLost', label: 'Sets L' },
      { key: 'gamesWon', label: 'Games W' },
      { key: 'gamesLost', label: 'Games L' },
      { key: 'winRate', label: '% Vic' }
  ];

  const tennisTournamentHeaders = [
      { key: 'name', label: 'Torneo' },
      { key: 'matchesPlayed', label: 'PJ' },
      { key: 'wins', label: 'V' },
      { key: 'losses', label: 'D' },
      { key: 'setsWon', label: 'Sets W' },
      { key: 'setsLost', label: 'Sets L' },
      { key: 'gamesWon', label: 'Games W' },
      { key: 'gamesLost', label: 'Games L' },
      { key: 'winRate', label: '% Vic' }
  ];

  const currentYearlyHeaders = isTennisOrPaddle ? tennisYearlyHeaders : footballYearlyHeaders;
  const currentTournamentHeaders = isTennisOrPaddle ? tennisTournamentHeaders : footballTournamentHeaders;

  const styles: { [key: string]: React.CSSProperties } = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: `${theme.spacing.extraLarge} ${theme.spacing.medium}`, display: 'flex', flexDirection: 'column', gap: theme.spacing.large },
    header: { display: 'flex', alignItems: 'center', gap: theme.spacing.medium },
    headerButtons: { display: 'flex', alignItems: 'center', gap: theme.spacing.small },
    infoButton: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' },
    pageTitle: { fontSize: theme.typography.fontSize.extraLarge, fontWeight: 700, color: theme.colors.primaryText, margin: 0, borderLeft: `4px solid ${theme.colors.accent1}`, paddingLeft: theme.spacing.medium, display: 'flex', alignItems: 'center' },
    contentWrapper: { display: 'flex', flexDirection: 'column', gap: theme.spacing.extraLarge, alignItems: 'stretch', width: '100%' },
    rightColumn: { display: 'flex', flexDirection: 'column', gap: theme.spacing.large, minWidth: 0, width: '100%' },
    chartColumn: { width: '100%' },
    scrollWrapper: { position: 'relative' },
    tableWrapper: { minWidth: 0, overflowX: 'auto', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.medium },
    table: { borderCollapse: 'collapse', width: '100%' },
    th: { padding: `${theme.spacing.small} ${theme.spacing.medium}`, textAlign: 'left', fontSize: theme.typography.fontSize.small, color: theme.colors.secondaryText, fontWeight: 600, borderBottom: `2px solid ${theme.colors.borderStrong}`, cursor: 'pointer', whiteSpace: 'nowrap' },
    tr: { transition: 'background-color 0.2s' },
    td: { padding: `${theme.spacing.medium}`, fontSize: theme.typography.fontSize.small, color: theme.colors.primaryText, borderBottom: `1px solid ${theme.colors.border}`, whiteSpace: 'nowrap' },
    stickyColumn: { position: 'sticky', left: 0, backgroundColor: theme.colors.surface, borderRight: `1px solid ${theme.colors.borderStrong}` },
    numeric: { textAlign: 'right' },
    noDataContainer: { textAlign: 'center', padding: `${theme.spacing.extraLarge} ${theme.spacing.medium}`, color: theme.colors.secondaryText, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large, border: `1px solid ${theme.colors.border}` },
    chartAndLegendContainer: { display: 'flex', flexDirection: 'column', gap: theme.spacing.large, alignItems: 'center' },
    legendContainer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: theme.spacing.small },
    legendButton: { background: 'none', border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.medium, padding: `${theme.spacing.extraSmall} ${theme.spacing.small}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: theme.spacing.small, fontSize: theme.typography.fontSize.small, transition: 'all 0.2s ease' },
    legendColorBox: { width: '12px', height: '12px', borderRadius: '3px' },
    fadeOverlay: { position: 'absolute', top: 0, right: 0, height: '100%', width: '60px', background: `linear-gradient(to left, ${theme.colors.surface}, transparent)`, pointerEvents: 'none', borderRadius: theme.borderRadius.large },
  };

  const tutorialSteps = [
    { title: 'TABLA anual', content: 'Tu carrera temporada a temporada.', icon: <TableIcon size={48} /> },
    { title: 'Récords históricos', content: 'Tus mejores marcas.', icon: <TableIcon size={48} /> }
  ];
  const tableGuide = [{ title: "Tu carrera", content: "Compara tus temporadas.", icon: <TableIcon size={48} /> }];
  const tournamentGuide = [{ title: "Competencias", content: "Desglose por torneo.", icon: <TrophyIcon size={48} /> }];

  if (sportMatches.length === 0) { return ( <main style={styles.container}> <h2 style={styles.pageTitle}>Mi rendimiento anual</h2> <div style={styles.noDataContainer}> <TableIcon size={40} color={theme.colors.secondaryText} /> <p style={{ marginTop: theme.spacing.medium }}>Juega y registra partidos para ver tu evolución en la tabla.</p> </div> </main> ) }

  return (
    <>
    <style>{` .custom-scrollbar::-webkit-scrollbar { display: none; } .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } `}</style>
    <TutorialModal isOpen={isTutorialOpen} onClose={(dontShowAgain) => { setIsTutorialOpen(false); if(dontShowAgain) markTutorialAsSeen(); }} steps={tutorialSteps} />
    <ShareViewModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} page="table" />
    <main style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.medium }}>
          <h2 style={styles.pageTitle}>
            Mi rendimiento anual
            <SectionHelp steps={tableGuide} />
          </h2>
          {!isShareMode && (
              <div style={styles.headerButtons}>
                <button onClick={() => setIsShareModalOpen(true)} style={styles.infoButton} aria-label="Compartir vista"><ShareIcon color={theme.colors.secondaryText} size={20} /></button>
                <button onClick={() => setIsTutorialOpen(true)} style={styles.infoButton} aria-label="Mostrar guía"><InfoIcon color={theme.colors.secondaryText} size={20}/></button>
              </div>
          )}
        </div>
      </div>
      <div style={styles.contentWrapper}>
        
        {/* Radar Chart - Only for Football for now */}
        {!isTennisOrPaddle && yearlyData.length > 0 && (
            <div style={styles.chartColumn}>
                <Card> 
                    <div style={styles.chartAndLegendContainer}> 
                        <RadarChart playersData={radarChartData} size={isDesktop ? 350 : 300} showLegend={false} maxValues={historicalMaxValuesForRadar} /> 
                        <div style={styles.legendContainer}> 
                            {yearlyData.sort((a,b) => b.year - a.year).map((yearStat) => { 
                                const isVisible = visibleYears.has(yearStat.year); 
                                const color = radarChartData.find(d => d.name === yearStat.year.toString())?.color || theme.colors.secondaryText; 
                                return ( <button key={yearStat.year} onClick={() => toggleYearVisibility(yearStat.year)} style={{...styles.legendButton, color: isVisible ? theme.colors.primaryText : theme.colors.secondaryText, opacity: isVisible ? 1 : 0.6 }}> <span style={{...styles.legendColorBox, backgroundColor: color }}></span> {yearStat.year} </button> ); 
                            })} 
                        </div> 
                    </div> 
                </Card>
            </div>
        )}

        <div style={styles.rightColumn}>
            <div style={styles.scrollWrapper}>
              <div ref={yearlyTableRef} style={styles.tableWrapper} className="custom-scrollbar">
                  <table style={styles.table}> 
                    <thead> 
                        <tr> 
                            {currentYearlyHeaders.map((header, index) => ( 
                                <th key={header.key} style={{...styles.th, ...(index > 0 && styles.numeric), ...(index === 0 && styles.stickyColumn) }} className={index === 0 ? 'sticky-column' : ''} onClick={() => requestSort(header.key)}> 
                                    {header.label} {getSortIndicator(header.key, sortConfig)} 
                                </th> 
                            ))} 
                        </tr> 
                    </thead> 
                    <tbody> 
                        {sortedData.map((stats: any) => { 
                            const maxStyle: React.CSSProperties = { fontWeight: 700, color: theme.colors.win }; 
                            // Max value highlighting logic could be added here if needed
                            return ( 
                                <tr key={stats.year} style={styles.tr} className="table-row"> 
                                    <td style={{...styles.td, ...styles.numeric, fontWeight: 700, ...styles.stickyColumn}} className="sticky-column">{stats.year}</td>
                                    {currentYearlyHeaders.slice(1).map(header => (
                                        <td key={header.key} style={{...styles.td, ...styles.numeric}}>
                                            {header.key === 'winRate' || header.key === 'efectividad' ? `${stats[header.key].toFixed(1)}%` : 
                                             header.key.includes('pm') ? stats[header.key].toFixed(2) :
                                             stats[header.key]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {isYearlyTableScrollable && <div style={styles.fadeOverlay} />}
        </div>

        {sortedTournamentData.length > 0 && (
            <div style={{ marginTop: theme.spacing.extraLarge }}>
                <h3 style={{...styles.pageTitle, fontSize: '1.2rem'}}>Por Torneo <SectionHelp steps={tournamentGuide} /></h3>
                <div style={styles.scrollWrapper}>
                    <div ref={tournamentTableRef} style={styles.tableWrapper} className="custom-scrollbar">
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {currentTournamentHeaders.map((header, index) => (
                                        <th key={header.key} style={{...styles.th, ...(index > 0 && styles.numeric)}} onClick={() => requestTournamentSort(header.key)}>
                                            {header.label} {getSortIndicator(header.key, tournamentSortConfig)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTournamentData.map((stats: any) => {
                                    return (
                                        <tr key={stats.name} style={styles.tr} className="table-row">
                                            <td style={styles.td}>{stats.name}</td>
                                            {currentTournamentHeaders.slice(1).map(header => (
                                                <td key={header.key} style={{...styles.td, ...styles.numeric}}>
                                                    {header.key === 'winRate' || header.key === 'efectividad' ? `${(stats[header.key] as number).toFixed(1)}%` : 
                                                     header.key.includes('pm') ? (stats[header.key] as number).toFixed(2) :
                                                     stats[header.key]}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {isTournamentTableScrollable && <div style={styles.fadeOverlay} />}
                </div>
            </div>
        )}
      </div>
      </div>
    </main>
    </>
  );
};

export default TablePage;
