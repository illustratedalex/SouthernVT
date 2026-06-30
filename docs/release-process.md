# Release Process

Current release: v0.2.0-alpha

## Build
- Run `npm.cmd run build` from the repository root.
- Confirm the build completes without TypeScript or route-generation errors.

## Review Routes
- Check the public routes listed in `docs/qa-checklist.md`.
- Check the Basecamp routes listed in `docs/qa-checklist.md`.
- Spot-check mobile layouts, empty states, and obvious navigation links.

## Commit
- Review the diff with `git status` and `git diff`.
- Stage only the intended release-prep changes.
- Commit with a message that describes the freeze or release prep.

## Tag a Release
- Create the tag from the release commit with `git tag v0.2.0-alpha`.
- Push the commit and tag together.

## Roll Back to a Tag
- Inspect a tagged release with `git switch --detach v0.2.0-alpha`.
- Create a recovery branch from the tag with `git switch -c hotfix/v0.2.0-alpha v0.2.0-alpha`.
- Use the tagged state as the baseline for any rollback or recovery work.