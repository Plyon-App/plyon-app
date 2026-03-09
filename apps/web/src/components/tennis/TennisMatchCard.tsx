import React, { useState, useMemo } from 'react';
import type { Match, TennisSet } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronIcon } from '../icons/ChevronIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { parseLocalDate, getColorForString } from '../../utils/analytics';
import { useHaptics } from '../../hooks/useHaptics';

interface TennisMatchCardProps {
  match: Match;
  onDelete?: () => void;
  isReadOnly?: boolean;
}

const TennisMatchCard: React.FC<TennisMatchCardProps> = ({ 
    match, onDelete, isReadOnly = false
}) => {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const { result, date, notes, tournament, tennisScore, opponentPlayers, location, surface } = match;
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
      haptics.light();
      setIsExpanded(!isExpanded);
  };
  
  const formattedDate = useMemo(() => {
    const dateObj = parseLocalDate(date);
    return {
        day: dateObj.toLocaleDateString('es-ES', { day: '2-digit' }),
        month: dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toLowerCase(),
        year: dateObj.toLocaleDateString('es-ES', { year: 'numeric' }),
    };
  }, [date]);

  const formatSetScore = (set: TennisSet) => {
      let score = `${set.myGames}-${set.opponentGames}`;
      if (set.tiebreak) {
          const loserPoints = set.myGames > set.opponentGames ? set.tiebreak.opponentPoints : set.tiebreak.myPoints;
          score += `(${loserPoints})`;
      }
      return score;
  };

  const getResultStyle = (result: 'VICTORIA' | 'DERROTA' | 'EMPATE'): React.CSSProperties => {
    const baseStyle = styles.resultBadge;
    switch (result) {
      case 'VICTORIA':
        return { ...baseStyle, backgroundColor: `${theme.colors.win}26`, color: theme.colors.win, border: `1px solid ${theme.colors.win}80` };
      case 'DERROTA':
        return { ...baseStyle, backgroundColor: `${theme.colors.loss}26`, color: theme.colors.loss, border: `1px solid ${theme.colors.loss}80` };
      default:
        return baseStyle;
    }
  };

  const getBorderColorFromResult = (result: 'VICTORIA' | 'DERROTA' | 'EMPATE'): string => {
    switch (result) {
      case 'VICTORIA': return theme.colors.win;
      case 'DERROTA': return theme.colors.loss;
      default: return theme.colors.border;
    }
  };
  
  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large,
      boxShadow: theme.shadows.medium, transition: 'background-color 0.2s, box-shadow 0.2s, border-color 0.3s',
      border: `1px solid ${getBorderColorFromResult(result)}`,
    },
    mainInfoRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: `${theme.spacing.medium} ${theme.spacing.large}`,
        gap: theme.spacing.medium,
    },
    toggleRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: `${theme.spacing.small} ${theme.spacing.large}`,
        borderTop: `1px solid ${theme.colors.border}`,
        cursor: 'pointer',
        backgroundColor: theme.colors.background,
        borderBottomLeftRadius: isExpanded ? 0 : theme.borderRadius.large,
        borderBottomRightRadius: isExpanded ? 0 : theme.borderRadius.large,
    },
    mainInfoLeft: { display: 'flex', alignItems: 'center', gap: theme.spacing.medium, flex: 1, minWidth: 0 },
    resultBadge: {
      fontSize: theme.typography.fontSize.large, fontWeight: 700,
      borderRadius: theme.borderRadius.medium,
      width: '40px', height: '40px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    scoreContainer: { display: 'flex', alignItems: 'center', gap: theme.spacing.small, flexWrap: 'wrap' },
    setScore: {
        fontSize: theme.typography.fontSize.medium,
        fontWeight: 600,
        color: theme.colors.primaryText,
        padding: '4px 8px',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.small,
        border: `1px solid ${theme.colors.border}`,
    },
    opponentName: {
        fontSize: theme.typography.fontSize.medium,
        fontWeight: 600,
        color: theme.colors.primaryText,
        marginLeft: theme.spacing.small,
    },
    dateContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.colors.primaryText,
        lineHeight: 1.2,
        fontSize: '8pt',
        fontWeight: 600,
        flexShrink: 0,
    },
    dateDay: {
        fontSize: '1.5em',
        fontWeight: 700,
        color: theme.colors.primaryText,
    },
    dateMonth: {
        textTransform: 'uppercase',
        opacity: 0.8,
    },
    dateYear: {
        opacity: 0.6,
    },
    cardBody: {
      padding: theme.spacing.large,
      animation: 'fadeIn 0.5s ease-in-out', 
    },
    actionsContainer: {
      display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
      gap: theme.spacing.medium, marginTop: theme.spacing.large,
    },
    actionButton: {
        background: 'transparent', fontSize: theme.typography.fontSize.extraSmall, fontWeight: 600, cursor: 'pointer',
        padding: `${theme.spacing.extraSmall} ${theme.spacing.small}`, borderRadius: theme.borderRadius.small,
        transition: 'color 0.2s, background-color 0.2s, border-color 0.2s', display: 'flex', alignItems: 'center', gap: theme.spacing.small,
    },
    notesSection: { marginBottom: theme.spacing.large },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: theme.spacing.medium,
        marginBottom: theme.spacing.large,
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    detailLabel: {
        fontSize: theme.typography.fontSize.extraSmall,
        color: theme.colors.secondaryText,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 700,
    },
    detailValue: {
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.primaryText,
        fontWeight: 500,
    },
    sectionHeading: {
      fontSize: theme.typography.fontSize.extraSmall, fontWeight: 700, color: theme.colors.secondaryText, textTransform: 'uppercase',
      letterSpacing: '0.05em', margin: `0 0 ${theme.spacing.small} 0`, display: 'flex', alignItems: 'center', gap: theme.spacing.small,
    },
    notesText: { fontSize: theme.typography.fontSize.small, color: theme.colors.primaryText, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' },
    tournamentTag: {
        borderRadius: theme.borderRadius.small,
        padding: `${theme.spacing.extraSmall} ${theme.spacing.small}`,
        fontSize: theme.typography.fontSize.extraSmall,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: '140px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        border: '1px solid transparent',
    },
  };
  
  const resultStyle = getResultStyle(result);
  const opponentName = opponentPlayers && opponentPlayers.length > 0 ? opponentPlayers[0].name : 'Rival';

  // Logic to determine what tag to display
  let tagLabel = null;
  let tagStyle = {};

  if (tournament && tournament.trim() !== '') {
      tagLabel = tournament;
      const color = getColorForString(tagLabel);
      tagStyle = {
          ...styles.tournamentTag,
          backgroundColor: 'transparent',
          border: `1px solid ${color}`,
          color: color,
      };
  } 

  const surfaceMap: Record<string, string> = {
      'hard': 'Dura',
      'clay': 'Polvo de Ladrillo',
      'grass': 'Césped',
      'carpet': 'Moqueta',
      'indoor': 'Indoor'
  };
  const surfaceLabel = surface ? (surfaceMap[surface.toLowerCase()] || surface) : null;

  return (
    <div style={styles.card}>
      <div style={styles.mainInfoRow}>
        <div style={styles.mainInfoLeft}>
          <span style={resultStyle}>{result === 'VICTORIA' ? 'V' : 'D'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={styles.opponentName}>vs {opponentName}</div>
             
             {/* New Scoreboard Layout */}
             {tennisScore && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {/* Top Row: Me */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '24px' }}>
                            {tennisScore.sets.filter((set, i, arr) => {
                                if (tennisScore.retired) return true;
                                if (i === arr.length - 1 && set.myGames === 0 && set.opponentGames === 0) return false;
                                return true;
                            }).map((set, i) => {
                                const isMyWin = (set.myGames > set.opponentGames && set.myGames >= 6) || set.myGames === 7;
                                return (
                                    <div key={i} style={{ position: 'relative', width: '20px', textAlign: 'center' }}>
                                        <span style={{ 
                                            fontSize: '1.2rem', 
                                            fontWeight: isMyWin ? 700 : 400,
                                            color: isMyWin ? theme.colors.primaryText : theme.colors.secondaryText
                                        }}>
                                            {set.myGames}
                                        </span>
                                        {set.tiebreak && (
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                position: 'absolute', 
                                                top: '-4px', 
                                                right: '-8px',
                                                color: theme.colors.secondaryText 
                                            }}>
                                                {set.tiebreak.myPoints}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                            {/* Match Winner Indicator for Me */}
                            {result === 'VICTORIA' && (
                                <div style={{ 
                                    width: 0, 
                                    height: 0, 
                                    borderTop: '5px solid transparent',
                                    borderBottom: '5px solid transparent',
                                    borderLeft: `8px solid ${theme.colors.primaryText}`,
                                    marginLeft: '4px'
                                }} />
                            )}
                        </div>

                        {/* Bottom Row: Opponent */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '24px' }}>
                            {tennisScore.sets.filter((set, i, arr) => {
                                if (tennisScore.retired) return true;
                                if (i === arr.length - 1 && set.myGames === 0 && set.opponentGames === 0) return false;
                                return true;
                            }).map((set, i) => {
                                const isOpponentWin = (set.opponentGames > set.myGames && set.opponentGames >= 6) || set.opponentGames === 7;
                                return (
                                    <div key={i} style={{ position: 'relative', width: '20px', textAlign: 'center' }}>
                                        <span style={{ 
                                            fontSize: '1.2rem', 
                                            fontWeight: isOpponentWin ? 700 : 400,
                                            color: isOpponentWin ? theme.colors.primaryText : theme.colors.secondaryText
                                        }}>
                                            {set.opponentGames}
                                        </span>
                                        {set.tiebreak && (
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                position: 'absolute', 
                                                top: '-4px', 
                                                right: '-8px',
                                                color: theme.colors.secondaryText 
                                            }}>
                                                {set.tiebreak.opponentPoints}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                            {/* Match Winner Indicator for Opponent */}
                            {result === 'DERROTA' && (
                                <div style={{ 
                                    width: 0, 
                                    height: 0, 
                                    borderTop: '5px solid transparent',
                                    borderBottom: '5px solid transparent',
                                    borderLeft: `8px solid ${theme.colors.primaryText}`,
                                    marginLeft: '4px'
                                }} />
                            )}
                        </div>
                    </div>
                 </div>
             )}

             {tennisScore?.retired && (
                <span style={{ fontSize: '0.8em', color: theme.colors.loss, fontWeight: 600, marginTop: '4px' }}>
                    {tennisScore.retiredPlayer === 'me' ? '(Ret. Yo)' : tennisScore.retiredPlayer === 'opponent' ? '(Ret. Rival)' : '(Ret.)'}
                </span>
             )}
          </div>
        </div>
        <div style={styles.dateContainer}>
            <span style={styles.dateDay}>{formattedDate.day}</span>
            <span style={styles.dateMonth}>{formattedDate.month}</span>
            <span style={styles.dateYear}>{formattedDate.year}</span>
        </div>
      </div>
      
      <div 
        style={styles.toggleRow} 
        onClick={handleToggle} 
        role="button" tabIndex={0} aria-expanded={isExpanded}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.medium, minWidth: 0, flex: 1 }}>
            {tagLabel && (
                <span style={tagStyle} title={tagLabel}>
                    {tagLabel}
                </span>
            )}
        </div>
        <ChevronIcon isExpanded={isExpanded} />
      </div>
      
      {isExpanded && (
        <div style={styles.cardBody}>
            {(location || surface) && (
                <div style={styles.detailsGrid}>
                    {location && (
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Lugar</span>
                            <span style={styles.detailValue}>{location}</span>
                        </div>
                    )}
                    {surfaceLabel && (
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Superficie</span>
                            <span style={styles.detailValue}>{surfaceLabel}</span>
                        </div>
                    )}
                </div>
            )}

            {notes && (
            <div style={styles.notesSection}>
                <h4 style={styles.sectionHeading}>Notas</h4>
                <p style={styles.notesText}>{notes}</p>
            </div>
            )}

            <div style={styles.actionsContainer}>
                {!isReadOnly && (
                <>
                    <button onClick={onDelete} style={{...styles.actionButton, border: `1px solid #f74d4d80`, color: '#f74d4d'}} aria-label="Eliminar partido">
                    <TrashIcon />
                    </button>
                </>
                )}
            </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TennisMatchCard;
