import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { Match, TennisScore, TennisSet } from '../../types';
import { CalendarIcon } from '../icons/CalendarIcon';
import { UserIcon } from '../icons/UserIcon';
import { TrophyIcon } from '../icons/TrophyIcon';
import { Loader } from '../Loader';
import { ChevronIcon } from '../icons/ChevronIcon';
import AutocompleteInput from '../AutocompleteInput';

interface TennisRecorderProps {
  onAddMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  availableTournaments: string[];
  initialTournament?: string;
  initialSurface?: string;
}

const SetColumn: React.FC<{
  index: number;
  set: TennisSet;
  onChange: (updatedSet: TennisSet) => void;
  onRemove: () => void;
  canRemove: boolean;
  isLast: boolean;
}> = ({ index, set, onChange, onRemove, canRemove, isLast }) => {
  const { theme } = useTheme();

  const handleGameChange = (player: 'myGames' | 'opponentGames', delta: number) => {
    const newValue = Math.max(0, set[player] + delta);
    const updatedSet = { ...set, [player]: newValue };
    
    // Reset tiebreak if not 6-6 or 7-6/6-7 scenarios
    const isTiebreakScore = 
        (updatedSet.myGames === 6 && updatedSet.opponentGames === 6) ||
        (updatedSet.myGames === 7 && updatedSet.opponentGames === 6) ||
        (updatedSet.myGames === 6 && updatedSet.opponentGames === 7);

    if (!isTiebreakScore && updatedSet.tiebreak) {
        delete updatedSet.tiebreak;
    }
    
    onChange(updatedSet);
  };

  const handleTiebreakChange = (player: 'myPoints' | 'opponentPoints', delta: number) => {
    const currentTiebreak = set.tiebreak || { myPoints: 0, opponentPoints: 0 };
    const newValue = Math.max(0, currentTiebreak[player] + delta);
    onChange({
      ...set,
      tiebreak: { ...currentTiebreak, [player]: newValue }
    });
  };

  // Determine if set is won by me or opponent for coloring
  const isMySet = (set.myGames >= 6 && set.myGames >= set.opponentGames + 2) || (set.myGames === 7 && set.opponentGames === 6) || (set.myGames === 7 && set.opponentGames === 5);
  const isOpponentSet = (set.opponentGames >= 6 && set.opponentGames >= set.myGames + 2) || (set.opponentGames === 7 && set.myGames === 6) || (set.opponentGames === 7 && set.myGames === 5);

  // Tiebreak active condition
  const isTiebreakActive = (set.myGames === 6 && set.opponentGames === 6) || 
                           (set.myGames === 7 && set.opponentGames === 6) || 
                           (set.myGames === 6 && set.opponentGames === 7);

  const myColor = isMySet ? '#339966' : theme.colors.background;
  const myTextColor = isMySet ? '#FFFFFF' : theme.colors.primaryText;
  
  const oppColor = isOpponentSet ? '#339966' : theme.colors.background;
  const oppTextColor = isOpponentSet ? '#FFFFFF' : theme.colors.primaryText;

  const styles = {
    column: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      minWidth: '80px',
      flex: 1,
      position: 'relative' as 'relative',
    },
    header: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '4px',
      fontSize: '0.8rem',
      color: theme.colors.secondaryText,
      marginBottom: '4px',
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: theme.colors.secondaryText,
      cursor: 'pointer',
      fontSize: '1rem',
      padding: '0 4px',
      lineHeight: 1,
    },
    scoreBox: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as 'column',
      overflow: 'hidden',
      height: '160px',
      borderTop: `1px solid ${theme.colors.border}`,
      borderBottom: `1px solid ${theme.colors.border}`,
      borderLeft: index === 0 ? `1px solid ${theme.colors.border}` : 'none',
      borderRight: `1px solid ${theme.colors.border}`, // Always border right
      borderRadius: index === 0 && isLast ? theme.borderRadius.medium : 
                    index === 0 ? `${theme.borderRadius.medium} 0 0 ${theme.borderRadius.medium}` : 
                    isLast ? `0 ${theme.borderRadius.medium} ${theme.borderRadius.medium} 0` : '0',
    },
    halfBox: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as 'relative',
      cursor: 'pointer',
      userSelect: 'none' as 'none',
    },
    scoreNumber: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1,
    },
    superscript: {
      fontSize: '1rem',
      fontWeight: 600,
      position: 'absolute' as 'absolute',
      top: '12px',
      right: '12px',
    },
    decrementButton: {
        position: 'absolute' as 'absolute',
        bottom: '4px',
        left: '4px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.1)',
        color: 'inherit',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        zIndex: 2,
    },
    tiebreakInput: {
        position: 'absolute' as 'absolute',
        top: '4px',
        right: '4px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        gap: '2px',
        zIndex: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '2px',
        borderRadius: '4px',
    },
    tbBtn: {
        width: '16px',
        height: '16px',
        fontSize: '10px',
        padding: 0,
        cursor: 'pointer',
        border: 'none',
        borderRadius: '2px',
        backgroundColor: 'rgba(255,255,255,0.8)',
        color: '#000',
    }
  };

  return (
    <div style={styles.column}>
      <div style={styles.header}>
        <span>Set {index + 1}</span>
        {canRemove && <button type="button" onClick={onRemove} style={styles.removeButton}>&times;</button>}
      </div>
      
      <div style={styles.scoreBox}>
        {/* My Score (Top) */}
        <div 
            style={{...styles.halfBox, backgroundColor: myColor, color: myTextColor}}
            onClick={() => handleGameChange('myGames', 1)}
        >
            <span style={styles.scoreNumber}>{set.myGames}</span>
            {set.tiebreak && (
                <span style={styles.superscript}>{set.tiebreak.myPoints}</span>
            )}
            
            {/* Tiebreak Controls Overlay when active */}
            {isTiebreakActive && (
                <div style={styles.tiebreakInput} onClick={(e) => e.stopPropagation()}>
                    <button type="button" style={styles.tbBtn} onClick={() => handleTiebreakChange('myPoints', 1)}>+</button>
                    <span style={{fontSize: '10px', color: '#FFF', fontWeight: 'bold'}}>{set.tiebreak?.myPoints || 0}</span>
                    <button type="button" style={styles.tbBtn} onClick={() => handleTiebreakChange('myPoints', -1)}>-</button>
                </div>
            )}

            {set.myGames > 0 && (
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleGameChange('myGames', -1); }}
                    style={{...styles.decrementButton, borderColor: isMySet ? 'rgba(255,255,255,0.5)' : theme.colors.border}}
                >
                    -
                </button>
            )}
        </div>

        {/* Opponent Score (Bottom) */}
        <div 
            style={{...styles.halfBox, backgroundColor: oppColor, color: oppTextColor, borderTop: `1px solid ${theme.colors.border}`}}
            onClick={() => handleGameChange('opponentGames', 1)}
        >
            <span style={styles.scoreNumber}>{set.opponentGames}</span>
            {set.tiebreak && (
                <span style={styles.superscript}>{set.tiebreak.opponentPoints}</span>
            )}

             {/* Tiebreak Controls Overlay when active */}
             {isTiebreakActive && (
                <div style={styles.tiebreakInput} onClick={(e) => e.stopPropagation()}>
                    <button type="button" style={styles.tbBtn} onClick={() => handleTiebreakChange('opponentPoints', 1)}>+</button>
                    <span style={{fontSize: '10px', color: '#FFF', fontWeight: 'bold'}}>{set.tiebreak?.opponentPoints || 0}</span>
                    <button type="button" style={styles.tbBtn} onClick={() => handleTiebreakChange('opponentPoints', -1)}>-</button>
                </div>
            )}

            {set.opponentGames > 0 && (
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleGameChange('opponentGames', -1); }}
                    style={{...styles.decrementButton, borderColor: isOpponentSet ? 'rgba(255,255,255,0.5)' : theme.colors.border}}
                >
                    -
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

