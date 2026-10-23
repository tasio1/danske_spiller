# Prompt audit — Claude agents, workflows and build loop

Date: 2026-10-22 · Branch: `fix/article-skill-digit-keyword` · Auditor: Claude (manual pass)

Scope: every prompt that drives Claude in this repo.

| Surface | Files |
|---|---|
| Subagents | `.claude/agents/{product-manager,coder,designer,tester,releaser,seo,game-researcher}.md` |
| CI | `.github/workflows/{claude,claude-review,claude-conflicts}.yml` |
| Headless loop | `.claude/prompts/build-increment.md` run by `build-loop.sh` |

Method: read each prompt in full, then checked it against (a) the other prompts it hands work to, (b) the tools/permissions it is actually given, (c) the files and commands it references, and (d) evidence of how it behaved (git log, agent memories). Every finding cites its evidence.

Overall: the agent prompts themselves are strong — clear role boundaries, explicit retry caps, "NOT VERIFIED is never PASS", evidence-based gates. The real risk is in the seams: the **headless build loop bypasses the whole gated pipeline**, and **one shared check (`validate.js`) is trusted by five prompts for something it does not do**.

---

## High

### H1. `build-loop.sh` commits and pushes everything, on whatever branch is checked out, bypassing tester + releaser
- `build-loop.sh:75-87` runs `git add -A`, commits as "Auto-build: uncommitted leftovers", then `git push` to the current branch's upstream, "regardless of who committed it".
- `build-increment.md` never creates a task branch/worktree; it builds directly in the checkout.
- Contradicts `releaser.md:9` ("You are the only agent allowed to `git push`… ship exactly what the tester approved") and `product-manager.md:71` ("You never push… only through the releaser after a tester PASS").
- **Evidence:** the 5 most recent commits on this branch (`987ee14`, `8f70e87`, `bd6523e`, `de9e169`, `95b241a`) are Auto-build sweeps, and `origin/fix/article-skill-digit-keyword` contains them — so the loop has been committing onto a feature branch and pushing it. `git add -A` would also sweep any of the user's WIP in the working tree into such a commit.
- **Fix:** make the loop create `.worktrees/auto-<ts>` on `task/auto-<ts>` from `origin/master`, run `claude -p` there, and never push to `master` or the user's branch — open a PR (or leave the branch for the product-manager → tester → releaser). At minimum: refuse to run unless the checkout is `master` and clean; replace `git add -A` with `git add PROGRESS.md SCRATCHPAD.md`.

### H2. `node shared/validate.js` is trusted as the data gate, but its CLI only checks `shared/data/*`
- `shared/validate.js:132` reads only `shared/data`; running it now prints 4 shared files and `TOTAL: 0 errors` — no game `data.js` is loaded. Its header comment (line 2) claims "and per-game data.js files".
- Relied on as the game-data check by: `coder.md:33`, `releaser.md:28` ("if shared/data or any data.js changed"), `claude-conflicts.yml:94` (step 4), `claude-review.yml:45` (only runnable tool), `build-increment.md:78`.
- **Evidence:** tester memory `validate-js-scope.md` and `smoke-passes-on-placeholder-data.md` — a 760-item placeholder dataset ("Test sentence N", opt1/opt2) with wrong mode keys passed "validator 0/0" and smoke 28/28.
- **Fix:** extend the `validate.js` CLI to also load `*/data.js` (vm sandbox, `window.*_DATA`, plus the placeholder grep and MODES-key check from the tester memory). Until then, every prompt above should say "validate.js covers shared/data only; for game data also run …".

### H3. Build loop prompt is told to run checks it has no permission to run
- `build-loop.sh:66` allows only `Read,Write,Edit,Glob,Grep,Bash(git *)` (with `--dangerously-skip-permissions`, which makes the allow-list the only boundary that matters for intent but not for enforcement — see note).
- `build-increment.md:78,100,124` require running `shared/validate.js` and opening the game with zero console errors; `node` is not allowed, so the run must "implement its checks inline" by reading, or skip. "Opens in a browser without console errors" cannot be verified at all.
- Note: `--dangerously-skip-permissions` together with `--allowedTools` is contradictory; depending on CLI version the bypass flag wins, meaning there is effectively no tool boundary on an unattended run.
- **Fix:** drop `--dangerously-skip-permissions`; allow `Bash(node *)`; add an explicit "a check you could not run is reported as NOT VERIFIED in SCRATCHPAD, never as done" rule (the agents have it, the loop prompt does not).

## Medium

