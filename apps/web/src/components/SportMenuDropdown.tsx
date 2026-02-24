import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { SportType } from '../types';
import { ChevronIcon } from './icons/ChevronIcon';

interface SportMenuDropdownProps {
  onOpenModal: () => void;
  isMobile?: boolean;
}

const sportsConfig: Record<SportType, { label: string; icon: string }> = {
  football: { label: 'Fútbol', icon: '⚽' },
  paddle: { label: 'Paddle', icon: '🎾' },
  tennis: { label: 'Tenis', icon: '🎾' },
};

const SportMenuDropdown: React.FC<SportMenuDropdownProps> = ({ onOpenModal, isMobile = false }) => {
  const { theme } = useTheme();
  const { currentSport, setCurrentSport, activeSports } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (sport: SportType) => {
    setCurrentSport(sport);
    setIsOpen(false);
  };

  const currentConfig = sportsConfig[currentSport];

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'relative',
      marginRight: isMobile ? 0 : theme.spacing.medium,
      marginBottom: isMobile ? theme.spacing.small : 0,
      width: isMobile ? '100%' : 'auto',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.small,
      padding: `${theme.spacing.small} ${theme.spacing.medium}`,
      backgroundColor: isMobile ? theme.colors.background : theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      cursor: 'pointer',
      color: theme.colors.primaryText,
      fontSize: theme.typography.fontSize.small,
      fontWeight: 600,
      width: '100%',
      justifyContent: isMobile ? 'space-between' : 'flex-start',
      transition: 'all 0.2s ease',
    },
    dropdown: {
      position: isMobile ? 'static' : 'absolute',
      top: isMobile ? 'auto' : 'calc(100% + 8px)',
      left: 0,
      width: isMobile ? '100%' : '200px',
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      boxShadow: theme.shadows.medium,
      zIndex: 100,
      overflow: 'hidden',
      marginTop: isMobile ? theme.spacing.small : 0,
      display: isOpen ? 'block' : 'none',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.small,
      padding: `${theme.spacing.small} ${theme.spacing.medium}`,
      cursor: 'pointer',
      color: theme.colors.primaryText,
      fontSize: theme.typography.fontSize.small,
      transition: 'background-color 0.2s',
      width: '100%',
      border: 'none',
      backgroundColor: 'transparent',
      textAlign: 'left',
    },
    activeItem: {
      backgroundColor: theme.colors.accent1 + '20',
      color: theme.colors.accent1,
    },
    addItem: {
      borderTop: `1px solid ${theme.colors.border}`,
      color: theme.colors.secondaryText,
      justifyContent: 'center',
      fontWeight: 600,
    },
    icon: {
      fontSize: '1.2em',
    }
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button 
        style={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.small }}>
          <span style={styles.icon}>{currentConfig.icon}</span>
          <span>{currentConfig.label}</span>
        </div>
        <ChevronIcon 
          isExpanded={isOpen}
          size={16} 
          color={theme.colors.secondaryText} 
        />
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {activeSports.map((sportId) => {
            const config = sportsConfig[sportId];
            const isActive = currentSport === sportId;
            return (
              <button
                key={sportId}
                style={{
                  ...styles.item,
                  ...(isActive ? styles.activeItem : {}),
                }}
                onClick={() => handleSelect(sportId)}
              >
                <span style={styles.icon}>{config.icon}</span>
                <span>{config.label}</span>
                {isActive && <span style={{ marginLeft: 'auto', color: theme.colors.accent1 }}>✓</span>}
              </button>
            );
          })}
          
          <button
            style={{ ...styles.item, ...styles.addItem }}
            onClick={() => {
              setIsOpen(false);
              onOpenModal();
            }}
          >
            + Añadir Deporte
          </button>
        </div>
      )}
    </div>
  );
};

export default SportMenuDropdown;
