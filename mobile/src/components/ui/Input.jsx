import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { sizes } from '../../theme/tokens';

/**
 * Text input (DESIGN.md 9.3). Height 56, radius md, surfaceRaised fill.
 * Focus draws a 1.5px accent border; `error` switches that to danger and shows
 * the message below. Password inputs get a show/hide toggle.
 */
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  leadingIcon: LeadingIcon,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  disabled = false,
  autoFocus = false,
  returnKeyType = 'done',
  onSubmitEditing,
  testID,
  accessibilityLabel,
}) {
  const { colors, fonts, radii, typography } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);
  const inputRef = useRef(null);

  const accent = error ? colors.danger : colors.primary;
  const borderColor = focused || error ? accent : 'transparent';

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text style={[typography.small, { color: colors.textSecondary }]}>{label}</Text>
      ) : null}
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.shell,
          {
            backgroundColor: disabled ? colors.surfaceMuted : colors.surfaceRaised,
            borderRadius: radii.md,
            minHeight: sizes.inputHeight,
            borderWidth: focused || error ? 1.5 : 0,
            borderColor,
            opacity: disabled ? 0.7 : 1,
          },
        ]}
      >
        {LeadingIcon ? (
          <View
            style={[
              styles.leadingCircle,
              {
                backgroundColor: colors.surfaceMuted,
                borderRadius: radii.pill,
              },
            ]}
          >
            <LeadingIcon size={20} color={colors.textSecondary} strokeWidth={2} />
          </View>
        ) : null}
        <TextInput
          ref={inputRef}
          testID={testID}
          accessibilityLabel={accessibilityLabel ?? label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            typography.body,
            {
              color: colors.textPrimary,
              fontFamily: fonts.regular,
            },
          ]}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={!disabled}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((value) => !value)}
            hitSlop={8}
            style={{ padding: 4 }}
          >
            {hidden ? (
              <Eye size={22} color={colors.textSecondary} strokeWidth={2} />
            ) : (
              <EyeOff size={22} color={colors.textSecondary} strokeWidth={2} />
            )}
          </Pressable>
        ) : null}
      </Pressable>
      {error ? (
        <Text testID="input-error" style={[typography.caption, { color: colors.danger }]}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={[typography.caption, { color: colors.textTertiary }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = {
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 2,
    gap: 12,
  },
  leadingCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
};
