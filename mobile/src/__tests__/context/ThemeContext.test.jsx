import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import { ThemeProvider, useTheme } from '../../context/ThemeContext';

function Probe() {
  const { colors, mode, setMode } = useTheme();
  return (
    <>
      <Text testID="mode">{mode}</Text>
      <Text testID="bg">{colors.bg}</Text>
      <Pressable testID="set-dark" onPress={() => setMode('dark')} />
      <Pressable testID="set-light" onPress={() => setMode('light')} />
    </>
  );
}

describe('ThemeProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('defaults to the system mode (light when the OS scheme is light)', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('bg').props.children).toBe('#FFFFFF'));
  });

  it('honours initialMode without waiting for storage', () => {
    const { getByTestId } = render(
      <ThemeProvider initialMode="dark">
        <Probe />
      </ThemeProvider>,
    );
    expect(getByTestId('mode').props.children).toBe('dark');
    expect(getByTestId('bg').props.children).toBe('#0A0D12');
  });

  it('persists the selected mode to AsyncStorage', async () => {
    const { getByTestId } = render(
      <ThemeProvider initialMode="light">
        <Probe />
      </ThemeProvider>,
    );
    fireEvent.press(getByTestId('set-dark'));
    expect(getByTestId('bg').props.children).toBe('#0A0D12');
    await waitFor(async () => {
      expect(await AsyncStorage.getItem('ridex.themeMode')).toBe('dark');
    });
  });

  it('restores a previously saved mode on mount', async () => {
    await AsyncStorage.setItem('ridex.themeMode', 'dark');
    const { getByTestId } = render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByTestId('mode').props.children).toBe('dark'));
    expect(getByTestId('bg').props.children).toBe('#0A0D12');
  });
});
