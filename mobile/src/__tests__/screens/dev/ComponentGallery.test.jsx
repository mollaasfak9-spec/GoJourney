import { render } from '@testing-library/react-native';

import { ToastProvider } from '../../../components/ui/Toast';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ComponentGallery } from '../../../screens/dev/ComponentGallery';

function renderGallery(mode) {
  return render(
    <ThemeProvider initialMode={mode}>
      <ToastProvider>
        <ComponentGallery />
      </ToastProvider>
    </ThemeProvider>,
  );
}

describe('ComponentGallery (dev only)', () => {
  it('renders every section in the light theme', () => {
    const { getByText, getByTestId } = renderGallery('light');
    expect(getByTestId('component-gallery')).toBeTruthy();
    for (const label of [
      'UI Kit',
      'Typography',
      'Buttons',
      'Inputs',
      'Segmented control',
      'Card & list',
      'States',
    ]) {
      expect(getByText(label)).toBeTruthy();
    }
    expect(getByText('Primary')).toBeTruthy();
    expect(getByText('Book a ride')).toBeTruthy();
  });

  it('renders every section in the dark theme', () => {
    const { getByTestId, getByText } = renderGallery('dark');
    expect(getByTestId('component-gallery')).toBeTruthy();
    expect(getByText('Choose vehicle')).toBeTruthy();
    expect(getByText('Open bottom sheet')).toBeTruthy();
  });

  it('offers the theme toggle', () => {
    const { getByTestId } = renderGallery('light');
    expect(getByTestId('theme-toggle')).toBeTruthy();
  });
});
