# Læseforståelse — re-plan around the agent pipeline and the worktree

## Context

The first plan (`docs/superpowers/plans/2026-10-06-laeseforstaaelse.md`, 1,600 lines, committed on `task/laeseforstaaelse` as `29598ce`) designed the game well but ignored how this repo ships work. Reading `.claude/agents/*`, the `agent-delegation` skill, `PROGRESS.md` and the releaser gate shows five conflicts:

1. **Wrong unit of work.** The repo ships *one task = one branch `task/<id>` = one worktree `.worktrees/<id>`*, small enough for one agent session, branched from clean `master`. My single `task/laeseforstaaelse` branch holding a whole game breaks that.
2. **Wrong agents.** Tests belong to the **tester** (only it edits `tests/`); theme CSS to the **designer** (`shared/themes/<game>.css`); head copy and sitemap to the **seo** agent. My plan had the coder doing all of it, and the coder grading itself.
3. **No spec.** Agents may not invent scope and may not edit `specs.md`/`prd.md`. A game that is not in `specs.md` gets moved to Blocked by the product-manager.
4. **No web access where it is needed.** `coder` and `tester` have no WebSearch/WebFetch, but the texts need verified facts. Fact-gathering must be a separate step by an agent that has web tools.
5. **Possible scope overlap.** `specs.md` bans "another conjunction cloze game" (Konjunktion Crush), "another connector game" (Forbindeord) and "another general adverb game" (Adverbier og bindeord). The PD3 delprøve-3 mode (connectors and adverbs gapped in a 1.5-page article) sits next to all three. The spec must state the boundary and you must accept it.

Intended outcome: the same game as before (4 PD3-format modes + Eksamenstilstand, split-reader layout, no invented people or quotes, 10 texts in phase 1 and 20 in phase 2), delivered as ~22 backlog tasks that the product-manager can dispatch through coder → tester → releaser.

## Decisions already made (this session)

- **Spec:** I draft it; you review and add it to `specs.md` / `improvement/specs.md` on `master`. No agent edits those files.
- **Data layout:** one file per mode — `laeseforstaaelse/data.js` is a small registry; texts live in `data-skim.js`, `data-mc.js`, `data-insert.js`, `data-cloze.js`. Disjoint files let authoring tasks run in parallel. (Small, deliberate deviation from "one data.js".)
- **Texts:** original, no invented people, no quotes, facts sourced. Phase 1 = 10 texts, phase 2 = the other 10.

## What happens to what exists

| Item | Action |
|---|---|
| `docs/superpowers/plans/2026-10-06-laeseforstaaelse.md` | Kept as the **design reference**: the validator code, the split-reader CSS, the ten layout decisions and the text manual are reused verbatim by the tester/coder/PM tasks below. This rebuilt plan supersedes its task list. |
| `.worktrees/laeseforstaaelse` / `task/laeseforstaaelse` | Docs-only (plan + `game-ideas*.md`). **Not** a game branch. Its docs land on `master` (step 0), then the branch and worktree are removed. |
| `game-ideas.md`, `game-ideas-raw.md` | Land on `master` with the docs. |
| Main checkout on `skill/danish-learning-articles` | Untouched. The new `writing-danish-learning-articles` skill there is optional input for the text rules; not a dependency. |

## Step 0 — master-owned groundwork (product-manager + you, no agents)

Edited on `master` only, because PM/spec files never go on task branches.

