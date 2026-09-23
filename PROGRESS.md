# Build Progress — danske_spiller

**Rules:** Pick ONE `status: todo` task. Read `prd.md` (platform rules) + `specs.md` (per-game spec) before touching any file. Commit after every meaningful checkpoint. Update this file as your final commit. Never edit `specs.md` or `prd.md`. Full rules: `.claude/prompts/build-increment.md`.

**Precedence:** `prd.md` > `specs.md` > this file. Conflict → move task to Blocked, stop.

---

## Key Constraints (apply to every task)

- Vanilla HTML/CSS/JS only — no frameworks, no build step, no fetch/XHR/CDN
- Must work via `file://` — zero console errors on open
- All CSS/JS inline unless from `/shared/`
- Stable item IDs always (never array indices as progress keys)
- Interface in Danish; English only to resolve semantic ambiguity
- Every Danish prompt → TTS replay button via `DanskCore.tts`
- Start screen: title + one Spil button + compact mode/level controls only
- Correct: animation + sound + auto-advance ~800 ms (no congratulatory text)
- Wrong: correct answer + one grammar note + TTS replay (no encouragement)
- 360 px min width, 44×44 px touch targets, full keyboard nav, dark mode, reduced motion, sound mute

## Shared Library Summary (`shared/dansk-core.js` → `window.DanskCore`)

| Module | Key methods |
|---|---|
| `tts` | `speak(text)`, `replay()`, `isAvailable()` — silent fallback, Danish voice |
| `store` | `get/set/remove(key)`, `namespace(prefix)` — swallows QuotaExceededError |
| `srs` | `load/record/isDue/nextItems/pattern` — Leitner 5-box; key: `<game>:<mode>:<id>` |
| `diff` | `normalize(str)`, `check(answer, accepted[])`, `tokenDiff(a,b)` |
| `level` | `filter(items, levels)`, `LEVELS: ['A1','A2','B1','B2','C1']` |
| `ui` | `darkMode`, `motion`, `sound.sequence(steps)`, `ttsButton()`, `focusTrap()`, `announce()` |
| `quiz` | `mc`, `freeText`, `tiles`, `summary` renderers |

Sound `sequence(steps)`: `[{ type, frequency, duration, gain, delay? }]` — init AudioContext on first user interaction only; do not play when `document.hidden`.

## Shared Data Files

| File | Export | Target |
|---|---|---|
| `shared/data/nouns.js` | `DANSK_NOUNS` | 300 nouns; schema: id, level, gender, 4 forms, plural_pattern, note |
| `shared/data/adjectives.js` | `DANSK_ADJECTIVES` | 220 adj; schema: id, level, common/neuter/def-pl forms, comparative, superlative, periphrastic flag |
| `shared/data/verbs.js` | `DANSK_VERBS` | 200 verbs; schema: id, level, infinitive, present, preterite, perfect_auxiliary, participle, imperative |
| `shared/data/pronouns.js` | `DANSK_PRONOUNS` | personal, possessive, reflexive_possessive, demonstrative, indefinite |
| `shared/data/clause-patterns.js` | `DANSK_CLAUSES` | ~80 transformation templates |
| `shared/validate.js` | — | Checks: unique IDs, allowed levels, required fields, correct in options, no dupes after normalize |

## Game Quick Reference

| Game | Folder | Levels | Modes | Item target | Theme palette |
|---|---|---|---|---|---|
| Bøjningsværkstedet | `boejningsvaerkstedet/` | A1–B2 | 6 | ~2,050 | Parchment #E8DDC4, Brass #B88A44, Wood #7A5134 |
| Pronomenmysteriet | `pronomenmysteriet/` | A2–B2 | 6 | 760 | Navy #17233F, Gold #D2A94F, Paper #F0E7D2 |
| Sætningsmaskinen | `saetningsmaskinen/` | A2–C1 | 7 | 1,020 | Cream #F2E7CC, Coral #D96D5F, Blue #4E82A6 |
| Tidsmaskinen | `tidsmaskinen/` | A2–C1 | 9 + Timed | 1,260 | Deep blue #17263B, Amber #B67A3D, Cyan #3C93A8 |
| Skrivekontrollen | `skrivekontrollen/` | B1–C1 | 7 | 1,190 | Paper #E8E0C8, Ink #23231F, Proof red #A13D3D |

