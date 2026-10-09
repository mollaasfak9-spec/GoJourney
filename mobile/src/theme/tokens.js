// RideX design tokens — the single source of every visual value.
// Derived line-by-line from mobile/DESIGN.md (sections 3–6, 17).
// Rule: no raw hex / size / radius values anywhere else in the app.

// --- Spacing (DESIGN.md 5: 4pt grid) ---
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
};

// --- Radius (DESIGN.md 5) ---
export const radii = {
  sm: 12, // badges, chips
  md: 16, // inputs, small cards
  lg: 24, // cards, vehicle cards
  xl: 32, // bottom sheets, location card container
  pill: 999, // buttons, segmented control, plate, avatars
};

// --- Typography (DESIGN.md 4) ---
export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

export const typography = {
  display: { fontSize: 36, lineHeight: 42, fontWeight: '700', letterSpacing: -0.8 },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '600', letterSpacing: -0.3 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0 },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600', letterSpacing: 0 },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.1 },
  statXL: { fontSize: 40, lineHeight: 44, fontWeight: '700', letterSpacing: -0.8 },
  button: { fontSize: 16, lineHeight: 20, fontWeight: '600', letterSpacing: 0.1 },
};

// --- Color palettes (DESIGN.md 3.2 / 3.3) ---
export const darkColors = {
  bg: '#0A0D12',
  surface: '#11151B',
  surfaceRaised: '#181D25',
  surfaceMuted: '#1F252E',
  border: '#262D38',
  textPrimary: '#FFFFFF',
  textSecondary: '#A3ACB9',
  textTertiary: '#6B7482',
  accent: '#22E55B',
  accentPressed: '#19C24B',
  accentSoft: '#0F2A1A',
  onAccent: '#04110A',
  danger: '#FF5A5F',
  warning: '#FFB020',
  info: '#4DA3FF',
  overlay: 'rgba(0,0,0,0.6)',
  // semantic aliases used by components (DESIGN.md 3.1)
  primary: '#22E55B', // primary button fill
  onPrimary: '#04110A',
  primaryPressed: '#19C24B',
  accentText: '#22E55B',
  tabBarBorder: 'transparent',
};

export const lightColors = {
  bg: '#FFFFFF',
  surface: '#F4F5F7',
  surfaceRaised: '#FFFFFF',
  surfaceMuted: '#ECEEF2',
  border: '#E6E8EC',
  textPrimary: '#0B1020',
  textSecondary: '#5B6475',
  textTertiary: '#9AA2B1',
  ink: '#0B1020',
  onInk: '#FFFFFF',
  accent: '#22E55B',
  accentText: '#0A8A35',
  accentSoft: '#E6FBEC',
  onAccent: '#04110A',
  danger: '#E5383B',
  warning: '#C97A00',
  info: '#1F5FFF',
  overlay: 'rgba(11,16,32,0.45)',
  panelGradient: ['#0B1020', '#171E45'],
  // semantic aliases used by components (DESIGN.md 3.1)
  primary: '#0B1020', // primary button fill = ink navy
  onPrimary: '#FFFFFF',
  primaryPressed: '#232B43',
  accentTextOnAccent: '#04110A',
  tabBarBorder: '#E6E8EC',
};

// Elevation (DESIGN.md 5): light theme has ONE soft shadow for raised
// surfaces ("0 8 24" at 8% ink). Dark theme has no shadows.
export const raisedShadow = {
  shadowColor: '#0B1020',
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 24,
  elevation: 8,
};

// --- Sizes / interaction (DESIGN.md 5, 6) ---
export const sizes = {
  minTouch: 44, // never below
  touch: 48,
  icon: 22,
  iconButton: 48,
  avatar: { sm: 36, md: 48, lg: 72 },
  buttonHeight: 56,
  inputHeight: 56,
  badgeHeight: 28,
  tabBarHeight: 64,
  marker: 20,
  screenPadding: spacing.xl, // 20
};

/**
 * Convert a #RRGGBB hex color to rgba() with the given opacity.
 * Used for tints such as "soft" badges and danger buttons (color at 14%).
 */
export function withAlpha(hex, alphaPercent) {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  const a = Math.round(((alphaPercent ?? 100) / 100) * 1000) / 1000;
  return `rgba(${r},${g},${b},${a})`;
}
