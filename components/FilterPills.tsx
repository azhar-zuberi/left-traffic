import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Option<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (key: T) => void;
};

export function FilterPills<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable key={option.key} onPress={() => onChange(option.key)} hitSlop={8}>
            <View style={[styles.pill, active && styles.pillActive]}>
              <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
                {option.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
  },
  pillActive: {
    backgroundColor: colors.backgroundDark,
  },
  label: {
    ...typography.label,
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: 'none',
  },
  labelActive: {
    color: colors.textOnDark,
  },
  labelInactive: {
    color: colors.textSecondary,
  },
});
