import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type Option<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (key: T) => void;
};

export function SegmentedTabs<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable key={option.key} onPress={() => onChange(option.key)} hitSlop={8}>
            <View style={styles.tab}>
              <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
                {option.label}
              </Text>
              {active && <View style={styles.underline} />}
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
    gap: spacing.md,
  },
  tab: {
    paddingBottom: spacing.sm,
  },
  label: {
    ...typography.subheading,
    fontSize: 15,
  },
  labelActive: {
    color: colors.textPrimary,
  },
  labelInactive: {
    color: colors.textMuted,
  },
  underline: {
    marginTop: spacing.xs,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.textPrimary,
  },
});
