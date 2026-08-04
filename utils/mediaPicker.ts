import { Platform } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';

import type { PostMediaType } from '@/utils/types';

export type PickedMedia = {
  mediaType: PostMediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
};

// expo-video-thumbnails has no web implementation (it rejects immediately) —
// video posts on web just skip the poster frame and PostMedia falls back to
// a plain placeholder. Native (iOS/Android) always gets a real thumbnail.
async function extractThumbnail(videoUri: string): Promise<string | undefined> {
  if (Platform.OS === 'web') return undefined;
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: 0 });
    return uri;
  } catch {
    return undefined;
  }
}

async function toPickedMedia(asset: ImagePicker.ImagePickerAsset): Promise<PickedMedia> {
  if (asset.type === 'video') {
    const thumbnailUrl = await extractThumbnail(asset.uri);
    return { mediaType: 'video', mediaUrl: asset.uri, thumbnailUrl };
  }
  return { mediaType: 'photo', mediaUrl: asset.uri };
}

// Library picking works on web (it opens a file input), so no platform guard
// here — only camera capture is unavailable on web.
export async function pickFromLibrary(kind: 'images' | 'videos'): Promise<PickedMedia | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: [kind],
    quality: 0.85,
    videoMaxDuration: 60,
  });
  if (result.canceled || result.assets.length === 0) return null;
  return toPickedMedia(result.assets[0]);
}

export const isCameraAvailable = Platform.OS !== 'web';

export async function captureFromCamera(kind: 'images' | 'videos'): Promise<PickedMedia | null> {
  if (!isCameraAvailable) return null;

  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: [kind],
    quality: 0.85,
    videoMaxDuration: 60,
  });
  if (result.canceled || result.assets.length === 0) return null;
  return toPickedMedia(result.assets[0]);
}
