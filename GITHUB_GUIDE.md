# RideX GitHub Guide

The team cheat sheet for Git and GitHub. Read the top section and you are done. Everything below is for when something goes wrong or you forgot a command.

`develop` is the **default branch**. We build from `develop`, merge everything into `develop`, and release to `main` only when we want a stable demo.

**Jump to:** [60-second version](#the-60-second-version) · [Branch model](#1-branch-model) · [Branch names](#2-branch-names) · [Commits](#3-commit-messages) · [Pull requests](#4-the-pull-request) · [Conflicts](#6-merge-conflicts) · [Command list](#9-command-cheat-sheet) · [Troubleshooting](#10-troubleshooting) · [Release to main](#11-release-to-main) · [Golden rules](#12-golden-rules)

---

# The 60-second version

Every task, start to finish. Copy this block.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/short-name

# ... write your code ...

git status
git add .
git commit -m "feat: what you actually did"
git push -u origin feature/short-name
```

Then on GitHub: open a Pull Request from `feature/short-name` into `develop` → get one approval → merge → delete the branch.

That is the entire workflow. Everything else in this document is detail.

---

# 1. Branch model

We use exactly two permanent branches. No `release/*`, no `hotfix/*`.

```text
                        main   ← stable, demo-ready. Do not touch.
                          ▲
                          │  release PR (team lead only)
                          │
                      develop   ← DEFAULT branch. All merged work lives here.
                       ▲   ▲   ▲
        ┌──────────────┘   │   └──────────────┐
        │                  │                  │
 feature/frontend-   feature/backend-     fix/ride-status
 login                 auth                 validation
        └──────┬───────┴─────────┬──────────┘
               │   Pull Request   │
               │   + 1 approval   │
               └────────┬────────┘
                        │
                     develop
```

| Branch | What it means | Who merges into it |
| --- | --- | --- |
| `develop` | Every completed feature, merged. Mostly works, may be rough. | Everyone, via PR |
| `main` | Reviewed, working, demo-ready. Only moves for a release. | Team lead only, via PR |
| `feature/*` `fix/*` `docs/*` | One person's one task. Lives for days, not months. | — |

Merge rules:

```text
feature/*, fix/*, docs/*  →  develop   (normal, frequent)
develop                  →  main      (stable milestones only)
```

Because `develop` is the default branch:

- opening the repo shows you `develop`, not `main`
- the **Code** button and `git clone` give you `develop`
- new Pull Requests already default to base `develop`
- still check the base branch before you click Merge

### Getting the code for the first time

```bash
git clone https://github.com/AKASHDAS7477/RideX_AXION.git
cd RideX_AXION
git config --global user.name  "Your Name"
git config --global user.email "your@email.com"
```

Your `user.name` and `user.email` are how GitHub knows which commits are yours. Set them once per machine. Check with `git config --global --list`.

---

# 2. Branch names

| Prefix | Use it for | Example |
| --- | --- | --- |
| `feature/frontend-` | New frontend work | `feature/frontend-login` |
| `feature/backend-` | New backend work | `feature/backend-rides` |
| `fix/` | A bug | `fix/ride-status-validation` |
| `refactor/` | Restructuring, no new behaviour | `refactor/fare-service` |
| `docs/` | Documentation only | `docs/api-documentation` |
| `chore/` | Deps, config, cleanup | `chore/update-dependencies` |

Never use: `mybranch`, `test`, `new`, `final`, `final2`, `akashbranch`, `temp`.

### One feature = one branch

A branch named `feature/akash` containing login + dashboard + payment + navbar + random fixes is unreviewable. Split it. Small PRs get approved fast; 400-line PRs sit for a week.

---

# 3. Commit messages

Format: `type: short description in the imperative`.

| Prefix | Meaning |
| --- | --- |
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Restructure, no behaviour change |
| `docs:` | Documentation |
| `style:` | Formatting only |
| `test:` | Adding or fixing tests |
| `chore:` | Deps, build, config |

```text
feat: add driver login
feat: add passenger ride booking
fix: prevent duplicate ride acceptance
refactor: move fare calculation into service
docs: update ride API documentation
test: add auth controller tests
chore: update dependencies
```

Never commit these:

```text
done
changes
final
updated
fixed stuff
```

If your commit message needs a paragraph to explain, the commit is doing too much. Split it.

```bash
git add .                             # stage everything
git add backend/src/routes/auth.routes.js    # or stage just one file
git status                            # confirm what is staged
git commit -m "feat: add user registration API"
```

---

# 4. The Pull Request

```text
your branch  →  push  →  open PR  →  review  →  fix requested changes
                    →  approval  →  merge into develop  →  delete branch
```

Opening one:

1. Push your branch (`git push -u origin feature/short-name`).
2. GitHub shows a **Compare & pull request** banner → click it.
3. Check the dropdowns: **base** must be `develop`, **compare** must be your branch.
4. Write the title and description below.
5. Request a review from a teammate.

Do not approve or merge your own PR. Do not merge unreviewed branches.

### PR title

Same format as commit messages:

```text
feat: add passenger ride booking
feat: implement driver authentication
fix: reject rides with invalid pickup point
```

### PR description template

```text
## What
One or two sentences a teammate who did not write this can understand.

## Changes
- Added ride model
- Added POST /api/rides
- Added validation
- Added authentication

## Testing
- Tested happy path with Postman
- Tested invalid input
- Tested unauthenticated request

## Screenshots
Required for frontend changes.
```

### Before you open the PR

```bash
# make sure you have the latest develop
git checkout develop
git pull origin develop
git checkout feature/short-name
git merge develop

# prove it still works
cd frontend && npm run build     # frontend
cd backend  && npm run dev       # backend, then hit your endpoints in Postman
npm test                         # if the project has tests

git push
```

Never open a PR that does not build.

---

# 5. Keeping your branch alive

Commit early and often so nothing is lost if your laptop dies:

```bash
git add .
git commit -m "wip: booking form validation"
```

You can push a branch as often as you like before it has a PR. Only `develop` and `main` need review.

---

# 6. Merge conflicts

A conflict means you and a teammate changed the same lines. Git refuses to guess.

```text
<<<<<<< HEAD
the code from your branch
=======
the code that came from develop
>>>>>>> develop
```

Fix it by hand:

1. Open the file and decide what the final code should be.
2. Delete the `<<<<<<<`, `=======`, `>>>>>>>` marker lines.
3. Stage and push:

```bash
git add backend/src/routes/ride.routes.js
git commit
git push
```

Do not blindly accept one side. Read both and make sure you did not delete someone else's work.

If a file conflicts so badly you cannot tell what happened, take theirs, then reapply yours:

```bash
git checkout --theirs backend/src/routes/ride.routes.js
git add backend/src/routes/ride.routes.js
git commit
```

`--theirs` is the incoming side (`develop`), `--ours` is your branch.

---

# 7. Never commit secrets

```text
.env
.env.local
node_modules/
dist/
build/
coverage/
.vscode/
API keys
database passwords
JWT secrets
payment secrets
```

Expected `.gitignore`:

```text
node_modules/
.env
.env.*
!.env.example
dist/
build/
coverage/
.vscode/
```

Commit `.env.example` with empty values so teammates know what to fill in:

```env
PORT=
MONGODB_URI=
DB_NAME=
JWT_SECRET=
CLIENT_URL=
```

If a secret ever gets committed, deleting the file in a later commit is not enough — assume it leaked, rotate it.

---

# 8. Files that conflict a lot

```text
frontend/package.json
frontend/package-lock.json
backend/package.json
frontend/src/App.jsx
frontend/src/routes/AppRoutes.jsx
README.md
frontend/DESIGN.md
```

Two people editing these at the same time will collide. Communicate first, keep the change focused, and pull `develop` before you start.

---

# 9. Command cheat sheet

| I want to | Run this |
| --- | --- |
| See what I'm working on | `git status` |
| See my uncommitted changes | `git diff` |
| See my branch | `git branch` |
| See all branches, local + remote | `git branch -a` |
| See recent commits | `git log --oneline` |
| See what I pushed | `git log --oneline -5` |
| Move to another branch | `git checkout branch-name` |
| Create a branch from `develop` | `git checkout -b feature/name` |
| Get teammates' latest code | `git pull origin develop` |
| Bring `develop` into my branch | `git merge develop` |
| Save everything | `git add .` |
| Save one file | `git add path/to/file.js` |
| Commit | `git commit -m "feat: message"` |
| Push a branch for the first time | `git push -u origin feature/name` |
| Push again | `git push` |
| Delete a merged local branch | `git branch -d feature/name` |
| Delete a merged remote branch | `git push origin --delete feature/name` |
| Park changes temporarily | `git stash` then `git stash pop` |
| Throw away changes (dangerous) | `git restore .` |
| Undo last commit, keep the work | `git reset --soft HEAD~1` |
| Throw away local `develop` | `git reset --hard origin/develop` |
| See the repo URL | `git remote -v` |
| Set your name/email | `git config --global user.name "Your Name"` |

Never use `git push --force` on `develop` or `main`. It rewrites shared history and deletes teammates' commits. If you think you need it on your own branch, ask first.

---

# 10. Troubleshooting

### "I edited files directly on `develop`"

Nothing is lost. Do not push. Move the work to a branch:

```bash
git stash                          # if you have not committed yet
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
git stash pop
```

If you already committed:

```bash
git log --oneline -5
git reset --soft HEAD~1            # undo the commit, keep the changes
git checkout -b feature/your-feature
git commit -m "feat: your message"
git push -u origin feature/your-feature
```

Then bring local `develop` back in line with the remote:

```bash
git checkout develop
git reset --hard origin/develop
```

### "My branch is behind `develop`"

```bash
git fetch origin
git merge origin/develop
git push
```

### "I committed the wrong file / forgot to add a file"

```bash
git add path/to/forgotten-file.js
git commit --amend --no-edit
```

Only amend commits you have not pushed yet. Once pushed, add a new commit instead.

### "I want to throw away one file's changes"

```bash
git restore path/to/file.js
```

### "I pushed a branch but there's no PR option"

Check the branch exists on the remote: `git push -u origin feature/short-name`. GitHub only offers a PR for pushed branches.

### "The PR shows a huge number of files"

Your branch was probably not branched from an up-to-date `develop`. Merge `develop` in and the diff should shrink. If it does not, check you did not accidentally commit `node_modules/` or `dist/`.

---

# 11. Release to main

Team lead only, when we want a stable demo or deployment.

On GitHub, open a Pull Request with base `main` and compare `develop`. Because `develop` is the default branch, GitHub pre-fills the base as `develop` — **change it to `main`**.

Then everyone syncs:

```bash
git checkout develop
git pull origin develop
git checkout main
git pull origin main
```

---

# 12. Golden rules

```text
 1. Never develop on main.
 2. Branch from develop, always pull develop first.
 3. One feature = one branch.
 4. Open a PR into develop, never into main by accident.
 5. One teammate reviews before merge. Never approve your own PR.
 6. Meaningful commit messages.
 7. Never push code you have not run or built.
 8. Never commit secrets or node_modules.
 9. Keep PRs small.
10. Communicate before touching shared files.
11. develop → main only for releases, team lead only.
12. Never force push develop or main.
13. Do not commit code you cannot explain.
```

---

# 13. Worked example

Akash builds the create-ride API.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/backend-create-ride
```

He writes the ride model, controller, `POST /api/rides`, validation, and tests. Then:

```bash
git status
git diff
git add .
git commit -m "feat: add create ride API"
git push -u origin feature/backend-create-ride
```

He tests the endpoint in Postman, opens a PR into `develop`, and the team reviews it.

After approval and merge:

```bash
git checkout develop
git pull origin develop
git branch -d feature/backend-create-ride
git push origin --delete feature/backend-create-ride
```

For the demo, the team lead opens a release PR from `develop` into `main`.