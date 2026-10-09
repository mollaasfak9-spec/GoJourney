// Jest setup for the RideX mobile app.
// This file runs after the test framework is installed, before each test file.
// Docs: https://docs.expo.dev/develop/unit-testing/

// Make sure code that reads the API URL during tests gets a stable value.
process.env.EXPO_PUBLIC_API_URL = 'http://127.0.0.1:5000/api';

// Official AsyncStorage in-memory mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Official safe-area mock so Screen/SafeAreaView render in jsdom-less tests.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock'),
);

// NOTE (Phase 2): when component tests animate with Reanimated, add its jest
// setup per the installed version's testing guide.
