import { Modal as RNModal, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { radii } from '../../theme/tokens';
import { Button } from './Button';

/**
 * Confirmation dialog (DESIGN.md 9.17): centered card with blur-free overlay,
 * a h3 title, a one-line body and Cancel / Confirm actions on the bottom row.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  onCancel,
  testID,
}) {
  const { colors, typography } = useTheme();

  if (!visible) return null;

  return (
    <RNModal transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        testID={testID ?? 'confirm-dialog'}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.lg,
            },
          ]}
        >
          <Text style={[typography.h3, { color: colors.textPrimary, fontFamily: undefined }]}>
            {title}
          </Text>
          {message ? (
            <Text
              style={[typography.small, { color: colors.textSecondary, fontFamily: undefined }]}
            >
              {message}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button variant="ghost" label={cancelLabel} onPress={onCancel} style={styles.flex} />
            <Button
              variant={tone === 'danger' ? 'danger' : 'primary'}
              label={confirmLabel}
              onPress={onConfirm}
              style={styles.flex}
            />
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  flex: {
    flex: 1,
  },
};
