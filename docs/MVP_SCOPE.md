# MVP Scope

All 10 screens exist. This doc governs which actions on those screens are real
in v1 and which aren't built yet.

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

## In Scope

Create and edit aircraft profiles.

No delete. Aircraft are the permanent entity (`docs/PRODUCT_VISION.md`) — v1
does not build a way to remove one from My Hangar. See "Aircraft removal" below.

Add Aircraft already has a full "Identify → Details → Photos → Complete" flow
that ends on a success screen without writing anything to `aircraft`. Wiring
the real `addAircraft` call on completion is part of this milestone, not a
later one — see the no-fake-success-states rule above.

Create, edit, and delete posts.

New Post already has a full compose flow that ends on a success screen
without writing anything to `posts`. Wiring the real `addPost` call on
completion is part of this milestone too, for the same reason.

Create and edit user profile (the Settings form already exists — wire it up).

View everyone's posts. Like and unlike posts.

Flightline shows all posts by default, not just people you follow. This is a
deliberate v1 choice, not a placeholder — see "Follow / unfollow" below.

Comment on posts. Delete your own comments.

No comment editing — deleting and re-adding covers typos. This gives comments
lighter-weight parity with posts rather than full CRUD.

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
an aircraft from My Hangar in v1. Every aircraft added stays. Modeling
"ownership changes, the story continues" needs a second real owner to hand
the aircraft to, which isn't meaningful with a single demo user
(`CURRENT_USER_ID`) — revisit once there's a reason to.

**Maintenance functionality, marketplace, messaging.** Already excluded per
`docs/SCREEN_REQUIREMENTS.md`. Restated here for completeness.

**Search / discovery** of other users or aircraft beyond the open Flightline
feed. Not needed yet since Flightline already surfaces everyone by default.

---

## Known cleanup (not blocking this milestone)

A few controls built during earlier screen work are inert — visible, tappable,
and doing nothing real. Not part of this pass; flagging so they don't get
mistaken for finished features:

- `PostCard`'s bookmark/save icon — toggles locally, no save feature exists.
- New Post's video and camera icons — both just reopen the same stock-photo
  picker as the image icon; neither video nor live camera capture exists.
- Settings' Push Notifications / Email Updates / Metric Units toggles — flip
  visually, affect nothing elsewhere in the app.
