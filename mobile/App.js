import { useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from './src/components/ui/Toast';
import { ThemeProvider } from './src/context/ThemeContext';
import { BootScreen } from './src/screens/BootScreen';
import { ComponentGallery } from './src/screens/dev/ComponentGallery';

// Keep the native splash up until the fonts finish loading.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <StatusBar style="auto" />
          {/* The component gallery is dev-only; navigation arrives in Phase 3. */}
          {__DEV__ ? <ComponentGallery /> : <BootScreen />}
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
