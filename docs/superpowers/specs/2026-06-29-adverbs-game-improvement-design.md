# Adverbs Game Improvement — Design

## Context

`adverbs.html` ("Danish Sentence Builder: Adverbs & Connectors") is a new, self-contained learning game in the Danish Learning Games collection. It is currently:

- **Not linked** from `index.html` (not in the `games` array).
- Missing the site-wide "🏠 Oversigt" back-link every other game has.
- Running on a **10-entry hardcoded sample dataset**, while a full dataset sits unused in `danish_b1_b2_500_adverb_sentences.xlsx` (500 sentences, 50 distinct adverbs × 10 sentences each, columns: `No., Level, Category, Danish Adverb, English Meaning, Danish Sentence, English Translation, Theme, Note`). This mirrors the exact "10x dataset shortfall" issue the project's existing QA report (`improvements.md`) flagged for the Antonym game.

This is the same single-file, no-backend, no-build-step architecture as the rest of the collection (see `improvements.md` for the established patterns/conventions: localStorage progress, `speechSynthesis`-based audio in `danish-antonyms-game.html`, mistake-review queues, dark mode, CSV import). All work here stays frontend-only inside `adverbs.html` (plus a small addition to `index.html`'s data array) — no server, no build tooling.

## Key finding: scope mismatch

The game's code (modes, categories) was written for a mixed "adverbs & connectors" dataset, copying the shape of the 10-item placeholder sample (which included `men`, `fordi`, `da`, `når` — conjunctions). The real 500-row dataset is **100% pure adverbs** across 8 categories: Time, Place, Direction, Degree, Manner, Frequency, Probability, Quantity (Adverbial Phrase). There are zero conjunctions in it.

**Decision: rescope the game to pure adverbs.** Drop the Connector Duel mode and the conjunction categories. This avoids dead/empty game modes once real data loads, and avoids duplicating ground already covered by the collection's two dedicated conjunction games (`konjunktioner/konjunktioner.html`, `forbindenor/Forbindenor.html`).

## 1. Critical fixes (must land before/with the real-data import)

1. **CSV parser is comma-naive.** `parseCSV` (`adverbs.html` ~line 1006) splits on bare `/,|\t/` with no quoted-field support. Nearly every sentence in the real dataset contains internal commas (e.g. *"...i går, men jeg vil..."*), so importing via the documented CSV path would silently misalign columns. Replace with a quote-aware CSV line parser (handle `"..."`-wrapped fields, including escaped `""`).
2. **Duplicate `id="options"`.** `renderCategoryQuestion(content)` builds its own `<div id="options">` instead of reusing the one `renderGame()` already created and would normally pass in. Fix by giving the function the same `(content, optionsDiv)` signature as the other render functions and appending category buttons to the passed-in div.
3. **Dead Boss Round.** `MODES.BOSS` / `startBossRound()` are defined but never triggered — no zone, button, or shortcut sets `currentMode` to `BOSS` anywhere outside its own unreachable `case` branch in `renderGame()`. Wire it up (suggest: unlock a "Boss Round" button on the dashboard once `progress.level` reaches Master) or remove it entirely. Decide which during planning.
4. **Permanently-locked final zone.** `populateMap()`'s lock/complete logic compares `zones.indexOf(zone)` (range 0–5 once zones are rebuilt) against `progress.level` (max index 4, since `levels` has 5 entries). The last zone can never show as "completed." Needs re-deriving once zones are rebuilt in Section 2 — likely base unlocking on `progress.correct`/category mastery rather than a 1:1 zone-index-to-level mapping.
5. **Dead `#controls` CSS.** Styled in the `<style>` block but no matching `<div id="controls">` exists in the HTML or is ever created in JS. Either remove the dead rule or use it for a real control (see Section 3's mode-related UX note) — default to removing it unless the implementation plan finds a good use.

## 2. Data pipeline & rescoping

- Convert all 500 xlsx rows into the game's internal entry shape:
  - `word` ← Danish Adverb
  - `meaning` ← English Meaning
  - `sentence_da` ← Danish Sentence
  - `sentence_en` ← English Translation
  - `category` ← Category (one of the 8 real categories, see below)
  - `level` ← Level (uniform `"B1-B2"` for all 500 rows — there is no per-item CEFR-mixing problem here unlike other games in the collection, so no leveling/filtering UI is needed)
  - `theme` ← Theme
  - `No.` and `Note` columns are dropped (Note is boilerplate filler — "Created sentence using the target adverb." — not real teaching content)
- Hardcode the converted 500 entries directly into the `dataset` array literal in `adverbs.html`, replacing the 10-item placeholder (same reasoning as the Antonym game's documented fix: `file://` deployment means runtime `fetch()` of a sibling file won't work, so build-time hardcoding is correct).
- Remove `MODES.CONNECTOR` ("Connector Duel") and its renderer (`renderConnectorQuestion`) and its entry in `startZone`'s `possibleModes`.
- Replace the hardcoded conjunction categories (Coordinating/Subordinating/Correlative) inside `renderCategoryQuestion` with the real 8 adverb categories: Time, Place, Direction, Degree, Manner, Frequency, Probability, Quantity.
- Rebuild `zones[]` (currently Tid/Sted/Måde/Frekvens/Bindeord/Sætningsbygning) to map onto the real categories instead of the old time/place/manner/frequency/connector/fallback split — e.g. one zone per category group, or a smaller number of broader zones that each `filter` cleanly covers (no catch-all "match everything" zone if it can be avoided).
- Rename the page `<title>`, header `<h1>`, and top-of-file doc comment from "Danish Sentence Builder: Adverbs & Connectors" to drop "& Connectors," and update the CSV-import instructions/column list in that comment block to match the real column set.

## 3. Feature & UX upgrades

- **Real audio.** Port the working `speechSynthesis` pattern from `danish-antonyms-game.html:540-571` (`SpeechSynthesisUtterance`, `lang="da-DK"`, priority-ordered Danish voice search with a "no Danish voice found" fallback message, `rate≈0.95`). Add a 🔊 button next to the sentence/word in each render function (Meaning Match, Gap, Translate, Order, Category, Listening).
- **Fix the fake "Listening Simulation" mode.** Today it just hides the Danish text after a 3s `setTimeout` — no audio plays at all. Replace with a real listen-first mode: play the sentence via TTS (sentence hidden from the start, replayable via the 🔊 button), then ask the player to pick the missing adverb from options.
- **Word-order undo.** `selectReorderPart` currently has no way to unselect/remove a placed tile (clicking an already-selected button is a no-op) — a misclick can only be corrected by submitting and failing. Add tap-to-remove: clicking a placed tile removes it from `reorderSelections` and un-marks it, matching the better pattern the QA report recommends from Ordstillingsdetektiven.
- **Richer mistake explanations.** Keep `showAnswerExplanation`'s existing correct-word/sentence/translation display, but add the category label (e.g. "Adverb (Frequency)") so a miss teaches *which kind* of adverb was missed, not just the one word — useful now that 50 adverbs span 8 categories.
- **Site integration.** Add an entry for `adverbs.html` to `index.html`'s `games` array (title, description, category, level `"B1-B2"`, emoji, url), and add the same "🏠 Oversigt" back-link pattern used by the other games in the collection.
- Leave as-is (already solid, matches the collection's best reference implementations per the QA report): localStorage-backed progress/dashboard, streak/level/accuracy tracking, mistake/review queue, dark mode toggle, settings modal (export/reset), keyboard shortcuts.

## Out of scope

- Leaderboards, accounts, or any backend/server component.
- Per-item CEFR leveling/filtering UI — not needed since the real dataset is uniformly `B1-B2`.
- Redesigning the theme-vs-mechanics relationship (the QA report flags this as a project-wide cosmetic-skin issue, but it's not specific to this game and isn't part of this pass).

## Files touched

- `adverbs.html` (primary — data, modes, zones, categories, audio, bug fixes, title/copy)
- `index.html` (add `adverbs.html` to the `games` array)
