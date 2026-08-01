# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Left Traffic is a **UX prototype**, not a production app. There is no backend, no API, no
authentication, and no cloud infrastructure — everything comes from local JSON in `sample-data/`.
The goal is to validate product experience, not technology. See
`docs/left-traffic-front-end-prototype.md` for the full brief (role, philosophy, constraints)
— read it before making architectural changes.

**Work in milestones.** Complete one milestone, explain what was built and why (including
alternatives considered and open questions), and wait for feedback before starting the next one.
Be opinionated about product/UX decisions — this role is product partner, not just implementer.

### Required docs/ reading

- `docs/PRODUCT_VISION.md` — the aircraft (not the owner) is the permanent entity; ownership is one
  chapter in its story. This drives real modeling decisions (see Data layer below).
- `docs/DESIGN_SYSTEM.md` — palette (warm white, deep navy, aluminum gray, soft sky blue), large
  rounded cards, minimal shadows, photography-first. Explicitly *not* Instagram; inspiration is
  Apple Photos, Flighty, Rivian, Porsche, Garmin, Linear.
- `docs/SCREEN_REQUIREMENTS.md` — the 10 screens and what each must contain. No maintenance
  functionality, no marketplace, no messaging.
- `docs/MOCK_DATA.md` — what the sample data should cover (entities, aircraft manufacturers, post
  categories).
- `docs/ARCHITECTURE.md` — flat structure, no business logic / API layer / services / repositories.
- `docs/left-traffic-lnf.png` — look-and-feel reference mockup. Screens don't need to match
  it 1:1, but it's the visual and structural source of truth (nav pattern, card styles, typography).

## Commands

```bash
npm install          # install dependencies
npm start             # expo start — dev server, scan QR or press i/a/w
npm run ios           # expo start --ios
npm run android        # expo start --android
npm run web            # expo start --web (fastest way to eyeball a change; no simulator needed)
npx tsc --noEmit       # typecheck — no separate lint or test setup exists yet
npx expo export -p ios # bundles the app without a simulator; good smoke test for import errors
npx expo-doctor        # validates Expo project config/dependency health
```

There is no test runner or linter configured. Typechecking + `expo export` is the current
verification loop.

## Architecture

### Routing: `app/` is thin, `screens/` has the real UI

`app/*.tsx` files are one-line re-exports (`export default MyHangarScreen;`). The actual screen
implementation lives in `screens/*.tsx`. This keeps navigation structure decoupled from screen
logic and matches `docs/ARCHITECTURE.md`'s listing of both `app/` and `screens/`.

Route map (`app/_layout.tsx` root `Stack`):
- `login` — launch screen on native via `unstable_settings.initialRouteName` in `app/_layout.tsx`,
  **not** a redirect from a root `index.tsx`. There is no auth to enforce (see docs), so nothing
  gates navigation — Login is just where the app starts. Do not reintroduce a root `app/index.tsx`
  redirect; it will collide with `(tabs)/index.tsx`, which legitimately owns `/`.
- `(tabs)` — Hangar (`index`), Flightline, Activity, Profile, plus a `new-post-tab` route that is
  never actually shown: its `tabPress` is intercepted in `(tabs)/_layout.tsx` to push `/new-post`
  as a modal instead of switching tabs. This is how the center **+** FAB works.
- `aircraft/[aircraftId]`, `comments/[postId]` — dynamic stack routes.
- `add-aircraft`, `new-post` — presented as modals.
- `settings` — plain stack route off Profile.

### Data layer: `sample-data/` + `utils/`

`sample-data/*.json` (users, aircraft, posts, comments, activity) are hand-authored, cross-referenced
by ID, and validated for referential integrity (every `aircraftId`/`authorId`/`postId` resolves,
`commentCount` matches actual comment rows, etc.) — re-run that kind of check after editing the JSON
by hand. `utils/types.ts` defines the shapes and exports `CURRENT_USER_ID` (`'u1'`, Alex Rowen) as
the fixed demo/logged-in user for this no-auth prototype. `utils/sampleData.ts` re-exports the JSON
cast to those types — **import from `utils/sampleData`, not the raw JSON files**, so screens get
typed data.

Two modeling decisions that aren't obvious from the schema alone:
- **No separate logbook entity.** The Logbook screen in the look-and-feel reference is just that
  aircraft's own `posts` sorted chronologically — confirmed by a post appearing verbatim in both
  the Flightline feed and the Logbook timeline in the reference mockup. Don't add a
  `LogbookEntry` type; filter `posts` by `aircraftId` instead.
- **Activity actor identity** resolves to an aircraft's tail number when the actor currently owns
  one (`actorAircraftId`), falling back to their user handle when they don't (`actorUserId` only,
  `actorAircraftId: null`). This reflects the product's aircraft-first identity model. Both fields
  are stored explicitly on each `ActivityItem` — don't try to derive "primary aircraft" in the UI.

`Post.aircraftId` is the primary relationship (whose story this is); `Post.authorId` is who wrote
it. They can diverge over time as ownership changes — that's intentional, not a bug.

### Theme: `theme/`

`colors.ts`, `typography.ts`, `spacing.ts`, `radii.ts`, `shadows.ts`, barrel-exported via
`theme/index.ts`. Notable choices:
- `app.json` sets `userInterfaceStyle: "light"` — the app does **not** adapt to OS dark mode. Dark
  navy surfaces (Login, Aircraft Detail hero) are an intentional editorial choice, not a
  system-driven theme response. Don't reintroduce `useColorScheme`-based theming.
- No custom typeface is loaded yet. The wide-tracked all-caps screen titles seen in the
  look-and-feel reference are done with system font + `letterSpacing` + `textTransform: 'uppercase'`
  (`typography.screenTitle`), not a font file. Picking a real typeface is an open design decision.
- Tab bar icons currently use `@expo/vector-icons` (Ionicons) as a placeholder — `DESIGN_SYSTEM.md`
  calls for custom aviation-inspired iconography, which hasn't been built yet.
