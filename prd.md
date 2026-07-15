# Danish Grammar Games — Implementation PRD

> **For agentic workers:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to implement phase by phase. Each phase has checkbox tasks.

**Goal:** Build five new Danish grammar games plus the shared library they depend on, completing the A1–C1 grammar curriculum without duplicating any existing game's primary mechanic.

**Architecture:** Each game is a self-contained folder (`/<game-id>/index.html` + optional `data.js`) using a shared library at `/shared/dansk-core.js`. No frameworks, no build step, no CDN, works via `file://`.

**Tech Stack:** Vanilla HTML5, CSS custom properties, vanilla JS (ES6+), Web Audio API for sound, SpeechSynthesis API for TTS, localStorage for progress.

## Global Constraints

- No frameworks, no build step, no `fetch()`, no XHR, no CDN dependencies, no analytics, no cookies
- Must work through `file://` protocol
- All CSS and JS inline unless from `/shared/`
- Stable item IDs — never use array indices as progress keys
- Interface text in Danish; English only to resolve semantic ambiguity
- Every Danish prompt must have a TTS replay button using `DanskCore.tts`
- Start screen: title + one Spil button + compact mode/level controls only
- Correct feedback: animation + sound + auto-advance ~800 ms (no congratulatory text)
- Wrong feedback: correct answer + one grammar note + TTS replay (no encouragement, no jokes)
- Every game must open with zero console errors
- 360 px minimum viewport width; no horizontal overflow; 44×44 px minimum touch targets
- Full keyboard operation: number keys for options, Enter to submit, Escape to close overlays
- Dark mode, reduced motion, sound mute all supported
- Progress survives page reload; reset requires confirmation

---

## Phase 1 — Shared Foundation

**Delivers:** `/shared/dansk-core.js` and canonical shared data files that all five games import. Must exist before any game is built.

### 1.1 File Structure

```
/shared/
  dansk-core.js          ← single library file, all modules below
  data/
    nouns.js             ← 300 canonical nouns, exports window.DANSK_NOUNS
    adjectives.js        ← 220 canonical adjectives, exports window.DANSK_ADJECTIVES
    verbs.js             ← 200+ canonical verbs, exports window.DANSK_VERBS
    pronouns.js          ← all pronoun forms + paradigms, exports window.DANSK_PRONOUNS
    clause-patterns.js   ← transformation templates, exports window.DANSK_CLAUSES
```

### 1.2 DanskCore API (dansk-core.js)

The library exposes one global object: `window.DanskCore`.

#### DanskCore.tts

```js
DanskCore.tts = {
  speak(text, options = {})   // returns Promise<void>; options: { rate, pitch, onEnd }
  replay()                    // replays last spoken text
  isAvailable()               // returns boolean
  findVoice()                 // returns best Danish SpeechSynthesisVoice or null
};
```

Rules:
- Use `lang: 'da-DK'`; fall back to any `da` voice; fall back silently if none found
- Do not throw when TTS is unavailable — fail silently
- Cancel any in-progress speech before starting a new utterance
- Do not speak when the tab is hidden (`document.hidden`)

#### DanskCore.store

```js
DanskCore.store = {
  get(key)              // returns parsed value or null
  set(key, value)       // JSON-stringifies; swallows QuotaExceededError
  remove(key)
  namespace(prefix)     // returns { get, set, remove } scoped to prefix
};
```

#### DanskCore.srs

```js
// Leitner 5-box system
DanskCore.srs = {
  load(namespace)       // returns SRS state object for the given namespace
  record(state, itemId, correct)  // updates box and next-due date
  isDue(state, itemId)  // returns boolean
  nextItems(state, pool, n)  // returns up to n due items from pool
  pattern(state, patternKey, correct)  // records a pattern-level result
};
```

SRS key format: `<game-id>:<mode>:<item-id>`
Pattern key format: `pattern:<game-id>:<pattern-type>:<value>`

#### DanskCore.diff

```js
DanskCore.diff = {
  normalize(str)         // lowercase, trim, collapse whitespace, normalize apostrophes
  check(answer, accepted_answers)  // returns { correct: bool, closest: str }
  tokenDiff(a, b)        // returns array of { text, type: 'equal'|'add'|'del' }
};
```

Normalize must handle:
- Case-insensitive matching
- Optional final punctuation (`.`, `!`, `?`)
- Normalized whitespace
- Typographic (`'`) and straight (`'`) apostrophes
- Must NOT normalize away grammatical differences that the item is testing

#### DanskCore.level

```js
DanskCore.level = {
  LEVELS: ['A1','A2','B1','B2','C1'],
  filter(items, selectedLevels)   // returns filtered array
  badge(level)                    // returns CSS class string
};
```

#### DanskCore.ui

```js
DanskCore.ui = {
  darkMode: {
    init()       // reads localStorage + OS preference; applies data-theme
    toggle()     // flips and persists
  },
  motion: {
    isReduced()  // reads prefers-reduced-motion
  },
  sound: {
    init(enabled)         // sets global mute state
    toggle()              // flips and persists
    isEnabled()
    sequence(steps)       // plays array of { type, frequency, duration, gain }
    playCtx()             // returns AudioContext (created on first user interaction)
  },
  ttsButton(text, container)  // renders a replay button wired to DanskCore.tts
  focusTrap(element)          // traps keyboard focus inside element
  announce(text)              // aria-live announcement for screen readers
};
```

#### DanskCore.quiz

```js
DanskCore.quiz = {
  // Multiple-choice helper
  mc: {
    render(item, container, onAnswer)
    // item: { prompt, options, correct, note }
    // onAnswer: (correct, chosen) => void
  },
  // Free-text helper
  freeText: {
    render(item, container, onAnswer)
    // item: { prompt, accepted_answers, note }
    // Handles Enter submission, normalization via DanskCore.diff
  },
  // Tile-drag/tap helper
  tiles: {
    render(tokens, slots, container, onComplete)
    // tokens: string[], slots: number
    // onComplete: (orderedTokens) => void
  },
  // Round summary
  summary: {
    render(stats, container, onReplay, onReviewErrors)
    // stats: { score, accuracy, weakItems[] }
  }
};
```

### 1.3 Shared Noun Schema (nouns.js)

```js
// window.DANSK_NOUNS = [ ... ]
{
  id: "bog",
  level: "A1",
  base: "bog",
  gender: "en",                        // "en" or "et"
  indefinite_singular: "en bog",
  definite_singular: "bogen",
  indefinite_plural: "bøger",
  definite_plural: "bøgerne",
  plural_pattern: "umlaut-er",         // "er"|"e"|"zero"|"umlaut-er"|"irregular"|"foreign"
  note: "Bog skifter vokal i flertal: bog → bøger.",
  example: "Bøgerne ligger på bordet.",
  tags: [],
  verify: false
}
```

Dataset target: **300 nouns** — at least 40 high-frequency irregular or unpredictable nouns.

### 1.4 Shared Adjective Schema (adjectives.js)

```js
// window.DANSK_ADJECTIVES = [ ... ]
{
  id: "stor",
  level: "A1",
  base: "stor",
  common_form: "stor",                 // indefinite common/en-gender
  neuter_form: "stort",                // indefinite neuter/et-gender
  definite_plural_form: "store",       // definite or plural form
  comparative: "større",
  superlative_indefinite: "størst",
  superlative_definite: "største",
  periphrastic: false,                 // true = uses mere/mest instead of -ere/-est
  irregular: true,
  indeclinable: false,
  note: "Stor bøjes uregelmæssigt: større, størst.",
  verify: false
}
```

