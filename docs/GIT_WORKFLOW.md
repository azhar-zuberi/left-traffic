# Git Workflow

## Branches

- `main` — protected. No direct pushes or merges. Only updated via pull request.
- `develop` — integration branch. All feature work merges here.
- `poc<N>` (`poc1`, `poc2`, ...) — checkpoint branches cut from `main` at the start of a distinct
  phase of the project (a proof-of-concept iteration, a significant pivot). Reference/rollback
  points, not a place ongoing work lands — new work still branches from and PRs into `develop`,
  same as always. Don't merge into a `poc<N>` branch or treat it as an integration target.
- Everything else is a short-lived work branch cut from `develop`:
  - `feature/<short-description>` — new screens, components, functionality
  - `fix/<short-description>` — bug fixes
  - `chore/<short-description>` — tooling, deps, config, docs

## Rules

1. Never commit directly to `main`.
2. **Never commit directly to `develop` either.** All work happens on a branch, branched from
   `develop`, named per the `feature/` / `fix/` / `chore/` convention above.
3. Every branch gets a pull request into `develop` before merging — no direct merges, even for
   small or doc-only changes. This is a change from earlier in the project, when direct merges to
   `develop` were fine; it no longer is, going forward.
4. `main` only moves forward via pull request from `develop` (or a hotfix branch), never a
   direct push or merge.
5. `poc<N>` branches are cut, not merged into. If a checkpoint is needed for a new phase, cut a
   new `poc<N+1>` from the then-current `main`.

## Branch protection (current state)

- `main`: PRs required, direct pushes blocked, force-push and branch deletion blocked.
- `develop`: no GitHub-enforced protection yet — rule 2/3 above is a process convention, not
  something the platform currently blocks. Enable equivalent protection on `develop` (PR required,
  direct pushes blocked) when it's worth the setup cost; until then, follow it by discipline.

## Not decided yet

PR review requirements (approvals, required checks) and a formal release process for cutting
`main` from `develop`. Revisit once there's more than one contributor or the app nears a stable
milestone.
