#!/usr/bin/env node
// Referential-integrity gate for sample-data/*.json.
//
// This prototype has no backend and no test suite, so the sample JSON *is* the
// data layer. Hand-edits (by a human or an agent) can silently desync it:
// a post's commentCount drifts from the actual comment rows, a deleted user
// leaves dangling authorIds, a scope reduction removes an aircraft that posts
// still reference. Typecheck and bundling both pass; the UI just renders
// wrong numbers.
//
// Zero dependencies on purpose — runs with bare `node`, so it works in a git
// hook and in CI without an install step.
//
// Usage: node scripts/check-sample-data.mjs
// Exit 0 = clean, exit 1 = problems found (printed grouped by check).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'sample-data');

const problems = [];
const fail = (check, detail) => problems.push({ check, detail });

const load = (name) => {
  try {
    return JSON.parse(readFileSync(join(DATA, `${name}.json`), 'utf8'));
  } catch (err) {
    console.error(`FATAL: could not read sample-data/${name}.json — ${err.message}`);
    process.exit(1);
  }
};

const users = load('users');
const aircraft = load('aircraft');
const posts = load('posts');
const comments = load('comments');
const activity = load('activity');

// ---------------------------------------------------------------------------
// Enum values are parsed out of utils/types.ts rather than duplicated here, so
// this script can't drift from the type definitions it's meant to enforce.
// ---------------------------------------------------------------------------
const typesSrc = readFileSync(join(ROOT, 'utils', 'types.ts'), 'utf8');

const unionMembers = (typeName) => {
  const match = typesSrc.match(new RegExp(`export type ${typeName} =([^;]*);`));
  if (!match) {
    console.error(
      `FATAL: could not find "export type ${typeName}" in utils/types.ts.\n` +
        `This script parses enums from the type definitions; if they moved or ` +
        `were renamed, update scripts/check-sample-data.mjs to match.`,
    );
    process.exit(1);
  }
  const members = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (members.length === 0) {
    console.error(`FATAL: parsed "${typeName}" from utils/types.ts but found no members.`);
    process.exit(1);
  }
  return new Set(members);
};

const POST_CATEGORIES = unionMembers('PostCategory');
const AIRCRAFT_STATUSES = unionMembers('AircraftStatus');
const MEDIA_TYPES = unionMembers('PostMediaType');
const ACTIVITY_TYPES = unionMembers('ActivityType');