Dataset target: **220 adjectives** including irregular, indeclinable, and periphrastic forms.

### 1.5 Shared Verb Schema (verbs.js)

```js
// window.DANSK_VERBS = [ ... ]
{
  id: "bo",
  level: "A1",
  infinitive: "bo",
  present: "bor",
  preterite: "boede",
  perfect_auxiliary: "har",            // "har" or "er"
  participle: "boet",
  imperative: "bo",
  passive_s: null,                     // s-passive form or null if unnatural
  note: "Bo danner perfektum med har: har boet.",
  verify: false
}
```

Dataset target: **200 verbs** — all high-frequency verbs A1–B2.

### 1.6 Shared Pronoun Schema (pronouns.js)

```js
// window.DANSK_PRONOUNS = { personal, possessive, reflexive_possessive, demonstrative, indefinite }
{
  personal: [
    { subject: "jeg", object: "mig", level: "A1" },
    { subject: "du",  object: "dig", level: "A1" },
    // ...
  ],
  possessive: [
    { id: "min", forms: { en: "min", et: "mit", pl: "mine" }, owner: "1sg", level: "A1" },
    { id: "sin", forms: { en: "sin", et: "sit", pl: "sine" }, owner: "reflexive", level: "A2" },
    // ...
  ],
  demonstrative: [
    { id: "denne", forms: { en: "denne", et: "dette", pl: "disse" }, level: "A2" },
    // ...
  ],
  indefinite: [
    { id: "nogen",  note: "Bruges i spørgsmål og negation for tælleligt.", level: "A2" },
    { id: "noget",  note: "Bruges i spørgsmål og negation for utælleligt.", level: "A2" },
    { id: "nogle",  note: "Bruges om ubestemt flertal.", level: "A2" },
    // ...
  ]
}
```

### 1.7 Shared Clause Patterns (clause-patterns.js)

```js
// window.DANSK_CLAUSES = [ ... ]
{
  id: "at-ledsaetning-ikke",
  type: "main_to_subordinate",
  conjunction: "at",
  main_template:  "Han {verb} ikke {adv}.",
  sub_template:   "Jeg ved, at han ikke {verb} {adv}.",
  note: "I at-ledsætningen står ikke før det finitte verbum.",
  level: "A2"
}
```

### 1.8 Sound Engine

The `DanskCore.ui.sound.sequence(steps)` method plays an array of oscillator steps:

```js
steps = [
  { type: "sine"|"square"|"triangle"|"sawtooth"|"noise",
    frequency: 220,          // Hz
    duration: 0.08,          // seconds
    gain: 0.05,              // 0.0–1.0
    delay: 0 }               // seconds before this step starts (optional)
]
```

Rules:
- Initialise `AudioContext` only on first user interaction
- Do not play when `document.hidden`
- Respect `DanskCore.ui.sound.isEnabled()`
- Gain targets: selection 0.025–0.05, correct 0.05–0.09, wrong 0.035–0.06, round-complete 0.06–0.10

### 1.9 Dataset Validation Script

Create `/shared/validate.js` — runs in Node or browser console:

```js
// Checks:
// - unique IDs within each dataset
// - allowed levels (A1/A2/B1/B2/C1)
// - required fields present (id, level, note)
// - no empty accepted_answers arrays
// - correct answer included in options where options exist
// - no duplicate items after normalization
// Returns: { errors: [], warnings: [] }
```

### 1.10 Phase 1 Tasks

- [ ] Create `/shared/` directory
- [ ] Write `DanskCore.store` module with localStorage error handling
- [ ] Write `DanskCore.tts` module with Danish voice discovery and silent fallback
- [ ] Write `DanskCore.srs` Leitner 5-box implementation with pattern keys
- [ ] Write `DanskCore.diff.normalize()` and `check()` covering all normalization rules
- [ ] Write `DanskCore.diff.tokenDiff()` for displaying wrong-answer highlights
- [ ] Write `DanskCore.level.filter()` and badge helper
- [ ] Write `DanskCore.ui.darkMode` (init, toggle, localStorage persistence)
- [ ] Write `DanskCore.ui.motion.isReduced()`
- [ ] Write `DanskCore.ui.sound` with AudioContext init on first interaction, sequence player, noise node
- [ ] Write `DanskCore.ui.ttsButton()` renderer
- [ ] Write `DanskCore.ui.focusTrap()` and `announce()`
- [ ] Write `DanskCore.quiz.mc` multiple-choice renderer
- [ ] Write `DanskCore.quiz.freeText` renderer with Enter submission and normalization
- [ ] Write `DanskCore.quiz.tiles` tap-to-place tile renderer
- [ ] Write `DanskCore.quiz.summary` round-end screen renderer
- [ ] Create `nouns.js` with 300 canonical nouns (all fields, verify flagged on uncertain)
- [ ] Create `adjectives.js` with 220 adjectives (regular, irregular, indeclinable, periphrastic)
- [ ] Create `verbs.js` with 200 canonical verbs
- [ ] Create `pronouns.js` with all pronoun paradigms
- [ ] Create `clause-patterns.js` with ~80 transformation templates
- [ ] Create `validate.js` and run it against all datasets — zero errors
- [ ] Verify DanskCore loads with zero console errors via `file://`
- [ ] Update `/index.html` GAMES array to include the five planned entries (status: "planned")

---

## Phase 2 — Bøjningsværkstedet 🛠️

**Game ID:** `boejningsvaerkstedet`  
**Folder:** `/boejningsvaerkstedet/`  
**Levels:** A1–B2  
**Priority:** Tier 1 — build first  
**Depends on:** Phase 1 (all shared data files)

### 2.1 Scope

Teaches the full noun phrase, not just gender. Scope boundary: En/Et-træner asks _en eller et?_ — this game asks _how does the entire noun phrase change?_ Do not duplicate gender-only drills.

### 2.2 Visual Design

Theme: wooden craftsman's bookbinding workshop (Potion Craft material feeling — do not copy artwork).

```
Palette:
  Parchment:       #E8DDC4   (light background)
  Dark parchment:  #2B2925   (dark mode background)
  Wood:            #7A5134
  Brass:           #B88A44
  Ink:             #282622
  Correct green:   #50744B
  Wrong red:       #8C413A
  Adjective amber: #C58A37
  Noun blue:       #49758A
  Article violet:  #735C83
```

Key UI elements:
- Three- or four-slot workbench bar at centre of screen
- Piece tray below workbench (article, adjective, noun chips)
- When phrase is completed correctly: compact "press" animation, phrase appears as printed label
- Wrong pieces return to tray; note appears as a narrow proofing slip below workbench
- Start screen: parchment background, brass title, one large Spil button, compact mode + level toggles

### 2.3 File Structure

```
/boejningsvaerkstedet/
  index.html       ← full game (CSS inline, imports shared scripts)
  data.js          ← all six mode datasets, exports window.BOEJNINGS_DATA
```

```html
<!-- Required imports in index.html -->
<script src="../shared/dansk-core.js"></script>
<script src="../shared/data/nouns.js"></script>
<script src="../shared/data/adjectives.js"></script>
<script src="./data.js"></script>
```

### 2.4 Modes

#### Mode 1 — Fire former

Teach the four noun forms in a 2×2 grid:

