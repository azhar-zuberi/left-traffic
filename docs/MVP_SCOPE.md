# MVP Scope

## V1 pivot

V1 is a content-and-engagement app for aviation people: post and share photos
and videos, like/unlike, comment. Anyone with a profile can post — you don't
need to own an aircraft to participate. Aircraft profiles still exist (create,
edit, tag), but as an attribute of a post or a profile, not the app's
organizing principle.

This is a deliberate simplification, not an abandonment of
`docs/PRODUCT_VISION.md`'s aircraft-permanence thesis — see the "V1 framing"
note at the bottom of that doc for how the two relate. Don't edit
`PRODUCT_VISION.md`'s core thesis to match this doc; it's intentionally kept
as the long-term direction.

All 10 screens still exist in some form, but the tab bar and navigation
structure change — see "Navigation" below. This doc governs which actions are
real in v1 and which aren't built yet.

**No fake success states.** If a control isn't wired to real, persisted data,
it doesn't get to look like it worked. Don't ship a "Posted!" or "Added to
your hangar!" screen that doesn't actually add anything to `posts` /
`aircraft` — either wire it for real, or hide/disable the entry point until
the milestone that wires it lands. Same goes for any control tied to a
feature in "Out of Scope" below (e.g. a follow button, a save/bookmark
toggle) — remove it from the screen rather than leaving it tappable but
inert. A control that visibly responds to a tap but changes nothing is worse
than no control at all.

Work through "In Scope" as separate milestones, one at a time, per
`docs/left-traffic-front-end-prototype.md`'s iterative development rule.
Don't build anything from "Out of Scope" without a new product conversation.

---

## Navigation (changed for the pivot)

Tab bar becomes **Flightline, Activity, Profile**, plus the center **+** FAB
for New Post. Flightline — not My Hangar — is the app's home/index route now,
since the feed is the primary surface, not the hangar.

My Hangar stops being a tab. Aircraft management (your aircraft list, Add
Aircraft, Edit Aircraft, Aircraft Detail) moves under Profile — a "Your
Aircraft" section there is the new entry point, replacing the dedicated tab.
Aircraft Detail itself doesn't need to change once reached this way; it's the
navigation path in, not the screen's contents, that's moving.

Search is a known future addition to the tab bar, not v1 — don't build it yet.

This is new work, not yet built. It's the main remaining piece of the pivot,
alongside optional aircraft tagging below.

---

## In Scope

Create and edit aircraft profiles.

No delete. Aircraft are still a permanent entity once created — v1 does not
build a way to remove one. See "Aircraft removal" below. Add Aircraft's
"Identify → Details → Photos → Complete" flow calls the real `addAircraft` on
completion. Edit lives behind a pencil icon on the aircraft's hero photo (swap
the cover photo) and a "•••" menu below it (edit the spec fields, via
`EditAircraftScreen` / `updateAircraft`). Reached via Profile now, not a
Hangar tab — see "Navigation" above.

Create, edit, and delete posts. Photos and videos both — this is built:
New Post's compose flow uses the device's real camera/library
(`utils/mediaPicker.ts`, `expo-image-picker`) for both, videos get a poster
thumbnail (`expo-video-thumbnails`) and play back in-app
(`components/VideoPlayerModal.tsx`, `expo-video`). `Post.mediaType` /
`mediaUrl` / `thumbnailUrl` replaced the old single `photoUrl`. Edit and
delete live behind a "•••" menu on `PostCard`, owner-gated — edit re-opens the
same compose screen pre-filled and calls `updatePost`; delete confirms once,
then calls `deletePost`.

**Aircraft tagging on posts is optional, and open to any aircraft — not just
ones you own.** This is new work, not yet built. Today, New Post's "Tag
Aircraft" step only lists `myAircraft` and always tags something. Change it
so: tagging is skippable (an enthusiast without an aircraft can still post),
and when used, it's a tail-number lookup against the full aircraft registry —
reuse the same lookup pattern Add Aircraft already has (`aircraft.find(a =>
a.registration...)`), not a picker limited to owned aircraft. If the tail
number isn't found, the post just goes untagged; this lookup never creates a
new aircraft record (that's still what Add Aircraft is for). `Post.aircraftId`
becomes optional (`string | null`) to support this — see
`docs/ARCHITECTURE.md` for the modeling note.

Create and edit user profile — the Settings form is wired to `updateUser` via
a header Save action.

View everyone's posts. Like and unlike posts.

Flightline shows all posts by default, not just people you follow. This is a
deliberate v1 choice, not a placeholder — see "Follow / unfollow" below.

Comment on posts. Delete your own comments.

No comment editing — deleting and re-adding covers typos. This gives comments
lighter-weight parity with posts rather than full CRUD. Delete lives behind a
trash icon on your own comments (`deleteComment`), confirmed once before it's
gone.

View Activity (likes and comments on your own posts).

`follow`-type rows can stay in `sample-data/activity.json` for texture (so
profiles don't look freshly created), but nothing in the app generates new
ones — see "Follow / unfollow."

Sign in / sign out.

Already built and functional (Login → Register → `(tabs)`, Settings → Log
Out). No new work needed here. Listed for completeness.

---

## Out of Scope for v1

**Follow / unfollow.** Flightline defaults to everyone's posts, so follow
doesn't gate any content yet — it'd only be feed-filtering plumbing nobody
needs until the user base is large enough to want it. Cut the Flightline
"Following" filter chip along with it; a filter with no way to curate its
list is confusing, not a feature.

`followersCount` / `followingCount` on `User` display as fixed, read-only
profile stats (like join date) — not live counters, since there's no action
that changes them.

**Aircraft removal / ownership transfer.** No way to retire, sell, or delete
an aircraft in v1. Every aircraft added stays. Modeling "ownership changes,
the story continues" needs a second real owner to hand the aircraft to, which
isn't meaningful with a single demo user (`CURRENT_USER_ID`) — revisit once
there's a reason to.

**Maintenance functionality, marketplace, messaging.** Already excluded per
`docs/SCREEN_REQUIREMENTS.md`. Restated here for completeness.

**Search / discovery** of other users or aircraft. Explicitly planned as a
future tab-bar addition (see "Navigation" above), not v1. Flightline already
surfaces everyone by default, so there's no urgent gap in the meantime.

---

## Known cleanup (not blocking this milestone)

A few controls built during earlier screen work are inert — visible, tappable,
and doing nothing real. Not part of this pass; flagging so they don't get
mistaken for finished features:

- `PostCard`'s bookmark/save icon — toggles locally, no save feature exists.
- Settings' Push Notifications / Email Updates / Metric Units toggles — flip
  visually, affect nothing elsewhere in the app.
