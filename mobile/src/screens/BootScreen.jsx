import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';

/**
 * Interim app landing (branded, not data). Replaced by the real navigation
 * shell in Phase 3. Uses only theme tokens — no raw color values.
 */
export function BootScreen() {
  const { colors, fonts, typography } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <Text style={[typography.display, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
        RideX<Text style={{ color: colors.accent }}>.</Text>
      </Text>
      <Text style={[typography.small, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
        Book a ride in minutes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
