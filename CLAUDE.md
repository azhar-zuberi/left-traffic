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

- `docs/MVP_SCOPE.md` — what's actually in v1 vs. explicitly deferred. All 10 screens exist, but not
  every action on them is real yet; check this before building or "finishing" a feature.
- `docs/PRODUCT_VISION.md` — the aircraft (not the owner) is the permanent entity; ownership is one
  chapter in its story. This drives real modeling decisions (see Data layer below).
- `docs/DESIGN_SYSTEM.md` — palette (warm white, deep navy, aluminum gray, soft sky blue), large
  rounded cards, minimal shadows, photography-first. Explicitly *not* Instagram; inspiration is
  Apple Photos, Flighty, Rivian, Porsche, Garmin, Linear.
- `docs/SCREEN_REQUIREMENTS.md` — the 10 screens and what each must contain. No maintenance
  functionality, no marketplace, no messaging.
- `docs/MOCK_DATA.md` — what the sample data should cover (entities, aircraft manufacturers, post
  categories).
- `docs/ARCHITECTURE.md` — flat structure, no business logic / API layer / services / repositories,
  plus the `hooks/useAppData.tsx` shared-state pattern (see Data layer below).
- `docs/left-traffic-lnf.png` — look-and-feel reference mockup. Screens don't need to match
  it 1:1, but it's the visual and structural source of truth (nav pattern, card styles, typography).
- `docs/GIT_WORKFLOW.md` — every change goes on a branch and through a PR into `develop`, no
  direct commits to `develop` or `main`. Follow this for any work in this repo, not just
  architectural changes.

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
- `(tabs)` — **changing per `docs/MVP_SCOPE.md`'s v1 pivot.** Was Hangar (`index`), Flightline,
  Activity, Profile; becomes Flightline (`index`), Activity, Profile — My Hangar stops being a tab,
  and Flightline (the feed) takes over `index`/`/` as the app's home surface. Aircraft management
  moves under Profile instead (see `docs/ARCHITECTURE.md`'s "Navigation" section). Still has a
  `new-post-tab` route that is never actually shown: its `tabPress` is intercepted in
  `(tabs)/_layout.tsx` to push `/new-post` as a modal instead of switching tabs. This is how the
  center **+** FAB works.
- `aircraft/[aircraftId]`, `comments/[postId]` — dynamic stack routes.
- `add-aircraft`, `edit-aircraft`, `new-post` — presented as modals.
  `edit-aircraft` and `new-post` (when passed a `postId` param) both double
  as edit screens for an existing record.
- `settings` — plain stack route off Profile.

### Data layer: `sample-data/` + `utils/`

`sample-data/*.json` (users, aircraft, posts, comments, activity) are hand-authored, cross-referenced
by ID, and validated for referential integrity (every `aircraftId`/`authorId`/`postId` resolves,
`commentCount` matches actual comment rows, etc.) — re-run that kind of check after editing the JSON
by hand. `utils/types.ts` defines the shapes and exports `CURRENT_USER_ID` (`'u1'`, Alex Rowen) as
the fixed demo/logged-in user for this no-auth prototype. `utils/sampleData.ts` re-exports the JSON
cast to those types — **import from `utils/sampleData`, not the raw JSON files**, so screens get
typed data.

Screens and components should read and mutate this data through `hooks/useAppData.tsx`
(`AppDataProvider` / `useAppData()`, see `docs/ARCHITECTURE.md`), not by importing the arrays from
`utils/sampleData` directly — those arrays don't trigger re-renders when mutated, which is why likes
and comments used to desync across screens. `utils/sampleData` still seeds the provider and is the
right import for anything that genuinely wants static seed data outside a component (e.g.
`utils/stockPhotos.ts`), not for screens displaying live, interactive state.

Two modeling decisions that aren't obvious from the schema alone:
- **No separate logbook entity.** The Logbook screen in the look-and-feel reference is just that
  aircraft's own `posts` sorted chronologically — confirmed by a post appearing verbatim in both
  the Flightline feed and the Logbook timeline in the reference mockup. Don't add a
  `LogbookEntry` type; filter `posts` by `aircraftId` instead.
- **Activity actor identity** resolves to an aircraft's tail number when the actor currently owns
  one (`actorAircraftId`), falling back to their user handle when they don't (`actorUserId` only,
  `actorAircraftId: null`). This reflects the product's aircraft-first identity model. Both fields
  are stored explicitly on each `ActivityItem` — don't try to derive "primary aircraft" in the UI.

`Post.authorId` is the primary relationship (who posted it); `Post.aircraftId` is an optional tag
(which aircraft, if any, the post is about) — **this flipped for the v1 pivot** (`docs/MVP_SCOPE.md`,
`docs/ARCHITECTURE.md`'s "Aircraft tagging on posts" section). It used to be the other way around,
with `aircraftId` primary and required. `aircraftId` is now `string | null`, not limited to aircraft
the author owns, and resolved via the same tail-number lookup `AddAircraftScreen` uses.

Posts no longer carry a single `photoUrl` — see `docs/ARCHITECTURE.md`'s "Media: photo and video
posts" section for the `mediaType`/`mediaUrl`/`thumbnailUrl` shape and the real camera/library
capture flow already built on top of it.

### Dialogs and menus: `components/ActionSheet.tsx`

Don't use `Alert.alert` or `ActionSheetIOS` for confirms/option menus — `Alert.alert` is a
no-op on `react-native-web` (silently does nothing, no error) and `ActionSheetIOS` only exists
on iOS, so either one breaks under `npm run web`. Use the shared `components/ActionSheet.tsx`
(a `Modal`-based bottom sheet) instead; it works the same way on iOS, Android, and web. See it
in use in `PostCard` (edit/delete menu) and `CommentRow` (delete confirm).

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