| | Ental | Flertal |
|---|---|---|
| **Ubestemt** | (fill in) | (fill in) |
| **Bestemt** | (fill in) | (fill in) |

- One noun shown; one cell highlighted for early rounds
- Advanced rounds: complete all four cells
- Free-text entry normalized via `DanskCore.diff`
- Coverage: regular -er, -e, zero plural, vowel change, irregular, words ending in unstressed -e, common foreign patterns

**Data schema (noun-form item):**
```js
{
  id: "bog-bestemt-flertal",
  noun_id: "bog",                      // references DANSK_NOUNS
  level: "A1",
  mode: "fire_former",
  requested_form: "definite_plural",   // "indefinite_singular"|"definite_singular"|"indefinite_plural"|"definite_plural"
  accepted_answers: ["bøgerne"],
  note: "Bog får vokalskifte og -er i flertal."
}
```

Target: **900 noun-form prompts** (generated from 300 canonical nouns × up to 4 forms, filtered for naturalness).

#### Mode 2 — Byg navneordet

Construct complete noun phrases using tap-to-place tiles.

Prompt shows features as compact symbols (e.g. `bestemt · ental · et-ord`).
Learner taps tiles from a tray into article/adjective/noun slots.

**Data schema (phrase construction):**
```js
{
  id: "det-store-hus",
  level: "A1",
  mode: "byg_navneordet",
  noun_id: "hus",
  adjective_id: "stor",
  features: { number: "singular", definiteness: "definite", gender: "neuter" },
  pieces: ["det", "stor", "store", "stort", "hus", "huset"],
  accepted_orders: [["det", "store", "hus"]],
  note: "Efter det får adjektivet -e."
}
```

Target: **500 phrase constructions** generated from verified noun + adjective pairs.

#### Mode 3 — Adjektivværkstedet

Focus on adjective agreement:
- Common (en) gender: base form
- Neuter (et): -t ending (with exceptions)
- Plural and definite: -e
- Adjectives ending in -t, consonant changes, indeclinable adjectives, lille/små, anden/andet/andre

**Data schema:**
```js
{
  id: "hurtig-et-tog",
  level: "A1",
  mode: "adjektivvaerkstedet",
  adjective_id: "hurtig",
  gender: "neuter",
  definiteness: "indefinite",
  number: "singular",
  accepted_answers: ["hurtigt"],
  note: "Et-ord får -t i ubestemt form: hurtigt tog."
}
```

Target: **400 adjective agreement items** (derived from adjective × context combinations).

#### Mode 4 — Sammenligningspressen

Comparative and superlative forms — three slots: `[base] → [comparative] → [superlative]`

Coverage:
- -ere/-est pattern
- Spelling changes (short vowel + double consonant)
- Irregular forms (god/bedre/bedst, lille/mindre/mindst)
- Periphrastic: mere/mest
- Definite superlative: den største
- Predicative: huset er størst

**Data schema:**
```js
{
  id: "stor-sammenligning",
  level: "A2",
  mode: "sammenligningspressen",
  adjective_id: "stor",
  slots: [
    { label: "grundform",    accepted_answers: ["stor"] },
    { label: "komparativ",   accepted_answers: ["større"] },
    { label: "superlativ",   accepted_answers: ["størst", "den største"] }
  ],
  note: "Stor er uregelmæssig: stor → større → størst."
}
```

Target: **180 comparison items**.

#### Mode 5 — Bestemt eller ubestemt?

Teach article and definiteness choice in short contexts (two or three sentences).

Coverage:
- First vs. subsequent mention
- Specific vs. nonspecific reference
- Professions without article
- Possessive phrases (no definite suffix)
- Demonstratives
- Definite adjective construction
- Generic plural
- Common fixed expressions

**Data schema:**
```js
{
  id: "foerste-anden-omtale-bog",
  level: "A2",
  mode: "bestemt_ubestemt",
  context: "Jeg købte ___ i går. Bogen var dyr.",
  options: ["en bog", "bogen", "den bog"],
  correct: "en bog",
  note: "Første omtale bruger normalt ubestemt form."
}
```

Target: **250 definiteness context items**.

#### Mode 6 — Mængdeværkstedet

Quantifiers and countability:
- mange/meget, få/lidt, færre/mindre, flere/mere
- al/alt/alle, hver/hvert, begge, ingen/intet, nogen/nogle/noget

**Data schema:**
```js
{
  id: "mange-boeger",
  level: "A1",
  mode: "maengdevaerkstedet",
  context: "Der er ___ mennesker i parken.",
  options: ["mange", "meget", "lidt"],
  correct: "mange",
  note: "Mange bruges om tælleligt flertal."
}
```

Target: **220 quantifier items**.

### 2.5 Sound Design

```js
const SOUND_THEME = {
  select() {
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 500, duration: 0.09, gain: 0.03 }
    ]);
  },
  correct() {
    DanskCore.ui.sound.sequence([
      { type: "square",   frequency: 220, duration: 0.06, gain: 0.05 },
      { type: "triangle", frequency: 330, duration: 0.07, gain: 0.06, delay: 0.07 },
      { type: "sine",     frequency: 494, duration: 0.10, gain: 0.05, delay: 0.14 }
    ]);
  },
  wrong() {
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 140, duration: 0.15, gain: 0.04 }
    ]);
  },
  roundComplete() {
    DanskCore.ui.sound.sequence([
      { type: "square",   frequency: 220, duration: 0.08, gain: 0.06 },
      { type: "square",   frequency: 220, duration: 0.08, gain: 0.06, delay: 0.15 },
      { type: "square",   frequency: 220, duration: 0.08, gain: 0.06, delay: 0.30 },
      { type: "sine",     frequency: 330, duration: 0.40, gain: 0.07, delay: 0.45 }
    ]);
  }
};
```

### 2.6 Phase 2 Tasks

- [ ] Create `/boejningsvaerkstedet/` directory
- [ ] Write `data.js`: Mode 1 noun-form items (900 generated from nouns.js, validated)
- [ ] Write `data.js`: Mode 2 phrase construction items (500 adjective+noun pairs)
- [ ] Write `data.js`: Mode 3 adjective agreement items (400)
- [ ] Write `data.js`: Mode 4 comparison items (180)
- [ ] Write `data.js`: Mode 5 definiteness context items (250)
- [ ] Write `data.js`: Mode 6 quantifier items (220)
- [ ] Run `validate.js` against data.js — zero errors
- [ ] Write `index.html`: parchment/brass visual theme, CSS custom properties
- [ ] Implement start screen (title + Spil + mode/level compact controls)
- [ ] Implement Mode 1 (Fire former) — 2×2 grid, free-text entry
- [ ] Implement Mode 2 (Byg navneordet) — tap-to-place tile workbench
- [ ] Implement Mode 3 (Adjektivværkstedet) — multiple-choice or free-text
- [ ] Implement Mode 4 (Sammenligningspressen) — three-slot entry
- [ ] Implement Mode 5 (Bestemt eller ubestemt?) — multiple-choice with context
- [ ] Implement Mode 6 (Mængdeværkstedet) — multiple-choice
- [ ] Implement SOUND_THEME using DanskCore.ui.sound.sequence
- [ ] Implement SRS with pattern keys via DanskCore.srs
- [ ] Implement round-end screen (score, accuracy, ≤3 weak items, Spil igen, Gentag fejl)
- [ ] Implement cross-game chips on round end (e.g. "Problemer med flertalsformer? → En/Et-træner")
- [ ] Verify: all six modes playable, 300 verified nouns, no En/Et-træner duplication
- [ ] Verify: keyboard full operation, 360 px layout, dark mode, reduced motion
- [ ] Verify: TTS on all Danish prompts, zero console errors via file://
- [ ] Register game in `/index.html` GAMES array (status → "active")

