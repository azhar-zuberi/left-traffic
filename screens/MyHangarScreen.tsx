import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AircraftCard } from '@/components/AircraftCard';
import { colors, radii, spacing, typography } from '@/theme';
import { aircraft, posts } from '@/utils/sampleData';
import { CURRENT_USER_ID, type Aircraft } from '@/utils/types';

const ADVENTURE_CATEGORIES = new Set(['trip', 'flight', 'flyout', 'event']);

const myAircraft = aircraft.filter((a) => a.currentOwnerId === CURRENT_USER_ID);

function countPosts(aircraftId: string) {
  return posts.filter((p) => p.aircraftId === aircraftId).length;
}

function countAdventures(aircraftId: string) {
  return posts.filter((p) => p.aircraftId === aircraftId && ADVENTURE_CATEGORIES.has(p.category)).length;
}

export function MyHangarScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Hangar</Text>
          <Text style={styles.subtitle}>Your aircraft, your stories.</Text>
        </View>
        <Pressable
          onPress={() => router.push('/add-aircraft')}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          hitSlop={8}
        >
          <Ionicons name="add" size={22} color={colors.textOnDark} />
        </Pressable>
      </View>

      <FlashList<Aircraft>
        data={myAircraft}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        renderItem={({ item }) => (
          <AircraftCard
            aircraft={item}
            postCount={countPosts(item.id)}
            adventureCount={countAdventures(item.id)}
            onPress={() => router.push(`/aircraft/${item.id}`)}
          />
        )}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
