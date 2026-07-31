import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import type { AircraftStatus } from '@/utils/types';

const LABELS: Record<AircraftStatus, string> = {
  flying: 'Flying',
  maintenance: 'In Maintenance',
  grounded: 'Grounded',
};

const TONES: Record<AircraftStatus, { text: string; background: string }> = {
  flying: { text: colors.statusFlying, background: colors.statusFlyingBackground },
  maintenance: { text: colors.statusMaintenance, background: colors.statusMaintenanceBackground },
  grounded: { text: colors.statusGrounded, background: colors.statusGroundedBackground },
};

export function StatusPill({ status }: { status: AircraftStatus }) {
  const tone = TONES[status];

  return (
    <View style={[styles.pill, { backgroundColor: tone.background }]}>
      <Text style={[styles.label, { color: tone.text }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  label: {
    ...typography.label,
    letterSpacing: 0.6,
    textTransform: 'none',
  },
});