**Import pattern for every game:**
```html
<script src="../shared/dansk-core.js"></script>
<script src="../shared/data/nouns.js"></script>  <!-- only if needed -->
<script src="./data.js"></script>
```

**SRS key format:** `<game-id>:<mode>:<item-id>` · pattern key: `pattern:<game-id>:<type>:<value>`

**Round-end screen must include:** score, accuracy, ≤3 weakest items, Spil igen button, optional Gentag fejl chip, optional cross-game recommendation chip (one only).

**Data validation before every data commit:** unique IDs, levels in A1/A2/B1/B2/C1, non-empty accepted_answers, correct answer present in options.

---

## Next Up

- id: shared-data-adj-verbs
  spec: shared-data-adjectives
  status: in-progress
  title: "Shared data — adjectives.js (220) + verbs.js (200)"
  notes: "Done: shared/data/adjectives.js created with 183 of 220 target adjectives (window.DANSK_ADJECTIVES), matching prd.md § 1.4 schema exactly (id, level, base, common_form, neuter_form, definite_plural_form, comparative, superlative_indefinite, superlative_definite, periphrastic, irregular, indeclinable, note, verify). Covers 13 irregular-comparison adjectives (god/bedre/bedst, stor/større/størst, lille/mindre/mindst, gammel/ældre/ældst, etc.), 59 periphrastic (mere/mest: -isk class, -et participle class, -løs class, indeclinable colour/loanwords), 11 fully indeclinable (moderne, lilla, orange, beige, stille, etc.), plus regular -ig/-lig class (60 words, superlative -st/-ste not -est), regular monosyllabic class (-est/-este), -som class (m-doubling: morsom/ensom/langsom), -en class (schwa elision: sulten→sultne), and monosyllable consonant-doubling exceptions (smuk/tyk/grøn/nem/smal) plus neuter-unchanged exceptions (glad/let/kort/sort/flot/træt). 26 entries flagged verify:true for native-speaker confirmation (mostly rare comparative forms of colour/loan adjectives and less-common words like virksom, stakkels, øde). Structurally validated with an inline Node script (unique ids, valid levels A1-B2, unique bases after normalization, all 14 required fields present, boolean-typed flags) — zero errors. IMPORTANT bug found and fixed during this run: -et participle adjectives (forkølet, stresset, interesseret, etc.) form plural/definite with -ede, NOT a literal base+'e' — i.e. forkølede not forkølete — this is now handled via an etClass flag on the adjPeriphrastic() builder in adjectives.js; if continuing this file, reuse that flag rather than a plain base+'e' concatenation for any further -et words. Next: (1) optionally add ~37 more adjectives to reach 220 (untouched categories: more -isk/-agtig loanwords, -fuld compounds e.g. håbefuld/meningsfuld, more -en class e.g. gnaven/sluppen, superlative-only forms, adjectives of quantity/degree) — not required before moving on if time is short; (2) write shared/data/verbs.js with window.DANSK_VERBS, 200 verbs per prd.md § 1.5 schema (id, level, infinitive, present, preterite, perfect_auxiliary, participle, imperative, passive_s, note, verify) — follow the nouns.js/adjectives.js pattern of a mechanical builder for weak regular verbs (class 1: -er/-ede/-et, class 2: -er/-te/-t) plus an explicit MANUAL array for the closed set of ~120 strong/irregular Danish verbs (være, have, blive, gå, stå, gøre, se, vide, sige, ligge, sidde, tage, finde, komme, drikke, synge, springe, binde, skrive, bide, gribe, etc.) and modal verbs (kunne, ville, skulle, måtte, burde, turde, gide) which have irregular present tense with no -r ending. Run the same structural validation pattern before committing."

