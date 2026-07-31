import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { StatBlock } from '@/components/StatBlock';
import { StatusPill } from '@/components/StatusPill';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { formatNumber } from '@/utils/format';
import type { Aircraft } from '@/utils/types';

type Props = {
  aircraft: Aircraft;
  postCount: number;
  adventureCount: number;
  onPress: () => void;
};

export function AircraftCard({ aircraft, postCount, adventureCount, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.photoWrap}>
        <Image source={{ uri: aircraft.heroPhotoUrl }} style={styles.photo} resizeMode="cover" />
        <View style={styles.pillOverlay}>
          <StatusPill status={aircraft.status} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.registration}>{aircraft.registration}</Text>
        <Text style={styles.subtitle}>
          {aircraft.year} {aircraft.manufacturer} {aircraft.model}
        </Text>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <StatBlock icon="images-outline" value={formatNumber(postCount)} label="Posts" />
          <StatBlock icon="compass-outline" value={formatNumber(adventureCount)} label="Adventures" />
          <StatBlock icon="time-outline" value={formatNumber(aircraft.totalHours)} label="Total Hours" />
        </View>
      </View>
    </Pressable>
  );
}

const PHOTO_HEIGHT = 220;

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.92,
  },
  photoWrap: {
    height: PHOTO_HEIGHT,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  pillOverlay: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.xs / 2,
  },
  registration: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
