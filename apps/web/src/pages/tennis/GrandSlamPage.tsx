import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { TrophyIcon } from '../../components/icons/TrophyIcon';
import { CheckIcon } from '../../components/icons/CheckIcon';
import { LockIcon } from '../../components/icons/LockIcon';
import { GrandSlamTournament, GrandSlamRound, Match } from '../../types';
import { CloseIcon } from '../../components/icons/CloseIcon';
import TennisRecorder from '../../components/tennis/TennisRecorder';
import { ChevronIcon } from '../../components/icons/ChevronIcon';

const TOURNAMENTS: { id: GrandSlamTournament; name: string; color: string; surface: string; image: string }[] = [
    { id: 'australian_open', name: 'Australian Open', color: '#0091D2', surface: 'Hard', image: 'https://www.dropbox.com/scl/fi/kqs4938jykdaep0lxrwi6/Australian-Open-Logo.png?rlkey=ta3ofn9nzieeolltxd7k3lziq&raw=1' },
    { id: 'roland_garros', name: 'Roland Garros', color: '#D64E26', surface: 'Clay', image: 'https://www.dropbox.com/scl/fi/to8vsxh7lvysutrttunpw/Roland-Garros-Logo.png?rlkey=897iwb0us8qvxw7c0iac8g4l5&raw=1' },
    { id: 'wimbledon', name: 'Wimbledon', color: '#2C6E49', surface: 'Grass', image: 'https://www.dropbox.com/scl/fi/hvlb6su1tsg8daudx33ma/Wimbledon-Logo.png?rlkey=stotrl6v3q8kufyqtq5gi0817&raw=1' },
    { id: 'us_open', name: 'US Open', color: '#0C2340', surface: 'Hard', image: 'https://www.dropbox.com/scl/fi/veyplbwxfxadyz33srqi8/US-Open-Logo.png?rlkey=ug38otxqbl2f1rxdgy7ayxfu8&raw=1' }
];

const ROUNDS: { id: GrandSlamRound; label: string }[] = [
    { id: 'round_of_128', label: 'R128' },
    { id: 'round_of_64', label: 'R64' },
    { id: 'round_of_32', label: 'R32' },
    { id: 'round_of_16', label: 'Octavos' },
    { id: 'quarter_finals', label: 'Cuartos' },
    { id: 'semi_finals', label: 'Semifinal' },
    { id: 'final', label: 'Final' }
];

