import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

const SPORT_COLORS = {
  football: { primary: '#00E676', secondary: '#2979FF' },
  paddle: { primary: '#FF6F00', secondary: '#FFC107' },
  tennis: { primary: '#D500F9', secondary: '#FF1744' },
};

export interface TitleProps {
  level: 1 | 2 | 3 | 4;
  accent?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Title: React.FC<TitleProps> = ({
  level,
  accent = false,
  children,
  style: customStyle,
}) => {
  const { theme } = useTheme();
  const { currentSport } = useData();
  
  const sportColors = SPORT_COLORS[currentSport];

  const levelStyles = {
    1: { fontSize: theme.typography.fontSize.extraLarge, fontWeight: 700 },
    2: { fontSize: theme.typography.fontSize.large, fontWeight: 700 },
    3: { fontSize: theme.typography.fontSize.medium, fontWeight: 600 },
    4: { fontSize: theme.typography.fontSize.small, fontWeight: 600 },
  };

  const baseStyles: React.CSSProperties = {
    margin: 0,
    color: theme.colors.primaryText,
    fontFamily: theme.typography.fontFamily,
    ...levelStyles[level],
  };

  const accentStyles: React.CSSProperties = accent
    ? {
        background: `linear-gradient(90deg, ${sportColors.primary}, ${sportColors.secondary})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : {};

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return <Tag style={{ ...baseStyles, ...accentStyles, ...customStyle }}>{children}</Tag>;
};

export interface TextProps {
  variant?: 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'sport';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  children,
  style: customStyle,
}) => {
  const { theme } = useTheme();
  const { currentSport } = useData();
  
  const sportPrimary = SPORT_COLORS[currentSport].primary;

  const variantStyles = {
    body: { fontSize: theme.typography.fontSize.medium },
    caption: { fontSize: theme.typography.fontSize.small },
    label: { fontSize: theme.typography.fontSize.extraSmall, fontWeight: 600 },
  };

  const colorStyles = {
    primary: { color: theme.colors.primaryText },
    secondary: { color: theme.colors.secondaryText },
    sport: { color: sportPrimary },
  };

  const styles: React.CSSProperties = {
    margin: 0,
    fontFamily: theme.typography.fontFamily,
    ...variantStyles[variant],
    ...colorStyles[color],
    ...customStyle,
  };

  return <span style={styles}>{children}</span>;
};
