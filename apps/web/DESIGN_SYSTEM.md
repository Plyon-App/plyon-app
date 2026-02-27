# Plyon Design System
## 🎨 PRINCIPIOS

1. **Sport-Specific Theming**: Colores cambian según deporte activo
2. **Consistency First**: Mismo patrón en todos los componentes
3. **Dark/Light Support**: Todos los componentes funcionan en ambos modos
4. **Mobile-First**: Responsive por defecto

---

## 🎯 SPORT PALETTES
```typescript
const SPORT_COLORS = {
  football: {
    primary: '#00E676',      // Verde brillante
    secondary: '#2979FF',    // Azul
    accent: '#FFCA28'        // Amarillo
  },
  paddle: {
    primary: '#FF6F00',      // Naranja
    secondary: '#FFC107',    // Amarillo
    accent: '#D500F9'        // Púrpura
  },
  tennis: {
    primary: '#D500F9',      // Púrpura
    secondary: '#FF1744',    // Rojo
    accent: '#00E676'        // Verde
  }
}
```

---

## 🧩 COMPONENTES BASE

### Button
**Ubicación**: `components/ui/Button.tsx`

**Variantes**:
- `primary`: Background sportPrimary, color textOnAccent
- `secondary`: Border sportPrimary, color sportPrimary, background transparent
- `ghost`: No border, color primaryText, hover background surface
- `danger`: Background loss, color textOnAccent

**Tamaños**:
- `sm`: padding `${spacing.small} ${spacing.medium}`, fontSize small
- `md`: padding `${spacing.medium} ${spacing.large}`, fontSize medium
- `lg`: padding `${spacing.large} ${spacing.extraLarge}`, fontSize large

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Ejemplo**:
```tsx
<Button variant="primary" size="md" icon={<PlusIcon />}>
  Agregar Partido
</Button>
```

---

### Card
**Ubicación**: `components/ui/Card.tsx`

**Props**:
```typescript
interface CardProps {
  elevation?: 'low' | 'medium' | 'high';
  interactive?: boolean;  // Hover effect + border sportPrimary
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Estilos**:
- Background: `surface`
- Border: `1px solid ${border}`, si interactive: `sportPrimary` on hover
- Shadow: según elevation (small/medium/large)
- Border radius: `medium`

---

### Badge
**Ubicación**: `components/ui/Badge.tsx`

**Variantes**:
- `sport`: Background sportPrimary, color textOnAccent
- `win`: Background win, color textOnAccent
- `loss`: Background loss, color textOnAccent
- `neutral`: Background borderStrong, color primaryText

**Props**:
```typescript
interface BadgeProps {
  variant: 'sport' | 'win' | 'loss' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

---

### Title & Text
**Ubicación**: `components/ui/Typography.tsx`

**Title**:
```typescript
interface TitleProps {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  accent?: boolean;  // Usa sportPrimary gradient
}
```

**Text**:
```typescript
interface TextProps {
  variant: 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'sport';
  children: React.ReactNode;
}
```

---

## 🎨 THEMING

**Acceso al tema**:
```tsx
const { theme } = useTheme();
const { currentSport } = useData();

// Colores dinámicos según deporte
const sportPrimary = SPORT_COLORS[currentSport].primary;
```

**Reglas obligatorias**:
1. NUNCA usar colores hardcodeados (#fff, rgb())
2. SIEMPRE usar `theme.colors.*`
3. Para deporte-specific: usar `sportPrimary`, `sportSecondary`
4. Inline styles con tipo `{ [key: string]: React.CSSProperties }`

---

## 📐 SPACING & SIZING

**Spacing**: `theme.spacing.{extraSmall|small|medium|large|extraLarge}`
**Border Radius**: `theme.borderRadius.{small|medium|large}`
**Shadows**: `theme.shadows.{small|medium|large}`
**Font Sizes**: `theme.typography.fontSize.{extraSmall|small|medium|large|extraLarge}`

---

## ✅ CHECKLIST PARA NUEVOS COMPONENTES

- [ ] Props interface exportada
- [ ] Usa useTheme() hook
- [ ] Inline styles tipados
- [ ] Soporta dark/light mode
- [ ] Responsive (mobile-first)
- [ ] Hover/Active states definidos
- [ ] Transiciones suaves (0.2s ease)
- [ ] Accesibilidad (aria-labels cuando necesario)

