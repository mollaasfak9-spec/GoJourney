import {
  darkColors,
  lightColors,
  radii,
  sizes,
  spacing,
  typography,
  withAlpha,
} from '../../theme/tokens';

describe('design tokens', () => {
  it('dark palette uses the DESIGN.md signal-green accent', () => {
    expect(darkColors.accent).toBe('#22E55B');
    expect(darkColors.bg).toBe('#0A0D12');
  });

  it('light palette uses ink navy as the primary button fill', () => {
    expect(lightColors.primary).toBe('#0B1020');
    expect(lightColors.accentText).toBe('#0A8A35');
  });

  it('spacing follows the 4pt grid with 20pt screen padding', () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.xl).toBe(20);
    expect(sizes.screenPadding).toBe(20);
    expect(sizes.buttonHeight).toBe(56);
    expect(sizes.minTouch).toBe(44);
  });

  it('radii match DESIGN.md', () => {
    expect(radii.sm).toBe(12);
    expect(radii.md).toBe(16);
    expect(radii.lg).toBe(24);
    expect(radii.xl).toBe(32);
    expect(radii.pill).toBe(999);
  });

  it('display type style is 36/700 with -0.8 tracking', () => {
    expect(typography.display.fontSize).toBe(36);
    expect(typography.display.fontWeight).toBe('700');
    expect(typography.display.letterSpacing).toBe(-0.8);
  });

  it('withAlpha produces an rgba tint at the requested percentage', () => {
    expect(withAlpha('#22E55B', 14)).toBe('rgba(34,229,91,0.14)');
    expect(withAlpha('#FFFFFF', 100)).toBe('rgba(255,255,255,1)');
  });
});
