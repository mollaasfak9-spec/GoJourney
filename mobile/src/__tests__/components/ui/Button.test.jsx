import { fireEvent, render } from '@testing-library/react-native';

import { Button } from '../../../components/ui/Button';
import { ThemeProvider } from '../../../context/ThemeContext';

function renderButton(props, mode = 'light') {
  return render(
    <ThemeProvider initialMode={mode}>
      <Button {...props} />
    </ThemeProvider>,
  );
}

describe('Button', () => {
  it('renders its label in the light theme', () => {
    const { getByText } = renderButton({ label: 'Book a ride' });
    expect(getByText('Book a ride')).toBeTruthy();
  });

  it('renders its label in the dark theme', () => {
    const { getByText } = renderButton({ label: 'Book a ride' }, 'dark');
    expect(getByText('Book a ride')).toBeTruthy();
  });

  it('uses the accent fill for primary in dark and ink navy in light (DESIGN 3.1)', () => {
    const dark = renderButton({ label: 'Go', testID: 'btn' }, 'dark');
    expect(dark.getByTestId('btn')).toHaveStyle({ backgroundColor: '#22E55B' });

    const light = renderButton({ label: 'Go', testID: 'btn' }, 'light');
    expect(light.getByTestId('btn')).toHaveStyle({ backgroundColor: '#0B1020' });
  });

  it('fires onPress when enabled', () => {
    const onPress = jest.fn();
    const { getByText } = renderButton({ label: 'Go', onPress });
    fireEvent.press(getByText('Go'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('blocks presses while disabled', () => {
    const onPress = jest.fn();
    const { getByText } = renderButton({ label: 'Go', onPress, disabled: true });
    fireEvent.press(getByText('Go'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a spinner and blocks presses while loading', () => {
    const onPress = jest.fn();
    const { getByTestId, getByText } = renderButton({ label: 'Saving', onPress, loading: true });
    expect(getByTestId('button-spinner')).toBeTruthy();
    fireEvent.press(getByText('Saving'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses the danger palette for the danger variant', () => {
    const { getByTestId } = renderButton(
      { label: 'Cancel ride', testID: 'btn-danger', variant: 'danger' },
      'light',
    );
    // 14% tint of #E5383B
    expect(getByTestId('btn-danger')).toHaveStyle({ backgroundColor: 'rgba(229,56,59,0.14)' });
  });
});
