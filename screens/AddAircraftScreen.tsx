import { router } from 'expo-router';
import { useState } from 'react';
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

import { FormField } from '@/components/FormField';
import { Icon } from '@/components/Icon';
import { StepIndicator, type Step } from '@/components/StepIndicator';
import { useAppData } from '@/hooks/useAppData';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { STOCK_PHOTOS } from '@/utils/stockPhotos';
import { CURRENT_USER_ID, type Aircraft } from '@/utils/types';

type StepKey = 'identify' | 'details' | 'photos' | 'complete';

const STEP_ORDER: StepKey[] = ['identify', 'details', 'photos', 'complete'];

const STEPS: Step[] = [
  { key: 'identify', label: 'Identify', icon: 'person-outline' },
  { key: 'details', label: 'Details', icon: 'options-outline' },
  { key: 'photos', label: 'Photos', icon: 'camera-outline' },
  { key: 'complete', label: 'Complete', icon: 'checkmark-outline' },
];

type Draft = {
  registration: string;
  manufacturer: string;
  model: string;
  year: string;
  serialNumber: string;
  engine: string;
  homeAirport: string;
  photos: string[];
};

const EMPTY_DRAFT: Draft = {
  registration: '',
  manufacturer: '',
  model: '',
  year: '',
  serialNumber: '',
  engine: '',
  homeAirport: '',
  photos: [],
};

