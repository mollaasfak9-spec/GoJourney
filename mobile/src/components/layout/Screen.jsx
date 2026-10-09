import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../context/ThemeContext';
import { sizes } from '../../theme/tokens';

/**
 * Standard screen shell (DESIGN.md 6.6): safe areas, optional keyboard avoid,
 * optional scroll, and the standard 20px horizontal padding.
 * Map screens opt out and render full-bleed content instead.
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  keyboard = true,
  edges = ['top', 'bottom'],
  style,
  contentContainerStyle,
  testID,
}) {
  const { colors } = useTheme();

  const paddingStyle = padded ? { paddingHorizontal: sizes.screenPadding } : null;

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, paddingStyle, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixed, paddingStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.bg }, style]}
      edges={edges}
      testID={testID}
    >
      {keyboard ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = {
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  fixed: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
};
