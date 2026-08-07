Project Structure

app/

components/

screens/

hooks/

theme/

assets/

sample-data/

utils/

scripts/ — build/verification scripts, not app code. Currently just
check-sample-data.mjs, the referential-integrity gate for sample-data/.

.githooks/ — pre-commit and pre-push gates. Wired by `npm install` via the
"prepare" script; see CLAUDE.md's "The gate stack" for what runs where.

.github/ — CI workflow and the pull request template.

Every component should be reusable.

No business logic.

No API layer.

No services.

No repositories.

No backend abstraction.

Use mocked JSON directly.

This project should feel like a production-quality design prototype.

Optimize readability over abstraction.

---

## Shared App State (`hooks/useAppData.tsx`)

**Status: built.** Screens used to import `aircraft`, `posts`, `comments`,
`users` straight from `utils/sampleData`. Those are plain arrays — mutating
them doesn't trigger a re-render anywhere, so interactive screens
(`PostCard`, `CommentRow`) faked it with local `useState` instead. That
meant liking a post in Flightline didn't update the same post's like count
in Aircraft Detail's logbook or Comments — each screen had its own
disconnected copy. The section below is kept as the rationale/spec for the
pattern now in place; see `hooks/useAppData.tsx` for the actual source of
truth.

Fixed once, centrally, rather than letting every feature
(comment counts, new posts, new aircraft, profile edits) invent its own
local workaround.

**This is state lifting, not the business logic this doc tells you not to
build.** No validation, no API orchestration, no derived business rules —
just "the same in-memory collections, readable and writable from anywhere,"
which is what a no-backend prototype needs to feel coherent across screens.

### Shape

Create `hooks/useAppData.tsx` exporting:

- `AppDataProvider` — wraps the app (mount it in `app/_layout.tsx`, around
  the root `<Stack>`). Holds `users`, `aircraft`, `posts`, `comments` in
  `useState`, seeded once from `utils/sampleData`'s exports. State only —
  resets on reload, same as everything else in this prototype. No
  persistence layer.
- `useAppData()` — a hook returning the four collections plus
  `isPostLiked(postId)`, `isCommentLiked(commentId)`,
  `togglePostLike(postId)`, `toggleCommentLike(commentId)`,
  `addComment(postId, body)`, `deleteComment(commentId)`, `addPost(post)`,
  `updatePost(postId, patch)`, `deletePost(postId)`,
  `addAircraft(record)`, `updateAircraft(aircraftId, patch)`,
  `updateUser(userId, patch)`.

`Post`/`Comment` have an aggregate `likeCount`, not a `likedByUserIds` list —
there's no per-user like graph in the sample data. Track "did the current
user like this" as a separate `Set<string>` of ids in provider state
(`likedPostIds`, `likedCommentIds`), and derive the displayed count as the
stored `likeCount` adjusted by whether the current user's id is in that set.
Don't add a `likedByUserIds` field to the JSON schema for this — it's
unnecessary for a single-demo-user prototype.

Plain `useState` + plain functions. No reducer, no external state library —
would be abstraction this project explicitly doesn't want at this scale.

### Migration checklist (complete)

Every file below used to import `aircraft` / `posts` / `comments` / `users`
directly from `@/utils/sampleData`. All have been moved to `useAppData()`:

`components/PostCard.tsx`, `components/CommentRow.tsx`,
`screens/FlightlineScreen.tsx`, `screens/AircraftDetailScreen.tsx`,
`screens/MyHangarScreen.tsx`, `screens/ProfileScreen.tsx`,
`screens/CommentsScreen.tsx`, `screens/NewPostScreen.tsx`,
`screens/AddAircraftScreen.tsx`, `screens/ActivityScreen.tsx`,
`screens/SettingsScreen.tsx`.

What each also picked up along the way:

- `PostCard` / `CommentRow` — local `liked` `useState` replaced with
  `isPostLiked` / `togglePostLike` (or the comment equivalents). Both also
  gained an owner-only affordance backed by `components/ActionSheet.tsx`
  (see below): `PostCard`'s "•••" menu (Edit → re-opens `NewPostScreen` with
  a `postId` param and calls `updatePost`; Delete → confirms, then
  `deletePost`) and `CommentRow`'s trash icon (`deleteComment`).
- `FlightlineScreen` — dropped the "Following" filter per `docs/MVP_SCOPE.md`.
- `NewPostScreen` / `AddAircraftScreen` — call the real `addPost` /
  `addAircraft` on submit; no fake success screen. `AircraftDetailScreen`
  additionally gained a pencil icon on the hero photo (swap `heroPhotoUrl`
  via `updateAircraft`) and a "•••" below it (routes to
  `screens/EditAircraftScreen.tsx` / `app/edit-aircraft.tsx`, a modal route
  registered in `app/_layout.tsx`).
- `SettingsScreen` — "edit user profile" hooks in via `updateUser`, behind
  a header Save action.