const constArray = (constName) => {
  const match = typesSrc.match(new RegExp(`${constName}[^=]*=\\s*\\[([^\\]]*)\\]`));
  return match ? [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : [];
};
const currentUserId = (typesSrc.match(/CURRENT_USER_ID\s*=\s*'([^']+)'/) || [])[1];
const followingIds = constArray('CURRENT_USER_FOLLOWING_IDS');

// ---------------------------------------------------------------------------
// ID sets + uniqueness
// ---------------------------------------------------------------------------
const idSet = (rows, label) => {
  const seen = new Set();
  for (const row of rows) {
    if (row.id === undefined) fail('unique ids', `${label}: a row is missing an "id"`);
    else if (seen.has(row.id)) fail('unique ids', `${label}: duplicate id "${row.id}"`);
    else seen.add(row.id);
  }
  return seen;
};

const userIds = idSet(users, 'users');
const aircraftIds = idSet(aircraft, 'aircraft');
const postIds = idSet(posts, 'posts');
const commentIds = idSet(comments, 'comments');
idSet(activity, 'activity');
void commentIds;

// ref(value, allowedSet, checkName, where) — null/undefined is only OK when
// the field is explicitly nullable, which callers signal via refNullable.
const ref = (value, allowed, check, where) => {
  if (!allowed.has(value)) fail(check, `${where} → "${value}" does not resolve`);
};
const refNullable = (value, allowed, check, where) => {
  if (value === null || value === undefined) return;
  ref(value, allowed, check, where);
};

const oneOf = (value, allowed, check, where) => {
  if (!allowed.has(value)) {
    fail(check, `${where} → "${value}" is not one of: ${[...allowed].join(', ')}`);
  }
};

// ---------------------------------------------------------------------------
// Cross-file references
// ---------------------------------------------------------------------------
for (const a of aircraft) {
  ref(a.currentOwnerId, userIds, 'aircraft → users', `aircraft ${a.id}.currentOwnerId`);
  oneOf(a.status, AIRCRAFT_STATUSES, 'enums', `aircraft ${a.id}.status`);
  for (const [i, rec] of (a.ownershipHistory ?? []).entries()) {
    ref(rec.userId, userIds, 'aircraft → users', `aircraft ${a.id}.ownershipHistory[${i}].userId`);
  }
  // The current owner should be the open-ended chapter in the ownership story
  // (PRODUCT_VISION.md: the aircraft is the permanent entity).
  const open = (a.ownershipHistory ?? []).filter((r) => r.endDate === null);
  if (open.length > 1) {
    fail(
      'ownership history',
      `aircraft ${a.id}: ${open.length} ownership records have endDate null`,
    );
  }
  if (open.length === 1 && open[0].userId !== a.currentOwnerId) {
    fail(
      'ownership history',
      `aircraft ${a.id}: currentOwnerId "${a.currentOwnerId}" but the open ownership record is "${open[0].userId}"`,
    );
  }
}

for (const p of posts) {
  ref(p.authorId, userIds, 'posts → users', `post ${p.id}.authorId`);
  // aircraftId is an optional tag after the v1 pivot (see docs/MVP_SCOPE.md),
  // so null is allowed — but a non-null value must still resolve.
  refNullable(p.aircraftId, aircraftIds, 'posts → aircraft', `post ${p.id}.aircraftId`);
  oneOf(p.category, POST_CATEGORIES, 'enums', `post ${p.id}.category`);
  oneOf(p.mediaType, MEDIA_TYPES, 'enums', `post ${p.id}.mediaType`);
  if (p.mediaType === 'video' && !p.thumbnailUrl) {
    fail('media', `post ${p.id}: mediaType "video" but no thumbnailUrl (grid views need a poster)`);
  }
}

for (const c of comments) {
  ref(c.postId, postIds, 'comments → posts', `comment ${c.id}.postId`);
  ref(c.authorId, userIds, 'comments → users', `comment ${c.id}.authorId`);
}

for (const ac of activity) {
  ref(ac.actorUserId, userIds, 'activity → users', `activity ${ac.id}.actorUserId`);
  refNullable(
    ac.actorAircraftId,
    aircraftIds,
    'activity → aircraft',
    `activity ${ac.id}.actorAircraftId`,
  );
  refNullable(ac.targetPostId, postIds, 'activity → posts', `activity ${ac.id}.targetPostId`);
  refNullable(ac.targetUserId, userIds, 'activity → users', `activity ${ac.id}.targetUserId`);
  oneOf(ac.type, ACTIVITY_TYPES, 'enums', `activity ${ac.id}.type`);

  // A like/comment must point at a post; a follow must point at a user.
  if ((ac.type === 'like' || ac.type === 'comment') && !ac.targetPostId) {
    fail('activity targets', `activity ${ac.id}: type "${ac.type}" but targetPostId is null`);
  }
  if (ac.type === 'follow' && !ac.targetUserId) {
    fail('activity targets', `activity ${ac.id}: type "follow" but targetUserId is null`);
  }
}

// ---------------------------------------------------------------------------
// Denormalised counters — the quiet failure mode. commentCount is rendered
// directly on feed cards, so a drift here is invisible to typecheck and to the
// bundler but plainly wrong on screen.
// ---------------------------------------------------------------------------
const actualComments = new Map();
for (const c of comments) {
  actualComments.set(c.postId, (actualComments.get(c.postId) ?? 0) + 1);
}
for (const p of posts) {
  const actual = actualComments.get(p.id) ?? 0;
  if (p.commentCount !== actual) {
    fail(
      'commentCount',
      `post ${p.id}: commentCount is ${p.commentCount} but ${actual} comment row(s) exist`,
    );
  }
}

// ---------------------------------------------------------------------------
// Fixed demo identities declared in utils/types.ts must exist in the data
// ---------------------------------------------------------------------------
if (!currentUserId) {
  fail('demo identity', 'could not parse CURRENT_USER_ID from utils/types.ts');
} else if (!userIds.has(currentUserId)) {
  fail('demo identity', `CURRENT_USER_ID "${currentUserId}" does not exist in users.json`);
}
for (const id of followingIds) {
  if (!userIds.has(id)) {
    fail(
      'demo identity',
      `CURRENT_USER_FOLLOWING_IDS contains "${id}", which does not exist in users.json`,
    );
  }
  if (id === currentUserId) {
    fail('demo identity', `CURRENT_USER_FOLLOWING_IDS contains the current user "${id}"`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const counts = `${users.length} users · ${aircraft.length} aircraft · ${posts.length} posts · ${comments.length} comments · ${activity.length} activity`;

if (problems.length === 0) {
  console.log(`sample-data OK — ${counts}`);
  process.exit(0);
}

console.error(`\nsample-data FAILED — ${problems.length} problem(s) across ${counts}\n`);
const grouped = new Map();
for (const { check, detail } of problems) {
  if (!grouped.has(check)) grouped.set(check, []);
  grouped.get(check).push(detail);
}
for (const [check, details] of grouped) {
  console.error(`  ${check}`);
  for (const d of details) console.error(`    - ${d}`);
  console.error('');
}
process.exit(1);
