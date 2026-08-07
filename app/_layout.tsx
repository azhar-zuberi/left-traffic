// Bare side-effect imports, required at the top of the entry tree by
// react-native-gesture-handler and react-native-reanimated. This duplicates the
// named GestureHandlerRootView import below on purpose — the side effect has to
// run before anything else, so don't "clean this up" by merging the two.
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Stack } from 'expo-router';
// eslint-disable-next-line import/no-duplicates -- see the side-effect import above
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppDataProvider } from '@/hooks/useAppData';
import { colors } from '@/theme';

// No authentication in this prototype (docs/left-traffic-front-end-prototype.md) —
// Login is just the launch screen on native, not an enforced gate. Its "Continue" actions
// will navigate straight into (tabs) once built. `(tabs)/index` legitimately owns "/", so
// there is no separate root index.tsx redirecting there.
export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppDataProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="register" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="aircraft/[aircraftId]" />
            <Stack.Screen name="comments/[postId]" options={{ presentation: 'card' }} />
            <Stack.Screen name="add-aircraft" options={{ presentation: 'modal' }} />
            <Stack.Screen name="edit-aircraft" options={{ presentation: 'modal' }} />
            <Stack.Screen name="new-post" options={{ presentation: 'modal' }} />
            <Stack.Screen name="settings" />
          </Stack>
        </AppDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
