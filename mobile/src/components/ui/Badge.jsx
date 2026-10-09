import { Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { sizes, withAlpha } from '../../theme/tokens';

const TONE_COLORS = {
  accent: 'accent',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  neutral: 'textSecondary',
};

/**
 * Small status badge (DESIGN.md 9.10). Height 28, pill, caption text.
 * `soft` = tone colour at 14% fill + full tone text (default);
 * `solid` = full tone fill + onAccent text. Works for any tone key.
 */
export function Badge({ label, tone = 'accent', variant = 'soft', testID }) {
  const { colors, radii, typography } = useTheme();
  const toneColor = colors[TONE_COLORS[tone]] ?? colors.accent;
  const textColor = variant === 'solid' ? colors.onAccent : toneColor;

  return (
    <View
      testID={testID}
      style={[
        styles.badge,
        {
          backgroundColor: variant === 'solid' ? toneColor : withAlpha(toneColor, 14),
          borderRadius: radii.pill,
          minHeight: sizes.badgeHeight,
        },
      ]}
    >
      <Text style={[typography.caption, { color: textColor, fontFamily: undefined }]}>{label}</Text>
    </View>
  );
}

const styles = {
  badge: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
};
