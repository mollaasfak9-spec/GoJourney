import { fireEvent, render } from '@testing-library/react-native';
import { Pressable } from 'react-native';

import { ThemeProvider } from '../../../context/ThemeContext';
import { ToastProvider, useToast } from '../../../components/ui/Toast';

function Trigger() {
  const { showToast } = useToast();
  return (
    <Pressable
      testID="trigger"
      onPress={() => showToast({ message: 'Ride booked', tone: 'success' })}
    />
  );
}

function renderWithToast(ui) {
  return render(
    <ThemeProvider initialMode="light">
      <ToastProvider>{ui}</ToastProvider>
    </ThemeProvider>,
  );
}

describe('Toast', () => {
  it('shows a message after showToast is called', () => {
    const { getByTestId, getByText } = renderWithToast(<Trigger />);
    expect(() => getByTestId('toast')).toThrow();
    fireEvent.press(getByTestId('trigger'));
    expect(getByTestId('toast')).toBeTruthy();
    expect(getByText('Ride booked')).toBeTruthy();
  });

  it('throws when used outside the provider', () => {
    const renderOutside = () => render(<Trigger />);
    expect(renderOutside).toThrow('useToast must be used inside a <ToastProvider>');
  });
});
