# Git Workflow

## Branches

- `main` — protected. No direct pushes or merges. Only updated via pull request.
- `develop` — integration branch. All feature work merges here. Not protected yet; direct
  merges are fine at this stage of the project.
- Everything else is a short-lived work branch cut from `develop`:
  - `feature/<short-description>` — new screens, components, functionality
  - `fix/<short-description>` — bug fixes
  - `chore/<short-description>` — tooling, deps, config, docs

## Rules

1. Never commit directly to `main`.
2. All work happens on a branch, branched from `develop`.
3. Branches merge back into `develop` when done. No PR requirement on `develop` yet — as a
   solo/early-stage project, direct merges are fine.
4. `main` only moves forward via pull request from `develop` (or a hotfix branch), never a
   direct push or merge.

## Branch protection (current state)

- `main`: PRs required, direct pushes blocked, force-push and branch deletion blocked.
- `develop`: no protection rules.

## Not decided yet

PR review requirements (approvals, required checks) and a formal release process for cutting
`main` from `develop`. Revisit once there's more than one contributor or the app nears a stable
milestone.
