// Palette per docs/DESIGN_SYSTEM.md: warm whites, deep navy, aluminum gray, soft sky blue.
// Deliberately not adaptive to system dark mode — dark surfaces (Login, Aircraft Detail hero)
// are an intentional editorial choice, not a color-scheme response. See app.json
// `userInterfaceStyle: "light"`.

export const palette = {
  navy900: '#0B1220',
  navy800: '#10192B',
  navy700: '#182338',

  warmWhite: '#FAF7F2',
  cream: '#F3EEE6',
  white: '#FFFFFF',

  aluminum100: '#E4E1DB',
  aluminum300: '#C7C2B8',
  aluminum500: '#8A8F98',
  aluminum700: '#5B5F66',

  skyBlue300: '#B7D9EE',
  skyBlue500: '#7FB2DC',
  skyBlue700: '#4A85B8',

  amber500: '#D98F3C',
  red500: '#C4574A',
} as const;

export const colors = {
  background: palette.warmWhite,
  backgroundDark: palette.navy800,
  surface: palette.white,
  surfaceDark: palette.navy700,

  border: palette.aluminum100,
  borderDark: 'rgba(255,255,255,0.12)',

  textPrimary: palette.navy800,
  textSecondary: palette.aluminum700,
  textMuted: palette.aluminum500,
  textOnDark: palette.warmWhite,
  textOnDarkMuted: palette.aluminum300,

  accent: palette.skyBlue500,
  accentMuted: palette.skyBlue300,

  tint: palette.navy800,

  statusFlying: palette.skyBlue700,
  statusFlyingBackground: palette.skyBlue300,

  like: palette.red500,
  warning: palette.amber500,
} as const;

export type ColorToken = keyof typeof colors;
