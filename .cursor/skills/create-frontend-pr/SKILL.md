---
name: create-frontend-pr
description: Use the GitButler CLI (`but`) to create a branch, commit changes, push, and open a GitHub PR in the frontend repo. Optionally accepts a description to filter which changes to include. Use when the user asks to push changes, create a PR, or commit using GitButler.
---

# Push and Create PR with GitButler

## Usage

- `/create-frontend-pr` — include all unstaged changes
- `/create-frontend-pr <description>` — only include changes related to the description (e.g. `/create-frontend-pr dark mode fix`)

## Prerequisites

GitButler must be set up in the repo (`but setup`). Run `but status` to verify.

## Steps

1. **Check workspace state**: Run `but status` to see unstaged changes and existing branches.

2. **Filter changes** (if a description was provided): Review the unstaged files and their diffs. Only include files that are related to the description. Read file contents or diffs if needed to determine relevance.

3. **Create a branch**: `but branch new <branch-name>`

4. **Stage files**: `but stage <file> <branch-name>` for each relevant file. Run `but status` after to confirm.

5. **Commit**: `but commit -m "<message>" --only <branch-name>`

6. **Push**: `but push`

7. **Create PR**: Use `-m` to pass title and body non-interactively:

```bash
but pr new <branch-name> -m "<title>

<body>"
```

The first line of `-m` is the PR title, the rest is the body.

## Notes

- `but pr` requires forge auth. If it fails, check `but config forge`.
- Use `but status` between steps to verify state.
