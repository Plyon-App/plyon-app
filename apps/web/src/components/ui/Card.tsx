import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

const SPORT_COLORS = {
  football: { primary: '#00E676' },
  paddle: { primary: '#FF6F00' },
  tennis: { primary: '#D500F9' },
};

export interface CardProps {
  elevation?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  elevation = 'medium',
  interactive = false,
  padding = 'md',
  children,
  onClick,
  style: customStyle,
}) => {
  const { theme } = useTheme();
  const { currentSport } = useData();
  const [isHovered, setIsHovered] = useState(false);
  
  const sportPrimary = SPORT_COLORS[currentSport].primary;

  const elevationStyles = {
    low: { boxShadow: theme.shadows.small },
    medium: { boxShadow: theme.shadows.medium },
    high: { boxShadow: theme.shadows.large },
  };

  const paddingStyles = {
    sm: { padding: theme.spacing.medium },
    md: { padding: theme.spacing.large },
    lg: { padding: theme.spacing.extraLarge },
  };

  const styles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${interactive && isHovered ? sportPrimary : theme.colors.border}`,
    cursor: interactive ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    transform: interactive && isHovered ? 'translateY(-2px)' : 'none',
    ...elevationStyles[elevation],
    ...paddingStyles[padding],
    ...customStyle,
  };

  return (
    <div
      style={styles}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};
