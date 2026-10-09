import { useEffect, useRef, useState } from 'react';
import { Animated, Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { radii } from '../../theme/tokens';
import { IconButton } from './IconButton';

/**
 * Bottom sheet (DESIGN.md 9.6): backdrop overlay + panel with 32 radius top,
 * a 40x4 drag handle and an optional close button. Panels snap to peek/half/full
 * in later phases; this is the base sheet used app-wide.
 */
export function Sheet({ visible, onClose, title, children, showClose = true, testID }) {
  const { colors, typography } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.setValue(320);
      Animated.timing(translateY, { toValue: 0, duration: 320, useNativeDriver: true }).start();
    } else if (mounted) {
      Animated.timing(translateY, { toValue: 320, duration: 220, useNativeDriver: true }).start(
        () => setMounted(false),
      );
    }
  }, [visible, mounted, translateY]);

  if (!mounted) return null;

  return (
    <RNModal transparent visible animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayWrap}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
          onPress={onClose}
        />
        <Animated.View
          testID={testID ?? 'sheet'}
          style={[
            styles.panel,
            {
              backgroundColor: colors.surfaceRaised,
              borderTopLeftRadius: radii.xl,
              borderTopRightRadius: radii.xl,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.surfaceMuted }]} />
          {title ? (
            <View style={styles.header}>
              <Text style={[typography.h3, { color: colors.textPrimary, fontFamily: undefined }]}>
                {title}
              </Text>
              {showClose ? (
                <IconButton icon={X} onPress={onClose} accessibilityLabel="Close" />
              ) : null}
            </View>
          ) : null}
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = {
  overlayWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  body: {
    marginTop: 16,
  },
};
