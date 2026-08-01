import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import { formatRelativeTime } from '@/utils/format';
import type { ActivityType } from '@/utils/types';

type Props = {
  type: ActivityType;
  avatarUrl: string;
  actorName: string;
  createdAt: string;
  onPress?: () => void;
};

const TYPE_META: Record<
  ActivityType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; verb: string }
> = {
  like: { icon: 'heart', color: colors.like, verb: 'liked your post' },
  comment: { icon: 'chatbubble', color: colors.accent, verb: 'commented on your post' },
  follow: { icon: 'person-add', color: colors.tint, verb: 'started following you' },
};

export function ActivityRow({ type, avatarUrl, actorName, createdAt, onPress }: Props) {
  const meta = TYPE_META[type];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.rowPressed]}
    >
      <View style={styles.avatarWrap}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={[styles.badge, { backgroundColor: meta.color }]}>
          <Ionicons name={meta.icon} size={10} color={colors.textOnDark} />
        </View>
      </View>

      <Text style={styles.text}>
        <Text style={styles.actorName}>{actorName}</Text> {meta.verb}
      </Text>

      <Text style={styles.time}>{formatRelativeTime(createdAt)}</Text>
    </Pressable>
  );
}

const AVATAR_SIZE = 44;
const BADGE_SIZE = 18;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    opacity: 0.7,
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  text: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
  },
  actorName: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
