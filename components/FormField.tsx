import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
  secureTextEntry?: boolean;
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  keyboardType,
  autoCapitalize = 'words',
  multiline = false,
  secureTextEntry = false,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={editable}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        style={[styles.input, multiline && styles.inputMultiline, !editable && styles.inputDisabled]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: colors.textSecondary,
    backgroundColor: colors.background,
  },
});