---

## Phase 3 — Pronomenmysteriet 🕵️

**Game ID:** `pronomenmysteriet`  
**Folder:** `/pronomenmysteriet/`  
**Levels:** A2–B2  
**Priority:** Tier 1  
**Depends on:** Phase 1 (pronouns.js)

### 3.1 Scope

Teaches grammatical reference and ownership in context. Every difficult item must provide enough context to make the intended answer uniquely defensible. Must not be a vocabulary-matching game or isolated pronoun table drill.

### 3.2 Visual Design

Theme: navy courtroom + case files (Ace Attorney investigation feel — do not copy characters, assets, or dialogue boxes).

```
Palette:
  Navy:          #17233F   (background)
  Deep navy:     #0D1426   (dark background)
  Gold:          #D2A94F   (dividers, title)
  Paper:         #F0E7D2   (cards, evidence)
  Ink:           #22242B
  Evidence blue: #3F6C94
  Correct green: #3C7B61
  Wrong red:     #A73D43
```

Key UI elements:
- Each item displayed as a miniature "case" with character nameplates and context sentences
- Evidence cards (pronoun options) placed in a case file panel
- Correct: case file closes with green seal
- Wrong: one evidence line revealed explaining the reference rule
- Special dramatic "objection" impact only on boss items (at most once per round)

### 3.3 File Structure

```
/pronomenmysteriet/
  index.html       ← full game
  data.js          ← 760 curated items, exports window.PRONOMEN_DATA
```

### 3.4 Data Schema

```js
{
  id: "peter-sin-kone-own",
  level: "A2",
  mode: "reflexive_possessive",
  context_da: [
    "Peter er gift med Anna.",
    "Han taler om sin kone."
  ],
  sentence_da: "Peter taler om ___ kone.",
  options: ["sin", "hans", "deres"],
  correct: "sin",
  reference: { subject: "Peter", owner: "Peter", possessed: "kone" },
  gloss_en: "Peter talks about his own wife.",   // only when context alone cannot disambiguate
  note: "Sin viser tilbage til sætningens subjekt."
}
```

### 3.5 Modes

#### Mode 1 — Subjekt eller objekt (120 items)

Coverage: jeg/mig, du/dig, han/ham, hun/hende, vi/os, I/jer, de/dem.
Include coordinated phrases: "Mette og jeg", "Han talte med Mette og mig".
Do not teach prescriptive rules that conflict with normal contemporary usage without a register note.

#### Mode 2 — Min, mit eller mine (120 items)

Possessive agreement: min/mit/mine, din/dit/dine, sin/sit/sine, vores, jeres, deres.
Possessive agrees with the possessed noun, not the owner.

QA rule: every item note must mention the possessed noun's gender/number, not the owner.

#### Mode 3 — Sin eller hans? (180 items)

Reflexive vs. non-reflexive possessive. Every item must provide:
- Clear grammatical subject
- Clear owner
- Optionally: visual ownership diagram or prior sentence establishing ownership

English gloss permitted only when Danish context cannot efficiently disambiguate.

QA gate: item is invalid if two options remain plausible after reading the full context.

#### Mode 4 — Den, det eller de? (100 items)

Anaphoric agreement with gender, number, and reference type:
- Grammatical gender (en → den, et → det)
- Plural → de
- Reference to clauses/situations → det
- Reference to people → personal pronoun, not den/det

#### Mode 5 — Nogen, nogle eller noget? (140 items)

Coverage: nogen, nogle, noget, ingen, intet, man, en (generic), alle, begge, hver, hverken.
Context determines countability, polarity (question/negation), quantity, and register.

QA: Do not claim absolute rules for nogen/nogle without accounting for questions, negation, hypothetical meaning, and register variation.

#### Mode 6 — Demonstrativsporet (100 items)

Coverage: denne/dette/disse, den/det/de (demonstrative use), sådan/sådant/sådanne, samme, selv, egen/eget/egne.

### 3.6 Sound Design

```js
const SOUND_THEME = {
  select() {
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 440, duration: 0.06, gain: 0.03 }
    ]);
  },
  correct() {
    DanskCore.ui.sound.sequence([
      { type: "sine",     frequency: 180, duration: 0.08, gain: 0.05 },
      { type: "sine",     frequency: 440, duration: 0.08, gain: 0.06, delay: 0.10 },
      { type: "sine",     frequency: 660, duration: 0.10, gain: 0.05, delay: 0.18 }
    ]);
  },
  wrong() {
    DanskCore.ui.sound.sequence([
      { type: "noise",    frequency: 0,   duration: 0.08, gain: 0.035 },
      { type: "sine",     frequency: 220, duration: 0.10, gain: 0.03,  delay: 0.08 }
    ]);
  },
  special() {   // boss items only, at most once per round
    DanskCore.ui.sound.sequence([
      { type: "square",   frequency: 160, duration: 0.12, gain: 0.07 },
      { type: "sine",     frequency: 320, duration: 0.10, gain: 0.06, delay: 0.14 }
    ]);
  },
  roundComplete() {
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 180, duration: 0.10, gain: 0.07 },
      { type: "triangle", frequency: 180, duration: 0.10, gain: 0.07, delay: 0.22 },
      { type: "triangle", frequency: 180, duration: 0.10, gain: 0.07, delay: 0.44 },
      { type: "sine",     frequency: 330, duration: 0.40, gain: 0.07, delay: 0.60 }
    ]);
  }
};
```

### 3.7 Phase 3 Tasks

- [ ] Write `data.js`: Mode 1 subject/object items (120, include coordinated phrases)
- [ ] Write `data.js`: Mode 2 possessive agreement items (120)
- [ ] Write `data.js`: Mode 3 reflexive possessive items (180, each manually verified per QA gate)
- [ ] Write `data.js`: Mode 4 den/det/de items (100)
- [ ] Write `data.js`: Mode 5 nogen/nogle/noget items (140)
- [ ] Write `data.js`: Mode 6 demonstrative items (100)
- [ ] Manual QA pass: every Mode 3 item checked for unique defensibility (no two plausible answers)
- [ ] Run `validate.js` — zero errors
- [ ] Write `index.html`: navy courtroom visual theme
- [ ] Implement start screen with compact mode/level controls
- [ ] Implement case-file card layout with character nameplate and context sentences
- [ ] Implement evidence card tap-to-answer interaction (max two taps)
- [ ] Implement all six modes routing to correct item types
- [ ] Implement SOUND_THEME (including special event gating: once per round, boss items only)
- [ ] Implement SRS with pattern keys (e.g. `pattern:pronomenmysteriet:reflexive:sin-sit-sine`)
- [ ] Implement round-end screen
- [ ] Implement cross-game chips (e.g. "Problemer med sin/sit/sine? → Pronomenmysteriet")
- [ ] Verify: all six modes, ≥700 items, no ambiguous reflexive-possessive items
- [ ] Verify: TTS on all Danish context and target sentences
- [ ] Verify: keyboard, 360 px, dark mode, reduced motion, zero console errors via file://
- [ ] Register game in `/index.html` GAMES array

---

## Phase 4 — Sætningsmaskinen ⚙️