### Dialogs and menus: `components/ActionSheet.tsx`

`Alert.alert` is a no-op on `react-native-web` (its entire implementation is
`static alert() {}`), and `ActionSheetIOS` only exists on iOS — so neither
works if you test this app in a browser, which this prototype's own
`npm run web` workflow encourages. `components/ActionSheet.tsx` is a small
bottom-sheet built on RN's `Modal` (which *is* implemented on web) instead —
it's the one path that actually works on iOS, Android, and web. Use it for
any confirm dialog or option menu; don't reach for `Alert` or `ActionSheetIOS`.

**Leave `utils/stockPhotos.ts` importing directly from `utils/sampleData`.**
It builds a static curated photo list at module load time from the seed
data — it isn't meant to reflect live mutations, and a hook can't be called
outside a component anyway.

---

## Media: photo and video posts

**Status: built.** `Post` no longer has a single `photoUrl` — it has
`mediaType: 'photo' | 'video'`, `mediaUrl` (the picked/captured file), and an
optional `thumbnailUrl` (extracted poster frame, video only; grid/list views
render this instead of decoding video just to show a static image).

Compose (`screens/NewPostScreen.tsx`) uses the device's real camera and
media library via `utils/mediaPicker.ts` (`expo-image-picker`), offered
through an `ActionSheet`: Take Photo, Record Video, Choose Photo/Video from
Library. Camera options are hidden on web (`isCameraAvailable`); library
picking works everywhere. Video posts get a poster thumbnail via
`expo-video-thumbnails` (`extractThumbnail` — native only; it has no web
implementation, so video posts on web just skip the poster and fall back to
a plain placeholder). Compose requires real media before you can post; there
is no stock-photo fallback anymore.

`components/PostMedia.tsx` is the shared renderer — pass it a `Post` and it
shows a photo, or a video thumbnail with a play badge that opens
`components/VideoPlayerModal.tsx` (full-screen playback via `expo-video`) on
tap. It's used in `PostCard`, `LogbookEntry`, and the Profile post grid, so
video posts render consistently everywhere a post appears. `PostMedia` treats
anything other than an explicit `'video'` `mediaType` as a photo, rather than
requiring an exact `'photo'` match — that's a deliberate fallback so
stale/partial post data doesn't silently render as a video placeholder.

This is a justified exception to "avoid unnecessary dependencies"
(`docs/left-traffic-front-end-prototype.md`) — video playback and capture
aren't things you can build from primitives, and `expo-image-picker` /
`expo-video` / `expo-video-thumbnails` are the standard Expo-maintained
libraries for it, not a third-party add-on.

---

## Aircraft tagging on posts (optional, any aircraft)

**Status: not yet built.** Per `docs/MVP_SCOPE.md`'s v1 pivot, posting
doesn't require owning or tagging an aircraft, and when you do tag one, it
isn't limited to aircraft you own.

This changes a modeling decision stated elsewhere in this repo: `Post.aircraftId`
was the primary relationship (whose story a post belongs to), with
`Post.authorId` secondary. That's inverted now — `authorId` (who posted it) is
primary, `aircraftId` becomes an optional tag. Update the type to
`aircraftId: string | null`. Aircraft Detail's Logbook tab still works
unchanged (it's just "posts tagged to this aircraft, if any" — filtering
doesn't care whether the field is required), but it's no longer *the* story
of the post, just one filtered view of it.

In `NewPostScreen`'s "Tag Aircraft" step: replace the `myAircraft`-only list
with a skippable tail-number lookup against the full aircraft registry —
reuse the same match logic `AddAircraftScreen.handleLookup` already has
(`aircraft.find(a => a.registration.toUpperCase() === query)`), not a picker
scoped to owned aircraft. Unmatched input just leaves the post untagged; this
lookup never creates a new `Aircraft` record — that's still exclusively
`AddAircraftScreen`'s job.

---

## Navigation: feed-first, aircraft under Profile

**Status: not yet built.** Per `docs/MVP_SCOPE.md`'s v1 pivot, the tab bar
becomes **Flightline, Activity, Profile** plus the center FAB — My Hangar is
no longer a tab.

`(tabs)/index` currently is `MyHangarScreen`; it needs to become
`FlightlineScreen` instead, since Flightline is now the app's home surface.
Whatever screen ends up at `index` owns `/` — see the existing warning in
this doc's history about not reintroducing a separate redirect there.

Aircraft management (the list of aircraft you own, plus entry points into Add
Aircraft, Edit Aircraft, and Aircraft Detail) moves to a "Your Aircraft"
section on `ProfileScreen`, replacing My Hangar's role as the entry point.
`AircraftDetailScreen`, `AddAircraftScreen`, and `EditAircraftScreen`
themselves don't need content changes — only what links into them moves.
`screens/MyHangarScreen.tsx` and its `app/(tabs)/index.tsx` re-export can be
deleted once Profile's aircraft section covers what it did.