export function AddAircraftScreen() {
  const { aircraft, addAircraft } = useAppData();
  const [step, setStep] = useState<StepKey>('identify');
  const [tailInput, setTailInput] = useState('');
  const [lookupState, setLookupState] = useState<'idle' | 'found' | 'not-found'>('idle');
  const [lookupResult, setLookupResult] = useState<Aircraft | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  // Only set when the draft was seeded from a real registry match, so we can
  // reuse its spec fields (horsepower, cruiseSpeed, etc.) that the manual
  // form never collects. Cleared on the manual-entry path so an unrelated
  // earlier lookup can't leak its specs onto a different aircraft.
  const [matchedAircraft, setMatchedAircraft] = useState<Aircraft | null>(null);

  function updateDraft(patch: Partial<Draft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleLookup() {
    const query = tailInput.trim().toUpperCase();
    const match = aircraft.find((a) => a.registration.toUpperCase() === query);
    if (match) {
      setLookupResult(match);
      setLookupState('found');
    } else {
      setLookupResult(null);
      setLookupState('not-found');
    }
  }

  function continueWithLookupResult() {
    if (!lookupResult) return;
    setDraft({
      registration: lookupResult.registration,
      manufacturer: lookupResult.manufacturer,
      model: lookupResult.model,
      year: String(lookupResult.year),
      serialNumber: lookupResult.serialNumber,
      engine: lookupResult.engine,
      homeAirport: lookupResult.homeAirport,
      photos: [],
    });
    setMatchedAircraft(lookupResult);
    setStep('details');
  }

  function continueManually() {
    setDraft({ ...EMPTY_DRAFT, registration: tailInput.trim().toUpperCase() });
    setMatchedAircraft(null);
    setStep('details');
  }

  function handleAddToHangar() {
    const now = new Date().toISOString();
    const record: Aircraft = {
      id: `a-${Date.now()}`,
      registration: draft.registration,
      manufacturer: draft.manufacturer,
      model: draft.model,
      year: Number(draft.year) || 0,
      serialNumber: draft.serialNumber,
      engine: draft.engine,
      horsepower: matchedAircraft?.horsepower ?? 0,
      propeller: matchedAircraft?.propeller ?? '',
      usefulLoad: matchedAircraft?.usefulLoad ?? 0,
      cruiseSpeed: matchedAircraft?.cruiseSpeed ?? 0,
      range: matchedAircraft?.range ?? 0,
      homeAirport: draft.homeAirport,
      totalHours: matchedAircraft?.totalHours ?? 0,
      status: matchedAircraft?.status ?? 'flying',
      heroPhotoUrl: draft.photos[0] ?? STOCK_PHOTOS[0],
      photos: draft.photos,
      currentOwnerId: CURRENT_USER_ID,
      ownershipHistory: [{ userId: CURRENT_USER_ID, startDate: now, endDate: null }],
    };
    addAircraft(record);
    setStep('complete');
  }

  function togglePhoto(url: string) {
    setDraft((prev) => {
      const selected = prev.photos.includes(url);
      return {
        ...prev,
        photos: selected ? prev.photos.filter((p) => p !== url) : [...prev.photos, url],
      };
    });
  }

  function goBack() {
    const index = STEP_ORDER.indexOf(step);
    if (index === 0) {
      router.back();
      return;
    }
    setStep(STEP_ORDER[index - 1]);
  }

  const detailsValid = draft.manufacturer.trim().length > 0 && draft.model.trim().length > 0;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable onPress={goBack} hitSlop={8} style={styles.backButton}>
            <Icon name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Add Aircraft</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.stepIndicatorWrap}>
          <StepIndicator steps={STEPS} activeIndex={STEP_ORDER.indexOf(step)} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {step === 'identify' && (
            <View style={styles.section}>
              <View style={styles.titleGroup}>
                <Text style={styles.heading}>Let&rsquo;s identify your aircraft</Text>
                <Text style={styles.subheading}>Enter your tail number and we&rsquo;ll look it up.</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tail Number</Text>
                <View style={styles.tailInputRow}>
                  <TextInput
                    value={tailInput}
                    onChangeText={(text) => {
                      setTailInput(text);
                      setLookupState('idle');
                    }}
                    placeholder="N739JP"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    style={styles.tailInput}
                  />
                  {tailInput.length > 0 && (
                    <Pressable
                      onPress={() => {
                        setTailInput('');
                        setLookupState('idle');
                      }}
                      hitSlop={8}
                    >
                      <Icon name="close-circle" size={20} color={colors.textMuted} />
                    </Pressable>
                  )}
                </View>
              </View>

              <Pressable
                onPress={handleLookup}
                disabled={tailInput.trim().length === 0}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (pressed || tailInput.trim().length === 0) && styles.primaryButtonDisabled,
                ]}
              >
                <Text style={styles.primaryButtonText}>Lookup Aircraft</Text>
              </Pressable>

              {lookupState === 'found' && lookupResult && (
                <View style={styles.resultSection}>
                  <Text style={styles.fieldLabel}>Lookup Result</Text>
                  <Pressable
                    onPress={continueWithLookupResult}
                    style={({ pressed }) => [styles.resultCard, pressed && styles.resultCardPressed]}
                  >
                    <Image source={{ uri: lookupResult.heroPhotoUrl }} style={styles.resultPhoto} />
                    <View style={styles.resultText}>
                      <Text style={styles.resultTitle}>
                        {lookupResult.year} {lookupResult.manufacturer} {lookupResult.model}
                      </Text>
                      <Text style={styles.resultSubtitle}>Serial Number: {lookupResult.serialNumber}</Text>
                    </View>
                    <Icon name="chevron-forward" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
              )}

              {lookupState === 'not-found' && (
                <View style={styles.resultSection}>
                  <Text style={styles.notFoundText}>
                    We couldn&rsquo;t find &ldquo;{tailInput.trim().toUpperCase()}&rdquo; in the registry.
                  </Text>
                </View>
              )}

              <Pressable onPress={continueManually} hitSlop={8} style={styles.manualLinkWrap}>
                <Text style={styles.manualLink}>Enter details manually</Text>
              </Pressable>
            </View>
          )}

          {step === 'details' && (
            <View style={styles.section}>
              <View style={styles.titleGroup}>
                <Text style={styles.heading}>Tell us about {draft.registration || 'your aircraft'}</Text>
                <Text style={styles.subheading}>Review and fill in what we know.</Text>
              </View>

              <View style={styles.formGroup}>
                <FormField label="Registration" value={draft.registration} editable={false} />
                <FormField
                  label="Manufacturer"
                  value={draft.manufacturer}
                  onChangeText={(text) => updateDraft({ manufacturer: text })}
                  placeholder="Piper"
                />
                <FormField
                  label="Model"
                  value={draft.model}
                  onChangeText={(text) => updateDraft({ model: text })}
                  placeholder="PA-28-181 Archer"
                />
                <FormField
                  label="Year"
                  value={draft.year}
                  onChangeText={(text) => updateDraft({ year: text })}
                  placeholder="1978"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
                <FormField
                  label="Serial Number"
                  value={draft.serialNumber}
                  onChangeText={(text) => updateDraft({ serialNumber: text })}
                  placeholder="28-7890123"
                  autoCapitalize="characters"
                />
                <FormField
                  label="Engine"
                  value={draft.engine}
                  onChangeText={(text) => updateDraft({ engine: text })}
                  placeholder="Lycoming O-360"
                />
                <FormField
                  label="Home Airport"
                  value={draft.homeAirport}
                  onChangeText={(text) => updateDraft({ homeAirport: text })}
                  placeholder="KSQL"
                  autoCapitalize="characters"
                />
              </View>

              <Pressable
                onPress={() => setStep('photos')}
                disabled={!detailsValid}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (pressed || !detailsValid) && styles.primaryButtonDisabled,
                ]}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </Pressable>
            </View>
          )}

          {step === 'photos' && (
            <View style={styles.section}>
              <View style={styles.titleGroup}>
                <Text style={styles.heading}>Add some photos</Text>
                <Text style={styles.subheading}>Choose a few photos of {draft.registration}.</Text>
              </View>

              <View style={styles.photoGrid}>
                {STOCK_PHOTOS.map((url) => {
                  const selected = draft.photos.includes(url);
                  return (
                    <Pressable key={url} onPress={() => togglePhoto(url)} style={styles.photoTile}>
                      <Image source={{ uri: url }} style={styles.photoImage} />
                      <View style={[styles.photoCheck, selected && styles.photoCheckSelected]}>
                        {selected && <Icon name="checkmark" size={14} color={colors.textOnDark} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={handleAddToHangar}
                disabled={draft.photos.length === 0}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (pressed || draft.photos.length === 0) && styles.primaryButtonDisabled,
                ]}
              >
                <Text style={styles.primaryButtonText}>Add to Hangar</Text>
              </Pressable>
            </View>
          )}

          {step === 'complete' && (
            <View style={styles.completeSection}>
              <View style={styles.successIcon}>
                <Icon name="checkmark" size={32} color={colors.textOnDark} />
              </View>
              {draft.photos[0] && <Image source={{ uri: draft.photos[0] }} style={styles.completePhoto} />}
              <Text style={styles.completeTitle}>{draft.registration} added to your hangar</Text>
              <Text style={styles.completeSubtitle}>
                {draft.year} {draft.manufacturer} {draft.model}
              </Text>

              <Pressable onPress={() => router.back()} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Done</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const RESULT_PHOTO_SIZE = 56;
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
  headerSpacer: {
    width: 32,
  },
  stepIndicatorWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    gap: spacing.lg,
  },
  titleGroup: {
    gap: spacing.xs,
  },
  heading: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  tailInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  tailInput: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.backgroundDark,
    borderRadius: radii.card,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.4,
  },
  primaryButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  resultSection: {
    gap: spacing.sm,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  resultCardPressed: {
    opacity: 0.85,
  },
  resultPhoto: {
    width: RESULT_PHOTO_SIZE,
    height: RESULT_PHOTO_SIZE,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  resultText: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  resultTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  manualLinkWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  manualLink: {
    ...typography.bodyMuted,
    fontWeight: '600',
    color: colors.accent,
  },
  formGroup: {
    gap: spacing.md,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoTile: {
    width: '31.5%',
    aspectRatio: 1,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  photoCheck: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.textOnDark,
    backgroundColor: 'rgba(11,18,32,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCheckSelected: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.backgroundDark,
  },
  completeSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
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