**Game ID:** `saetningsmaskinen`  
**Folder:** `/saetningsmaskinen/`  
**Levels:** A2–C1  
**Priority:** Tier 1  
**Depends on:** Phase 1 (clause-patterns.js, verbs.js)

### 4.1 Scope

Extends Ordstillingsdetektiven beyond basic V2. Do not reproduce large sets of ordinary V2 exercises. Focus: adverb placement in clauses, main-to-subordinate transformation, questions, indirect questions, relative clauses, der/det, complex clause chains.

### 4.2 Visual Design

Theme: Baba Is You word blocks (do not copy levels, sprites, or fonts).

```
Palette:
  Background cream:  #F2E7CC
  Main clause coral: #D96D5F
  Subordinate blue:  #4E82A6
  Relative green:    #5F8B68
  Question violet:   #75639B
  Neutral tile:      #F8F2E4
  Tile ink:          #25262B
  Wrong red:         #B54A47

Dark mode:
  Charcoal background, desaturated tile colours, cream text, no neon glow
```

Key UI elements:
- Word blocks displayed as rounded-corner chips
- Tiles wobble max 2 px to indicate selectability
- Correct tiles snap into place; wrong tiles bounce back to origin
- Clause zones colour-coded by type (coral/blue/green/violet)
- No large drag operations — tap-to-select, tap-destination to place

### 4.3 File Structure

```
/saetningsmaskinen/
  index.html
  data.js        ← exports window.SAETNINGS_DATA
```

### 4.4 Modes

#### Mode 1 — Ikke-flytteren (140 items)

Adverb placement in main vs. subordinate clauses.

Core contrast: `Han kommer ikke.` vs. `Jeg ved, at han ikke kommer.`

Adverbs covered: ikke, altid, aldrig, ofte, måske, sandsynligvis, heldigvis, desværre, allerede.

Only tests clause position — not adverb meaning (covered by existing adverbs game).

**Data schema:**
```js
{
  id: "ikke-ledsaetning-kommer",
  level: "A2",
  mode: "adverb_placement",
  clause_type: "subordinate",
  tokens: ["at", "han", "kommer", "ikke", "i dag"],
  movable_token: "ikke",
  accepted_orders: [["at", "han", "ikke", "kommer", "i dag"]],
  note: "I ledsætninger står ikke før det finitte verbum."
}
```

#### Mode 2 — Hovedsætning til ledsætning (160 items)

Transform a complete main clause into a subordinate clause using a provided frame.

Conjunctions supplied (learner not tested on connector choice): at, fordi, selvom, hvis, når, da, mens, før, efter at.

**Data schema:**
```js
{
  id: "arbejder-ikke-fordi",
  level: "B1",
  mode: "main_to_subordinate",
  source: "Han arbejder ikke i dag.",
  frame: "Jeg ved, at ...",
  tiles: ["han", "arbejder", "ikke", "i dag"],
  accepted_orders: [["han", "ikke", "arbejder", "i dag"]],
  full_answer: "Jeg ved, at han ikke arbejder i dag.",
  note: "I at-ledsætningen står ikke før arbejder."
}
```

#### Mode 3 — Byg spørgsmålet (140 items)

Coverage: yes/no questions, hv-questions, questions with prepositions, subject questions, object questions.

Use constrained tile banks with accepted_orders. Do not use unrestricted free text where multiple unrelated questions would be valid.

#### Mode 4 — Indirekte spørgsmål (140 items)

Coverage: no inversion in indirect questions, `om` for yes/no content, `hv- + der` in subject questions, punctuation.

**Data schema:**
```js
{
  id: "hvem-der-kommer",
  level: "B1",
  mode: "indirect_question",
  prompt: "Jeg ved ikke, ___ kommer.",
  tiles: ["hvem", "der", "hvem der", "kommer"],
  accepted_answers: ["hvem der"],
  note: "Som subjekt følges hvem normalt af der."
}
```

#### Mode 5 — Relativværkstedet (180 items)

Coverage: som, der, hvor, hvis, hvilket, hvad. Teach omission where natural.

Accepted answers must include valid omission variants where the relative pronoun is an object (do not accept omission when the relative word is the subject).

**Data schema:**
```js
{
  id: "bogen-som-jeg-laeser",
  level: "B1",
  mode: "relative_clause",
  context: "Bogen er lang. Jeg læser bogen.",
  target_frame: "Bogen, ___, er lang.",
  accepted_answers: ["som jeg læser", "jeg læser"],
  note: "Objektet som kan udelades i relativsætningen."
}
```

#### Mode 6 — Der eller det? (160 items)

Distinguish: weather/impersonal `det`, extraposition `det`, existential `der`, locative `der`, presentational constructions, `der` as relative subject.

Do not present as simple translations of "there" and "it".

#### Mode 7 — Sætningskæden (100 items, B2–C1)

Complex clause chains with up to five movable chunks, colour-coded clause boundaries, optional punctuation slots.

Example: `Jeg tror, at den bog, som hun anbefalede, ikke længere kan købes.`

Prioritise readability; avoid long drag operations — use tap-to-select + tap-slot.

### 4.5 Sound Design

```js
const SOUND_THEME = {
  select() {
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 420, duration: 0.07, gain: 0.03 }
    ]);
  },
  move() {
    DanskCore.ui.sound.sequence([
      { type: "noise", frequency: 0, duration: 0.06, gain: 0.025 }
    ]);
  },
  correct() {     // magnetic snap
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 180, duration: 0.05, gain: 0.05 },
      { type: "triangle", frequency: 520, duration: 0.08, gain: 0.06, delay: 0.06 }
    ]);
  },
  wrong() {       // elastic bounce
    DanskCore.ui.sound.sequence([
      { type: "sine", frequency: 240, duration: 0.10, gain: 0.04 },
      { type: "sine", frequency: 150, duration: 0.06, gain: 0.03, delay: 0.10 }
    ]);
  },
  roundComplete() {
    DanskCore.ui.sound.sequence([
      { type: "square", frequency: 260, duration: 0.08, gain: 0.06 },
      { type: "square", frequency: 330, duration: 0.08, gain: 0.06, delay: 0.14 },
      { type: "sine",   frequency: 440, duration: 0.40, gain: 0.07, delay: 0.30 }
    ]);
  }
};
```

### 4.6 Animation Rules

- Tiles wobble max 2 px (CSS: `@keyframes wobble { 0%,100% { transform:translateX(0) } 50% { transform:translateX(2px) } }`)
- Correct tile: snap animation 130 ms
- Wrong tile: bounce back directly to origin (no long arc)
- Under `prefers-reduced-motion`: replace wobble + snap with colour/outline change

### 4.7 Phase 4 Tasks

- [ ] Write `data.js`: Mode 1 adverb placement items (140)
- [ ] Write `data.js`: Mode 2 main-to-subordinate items (160)
- [ ] Write `data.js`: Mode 3 direct question items (140)
- [ ] Write `data.js`: Mode 4 indirect question items (140)
- [ ] Write `data.js`: Mode 5 relative clause items (180)
- [ ] Write `data.js`: Mode 6 der/det items (160)
- [ ] Write `data.js`: Mode 7 clause chain items (100, B2–C1)
- [ ] Run `validate.js` — zero errors; verify accepted_orders cover valid alternatives
- [ ] Write `index.html`: Baba Is You block visual theme
- [ ] Implement tap-to-select + tap-to-place tile engine (reuse DanskCore.quiz.tiles)
- [ ] Implement clause zone colour coding per clause type
- [ ] Implement all seven modes routing to correct item types
- [ ] Implement tile wobble animation (respects reduced-motion)
- [ ] Implement SOUND_THEME
- [ ] Implement SRS with pattern keys
- [ ] Implement round-end screen with cross-game chips
- [ ] Verify: seven modes, ≥900 items, no ordinary V2 duplication
- [ ] Verify: tile interaction works with touch and keyboard
- [ ] Verify: TTS on source and target sentences
- [ ] Verify: 360 px, dark mode, reduced motion, zero console errors via file://
- [ ] Register game in `/index.html` GAMES array

