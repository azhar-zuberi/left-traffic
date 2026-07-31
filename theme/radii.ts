// Large rounded cards, minimal sharp edges (docs/DESIGN_SYSTEM.md).
export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radii;