0. **Blocker: the main checkout is on `skill/danish-learning-articles`, not `master`.** The releaser refuses to merge unless `master` is checked out in the main worktree with nothing uncommitted except tester output, and the tester writes its reports into the main checkout's `docs/redesign/`. That branch also holds uncommitted work (a modified `game-ideas.md`, the untracked `writing-danish-learning-articles` skill and `content/`). **You** decide what happens to it (commit it on its own branch, or stash it with a unique tag) and switch the main checkout back to `master` before any release. I will not touch it.
1. **You** commit the docs from this branch to `master` (plan, `game-ideas*.md`, and the spec section below) as one `chore(docs)` commit, then I remove `task/laeseforstaaelse`.
2. **You** add the spec section (Appendix A) to `specs.md` and `improvement/specs.md`, after accepting the overlap boundary (Risk 1).
3. **PM** adds a skill `.claude/skills/laese-text-authoring/SKILL.md` — the text manual (no people/quotes, banned AI-signal phrases, near-miss rule for hæfter, one defensible answer per question, fact-sheet-only writing). PM owns `.claude/skills`; coder, tester and fact-checkers load it by path.
4. **PM** appends the tasks below to `PROGRESS.md` in its existing schema (`id / spec / type / status / priority / depends_on / title / acceptance / notes`) and the `Game Quick Reference` row.

## The backlog

Allowed-file sets are disjoint wherever tasks run in parallel. "Gate" is the fixed order from `agent-delegation`: coder → tester → releaser.

### Phase 1 — playable game on 10 texts

