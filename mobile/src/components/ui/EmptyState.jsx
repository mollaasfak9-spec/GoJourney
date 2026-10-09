import { Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';

/**
 * Empty state (DESIGN.md 6.8 / 9.13). One icon, a short title and one sentence.
 * `action` should be a Button/other element.
 */
export function EmptyState({ icon: Icon, title, message, action, style }) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.wrap, style]}>
      {Icon ? <Icon size={48} color={colors.textTertiary} strokeWidth={1.8} /> : null}
      <Text style={[typography.h3, { color: colors.textPrimary, fontFamily: undefined }]}>
        {title}
      </Text>
      {message ? (
        <Text
          style={[
            typography.small,
            styles.message,
            { color: colors.textSecondary, fontFamily: undefined },
          ]}
        >
          {message}
        </Text>
      ) : null}
      {action}
    </View>
  );
}

const styles = {
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  message: {
    textAlign: 'center',
  },
};
