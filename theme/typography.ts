import { type TextStyle } from 'react-native';

// Space Grotesk carries the display/heading tokens — its geometric, slightly technical
// character suits the wide-tracked uppercase screen titles and reads closer to an
// instrument face than a consumer-app font. Inter (Linear's own typeface, one of the
// documented inspirations) carries body/label/caption for calm, highly legible small text.
// Both loaded via @expo-google-fonts in app/_layout.tsx.
const displayFamily = {
  medium: 'SpaceGrotesk_500Medium',
  semibold: 'SpaceGrotesk_600SemiBold',
  bold: 'SpaceGrotesk_700Bold',
};

const bodyFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// Static Google Fonts weight files don't respond to a separate `fontWeight` style —
// each weight is its own named font. Anywhere text needs to look bolder than its
// typography token, override `fontFamily` with one of these instead of `fontWeight`.
export const fontFamilies = {
  display: displayFamily,
  body: bodyFamily,
};

export const typography = {
  screenTitle: {
    fontFamily: displayFamily.bold,
    fontSize: 20,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  } as TextStyle,

  displayLarge: {
    fontFamily: displayFamily.semibold,
    fontSize: 32,
    letterSpacing: 0.2,
  } as TextStyle,

  heading: {
    fontFamily: displayFamily.semibold,
    fontSize: 22,
    letterSpacing: 0.2,
  } as TextStyle,

  subheading: {
    fontFamily: displayFamily.medium,
    fontSize: 17,
    letterSpacing: 0.1,
  } as TextStyle,

  body: {
    fontFamily: bodyFamily.regular,
    fontSize: 15,
    letterSpacing: 0.1,
  } as TextStyle,

  bodyMuted: {
    fontFamily: bodyFamily.regular,
    fontSize: 14,
    letterSpacing: 0.1,
  } as TextStyle,

  label: {
    fontFamily: bodyFamily.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,

  caption: {
    fontFamily: bodyFamily.regular,
    fontSize: 12,
    letterSpacing: 0.1,
  } as TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