const TennisRecorder: React.FC<TennisRecorderProps> = ({ onAddMatch, availableTournaments, initialTournament, initialSurface }) => {
  const { theme } = useTheme();
  const { currentSport } = useData();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [opponentName, setOpponentName] = useState('');
  const [sets, setSets] = useState<TennisSet[]>([{ myGames: 0, opponentGames: 0 }]);
  const [winner, setWinner] = useState<'me' | 'opponent'>('me');
  const [retired, setRetired] = useState(false);
  const [retiredPlayer, setRetiredPlayer] = useState<'me' | 'opponent'>('opponent');
  const [tournament, setTournament] = useState(initialTournament || '');
  const [location, setLocation] = useState('');
  const [surface, setSurface] = useState(initialSurface || '');
  const [notes, setNotes] = useState('');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTournament) setTournament(initialTournament);
    if (initialSurface) setSurface(initialSurface);
  }, [initialTournament, initialSurface]);

  // Auto-scroll to end when sets change
  useEffect(() => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
            left: scrollContainerRef.current.scrollWidth,
            behavior: 'smooth'
        });
    }
  }, [sets.length]);

  // Visibility Logic
  const showScore = opponentName.trim().length > 0;
  const showDetails = showScore && sets.some(s => (s.myGames >= 6 || s.opponentGames >= 6));

  let mySetsWon = 0;
  let oppSetsWon = 0;
  sets.forEach(set => {
    const myWin = (set.myGames >= 6 && set.myGames >= set.opponentGames + 2) || (set.myGames === 7 && set.opponentGames === 6) || (set.myGames === 7 && set.opponentGames === 5);
    const oppWin = (set.opponentGames >= 6 && set.opponentGames >= set.myGames + 2) || (set.opponentGames === 7 && set.myGames === 6) || (set.opponentGames === 7 && set.myGames === 5);
    if (myWin) mySetsWon++;
    else if (oppWin) oppSetsWon++;
  });

  // Auto-calculate winner based on sets
  useEffect(() => {
    if (retired) {
        setWinner(retiredPlayer === 'me' ? 'opponent' : 'me');
        return;
    }
    
    if (mySetsWon > oppSetsWon) setWinner('me');
    else if (oppSetsWon > mySetsWon) setWinner('opponent');
  }, [mySetsWon, oppSetsWon, retired, retiredPlayer]);

  const handleSetChange = (index: number, updatedSet: TennisSet) => {
    const newSets = [...sets];
    newSets[index] = updatedSet;
    setSets(newSets);

    // Auto-add new set logic
    // Only if we are modifying the last set and we haven't reached 5 sets
    if (index === sets.length - 1 && sets.length < 5) {
        const s = updatedSet;
        // Check if set is finished
        const myWin = (s.myGames === 6 && s.opponentGames <= 4) || (s.myGames === 7);
        const oppWin = (s.opponentGames === 6 && s.myGames <= 4) || (s.opponentGames === 7);
        
        if (myWin || oppWin) {
            // Check if match is already won (best of 3 or best of 5)
            let mySets = 0;
            let oppSets = 0;
            newSets.forEach(set => {
              const mWin = (set.myGames >= 6 && set.myGames >= set.opponentGames + 2) || (set.myGames === 7 && set.opponentGames === 6) || (set.myGames === 7 && set.opponentGames === 5);
              const oWin = (set.opponentGames >= 6 && set.opponentGames >= set.myGames + 2) || (set.opponentGames === 7 && set.myGames === 6) || (set.opponentGames === 7 && set.myGames === 5);
              if (mWin) mySets++;
              else if (oWin) oppSets++;
            });

            // If someone has won 2 sets, it could be the end of a best of 3 match.
            // If someone has won 3 sets, it's definitely the end of a best of 5 match.
            const matchWon = mySets === 3 || oppSets === 3 || mySets === 2 || oppSets === 2;

            if (!matchWon) {
                // Add new set automatically
                setSets([...newSets, { myGames: 0, opponentGames: 0 }]);
            }
        }
    }
  };

  const addSet = () => {
    if (sets.length < 5) {
      setSets([...sets, { myGames: 0, opponentGames: 0 }]);
    }
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentName) return;
    
    setIsLoading(true);

    try {
      // Remove trailing 0-0 set if not retired
      const finalSets = [...sets];
      if (!retired && finalSets.length > 0) {
          const lastSet = finalSets[finalSets.length - 1];
          if (lastSet.myGames === 0 && lastSet.opponentGames === 0) {
              finalSets.pop();
          }
      }

      if (finalSets.length === 0) {
          throw new Error("No se puede guardar un partido sin sets jugados.");
      }

      const tennisScore: TennisScore = {
        sets: finalSets,
        winner,
        retired
      };
      
      if (retired) {
          tennisScore.retiredPlayer = retiredPlayer;
      }

      const matchData: Omit<Match, 'id'> = {
        date,
        result: winner === 'me' ? 'VICTORIA' : 'DERROTA',
        myGoals: 0, 
        myAssists: 0,
        opponentPlayers: [{ name: opponentName, goals: 0, assists: 0 }],
        sport: currentSport,
        tennisScore
      };

      if (tournament) matchData.tournament = tournament;
      if (location) matchData.location = location;
      if (surface) matchData.surface = surface as any;
      if (notes) matchData.notes = notes;

      await onAddMatch(matchData);
      
      // Reset form
      setOpponentName('');
      setSets([{ myGames: 0, opponentGames: 0 }]);
      setNotes('');
      setTournament('');
      setLocation('');
      setSurface('');
      setRetired(false);
      setRetiredPlayer('opponent');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.large,
      maxWidth: '600px',
      margin: '0 auto',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.medium,
        animation: 'fadeIn 0.5s ease',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.small,
    },
    label: {
      fontSize: theme.typography.fontSize.small,
      fontWeight: 600,
      color: theme.colors.secondaryText,
      marginLeft: '4px',
    },
    input: {
      padding: theme.spacing.medium,
      borderRadius: theme.borderRadius.medium,
      border: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.background,
      color: theme.colors.primaryText,
      fontSize: theme.typography.fontSize.medium,
      width: '100%',
      boxSizing: 'border-box',
      colorScheme: theme.name === 'dark' ? 'dark' : 'light',
    },
    button: {
      padding: theme.spacing.medium,
      borderRadius: theme.borderRadius.medium,
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.small,
      width: '100%',
    },
    primaryButton: {
      backgroundColor: theme.colors.accent1,
      color: theme.colors.textOnAccent,
      marginTop: theme.spacing.large,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      border: `1px dashed ${theme.colors.border}`,
      color: theme.colors.secondaryText,
    },
    toggleButton: {
        flex: 1,
        padding: theme.spacing.small,
        borderRadius: theme.borderRadius.medium,
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.background,
        color: theme.colors.secondaryText,
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
    },
    activeToggle: {
        backgroundColor: theme.colors.accent1,
        color: theme.colors.textOnAccent,
        borderColor: theme.colors.accent1,
    },
    retirementContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.small,
        padding: theme.spacing.medium,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.medium,
        border: `1px solid ${theme.colors.border}`,
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .hide-native-date-icon::-webkit-calendar-picker-indicator {
            display: none;
            -webkit-appearance: none;
        }
        .custom-placeholder::placeholder {
            color: ${theme.colors.secondaryText};
            opacity: 0.7;
        }
      `}</style>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.large }}>
        
        {/* SECTION 1: BASIC INFO */}
        <div style={styles.section}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fecha</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  style={styles.input}
                  className="hide-native-date-icon custom-placeholder"
                  required 
                />
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <CalendarIcon size={18} color={theme.colors.secondaryText} />
                </div>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Rival</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={opponentName} 
                  onChange={(e) => setOpponentName(e.target.value)}
                  placeholder="Nombre del rival"
                  style={styles.input}
                  className="custom-placeholder"
                  required 
                />
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <UserIcon size={18} color={theme.colors.secondaryText} />
                </div>
              </div>
            </div>
        </div>

        {/* SECTION 2: SCORE */}
        {showScore && (
            <div style={styles.section}>
                <label style={styles.label}>Marcador</label>
                <div 
                    ref={scrollContainerRef}
                    style={{ 
                        display: 'flex', 
                        gap: '0', 
                        overflowX: 'auto', 
                        paddingBottom: '8px',
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none', // IE/Edge
                    }}
                    className="hide-scrollbar"
                >
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {sets.map((set, index) => (
                        <SetColumn 
                            key={index} 
                            index={index} 
                            set={set} 
                            onChange={(updated) => handleSetChange(index, updated)}
                            onRemove={() => removeSet(index)}
                            canRemove={sets.length > 1}
                            isLast={index === sets.length - 1}
                        />
                    ))}
                    
                    {sets.length < 5 && mySetsWon < 3 && oppSetsWon < 3 && (
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginLeft: '12px' }}>
                          <button 
                              type="button" 
                              onClick={addSet} 
                              style={{ 
                                  ...styles.button, 
                                  ...styles.secondaryButton, 
                                  minWidth: '60px', 
                                  width: '60px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '160px', // Match scoreBox height
                                  marginTop: '24px', // Align with the score part, skipping the header
                              }}
                          >
                              +
                          </button>
                      </div>
                    )}
                </div>
            </div>
        )}

        {/* SECTION 3: DETAILS */}
        {showDetails && (
            <div style={styles.section}>
                 <div style={styles.inputGroup}>
                    <label style={styles.label}>Torneo (Opcional)</label>
                    <AutocompleteInput 
                        value={tournament} 
                        onChange={setTournament} 
                        suggestions={availableTournaments} 
                        placeholder="Ej: Roland Garros" 
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Lugar / Club (Opcional)</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej: Club Central"
                        style={styles.input}
                        className="custom-placeholder"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Superficie (Opcional)</label>
                    <AutocompleteInput 
                        value={surface} 
                        onChange={setSurface} 
                        suggestions={['Dura', 'Polvo de Ladrillo', 'Césped', 'Moqueta', 'Indoor']}
                        placeholder="Ej: Polvo de Ladrillo" 
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Notas (Opcional)</label>
                    <textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Sensaciones, clima..."
                        style={{ ...styles.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                        className="custom-placeholder"
                    />
                </div>
                
                <div style={{marginTop: theme.spacing.small}}>
                    {!retired ? (
                        <button 
                            type="button"
                            onClick={() => setRetired(true)}
                            style={{...styles.button, ...styles.secondaryButton, borderColor: '#f74d4d', color: '#f74d4d'}}
                        >
                            Hubo Retiro / Abandono
                        </button>
                    ) : (
                        <div style={styles.retirementContainer}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span style={{fontSize: '0.9rem', fontWeight: 600, color: theme.colors.primaryText}}>¿Quién se retiró?</span>
                                <button onClick={() => setRetired(false)} style={{background: 'none', border: 'none', color: theme.colors.secondaryText, cursor: 'pointer'}}>Cancelar</button>
                            </div>
                            <div style={{display: 'flex', gap: theme.spacing.small}}>
                                <button 
                                    type="button"
                                    onClick={() => setRetiredPlayer('me')}
                                    style={{
                                        ...styles.toggleButton,
                                        ...(retiredPlayer === 'me' ? styles.activeToggle : {})
                                    }}
                                >
                                    Me retiré
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setRetiredPlayer('opponent')}
                                    style={{
                                        ...styles.toggleButton,
                                        ...(retiredPlayer === 'opponent' ? styles.activeToggle : {})
                                    }}
                                >
                                    Se retiró rival
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={isLoading} style={{ ...styles.button, ...styles.primaryButton }}>
                    {isLoading ? <Loader /> : 'Guardar Partido'}
                </button>
            </div>
        )}

      </form>
    </div>
  );
};

export default TennisRecorder;
