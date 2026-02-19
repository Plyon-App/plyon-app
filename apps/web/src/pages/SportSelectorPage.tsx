import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SPORTS = [
  {
    id: 'football',
    name: 'Fútbol',
    description: 'Registrá tus partidos, analizá tu rendimiento y competí en rankings.',
    emoji: '⚽',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'padel',
    name: 'Padel',
    description: 'La pared es tu amiga. Encontrá pareja y reservá pista.',
    emoji: '🎾',
    image: 'https://images.unsplash.com/photo-1626245550530-94d0c26563e4?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'tennis',
    name: 'Tenis',
    description: 'Juego, set y partido. Desafiá a otros jugadores en tu zona.',
    emoji: '🎾',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1000'
  }
];

interface Props {
  onSportSelected: (sport: string) => void;
}

const SportSelectorPage: React.FC<Props> = ({ onSportSelected }) => {
  const { theme } = useTheme();
  const [hoveredSport, setHoveredSport] = useState<string | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      color: theme.colors.primaryText,
      fontFamily: theme.typography.fontFamily,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900,
          letterSpacing: '-1px',
          marginBottom: '1rem'
        }}>
          Elegí tu{' '}
          <span style={{
            background: `linear-gradient(90deg, ${theme.colors.accent1}, ${theme.colors.accent2})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Deporte
          </span>
        </h1>
        <p style={{ color: theme.colors.secondaryText, fontSize: '1.1rem' }}>
          Seleccioná tu disciplina favorita para personalizar tu experiencia.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1000px',
        width: '100%'
      }}>
        {SPORTS.map(sport => (
          <button
            key={sport.id}
            onClick={() => onSportSelected(sport.id)}
            onMouseEnter={() => setHoveredSport(sport.id)}
            onMouseLeave={() => setHoveredSport(null)}
            style={{
              position: 'relative',
              height: '320px',
              borderRadius: '20px',
              border: `1px solid ${hoveredSport === sport.id ? theme.colors.accent1 : theme.colors.border}`,
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'none',
              padding: 0,
              transition: 'all 0.3s ease',
              transform: hoveredSport === sport.id ? 'translateY(-4px)' : 'none',
              boxShadow: hoveredSport === sport.id ? `0 20px 40px rgba(0,230,118,0.15)` : 'none'
            }}
          >
            <img
              src={sport.image}
              alt={sport.name}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: hoveredSport === sport.id ? 0.7 : 0.5,
                transition: 'all 0.5s ease',
                transform: hoveredSport === sport.id ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to top, ${theme.colors.background} 30%, transparent)`
            }} />
            <div style={{
              position: 'relative', zIndex: 1,
              height: '100%', padding: '1.5rem',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end', textAlign: 'left'
            }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{sport.emoji}</span>
              <h3 style={{
                fontSize: '1.8rem', fontWeight: 800,
                color: hoveredSport === sport.id ? theme.colors.accent1 : '#fff',
                margin: '0 0 0.5rem', transition: 'color 0.3s'
              }}>
                {sport.name}
              </h3>
              <p style={{ color: theme.colors.secondaryText, fontSize: '0.9rem', margin: 0 }}>
                {sport.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportSelectorPage;
