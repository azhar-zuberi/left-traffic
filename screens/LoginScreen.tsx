import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { colors, radii, spacing, typography } from '@/theme';

const HERO_PHOTO = require('@/assets/images/splash2.jpg');

function enterApp() {
  router.replace('/(tabs)');
}

export function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={HERO_PHOTO}
        style={[StyleSheet.absoluteFill, styles.heroImage]}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(11,18,32,0.5)', colors.backgroundDark]}
        locations={[0, 0.55, 0.88]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.brandBlock}>
          <Icon name="airplane" size={30} color={colors.textPrimary} style={styles.brandIcon} />
          <Text style={styles.wordmark}>Left{'\n'}Traffic</Text>
          <Text style={styles.tagline}>A home for every aircraft you love.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={enterApp}
            style={({ pressed }) => [styles.googleButton, pressed && styles.buttonPressed]}
          >
            <Ionicons name="logo-google" size={18} color={colors.textOnDark} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>

          <Pressable
            onPress={enterApp}
            style={({ pressed }) => [styles.appleButton, pressed && styles.buttonPressed]}
          >
            <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/register')} hitSlop={8} style={styles.moreOptions}>
            <Text style={styles.moreOptionsText}>More options</Text>
          </Pressable>

          <View style={styles.footerDivider}>
            <View style={styles.dividerLine} />
            <Icon name="ribbon-outline" size={16} color={colors.textOnDarkMuted} />
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.footerText}>Built by pilots. For pilots.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '112%',
    top: '-20%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  brandIcon: {
    marginBottom: spacing.sm,
  },
  wordmark: {
    ...typography.screenTitle,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: 3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
  },
  googleButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
  },
  appleButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  moreOptions: {
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  moreOptionsText: {
    ...typography.bodyMuted,
    fontWeight: '600',
    color: colors.textOnDark,
    textDecorationLine: 'underline',
  },
  footerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.textOnDarkMuted,
  },
  footerText: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
