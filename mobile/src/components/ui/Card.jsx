import { View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { raisedShadow } from '../../theme/tokens';

/**
 * Surface container (DESIGN.md 9.4).
 * Dark theme: surface fill, no shadow. Light theme: white fill + the single
 * soft shadow the design allows. `raised` uses surfaceRaised in dark.
 */
export function Card({ children, raised = false, padding = true, style, testID }) {
  const { colors, isDark, radii } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        {
          backgroundColor: isDark
            ? raised
              ? colors.surfaceRaised
              : colors.surface
            : colors.surfaceRaised,
          borderRadius: radii.lg,
          padding: padding ? 16 : 0,
        },
        !isDark && raisedShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}
