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

Screens currently import `aircraft`, `posts`, `comments`, `users` straight
from `utils/sampleData`. Those are plain arrays — mutating them doesn't
trigger a re-render anywhere, so interactive screens (`PostCard`,
`CommentRow`) fake it with local `useState` instead. That means liking a
post in Flightline doesn't update the same post's like count in Aircraft
Detail's logbook or Comments — each screen has its own disconnected copy.

Fix this once, centrally, rather than letting every future feature
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
- `useAppData()` — a hook returning the four collections plus mutators:
  `togglePostLike(postId)`, `toggleCommentLike(commentId)`,
  `addComment(postId, body)`, `addPost(post)`,
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

### Migration checklist

Every file below imports `aircraft` / `posts` / `comments` / `users`
directly from `@/utils/sampleData`. Move each to `useAppData()` instead:

`components/PostCard.tsx`, `components/CommentRow.tsx`,
`screens/FlightlineScreen.tsx`, `screens/AircraftDetailScreen.tsx`,
`screens/MyHangarScreen.tsx`, `screens/ProfileScreen.tsx`,
`screens/CommentsScreen.tsx`, `screens/NewPostScreen.tsx`,
`screens/AddAircraftScreen.tsx`, `screens/ActivityScreen.tsx`,
`screens/SettingsScreen.tsx`.

Along with the import swap:

- `PostCard` / `CommentRow` — replace the local `liked` `useState` with
  `isPostLiked` / `togglePostLike` (or the comment equivalents).
- `CommentsScreen` — replace local `draftComments` state with the shared
  `comments` + `addComment`; this is also where "delete your own comment"
  (`docs/MVP_SCOPE.md`) hooks in.
- `FlightlineScreen` — drop the "Following" filter per `docs/MVP_SCOPE.md`
  while you're touching this file.
- `NewPostScreen` / `AddAircraftScreen` — these currently end on a fake
  "success" screen without writing anything to `posts` / `aircraft`. Per
  `docs/MVP_SCOPE.md`'s no-fake-success-states rule, wire the real
  `addPost` / `addAircraft` call on submit as part of *this* milestone —
  both screens already build the full object, so this is a small addition,
  not a new feature. Don't leave the fake completion screen in place even
  temporarily.
- `SettingsScreen` — this is where "edit user profile" (`docs/MVP_SCOPE.md`)
  hooks in via `updateUser`, as its own milestone.

**Leave `utils/stockPhotos.ts` importing directly from `utils/sampleData`.**
It builds a static curated photo list at module load time from the seed
data — it isn't meant to reflect live mutations, and a hook can't be called
outside a component anyway.