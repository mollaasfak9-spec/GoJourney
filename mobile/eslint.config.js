// Flat ESLint config for the RideX mobile app.
// Docs: https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  // `eslint-config-expo/flat` exports an array in recent versions; guard for both.
  ...(Array.isArray(expoConfig) ? expoConfig : [expoConfig]),
  {
    // Generated / vendor output is never linted.
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '.expo/**',
      'android/**',
      'ios/**',
      'assets/**',
    ],
  },
  {
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Jest globals are only available in test files and the jest setup.
    files: ['**/__tests__/**/*.js', '**/*.test.js', 'jest.setup.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
];
