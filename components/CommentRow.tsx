import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import { formatNumber, formatRelativeTime } from '@/utils/format';
import type { Comment, User } from '@/utils/types';

type Props = {
  comment: Comment;
  author: User;
};

export function CommentRow({ comment, author }: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.row}>
      <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
      <View style={styles.body}>
        <View style={styles.headerLine}>
          <Text style={styles.name}>{author.name}</Text>
          <Text style={styles.time}>{formatRelativeTime(comment.createdAt)}</Text>
        </View>
        <Text style={styles.text}>{comment.body}</Text>
        <Pressable style={styles.likeButton} onPress={() => setLiked((v) => !v)} hitSlop={8}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={14}
            color={liked ? colors.like : colors.textMuted}
          />
          <Text style={styles.likeCount}>{formatNumber(comment.likeCount + (liked ? 1 : 0))}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 36;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  body: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    marginTop: spacing.xs / 2,
  },
  likeCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
