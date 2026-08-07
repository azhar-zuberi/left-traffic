import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';

type Props = {
  title: string;
  description: string;
  dark?: boolean;
};

// Temporary stand-in for every route until each screen gets its real design.
// Milestone 1 is scaffold-only — see docs/left-traffic-front-end-prototype.md.
export function ScreenPlaceholder({ title, description, dark = false }: Props) {
  return (
    <SafeAreaView
      style={[styles.container, dark ? styles.containerDark : styles.containerLight]}
      edges={['top', 'left', 'right']}
    >
      <Text style={[styles.title, dark ? styles.textOnDark : styles.textPrimary]}>{title}</Text>
      <Text style={[styles.description, dark ? styles.textOnDarkMuted : styles.textSecondary]}>
        {description}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  containerLight: {
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: colors.backgroundDark,
  },
  title: {
    ...typography.screenTitle,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    textAlign: 'center',
  },
  textPrimary: {
    color: colors.textPrimary,
  },
  textSecondary: {
    color: colors.textSecondary,
  },
  textOnDark: {
    color: colors.textOnDark,
  },
  textOnDarkMuted: {
    color: colors.textOnDarkMuted,
  },
});