const GrandSlamPage: React.FC = () => {
    const { theme } = useTheme();
    const { playerProfile, startNewGrandSlamSeason, addGrandSlamMatch, availableTournaments } = useData();
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
    const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

    const progress = playerProfile.grandSlamProgress;

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: `${theme.spacing.large} ${theme.spacing.medium}`,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.large
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.medium
        },
        pageTitle: {
            fontSize: theme.typography.fontSize.extraLarge,
            fontWeight: 700,
            color: theme.colors.primaryText,
            margin: 0
        },
        cardList: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.medium
        },
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.large,
            display: 'flex',
            flexDirection: 'column', // Changed to column to handle history expansion
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.border,
            overflow: 'hidden',
            transition: 'all 0.2s ease'
        },
        cardContent: {
            display: 'flex',
            flexDirection: 'row',
            height: '140px',
            position: 'relative'
        },
        cardImage: {
            width: '140px',
            height: '100%',
            objectFit: 'cover',
            flexShrink: 0
        },
        cardInfo: {
            flex: 1,
            padding: theme.spacing.medium,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        tournamentHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        },
        tournamentName: {
            fontSize: theme.typography.fontSize.large,
            fontWeight: 700,
            margin: 0
        },
        surfaceBadge: {
            fontSize: '0.75rem',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: theme.colors.background,
            color: theme.colors.secondaryText,
            marginTop: '4px',
            display: 'inline-block'
        },
        statusSection: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto'
        },
        statusText: {
            fontSize: '0.9rem',
            fontWeight: 600
        },
        playButton: {
            backgroundColor: theme.colors.accent1,
            color: theme.colors.textOnAccent,
            border: 'none',
            padding: '8px 16px',
            borderRadius: theme.borderRadius.medium,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem'
        },
        historySection: {
            borderTop: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.medium,
            backgroundColor: theme.colors.background
        },
        historyItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: `1px solid ${theme.colors.border}`,
            fontSize: '0.9rem'
        },
        expandButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.secondaryText
        },
        resultBadge: {
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600
        }
    };

    const modalStyles: { [key: string]: React.CSSProperties } = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: theme.spacing.medium
        },
        content: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.large,
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            padding: theme.spacing.large
        },
        closeButton: {
            position: 'absolute',
            top: theme.spacing.medium,
            right: theme.spacing.medium,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme.colors.secondaryText
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleStartSeason = async () => {
        setIsLoading(true);
        try {
            await startNewGrandSlamSeason();
        } catch (error) {
            console.error("Failed to start season:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!progress) {
        return (
            <main style={styles.container}>
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <TrophyIcon size={64} color={theme.colors.accent1} />
                    <h1 style={{ ...styles.pageTitle, marginTop: '1rem' }}>Modo Carrera Grand Slam</h1>
                    <p style={{ color: theme.colors.secondaryText, maxWidth: '600px', margin: '1rem auto' }}>
                        Compite en los 4 torneos más importantes del mundo. Empieza en Australia y lucha por completar el Grand Slam.
                        Si pierdes, quedarás eliminado y pasarás al siguiente torneo.
                    </p>
                    <button 
                        onClick={handleStartSeason}
                        disabled={isLoading}
                        style={{
                            ...styles.playButton,
                            maxWidth: '240px',
                            fontSize: '1rem',
                            padding: '12px 24px',
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Iniciando...' : 'Comenzar Temporada'}
                    </button>
                </div>
            </main>
        );
    }

    const currentTournamentData = TOURNAMENTS.find(t => t.id === progress.currentTournament);

    return (
        <main style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.pageTitle}>Temporada {progress.seasonYear}</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ 
                        padding: '8px 16px', 
                        backgroundColor: theme.colors.surface, 
                        borderRadius: '20px',
                        fontWeight: 600,
                        color: theme.colors.accent1
                    }}>
                        Carrera Grand Slam
                    </div>
                    {progress.status === 'completed_season' && (
                        <button 
                            onClick={handleStartSeason}
                            disabled={isLoading}
                            style={{
                                ...styles.playButton,
                                padding: '8px 16px',
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Iniciando...' : 'Nueva Temporada'}
                        </button>
                    )}
                </div>
            </div>

            <div style={styles.cardList}>
                {TOURNAMENTS.map((t) => {
                    const isCompleted = progress.completedTournaments.includes(t.id);
                    const isActive = progress.currentTournament === t.id && progress.status === 'active';
                    const isLocked = !isActive && !isCompleted;
                    const history = progress.matchesHistory[t.id] || [];
                    const lastMatch = history.length > 0 ? history[history.length - 1] : null;
                    const isExpanded = expandedHistory === t.id;

                    // Determine status text and color
                    let statusText = 'Bloqueado';
                    let statusColor = theme.colors.secondaryText;
                    let opacity = 0.6;

                    if (isActive) {
                        statusText = 'En Curso';
                        statusColor = theme.colors.accent1;
                        opacity = 1;
                    } else if (isCompleted) {
                        if (lastMatch && lastMatch.result === 'VICTORIA' && history.length >= ROUNDS.length) {
                            statusText = 'Campeón';
                            statusColor = theme.colors.win;
                        } else {
                            statusText = 'Eliminado';
                            statusColor = theme.colors.loss;
                        }
                        opacity = 0.8;
                    }

                    return (
                        <div 
                            key={t.id} 
                            style={{
                                ...styles.card,
                                borderColor: isActive ? theme.colors.accent1 : theme.colors.border,
                                opacity
                            }}
                        >
                            <div style={styles.cardContent}>
                                <img src={t.image} alt={t.name} style={styles.cardImage} referrerPolicy="no-referrer" />
                                <div style={styles.cardInfo}>
                                    <div style={styles.tournamentHeader}>
                                        <div>
                                            <h3 style={{...styles.tournamentName, color: t.color}}>{t.name}</h3>
                                            <span style={styles.surfaceBadge}>{t.surface}</span>
                                        </div>
                                        {history.length > 0 && (
                                            <button 
                                                onClick={() => setExpandedHistory(isExpanded ? null : t.id)}
                                                style={styles.expandButton}
                                            >
                                                <ChevronIcon 
                                                    size={20} 
                                                    color={theme.colors.secondaryText} 
                                                    direction={isExpanded ? 'up' : 'down'}
                                                />
                                            </button>
                                        )}
                                    </div>

                                    <div style={styles.statusSection}>
                                        <div>
                                            <div style={{ 
                                                color: statusColor, 
                                                fontWeight: 700, 
                                                fontSize: '0.9rem',
                                                textTransform: 'uppercase'
                                            }}>
                                                {statusText}
                                            </div>
                                            {lastMatch && !isActive && (
                                                <div style={{ fontSize: '0.8rem', color: theme.colors.secondaryText, marginTop: '4px' }}>
                                                    Último: {lastMatch.result === 'VICTORIA' ? 'Victoria' : 'Derrota'} vs {lastMatch.opponentName}
                                                </div>
                                            )}
                                            {isActive && (
                                                <div style={{ fontSize: '0.9rem', color: theme.colors.primaryText, marginTop: '4px' }}>
                                                    Ronda: {ROUNDS.find(r => r.id === progress.currentRound)?.label}
                                                </div>
                                            )}
                                        </div>

                                        {isActive && (
                                            <button 
                                                onClick={() => setIsMatchModalOpen(true)}
                                                style={styles.playButton}
                                            >
                                                Jugar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isExpanded && history.length > 0 && (
                                <div style={styles.historySection}>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: theme.colors.secondaryText }}>Historial</h4>
                                    {history.map((match, idx) => (
                                        <div key={idx} style={styles.historyItem}>
                                            <span style={{ color: theme.colors.primaryText }}>vs {match.opponentName}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.85rem', color: theme.colors.secondaryText }}>
                                                    {match.score}
                                                </span>
                                                <span style={{
                                                    ...styles.resultBadge,
                                                    backgroundColor: match.result === 'VICTORIA' ? `${theme.colors.win}20` : `${theme.colors.loss}20`,
                                                    color: match.result === 'VICTORIA' ? theme.colors.win : theme.colors.loss
                                                }}>
                                                    {match.result === 'VICTORIA' ? 'W' : 'L'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Match Modal */}
            {isMatchModalOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.content}>
                        <button 
                            onClick={() => setIsMatchModalOpen(false)}
                            style={modalStyles.closeButton}
                        >
                            <CloseIcon />
                        </button>
                        <h2 style={{...styles.tournamentTitle, marginBottom: theme.spacing.large, textAlign: 'center'}}>
                            {currentTournamentData?.name} - {ROUNDS.find(r => r.id === progress?.currentRound)?.label}
                        </h2>
                        <TennisRecorder 
                            onAddMatch={async (matchData) => {
                                await addGrandSlamMatch(matchData);
                                setIsMatchModalOpen(false);
                            }}
                            availableTournaments={availableTournaments}
                            initialTournament={currentTournamentData?.name}
                            initialSurface={currentTournamentData?.surface}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default GrandSlamPage;
