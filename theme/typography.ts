import { Platform, type TextStyle } from 'react-native';

// No custom typeface is loaded yet — system font (San Francisco / Roboto) stands in
// until a type choice is made in a later design milestone. The editorial, wide-tracked
// all-caps screen titles from the look-and-feel reference (MY HANGAR, FLIGHTLINE, ...)
// are achieved here with letterSpacing + weight rather than a font family.
const fontFamily = Platform.select({ ios: undefined, android: undefined, default: undefined });

export const typography = {
  screenTitle: {
    fontFamily,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  } as TextStyle,

  displayLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 0.2,
  } as TextStyle,

  heading: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.2,
  } as TextStyle,

  subheading: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  } as TextStyle,

  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.1,
  } as TextStyle,

  bodyMuted: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.1,
  } as TextStyle,

  label: {
    fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,

  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.1,
  } as TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
