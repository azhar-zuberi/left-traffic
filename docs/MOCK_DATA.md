Create local JSON files.

Users

Aircraft

Posts

Comments

Activity

Everything should reference IDs.

"Everything should reference IDs" is enforced, not just intended — `scripts/check-sample-data.mjs`
(`npm run check:data`) validates that every cross-file reference resolves, that denormalised
counters like `commentCount` match the actual rows, and that enum values match the unions in
`utils/types.ts`. It runs on pre-push and in CI. Edit these files by hand and run it before
pushing; a desync here passes typecheck and bundles fine, then renders wrong numbers on screen.

Use realistic aircraft.

Include:

Piper

Cessna

Beechcraft

Cirrus

Mooney

Bonanza

RV

Cub

Create realistic photos using placeholder URLs.

Create believable ownership histories.

Create interesting posts.

Panel upgrades

Sunset flights

Annual inspections

First flights

Engine overhauls

Breakfast fly-outs

Oshkosh

Backcountry trips

Create enough data to feel like a real community.