import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { LogbookEntry } from '@/components/LogbookEntry';
import { SegmentedTabs } from '@/components/SegmentedTabs';
import { SpecRow } from '@/components/SpecRow';
import { StatBlock } from '@/components/StatBlock';
import { StatusPill } from '@/components/StatusPill';
import { colors, radii, spacing, typography } from '@/theme';
import { formatNumber } from '@/utils/format';
import { aircraft, posts } from '@/utils/sampleData';
import type { Post } from '@/utils/types';

type TabKey = 'overview' | 'logbook' | 'details' | 'photos';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'logbook', label: 'Logbook' },
  { key: 'details', label: 'Details' },
  { key: 'photos', label: 'Photos' },
];

const HERO_HEIGHT = 340;

export function AircraftDetailScreen() {
  const { aircraftId } = useLocalSearchParams<{ aircraftId: string }>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('overview');

  const aircraftRecord = aircraft.find((a) => a.id === aircraftId);

  const aircraftPosts = useMemo(() => {
    if (!aircraftRecord) return [];
    return posts
      .filter((p) => p.aircraftId === aircraftRecord.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [aircraftRecord]);

  const groupedLogbook = useMemo(() => {
    const byYear = new Map<number, Post[]>();
    aircraftPosts.forEach((post) => {
      const year = new Date(post.createdAt).getFullYear();
      byYear.set(year, [...(byYear.get(year) ?? []), post]);
    });
    return Array.from(byYear.entries()).sort((a, b) => b[0] - a[0]);
  }, [aircraftPosts]);

  if (!aircraftRecord) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={['top', 'left', 'right']}>
        <Text style={styles.notFoundText}>Aircraft not found.</Text>
      </SafeAreaView>
    );
  }

  const ownershipRecord = aircraftRecord.ownershipHistory.find((r) => r.endDate === null);
  const ownedSinceYear = ownershipRecord ? new Date(ownershipRecord.startDate).getFullYear() : undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: aircraftRecord.heroPhotoUrl }} style={styles.hero} resizeMode="cover" />
          <Pressable
            onPress={() => router.back()}
            style={[styles.backButton, { top: insets.top + spacing.sm }]}
            hitSlop={8}
          >
            <Icon name="chevron-back" size={22} color={colors.textOnDark} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.registration}>{aircraftRecord.registration}</Text>
          <Text style={styles.subtitle}>
            {aircraftRecord.year} {aircraftRecord.manufacturer} {aircraftRecord.model}
          </Text>

          <View style={styles.ownershipRow}>
            <StatusPill status={aircraftRecord.status} />
            {ownedSinceYear !== undefined && (
              <Text style={styles.ownedSince}>Owned since {ownedSinceYear}</Text>
            )}
          </View>

          <View style={styles.tabsRow}>
            <SegmentedTabs options={TABS} value={tab} onChange={setTab} />
          </View>
          <View style={styles.divider} />

          {tab === 'overview' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Highlights</Text>
              <View style={styles.highlightsRow}>
                <View style={styles.highlightItem}>
                  <StatBlock icon="location-outline" value={aircraftRecord.homeAirport} label="Home Airport" />
                </View>
                <View style={styles.highlightItem}>
                  <StatBlock
                    icon="time-outline"
                    value={formatNumber(aircraftRecord.totalHours)}
                    label="Total Hours"
                  />
                </View>
                <View style={styles.highlightItem}>
                  <StatBlock icon="construct-outline" value={aircraftRecord.engine} label="Engine" />
                </View>
              </View>

              <View style={styles.recentPhotosHeader}>
                <Text style={styles.sectionLabel}>Recent Photos</Text>
                <Pressable onPress={() => setTab('photos')} hitSlop={8}>
                  <Text style={styles.viewAll}>View all</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                {aircraftRecord.photos.slice(0, 4).map((uri) => (
                  <Pressable key={uri} onPress={() => setTab('photos')}>
                    <Image source={{ uri }} style={styles.recentPhoto} resizeMode="cover" />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {tab === 'logbook' && (
            <View style={styles.section}>
              {groupedLogbook.map(([year, yearPosts]) => (
                <View key={year} style={styles.yearGroup}>
                  <Text style={styles.yearLabel}>{year}</Text>
                  {yearPosts.map((post) => (
                    <LogbookEntry
                      key={post.id}
                      post={post}
                      onPress={() => router.push(`/comments/${post.id}`)}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}

          {tab === 'details' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Specifications</Text>
              <SpecRow label="Manufacturer" value={aircraftRecord.manufacturer} />
              <SpecRow label="Model" value={aircraftRecord.model} />
              <SpecRow label="Year" value={String(aircraftRecord.year)} />
              <SpecRow label="Serial Number" value={aircraftRecord.serialNumber} />
              <SpecRow label="Registration" value={aircraftRecord.registration} />
              <SpecRow label="Engine" value={aircraftRecord.engine} />
              <SpecRow label="Horsepower" value={`${aircraftRecord.horsepower} HP`} />
              <SpecRow label="Propeller" value={aircraftRecord.propeller} />
              <SpecRow label="Useful Load" value={`${formatNumber(aircraftRecord.usefulLoad)} lbs`} />
              <SpecRow label="Cruise Speed" value={`${aircraftRecord.cruiseSpeed} KTAS`} />
              <SpecRow label="Range" value={`${formatNumber(aircraftRecord.range)} NM`} />
            </View>
          )}

          {tab === 'photos' && (
            <View style={styles.section}>
              <View style={styles.photoGrid}>
                {aircraftRecord.photos.map((uri) => (
                  <Image key={uri} source={{ uri }} style={styles.gridPhoto} resizeMode="cover" />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  heroWrap: {
    height: HERO_HEIGHT,
    backgroundColor: colors.backgroundDark,
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(11,18,32,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  registration: {
    ...typography.heading,
    fontSize: 28,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  ownershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  ownedSince: {
    ...typography.bodyMuted,
    color: colors.textMuted,
  },
  tabsRow: {
    marginTop: spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  highlightsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  highlightItem: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  recentPhotosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  viewAll: {
    ...typography.bodyMuted,
    fontWeight: '600',
    color: colors.accent,
  },
  photosScroll: {
    marginTop: spacing.md,
  },
  recentPhoto: {
    width: 84,
    height: 84,
    borderRadius: radii.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.border,
  },
  yearGroup: {
    marginBottom: spacing.sm,
  },
  yearLabel: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridPhoto: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
});