---

## Phase 5 — Tidsmaskinen ⏳

**Game ID:** `tidsmaskinen`  
**Folder:** `/tidsmaskinen/`  
**Levels:** A2–C1  
**Priority:** Tier 1  
**Depends on:** Phase 1 (verbs.js, clause-patterns.js); benefits from Phase 4 clause patterns

### 5.1 Scope

Tests tense and construction choice in context — not isolated conjugation drills. Every item must include time expressions or contextual cues. Do not map Danish tense to English tense mechanically.

### 5.2 Visual Design

Theme: horizontal timeline with time gates (Chrono Trigger feeling — do not copy characters, sprites, or fonts).

```
Palette:
  Deep blue:      #17263B   (background)
  Night blue:     #0D1725   (dark mode bg)
  Past amber:     #B67A3D
  Present cyan:   #3C93A8
  Future violet:  #7263A8
  Ongoing green:  #4D8A68
  Completed gold: #D2AA52
  Wrong red:      #A74849
  Text cream:     #EEE6D2
```

Key UI elements:
- Horizontal timeline at top of item card showing start/end/ongoing status
- Event markers slide along timeline when correct answer chosen
- Background remains static (never shake sentence text)
- Options shown as small cards below sentence
- Timeline movement animation: subtle filtered sweep (disabled under reduced-motion)

### 5.3 File Structure

```
/tidsmaskinen/
  index.html
  data.js        ← exports window.TIDS_DATA
```

### 5.4 Modes

#### Mode 1 — Nutid eller datid? (120 items)

Coverage: current situations, past completed, habitual actions, narrative sequences, historical present (when explicitly introduced), present tense with scheduled future meaning. Items must contain time expressions or context.

#### Mode 2 — Datid eller perfektum? (180 items)

Core contrast: completed past period vs. ongoing current relevance.
Coverage: completed past, current relevance, life experience, unfinished periods, siden, i, for ... siden, already/yet constructions, recent events.
Avoid presenting as a direct copy of English perfect/preterite usage.

**Data schema:**
```js
{
  id: "har-boet-siden-2023",
  level: "B1",
  mode: "preterite_vs_perfect",
  context: "Hun flyttede til Aarhus i 2023 og bor der stadig.",
  sentence: "Hun ___ i Aarhus siden 2023.",
  options: ["boede", "har boet", "havde boet", "bor"],
  correct: "har boet",
  timeline: { start: "2023", end: "now", ongoing: true },
  note: "Perfektum forbinder begyndelsen med nutiden."
}
```

#### Mode 3 — Før fortiden (100 items)

Pluskvamperfektum: arrange two past events on the timeline, select which receives pluskvamperfektum, later rounds construct full sentence.

#### Mode 4 — Fremtidsværkstedet (140 items)

Coverage: present tense (scheduled), skal (obligation/arrangement), vil (willingness/intention), kommer til at (prediction), intention, arrangement, prediction, obligation.
Teach meaning differences — do not label all forms "future tense".

**Data schema:**
```js
{
  id: "toget-afgaar-i-morgen",
  level: "A2",
  mode: "future",
  context: "Afgangen står allerede i køreplanen.",
  sentence: "Toget ___ klokken otte i morgen.",
  accepted_answers: ["afgår"],
  distractors: ["vil afgå", "kommer til at afgå", "afgik"],
  note: "Planlagte fremtidige begivenheder kan stå i nutid."
}
```

#### Mode 5 — Modalcentralen (180 items)

Coverage: kan, kunne, må, måtte, skal, skulle, vil, ville, bør, burde.
Meaning categories: ability, permission, possibility, obligation, advice, intention, reported expectation, politeness, hypothetical.
Context is mandatory for every item.

#### Mode 6 — Hvis-portalen (140 items)

Conditionals: real/open, hypothetical present, counterfactual past, polite hypothetical, tense consistency.
Higher-level items may accept more than one natural construction when meanings are equivalent.

**Data schema:**
```js
{
  id: "havde-tid-ville-hjaelpe",
  level: "B2",
  mode: "conditional",
  context: "Jeg har ikke tid nu.",
  sentence: "Hvis jeg ___ tid, ___ jeg hjælpe.",
  slots: [
    { accepted_answers: ["havde"] },
    { accepted_answers: ["ville"] }
  ],
  note: "Hypotetiske nutidssituationer bruger datid og ville."
}
```

#### Mode 7 — At eller ikke at? (140 items)

Infinitive constructions: modal + infinitive without at, at after lexical verbs, for at, ved at, til at, perception verbs, causative få, lade.

#### Mode 8 — Aktiv eller passiv? (180 items)

Coverage: active, -s passive, blive passive, være + participle (state), impersonal passive, der + passive, register and aspect differences.

Do not state that -s passive and blive passive are always interchangeable.

**Data schema:**
```js
{
  id: "doeren-aabnes-klokken-otte",
  level: "B2",
  mode: "passive",
  context: "Skiltet beskriver den faste procedure.",
  sentence: "Døren ___ klokken otte.",
  options: ["åbner", "åbnes", "bliver åbnet", "er åbnet"],
  correct: "åbnes",
  accepted_answers: ["åbnes"],
  note: "S-passiv passer til faste regler og procedurer."
}
```

#### Mode 9 — Kommandoværkstedet (80 items)

Imperatives: regular forms, irregular high-frequency, negative instructions, polite alternatives, particles, lad være med at.

Compact mode — does not become its own game.

### 5.5 Timed Mode

All modes offer Træning (default) and Timed variants.
- Træning: default for new players; no time pressure
- Timed: timer visible but visually secondary; expiration = unanswered (not grammatical error); timed miss = same SRS penalty as ordinary miss; time pressure not introduced in first several correct items

### 5.6 Sound Design

```js
const SOUND_THEME = {
  select() {    // clock-hand tick
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 880, duration: 0.04, gain: 0.025 }
    ]);
  },
  correct() {   // phase-lock
    DanskCore.ui.sound.sequence([
      { type: "sine", frequency: 220, duration: 0.08, gain: 0.05 },
      { type: "sine", frequency: 440, duration: 0.08, gain: 0.06, delay: 0.10 },
      { type: "sine", frequency: 660, duration: 0.12, gain: 0.05, delay: 0.20 }
    ]);
  },
  wrong() {     // muted clock reversal
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 330, duration: 0.06, gain: 0.04 },
      { type: "triangle", frequency: 220, duration: 0.08, gain: 0.035, delay: 0.08 }
    ]);
  },
  timeGate() {  // mode change or boss round only; disabled under reduced-motion or sound-off
    DanskCore.ui.sound.sequence([
      { type: "sine", frequency: 330, duration: 0.25, gain: 0.06 },
      { type: "sine", frequency: 440, duration: 0.25, gain: 0.06, delay: 0.15 },
      { type: "sine", frequency: 550, duration: 0.20, gain: 0.05, delay: 0.30 }
    ]);
  },
  roundComplete() {   // four-note ascending + tick
    DanskCore.ui.sound.sequence([
      { type: "sine",     frequency: 220, duration: 0.10, gain: 0.06 },
      { type: "sine",     frequency: 277, duration: 0.10, gain: 0.06, delay: 0.15 },
      { type: "sine",     frequency: 330, duration: 0.10, gain: 0.06, delay: 0.30 },
      { type: "sine",     frequency: 440, duration: 0.12, gain: 0.07, delay: 0.45 },
      { type: "triangle", frequency: 880, duration: 0.04, gain: 0.04, delay: 0.60 }
    ]);
  }
};
// No continuous ticking during play
```

