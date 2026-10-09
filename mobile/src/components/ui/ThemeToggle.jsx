import { useTheme } from '../../context/ThemeContext';
import { SegmentedControl } from './SegmentedControl';

/**
 * Appearance switcher (DESIGN.md 16): System / Light / Dark.
 * Persists through ThemeProvider; used in Profile and the dev gallery.
 */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <SegmentedControl
      testID="theme-toggle"
      options={[
        { label: 'System', value: 'system' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ]}
      value={mode}
      onChange={setMode}
    />
  );
}
