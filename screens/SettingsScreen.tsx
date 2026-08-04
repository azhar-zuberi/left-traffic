import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/FormField';
import { Icon } from '@/components/Icon';
import { SettingsRow } from '@/components/SettingsRow';
import { useAppData } from '@/hooks/useAppData';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { CURRENT_USER_ID } from '@/utils/types';

export function SettingsScreen() {
  const { users, updateUser } = useAppData();
  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;

  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle);
  const [homeAirport, setHomeAirport] = useState(currentUser.homeAirport);
  const [bio, setBio] = useState(currentUser.bio);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [metricUnits, setMetricUnits] = useState(false);

  const canSave = name.trim().length > 0 && handle.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    updateUser(CURRENT_USER_ID, {
      name: name.trim(),
      handle: handle.trim(),
      homeAirport: homeAirport.trim(),
      bio: bio.trim(),
    });
    router.back();
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
            <Icon name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
          <Pressable onPress={handleSave} hitSlop={8} style={styles.saveButton}>
            <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>Save</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>Profile</Text>
          <View style={styles.formCard}>
            <FormField label="Name" value={name} onChangeText={setName} placeholder="Your name" />
            <FormField label="Handle" value={handle} onChangeText={setHandle} placeholder="handle" autoCapitalize="none" />
            <FormField
              label="Home Airport"
              value={homeAirport}
              onChangeText={setHomeAirport}
              placeholder="KSQL"
              autoCapitalize="characters"
            />
            <FormField label="Bio" value={bio} onChangeText={setBio} placeholder="Tell your story." multiline />
          </View>

          <Text style={styles.sectionLabel}>Preferences</Text>
          <View style={styles.listCard}>
            <SettingsRow
              icon="notifications-outline"
              label="Push Notifications"
              right={
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.surface}
                />
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="mail-outline"
              label="Email Updates"
              right={
                <Switch
                  value={emailUpdates}
                  onValueChange={setEmailUpdates}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.surface}
                />
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="speedometer-outline"
              label="Metric Units"
              right={
                <Switch
                  value={metricUnits}
                  onValueChange={setMetricUnits}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.surface}
                />
              }
            />
          </View>

          <Text style={styles.sectionLabel}>About</Text>
          <View style={styles.listCard}>
            <SettingsRow icon="information-circle-outline" label="Left Traffic" right={<Text style={styles.value}>Prototype</Text>} />
          </View>

          <Pressable
            onPress={() => router.replace('/login')}
            style={({ pressed }) => [styles.listCard, styles.logoutCard, pressed && styles.logoutCardPressed]}
          >
            <SettingsRow icon="log-out-outline" label="Log Out" destructive />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

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
  saveButton: {
    minWidth: 32,
    alignItems: 'flex-end',
  },
  saveText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.accent,
  },
  saveTextDisabled: {
    color: colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  formCard: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  listCard: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    ...shadows.card,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  value: {
    ...typography.bodyMuted,
    color: colors.textMuted,
  },
  logoutCard: {
    marginTop: spacing.xl,
  },
  logoutCardPressed: {
    opacity: 0.85,
  },
});
