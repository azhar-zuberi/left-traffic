import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  right?: ReactNode;
  destructive?: boolean;
};

export function SettingsRow({ icon, label, onPress, right, destructive = false }: Props) {
  const content = (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={destructive ? colors.like : colors.textSecondary} />
      <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
      {right}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
  },
  labelDestructive: {
    color: colors.like,
  },
});