| id | agent | depends_on | allowed files | acceptance (≤6 checkable lines) |
|---|---|---|---|---|
| `laese-validator` | tester | spec | `tests/laeseforstaaelse-data.mjs`, `tests/fixtures/laese/*` | Fails on a bad fixture for each rule (banned phrase, quotation mark, wrong counts, bad `solution`, bad `{{n}}` markers); passes on a good fixture; `--expect=a,b,c,d` supported; runs in <1 s. Pattern: `tests/pronomen-data-guard.mjs`. |
| `laese-facts-a` … `laese-facts-d` | general-purpose (has web) | skill | `docs/laeseforstaaelse/facts/<id>.md` (one file per text) | Per text: 6–12 facts, each with the **verbatim source sentence**, URL and fetch date; no prose written for the game; unconfirmable figures listed as `UNCONFIRMED`. Batches: a = ulven, dialekter, efterskole · b = kolonihave, rebildfest · c = samsoe, madspild · d = bakken, cykelsti, gaekkebrev. |
| `laese-facts-verify` | a different general-purpose dispatch | facts-a…d | same `facts/` files | Independently re-fetches every URL and confirms every figure; marks each `CONFIRMED` / `CHANGED` / `UNCONFIRMED`. The author of a sheet never verifies it. |
| `laese-shell` | coder | spec, validator | `laeseforstaaelse/index.html`, `laeseforstaaelse/data.js`, `laeseforstaaelse/data-mc.js` | Boots from `file://` with zero console errors; start button has id `btn-play` (the default selector of `tests/smoke.mjs`, which the releaser runs before merging); start screen = title + Spil + mode/level controls + disclaimer; **split-reader** (reading pane + question pane, both scroll, page does not) per layout decisions 1–3, 5, 9, 10; `mc` mode playable end-to-end on `art-ulven`; SRS keys `laeseforstaaelse:mc:<id>`; `node tests/laeseforstaaelse-data.mjs` exits 0. Structural CSS only. Reuse the CSS block and `api` design from the reference plan, Task 3. |
| `laese-theme` | designer | shell | `shared/themes/laeseforstaaelse.css` | Newsprint palette and the evidence highlighter; light, sepia and dark papers (decision 4's CSS); contrast ≥4.5:1 in all three; screenshots at 360, 820, 1440; reduced-motion safe. Does not touch `index.html`. |
| `laese-mode-skim` | coder | shell | `laeseforstaaelse/index.html`, `data-skim.js` | 15 short-answer questions; hæfte jump-list (decision 7); `accepted[]` via `DanskCore.diff.check`; 30 s nudge never auto-advances; one sample hæfte passes the validator. |
| `laese-mode-insert` | coder | mode-skim | `index.html`, `data-insert.js` | Tap-to-select-then-place; 5 slots + 7 blocks; slots inline and dashed (decision 8); two blocks unused; wrong placement shows the cohesion note; keyboard reaches every block and slot. |
| `laese-mode-cloze` | coder | mode-insert | `index.html`, `data-cloze.js` | `{{n}}` markers become inline buttons; 4 options, keys 1–4; summary names the weakest connector type via `DanskCore.srs.pattern`. |
| `laese-summary-exam` | coder | mode-cloze | `index.html` | Round-end per `PROGRESS.md` spec (score, accuracy, ≤3 weakest, Spil igen, optional Gentag fejl); Eksamenstilstand chains the 4 parts (25 + 65 min budget, Træning default, no pass/fail claim). |
| `laese-data-mc` / `-skim` / `-insert` / `-cloze` | coder | the mode's renderer task + that batch's `facts-verify` | `data-<mode>.js` only | Texts written **only from the verified fact sheet**; counts exact (`--expect`); validator exits 0; every figure traceable to a sheet line; `verify: true` where unsure. No clone-generators or filler (the `saetning-data` lesson). The four tasks run in parallel. |
| `laese-seo` | seo | all modes + data | `laeseforstaaelse/index.html` `<head>`, static intro/FAQ, `sitemap.xml` | Primary keyword `læseforståelse dansk øvelser`; JSON-LD; the "ikke officielt prøvemateriale" line stays visible; `tests/seo-static.mjs` passes. |
| `laese-home-card` | coder | seo | root `index.html` (games array **and** static cards) | Card opens the game; both places in sync; existing sprite reused (a new sprite is a shared-system request to you, because `shared/sjovt.js` is frozen). |
| `laese-ux-tune` | designer, then tester | all modes | `shared/themes/laeseforstaaelse.css`, `docs/redesign/reports/laeseforstaaelse-layout.md` | Six viewports (1920×1080, 1440×900, 1280×720, 1024×768, 820×1180, 360×640): measured chars/line, visible-text share and panel height per mode; the 10-point checklist from the reference plan, Task 13, with before/after numbers; items that did not improve are listed `open`. |
| `laese-native-review` | you / a native speaker | data tasks | `data-*.js` (`verify:true` flags) | Every phase-1 text read aloud; each verdict recorded; flags cleared or the text fixed. Backlog item, never skipped. |

Granularity note: the finished games in `PROGRESS.md` use coarser chains (`data → game-1 → game-2`). This backlog follows the `agent-delegation` rule instead (data task + shell + one slice per mode) because texts need web-researched facts and a native review, which the older games did not. If you prefer the coarser shape, merge the four renderer tasks into two and the four data tasks into one.

Every coder task is gated by the tester, who extends `tests/laeseforstaaelse.mjs` (boot, round loop, persistence, keyboard, 360 px, dark, reduced motion) at that gate and writes `docs/redesign/reports/<task-id>.md` with `Tested: <branch>@<sha>`. The releaser merges only that exact sha.

### Phase 2 — the other 10 texts (P2, after `laese-ux-tune`)

`laese-facts-e…`, `laese-facts-verify-2`, `laese-data-*-2` with the same shape: web fact sheets → independent verification → coder writes from the sheets → tester audit → native review. Topics: oefaerge, sprogcenter, pantogenbrug, vadehavet (hæfter); janteloven, kontanter (mc); christiania, vaernepligt (insert); fredagsbar, rewilding (cloze).

## Parallelism (all file sets disjoint, separate worktrees)

```
Wave 1   laese-validator ∥ laese-facts-a..d ∥ laese-shell
Wave 2   laese-facts-verify ∥ laese-theme ∥ laese-mode-skim ∥ laese-data-mc
Wave 3   laese-mode-insert ∥ laese-data-skim            (index.html is serial: one coder branch at a time)
Wave 4   laese-mode-cloze ∥ laese-data-insert
Wave 5   laese-summary-exam ∥ laese-data-cloze
Wave 6   laese-seo → laese-home-card → laese-ux-tune → laese-native-review
```

All renderers edit `index.html`, so they run one at a time; only text authoring and theme work fan out. Each worktree is created from the current clean `master` at dispatch: `git worktree add .worktrees/<id> -b task/<id> master`.

## Risks and things you must decide

1. **Overlap with Konjunktion Crush / Forbindeord / Adverbier og bindeord.** The spec boundary I propose: those games drill connectors on isolated sentences; Læseforståelse's `cloze` asks the learner to choose a connector or adverb from four options inside an authentic 1.5-page text, scored per connector type. If you consider that the same game, drop `cloze` from the spec and keep three modes.
2. **Fact accuracy has no automatic gate.** Neither coder nor tester can browse. The control is process: verbatim source sentences, an independent re-fetch, a figure-to-sheet trace by the tester, and your spot-check of 2–3 sheets. Anything unconfirmed is left out of the text.
3. **Hæfte practical details (times, prices) are exercise values.** The footer says so; the tester checks the footer renders on every text.
4. **Native-speaker review is the real quality gate** and is a backlog task, not an afterthought. Until it is done every text carries `verify: true`.
5. **Volume.** Phase 1 is ~70 answerable items across 10 texts. Phase 2 brings the total to 165. Cut phase 2 first if the budget shrinks.

## Verification (how to know the rebuilt plan worked)

- After step 0: `git log master` shows the docs commit; `specs.md` has the section; `PROGRESS.md` lists the tasks; `git worktree list` no longer shows `task/laeseforstaaelse`.
- Per task: the tester's report says `Verdict: PASS` with `Tested: <branch>@<sha>`; `node tests/laeseforstaaelse-data.mjs --expect=…` exits 0; `node shared/validate.js` still reports 0 errors; `git diff --stat master...task/<id>` touches only the task's allowed files.
- End of phase 1: the game opens from `file://` with zero console errors; the `layout` spec passes at all six viewports; `laese-ux-tune`'s report has before/after numbers; `tests/smoke.mjs laeseforstaaelse/index.html` passes; every phase-1 text has a recorded native-review verdict.

## Appendix A — spec section to add to `specs.md` (draft for you to review)

```
### laeseforstaaelse
- **Folder:** `laeseforstaaelse/`
- **Files:** `index.html`, `data.js` (registry), `data-skim.js`, `data-mc.js`, `data-insert.js`, `data-cloze.js`
- **Game ID:** `laeseforstaaelse`
- **Status:** Planned
- **Levels:** B1–B2
- **Domain:** Reading comprehension in the format of Prøve i Dansk 3, over original Danish texts about Denmark
- **Scope boundary:** Skrivekontrollen tests writing (error correction); this game tests reading. Konjunktion Crush, Forbindeord and Adverbier og bindeord drill connectors on isolated sentences; here connector and adverb choice is tested only inside a continuous 1.5-page text (cohesion), scored per connector type. Not an official exam and never presented as one.
- **Modes (4 + sitting):**
  1. Find oplysningen — hæfte of 8–10 short notices, 15 short-answer questions (30 s per question guidance)
  2. Læs og vælg — one article, 3 multiple-choice questions, 3 options
  3. Sæt afsnittet ind — 5 removed paragraphs, 7 offered, 2 distractors
  4. Det manglende ord — 8 connector/adverb gaps, 4 options
  5. Eksamenstilstand — modes 1–4 in order, 25 + 65 minute budget; Træning is the default
- **Content rules:** all texts newly written; no invented people, no quotation marks, no `siger X`; every figure traceable to a source recorded in `sources[]`; footer "Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se kilder."; one defensible answer per question; hæfte practical details are exercise values
- **Item targets:** phase 1 = 2 hæfter, 3 mc, 2 insert, 3 cloze (10 texts, ~70 items); phase 2 = 6 / 5 / 4 / 5 (20 texts, 165 items)
- **Layout:** split reader — scrollable text pane plus question pane, both independent (≥1024 px and tablet landscape), docked collapsible panel below on narrow screens; 60–75 characters per line; text-size control; paper light/sepia/dark; margin paragraph numbers; the text is never covered by feedback
- **Visual theme:** newsprint reading room; paper #F4F0E6, ink #1E1C1A, highlighter #E0B43C, accent #2F6F6B (check against Skrivekontrollen's paper and proof red)
- **Full spec:** `docs/superpowers/plans/2026-10-06-laeseforstaaelse.md` (design reference)
```
