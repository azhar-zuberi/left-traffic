// Large rounded cards, minimal sharp edges (docs/DESIGN_SYSTEM.md).
export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
  // Dedicated card radius, tighter than `lg` — used for photo-forward cards
  // (e.g. AircraftCard) so it can move independently of `lg`-radius chrome
  // like FabTabButton.
  card: 10,
} as const;

export type RadiusToken = keyof typeof radii;