### M1. Agent memory writes dirty the worktree that agents must leave clean
- `coder.md:52`, `designer.md:44`, `tester.md:56` say "end of every task… record lessons" in `.claude/agent-memory/<agent>/`; same agents must "leave the worktree clean" (`coder.md:37`) and the releaser gate 3 refuses a dirty worktree.
- **Evidence:** releaser memory `feedback_tested_sha_mismatch_pm_override.md`: "Agent worktrees… are also often dirty with agent-memory files, failing gate 3."
- **Fix:** state where memory is written (main checkout path, absolute) and that it is committed by the product-manager on `master`, not in the task worktree — or add `.claude/agent-memory/` to the worktree's commit list explicitly.

### M2. `seo` and `game-researcher` are outside the pipeline the product-manager runs
- `product-manager.md:3,12` orchestrates only "coder, designer, tester and releaser"; `seo.md:20` says "the tester gates before release" but nothing dispatches it or tells the releaser its scope.
- Neither file sets `model` or `memory`; `seo.md:23` cites "`agent-delegation` §6" (Blocked report format) but the skill isn't preloaded in its frontmatter, so the agent can't see that section. `game-researcher.md:14` uses `danish-grammar-qa` without preloading it.
- `seo.md` has no worktree / commit / no-push rules at all, unlike every other writer agent.
- **Fix:** add both to the PM's agent list and gate table; add `skills:` frontmatter (`danish-seo-writing`, `danish-grammar-qa`, `agent-delegation`) and the standard worktree paragraph to `seo.md`; inline the Blocked-report line instead of a § reference.

### M3. `@claude` workflow has broad tools and no prompt
- `claude.yml:40` allows `Bash(git *)`, `Bash(node *)`, `Bash(npm *)` with `contents: write`, and passes no `prompt` — so none of the repo's rules (no force-push, no push to `master`, tester gate, placeholder-data rule) apply to `@claude` runs. `git *` includes `git push --force origin master`.
- **Fix:** add a short system prompt (`claude_args: --append-system-prompt`) with the hard rules: work on a new branch or the PR branch, never push `master`, never force, run the game-data check; narrow to `Bash(git status|diff|log|add|commit|push origin HEAD*)`.

### M4. `claude-conflicts` allows more than its prompt permits
- Prompt says merge only, never force-push (`:88-89`); tools allow all of `git *`. Commit message `merge: resolve conflicts with master` doesn't match the releaser's gate 5 pattern `feat|data|fix|chore(<scope>)`, so a resolved PR branch will later be refused by the releaser.
- **Fix:** narrow git tools; align the commit message to `chore(merge): resolve conflicts with master` or add `merge` to the releaser's allowed types.

### M5. Tester verdict vocabulary doesn't match its own rules or the releaser
- `tester.md:40` enum: `PASS | FAIL | PASS WITH ISSUES`; `tester.md:51` introduces `FLAKY`; `releaser.md:15` handles `FLAKY`. Report path: tester writes `<task-or-game-id>.md` (`:37`), releaser expects `<task_id>.md` (`:15`).
- **Fix:** add `FLAKY` to the enum; make the report path `<task-id>.md` only.

## Low

- **L1.** `build-increment.md:8` "Read the three source files" then lists four. Its commit format lacks the Co-Authored-By line that `releaser.md:19` requires.
- **L2.** `product-manager.md:89` self-improvement paragraph is the copy-pasted worker one with a parenthetical patch; `.claude/agent-memory/product-manager/` does not exist and no agent file has a `## Learned rules` section — the retro/promotion loop (`:81-86`) has never run. Either run it or cut it to save context.
- **L3.** Designer writes screenshots into the task worktree (`designer.md:34`) while tester writes them to the main checkout (`tester.md:15`) — PNGs end up in the designer's branch diff and must be in the releaser's allowed scope.
- **L4.** `claude-review.yml:41` asks to check 360 px layout and console errors, but the job has no browser and only `validate.js` to run. Tell it to flag these as "not verified by review" rather than imply coverage.
- **L5.** Model choice: all five pinned agents use `claude-sonnet-5-5`. Fine for coder/designer/releaser. Consider `claude-opus-5-5` for the product-manager (long-horizon orchestration, judgment calls) and possibly the tester (grammar audit is judgment-heavy). `seo`/`game-researcher` inherit whatever the session uses — pin them for predictability.

## What's working (keep)
- Explicit retry caps with "different hypothesis each time" and a single source of limits (`agent-delegation` §6).
- "A check you did not run is NOT VERIFIED, never PASS" (tester) and the releaser's sha-pinned gate — the memories show these catching real problems.
- Clear frozen-file lists and owner boundaries per agent.
- Reports capped at 10–15 lines to protect the orchestrator's context.

## Suggested order
1. H1 (stop the loop from pushing to feature branches) — operational risk today.
2. H2 (make `validate.js` cover game data) — one code change fixes five prompts.
3. H3 + M3 + M4 (tool allow-lists match prompt intent).
4. M1, M2, M5, then the lows.
