import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionSheet } from '@/components/ActionSheet';
import { Icon } from '@/components/Icon';
import { useAppData } from '@/hooks/useAppData';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { formatNumber, formatRelativeTime } from '@/utils/format';
import { CATEGORY_LABELS } from '@/utils/postCategories';
import { CURRENT_USER_ID, type Aircraft, type Post } from '@/utils/types';

type Props = {
  post: Post;
  aircraft: Aircraft;
  onPress: () => void;
  // Called after this post is deleted, so a screen showing only this one
  // post (Comments) can navigate away instead of hitting "Post not found."
  onDeleted?: () => void;
};

export function PostCard({ post, aircraft, onPress, onDeleted }: Props) {
  const { isPostLiked, togglePostLike, deletePost } = useAppData();
  const liked = isPostLiked(post.id);
  // Bookmark/save is known inert cleanup (docs/MVP_SCOPE.md) — no save
  // feature exists yet, so it stays local-only.
  const [saved, setSaved] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const isOwner = post.authorId === CURRENT_USER_ID;

  function handleEdit() {
    router.push({ pathname: '/new-post', params: { postId: post.id } });
  }

  function handleDelete() {
    deletePost(post.id);
    onDeleted?.();
  }

  return (
    <>
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
                togglePostLike(post.id);
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

            {isOwner && (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  setMenuVisible(true);
                }}
                hitSlop={8}
              >
                <Icon name="ellipsis-horizontal" size={19} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>

      <ActionSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        options={[
          { label: 'Edit Post', onPress: handleEdit },
          { label: 'Delete Post', destructive: true, onPress: () => setConfirmVisible(true) },
        ]}
      />
      <ActionSheet
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        title="Delete post?"
        message="This can't be undone."
        options={[{ label: 'Delete', destructive: true, onPress: handleDelete }]}
      />
    </>
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
    fontWeight: '700',
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
    fontWeight: '600',
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
