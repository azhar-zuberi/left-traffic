import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityRow } from '@/components/ActivityRow';
import { colors, spacing, typography } from '@/theme';
import { activity, aircraft, users } from '@/utils/sampleData';
import type { ActivityItem } from '@/utils/types';

const usersById = new Map(users.map((u) => [u.id, u]));
const aircraftById = new Map(aircraft.map((a) => [a.id, a]));

// Aircraft-first identity model (docs/PRODUCT_VISION.md): show the actor's
// tail number when they currently own an aircraft, falling back to their
// handle when they don't.
function actorAvatar(item: ActivityItem): string {
  if (item.actorAircraftId) {
    const ownedAircraft = aircraftById.get(item.actorAircraftId);
    if (ownedAircraft) return ownedAircraft.heroPhotoUrl;
  }
  return usersById.get(item.actorUserId)?.avatarUrl ?? '';
}

function actorName(item: ActivityItem): string {
  if (item.actorAircraftId) {
    const ownedAircraft = aircraftById.get(item.actorAircraftId);
    if (ownedAircraft) return ownedAircraft.registration;
  }
  return usersById.get(item.actorUserId)?.handle ?? 'Someone';
}

export function ActivityScreen() {
  const unread = useMemo(
    () =>
      activity
        .filter((item) => !item.read)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [],
  );
  const read = useMemo(
    () =>
      activity
        .filter((item) => item.read)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [],
  );

  function renderRow(item: ActivityItem) {
    return (
      <ActivityRow
        key={item.id}
        type={item.type}
        avatarUrl={actorAvatar(item)}
        actorName={actorName(item)}
        createdAt={item.createdAt}
        onPress={item.targetPostId ? () => router.push(`/comments/${item.targetPostId}`) : undefined}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>What&rsquo;s new in your hangar.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {unread.length === 0 && read.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No activity yet.</Text>
          </View>
        ) : (
          <>
            {unread.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>New</Text>
                {unread.map(renderRow)}
              </View>
            )}
            {read.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Earlier</Text>
                {read.map(renderRow)}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMuted,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  emptyState: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
