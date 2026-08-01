import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, radii } from '@/theme';

// Center "+" tab bar button. Its parent Tabs.Screen intercepts tabPress and
// navigates to the New Post modal, so this never actually renders active tab content.
export function FabTabButton({ onPress }: { onPress?: (event: GestureResponderEvent) => void }) {
  return (
    <Pressable onPress={onPress} style={styles.button} hitSlop={8}>
      <Icon name="add" size={28} color={colors.textOnDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: -8,
  },
});
