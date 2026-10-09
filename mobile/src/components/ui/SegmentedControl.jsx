import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { sizes } from '../../theme/tokens';

/**
 * Pill segmented control (DESIGN.md 9.5). Active segment uses the primary fill
 * + onPrimary text. Used for vehicle type / appearance / ride status filters.
 */
export function SegmentedControl({ options, value, onChange, testID }) {
  const { colors, radii, typography } = useTheme();

  return (
    <View
      testID={testID}
      accessibilityRole="tablist"
      style={[
        styles.track,
        {
          backgroundColor: colors.surfaceRaised,
          borderRadius: radii.pill,
          padding: 4,
          minHeight: 48,
        },
      ]}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              {
                backgroundColor: active ? colors.primary : 'transparent',
                borderRadius: radii.pill,
              },
              active && styles.activeSegment,
            ]}
          >
            {option.icon ? (
              <option.icon
                size={20}
                color={active ? colors.onPrimary : colors.textSecondary}
                strokeWidth={2}
              />
            ) : null}
            <Text
              style={[
                typography.small,
                {
                  color: active ? colors.onPrimary : colors.textSecondary,
                  fontWeight: active ? '600' : '400',
                  fontFamily: undefined,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = {
  track: {
    flexDirection: 'row',
    gap: 4,
    alignSelf: 'center',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  activeSegment: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
};
