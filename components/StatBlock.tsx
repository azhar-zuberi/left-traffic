import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, spacing, typography } from '@/theme';

type Props = {
  icon: IconName;
  value: string | number;
  label: string;
  onDark?: boolean;
};

export function StatBlock({ icon, value, label, onDark = false }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.valueRow}>
        <Icon name={icon} size={15} color={onDark ? colors.textOnDarkMuted : colors.textMuted} style={styles.icon} />
        <Text style={[styles.value, onDark ? styles.valueOnDark : styles.valueOnLight]} numberOfLines={2}>
          {value}
        </Text>
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
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  icon: {
    marginTop: 2,
  },
  value: {
    ...typography.subheading,
    flexShrink: 1,
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
