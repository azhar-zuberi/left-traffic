import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, fontFamilies, radii, shadows, spacing, typography } from '@/theme';
import { formatNumber, formatRelativeTime } from '@/utils/format';
import { CATEGORY_LABELS } from '@/utils/postCategories';
import type { Aircraft, Post } from '@/utils/types';

type Props = {
  post: Post;
  aircraft: Aircraft;
  onPress: () => void;
};

export function PostCard({ post, aircraft, onPress }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.header}>
        <Image source={{ uri: aircraft.heroPhotoUrl }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.registration}>{aircraft.registration}</Text>
          <Text style={styles.model}>
            {aircraft.manufacturer} {aircraft.model}
          </Text>
          <Text style={styles.location}>
            {post.location.city}, {post.location.state} ({post.location.airportCode})
          </Text>
        </View>
        <Text style={styles.time}>{formatRelativeTime(post.createdAt)}</Text>
      </View>

      <Image source={{ uri: post.photoUrl }} style={styles.photo} resizeMode="cover" />

      <View style={styles.body}>
        <Text style={styles.category}>{CATEGORY_LABELS[post.category]}</Text>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.caption}>{post.body}</Text>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionItem}
            onPress={(event) => {
              event.stopPropagation();
              setLiked((v) => !v);
            }}
            hitSlop={8}
          >
            <Icon
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? colors.like : colors.textMuted}
            />
            <Text style={styles.actionCount}>{formatNumber(post.likeCount + (liked ? 1 : 0))}</Text>
          </Pressable>

          <Pressable style={styles.actionItem} onPress={onPress} hitSlop={8}>
            <Icon name="chatbubble-outline" size={19} color={colors.textMuted} />
            <Text style={styles.actionCount}>{formatNumber(post.commentCount)}</Text>
          </Pressable>

          <View style={styles.actionsSpacer} />

          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              setSaved((v) => !v);
            }}
            hitSlop={8}
          >
            <Icon name={saved ? 'bookmark' : 'bookmark-outline'} size={19} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const PHOTO_HEIGHT = 200;
const AVATAR_SIZE = 40;

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  headerText: {
    flex: 1,
    gap: 1,
  },
  registration: {
    ...typography.body,
    fontFamily: fontFamilies.body.bold,
    color: colors.textPrimary,
  },
  model: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  location: {
    ...typography.caption,
    color: colors.textMuted,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  photo: {
    width: '100%',
    height: PHOTO_HEIGHT,
    backgroundColor: colors.border,
  },
  body: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  category: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 11,
  },
  title: {
    ...typography.body,
    fontFamily: fontFamilies.body.semibold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  caption: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionCount: {
    ...typography.bodyMuted,
    color: colors.textMuted,
  },
  actionsSpacer: {
    flex: 1,
  },
});
