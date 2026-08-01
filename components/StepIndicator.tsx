import { Ionicons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

export type Step = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  steps: Step[];
  activeIndex: number;
};

const CIRCLE_SIZE = 36;

export function StepIndicator({ steps, activeIndex }: Props) {
  return (
    <View style={styles.row}>
      {steps.map((step, index) => {
        const reached = index <= activeIndex;
        return (
          <Fragment key={step.key}>
            <View style={styles.stepItem}>
              <View style={[styles.circle, reached ? styles.circleActive : styles.circleInactive]}>
                <Ionicons
                  name={step.icon}
                  size={16}
                  color={reached ? colors.textOnDark : colors.textMuted}
                />
              </View>
              <Text style={[styles.label, reached ? styles.labelActive : styles.labelInactive]}>
                {step.label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[styles.line, index < activeIndex ? styles.lineActive : styles.lineInactive]} />
            )}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  circleActive: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.backgroundDark,
  },
  circleInactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  labelInactive: {
    color: colors.textMuted,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    marginTop: CIRCLE_SIZE / 2,
    marginHorizontal: -spacing.xs,
  },
  lineActive: {
    backgroundColor: colors.backgroundDark,
  },
  lineInactive: {
    backgroundColor: colors.border,
  },
});
