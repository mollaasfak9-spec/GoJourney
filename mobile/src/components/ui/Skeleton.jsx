import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { radii } from '../../theme/tokens';

/**
 * Shimmer placeholder (DESIGN.md 9.11 / 6.8). Pulses opacity at 1200 ms.
 * `height` defaults to 16; pass `radius` to match the skeleton context.
 */
export function Skeleton({ width = '100%', height = 16, radius, style }) {
  const { colors } = useTheme();
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? radii.md,
          backgroundColor: colors.surfaceMuted,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}