### 5.7 Phase 5 Tasks

- [ ] Write `data.js`: Mode 1 present/preterite items (120)
- [ ] Write `data.js`: Mode 2 preterite/perfect items (180)
- [ ] Write `data.js`: Mode 3 pluskvamperfekt items (100)
- [ ] Write `data.js`: Mode 4 future construction items (140)
- [ ] Write `data.js`: Mode 5 modal verb items (180)
- [ ] Write `data.js`: Mode 6 conditional items (140)
- [ ] Write `data.js`: Mode 7 infinitive pattern items (140)
- [ ] Write `data.js`: Mode 8 passive items (180)
- [ ] Write `data.js`: Mode 9 imperative items (80)
- [ ] Run `validate.js` — zero errors; verify every item has temporal context
- [ ] Write `index.html`: deep-blue timeline visual theme
- [ ] Implement timeline component (horizontal bar, event markers, zone colours)
- [ ] Implement timeline marker animation (respects reduced-motion)
- [ ] Implement Træning/Timed mode toggle (Træning is default)
- [ ] Implement timer UI (visible but visually secondary; expiry = unanswered)
- [ ] Implement multiple-choice answer interaction for all single-slot modes
- [ ] Implement multi-slot fill for Mode 3 (plus-kvamperfektum) and Mode 6 (conditionals)
- [ ] Implement SOUND_THEME (no continuous ticking)
- [ ] Implement SRS with pattern keys
- [ ] Implement round-end screen with weak-item chips and cross-game links
- [ ] Verify: nine modes, ≥1,100 contextual items, no isolated conjugation drills
- [ ] Verify: timeline visuals work at 360 px on mobile
- [ ] Verify: TTS for contexts and sentences, multiple accepted answers where required
- [ ] Verify: Træning mode, stable SRS, dark mode, reduced motion, zero console errors
- [ ] Register game in `/index.html` GAMES array

---

## Phase 6 — Skrivekontrollen ✍️

**Game ID:** `skrivekontrollen`  
**Folder:** `/skrivekontrollen/`  
**Levels:** B1–C1  
**Priority:** Tier 2 — build last  
**Depends on:** All previous phases (uses examples and patterns from other games)

### 6.1 Scope

Proofreading controlled texts with known correction targets. Not: spelling-only, free-form evaluation, connector cloze, vocabulary quiz. Uses carefully controlled sentences with exactly documented errors.

### 6.2 Visual Design

Theme: proofreader's desk + typewritten documents (Return of the Obra Dinn aesthetic — do not copy game assets, exact rendering, or interface composition).

```
Palette:
  Paper:          #E8E0C8   (light background)
  Ink:            #23231F
  Dark paper:     #24251F   (dark mode)
  Dark ink:       #EAE3CF   (dark mode text)
  Proof red:      #A13D3D   (error marks)
  Correct green:  #47745A
  Margin blue:    #4F7183
  Highlight gold: #B69245
```

Key UI elements:
- Document panel with typewritten text
- Tapping an error span highlights it in proof red (magnifying glass cursor)
- Correction cards or inline edit for the highlighted span
- Correct: proof stamp animation with green seal (150–250 ms draw)
- Wrong: soft pencil eraser sound, no buzzer
- Page-turn transition between items
- Margin notes show the rule note

### 6.3 File Structure

```
/skrivekontrollen/
  index.html
  data.js        ← exports window.SKRIVE_DATA
```

### 6.4 Comma Convention Setting

The game must support two comma configurations remembered in localStorage:

```
Startkomma     ← comma before at-clauses required
Intet startkomma ← comma before at-clauses optional
```

The selected convention must be applied consistently. Never mark both valid comma systems as wrong simultaneously.

### 6.5 Modes

#### Mode 1 — Find fejlen (300 items)

One sentence, exactly one grammatical error.
- Tap the incorrect span → choose or type the correction (max two interactions)

Possible error types: agreement, pronoun, article, tense, clause word order, infinitive marker, passive form, quantifier, punctuation.

**Data schema:**
```js
{
  id: "ledsaetning-ikke-kommer",
  level: "B1",
  mode: "find_error",
  original: "Jeg tror, at han kommer ikke i dag.",
  error_spans: [
    {
      start_token: 4,
      end_token: 5,
      original: "kommer ikke",
      accepted_replacements: ["ikke kommer"]
    }
  ],
  corrected: "Jeg tror, at han ikke kommer i dag.",
  note: "I ledsætninger står ikke før det finitte verbum."
}
```

QA rule: every sentence must have exactly one documented target error; no accidental second errors.

#### Mode 2 — Kommakontrollen (250 items)

Comma placement across clause boundaries, relative clauses, parentheticals, lists, direct speech, introductory expressions.

**Data schema:**
```js
{
  id: "komma-at-ledsaetning-01",
  level: "B1",
  mode: "comma",
  text_without_commas: "Jeg tror at hun kommer i morgen",
  accepted: {
    start_comma: ["Jeg tror, at hun kommer i morgen."],
    no_start_comma: ["Jeg tror at hun kommer i morgen."]
  },
  note: "Kommaet følger den valgte kommapraksis."
}
```

Game reads the stored comma convention and marks accordingly.

#### Mode 3 — Sætningsgrænser (160 items)

Coverage: run-on sentences, comma splices, fragments, missing finite verbs, accidental splitting, overlong clause chains, coordination vs. subordination.

Use constrained correction options unless every acceptable answer can be listed.

#### Mode 4 — Hold tiden (120 items)

Tense consistency across a short text. Learner identifies and corrects the inconsistent form.

#### Mode 5 — Henvisningskontrollen (140 items)

Reference consistency: pronouns, repeated nouns, den/det/de, sin/hans/hendes, demonstratives, unclear antecedents.

Some items must ask the learner to identify ambiguity rather than forcing a single "correct" pronoun.

#### Mode 6 — Redigér teksten (100 items)

Short paragraphs with 2–3 controlled problems. Text length by level: B1: 35–60 words, B2: 60–100 words, C1: 90–150 words.

**Data schema:**
```js
{
  id: "mail-til-udlejer-b2-01",
  level: "B2",
  mode: "edit_text",
  context: "Mail til en udlejer",
  original: "Jeg skriver fordi radiatoren virker ikke. Jeg har ringet i går men ingen svare.",
  issues: [
    { type: "word_order",  target: "radiatoren virker ikke", accepted_replacements: ["radiatoren ikke virker"] },
    { type: "tense",       target: "har ringet i går",       accepted_replacements: ["ringede i går"] },
    { type: "agreement",   target: "ingen svare",            accepted_replacements: ["ingen svarer", "ingen svarede"] }
  ],
  note: "Ret ordstilling, tid og verbalform i sammenhæng."
}
```

