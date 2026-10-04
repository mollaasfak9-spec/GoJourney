# RideX GitHub Guide - Beginner to Professional Workflow

Team workflow: we build from `develop`, merge everything into `develop`, and only release to `main`.

This document is the team's Git/GitHub cheat sheet.

## TL;DR - Our Branch Model

```text
main      = stable / released code. Do not touch.
develop   = all our merged work. This is where we build from.
feature/* = your own branch for one task. PR -> develop.
```

Daily loop:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-task

# ... work, then:
git add .
git commit -m "feat: short description"
git push -u origin feature/your-task

# open PR: feature/your-task -> develop
```

---

# 1. One-Time Git Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

Check:

```bash
git config --global --list
```

---

# 2. Clone the Project

Do NOT create separate unrelated repositories if the team agreed on one monorepo.

```bash
git clone <REPOSITORY_URL>
cd ridex
```

---

# 3. Understand Branches: `main` and `develop`

We use two permanent branches:

```text
main
 └── reviewed, working, stable (production)
      │
      └── develop
           └── all merged team code lives here (our working branch)
```

`main` should always represent code that is:

- reviewed
- working
- reasonably stable
- released / demo-ready

`develop` should always represent:

- all completed features merged together
- code that mostly works, but may still be unstable
- the branch every teammate works from

Rules:

- Do NOT develop features on `main`.
- Do NOT work directly on `develop` either. Feature branches come from `develop`.
- All Pull Requests merge into `develop`.
- `develop` is merged into `main` only when we want a stable release.

Full picture:

```text
  feature/frontend-login    --+
  feature/backend-auth      -----+--> develop --(release PR)--> main
  feature/frontend-booking --+       all merged code      stable
      (PR + review)
```

---

# 4. Get the Latest `develop`

`develop` is your starting point. Before starting work:

```bash
git checkout develop
git pull origin develop
```

If `develop` does not exist yet on GitHub, see section 4.1.

---

# 4.1 Create the `develop` Branch (One-Time Setup)

Only the team lead does this, once.

```bash
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

On GitHub, protect `develop` and `main`:

```text
Settings → Branches → Add rule
```

Suggested protection:

| Branch   | Require PR | Require review | Block direct push |
| -------- | ---------- | -------------- | ----------------- |
| `main`   | yes        | 1 approval     | yes              |
| `develop`| yes        | 1 approval     | yes              |

Optional: set `develop` as the repository's **default branch** so PRs target it by default.

---

# 5. Create Your Own Branch

Always branch from `develop`.

Frontend:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/frontend-passenger-booking
```

Backend:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/backend-auth
```

Bug:

```bash
git checkout develop
git pull origin develop
git checkout -b fix/login-validation
```

Documentation:

```bash
git checkout develop
git pull origin develop
git checkout -b docs/github-guide
```

---

# 6. Branch Naming Convention

Recommended:

```text
feature/frontend-<feature>
feature/backend-<feature>
fix/<bug>
refactor/<area>
docs/<topic>
chore/<task>
```

Examples:

```text
feature/frontend-login
feature/frontend-driver-dashboard
feature/backend-auth
feature/backend-rides
fix/ride-status-validation
refactor/fare-service
docs/api-documentation
```

Avoid:

```text
mybranch
test
new
final
final2
akashbranch
```

---

# 7. Check Your Current Branch

```bash
git branch
```

The branch with `*` is your current branch.

---

# 8. Check Changed Files

```bash
git status
```

---

# 9. Review Your Changes

```bash
git diff
```

Do this before committing.

---

# 10. Stage Files

All changes:

```bash
git add .
```

Better for important work:

```bash
git add src/routes/auth.routes.js
```

Then:

```bash
git status
```

---

# 11. Commit

Use meaningful commits.

Good:

```bash
git commit -m "feat: add user registration API"
```

```bash
git commit -m "feat: add passenger booking page"
```

```bash
git commit -m "fix: validate ride status transition"
```

Bad:

