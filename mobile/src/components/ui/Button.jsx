import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { sizes, withAlpha } from '../../theme/tokens';

/**
 * Primary interactive button (DESIGN.md 9.1).
 * Variants: primary | secondary | ghost | danger. Fixed height 56, pill radius,
 * full width by default. While `loading`, the spinner replaces the leading icon
 * and presses are blocked. `disabled` renders at 40% opacity.
 */
export function Button({
  variant = 'primary',
  label,
  onPress,
  loading = false,
  disabled = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  style,
  accessibilityLabel,
  testID,
}) {
  const { colors, isDark, radii, typography } = useTheme();
  const isUnavailable = disabled || loading;

  const palette = {
    primary: {
      backgroundColor: colors.primary,
      pressed: colors.primaryPressed,
      content: colors.onPrimary,
      spinner: colors.onPrimary,
    },
    secondary: {
      backgroundColor: isDark ? colors.surfaceRaised : colors.surface,
      pressed: colors.surfaceMuted,
      content: colors.textPrimary,
      spinner: colors.textPrimary,
    },
    ghost: {
      backgroundColor: 'transparent',
      pressed: withAlpha(colors.textPrimary, 8),
      content: colors.textPrimary,
      spinner: colors.textPrimary,
    },
    danger: {
      backgroundColor: withAlpha(colors.danger, 14),
      pressed: withAlpha(colors.danger, 24),
      content: colors.danger,
      spinner: colors.danger,
    },
  }[variant];

  const contentColor = palette.content;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isUnavailable, busy: loading }}
      disabled={isUnavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isUnavailable
            ? withAlpha(palette.backgroundColor, 40)
            : pressed
              ? palette.pressed
              : palette.backgroundColor,
          borderRadius: radii.pill,
          minHeight: sizes.buttonHeight,
        },
        pressed && !isUnavailable && styles.pressedScale,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.spinner} testID="button-spinner" />
      ) : LeadingIcon ? (
        <LeadingIcon size={22} color={contentColor} strokeWidth={2} />
      ) : null}
      <Text
        style={[
          typography.button,
          {
            color: contentColor,
            fontFamily: undefined,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {TrailingIcon ? <TrailingIcon size={22} color={contentColor} strokeWidth={2} /> : null}
    </Pressable>
  );
}

const styles = {
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  pressedScale: {
    transform: [{ scale: 0.97 }],
  },
};
