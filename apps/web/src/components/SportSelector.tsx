import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SportType } from '../types';

interface SportSelectorProps {
  currentSport: SportType;
  onSportChange: (sport: SportType) => void;
  activeSports?: SportType[];
  onAddSportClick?: () => void;
}

const sports: { id: SportType; label: string; icon: string }[] = [
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'paddle', label: 'Paddle', icon: '🎾' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
];

const SportSelector: React.FC<SportSelectorProps> = ({ currentSport, onSportChange, activeSports, onAddSportClick }) => {
  const { theme } = useTheme();
  const [hoveredSport, setHoveredSport] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: theme.spacing.small,
      padding: theme.spacing.small,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.medium,
      border: `1px solid ${theme.colors.border}`,
      width: '100%',
      marginBottom: theme.spacing.medium,
    },
    button: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.small,
      padding: `${theme.spacing.small} ${theme.spacing.medium}`,
      borderRadius: theme.borderRadius.small,
      border: 'none',
      cursor: 'pointer',
      fontSize: theme.typography.fontSize.small,
      fontWeight: 600,
      transition: 'all 0.2s ease',
      minHeight: '40px',
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.small,
      borderRadius: theme.borderRadius.small,
      border: `1px dashed ${theme.colors.borderStrong}`,
      backgroundColor: 'transparent',
      color: theme.colors.secondaryText,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '40px',
    }
  };

  const getButtonStyle = (sportId: SportType): React.CSSProperties => {
    const isActive = currentSport === sportId;
    const isHovered = hoveredSport === sportId;

    let backgroundColor = 'transparent';
    let color = theme.colors.secondaryText;

    if (isActive) {
      backgroundColor = theme.colors.accent1;
      color = theme.colors.textOnAccent;
    } else if (isHovered) {
      backgroundColor = theme.colors.background;
      color = theme.colors.primaryText;
    }

    return {
      ...styles.button,
      backgroundColor,
      color,
      boxShadow: isActive ? theme.shadows.small : 'none',
    };
  };

  const visibleSports = activeSports 
    ? sports.filter(s => activeSports.includes(s.id))
    : sports;

  return (
    <div style={styles.container}>
      {visibleSports.map((sport) => (
        <button
          key={sport.id}
          style={getButtonStyle(sport.id)}
          onClick={() => onSportChange(sport.id)}
          onMouseEnter={() => setHoveredSport(sport.id)}
          onMouseLeave={() => setHoveredSport(null)}
        >
          <span style={{ fontSize: '1.2em' }}>{sport.icon}</span>
          <span>{sport.label}</span>
        </button>
      ))}
      
      {onAddSportClick && (
        <button 
          style={{
            ...styles.addButton,
            backgroundColor: hoveredSport === 'add' ? theme.colors.background : 'transparent',
            color: hoveredSport === 'add' ? theme.colors.primaryText : theme.colors.secondaryText,
          }}
          onClick={onAddSportClick}
          onMouseEnter={() => setHoveredSport('add')}
          onMouseLeave={() => setHoveredSport(null)}
          title="Añadir deporte"
        >
          +
        </button>
      )}
    </div>
  );
};

export default SportSelector;