```bash
git commit -m "done"
git commit -m "changes"
git commit -m "final"
```

---

# 12. Recommended Commit Prefixes

```text
feat:
fix:
refactor:
docs:
style:
test:
chore:
```

Examples:

```text
feat: add driver login
fix: prevent duplicate ride acceptance
refactor: move fare calculation into service
docs: update ride API documentation
test: add auth controller tests
chore: update dependencies
```

---

# 13. Push Your Branch

First push:

```bash
git push -u origin feature/backend-auth
```

After that:

```bash
git push
```

---

Never push straight to `develop` or `main` - branch protection will block you, and that is intentional.

---

# 14. Create Pull Request

On GitHub:

```text
Your Branch (feature/*)
     ↓
Push
     ↓
Pull Request
     ↓
Code Review
     ↓
Fix requested changes
     ↓
Approval
     ↓
Merge into develop
```

Do not merge unreviewed feature branches into `develop`.

When opening the PR, always confirm the base branch is `develop`, not `main`.

---

# 15. Pull Request Title

Good:

```text
feat: add passenger ride booking
```

```text
feat: implement driver authentication
```

---

# 16. Pull Request Description

Use:

```text
## What
Added passenger ride booking API.

## Changes
- Added ride model
- Added create ride endpoint
- Added validation
- Added authentication

## Testing
- Tested with Postman
- Tested invalid input
- Tested unauthenticated request

## Screenshots
Add screenshots if frontend changes are included.
```

---

# 17. Keep Your Branch Updated

Before opening/merging your PR:

```bash
git checkout develop
git pull origin develop
git checkout feature/backend-auth
git merge develop
```

Resolve conflicts if needed.

Then:

```bash
git push
```

For beginners, `merge develop` is safer to understand than immediately using rebase.

---

# 18. If You Get a Merge Conflict

Git may show:

```text
<<<<<<< HEAD
your code
=======
someone else's code
>>>>>>> develop
```

Open the file and decide what the final code should be.

Then:

```bash
git add <file>
git commit
git push
```

Do not blindly choose one side without understanding the conflict.

---

# 19. Pull Latest Code Before Starting New Work

Every time:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-next-feature
```

This keeps your new branch based on current code.

---

# 20. Never Commit These

```text
.env
.env.local
node_modules/
dist/
build/
coverage/
IDE private files
API keys
database passwords
JWT secrets
payment secrets
```

Example `.gitignore`:

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

Do not ignore files that the whole team actually needs.

---

# 21. .env.example

Commit:

```env
PORT=
MONGODB_URI=
DB_NAME=
JWT_SECRET=
CLIENT_URL=
```

Do NOT put real values in it.

---

# 22. Useful Daily Workflow

Start work:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/frontend-login
```

Work.

Then:

```bash
git status
git diff
git add .
git commit -m "feat: add login page"
git push -u origin feature/frontend-login
```

Open Pull Request: `feature/frontend-login` -> `develop`.

After merge:

```bash
git checkout develop
git pull origin develop
```

Delete old local branch:

```bash
git branch -d feature/frontend-login
```

---

# 23. Important Rule for Shared Files

Some files will cause frequent conflicts:

```text
package.json
package-lock.json
README.md
App.jsx
AppRoutes.jsx
```

If multiple people edit the same file at the same time:

1. Communicate first.
2. Keep changes focused.
3. Pull latest develop before starting.
4. Resolve conflicts carefully.

---

# 24. Do Not Commit Broken Code

