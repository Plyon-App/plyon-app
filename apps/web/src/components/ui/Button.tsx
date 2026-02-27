import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

const SPORT_COLORS = {
  football: { primary: '#00E676', secondary: '#2979FF' },
  paddle: { primary: '#FF6F00', secondary: '#FFC107' },
  tennis: { primary: '#D500F9', secondary: '#FF1744' },
};

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick,
  type = 'button',
  style: customStyle,
}) => {
  const { theme } = useTheme();
  const { currentSport } = useData();
  const [isHovered, setIsHovered] = useState(false);
  
  const sportPrimary = SPORT_COLORS[currentSport].primary;

  const sizeStyles = {
    sm: {
      padding: `${theme.spacing.small} ${theme.spacing.medium}`,
      fontSize: theme.typography.fontSize.small,
    },
    md: {
      padding: `${theme.spacing.medium} ${theme.spacing.large}`,
      fontSize: theme.typography.fontSize.medium,
    },
    lg: {
      padding: `${theme.spacing.large} ${theme.spacing.extraLarge}`,
      fontSize: theme.typography.fontSize.large,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? theme.colors.borderStrong : (isHovered ? sportPrimary + 'DD' : sportPrimary),
      color: theme.colors.textOnAccent,
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: disabled ? theme.colors.secondaryText : sportPrimary,
      border: `1px solid ${disabled ? theme.colors.borderStrong : sportPrimary}`,
    },
    ghost: {
      backgroundColor: isHovered ? theme.colors.surface : 'transparent',
      color: theme.colors.primaryText,
      border: 'none',
    },
    danger: {
      backgroundColor: disabled ? theme.colors.borderStrong : theme.colors.loss,
      color: theme.colors.textOnAccent,
      border: 'none',
    },
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    transition: 'all 0.2s ease',
    fontFamily: theme.typography.fontFamily,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...customStyle,
  };

  return (
    <button
      type={type}
      style={baseStyles}
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || loading}
    >
      {loading && <span>⏳</span>}
      {!loading && icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
