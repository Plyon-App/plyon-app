import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

const SPORT_COLORS = {
  football: { primary: '#00E676' },
  paddle: { primary: '#FF6F00' },
  tennis: { primary: '#D500F9' },
};

export interface BadgeProps {
  variant: 'sport' | 'win' | 'loss' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  size = 'md',
  children,
  style: customStyle,
}) => {
  const { theme } = useTheme();
  const { currentSport } = useData();
  
  const sportPrimary = SPORT_COLORS[currentSport].primary;

  const variantStyles = {
    sport: {
      backgroundColor: sportPrimary,
      color: theme.colors.textOnAccent,
    },
    win: {
      backgroundColor: theme.colors.win,
      color: theme.colors.textOnAccent,
    },
    loss: {
      backgroundColor: theme.colors.loss,
      color: theme.colors.textOnAccent,
    },
    neutral: {
      backgroundColor: theme.colors.borderStrong,
      color: theme.colors.primaryText,
    },
  };

  const sizeStyles = {
    sm: {
      padding: `${theme.spacing.extraSmall} ${theme.spacing.small}`,
      fontSize: theme.typography.fontSize.extraSmall,
    },
    md: {
      padding: `${theme.spacing.small} ${theme.spacing.medium}`,
      fontSize: theme.typography.fontSize.small,
    },
  };

  const styles: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: theme.borderRadius.small,
    fontWeight: 600,
    fontFamily: theme.typography.fontFamily,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...customStyle,
  };

  return <span style={styles}>{children}</span>;
};
