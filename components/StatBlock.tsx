import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  onDark?: boolean;
};

export function StatBlock({ icon, value, label, onDark = false }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.valueRow}>
        <Ionicons name={icon} size={15} color={onDark ? colors.textOnDarkMuted : colors.textMuted} />
        <Text style={[styles.value, onDark ? styles.valueOnDark : styles.valueOnLight]}>{value}</Text>
      </View>
      <Text style={[styles.label, onDark ? styles.labelOnDark : styles.labelOnLight]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs / 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  value: {
    ...typography.subheading,
  },
  valueOnLight: {
    color: colors.textPrimary,
  },
  valueOnDark: {
    color: colors.textOnDark,
  },
  label: {
    ...typography.caption,
  },
  labelOnLight: {
    color: colors.textMuted,
  },
  labelOnDark: {
    color: colors.textOnDarkMuted,
  },
});
