import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Title, Text } from './ui/Typography';

const DesignSystemDemo: React.FC = () => {
  const { theme } = useTheme();

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: theme.spacing.extraLarge,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.extraLarge,
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.medium,
    },
    row: {
      display: 'flex',
      gap: theme.spacing.medium,
      flexWrap: 'wrap',
    },
  };

  return (
    <div style={styles.container}>
      <Title level={1} accent>Design System Demo</Title>

      {/* Buttons */}
      <div style={styles.section}>
        <Title level={2}>Buttons</Title>
        <div style={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>
        <div style={styles.row}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </div>

      {/* Cards */}
      <div style={styles.section}>
        <Title level={2}>Cards</Title>
        <div style={styles.row}>
          <Card elevation="low" padding="sm">
            <Text variant="body">Low elevation card</Text>
          </Card>
          <Card elevation="medium" padding="md">
            <Text variant="body">Medium elevation card</Text>
          </Card>
          <Card elevation="high" padding="lg">
            <Text variant="body">High elevation card</Text>
          </Card>
        </div>
        <Card interactive onClick={() => alert('Clicked!')}>
          <Title level={3}>Interactive Card</Title>
          <Text variant="body" color="secondary">
            Hover me! I have border animation.
          </Text>
        </Card>
      </div>

      {/* Badges */}
      <div style={styles.section}>
        <Title level={2}>Badges</Title>
        <div style={styles.row}>
          <Badge variant="sport">Sport</Badge>
          <Badge variant="win">Win</Badge>
          <Badge variant="loss">Loss</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
        <div style={styles.row}>
          <Badge variant="sport" size="sm">Small</Badge>
          <Badge variant="sport" size="md">Medium</Badge>
        </div>
      </div>

      {/* Typography */}
      <div style={styles.section}>
        <Title level={2}>Typography</Title>
        <Title level={1}>Title Level 1</Title>
        <Title level={2}>Title Level 2</Title>
        <Title level={3}>Title Level 3</Title>
        <Title level={4}>Title Level 4</Title>
        <Title level={2} accent>Title with Sport Gradient</Title>
        <Text variant="body">Body text - Lorem ipsum dolor sit amet</Text>
        <Text variant="caption" color="secondary">Caption text - Secondary color</Text>
        <Text variant="label" color="sport">Label text - Sport color</Text>
      </div>

      {/* Real Example */}
      <div style={styles.section}>
        <Title level={2}>Real Example: Match Card</Title>
        <Card elevation="medium">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.medium }}>
            <div>
              <Title level={3}>Argentina vs Brasil</Title>
              <Text variant="caption" color="secondary">19 Feb 2026</Text>
            </div>
            <Badge variant="win">Victoria</Badge>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.large, marginBottom: theme.spacing.medium }}>
            <div>
              <Text variant="label" color="secondary">Goles</Text>
              <Title level={2}>2</Title>
            </div>
            <div>
              <Text variant="label" color="secondary">Asistencias</Text>
              <Title level={2}>1</Title>
            </div>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.small }}>
            <Button variant="secondary" size="sm">Ver Detalles</Button>
            <Button variant="ghost" size="sm">Editar</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
