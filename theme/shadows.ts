import { Platform } from 'react-native';

// Minimal shadows (docs/DESIGN_SYSTEM.md) — one subtle card elevation, used sparingly.
export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#003366',
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
} as const;