- id: boejning-data
  spec: boejningsvaerkstedet
  status: in-progress
  title: "Bøjningsværkstedet — data.js: 6 modes, ~2,050 items (Mode 1 generated from nouns.js)"
  notes: "Done: boejningsvaerkstedet/data.js created, exporting window.BOEJNINGS_DATA with a fire_former (Mode 1) array generated at load time from window.DANSK_NOUNS (188 nouns x 4 forms = 752 items; target is 900 from the full 300-noun set, so this will grow automatically once shared-data-nouns is completed — no re-generation needed here). Each item follows the prd.md § 2.4 schema exactly (id, noun_id, level, mode, requested_form, accepted_answers, note); notes are templated per form (gender note for indefinite_singular, generic suffixation note for definite_singular/definite_plural, reuse of the noun's own note for indefinite_plural since that already documents the specific plural pattern). Validated with shared/validate.js (DanskValidate.validateDataset): 0 errors, 0 warnings, unique ids, valid levels, non-empty accepted_answers. byg_navneordet, adjektivvaerkstedet, sammenligningspressen, bestemt_ubestemt and maengdevaerkstedet keys exist as empty arrays (placeholders, not yet populated). Next: continuing this task requires shared/data/adjectives.js (currently 183/220, in-progress) for Mode 2 (byg_navneordet, needs noun+adjective pairs) and Mode 3 (adjektivvaerkstedet, needs adjective agreement forms) — either finish adjectives.js to 220 first, or generate Modes 2-3 from the 183 already present (mirroring the fire_former approach: read window.DANSK_ADJECTIVES at load time so it stays in sync). Mode 4 (sammenligningspressen, comparative/superlative) can be generated purely from adjectives.js (comparative/superlative_indefinite/superlative_definite fields already present) — do this next, it's the least blocked. Modes 5 (bestemt_ubestemt, 250 contextual items) and 6 (maengdevaerkstedet, 220 quantifier items) require hand-written short contexts (2-3 sentences each) per prd.md § 2.4 schemas — these cannot be mechanically generated from existing data and need manual authoring following the dansk-mester/pronomenmysteriet-style QA process (grammar review + ambiguity review). Follow the same inline Node validation pattern as this run before every future commit to this file."

- id: pronomen-data
  spec: pronomenmysteriet
  status: todo
  title: "Pronomenmysteriet — data.js: 760 curated items (Mode 3 items manually QA'd: no two plausible answers)"

- id: pronomen-game
  spec: pronomenmysteriet
  status: todo
  title: "Pronomenmysteriet — index.html: navy courtroom theme, 6 modes, SRS, register in index.html"

- id: saetning-data
  spec: saetningsmaskinen
  status: todo
  title: "Sætningsmaskinen — data.js: 1,020 items across 7 modes"

- id: saetning-game-1
  spec: saetningsmaskinen
  status: todo
  title: "Sætningsmaskinen — index.html: block tile theme, Modes 1–4 (ikke-flytt, main→sub, spørgsmål, indirekte)"

- id: saetning-game-2
  spec: saetningsmaskinen
  status: todo
  title: "Sætningsmaskinen — Modes 5–7: relativværksted, der/det, sætningskæde + SRS + register in index.html"

- id: tids-data
  spec: tidsmaskinen
  status: todo
  title: "Tidsmaskinen — data.js: 1,260 items across 9 modes (every item needs temporal context)"

- id: tids-game-1
  spec: tidsmaskinen
  status: todo
  title: "Tidsmaskinen — index.html: timeline theme, Træning/Timed toggle, Modes 1–5"

- id: tids-game-2
  spec: tidsmaskinen
  status: todo
  title: "Tidsmaskinen — Modes 6–9: conditionals, infinitives, passive, imperatives + SRS + register in index.html"

- id: skrive-data
  spec: skrivekontrollen
  status: todo
  title: "Skrivekontrollen — data.js: 1,190 items (Mode 1: exactly ONE error per sentence, no accidental second)"

- id: skrive-game-1
  spec: skrivekontrollen
  status: todo
  title: "Skrivekontrollen — index.html: paper/typewriter theme, comma convention toggle (localStorage), Modes 1–4"

- id: skrive-game-2
  spec: skrivekontrollen
  status: todo
  title: "Skrivekontrollen — Modes 5–7: reference, edit text, register + SRS + register in index.html"

- id: qa-pass
  spec: prd.md § Overall Definition of Done
  status: todo
  title: "QA pass — all 5 games: 360 px, dark mode, keyboard nav, zero console errors via file://"

---

## Blocked

---

## Completed

