import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import { formatLogbookDate } from '@/utils/format';
import type { Post } from '@/utils/types';

type Props = {
  post: Post;
  onPress: () => void;
};

export function LogbookEntry({ post, onPress }: Props) {
  const { month, day } = formatLogbookDate(post.createdAt);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.dateColumn}>
        <Text style={styles.month}>{month}</Text>
        <Text style={styles.day}>{day}</Text>
      </View>

      <View style={styles.rail}>
        <View style={styles.dot} />
        <View style={styles.line} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.snippet} numberOfLines={2}>
          {post.body}
        </Text>
      </View>

      <Image source={{ uri: post.photoUrl }} style={styles.thumbnail} resizeMode="cover" />
    </Pressable>
  );
}

const THUMBNAIL_SIZE = 48;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  rowPressed: {
    opacity: 0.7,
  },
  dateColumn: {
    width: 34,
    alignItems: 'center',
  },
  month: {
    ...typography.caption,
    color: colors.textMuted,
  },
  day: {
    ...typography.subheading,
    fontSize: 15,
    color: colors.textPrimary,
  },
  rail: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  line: {
    flex: 1,
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  body: {
    flex: 1,
    gap: spacing.xs / 2,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  snippet: {
    ...typography.bodyMuted,
    color: colors.textSecondary,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
});
