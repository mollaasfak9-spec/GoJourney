import { fireEvent, render } from '@testing-library/react-native';

import { Badge } from '../../../components/ui/Badge';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { ThemeProvider } from '../../../context/ThemeContext';

function renderInTheme(ui, mode = 'light') {
  return render(<ThemeProvider initialMode={mode}>{ui}</ThemeProvider>);
}

describe('SegmentedControl', () => {
  const options = [
    { label: 'Bike', value: 'bike' },
    { label: 'Auto', value: 'auto' },
    { label: 'Car', value: 'car' },
  ];

  it('renders every option', () => {
    const { getByText } = renderInTheme(
      <SegmentedControl options={options} value="bike" onChange={jest.fn()} />,
    );
    expect(getByText('Bike')).toBeTruthy();
    expect(getByText('Auto')).toBeTruthy();
    expect(getByText('Car')).toBeTruthy();
  });

  it('reports the selected value on press', () => {
    const onChange = jest.fn();
    const { getByText } = renderInTheme(
      <SegmentedControl options={options} value="bike" onChange={onChange} />,
    );
    fireEvent.press(getByText('Auto'));
    expect(onChange).toHaveBeenCalledWith('auto');
  });

  it('flags the active segment as selected for accessibility', () => {
    const { getByRole } = renderInTheme(
      <SegmentedControl options={options} value="car" onChange={jest.fn()} />,
    );
    expect(getByRole('tab', { name: 'Car' })).toHaveAccessibilityState({ selected: true });
  });
});

describe('Badge', () => {
  it('renders the label and tone text color', () => {
    const { getByText } = renderInTheme(<Badge label="On time" tone="accent" />);
    expect(getByText('On time')).toBeTruthy();
  });

  it('uses danger text for the danger tone', () => {
    const { getByText } = renderInTheme(<Badge label="Cancelled" tone="danger" />);
    expect(getByText('Cancelled')).toHaveStyle({ color: '#E5383B' });
  });

  it('renders solid variant with accent fill', () => {
    const { getByText } = renderInTheme(<Badge label="Solid" tone="accent" variant="solid" />);
    expect(getByText('Solid')).toHaveStyle({ color: '#04110A' });
  });
});
