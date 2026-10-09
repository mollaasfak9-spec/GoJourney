import { Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

/**
 * Error state with retry (DESIGN.md 6.8). Every data screen must use this.
 */
export function ErrorState({ title = 'Something went wrong', message, onRetry, style }) {
  const { colors, radii, typography } = useTheme();

  return (
    <View style={[styles.wrap, style]} accessibilityRole="alert">
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.surfaceMuted,
            borderRadius: radii.pill,
          },
        ]}
      >
        <AlertCircle size={28} color={colors.danger} strokeWidth={2} />
      </View>
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
      {onRetry ? (
        <Button variant="secondary" label="Retry" onPress={onRetry} style={styles.retry} />
      ) : null}
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
  iconCircle: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
  },
  retry: {
    alignSelf: 'center',
    minWidth: 160,
    marginTop: 4,
  },
};
