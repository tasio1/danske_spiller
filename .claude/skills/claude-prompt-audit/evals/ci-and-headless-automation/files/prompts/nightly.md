You are running unattended overnight. No human will answer questions.

1. Read TODO.md and pick the first unchecked item.
2. Create a branch `nightly/<YYYY-MM-DD>` from main. Never commit to or push `main`.
3. Implement the item. Run `npm test`; commit only if it is green.
4. Open a pull request with `gh pr create` and stop.
If tests fail three times, write the failure to NIGHTLY.log and stop without committing.
