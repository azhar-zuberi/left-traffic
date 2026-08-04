import { useState } from 'react';
import { Image, Pressable, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';

import { Icon } from '@/components/Icon';
import { VideoPlayerModal } from '@/components/VideoPlayerModal';
import { colors, radii } from '@/theme';
import type { Post } from '@/utils/types';

type Props = {
  post: Post;
  style: StyleProp<ImageStyle>;
  // Grid/list contexts (Profile grid, Logbook rows) sit inside their own
  // Pressable that navigates to the post — there, the play badge is just a
  // visual cue and this renders inert. The main feed and post-detail cards
  // pass interactive (the default) so tapping a video opens playback instead
  // of falling through to the card's own onPress.
  interactive?: boolean;
  playBadgeSize?: number;
};

export function PostMedia({ post, style, interactive = true, playBadgeSize = 36 }: Props) {
  const [playerVisible, setPlayerVisible] = useState(false);

  // Treat anything other than an explicit 'video' as a photo, rather than
  // requiring mediaType === 'photo'. Photo is the fallback, video is the
  // opt-in case — so stale/partial post data (e.g. cached from before the
  // mediaType field existed) renders as an image instead of silently
  // dropping into the video placeholder for every post.
  if (post.mediaType !== 'video') {
    return <Image source={{ uri: post.mediaUrl }} style={style} resizeMode="cover" />;
  }

  const thumbnail = (
    <View style={[style, styles.videoBox]}>
      {post.thumbnailUrl ? (
        <Image source={{ uri: post.thumbnailUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.videoFallback]} />
      )}
      <View style={styles.playBadge}>
        <Icon name="play-circle-outline" size={playBadgeSize} color={colors.textOnDark} />
      </View>
    </View>
  );

  if (!interactive) {
    return thumbnail;
  }

  return (
    <>
      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          setPlayerVisible(true);
        }}
      >
        {thumbnail}
      </Pressable>
      <VideoPlayerModal visible={playerVisible} uri={post.mediaUrl} onClose={() => setPlayerVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  videoBox: {
    overflow: 'hidden',
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoFallback: {
    backgroundColor: colors.backgroundDark,
  },
  playBadge: {
    borderRadius: radii.pill,
  },
});
