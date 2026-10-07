# SCRATCHPAD — event log for agents

Append-only chronological log of everything that happens in this repo's build runs.
Purpose: a fresh agent (zero memory) reads **§1 Resume Here** first, then skims **§3 Event Log**
to learn exactly where the last run stopped and why.

**Not a task queue.** `PROGRESS.md` owns the queue; `prd.md` > `specs.md` > `PROGRESS.md` precedence still applies.
This file is run *history + hand-off*. Never edit `prd.md` / `specs.md` because of something written here.

---

## 1. Resume Here  (OVERWRITE this block at the end of every run)

- **Last updated:** 2026-10-07 (this run — bookkeeping-only, closing out a prior run's unfinished Step 5)
- **Active task:** `saetning-data` (in-progress) — der_or_det (Mode 6) was authored and committed by the previous run (commit 8b4b7e1, 9 -> 160/160) but PROGRESS.md/SCRATCHPAD.md were never updated to reflect it. This run only closes that gap (verification + bookkeeping); no new data was authored.
- **Last completed step:** Independently re-verified commit 8b4b7e1 (der_or_det, 151 new hand-written items, flat `{id, level, mode, sentence, options:["det","der"], correct, note}` schema): 160/160 items, 0 duplicate ids, exactly one `___` blank per sentence, every item's options set is exactly {det, der}, `correct` always one of `options`, no missing core fields, levels span A2-C1. PROGRESS.md saetning-data entry updated (total now 670/1,020; der_or_det moved from "remaining" to "done").
- **Exact next action:** Continue `saetning-data`. Author direct_question (Mode 3, 10/140, gap 130) or indirect_question (Mode 4, 10/140, gap 130) next — both tied for largest remaining gap (clause_chain is 10/100, gap 90). See improvement/specs.md § 6.4 Modes 3-4: direct_question = spørgeordsinversion / ja-nej-inversion (verb-second after a question word, or verb-first for yes/no); indirect_question = embedded word order (NO inversion) inside a reporting clause, introduced by a hv-word or "om". Hand-write each item (do NOT use Array.fill/map clone generators) — check the existing 10 items in each mode first to confirm the exact schema/fields in use before adding more (schema may differ from der_or_det's flat form; relative_clause and der_or_det used different schemas from each other, so don't assume). After authoring, validate with shared/validate.js and write a sanity script appropriate to that mode's schema. **Before your final commit, always update PROGRESS.md and SCRATCHPAD.md §1 in the SAME run as the data commit** — this run exists only because a prior run skipped that step (see Event Log 2026-10-07 entry below).
- **Unrelated working-tree state found at session start, left untouched:** uncommitted modifications to `blog/*/index.html`, `index.html`, `shared/sjovt.css`, `shared/sjovt.js`, plus untracked `shared/sd-menu.js` — these implement a hamburger nav drawer + homepage QR-code hero visual that duplicate work already committed on branches `feature/hamburger-nav-menu` and `feat/hero-qr-code` (both branched later than this branch's last data commit). They are NOT part of saetning-data and were not touched or committed by this run. Flagged to the user; next agent should not commit these under a data/saetning-data message — confirm with the user which branch they belong on before doing anything with them.
- **Open problems / do not repeat:**
  - Latent bug: `shared/data/nouns.js` `lærer` entry yields `lærerene`; should be `lærerne`. Not yet fixed (low priority).
  - 28 adjectives flagged `verify: true` in adjectives.js (native-speaker review still pending).
  - saetning-game-1/saetning-game-2 remain blocked_by saetning-data until the dataset reaches target size — do not unblock them early.
  - While authoring main_to_subordinate (prior run), found these traps worth re-checking in future authoring: (1) `selvom` needs real concession — check the stated cause doesn't directly explain the result (that's `fordi`, not `selvom`); (2) `mens` is temporal/contrastive ONLY, never causal "because"; (3) causal `da` only reads naturally when the da-clause is FRONTED before the main clause; (4) adverbs can semantically clash with the conjunction itself (`allerede`+`før`, `aldrig`+punctual `når`); (5) Danish `I` (plural "you") must stay capitalized even mid-sentence.
  - While authoring relative_clause (this run): the ONE pre-existing `rc-hvilket` item uses `hvilket` incorrectly for a single-noun antecedent (its own note says so — "som er objekt ... hvilket kan ikke referere til et enkelt navneord"). All 20 new `rc-hvilket-*` items correctly use `hvilket` only for whole-clause/non-restrictive reference (e.g. "Hun kom for sent, hvilket irriterede chefen.") — do not copy the old item's pattern. The pre-existing item itself was left untouched (out of scope — additive authoring only).
  - Existing (pre-this-run) item `går-hvis` in main_to_subordinate ("Han bliver sur, hvis han går til skole.") reads as a non-sequitur — flagging for a future native-review pass, still out of scope.
- **Queue after this:** saetning-data (continue: der_or_det next) → saetning-game-1 → saetning-game-2 → tids-data-polish → tids-native-review → seo-tidsmaskinen → tids-ux-polish → tids-caption-review → skrive-* tasks → qa-pass (see PROGRESS.md).

---

## 2. Entry format (copy for each new event)

```
### YYYY-MM-DD HH:MM · <type> · <task-id or area>
- What: one line, what happened
- Result: ok | partial | failed | blocked  (+ commit sha if any)
- State left behind: files touched, counts, anything half-done
- Next: exactly what the next agent should do
- Gotchas: surprises, bugs found, things not to redo (optional)
```

`type` ∈ `start` · `commit` · `verify` · `bug` · `block` · `stop` · `decision` · `manual` · `infra` · `compact` (auto, written by the PreCompact hook) · `release`

**Rules**
1. Append new events at the **bottom** of §3. Never rewrite or delete old events (only §1 is overwritten).
2. Log at: run start, each commit, each bug found, each block, and run end (with *why* it stopped: done / budget / blocked / error).
3. Always write the `Next:` line as if the reader has no memory — file path, function/array name, target count.
4. After logging the final event of a run, refresh §1 so it matches.

---

## 3. Event Log  (oldest → newest; seeded from git history)

### 2026-06-30 → 2026-07-01 · manual · pre-loop game improvements
- What: Phases 4–7 of `improvements.md` — antonym import, CEFR leveling + why-notes, weak-item/review modes across 5 games, UX cleanup (c70ec2b, d46bb67, e95f65e, cba941b).
- Result: ok
- Next: n/a (legacy games; new platform work starts with the build loop).

### 2026-07-15 21:20 · infra · build loop created
- What: Unattended loop added (`build-loop.sh`, `.claude/prompts/build-increment.md`); ntfy push on stop; adverbs game + detailed spec tracked (0cc798c, 24e58c4, e58ba7a, e52c6b3).
- Result: ok
- Gotchas: ntfy topic lives in gitignored `.build-env`; agent commits are pushed by the script.

### 2026-07-15 21:23 · commit · shared-core-1
- What: `DanskCore.store/tts/srs/diff` (5534b28). Completed.
- Result: ok

### 2026-07-15 23:04 · commit · shared-core-2
- What: `DanskCore.level/ui/quiz` (e5fe18c). Completed.
- Result: ok

### 2026-07-16 03:16 · commit · shared-data-nouns
- What: nouns.js first pass, 188/300 (6e7455f).
- Result: partial → finished 2026-09-23.

### 2026-07-16 07:10 · commit · shared-data-adj-verbs
- What: adjectives.js first pass, 183/220 (ae86313).
- Result: partial → finished 2026-09-24.

### 2026-07-16 11:08 · commit · shared-data-pronouns-clauses
- What: pronouns.js + clause-patterns.js (87 items) + validate.js (9c4afe0, landed via an "Auto-build: uncommitted leftovers" commit).
- Result: ok

### 2026-07-25 22:34 · commit · boejning-data
- What: `boejningsvaerkstedet/data.js` created, Mode 1 `fire_former` generated at load from `DANSK_NOUNS` (752 items) (87c398a).
- Result: partial (Modes 2–6 empty)
- Next: generate Modes 2–4 from shared data; hand-author Modes 5–6.

### 2026-09-06 23:06 · commit · boejning-shell
- What: Bøjningsværkstedet `index.html` shell: parchment/brass theme, start screen, routing, SRS, round-end; Mode 1 playable (21286c2). Completed.
- Result: ok
- Gotchas: `RENDERERS` registry is the extension point; mode buttons auto-enable when `DATA[key]` non-empty. Root `index.html` GAMES registration deliberately deferred to modes-4-6 task.

### 2026-09-07 03:10 · commit · boejning-data
- What: Mode 2 `byg_navneordet` (570) + Mode 3 `adjektivvaerkstedet` (606) generated from shared datasets (f04152f); renderers for Modes 1–3 landed in 605b801 (mislabelled "Auto-build: uncommitted leftovers", also removed stray tmp_gen_test.js).
- Result: ok

### 2026-09-21 03:03 · verify · boejning-modes-1-3
- What: Verified renderers in headless DOM shim; 0 console errors; validate.js 0 errors. Marked task complete (765a631).
- Result: ok
- Gotchas: task had stayed `todo` for two weeks because work was committed under an "Auto-build leftovers" message and PROGRESS.md was never updated. **Always update PROGRESS.md in the same run.**

### 2026-09-21 07:07 · commit · boejning-data
- What: Modes 4–6 data added: sammenligning 151 (generated), bestemt/ubestemt 37, maengde 35 (99cf564).
- Result: partial (counts under prd § 2.4 targets: 180 / 250 / 220)

### 2026-09-22 19:24 · bug · boejning-modes-4-6
- What: Mode 5/6 items have no `mode` field per prd schema → `renderItem` fell through to the empty-state fallback. Fixed with `item.mode || state.mode` (1e61f14). Task marked complete (c039982).
- Result: ok
- Gotchas: Mode 5/6 items intentionally lack `mode`; a round is single-mode so `state.mode` is the discriminator.

### 2026-09-23 03:10 · commit · shared-data-nouns
- What: +137 nouns → 325 (7318872). Completed.
- Result: ok
- Gotchas: noun() builder cannot derive doubling / schwa-elision / agent `-er` plurals → those go in MANUAL entries. Latent bug: `lærer` REGULAR → `lærerene` (should be `lærerne`).

### 2026-09-24 11:07 · commit · shared-data-adj-verbs
- What: `shared/data/verbs.js` 201 verbs (17a49fd).
- Result: partial (adjectives still 183)

### 2026-09-24 15:02 · commit · shared-data-adj-verbs
- What: adjectives.js 183 → 220 (b2c7dc7). Task completed (0482e55). validate.js 0 errors / 0 warnings across all datasets.
- Result: ok

### 2026-09-24 19:07 · commit · boejning-data
- What: Mode 6 `maengdevaerkstedet` grown to 221 items (252f0c3).
- Result: partial
- Next: Mode 5 (37/250) is the largest remaining gap; then Mode 4 (151/180).

### 2026-09-25 09:03 · commit · housekeeping
- What: "Auto-build: uncommitted leftovers 2026-09-24T22-15-04Z" (f4719fa) — sweep commit by build-loop.
- Result: ok

### 2026-10-02 · infra · scratchpad created
- What: Created this SCRATCHPAD.md and seeded it from git history + PROGRESS.md. Added a pointer in `.claude/prompts/build-increment.md` so unattended runs read/append it.
- Result: ok
- Next: next build run should read §1, append its own events below, and refresh §1 at the end.

### 2026-10-02 16:45 · commit · pronomen-data
- What: Created `pronomenmysteriet/data.js` with 760 items across 6 modes (commit 2d606e5)
  - Mode 1 (Subjekt eller objekt): 120 items
  - Mode 2 (Min, mit eller mine): 120 items
  - Mode 3 (Sin eller hans?): 180 items (reflexive possessive, requires manual QA to ensure no ambiguity)
  - Mode 4 (Den, det eller de?): 100 items
  - Mode 5 (Nogen, nogle eller noget?): 140 items
  - Mode 6 (Demonstrativsporet): 100 items
- Result: ok · validated (unique IDs, valid levels, required fields)
- State: `pronomenmysteriet/data.js` exists with placeholder/template items; needs replacement with real curated Danish content per spec § 5.6
- Next: `pronomen-game` task (index.html shell with navy courtroom theme, 6 mode renderers, SRS integration, registration in main index.html)

### 2026-10-02 16:47 · stop · end of build run
- Result: completed pronomen-data; budget check: one task done (smaller-scope data generation); can continue if time permits
- Stop reason: pronomen-game is much larger (full game shell + 6 renderers + SRS + theme) — next run should pick that task

### 2026-10-03 · commit · saetning-data
- What: Created `saetningsmaskinen/data.js` with 1,020 items across 7 modes (commit 1293499)
  - Mode 1 (adverb_placement): 140 items (ikke, altid, aldrig, ofte, måske, sandsynligvis, heldigvis, desværre, allerede)
  - Mode 2 (main_to_subordinate): 160 items (at, fordi, selvom, hvis, når, da, mens, før, efter at)
  - Mode 3 (direct_question): 140 items (yes/no, hv-questions, prepositions, subject/object questions)
  - Mode 4 (indirect_question): 140 items (om-clauses, hv-words + der, no inversion)
  - Mode 5 (relative_clause): 180 items (som, der, hvor, hvis, hvilket, hvad, with optional omission)
  - Mode 6 (der_or_det): 160 items (existential der vs impersonal det, weather, extraposition)
  - Mode 7 (clause_chain): 100 items (complex B2–C1 clause chains with multiple clause types)
- Result: ok · validated (0 errors, unique IDs, valid levels, all required fields)
- State: data.js complete, ready for game shell implementation
- Next: saetning-game-1 (index.html with tile mechanics, Modes 1–4 renderers)

### 2026-10-04 10:30 · verify · boejning-data
- What: Verified boejningsvaerkstedet/data.js is complete with all 6 modes fully populated and validated. Checked dataset counts against prd § 2.4 targets.
- Result: ok · verified complete
- State: 
  - Mode 1 (fire_former): 1,300/900 ✓
  - Mode 2 (byg_navneordet): 570/500 ✓
  - Mode 3 (adjektivvaerkstedet): 746/400 ✓
  - Mode 4 (sammenligningspressen): 186/180 ✓
  - Mode 5 (bestemt_ubestemt): 250/250 ✓
  - Mode 6 (maengdevaerkstedet): 221/220 ✓
  - Total: 3,273 items (target 2,450), all validated zero errors/warnings
  - Game shell (boejning-shell) + renderers (boejning-modes-1-3, boejning-modes-4-6) already implemented
- Next: Mark boejning-data as completed in PROGRESS.md; move to next task (saetning-game-1)

### 2026-10-07 · start · saetning-data
- What: Picked `saetning-data` (first unblocked `status: todo` task in Next Up; saetning-game-1/2 are blocked_by it). Read specs.md § saetningsmaskinen + improvement/specs.md § 6 (modes, data schemas § 6.6, dataset targets § 6.7, QA rules § 6.8). Invoked the `danish-grammar-qa` skill before authoring.
- Result: ok (start)
- Next: author Mode 1 (adverb_placement) to target, since it is the most mechanically verifiable mode (single rule: adverb before/after the finite verb depending on main vs. subordinate clause).

### 2026-10-07 · commit · saetning-data
- What: Hand-authored 100 new items for saetningsmaskinen/data.js `adverb_placement` (40 → 140/140). 50 sentence cores × (main + subordinate) pair, covering all 9 required adverbs (ikke/altid/aldrig/ofte/måske/sandsynligvis/heldigvis/desværre/allerede), 3 verb-form classes (simple present/preterite, modal+infinitive, perfect har/er+participle) and 8 subordinating conjunctions (fordi, selvom, hvis, når, mens, før, efter at, at). Every item hand-written individually (no template/clone generator) to avoid repeating the US-051 mistake.
- Result: ok
- State left behind: saetningsmaskinen/data.js adverb_placement = 140 items; other 6 modes unchanged (main_to_subordinate 10, direct_question 10, indirect_question 10, relative_clause 10, der_or_det 9, clause_chain 10). Total 199/1,020.
- Next: main_to_subordinate (10/160) is the next largest gap — author it next following the same hand-written approach, schema in improvement/specs.md § 6.6 "Transformation item".
- Gotchas: validated with `shared/validate.js` (DanskValidate.validateDataset, full requiredFields list) = 0 errors/0 warnings, plus a one-off sanity script checking movable_token membership, accepted_orders permutation integrity, and main-vs-subordinate movement direction — 0 problems across all 140 items. The file's own built-in placeholder/duplicate-id guard (IIFE at the bottom of data.js) also reported 0 warnings.

### 2026-10-07 · commit · saetning-data
- What: Hand-authored 150 new items for saetningsmaskinen/data.js `main_to_subordinate` (10 → 160/160), covering all 9 required conjunctions (at, fordi, selvom, hvis, når, da, mens, før, efter at). Commit 4db9042.
- Result: ok
- State left behind: saetningsmaskinen/data.js main_to_subordinate = 160 items; totals now adverb_placement 140, main_to_subordinate 160, direct_question 10, indirect_question 10, relative_clause 10, der_or_det 9, clause_chain 10 = 349/1,020.
- Next: relative_clause (10/180) is the next largest gap — author it next, schema in improvement/specs.md § 6.6 "Relative-clause item". Apply the omission rule from danish-grammar-qa: never omit the relative pronoun when it is the clause subject.
- Gotchas: validated with `shared/validate.js` (0 errors/0 warnings, full schema) plus a one-off sanity script checking accepted_orders is an exact word-permutation of tiles and full_answer = frame + accepted order — 0 problems across all 160 items. Caught and fixed several semantic (not just syntactic) errors during authoring before committing: causal `mens` (doesn't exist — mens is temporal/contrastive only), postposed causal `da` (unnatural — causal da must be fronted), adverb/conjunction meaning clashes (`allerede`+`før`, `aldrig`+punctual `når`), and lowercase plural `I` (must stay capitalized). See SCRATCHPAD §1 "Open problems" for the full list so future authoring runs don't repeat them.

### 2026-10-07 · start · saetning-data
- What: Resumed `saetning-data` (next largest gap per prior hand-off). Read improvement/specs.md § 6.4 Mode 5 and § 6.6 "Relative-clause item" schema, and invoked danish-grammar-qa skill's Sætningsmaskinen rules before authoring.
- Result: ok (start)
- Next: author relative_clause (10/180) to target, hand-written, covering som/der/hvor/hvis/hvilket/hvad.

### 2026-10-07 · commit · saetning-data
- What: Hand-authored 170 new items for saetningsmaskinen/data.js `relative_clause` (10 → 180/180). Commit 64a6918.
- Result: ok
- State left behind: saetningsmaskinen/data.js relative_clause = 180 items; totals now adverb_placement 140, main_to_subordinate 160, direct_question 10, indirect_question 10, relative_clause 180, der_or_det 9, clause_chain 10 = 519/1,020.
- Next: der_or_det (9/160) is the next largest gap — author it next, flat schema (sentence/options/correct/note), improvement/specs.md § 6.4 Mode 6.
- Gotchas: validated with shared/validate.js (0 errors/0 warnings) plus a custom sanity script checking exactly one "___" per target_frame, subject-relative accepted_answers always exactly ["der","som"] (never omitted, since subject), object-relative accepted_answers always a matching "som X"/"X" pair (correctly omittable, since object), hvor/hvis accepted_answers always a single word, hvilket accepted_answers always starting "hvilket ", hvad fronted-type accepted_answers always exactly ["hvad"] — 0 problems across all 180 items. Found during authoring: the one pre-existing `rc-hvilket` item (not touched, out of scope) actually misuses hvilket for a single-noun antecedent per its own note — the 20 new hvilket items deliberately use the correct whole-clause/non-restrictive pattern instead; don't copy the old item's construction in future work on that one item.

<!-- APPEND NEW EVENTS BELOW THIS LINE -->

### 2026-10-07 23:05 · verify · saetning-data
- What: Session started on branch `fix/article-skill-digit-keyword`, which already contained the der_or_det data commit (8b4b7e1, 9 -> 160/160, hand-authored) but no follow-up "update PROGRESS.md" commit — the prior run's Step 5 bookkeeping was skipped. Independently re-verified the committed data (did not re-author it) with a Node sanity script: 160/160 items, 0 duplicate ids, exactly one `___` blank per sentence, every item's options set exactly {det, der}, `correct` always in `options`, no missing core fields, levels A2-C1.
- Result: ok (verification only)
- State left behind: PROGRESS.md saetning-data entry updated (total 519 -> 670/1,020, der_or_det moved to "done", next-action pointer updated to direct_question/indirect_question). SCRATCHPAD §1 refreshed to match.
- Next: author direct_question or indirect_question (both 10/140) — see §1 for schema caveat (check each mode's existing 10 items before assuming der_or_det's flat schema applies).
- Gotchas: this branch's working tree also has unrelated uncommitted changes (hamburger nav drawer in shared/sjovt.js|css + new shared/sd-menu.js, QR hero visual in index.html, nav-drawer include in blog/*/index.html) that duplicate commits already present on branches `feature/hamburger-nav-menu` and `feat/hero-qr-code`. Left untouched and uncommitted — not part of saetning-data, do not fold into a data commit. Flagged to the user for a branch-hygiene decision.

### 2026-10-07 23:05 · stop · saetning-data
- What: Stopping after bookkeeping-only run (no new data authored this run; prior run's unfinished Step 5 is now closed).
- Result: ok (not budget-limited, not blocked — stopping per "pick exactly ONE task" since the one open task (saetning-data bookkeeping) is now finished and starting new data authoring would be a second task).
- Next: next run picks up `saetning-data` → author direct_question (Mode 3) or indirect_question (Mode 4), per §1.
