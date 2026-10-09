import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { sizes } from '../../theme/tokens';

/**
 * Top bar (DESIGN.md 9.7). Fixed 56px row with a left slot (back/menu button),
 * an optional centered title and a right slot (avatar/actions).
 * Map screens use the floating variant in Phase 5.
 */
export function Header({ left, title, right, style, testID }) {
  const { colors, typography } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.bar,
        {
          minHeight: 56,
          paddingHorizontal: sizes.screenPadding,
        },
        style,
      ]}
    >
      <View style={styles.slot}>{left}</View>
      {title ? (
        <Text
          style={[
            typography.h3,
            styles.title,
            { color: colors.textPrimary, fontFamily: undefined },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : null}
      <View style={[styles.slot, styles.rightSlot]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  slot: {
    minWidth: 48,
  },
  rightSlot: {
    alignItems: 'flex-end',
  },
  title: {
    flexShrink: 1,
  },
});
