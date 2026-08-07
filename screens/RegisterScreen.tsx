import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/FormField';
import { Icon } from '@/components/Icon';
import { SegmentedTabs } from '@/components/SegmentedTabs';
import { colors, radii, spacing, typography } from '@/theme';

type Mode = 'login' | 'signup';

const MODES: { key: Mode; label: string }[] = [
  { key: 'login', label: 'Log In' },
  { key: 'signup', label: 'Sign Up' },
];

const COPY: Record<Mode, { heading: string; subheading: string; button: string }> = {
  login: {
    heading: 'Welcome back',
    subheading: 'Log in with your email to continue.',
    button: 'Log In',
  },
  signup: {
    heading: 'Create your account',
    subheading: "You'll be flying in under a minute.",
    button: 'Create Account',
  },
};

export function RegisterScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const copy = COPY[mode];
  const canSubmit = email.trim().includes('@') && password.length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    router.replace('/(tabs)');
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
          <Text style={styles.headerTitle}>Welcome</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.tabsWrap}>
          <SegmentedTabs options={MODES} value={mode} onChange={setMode} />
        </View>

        <View style={styles.section}>
          <View style={styles.titleGroup}>
            <Text style={styles.heading}>{copy.heading}</Text>
            <Text style={styles.subheading}>{copy.subheading}</Text>
          </View>

          <View style={styles.formGroup}>
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              autoCapitalize="none"
              secureTextEntry
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.primaryButton,
              (pressed || !canSubmit) && styles.primaryButtonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>{copy.button}</Text>
          </Pressable>

          <Text style={styles.legalText}>
            By continuing, you agree to Left Traffic&rsquo;s Terms and Privacy Policy.
          </Text>
        </View>
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
    paddingBottom: spacing.lg,
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
  tabsWrap: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.lg,
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
  formGroup: {
    gap: spacing.md,
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
  legalText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