Before creating a PR:

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run dev
```

Also test the relevant API with Postman.

If the project has tests:

```bash
npm test
```

---

# 25. Professional Rule: One Feature = One Branch

Bad:

```text
feature/akash
```

containing:

```text
login
dashboard
payment
navbar
random fixes
```

Good:

```text
feature/backend-auth
feature/backend-rides
feature/frontend-login
feature/frontend-booking
```

Small PRs are easier to review.

---

# 26. Do Not Use Force Push Normally

Avoid:

```bash
git push --force
```

Especially on:

```text
main
develop
```

and shared branches.

If you truly need to rewrite your own branch history, understand the consequences before using force push.

---

# 27. Useful Git Commands

Check current branch:

```bash
git branch
```

Check all local + remote branches:

```bash
git branch -a
```

Check status:

```bash
git status
```

View commits:

```bash
git log --oneline
```

Switch branch:

```bash
git checkout branch-name
```

Create branch:

```bash
git checkout -b branch-name
```

Pull:

```bash
git pull
```

Push:

```bash
git push
```

Stage:

```bash
git add .
```

Commit:

```bash
git commit -m "message"
```

Show remote:

```bash
git remote -v
```

Delete a merged local branch:

```bash
git branch -d feature/backend-auth
```

Discard local changes (dangerous, throws work away):

```bash
git restore .
```

Stash work temporarily:

```bash
git stash
git stash pop
```

---

# 28. If You Accidentally Changed `develop` or `main`

Do not immediately push.

Check:

```bash
git status
git diff
```

If changes are not committed:

```bash
git stash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
git stash pop
```

Then commit on the feature branch.

If you already committed on `develop` by mistake:

```bash
git log --oneline -5
git reset --soft HEAD~1   # undo the last commit, keep the changes
git checkout -b feature/your-feature
git commit -m "feat: your message"
git push -u origin feature/your-feature
```

Then make local `develop` match the remote again:

```bash
git checkout develop
git reset --hard origin/develop
```

Never force push `develop` or `main`.

---

# 29. Recommended GitHub Branch Model

```text
                    main  (stable / release)
                      |
                      |  release PR (reviewed)
                      |
                    develop  (all merged team code)
                      |
        +-------------+-------------+-------------+
        |             |             |             |
     feature/      feature/      feature/      fix/  docs/
   frontend-login  backend-auth frontend-booking bug  topic
        |             |             |             |
        +--- Pull Requests --------+------------+
                      |
                    Review
                      |
                   develop
```

Merge rules:

```text
feature/*, fix/*, docs/*  ->  develop  (normal, frequent)
develop                  ->  main     (stable, demo-ready milestones only)
```

Only two permanent branches are needed: `main` and `develop`. You do NOT need `release/*` or `hotfix/*`.

---

## 29.1 Release: Merge `develop` into `main`

When the team wants a stable version (demo, submission, deployment):

Preferred, on GitHub - open a Pull Request with base `main` and compare `develop`. You get a clean change list and a recorded review.

Or from the terminal (team lead only):

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

Then everyone syncs:

```bash
git checkout develop
git pull origin develop
git checkout main
git pull origin main
```

---

# 30. Golden Rules

```text
 1. Never develop directly on main.
 2. Never work directly on develop either. Branch from develop.
 3. Pull latest develop before starting new work.
 4. One feature = one branch.
 5. Use meaningful commit messages.
 6. Test before pushing.
 7. Open a Pull Request into develop.
 8. Review teammates' code.
 9. Never commit secrets.
10. Keep PRs small.
11. Communicate before editing shared files.
12. Keep main stable; merge develop into main only for releases.
13. Always check a PR's base branch is develop.
14. Do not copy/paste code you cannot explain.
```

---

# 31. Complete Example

Akash is implementing ride creation.

```bash
git checkout develop
git pull origin develop

git checkout -b feature/backend-create-ride
```

Implement:

```text
Ride model
Ride controller
POST /api/rides
Validation
Tests
```

Check:

```bash
git status
git diff
```

Commit:

```bash
git add .
git commit -m "feat: add create ride API"
```

Push:

```bash
git push -u origin feature/backend-create-ride
```

Create PR:

```text
feature/backend-create-ride
              |
              v
           develop
```

After review and merge:

```bash
git checkout develop
git pull origin develop
git branch -d feature/backend-create-ride
```

Later, for the release/demo, the team lead merges `develop` into `main`:

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

That is the normal team workflow.

