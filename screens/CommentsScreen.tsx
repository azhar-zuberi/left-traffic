import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommentRow } from '@/components/CommentRow';
import { PostCard } from '@/components/PostCard';
import { colors, radii, spacing, typography } from '@/theme';
import { aircraft, comments, posts, users } from '@/utils/sampleData';
import { CURRENT_USER_ID, type Comment } from '@/utils/types';

const usersById = new Map(users.map((u) => [u.id, u]));
const aircraftById = new Map(aircraft.map((a) => [a.id, a]));
const currentUser = usersById.get(CURRENT_USER_ID)!;

export function CommentsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [draftComments, setDraftComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  const post = posts.find((p) => p.id === postId);
  const postAircraft = post ? aircraftById.get(post.aircraftId) : undefined;

  const thread = useMemo(() => {
    return [...comments.filter((c) => c.postId === postId), ...draftComments].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [postId, draftComments]);

  if (!post || !postAircraft) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={['top', 'left', 'right']}>
        <Text style={styles.notFoundText}>Post not found.</Text>
      </SafeAreaView>
    );
  }

  function handleSend() {
    const body = commentText.trim();
    if (!body || !post) return;
    setDraftComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        postId: post.id,
        authorId: CURRENT_USER_ID,
        body,
        createdAt: new Date().toISOString(),
        likeCount: 0,
      },
    ]);
    setCommentText('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? spacing.xxxl : 0}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Comments</Text>
          <View style={styles.headerSpacer} />
        </View>

        <FlashList<Comment>
          data={thread}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.postWrap}>
              <PostCard post={post} aircraft={postAircraft} onPress={() => {}} />
              <Text style={styles.threadLabel}>
                {thread.length === 0 ? 'No comments yet' : `${thread.length} Comments`}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const author = usersById.get(item.authorId);
            if (!author) return null;
            return <CommentRow comment={item} author={author} />;
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <View style={styles.inputBar}>
          <Image source={{ uri: currentUser.avatarUrl }} style={styles.inputAvatar} />
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={handleSend}
            disabled={!commentText.trim()}
            hitSlop={8}
            style={styles.sendButton}
          >
            <Ionicons
              name="arrow-up-circle"
              size={30}
              color={commentText.trim() ? colors.accent : colors.textMuted}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const AVATAR_SIZE = 32;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 32,
  },
  headerTitle: {
    ...typography.screenTitle,
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  postWrap: {
    marginBottom: spacing.md,
  },
  threadLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  separator: {
    height: spacing.xs,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  inputAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingVertical: spacing.xs,
  },
  sendButton: {
    paddingBottom: spacing.xs / 2,
  },
});
