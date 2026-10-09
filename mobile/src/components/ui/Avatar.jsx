import { Image, Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { sizes } from '../../theme/tokens';

const SIZE_MAP = { sm: sizes.avatar.sm, md: sizes.avatar.md, lg: sizes.avatar.lg };

/**
 * Circular avatar (DESIGN.md 9.12). Shows an image when `src` is provided,
 * otherwise the initials on surfaceMuted.
 */
export function Avatar({ src, name = '', size = 'md', style }) {
  const { colors, radii, typography } = useTheme();
  const dimension = SIZE_MAP[size] ?? sizes.avatar.md;

  const initials = (name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <View
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: radii.pill,
          backgroundColor: colors.surfaceMuted,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: dimension, height: dimension }}
          accessibilityLabel={name}
        />
      ) : (
        <Text
          style={[typography.bodyStrong, { color: colors.textSecondary, fontFamily: undefined }]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}
