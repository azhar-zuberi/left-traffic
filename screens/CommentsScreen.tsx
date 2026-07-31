import { useLocalSearchParams } from 'expo-router';

import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export function CommentsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  return <ScreenPlaceholder title="Comments" description={`Post ${postId}`} />;
}
