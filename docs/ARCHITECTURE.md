Project Structure

app/

components/

screens/

hooks/

theme/

assets/

sample-data/

utils/

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