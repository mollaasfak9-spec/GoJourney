import { Pressable, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { sizes, withAlpha } from '../../theme/tokens';

/**
 * Circular icon button (DESIGN.md 9.2). Touch target is always >= 44 and the
 * visual circle is 48. Variants: ghost (default), secondary, danger.
 * `badge` shows a small colored dot for unread notifications.
 */
export function IconButton({
  icon: Icon,
  onPress,
  variant = 'ghost',
  badge = false,
  accessibilityLabel,
  testID,
  style,
}) {
  const { colors, radii } = useTheme();

  const palette = {
    ghost: {
      backgroundColor: 'transparent',
      pressed: colors.surfaceMuted,
      content: colors.textPrimary,
    },
    secondary: {
      backgroundColor: colors.surfaceRaised,
      pressed: colors.surfaceMuted,
      content: colors.textPrimary,
    },
    danger: {
      backgroundColor: 'transparent',
      pressed: withAlpha(colors.danger, 12),
      content: colors.danger,
    },
  }[variant];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: sizes.iconButton,
          height: sizes.iconButton,
          borderRadius: radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? palette.pressed : palette.backgroundColor,
        },
        pressed && {
          transform: [{ scale: 0.97 }],
        },
        style,
      ]}
    >
      <Icon size={22} color={palette.content} strokeWidth={2} />
      {badge ? (
        <View
          testID="icon-button-badge"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.accent,
            borderWidth: 2,
            borderColor: colors.bg,
          }}
        />
      ) : null}
    </Pressable>
  );
}
