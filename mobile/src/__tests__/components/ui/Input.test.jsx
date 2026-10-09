import { fireEvent, render } from '@testing-library/react-native';

import { Input } from '../../../components/ui/Input';
import { ThemeProvider } from '../../../context/ThemeContext';

function renderInput(props, mode = 'light') {
  return render(
    <ThemeProvider initialMode={mode}>
      <Input {...props} />
    </ThemeProvider>,
  );
}

describe('Input', () => {
  it('renders label, placeholder and value', () => {
    const { getByText, getByPlaceholderText, getByDisplayValue } = renderInput({
      label: 'Full name',
      placeholder: 'Enter your name',
      value: 'Aarav',
      onChangeText: jest.fn(),
    });
    expect(getByText('Full name')).toBeTruthy();
    expect(getByPlaceholderText('Enter your name')).toBeTruthy();
    expect(getByDisplayValue('Aarav')).toBeTruthy();
  });

  it('calls onChangeText with the new value', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderInput({
      placeholder: 'Phone',
      onChangeText,
    });
    fireEvent.changeText(getByPlaceholderText('Phone'), '+91 98765 43210');
    expect(onChangeText).toHaveBeenCalledWith('+91 98765 43210');
  });

  it('shows the error message below the field', () => {
    const { getByTestId, getByText } = renderInput({
      placeholder: 'Phone',
      onChangeText: jest.fn(),
      error: 'Enter a valid 10-digit number',
    });
    expect(getByTestId('input-error')).toBeTruthy();
    expect(getByText('Enter a valid 10-digit number')).toBeTruthy();
  });

  it('does not fire errors for the hint text', () => {
    const { queryByTestId, getByText } = renderInput({
      placeholder: 'OTP',
      onChangeText: jest.fn(),
      hint: 'We sent a 6-digit code',
    });
    expect(queryByTestId('input-error')).toBeNull();
    expect(getByText('We sent a 6-digit code')).toBeTruthy();
  });
});
