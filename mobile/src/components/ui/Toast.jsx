import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { radii } from '../../theme/tokens';

const ToastContext = createContext(null);

const TONE_ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  error: XCircle,
};

const TONE_COLORS = {
  success: 'accent',
  info: 'info',
  warning: 'warning',
  error: 'danger',
};

/**
 * Global toast host (DESIGN.md 9.18). Slide + fade in 250 ms, auto-dismiss
 * after 3 s, pill at the top of the screen above all content.
 * Usage: const { showToast } = useToast(); showToast({ message, tone: 'success' });
 */
export function ToastProvider({ children }) {
  const { colors, typography } = useTheme();
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const timer = useRef(null);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -16, duration: 180, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const showToast = useCallback(
    ({ message, tone = 'info' }) => {
      if (timer.current) clearTimeout(timer.current);
      opacity.setValue(0);
      translateY.setValue(-24);
      setToast({ message, tone });
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
      timer.current = setTimeout(dismiss, 3000);
    },
    [dismiss, opacity, translateY],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          testID="toast"
          style={[
            styles.toast,
            {
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.pill,
              opacity,
              transform: [{ translateY }],
            },
          ]}
          accessibilityRole="alert"
          accessibilityLabel={toast.message}
        >
          {(() => {
            const ToneIcon = TONE_ICONS[toast.tone] ?? Info;
            const toneKey = TONE_COLORS[toast.tone] ?? 'info';
            return <ToneIcon size={18} color={colors[toneKey]} strokeWidth={2} />;
          })()}
          <Text
            style={[typography.small, { color: colors.textPrimary, fontFamily: undefined }]}
            numberOfLines={1}
          >
            {toast.message}
          </Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a <ToastProvider>.');
  }
  return context;
}

const styles = {
  toast: {
    position: 'absolute',
    top: 8,
    left: 20,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
};
