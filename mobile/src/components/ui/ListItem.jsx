import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { sizes } from '../../theme/tokens';

/**
 * Single-row list item (DESIGN.md 9.15): leading icon in a 48 circle, a title,
 * an optional right value, and a chevron when pressable.
 */
export function ListItem({ icon: Icon, title, subtitle, value, onPress, danger = false, testID }) {
  const { colors, radii, typography } = useTheme();
  const contentColor = danger ? colors.danger : colors.textPrimary;

  const Row = (
    <>
      {Icon ? (
        <View
          style={[
            {
              width: 48,
              height: 48,
              borderRadius: radii.md,
              backgroundColor: colors.surfaceMuted,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Icon size={22} color={danger ? colors.danger : colors.textPrimary} strokeWidth={2} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[typography.bodyStrong, { color: contentColor, fontFamily: undefined }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[typography.caption, { color: colors.textTertiary, fontFamily: undefined }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text style={[typography.small, { color: colors.textTertiary, fontFamily: undefined }]}>
          {value}
        </Text>
      ) : null}
      {onPress ? <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} /> : null}
    </>
  );

  if (!onPress) {
    return (
      <View testID={testID} style={styles.row}>
        {Row}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      {Row}
    </Pressable>
  );
}

const styles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
};
