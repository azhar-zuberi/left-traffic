import { router } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { StatBlock } from '@/components/StatBlock';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { formatNumber } from '@/utils/format';
import { aircraft, posts, users } from '@/utils/sampleData';
import { CURRENT_USER_ID } from '@/utils/types';

const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;
const myAircraft = aircraft.filter((a) => a.currentOwnerId === CURRENT_USER_ID);

export function ProfileScreen() {
  const myPosts = useMemo(
    () =>
      posts
        .filter((p) => p.authorId === CURRENT_USER_ID)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [],
  );

  const memberSinceYear = new Date(currentUser.joinedAt).getFullYear();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your pilot profile.</Text>
        </View>
        <Pressable
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonPressed]}
          hitSlop={8}
        >
          <Icon name="settings-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.identity}>
          <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.handle}>@{currentUser.handle}</Text>
          <Text style={styles.bio}>{currentUser.bio}</Text>
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{currentUser.homeAirport}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>Member since {memberSinceYear}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatBlock icon="airplane-outline" value={myAircraft.length} label="Aircraft" />
          <StatBlock
            icon="people-outline"
            value={formatNumber(currentUser.followersCount)}
            label="Followers"
          />
          <StatBlock
            icon="person-add"
            value={formatNumber(currentUser.followingCount)}
            label="Following"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your Aircraft</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.aircraftScroll}
            contentContainerStyle={styles.aircraftScrollContent}
          >
            {myAircraft.map((a) => (
              <Pressable
                key={a.id}
                style={({ pressed }) => [styles.aircraftChip, pressed && styles.aircraftChipPressed]}
                onPress={() => router.push(`/aircraft/${a.id}`)}
              >
                <Image source={{ uri: a.heroPhotoUrl }} style={styles.aircraftPhoto} resizeMode="cover" />
                <Text style={styles.aircraftReg}>{a.registration}</Text>
                <Text style={styles.aircraftModel} numberOfLines={1}>
                  {a.manufacturer} {a.model}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Stories</Text>
          {myPosts.length === 0 ? (
            <Text style={styles.emptyText}>No stories yet.</Text>
          ) : (
            <View style={styles.postsGrid}>
              {myPosts.map((post) => (
                <Pressable
                  key={post.id}
                  style={({ pressed }) => [styles.postTile, pressed && styles.postTilePressed]}
                  onPress={() => router.push(`/comments/${post.id}`)}
                >
                  <Image source={{ uri: post.photoUrl }} style={styles.postPhoto} resizeMode="cover" />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 88;
const AIRCRAFT_CHIP_WIDTH = 132;
const AIRCRAFT_PHOTO_HEIGHT = 88;

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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  settingsButtonPressed: {
    opacity: 0.8,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  identity: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  name: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  handle: {
    ...typography.bodyMuted,
    color: colors.textMuted,
    marginTop: spacing.xs / 2,
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  metaDot: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
  },
  aircraftScroll: {
    marginTop: spacing.md,
  },
  aircraftScrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  aircraftChip: {
    width: AIRCRAFT_CHIP_WIDTH,
  },
  aircraftChipPressed: {
    opacity: 0.85,
  },
  aircraftPhoto: {
    width: '100%',
    height: AIRCRAFT_PHOTO_HEIGHT,
    borderRadius: radii.card,
    backgroundColor: colors.border,
  },
  aircraftReg: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  aircraftModel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  postTile: {
    width: '48%',
    aspectRatio: 1,
  },
  postTilePressed: {
    opacity: 0.85,
  },
  postPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
});
