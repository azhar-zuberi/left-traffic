import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radii, spacing, typography } from '@/theme';

export type ActionSheetOption = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  options: ActionSheetOption[];
};

// Cross-platform stand-in for ActionSheetIOS/Alert.alert — Alert.alert is a
// no-op on react-native-web and ActionSheetIOS only exists on iOS, so neither
// works when this app is tested in a browser. Modal is properly implemented
// across iOS, Android, and web, so it's the one path that actually works everywhere.
export function ActionSheet({ visible, onClose, title, message, options }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <Pressable onPress={(event) => event.stopPropagation()}>
            <View style={styles.card}>
              {(title || message) && (
                <View style={styles.header}>
                  {title && <Text style={styles.title}>{title}</Text>}
                  {message && <Text style={styles.message}>{message}</Text>}
                </View>
              )}
              {(title || message) && options.length > 0 && <View style={styles.divider} />}
              {options.map((option, index) => (
                <View key={option.label}>
                  {index > 0 && <View style={styles.divider} />}
                  <Pressable
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                    onPress={() => {
                      onClose();
                      option.onPress();
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        option.destructive && styles.optionTextDestructive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.cancelCard,
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,18,32,0.45)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMuted,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  option: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  optionPressed: {
    backgroundColor: colors.background,
  },
  optionText: {
    ...typography.body,
    fontSize: 17,
    color: colors.accent,
  },
  optionTextDestructive: {
    color: colors.like,
  },
  cancelCard: {
    marginTop: spacing.sm,
  },
  cancelText: {
    ...typography.body,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