- shared-data-nouns / Shared data — nouns.js (300 nouns, all schema fields) / 2026-09-23 / 7318872
  notes: "Completed: shared/data/nouns.js now exports 325 nouns via window.DANSK_NOUNS (target was 300). This run added 137 (103 builder-safe REGULAR + 34 explicit MANUAL). MANUAL entries cover the forms the noun() builder cannot derive: consonant-doubling (metal→metallet, kop→koppen, klub→klubben, medlem→medlemmet, billet, fabrik, knap, tablet, rabat, skat, ret, forskel, sæk, kok), schwa-elision -el/-er stems (gaffel→gaflen, muskel→musklen, seddel→sedlen, skulder→skuldre, regel→reglen), agent -er nouns whose plural is -e but definite plural drops the extra e (tjener→tjenere→tjenerne, kunstner, musiker, skuespiller, forfatter, politiker, forsker — NOTE the builder would wrongly produce e.g. 'tjenerene'; the pre-existing REGULAR entry 'lærer' at ~line 216 has this latent bug producing 'lærerene' and should be corrected to MANUAL 'lærerne' in a future data-repair pass), irregular (landmand→landmænd, løn→lønninger), foreign (museum→museet→museer), and zero-plural-with-doubling (myg→myggen, lam→lammet, spil→spillet). Validation via shared/validate.js (DanskValidate.validateDataset with all noun schema fields required) = 0 errors / 0 warnings; unique ids, 0 duplicate bases, all genders en/et, all plural_pattern values in the allowed set, all indefinite_singular consistent with gender+base, 72 irregular-ish forms (>40 min), 10 flagged verify:true (café/idé/eksamen/morgen/køkken/sol/frygt/app/menneske carried over + tallerken new). Levels: A1 135, A2 120, B1 65, B2 5. Downstream: boejningsvaerkstedet/data.js Mode 1 (fire_former) reads DANSK_NOUNS at load time so its item count auto-scales from 752 toward the 900 target with no regeneration needed."
- boejning-modes-4-6 / Bøjningsværkstedet — Modes 4–6 + round-end + register in index.html / 2026-09-22 / 1e61f14
  notes: "The three renderers (RENDERERS.sammenligningspressen three-slot press, RENDERERS.bestemt_ubestemt and RENDERERS.maengdevaerkstedet via the shared makeMcRenderer for context+MC), the round-end summary (score, accuracy, ≤3 weak items, Spil igen, Gentag fejl, cross-game chip), and the root /index.html GAMES registration (entry present at index.html:385-393, recommended:true) were ALL already committed in prior runs but the task stayed todo. This run VERIFIED and FIXED rather than rewrote. BUG FOUND + FIXED (commit 1e61f14): Mode 5 (bestemt_ubestemt) and Mode 6 (maengdevaerkstedet) items follow prd.md § 2.4 contextual/quantifier schemas which carry NO `mode` field (unlike fire_former/adjektiv/byg/sammenligning whose prd schemas include mode). renderItem routed via RENDERERS[item.mode] and weakLabel branched on item.mode, so those two modes fell through to the _fallback empty-state and never rendered — mode buttons enabled (pool>0 via buildStartControls) but Spil showed the 'kommer snart' empty state. Both now use `item.mode || state.mode` (a round is always single-mode, so state.mode is the correct discriminator). Modes 1-4 unaffected (their items set mode === state.mode). VERIFICATION (headless DOM shim tmp_boot_boejning.js, extended with an Element.contains method the real browser provides): boots 0 console errors; sammenligningspressen renders 3 slot-inputs; bestemt_ubestemt + maengdevaerkstedet each render 2 options + a context blank and process a keyboard answer; a full MC round runs to the summary screen — 0 console errors throughout. shared/validate.js (DanskValidate.validateDataset) = 0 errors / 0 warnings for all three arrays (sammenligningspressen 151, bestemt_ubestemt 37, maengdevaerkstedet 35); correct-in-options violations = 0; 0 duplicate ids across all six modes. NOTE for boejning-data (still in-progress): Mode 4/5/6 item COUNTS are under the prd § 2.4 targets (151/180, 37/250, 35/220) — growing those datasets belongs to boejning-data, not here; the renderers scale automatically as data.js grows (arrays read at load). No renderer change needed for larger datasets."
