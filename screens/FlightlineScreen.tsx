import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterPills } from '@/components/FilterPills';
import { PostCard } from '@/components/PostCard';
import { colors, spacing, typography } from '@/theme';
import { aircraft, posts } from '@/utils/sampleData';
import { CURRENT_USER_FOLLOWING_IDS, type Post } from '@/utils/types';

type FilterKey = 'all' | 'following' | 'nearby';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'following', label: 'Following' },
  { key: 'nearby', label: 'Nearby' },
];

// Approximates "nearby" as Alex's home region (KSQL, in the Bay Area) since
// there's no real geo-distance data to work with in this prototype.
const NEARBY_STATE = 'CA';

const aircraftById = new Map(aircraft.map((a) => [a.id, a]));

export function FlightlineScreen() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const feed = useMemo(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (filter === 'following') {
      return sorted.filter((post) => CURRENT_USER_FOLLOWING_IDS.includes(post.authorId));
    }
    if (filter === 'nearby') {
      return sorted.filter((post) => post.location.state === NEARBY_STATE);
    }
    return sorted;
  }, [filter]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Flightline</Text>
        <Text style={styles.subtitle}>Stories from the flightline.</Text>
      </View>

      <View style={styles.filterRow}>
        <FilterPills options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <FlashList<Post>
        data={feed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        renderItem={({ item }) => {
          const postAircraft = aircraftById.get(item.aircraftId);
          if (!postAircraft) return null;
          return (
            <PostCard
              post={item}
              aircraft={postAircraft}
              onPress={() => router.push(`/comments/${item.id}`)}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No stories here yet.</Text>
          </View>
        }
      />
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
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
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
