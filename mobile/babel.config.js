// Babel configuration for the RideX mobile app.
// `babel-preset-expo` handles JSX, React Native and Expo modules.
// Reanimated 4 requires `react-native-worklets/plugin`, and it must be listed LAST.
// Docs: https://docs.expo.dev/versions/latest/sdk/reanimated/
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};
