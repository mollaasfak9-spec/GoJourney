// Jest setup for the RideX mobile app.
// This file runs after the test framework is installed, before each test file.
// Docs: https://docs.expo.dev/develop/unit-testing/

// Make sure code that reads the API URL during tests gets a stable value.
process.env.EXPO_PUBLIC_API_URL = 'http://127.0.0.1:5000/api';

// NOTE (Phase 2): when component tests render Reanimated views, add the
// Reanimated jest mock here per the installed version's testing guide.
