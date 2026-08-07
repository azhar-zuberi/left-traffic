<!--
Layer 5. The automated gates check that the code is well-formed; they cannot
check that it does the right thing. That is what this template is for.

The Evidence section is the important one. "Tests pass" is not evidence — CI
already says that. Evidence is what you saw with your own eyes when you ran it.
-->

## What and why

<!-- One or two sentences. What changes, and what problem it solves. -->

Closes #

## Acceptance criteria

<!--
Restate them here rather than linking out. Copying them forces a re-read, and
a PR whose criteria cannot be stated plainly is usually a PR that drifted from
its issue. Check each one only if it is actually done.
-->

- [ ]
- [ ]

## Evidence

<!--
How you know each criterion above is met. Screenshots or a screen recording for
UI work, `npm run web` observations, before/after for a fix. If a criterion has
no evidence, say so and explain why.
-->

## Scope check

- [ ] No change to `sample-data/` shapes without a matching update to `utils/types.ts`
- [ ] No new dependency without a note below saying why it earns its place
- [ ] `docs/` and `CLAUDE.md` updated if this changes architecture, navigation or data modelling
- [ ] Nothing in `docs/MVP_SCOPE.md`'s deferred list snuck in

## Notes for the reviewer

<!-- Anything you are unsure about, alternatives you rejected, or open questions. -->
