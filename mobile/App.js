import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Phase 1 boot screen. It only proves the build boots in Expo Go.
// Phase 2 replaces this with the real themed app shell and `src/theme/` tokens.
const BOOT_BACKGROUND = '#0A0D12';
const BOOT_TEXT = '#FFFFFF';
const BOOT_ACCENT = '#22E55B';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        RideX<Text style={styles.dot}>.</Text>
      </Text>
      <Text style={styles.subtitle}>Phase 1 scaffold is running</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BOOT_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: BOOT_TEXT,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  dot: {
    color: BOOT_ACCENT,
  },
  subtitle: {
    marginTop: 8,
    color: '#A3ACB9',
    fontSize: 14,
  },
});
