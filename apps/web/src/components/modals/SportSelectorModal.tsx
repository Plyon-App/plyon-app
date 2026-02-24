import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SportType } from '../../types';

interface SportSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSports: SportType[];
  onAddSport: (sport: SportType) => void;
}

const sportsData: { id: SportType; icon: string; name: string; description: string }[] = [
  { id: 'football', icon: '⚽', name: 'Fútbol', description: 'Registra goles, asistencias y torneos' },
  { id: 'paddle', icon: '🎾', name: 'Paddle', description: 'Winners, puntos de break y ranking' },
  { id: 'tennis', icon: '🎾', name: 'Tenis', description: 'Aces, sets ganados y Grand Slams' },
];

const SportSelectorModal: React.FC<SportSelectorModalProps> = ({ isOpen, onClose, activeSports, onAddSport }) => {
  const { theme } = useTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)',
      padding: isMobile ? 0 : theme.spacing.large,
    },
    modal: {
      backgroundColor: theme.colors.surface,
      width: isMobile ? '100%' : '800px',
      height: isMobile ? '100%' : 'auto',
      maxHeight: isMobile ? '100%' : '90vh',
      borderRadius: isMobile ? 0 : theme.borderRadius.large,
      padding: theme.spacing.large,
      position: 'relative',
      boxShadow: theme.shadows.large,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      animation: isMobile ? 'slideUp 0.3s ease-out' : 'fadeIn 0.2s ease-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.large,
    },
    title: {
      fontSize: theme.typography.fontSize.extraLarge,
      fontWeight: 700,
      color: theme.colors.primaryText,
      margin: 0,
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      color: theme.colors.secondaryText,
      cursor: 'pointer',
      padding: theme.spacing.small,
      lineHeight: 1,
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.medium,
      paddingBottom: isMobile ? theme.spacing.extraLarge : 0,
    },
    card: {
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.large,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'left',
      transition: 'all 0.2s ease',
      cursor: 'default',
      backgroundColor: theme.colors.background,
      position: 'relative',
      gap: theme.spacing.large,
    },
    icon: {
      fontSize: '2.5rem',
      flexShrink: 0,
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.extraSmall,
    },
    cardTitle: {
      fontSize: theme.typography.fontSize.large,
      fontWeight: 600,
      color: theme.colors.primaryText,
      margin: 0,
    },
    cardDesc: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.secondaryText,
      margin: 0,
      lineHeight: 1.5,
    },
    badge: {
      backgroundColor: theme.colors.accent1,
      color: theme.colors.textOnAccent,
      padding: `${theme.spacing.extraSmall} ${theme.spacing.small}`,
      borderRadius: theme.borderRadius.small,
      fontSize: theme.typography.fontSize.extraSmall,
      fontWeight: 600,
      display: 'inline-block',
      marginLeft: 'auto',
    },
    actionButton: {
      padding: `${theme.spacing.small} ${theme.spacing.large}`,
      borderRadius: theme.borderRadius.medium,
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: theme.typography.fontSize.small,
      marginLeft: 'auto',
      whiteSpace: 'nowrap',
    }
  };

  const getCardStyle = (id: string) => ({
    ...styles.card,
    borderColor: hoveredCard === id ? theme.colors.accent1 : theme.colors.border,
    transform: hoveredCard === id && !isMobile ? 'translateY(-2px)' : 'none',
    boxShadow: hoveredCard === id ? theme.shadows.medium : 'none',
  });

  const getButtonStyle = (isActive: boolean) => ({
    ...styles.actionButton,
    backgroundColor: isActive ? 'transparent' : theme.colors.accent2,
    color: isActive ? theme.colors.secondaryText : theme.colors.textOnAccent,
    border: isActive ? `1px solid ${theme.colors.borderStrong}` : 'none',
    cursor: isActive ? 'default' : 'pointer',
    opacity: isActive ? 0.5 : 1,
  });

  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Selecciona tu deporte</h2>
          <button style={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <div style={styles.grid}>
          {sportsData.map((sport) => {
            const isActive = activeSports.includes(sport.id);
            return (
              <div 
                key={sport.id} 
                style={getCardStyle(sport.id)}
                onMouseEnter={() => setHoveredCard(sport.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.icon}>{sport.icon}</div>
                <div style={styles.content}>
                  <h3 style={styles.cardTitle}>{sport.name}</h3>
                  <p style={styles.cardDesc}>{sport.description}</p>
                </div>
                
                {isActive ? (
                  <div style={styles.badge}>Activo</div>
                ) : (
                  <button 
                    style={getButtonStyle(isActive)}
                    onClick={() => {
                      onAddSport(sport.id);
                      onClose();
                    }}
                  >
                    Activar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SportSelectorModal;
