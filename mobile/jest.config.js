// Jest configuration for the RideX mobile app.
// Uses the `jest-expo` preset so React Native + Expo modules transform correctly.
// Docs: https://docs.expo.dev/develop/unit-testing/
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/**/__tests__/**', '!src/**/*.styles.js'],
  clearMocks: true,
};
