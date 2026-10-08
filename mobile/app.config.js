// RideX mobile app configuration.
// Expo reads this at build/start time. For SDK 54+ the splash screen is
// configured through the expo-splash-screen plugin below.
//
// Docs: https://docs.expo.dev/versions/latest/config/app/
const darkBackground = '#0A0D12';

module.exports = {
  expo: {
    name: 'RideX',
    slug: 'ridex',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'ridex',
    userInterfaceStyle: 'automatic',
    icon: './assets/icon.png',
    // Long-form splash is handled by the expo-splash-screen plugin (see plugins).
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.ridex.app',
      // Human-readable location permission copy (DESIGN.md 6.6).
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'RideX uses your location to set your pickup point and to show nearby drivers.',
      },
    },
    android: {
      package: 'com.ridex.app',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-splash-screen',
        {
          backgroundColor: darkBackground,
          image: './assets/splash-icon.png',
          imageWidth: 180,
          resizeMode: 'contain',
        },
      ],
      'expo-secure-store',
      'expo-font',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow RideX to use your location while booking and tracking a ride.',
          isAndroidBackgroundLocationEnabled: false,
        },
      ],
    ],
  },
};
