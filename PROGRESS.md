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

- id: shared-data-nouns
  spec: shared-data-nouns
  status: in-progress
  title: "Shared data — nouns.js (300 nouns, all schema fields)"
  notes: "Done: shared/data/nouns.js created with 188 of 300 target nouns (window.DANSK_NOUNS), covering family, body, home/furniture, nature, time, clothing, animals, transport, school/work, town, technology, abstract categories. 43 entries use irregular/umlaut-er/zero/doubling forms (exceeds the 40-minimum requirement), 9 flagged verify:true for native-speaker confirmation. Structurally validated with an inline Node script (unique ids, valid levels A1-B2, valid genders, valid plural_pattern values, required fields present, indefinite_singular consistency) — zero errors. Next: add ~112 more nouns to reach 300. Categories not yet covered (add these): materials (træ already used generically, add: metal, plastik, glas already used, papir, sten already used, guld, sølv), professions (læge, sygeplejerske, ingeniør, advokat, politibetjent, kok, tjener, journalist, forfatter, kunstner, musiker, skuespiller), sports/leisure (bold, mål, kamp, hold, klub, medlem, træner, dommer, banen), money/economy (krone, seddel, konto — mind elision, regning, kvittering), materials/objects (kniv, gaffel, ske, tallerken, kop, kande, potte, pande), body extras (hjerte, lunge, muskel — mind elision), weather extras (regn, sne, is, frost, tåge), containers (kasse, æske, pose, taske, kuffert), more abstract (ret/rettighed, regel, lov, ansvar, fejl, held), more town (bank, apotek, sygehus, politistation), family extras (ægtefælle, svigermor/svigerfar), more animals/insects (myg — mind doubling ægg-style; use edderkop pattern), more technology (internet-related avoid uncountable, tablet, skærm already used). CRITICAL when continuing: many short monosyllabic words double their final consonant before a vowel suffix (e.g. kat→katten, hat→hatten, bus→bussen) while others with similar shape do NOT (e.g. tog→toget, skab→skabet) — this is lexically idiosyncratic in Danish, not derivable by regex, so verify each new word's definite_singular/definite_plural against real usage before adding, or mark verify:true if unsure. Also watch for weak-syllable elision in words ending -el/-en/-er (cykel→cyklen, kartoffel→kartoflen) which needs manual literal forms, not the noun() builder. Run the same inline Node validation script used this run (see commit 6e7455f) before committing further additions."

- id: shared-data-adj-verbs
  spec: shared-data-adjectives
  status: todo
  title: "Shared data — adjectives.js (220) + verbs.js (200)"

- id: shared-data-pronouns-clauses
  spec: shared-data-pronouns
  status: todo
  title: "Shared data — pronouns.js + clause-patterns.js (~80) + validate.js"

- id: boejning-data
  spec: boejningsvaerkstedet
  status: todo
  title: "Bøjningsværkstedet — data.js: 6 modes, ~2,050 items (Mode 1 generated from nouns.js)"

- id: boejning-shell
  spec: boejningsvaerkstedet
  status: todo
  title: "Bøjningsværkstedet — index.html: parchment/brass theme, start screen, routing, SRS"

- id: boejning-modes-1-3
  spec: boejningsvaerkstedet
  status: todo
  title: "Bøjningsværkstedet — Modes 1–3: Fire former, Byg navneordet, Adjektivværkstedet"

- id: boejning-modes-4-6
  spec: boejningsvaerkstedet
  status: todo
  title: "Bøjningsværkstedet — Modes 4–6: Sammenligningspressen, Bestemt/ubestemt, Mængdeværkstedet + round-end + register in index.html"

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

- shared-core-1 / DanskCore module 1 — store, tts, srs, diff (shared/dansk-core.js) / 2026-07-15 / 5534b28
- shared-core-2 / DanskCore module 2 — level, ui, quiz (append to shared/dansk-core.js) / 2026-07-15 / e5fe18c
