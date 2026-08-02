import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { colors, spacing } from '@/theme';

type Props = {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
};

// Full-screen playback for video posts. A single modal instance is reused by
// PostMedia rather than navigating to a dedicated route — video posts don't
// need deep links or back-stack entries, just a tap-to-watch overlay.
export function VideoPlayerModal({ visible, uri, onClose }: Props) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });

  useEffect(() => {
    if (!visible) return;
    if (status === 'readyToPlay') {
      player.play();
    }
  }, [visible, status, player]);

  useEffect(() => {
    if (!visible) {
      player.pause();
    }
  }, [visible, player]);

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} transparent={false}>
      <View style={styles.container}>
        <VideoView player={player} style={styles.video} nativeControls contentFit="contain" />
        <SafeAreaView style={styles.closeWrap} edges={['top', 'right']}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
            <Icon name="close-circle" size={30} color={colors.textOnDark} />
          </Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
  },
  closeWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  closeButton: {
    padding: spacing.md,
  },
});