Contexts: email to school, message to landlord, workplace update, complaint, application paragraph, municipal communication, opinion paragraph, event description.

Do not reproduce official exam content.

#### Mode 7 — Registereftersyn (120 items)

Grammar and formality: spoken fragments, informal ellipsis, du/De, contractions, formal noun phrases, polite modal constructions, consistent address forms.

Grammar-and-register mode — not a general style grader. Do not mark stylistic preferences as grammatical errors.

### 6.6 Sound Design

```js
const SOUND_THEME = {
  select() {    // pencil tap
    DanskCore.ui.sound.sequence([
      { type: "triangle", frequency: 600, duration: 0.05, gain: 0.025 }
    ]);
  },
  correct() {   // proof stamp
    DanskCore.ui.sound.sequence([
      { type: "square",   frequency: 160, duration: 0.07, gain: 0.06 },
      { type: "sine",     frequency: 480, duration: 0.08, gain: 0.06, delay: 0.08 },
      { type: "triangle", frequency: 620, duration: 0.07, gain: 0.05, delay: 0.16 }
    ]);
  },
  wrong() {     // soft eraser
    DanskCore.ui.sound.sequence([
      { type: "noise", frequency: 0, duration: 0.12, gain: 0.035 }
    ]);
  },
  textCorrection() {    // one typewriter key per completed correction (not per character)
    DanskCore.ui.sound.sequence([
      { type: "square", frequency: 440, duration: 0.04, gain: 0.04 }
    ]);
  },
  roundComplete() {
    DanskCore.ui.sound.sequence([
      { type: "square",   frequency: 440, duration: 0.04, gain: 0.06 },
      { type: "square",   frequency: 440, duration: 0.04, gain: 0.06, delay: 0.18 },
      { type: "square",   frequency: 440, duration: 0.04, gain: 0.06, delay: 0.36 },
      { type: "square",   frequency: 160, duration: 0.10, gain: 0.07, delay: 0.55 },
      { type: "sine",     frequency: 480, duration: 0.08, gain: 0.06, delay: 0.68 }
    ]);
  }
};
```

### 6.7 Phase 6 Tasks

- [ ] Write `data.js`: Mode 1 single-error sentence items (300; each manually verified for exactly one error)
- [ ] Write `data.js`: Mode 2 comma items (250; both convention variants documented)
- [ ] Write `data.js`: Mode 3 sentence-boundary items (160)
- [ ] Write `data.js`: Mode 4 tense-consistency items (120)
- [ ] Write `data.js`: Mode 5 reference-consistency items (140)
- [ ] Write `data.js`: Mode 6 editing texts (100; 2–3 documented errors each)
- [ ] Write `data.js`: Mode 7 register items (120)
- [ ] Run `validate.js` — zero errors; verify no unintended errors in any sentence
- [ ] Write `index.html`: typewritten paper visual theme
- [ ] Implement comma convention toggle (localStorage-persisted)
- [ ] Implement tap-error-span interaction for Mode 1
- [ ] Implement correction card selection (max two taps)
- [ ] Implement inline span edit for higher-level items
- [ ] Implement all seven modes routing to correct item types
- [ ] Implement proof-stamp animation for correct (respects reduced-motion: crossfade instead)
- [ ] Implement page-turn transition between items (respects reduced-motion)
- [ ] Implement SOUND_THEME (typewriter key per completed correction, not per character)
- [ ] Implement SRS with pattern keys
- [ ] Implement round-end screen
- [ ] Verify both comma configurations tested, both marked correctly per chosen setting
- [ ] Verify: no sentence has unintended errors; corrections support accepted alternatives
- [ ] Verify: text editing works without horizontal scrolling at 360 px
- [ ] Verify: full keyboard support, dark mode, reduced motion, TTS where useful
- [ ] Verify: stable SRS, zero console errors via file://
- [ ] Register game in `/index.html` GAMES array

---

## Cross-Game Curriculum Links

At round end, when a learner repeatedly misses a grammar pattern, show one related game chip. Show only one recommendation; do not interrupt the active round.

| Pattern | Chip |
|---|---|
| sin/sit/sine errors | → Pronomenmysteriet |
| ikke in subordinate clause | → Sætningsmaskinen |
| noun plural/definiteness | → Bøjningsværkstedet |
| tense choice | → Tidsmaskinen |
| comma errors | → Skrivekontrollen |

---

## Shared SRS Key Format

```
<game-id>:<mode>:<item-id>
boejningsvaerkstedet:noun-form:bog-bestemt-flertal
pronomenmysteriet:reflexive:peter-sin-kone-own
saetningsmaskinen:indirect-question:hvem-der-kommer
tidsmaskinen:perfect:har-boet-siden-2023
skrivekontrollen:word-order:ledsaetning-ikke-kommer

pattern:boejningsvaerkstedet:noun:definite-plural:umlaut-er
pattern:saetningsmaskinen:clause:subordinate:ikke-before-finite
pattern:tidsmaskinen:tense:perfect:ongoing-since
```

---

## Animation Timing (All Games)

| Event | Duration |
|---|---|
| Tap response | < 100 ms |
| Correct animation | 250–600 ms |
| Wrong bounce | 150–300 ms |
| Auto-advance delay | ~800 ms |
| Round transition | < 1,200 ms |

Reduced-motion rules (all games):
- Remove screen shake and parallax
- Replace sliding with opacity changes
- Replace bouncing with colour/outline changes
- Keep functional state transitions and sound independently configurable

---

## Dataset Production Checklist (All Games)

Every dataset must pass before the game ships:

1. Structural validation (unique IDs, allowed levels, required fields, valid answer fields)
2. Duplicate detection (after normalization: lowercase, no punctuation, whitespace collapsed)
3. Danish-language review (contemporary natural Danish, no doubtful forms as authoritative)
4. Grammar review (correct forms, correct rules)
5. Ambiguity review (no item where two answers remain plausible)
6. Level review (A1 ≤10-word sentences with one decision; C1 complex clause relationships)
7. Interface rendering test (words wrap, tiles fit, no clipping at 360 px)
8. TTS test (all prompts spoken correctly)
9. Accepted-answer test (at least one accepted answer matches normalized input)
10. Final random sample review (10% spot check)

---

## Overall Definition of Done

The project is complete when all of the following are true:

- [ ] All five games registered and reachable from `/index.html`
- [ ] All five games work through `file://`
- [ ] No game duplicates an existing game's primary mechanic and domain
- [ ] All games support 360 px mobile layouts (no horizontal overflow)
- [ ] All games support full keyboard operation
- [ ] All games support dark mode
- [ ] All games support reduced motion
- [ ] All games support sound mute
- [ ] All Danish prompts have TTS where useful
- [ ] Every wrong answer displays one actionable grammar note in Danish
- [ ] Every free-text answer supports valid alternatives via accepted_answers
- [ ] All datasets use stable, unique IDs (no array indices as keys)
- [ ] All datasets pass the 10-stage production checklist
- [ ] Shared forms are canonical (no independent redefinition across games)
- [ ] Progress survives page reload
- [ ] Reset requires confirmation
- [ ] Empty review states are handled gracefully
- [ ] Timed modes include Træning
- [ ] No game loads external runtime resources
- [ ] No game produces console errors
- [ ] Grammar data has completed a dedicated Danish QA review
