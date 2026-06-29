# Danish Learning Games — Improvement Report

## 1. Executive Summary

The collection is a genuinely impressive amount of hand-built content — 10 single-file games, ~1,800 pieces of Danish data (verbs, idioms, phrases, prepositions, conjunctions, nouns, antonyms) — and the *engineering* is consistently above average for this kind of project: clean data/logic separation in most files, real localStorage-backed progress in 7 of 10 games, sensible mobile breakpoints, and several genuinely good pedagogical mechanics (Idiomjægeren's Leitner-box spaced repetition, Præpositionstest's "Gentag fejl" review queue, Magiske Verber's per-mode explanation panel).

The weaknesses cluster in three places:

1. **Content gaps and inconsistency.** The antonym game ships only 40 of the 341 curated CSV pairs (an 8.5× content shortfall). Every single game mixes CEFR levels freely with no leveling/filtering, so an A2 learner can be served C1 vocabulary with no warning. Three games (Verb-glosekort, En/Et-træner, Forbindenor) have **zero** progress persistence at all.
2. **A handful of real Danish-language defects that teach wrong information as fact** — a wrong verb conjugation (krybe → "krøber"), an internally contradictory idiom (Ukraine vs. Rusland), an ungrammatical conjunction-game sentence, and — most visibly — the Forbindenor game's own title misspells the very term it's teaching ("Forbindenor"/"forbinderord" instead of "forbindeord").
3. **No listening/pronunciation practice almost anywhere.** Only 1 of 10 games (Danske Antonymer) uses the Web Speech API. For a language as notoriously disconnected from its spelling as Danish, this is the single biggest missed opportunity across the whole project.

None of this requires a rewrite. Most fixes are small, targeted data/code edits (see Quick Wins, §11). The highest-leverage single change would be adding `speechSynthesis`-based audio to the games that already have the right sentence data sitting in JS arrays — it's a few lines per game and directly serves the "listening" goal stated in the project brief.

**Overall site rating: ~6/10** — solid bones, inconsistent finish.

## 2. Games Found

| Game | File path | Purpose | Target level | Main issue | Rating |
|---|---|---|---|---|---|
| Danske Antonymer | `danish-antonyms-game.html` (+ `danish_antonyms.csv`) | Antonym pairs via 6 modes (choice, match, reverse, type, speed, review) | A2–B2 (claimed) | The 341-row CSV is never loaded — gameplay runs on a hardcoded 40-pair sample the code itself labels "replace with your 500" | 4/10 |
| Verb-glosekort | `danish_flashcards/danish_flashcards_game/{index.html,script.js,style.css}` | Flip-card drill of 150 verb conjugations + example sentences | A2–B2 (unleveled) | Real conjugation errors shown as fact (krybe→"krøber"; bør/tør infinitive mislabeled); zero progress persistence | 6/10 |
| Magiske Verber | `magiske_verber.html` | Wizard-themed verb conjugation trainer, 8 mini-games | A2–B2 (mixed) | Many "same sentence across tenses" example triples actually swap subject/object mid-entry, breaking the exercise's own premise | 6/10 |
| Præpositionstest | `dansk-praepositioner.html` | Practice i/på/til/af/hos/etc. via 9 exercise modes | A2–B2 | "Translation mode" claims fuzzy matching in a code comment but only does exact string match; one sentence's "find the mistake" mode can be solved by clicking the *correct* word | 7/10 |
| Dansk Mester — Frasebygger | `danske-phraser/dansk-mester.html` | Recognition drill on everyday phrases/idioms (MC, flashcard, match) | A1–B2 (claimed) | Branded a "phrase builder" but has no construction mechanic at all — pure recognition; zero audio for a small-talk app | 5/10 |
| En/Et-træner | `en og et/index.html` | en/et noun-gender trainer + bonus antonym/synonym/sentence modes | A1–A2 (core), B1–B2 (bonus modes) | Zero explanation of *why* a noun is en/et — pure memorization, no rule-teaching even on misses; no progress persistence | 7/10 |
| Konjunktionsknus | `konjunktioner/konjunktioner.html` | Candy-Crush-style conjunction fill-in-the-blank | B1–B2 | One sentence is missing a verb (ungrammatical); a bonus-life timing bug can silently cancel game-over | 7/10 |
| Ordstillingsdetektiven | `ordstilling-detektiv/index.html` | Detective-themed word-order/V2-rule reordering game | A1–B2 | Exact-string answer checker rejects valid alternate word orders; lives-out can end a case before the advertised 60% threshold is ever evaluated | 7/10 |
| Forbindenor — Gitterprotokol | `forbindenor/Forbindenor.html` | Fill-in-the-blank drill on Danish connecting words, sci-fi theme | B1–C1 (sold as general) | The game's own title misspells "forbindeord" two different ways ("Forbindenor", "forbinderord"); zero progress persistence | 6/10 |
| Idiomjægeren | `idiomjaeger.html` | Idiom-hunting treasure game, 13 mini-games | A2–C1 (mixed pool) | Idiom #459 is internally contradictory (says "Ukraine" in the headword, "Rusland" in its own example sentence) | 6/10 |

*(`index.html`, the landing-page hub, is reviewed separately in §5/§6 — it isn't itself a learning game.)*

## 3. Highest Priority Improvements

### 1. Danske Antonymer ships 40 of 341 curated antonym pairs
**Problem:** `danish-antonyms-game.html` never fetches `danish_antonyms.csv` — no `fetch`/`XMLHttpRequest`/CSV-parsing code exists anywhere in the file. The actual gameplay data is a `const ANTONYMS` array (lines 416–472) explicitly commented "SAMPLE DATA (40 pairs) — replace with your 500."
**Why it matters:** Users get ~8.5× less content than the curated dataset provides; B1/B2 vocabulary like "rentabel/urentabel," "konkret/abstrakt" never appears in the actual game.
**Suggested fix:** Convert the CSV's 341 rows into the game's `{wordA,wordB,enA,enB,category,difficulty,exampleA,exampleB}` shape and paste them into `ANTONYMS` (file:// deployment means a runtime `fetch()` of the CSV would fail anyway, so hardcoding remains correct — it just needs the *full* dataset). Dedupe first (see Top Issue #2 in the language table).
**Difficulty:** Medium. **Files:** `danish-antonyms-game.html` (lines 416–472), `danish_antonyms.csv`.

### 2. Almost no Danish audio/pronunciation anywhere
**Problem:** Of 10 games, only Danske Antonymer implements `speechSynthesis`. The other 9 — including phrase, idiom, and preposition games whose entire value rests on natural spoken Danish — have zero audio.
**Why it matters:** Danish pronunciation diverges sharply from spelling, and several games specifically test content (small-talk phrases, idioms, unstressed prepositions) that is nearly meaningless without hearing it. This is the single biggest gap relative to the project's stated "listening" goal.
**Suggested fix:** Port the working pattern already proven in Danske Antonymer (`new SpeechSynthesisUtterance(text)`, `utterance.lang="da-DK"`, voice-detection with a "no Danish voice found" fallback message, `rate≈0.95`) into the other 9 games — add a 🔊 button next to each prompt/sentence/idiom.
**Difficulty:** Low–Medium per game (the speech API itself is a few lines; voice-availability fallback messaging is the only fiddly part).
**Files:** All game files except `danish-antonyms-game.html`.

### 3. Three games have zero progress persistence
**Problem:** Verb-glosekort, En/Et-træner, and Forbindenor use no `localStorage`/`sessionStorage` at all — confirmed via full-file search in each. All state (score, streak, current card) lives in plain JS variables and is wiped on every reload.
**Why it matters:** A 150-card verb deck, a 229-word gender trainer, and a 359-question connector drill are exactly the content sizes that need session-to-session memory; without it, users can never resume or build a weak-word list.
**Suggested fix:** Persist score/streak/per-item status to `localStorage` on every answer (the pattern is already implemented correctly in Magiske Verber, Præpositionstest, and Idiomjægeren — copy it).
**Difficulty:** Medium. **Files:** `danish_flashcards/danish_flashcards_game/script.js`, `en og et/index.html`, `forbindenor/Forbindenor.html`.

### 4. Confirmed factual Danish errors presented as ground truth
**Problem:** Several specific, verified errors teach wrong Danish:
- `danish_flashcards_game/script.js:58` — `krybe` present tense given as `krøber`; correct is `kryber`.
- `script.js:69-70` — `bør`/`tør` have their infinitive field set to the present-tense form; true infinitives are `burde`/`turde`.
- `idiomjaeger.html:459` — idiom headword says "Det er en by i **Ukraine**" but the idiom's own example sentence says "...en by i **Rusland**" — the real idiom references Russia, not Ukraine.
- `konjunktioner/konjunktioner.html:533` — "Hvis du skynder dig, når du bussen." is missing a verb; not grammatical Danish as written.
- `danish_antonyms.csv` row 67 — `head/feet` (`hoved/fødder`) is not an antonym pair at all.
**Why it matters:** These are shown to learners as authoritative fact in flashcard/quiz apps whose entire value proposition is correctness.
**Suggested fix:** Fix each value directly (see §4 table for exact corrections).
**Difficulty:** Low. **Files:** as listed above.

### 5. Forbindenor's title misspells its own subject
**Problem:** The game is about "forbindeord" (connecting words), but the page `<title>`, the giant H1 (line 141: `FORBIND<span class="o">ENOR</span>`), and the subtitle (line 142: "Danske **forbinderord**") use two different incorrect spellings, neither of which is a real Danish word.
**Why it matters:** This is the single most prominent text on the page, shown in huge glowing font on every screen, in a Danish-language teaching tool — and it's wrong. Any Danish speaker (or attentive A2 learner) will notice immediately, and it means the correct term "forbindeord" is never actually shown anywhere in the game.
**Suggested fix:** Change the H1 to `FORBIND<span class="o">EORD</span>` and the subtitle to "Danske forbindeord"; update `<title>` (and ideally the filename) to match.
**Difficulty:** Low. **Files:** `forbindenor/Forbindenor.html` (lines 6, 141, 142).

### 6. No CEFR leveling or filtering anywhere
**Problem:** Every single one of the 10 QA passes independently flagged the same pattern: vocabulary/grammar content spans 2–3 CEFR levels within one undifferentiated pool, with no per-item level tag and no way to filter. Examples: Idiomjægeren mixes A2 idioms with C1 ones in the same draw pool; Dansk Mester puts basic A2 reactions in the same category list as "Strong Native-Like Phrases" containing C1 proverbs; Forbindenor mixes "men"/"så" (A1) with "ikke desto mindre"/"sammenfattende kan man sige" (C1) in one shuffled 359-item deck.
**Why it matters:** A2 learners following the site's own level badges get ambushed by content far above their stated level, with no signal that this is happening.
**Suggested fix:** Add a `level` field to each game's data schema and either filter by it or visibly tag items; at minimum, sort/sequence by difficulty instead of full-shuffle.
**Difficulty:** Medium–High (touches data schema + UI in every game). **Files:** all game data arrays.

### 7. Magiske Verber's example sentences contradict themselves across tenses
**Problem:** The "Time Machine" mode presents present/past/perfect sentences as "the same sentence moved to a different time," but in roughly a third of the ~70 `ENTRIES`, the subject or object changes between the three tense versions (e.g. line 491: "Jeg [v] dansk og engelsk" (present) vs. "På mødet [v] hun længe" (past) — subject jumps jeg→hun and the topic changes entirely).
**Why it matters:** Learners doing the literal "transform this sentence into the past" exercise can't verify the transformation, because it isn't actually the same sentence — this actively undermines the exercise's teaching method.
**Suggested fix:** Rewrite each entry so all three tense forms share the same subject and object/complement.
**Difficulty:** Medium (content-authoring pass over ~70 entries). **Files:** `magiske_verber.html` (lines 391–523).

### 8. Mistakes are revealed, never explained
**Problem:** Across most games, a wrong answer triggers only "here's the correct answer" with no grammar/usage rationale — confirmed explicitly for Verb-glosekort, En/Et-træner, Forbindenor, and Ordstillingsdetektiven, and partially true even where an explanation exists but is generic (Magiske Verber shows the same case-level tip regardless of *which* wrong answer was picked).
**Why it matters:** For an audience explicitly targeted at A2–B2, generic right/wrong feedback is the weakest possible corrective mechanism; explaining the *rule* behind a mistake is what actually builds transferable understanding.
**Suggested fix:** Add a short rule/category tag per data item (e.g., "most living-being nouns are en-words" for En/Et-træner, "da = one-time past event, når = habitual" for Ordstillingsdetektiven) and surface it specifically on a miss.
**Difficulty:** Medium. **Files:** all game data arrays + their answer-feedback render functions.

### 9. Game-logic bugs let wrong/right be misjudged
**Problem:** Several concrete scoring bugs were found: (a) Konjunktionsknus's level-up bonus life (`konjunktioner.html:706`) can refill a player's last life *after* it hits 0, silently canceling game-over; (b) Præpositionstest's "find the mistake" mode (`dansk-praepositioner.html:909-915`) grades by string value, not click position, so for one sentence (line 491) clicking the genuinely *correct* word still registers as a win; (c) Dansk Mester has multiple Danish phrases sharing one English gloss (e.g. "tale om"/"snakke om" both = "talk about"), so its en→da quiz direction can mark a legitimately correct answer wrong.
**Why it matters:** These erode trust in the scoring system exactly where learners need to trust feedback most.
**Suggested fix:** Fix bonus-life ordering to check game-over first; fix mistake-mode to track DOM/index identity, not string value; dedupe English glosses or accept multiple valid Danish answers.
**Difficulty:** Low. **Files:** `konjunktioner/konjunktioner.html` (704-711), `dansk-praepositioner.html` (898-933), `danske-phraser/dansk-mester.html` (data + MC answer check).

### 10. No spaced-repetition/weak-word system outside 3 games
**Problem:** Idiomjægeren has a genuine Leitner-box SRS; Præpositionstest and Danske Antonymer have working "review mistakes" queues. The other 7 games either have no weak-item tracking at all, or (Konjunktionsknus) track only a single rolling high score with no per-item memory.
**Why it matters:** Spaced repetition on missed items is the single highest-leverage learning-science feature available to a flashcard/quiz site, and the project already has 3 working reference implementations to copy from.
**Suggested fix:** Port the Idiomjægeren/Præpositionstest weak-item pattern (per-item correct/wrong counters + a "review your mistakes" mode) into the remaining games.
**Difficulty:** Medium. **Files:** all game files lacking it.

## 4. Language and Translation Issues

| File | Current text | Problem | Suggested correction | Severity |
|---|---|---|---|---|
| `danish_antonyms.csv` row 67 | `66,head,feet,hoved,fødder` | Not an antonym pair (body parts, unrelated meaning) | Remove or replace | Critical |
| `danish_flashcards_game/script.js:58` | `infinitive:'krybe', present:'krøber'` | Wrong present tense; not a real Danish word | `present: 'kryber'` | Critical |
| `danish_flashcards_game/script.js:69` | `infinitive:'bør', past:'burde'` | Infinitive field holds the present-tense form; true infinitive `burde` mislabeled as past | `infinitive:'burde', present:'bør', past:'burde'` | Critical |
| `danish_flashcards_game/script.js:70` | `infinitive:'tør', past:'turde'` | Same mislabeling as `bør` | `infinitive:'turde', present:'tør', past:'turde'` | Critical |
| `magiske_verber.html:491` | `p:'Jeg [v] dansk og engelsk.'` / `d:'På mødet [v] hun længe.'` | Subject changes jeg→hun, topic changes entirely — breaks the tense-transform exercise | Make `d` use the same subject/topic, e.g. `'I går [v] jeg dansk på arbejdet.'` | Critical |
| `magiske_verber.html:457` | `pf:'Vasen har [v] på bordet hele dagen.'` (entry's subject elsewhere is "Bilen") | Subject swap car→vase mid-entry | `'Bilen har [v] i garagen hele dagen.'` | Critical |
| `magiske_verber.html:459` | `pf:'Bogen har [v] på bordet hele ugen.'` (entry's subject elsewhere is "Byen"/"huset") | Subject swap town/house→book | `'Huset har [v] midt i skoven i mange år.'` | Critical |
| `magiske_verber.html:448` | `p:'…cykel.'` / `d:'…bil.'` / `pf:'…hus.'` | Object swaps bicycle→car→house across one entry's three tenses | Use one object consistently throughout | Critical |
| `magiske_verber.html:494` | `p:` uses "Hun", `d:` uses "vi", `pf:` uses "Jeg" — three different senses of "høre" | Three subjects + three meanings (listen/hear-about/hear-a-rumor) crammed into one entry | Pick one subject and one sense for all three sentences | Critical |
| `konjunktioner.html:533` | `"___ du skynder dig, når du bussen."` | Missing verb ("nå") — not grammatical Danish | `"Hvis du skynder dig, kan du nå bussen."` | Critical |
| `idiomjaeger.html:459` | `d:"Det er en by i Ukraine"` vs. own example `"…er en by i Rusland for mig."` | Headword and example contradict each other; the real idiom references Russia | Change `d`/`k` to `"Det er en by i Rusland"` / `"Rusland"` | Critical |
| `forbindenor/Forbindenor.html:6,141` | `"FORBINDENOR"` (title + H1) | Not a Danish word; correct term is "forbindeord" | `"FORBINDEORD"` | Critical |
| `forbindenor/Forbindenor.html:142` | `"Danske forbinderord"` | Second, different misspelling of the same term one line below the (also wrong) title | `"Danske forbindeord"` | Critical |
| `danish_antonyms.csv` rows 3/129, 4/263, 202/212, 147/300 | e.g. `tall/short→høj,lav` and `high/low→høj,lav` | Exact-duplicate Danish pairs hidden behind different English glosses | Dedupe by Danish pair | Medium |
| `danish_antonyms.csv` row 102 | `favorite,hated,yndlings,hadet` | "yndlings-" is a bound prefix, not a standalone adjective — ungrammatical as paired | Use "favorit/hadet" or a different pair | Medium |
| `danish_antonyms.csv` rows 83-84 | `inside,outside,indre,ydre` | "indre/ydre" mean inner/outer (figurative), mismatched with spatial "inside/outside" | Relabel English to "inner/outer" or change Danish to "indenfor/udenfor" | Medium |
| `magiske_verber.html:450` | `p:'Posten [v] pakker…'` / `pf:'…har [v] dit brev.'` | Object swap parcels→your letter mid-entry | `pf:'Posten har [v] en stor pakke i dag.'` | Medium |
| `magiske_verber.html:433` | `p:'…gør et godt stykke arbejde.'` / `pf:'…har [v] det godt i år.'` | "gøre det godt" and "gøre et godt stykke arbejde" are different idioms, swapped mid-entry | `pf:'Holdet har [v] et flot stykke arbejde i år.'` | Medium |
| `magiske_verber.html:439` | `p:'…holder ved stoppestedet.'` / `pf:'…har [v] stille i ti minutter.'` | "holde stille" ≠ "holde ved stoppestedet" — different senses mixed | `pf:'Bussen har [v] ved stoppestedet i ti minutter.'` | Medium |
| `magiske_verber.html:502` | `p:'Filmen [v]…'` / `pf:'Mødet har [v]…'` | Subject swap film→meeting | `pf:'Filmen har [v] uden problemer.'` | Medium |
| `dansk-praepositioner.html:297-298` | "Skriv det venligst på telefonen/på computeren." | "på telefonen/computeren" for digital note-taking is an English-calque non-idiom; natives say "i telefonen/i computeren" | Split into a separate `i`-based item for devices, keep `på` for physical surfaces | Medium |
| `dansk-praepositioner.html:491` | "Hun er i lære hos en tømrer." (used as the find-the-mistake item) | Contains a second preposition before the answer slot, causing a real scoring bug (see §3 #9) | Reword to avoid a second preposition, or fix the grading logic | Critical (functional) |
| `konjunktioner.html:402` | "Jeg drikker te, når jeg fryser." with "hvis" marked wrong | "hvis" is also grammatical here (conditional reading) — false-binary distractor | Swap distractor for "da"/"som", or note the nuance | Medium |
| `konjunktioner.html:405` | "Han synger altid, når han er i godt humør." with "hvis" marked wrong | Same false-binary issue | Swap distractor | Medium |
| `konjunktioner.html` RULES (for/fordi) | No cross-reference between "for" and "fordi" rule text | The single most-asked B1/B2 conjunction pair (both = "because," different word order) is never directly contrasted | Add a short cross-reference note in both rule bodies | Medium |
| `danske-phraser/dansk-mester.html:384` | `{da:"Vi tager den senere", en:"We'll take it later"}` | Literal calque; unnatural English gloss | en: "We'll deal with it later" | Medium |
| `danske-phraser/dansk-mester.html:440` | `{da:"Tak for sidst", en:"Nice seeing you last time"}` | Gloss doesn't convey it's a greeting formula used at a *later* meeting | en: "Thanks for last time! (a greeting used next time you meet someone)" | Medium |
| `danske-phraser/dansk-mester.html` (many) | Questions like "Hvad tænker du", "Hvordan går det" | No question marks anywhere in the dataset despite being genuine questions | Add "?" throughout | Medium |
| `ordstilling-detektiv/index.html` (Case 12) | `grammarTip` never mentions `da`/`eftersom` though both appear in the sentence data (lines 672, 677, 681, 685) | The Da-vs-Når distinction (one of the most notorious English-speaker traps) is used correctly but never taught | Add explicit Da (one-time past) / Når (habitual) / Eftersom (formal "since") explanation to Case 12's tip | Medium |
| `idiomjaeger.html:429` | `d:"Have rejst sig på den forkerte side"` | Non-standard citation form (perfect-tense fragment); near-duplicate of #289's idiom | Normalize to infinitive form or merge with #289 | Medium |
| `idiomjaeger.html:441` | `m:"To be spot on"` for "Være lige i skabet" | Idiom actually means "perfectly suited," a narrower/different sense than "spot on" (accuracy) | Reword to "To be just right / perfectly suited" | Medium |

*(Each per-game QA pass also surfaced 5–10 additional Minor-severity items — phrasing register, missing punctuation, contrived examples. Full detail available on request; omitted here to keep this table actionable.)*

## 5. UX and Game Design Improvements

- **Theme-vs-mechanics mismatch is the most common design weakness.** Magiske Verber's wizard theme, Forbindenor's Tron/grid theme, Idiomjægeren's treasure-hunt theme, and Præpositionstest's Pokédex theme are all purely cosmetic skins over standard MC/fill-in-the-blank mechanics — none of them tie the theme into scoring, unlocks, or progression. This is a missed opportunity rather than a defect: e.g. Forbindenor's category structure (11 categories of connector words) is a natural fit for a genuine "catch and collect" mechanic that the Pokédex-adjacent visual language already implies.
- **"Builder"/"hunt"/"crush" names overpromise the actual mechanic.** Dansk Mester is branded a "phrase builder" with zero construction mechanic (pure recognition); Konjunktionsknus's "crush" is a 4-option multiple choice, not a real match/swap mechanic. Either rename to match what the game does, or add the promised mechanic (e.g., tap-to-assemble word chips for Dansk Mester).
- **No onboarding for the grammar concept being tested.** Konjunktionsknus shows three category labels (Hovedsætning/Ledsætning/Hv-ord) on the start screen with zero definition; the actual word-order rule is only ever revealed reactively, after a wrong answer. A one-time primer screen before first play would help every grammar-focused game, not just this one.
- **Pass/fail logic can contradict its own advertised threshold.** Ordstillingsdetektiven advertises "60% to pass" but a 3-lives-out condition can end a case before 60% of the questions are even attempted. Fix by either dropping the lives mechanic for case mode or clearly stating "3 wrong answers ends the case early" up front.
- **Inconsistent home/back navigation patterns.** Some games (En/Et-træner) hide their in-game back button until a round starts; all 10 games now have the site-wide "🏠 Oversigt" link, which is good, but several games' *internal* "back" buttons (Menu/Tilbage) only return to an in-app screen, not the site index — worth a single pass to make sure users always understand which "back" goes where.
- **Mobile-specific layout gaps**, found independently across multiple games: no `@media` queries at all in Konjunktionsknus; no breakpoint for Idiomjægeren's `.match-cols` two-column layout; En/Et-træner's `.match-wrap` has no overflow handling for long words like "vanskelighed." A single shared mobile QA pass across all 10 games (rather than per-game) would catch these efficiently.
- **Strong existing patterns worth reusing elsewhere:** Præpositionstest's drag-and-drop-with-tap-fallback for mobile (explicit "På mobil: tryk på en brik" hint) and Ordstillingsdetektiven's tap-to-place/tap-to-remove word ordering (avoids drag-and-drop touch bugs entirely) are both better mobile-interaction patterns than plain drag-and-drop and should be the template for any future game needing word-reordering.

## 6. Technical Improvements

- **Dead/misleading code comments that contradict actual behavior**, found in three different games — a recurring pattern worth a project-wide grep pass for comments mentioning "fuzzy," "easier first," or "TODO":
  - `dansk-praepositioner.html:1000-1001` — comment promises lenient/fuzzy translation matching; code only does exact match.
  - `ordstilling-detektiv/index.html:773-774` — comment claims "easier (earlier-indexed) first"; code fully shuffles before slicing, no such ordering exists.
  - `danske-phraser/dansk-mester.html:810` — a `total` variable is computed via a no-op ternary chain and never used (dead code).
- **Timer/interval leaks on navigation:** Idiomjægeren's `Q.timerH` (`idiomjaeger.html:710`) is only cleared inside `endQuiz()`; navigating away mid-Timed-Hunt via the Menu button never clears it, so the interval keeps firing and can silently overwrite whatever screen the user is later looking at once the original 60s elapses. Worth checking for the same pattern anywhere else `setInterval` is used for a countdown.
- **Self-referencing/fragile lookup data:** `dansk-praepositioner.html:253-254`'s `CONFUSE` map includes each preposition as one of its own confusable entries (`"af":["fra","for","af"]`) — currently harmless because the one read-site filters it out, but a landmine for any future code path that reads the map directly.
- **String-based mode detection instead of explicit flags:** `danske-phraser/dansk-mester.html:984` excludes certain modes from scoring via `title.includes('Mixed')` — fragile if a category name ever contains that substring.
- **Unsafe-pattern (not actually exploitable, but worth fixing) string-built `onclick` handlers:** Dansk Mester serializes config objects via `JSON.stringify(...).replace(/"/g,"'")` directly into inline `onclick` attributes (`dansk-mester.html:972,1012`) — works today because the data is static/trusted, but is a recurring anti-pattern that should be replaced with real event listeners + closures before any future data becomes user-editable.
- **No `.disabled` CSS rule despite the class being toggled in JS:** `danish_flashcards_game/script.js:265-266,270-271` add a `.disabled` class to buttons with zero matching CSS rule in `style.css` — already-answered cards look fully clickable even though clicking does nothing.
- **Array-index-as-ID risk:** Idiomjægeren keys all saved progress by `d.id = arrayIndex` (`idiomjaeger.html:477`). Any future content fix that reorders or removes an idiom (e.g., fixing the Ukraine/Rusland entry) will silently scramble every existing user's saved mastery data. Switch to a stable string key (e.g., the idiom text itself) before making further data edits.
- **No `try/catch` around `localStorage` writes in several games** (Konjunktionsknus, Dansk Mester) — will throw/silently no-op in storage-restricted contexts (strict private browsing) with no user-facing warning that progress isn't saving.
- **Minor duplicated logic** worth a light refactor: `danish-antonyms-game.html`'s `renderChoice`/`renderReverse` independently re-implement nearly identical "build 4 shuffled buttons + grade + feedback" logic (~35 overlapping lines).

## 7. Listening / Danish Audio Improvements

**Current state:** Only `danish-antonyms-game.html` implements speech synthesis, and it does it well — `SpeechSynthesisUtterance` with explicit `lang="da-DK"`, a priority-ordered Danish-voice search (`da-DK` exact match → any `da*` → null), a visible "No Danish voice found (using default)" fallback message, a manual "Test voice" button, a slightly-slowed `rate=0.95`, and speaker buttons attached to prompts, feedback, and example sentences. This is a genuinely solid reference implementation already living in the codebase.

**Gap:** None of the other 9 games use this API at all, despite several of them being exactly the content type where it matters most:
- **Dansk Mester** (phrase/small-talk app) — phrases like "Nå," "Pyt," and greeting formulas are essentially defined by their intonation; text alone can't teach them.
- **Idiomjægeren** — idioms carry distinctive stress/rhythm that's invisible in print.
- **Præpositionstest** — Danish prepositions are short and frequently phonetically reduced/swallowed in connected speech; a listening-recognition mode (hear the sentence, identify the preposition) would train a real skill the text-only format can't touch.
- **Verb-glosekort** and **Magiske Verber** — conjugated forms (e.g. "gjorde," "fulgt") have non-obvious pronunciations relative to spelling.

**Suggested rollout:** Copy the Danske Antonymer pattern verbatim into the other 9 games — it's a self-contained, dependency-free block (no backend, no audio files, just the built-in Web Speech API) that can be added without touching existing game logic. Priority order: Dansk Mester and Præpositionstest first (highest pedagogical payoff), then the rest.

## 8. Data Improvements

- **Antonyms CSV → game data pipeline is the single biggest data fix needed** (see §3 #1): import all 341 rows, not 40; dedupe the ~4 confirmed exact-duplicate Danish pairs (rows 3/129, 4/263, 202/212, 147/300); remove or fix the non-antonym pair (row 67, head/feet); the CSV has no `category`/`difficulty`/example-sentence columns at all, so importing it requires authoring those fields fresh — budget for ~341×2 new example sentences if the existing per-pair example-sentence feature is to be preserved at full scale.
- **Add a `level` (CEFR) field to every game's data schema.** This is the most repeated recommendation across all 10 QA passes (see §3 #6) and is a prerequisite for any real leveling/filtering UI.
- **Add a `note`/`why` field for rule-explanation text**, used on misses (see §3 #8) — needed in Verb-glosekort, En/Et-træner, Forbindenor, Ordstillingsdetektiven, and Dansk Mester specifically; partially present elsewhere.
- **Magiske Verber's `ENTRIES` need a subject/object-consistency pass** across all ~70 entries (see §3 #7) — this is pure data editing, no logic changes.
- **Gloss-collision cleanup in Dansk Mester:** at least 3 pairs of distinct Danish phrases currently share one identical English gloss ("tale om"/"snakke om", "Det tror jeg ikke"/"Det synes jeg ikke", "Det går nok"/"Det skal nok gå" — all glossed identically), which both confuses learners and causes the scoring bug noted in §3 #9.
- **Add a literal-meaning field for idioms** (`idiomjaeger.html`) — currently every entry has a figurative English meaning but never shows the literal word-for-word translation (e.g. "no cow on the ice" for "ingen ko på isen"), which is the single most memorable teaching device for idiom acquisition and is currently entirely absent from the data schema.
- **Add a register/formality tag** for informal/vulgar idioms and phrases (e.g. Idiomjægeren's "Tage røven på nogen," Dansk Mester's literary B2+ proverbs) so learners aren't taught slang and formal proverbs as equally "everyday."
- **Forbindenor's distractor pools** group grammatically non-interchangeable connectors as same-category options (e.g. "da" as a causal conjunction next to "fordi," when "da" is far more commonly known to learners as the past-tense "when") — worth a linguistic pass to either separate truly interchangeable near-synonyms from structurally different ones, or annotate the difference.

## 9. Suggested New Features

- **Site-wide weak-word/spaced-repetition system**, generalizing the pattern already working in Idiomjægeren (Leitner box) and Præpositionstest (mistake requeue) to every game that currently lacks it. This is higher-value than any new game mode and reuses existing, proven code.
- **Audio playback** per §7 — effectively a new feature for 9 of 10 games even though it's "just" porting existing code.
- **A simple level filter on the landing page or within each game**, once the `level` data field (§8) exists — even a basic "show me A2 only" toggle would meaningfully fix the CEFR-mixing problem flagged in nearly every QA report.
- **A literal-translation toggle for idioms and fixed expressions** (Idiomjægeren, Dansk Mester) — "Literally: …" shown on demand, not by default, so it doesn't clutter the UI for users who don't want it.
- **A "why was I wrong" rule tag**, surfaced specifically on misses (§3 #8) — the highest-leverage *learning* feature missing from most games, more valuable than any new game mode.

*(Deliberately not suggesting things like leaderboards, social features, or account systems — out of scope for a static-file, no-backend learning tool, and not something the project brief asked for.)*

## 10. Manual Test Checklist

### General (run for every game)
- [ ] Load the game directly via double-click (file://) and confirm zero console errors on load.
- [ ] Play one full round/session end-to-end and confirm score/progress UI updates correctly throughout.
- [ ] Answer one question wrong and confirm feedback (correct answer, and rule explanation if present) renders correctly.
- [ ] Reload the page mid-session — confirm the game either resumes sensibly or cleanly resets to its start screen, with no broken/stuck UI state.
- [ ] If the game has a "reset progress" control: trigger it, confirm a confirmation dialog appears, and verify state actually clears.
- [ ] Resize to a narrow mobile width (360–390px) and confirm no text/button overflow, especially for the longest sentence/word in that game's dataset.
- [ ] Confirm the "🏠 Oversigt" link is visible, doesn't overlap other UI, and correctly returns to the site index from that game's folder depth.
- [ ] If `localStorage` is used: block it (private/incognito strict mode) and confirm the game doesn't crash, even if progress silently doesn't save.
- [ ] Exhaust the question/word pool (or trigger an empty filtered pool, e.g. "weak words" with none recorded) and confirm a graceful empty state, not a blank/broken screen.

### Game-specific highlights
- **Danske Antonymer:** verify Category Practice works for the smallest categories (e.g. "Other," 1 pair) without breaking the round-size logic; test the voice "Test" button with and without a Danish system voice installed.
- **Verb-glosekort:** flip every card via click; jump to an unreached verb via the sidebar and confirm whether that's intended (currently allowed despite a code comment suggesting otherwise); reach card 150/150 and check for (the current absence of) a completion screen.
- **Magiske Verber:** play all 8 modes at least once; select "Svær" on a verb with only one `ENTRIES` item and confirm the round still fills to 10 questions.
- **Præpositionstest:** specifically trigger the "Find fejlen" item at the sentence "Hun er i lære hos en tømrer" and click the *first* "i" — confirm whether this incorrectly registers as correct (known issue, §3 #9).
- **Dansk Mester:** test the en→da direction on "talk about" and confirm a gloss-collision pair doesn't mark a valid answer wrong (known issue, §3 #9).
- **En/Et-træner:** confirm the always-visible vs. mode-only home button distinction is clear; test "Find par" with rapid mismatched clicks.
- **Konjunktionsknus:** deliberately lose your last life on question #10/#20/#30 and confirm whether game-over is skipped (known issue, §3 #9); tie (not beat) your previous high score and confirm "Ny rekord!" doesn't falsely appear.
- **Ordstillingsdetektiven:** fail 3 answers early in a case and confirm the result screen's percentage math against the advertised 60% pass threshold.
- **Forbindenor:** confirm the misspelled title (once fixed) renders correctly across all screens; test the two-column option grid at 375–430px with the longest answer strings ("sammenfattende kan man sige").
- **Idiomjægeren:** start Timed Hunt, immediately navigate to Stats via Menu, and wait 60+ seconds to check for the suspected stale-screen-overwrite bug (§6).

## 11. Quick Wins

Ordered roughly by effort (smallest first):

1. Fix the 5 confirmed factual errors in §3 #4 (krybe/kryber, bør/tør, idiom #459, conjunction sentence, antonym head/feet) — pure text edits, ~30 minutes total.
2. Fix Forbindenor's title/H1/subtitle misspelling (§3 #5) — 3-line edit, immediate credibility win since it's the most visible text in that game.
3. Add the missing `.disabled` CSS rule for Verb-glosekort's already-answered-card buttons (§6) — one CSS rule.
4. Fix Konjunktionsknus's bonus-life-vs-game-over ordering bug (§3 #9) — reorder two existing lines.
5. Add a global flag to the regex in Forbindenor's note-bolding code (`dansk-praepositioner.html`-style fix) — one-character fix (`/g` flag).
6. Dedupe the 4 confirmed exact-duplicate antonym pairs in the CSV (§8) — straightforward data cleanup, improves any future full-CSV import immediately.
7. Add explicit Da/Når/Eftersom explanation to Ordstillingsdetektiven's Case 12 grammar tip (§4) — the underlying sentences are already correct, this is purely an explanatory-text addition.
8. Port Danske Antonymer's working `speechSynthesis` block into Dansk Mester and Præpositionstest first (§7) — highest learning payoff per unit of effort, since the code pattern already exists and just needs to be copied and wired to each game's existing sentence/prompt data.
