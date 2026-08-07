import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionSheet, type ActionSheetOption } from '@/components/ActionSheet';
import { Icon, type IconName } from '@/components/Icon';
import { useAppData } from '@/hooks/useAppData';
import { colors, radii, spacing, typography } from '@/theme';
import {
  captureFromCamera,
  isCameraAvailable,
  pickFromLibrary,
  type PickedMedia,
} from '@/utils/mediaPicker';
import { CATEGORY_LABELS, POST_CATEGORIES } from '@/utils/postCategories';
import {
  CURRENT_USER_ID,
  type Post,
  type PostCategory,
  type PostLocation,
  type PostMediaType,
} from '@/utils/types';

type ExpandedField = 'category' | 'location' | 'aircraft' | null;
type MediaSheetMode = 'full' | 'camera' | null;

// Derives a short headline from the caption's first line since the compose
// flow only collects one free-text field, not a separate title.
function deriveTitle(caption: string): string {
  const firstLine = caption.trim().split('\n')[0];
  return firstLine.length > 60 ? `${firstLine.slice(0, 57)}…` : firstLine;
}

export function NewPostScreen() {
  const { postId } = useLocalSearchParams<{ postId?: string }>();
  const { aircraft, posts, users, addPost, updatePost } = useAppData();
  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;
  const myAircraft = aircraft.filter((a) => a.currentOwnerId === CURRENT_USER_ID);
  const editingPost = postId ? posts.find((p) => p.id === postId) : undefined;

  const LOCATIONS = useMemo<PostLocation[]>(
    () => Array.from(new Map(posts.map((p) => [p.location.airportCode, p.location])).values()),
    [posts],
  );
  const DEFAULT_LOCATION = useMemo(
    () => LOCATIONS.find((l) => l.airportCode === currentUser.homeAirport) ?? LOCATIONS[0],
    [LOCATIONS, currentUser.homeAirport],
  );

  const [caption, setCaption] = useState(editingPost?.body ?? '');
  const [category, setCategory] = useState<PostCategory | null>(editingPost?.category ?? null);
  const [location, setLocation] = useState<PostLocation>(editingPost?.location ?? DEFAULT_LOCATION);
  const [taggedAircraftId, setTaggedAircraftId] = useState(
    editingPost?.aircraftId ?? myAircraft[0]?.id ?? '',
  );
  const [mediaType, setMediaType] = useState<PostMediaType>(editingPost?.mediaType ?? 'photo');
  const [mediaUrl, setMediaUrl] = useState(editingPost?.mediaUrl ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(editingPost?.thumbnailUrl);
  const [mediaSheetMode, setMediaSheetMode] = useState<MediaSheetMode>(null);
  const [expanded, setExpanded] = useState<ExpandedField>(null);
  const [posted, setPosted] = useState(false);

  const taggedAircraft = aircraft.find((a) => a.id === taggedAircraftId);
  const canPost = caption.trim().length > 0 && category !== null && mediaUrl.length > 0;

  function toggle(field: ExpandedField) {
    setExpanded((prev) => (prev === field ? null : field));
  }

  function applyPickedMedia(picked: PickedMedia | null) {
    if (!picked) return;
    setMediaType(picked.mediaType);
    setMediaUrl(picked.mediaUrl);
    setThumbnailUrl(picked.thumbnailUrl);
  }

  async function handleChoosePhoto() {
    applyPickedMedia(await pickFromLibrary('images'));
  }

  async function handleChooseVideo() {
    applyPickedMedia(await pickFromLibrary('videos'));
  }

  async function handleTakePhoto() {
    applyPickedMedia(await captureFromCamera('images'));
  }

  async function handleRecordVideo() {
    applyPickedMedia(await captureFromCamera('videos'));
  }

  const cameraOptions: ActionSheetOption[] = [
    { label: 'Take Photo', onPress: handleTakePhoto },
    { label: 'Record Video', onPress: handleRecordVideo },
  ];
  const mediaSheetOptions: ActionSheetOption[] = [
    ...(isCameraAvailable ? cameraOptions : []),
    { label: 'Choose Photo from Library', onPress: handleChoosePhoto },
    { label: 'Choose Video from Library', onPress: handleChooseVideo },
  ];

  function handleSubmit() {
    if (!canPost || !category) return;

    if (editingPost) {
      updatePost(editingPost.id, {
        category,
        title: deriveTitle(caption),
        body: caption.trim(),
        location,
        aircraftId: taggedAircraftId,
        mediaType,
        mediaUrl,
        thumbnailUrl,
      });
      router.back();
      return;
    }

    const post: Post = {
      id: `p-${Date.now()}`,
      aircraftId: taggedAircraftId,
      authorId: CURRENT_USER_ID,
      category,
      title: deriveTitle(caption),
      body: caption.trim(),
      location,
      createdAt: new Date().toISOString(),
      mediaType,
      mediaUrl,
      thumbnailUrl,
      likeCount: 0,
      commentCount: 0,
    };
    addPost(post);
    setPosted(true);
  }

  if (posted) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.completeSection}>
          <View style={styles.successIcon}>
            <Icon name="checkmark" size={32} color={colors.textOnDark} />
          </View>
          {mediaType === 'video' ? (
            <View style={[styles.completePhoto, styles.completeVideo]}>
              {thumbnailUrl && (
                <Image
                  source={{ uri: thumbnailUrl }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
              )}
              <Icon name="play-circle-outline" size={36} color={colors.textOnDark} />
            </View>
          ) : (
            <Image source={{ uri: mediaUrl }} style={styles.completePhoto} />
          )}
          <Text style={styles.completeTitle}>Added to the Flightline</Text>
          <Text style={styles.completeSubtitle}>
            {taggedAircraft?.registration}
            {category ? ` · ${CATEGORY_LABELS[category]}` : ''}
          </Text>
          <Pressable onPress={() => router.back()} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
            <Icon name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>{editingPost ? 'Edit Post' : 'New Post'}</Text>
          <Pressable onPress={handleSubmit} hitSlop={8} style={styles.nextButton}>
            <Text style={[styles.nextText, !canPost && styles.nextTextDisabled]}>
              {editingPost ? 'Save' : 'Next'}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroWrap}>
            {mediaUrl ? (
              <>
                {mediaType === 'video' ? (
                  <View style={styles.heroVideo}>
                    {thumbnailUrl && (
                      <Image
                        source={{ uri: thumbnailUrl }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="cover"
                      />
                    )}
                    <Icon name="play-circle-outline" size={48} color={colors.textOnDark} />
                  </View>
                ) : (
                  <Image source={{ uri: mediaUrl }} style={styles.hero} resizeMode="cover" />
                )}
                <Pressable
                  onPress={() => setMediaSheetMode('full')}
                  style={({ pressed }) => [styles.editPill, pressed && styles.editPillPressed]}
                >
                  <Icon name="image-outline" size={14} color={colors.textOnDark} />
                  <Text style={styles.editPillText}>Edit</Text>
                </Pressable>
              </>
            ) : (
              <Pressable style={styles.heroEmpty} onPress={() => setMediaSheetMode('full')}>
                <Icon name="camera-outline" size={26} color={colors.textMuted} />
                <Text style={styles.heroEmptyText}>Add a photo or video</Text>
              </Pressable>
            )}
          </View>

          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Share your story..."
            placeholderTextColor={colors.textMuted}
            multiline
            style={styles.caption}
          />

          <View style={styles.divider} />

          <PickerRow
            icon="bookmark-outline"
            label="Add to Logbook"
            value={category ? CATEGORY_LABELS[category] : 'Choose a category'}
            expanded={expanded === 'category'}
            onToggle={() => toggle('category')}
          >
            <View style={styles.chipRow}>
              {POST_CATEGORIES.map((key) => {
                const selected = category === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      setCategory(key);
                      setExpanded(null);
                    }}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {CATEGORY_LABELS[key]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </PickerRow>

          <View style={styles.divider} />

          <PickerRow
            icon="location-outline"
            label="Add Location"
            value={`${location.city}, ${location.state}`}
            expanded={expanded === 'location'}
            onToggle={() => toggle('location')}
          >
            {LOCATIONS.map((loc) => (
              <Pressable
                key={loc.airportCode}
                onPress={() => {
                  setLocation(loc);
                  setExpanded(null);
                }}
                style={styles.listOption}
              >
                <Text style={styles.listOptionText}>
                  {loc.city}, {loc.state} ({loc.airportCode})
                </Text>
                {loc.airportCode === location.airportCode && (
                  <Icon name="checkmark" size={16} color={colors.accent} />
                )}
              </Pressable>
            ))}
          </PickerRow>

          <View style={styles.divider} />

          <PickerRow
            icon="pricetag-outline"
            label="Tag Aircraft"
            value={taggedAircraft?.registration ?? 'Select aircraft'}
            expanded={expanded === 'aircraft'}
            onToggle={() => toggle('aircraft')}
          >
            {myAircraft.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => {
                  setTaggedAircraftId(a.id);
                  setExpanded(null);
                }}
                style={styles.listOption}
              >
                <Image source={{ uri: a.heroPhotoUrl }} style={styles.listOptionThumb} />
                <Text style={styles.listOptionText}>
                  {a.registration} · {a.manufacturer} {a.model}
                </Text>
                {a.id === taggedAircraftId && (
                  <Icon name="checkmark" size={16} color={colors.accent} />
                )}
              </Pressable>
            ))}
          </PickerRow>

          <View style={styles.divider} />

          <View style={styles.mediaRow}>
            <Pressable onPress={handleChoosePhoto} hitSlop={8}>
              <Icon name="image-outline" size={22} color={colors.textSecondary} />
            </Pressable>
            <Pressable onPress={handleChooseVideo} hitSlop={8}>
              <Icon name="play-circle-outline" size={22} color={colors.textSecondary} />
            </Pressable>
            {isCameraAvailable && (
              <Pressable onPress={() => setMediaSheetMode('camera')} hitSlop={8}>
                <Icon name="camera-outline" size={22} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <ActionSheet
        visible={mediaSheetMode !== null}
        onClose={() => setMediaSheetMode(null)}
        title="Add Media"
        options={mediaSheetMode === 'camera' ? cameraOptions : mediaSheetOptions}
      />
    </KeyboardAvoidingView>
  );
}

type PickerRowProps = {
  icon: IconName;
  label: string;
  value: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
};

function PickerRow({ icon, label, value, expanded, onToggle, children }: PickerRowProps) {
  return (
    <View>
      <Pressable onPress={onToggle} style={styles.pickerRow}>
        <Icon name={icon} size={18} color={colors.textSecondary} />
        <Text style={styles.pickerLabel}>{label}</Text>
        <Text style={styles.pickerValue} numberOfLines={1}>
          {value}
        </Text>
        <Icon
          name={expanded ? 'chevron-down' : 'chevron-forward'}
          size={16}
          color={colors.textMuted}
        />
      </Pressable>
      {expanded && <View style={styles.pickerExpanded}>{children}</View>}
    </View>
  );
}

const HERO_HEIGHT = 220;
const COMPLETE_ICON_SIZE = 64;
const COMPLETE_PHOTO_HEIGHT = 180;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
  nextButton: {
    minWidth: 32,
    alignItems: 'flex-end',
  },
  nextText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.accent,
  },
  nextTextDisabled: {
    color: colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroWrap: {
    height: HERO_HEIGHT,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  heroVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmpty: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
  },
  heroEmptyText: {
    ...typography.bodyMuted,
    color: colors.textMuted,
  },
  editPill: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(11,18,32,0.55)',
  },
  editPillPressed: {
    opacity: 0.8,
  },
  editPillText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textOnDark,
  },
  caption: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 44,
    marginTop: spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  pickerLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  pickerValue: {
    ...typography.bodyMuted,
    color: colors.textMuted,
    maxWidth: 140,
  },
  pickerExpanded: {
    marginTop: spacing.md,
    marginLeft: spacing.xl + spacing.xs,
    gap: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.backgroundDark,
  },
  chipText: {
    ...typography.bodyMuted,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.textOnDark,
    fontWeight: '600',
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  listOptionThumb: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  listOptionText: {
    ...typography.bodyMuted,
    color: colors.textSecondary,
    flex: 1,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.backgroundDark,
    borderRadius: radii.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  completeSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  successIcon: {
    width: COMPLETE_ICON_SIZE,
    height: COMPLETE_ICON_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  completePhoto: {
    width: '100%',
    height: COMPLETE_PHOTO_HEIGHT,
    borderRadius: radii.card,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  completeVideo: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  completeSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});
