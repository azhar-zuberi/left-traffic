# Left Traffic

Left Traffic is the digital home of an aircraft. Aircraft are permanent; owners are
temporary — every owner adds another chapter to the aircraft's story. This repo is a
**UX prototype**: there's no backend, no API, and no authentication. Every screen is driven by
local JSON in `sample-data/`.

See `docs/PRODUCT_VISION.md` for the full pitch.

## Stack

React Native + Expo + TypeScript + Expo Router, with Reanimated, Gesture Handler, SVG, Safe Area
Context, and FlashList.

## Getting started

```bash
npm install      # also wires the git hooks in .githooks/ via the "prepare" script
npm start        # then press i (iOS), a (Android), or w (web)
```

Or target a platform directly:

```bash
npm run ios
npm run android
npm run web
```

## Verifying a change

```bash
npm run verify   # lint + format check + typecheck + sample-data integrity
```

Run this before pushing. The same checks run in a pre-commit hook and again in CI, so skipping it
only means finding out later. Individual pieces: `npm run lint`, `npm run format`,
`npm run typecheck`, `npm run check:data`.

There's no unit test runner. For a prototype of screens over static JSON that's deliberate —
`check:data` (referential integrity of `sample-data/`) plus a real `expo export` in CI covers more
of what actually breaks here than component tests would. Revisit when the backend lands.

See `CLAUDE.md` → "The gate stack" for the full picture of what runs where and why.

## Project structure

```
app/            expo-router routes — thin files that re-export the real screen from screens/
screens/        actual screen implementations
components/     reusable UI components
theme/          design tokens: colors, typography, spacing, radii, shadows
sample-data/    local JSON: users, aircraft, posts, comments, activity
utils/          typed accessors for sample-data (utils/sampleData.ts) + shared types
hooks/          shared hooks
docs/           product brief, design system, screen requirements, mock data spec
scripts/        verification scripts (check-sample-data.mjs)
.githooks/      pre-commit and pre-push gates
.github/        CI workflow and PR template
```

## Documentation

Everything that shapes this build lives in `docs/`:

- `left-traffic-front-end-prototype.md` — the project brief: role, philosophy, constraints
- `PRODUCT_VISION.md` — the product's emotional core
- `DESIGN_SYSTEM.md` — palette, typography, and visual language
- `SCREEN_REQUIREMENTS.md` — the 10 screens and what each must contain
- `MOCK_DATA.md` — what the sample data should cover
- `ARCHITECTURE.md` — project structure and constraints (no backend, no business logic layer)
- `left-traffic-lnf.png` — look-and-feel reference

`CLAUDE.md` has more detail on how the codebase is wired together (routing patterns, data
modeling decisions, theme conventions) for anyone — human or otherwise — picking this up.

## Status

- **Milestone 1** — project scaffold: navigation for all 10 screens, theme tokens, placeholder UI.
- **Milestone 2** — sample data: 11 users, 10 aircraft, 30 posts, 46 comments, 14 activity items,
  fully cross-referenced.
- Real screen UI (starting with My Hangar and Aircraft Detail) is next.
