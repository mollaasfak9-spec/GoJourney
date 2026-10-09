import { View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';

/** Hairline divider (DESIGN.md 9.14). */
export function Divider({ style }) {
  const { colors } = useTheme();
  return <View style={[{ height: 1, backgroundColor: colors.border }, style]} />;
}
