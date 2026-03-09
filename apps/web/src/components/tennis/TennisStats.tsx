import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Match } from '../../types';
import Card from '../common/Card';
import TennisSummaryWidget from './stats/TennisSummaryWidget';
import TennisStreaksWidget from './stats/TennisStreaksWidget';
import TennisActivityCalendar from './stats/TennisActivityCalendar';
import TennisHistoricalAnalysis from './stats/TennisHistoricalAnalysis';
import SectionHelp from '../common/SectionHelp';
import { CalendarIcon } from '../icons/CalendarIcon';
import { ClipboardIcon } from '../icons/ClipboardIcon';

interface TennisStatsProps {
  matches: Match[];
}

type WidgetId = 'summary' | 'streaks' | 'calendar' | 'historical';
const WIDGET_ORDER: WidgetId[] = ['summary', 'streaks', 'calendar', 'historical'];

const TennisStats: React.FC<TennisStatsProps> = ({ matches }) => {
  const { theme } = useTheme();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const historicalGuide = [
      { title: "Desglose Mensual", content: "Profundiza en tus datos. Despliega cada año para ver tu rendimiento mes a mes.", icon: <CalendarIcon size={48} /> },
      { title: "Detalle de Partidos", content: "Al expandir un mes, verás la lista de partidos jugados con sus estadísticas individuales.", icon: <ClipboardIcon size={48} /> }
  ];

  const widgetComponents: Record<WidgetId, React.ReactNode> = { 
      summary: <TennisSummaryWidget matches={matches} />, 
      streaks: <TennisStreaksWidget matches={matches} />, 
      calendar: <TennisActivityCalendar matches={matches} />, 
      historical: <Card title={<>Desglose histórico <SectionHelp steps={historicalGuide} /></>}><TennisHistoricalAnalysis matches={matches} /></Card>
  };

  const styles = {
    dashboardList: { display: 'flex', flexDirection: 'column' as const, gap: theme.spacing.large },
    dashboardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: theme.spacing.large, alignItems: 'start' },
    column: { display: 'flex', flexDirection: 'column' as const, gap: theme.spacing.large }
  };

  return (
    <div style={isDesktop ? styles.dashboardGrid : styles.dashboardList}>
        {isDesktop ? (
            <>
                <div style={styles.column}>{widgetComponents.summary}{widgetComponents.streaks}</div>
                <div style={styles.column}>{widgetComponents.calendar}{widgetComponents.historical}</div>
            </>
        ) : (
            WIDGET_ORDER.map(id => <div key={id}>{widgetComponents[id]}</div>)
        )}
    </div>
  );
};

export default TennisStats;