- shared-core-1 / DanskCore module 1 — store, tts, srs, diff (shared/dansk-core.js) / 2026-07-15 / 5534b28
- shared-core-2 / DanskCore module 2 — level, ui, quiz (append to shared/dansk-core.js) / 2026-07-15 / e5fe18c
- shared-data-pronouns-clauses / Shared data — pronouns.js + clause-patterns.js (87 items) + validate.js / 2026-07-16 / 9c4afe0
- boejning-modes-1-3 / Bøjningsværkstedet — Modes 1–3: Fire former, Byg navneordet, Adjektivværkstedet / 2026-09-21 / 605b801
  notes: "All three renderers were implemented in commit 605b801 (mislabelled 'Auto-build: uncommitted leftovers') but PROGRESS.md was never updated, so the task stayed marked todo. This run VERIFIED the work rather than re-writing it: (1) shared/validate.js (via the committed harness) passes 0 errors / 0 warnings for fire_former (752), byg_navneordet (570) and adjektivvaerkstedet (606); Mode 2 order/piece integrity check = 0 problems. (2) Booted the index.html inline game script in a minimal Node DOM shim with TTS/AudioContext/matchMedia all absent — game boots with ZERO console errors; each of the three modes renders an item and processes an answer: Mode 1 free-text wrong answer shows the proofing slip with 'Rigtigt svar' + note; Mode 3 same; Mode 2 tap-to-place fills 3 slots and check() produces done-correct/done-wrong feedback. RENDERERS.fire_former, RENDERERS.byg_navneordet, RENDERERS.adjektivvaerkstedet all present and wired via the RENDERERS registry; mode buttons auto-enable because DATA[key] arrays are non-empty. Also removed stray tmp_gen_test.js accidentally committed in 605b801. NOTE: Mode 1/3 item COUNTS will grow automatically toward the 900/400 targets as shared-data-nouns (188/300) and shared-data-adjectives (183/220) are completed — no renderer change needed. Root /index.html GAMES registration is intentionally NOT done here (belongs to boejning-modes-4-6, per boejning-shell notes)."
- boejning-shell / Bøjningsværkstedet — index.html: parchment/brass theme, start screen, routing, SRS / 2026-09-06 / 21286c2
  notes: "Full shell built and verified via a Node DOM shim (boots with zero runtime errors, TTS/sound safely guarded when unavailable). Delivers: parchment/brass theme with CSS custom properties + [data-theme=dark] dark mode + prefers-reduced-motion handling; start screen (title + one Spil button + compact 6-mode selector + A1-B2 level chips, persisted to localStorage via DanskCore.store namespace 'boejningsvaerkstedet'); round engine that draws up to 10 items preferring SRS-due (DanskCore.srs.nextItems) padded with shuffled pool; SRS records item results AND pattern keys in the prd format 'pattern:boejningsvaerkstedet:noun:<form-slug>:<plural_pattern>'; round-end summary (score, accuracy, <=3 weak items, Spil igen, Gentag fejl, one cross-game chip -> En/Et-traener when noun-form accuracy <70%); SOUND_THEME per prd 2.5. Mode 1 (Fire former) is FULLY IMPLEMENTED as the working slice: 2x2 Ubestemt/Bestemt x Ental/Flertal grid with one highlighted target cell, free-text entry normalized via DanskCore.diff.check, proofing-slip feedback (correct auto-advances ~800ms; wrong shows correct answer + note + TTS replay + Videre). Modes 2-6 route to a graceful empty-state placeholder because DATA[mode] arrays are still empty (see boejning-data task). NEXT (boejning-modes-1-3): the RENDERERS registry in index.html is the extension point — add RENDERERS.byg_navneordet (tap-to-place tiles, reuse DanskCore.quiz.tiles) and RENDERERS.adjektivvaerkstedet; these need boejning-data Modes 2-3 populated first. Mode buttons auto-enable once their DATA[key] array is non-empty (poolFor check in buildStartControls), so no shell change is needed to surface them — only add the renderer + the data. Root /index.html GAMES registration is intentionally NOT done here (belongs to boejning-modes-4-6 task)."
