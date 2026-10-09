import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';

/**
 * Full-screen loading state (DESIGN.md 6.8). Only for boot/refresh moments —
 * lists use Skeleton instead.
 */
export function Loader({ label }) {
  const { colors } = useTheme();
  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Loading'}
    >
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = {
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
};
