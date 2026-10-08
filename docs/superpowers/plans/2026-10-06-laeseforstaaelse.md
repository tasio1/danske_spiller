# Læseforståelse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `laeseforstaaelse/` — a reading-comprehension game with four modes mirroring the structure of Prøve i Dansk 3's reading test, over an original corpus of Danish texts about Denmark at B1–B2. **Phase 1 ships 10 texts** (Tasks 1–11); phase 2 adds the other 10 (Task 14) after the reading view has been measured and tuned (Task 13).

**Architecture:** One game folder with an inline-CSS/JS `index.html` shell plus a split data directory (`data/*.js`, loaded with plain `<script>` tags) because the corpus is large prose. The screen is a **split reader**: the text is a scrollable reading pane that never leaves the screen, and the questions live in a second pane beside it (desktop, laptop, tablet landscape) or in a docked panel beneath it (tablet portrait, phone). Both panes scroll independently. A wrong answer highlights the paragraph that holds the evidence. All four modes share one round loop and one SRS namespace; they differ only in their question renderer.

**Tech Stack:** Vanilla HTML5 + CSS custom properties + ES5-compatible vanilla JS, `shared/dansk-core.js` (`DanskCore.tts/store/srs/diff/level/ui/quiz`), `shared/sjovt.css`. Node scripts under `tests/` for data validation, puppeteer-core for UI verification.

## Global Constraints

Every task's requirements implicitly include this section.

**Platform (from `prd.md` and `improvement/specs.md` § 2):**
- No frameworks, no build step, no runtime `fetch()`, no XHR, no CDN, no analytics, no cookies.
- Must work through `file://`. Must open with zero console errors.
- CSS and JS inline in `index.html` unless the code already exists in `shared/`.
- Stable item IDs always; array indices are never progress keys.
- Interface text in Danish. English only to resolve semantic ambiguity, never a parallel translation of the same instruction.
- Every Danish prompt needs a TTS replay button using `DanskCore.tts`.
- Start screen contains only: title, one **Spil** button, compact mode and level controls. Spil resumes the last mode and level.
- Correct answer: animation + sound + auto-advance ~800 ms, no congratulatory text.
- Wrong answer: correct answer + one note + TTS replay. No encouragement, no jokes.
- 360 px minimum viewport, no horizontal overflow, 44×44 px minimum touch targets.
- Full keyboard operation: number keys select options, Enter submits, Escape closes overlays.
- Dark mode, reduced motion and sound mute all supported and persisted.
- Any timed mode must also offer an untimed **Træning** setting.
- Progress survives reload; reset requires confirmation.
- Mark uncertain dataset records `"verify": true`.

**Honesty and rights (specific to this game — non-negotiable):**
- **All texts are newly written.** No sentence may be copied or close-paraphrased from DR, Politiken, Kristeligt Dagblad, Wikipedia or any other source. Facts are free to reuse; wording is not.
- **No invented people and no quotes.** Texts are written as factual explanation: explainers, background pieces, reports and practical notices. No named fictional persons, no quotation marks, no `siger X` attributions. A debate is described as positions held by broad, documented groups (`fåreavlere`, `biologer`, `landbrugsorganisationerne`), and only where a cited source supports it.
- **Every text renders this footer:** `Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se kilder.`
- Real organisations may be named in factual statements only (what they do, when they were founded, what they publish), never as the speaker of anything.
- **Every text carries `sources: []`** with the real URLs its facts came from, rendered in a collapsed `Kilder` footer.
- **No impersonation of the official exam.** The start screen shows: `Øvelsesopgaver i samme format som Prøve i Dansk 3. Ikke officielt prøvemateriale.` Never claim affiliation with Danskuddannelse, a sprogcenter or the Ministry.
- Danish copy must pass the `danish-grammar-qa` skill's "one defensible answer" test. Every question has exactly one defensible answer.

**Reading view (non-negotiable — the text is the product):**
- The text is fully readable and scrollable on desktop, laptop, tablet and phone, in portrait and landscape. The text pane and the question pane scroll independently; the page itself never scrolls.
- Measure: 60–75 characters per line (`max-width: 68ch`), body text 18–20 px, line-height 1.6–1.7, a serif system stack (`Georgia, 'Iowan Old Style', 'Times New Roman', serif`). No web font download; the shared mono and pixel fonts are for chrome only, never for running text.
- Use `100dvh`, not `100vh`, so mobile browser bars never hide the last line.
- Nothing ever covers the text: feedback appears in the question pane, never in a modal over the reading pane.
- The ten layout decisions in "Layout and reading UX" below are requirements, verified at six viewports in Task 11.

**Measurement conventions:**
- 1 normalside = 2.400 characters including spaces.
- CEFR level per text is the *text's* level, assigned from sentence length, clause depth and vocabulary frequency — not the question's difficulty.

---

## The four modes

Structure confirmed against the official test description ([danskogproever.dk](https://danskogproever.dk/sprogcenter/danskproever/om-proeve-i-dansk-3-pd3-indhold-og-niveau/), [sprogskolen.kolding.dk](https://sprogskolen.kolding.dk/proever/proeve-i-dansk-3)):

| Mode key | PD3 part | Text material | Task | Items |
|---|---|---|---|---|
| `skim` | Læseforståelse 1 (25 min) | a *hæfte*: 8–10 short practical notices on one theme | short answer, free text | 15 questions |
| `mc` | Delprøve 2A | one article, informative/argumentative | multiple choice, 3 options | 3 questions |
| `insert` | Delprøve 2B | one longer article with 5 removed sections | place 5 sections, 7 blocks offered (2 distractors) | 5 gaps |
| `cloze` | Delprøve 3 | one article with 8 removed words/phrases | multiple choice, 4 options, focused on connectors and adverbs | 8 gaps |

**Deliberate deviation from the exam, to be kept:** the real delprøve 1 uses ~10 normalsider (≈24.000 characters) per hæfte. This plan ships *træningsformat* hæfter of 8–10 notices at 1.200–1.800 characters each (≈10.000–16.000 characters, 4–7 normalsider). Reason: authoring 6 × 24.000 characters of hand-written Danish before the first playable release is not a sensible first increment. `exam_length: false` is recorded on every hæfte so a later task can extend them. Say so plainly in the game's info overlay: `Teksterne er lidt kortere end til den rigtige prøve.`

**Deliberate deviation on TTS:** reading the whole article aloud would turn a reading game into a listening game. TTS is attached to the *question* (satisfying the platform rule) and, after a wrong answer, to the evidence sentence. In `skim` mode each notice heading also gets a play button. No auto-play anywhere.

---

## Layout and reading UX (10 decisions)

These are requirements. Task 3 builds them, Task 11 tests them at six viewports, Task 13 tunes them.

**1. Split reader on wide screens (≥ 1024 px, and tablet landscape).** Two columns: reading pane left (flexible), question pane right (340–420 px). Both are `overflow-y: auto` with `overscroll-behavior: contain`, so a wheel or trackpad scroll in one pane never drags the other. The learner sees the text and the question at the same time, which is the whole point of the exam format.

**2. Docked panel on narrow screens (tablet portrait and phone).** Text on top, question panel below with a drag-handle. The panel is `max-height: 46dvh` on tablet and `52dvh` on phone, and can be collapsed to a one-line peek that shows only the current question, so the learner can give the text the full screen while reading. The reading pane gets `padding-bottom` equal to the panel height, so the last paragraph is never hidden.

**3. One readable measure, centred.** The text column is `max-width: 68ch` and centred in the reading pane. On a 1920 px monitor the text does not stretch into 200-character lines; on a phone it uses the full width minus a 16 px gutter.

**4. Reader controls: text size and paper.** `A−` / `A+` in three steps (17 / 19 / 22 px) and a paper switch (light / sepia / dark), persisted in `DanskCore.store`. Defaults follow the OS `prefers-color-scheme`. Tablet learners reading at arm's length and desktop learners on a 4K screen need different sizes; do not make them zoom the browser.

**5. Paragraph numbers in the margin.** Every paragraph carries a small `¶ 3` marker. After a wrong answer, the question pane says `Se afsnit 3` and the paragraph is highlighted and scrolled to the centre. Numbers also give the learner a way to say where they looked, and they make `evidence` visible instead of magic.

**6. A scroll-progress rail.** A thin vertical rail beside the reading pane shows where the learner is in the text, with a tick for each paragraph and a filled tick for each paragraph that holds an answered question's evidence. It answers "how much is left to read?" without a scrollbar the learner has to hunt for. The native scrollbar stays visible too, styled with `scrollbar-width: thin`; never hide it.

**7. Hæfte index for skimming.** In `skim` mode a sticky jump-list of notice headings sits above the text (a horizontal chip row on narrow screens, a left rail on wide ones). Skimming a ten-page booklet without any way to see its structure is a navigation test, not a reading test. In Eksamenstilstand the jump-list stays but the chips show headings only, never answers.

**8. Gaps and answers stay in the text.** In `insert` and `cloze`, each gap is a dashed slot inline in the text with its number (`Hul 3`). The slot of the current question is outlined and scrolled to the vertical centre of the reading pane. A filled slot shows the chosen text in place, so the learner re-reads the repaired paragraph in context. On wide screens, hovering or focusing an option in the question pane previews it inside the active slot.

**9. Keyboard that does not fight reading.** The reading pane is `tabindex="0"` with `aria-label="Tekst"`, so ↑ ↓ PageUp PageDown Space scroll it natively. Number keys answer; `J` / `K` go to the next/previous question; `[` and `]` jump between paragraphs; Escape closes overlays. None of these hijack the arrow keys.

**10. State survives interruption.** The scroll position of every text and the unfinished answers of the current round are saved per text id, so a reload, a phone call or an orientation change returns the learner to the same line. Rotating a tablet reflows between decisions 1 and 2 without losing scroll position (re-anchor to the paragraph at the top of the viewport on `resize`).

### Breakpoints

| Viewport | Layout |
|---|---|
| ≥ 1280 px wide | split reader, question pane 420 px, reading column centred in the rest |
| 1024–1279 px | split reader, question pane 360 px |
| 640–1023 px, landscape | split reader, question pane 38 % (min 300 px) |
| 640–1023 px, portrait | stacked, docked panel `max-height: 46dvh`, collapsible |
| < 640 px | stacked, docked bottom sheet `max-height: 52dvh`, collapsible, 16 px gutter |

### Viewports the layout is verified at (Task 11)

1920×1080 (desktop), 1440×900 (laptop), 1280×720 (small laptop), 1024×768 (iPad landscape), 820×1180 (iPad portrait), 360×640 (phone).

---

## The 20 texts — phase 1 builds 10

Topic assignment is fixed here so authoring tasks can run in parallel without collisions. "Verified" means facts were checked during planning and the URLs are in the Sources section; "check first" means the authoring task must verify the numbers before writing and record the URLs in `sources`.

**Phase 1 (first 10, Tasks 3–8):** hæfter `haefte-kolonihave`, `haefte-rebildfest`; mc `art-ulven`, `art-dialekter`, `art-efterskole`; insert `art-samsoe`, `art-madspild`; cloze `art-bakken`, `art-cykelsti`, `art-gaekkebrev`. Both verified hæfter and both verified mc topics are in phase 1, so the first release rests on checked facts.

**Phase 2 (the other 10, Task 14):** hæfter `haefte-oefaerge`, `haefte-sprogcenter`, `haefte-pantogenbrug`, `haefte-vadehavet`; mc `art-janteloven`, `art-kontanter`; insert `art-christiania`, `art-vaernepligt`; cloze `art-fredagsbar`, `art-rewilding`.

Because there are no invented people, every article is one of four genres: `forklaring` (explainer), `reportage` (a description of a place or event, no interviewees), `overblik` (a summary of the positions in a debate, attributed to groups only) or `baggrund` (history and how something works).

### 6 hæfter → mode `skim`

| # | id | Theme | Notice material | Facts |
|---|---|---|---|---|
| 1 | `haefte-kolonihave` | Allotment-garden association member folder | watering ban, hedge height, shared work days, waiting list, transfer of a plot, building rules, rubbish, summer party | verified: 19.773 plots (2024), waiting lists up to 10 years, Kolonihaveforbundet founded 1908, ~40.000 plots in 400 associations |
| 2 | `haefte-rebildfest` | Programme for the 4 July festival in Rebild Bakker | four-day programme, tickets, parking, bus, food stalls, children's activities, history board, volunteer shifts | verified: held in Rebild Bakker since 1912, first 1909, Max Henius donated 56 ha, Nixon/Reagan/Walt Disney attended |
| 3 | `haefte-oefaerge` | Small-island ferry and island services | timetable, fares, bicycles and cars, the island shop's hours, doctor's visiting day, school boat, island council notice, winter service | check first: a specific småø (Fejø, Omø or Barsø), its ferry operator and depopulation figures |
| 4 | `haefte-sprogcenter` | Language-centre course catalogue | modules, class times, exam dates, absence rules, deposit, IT café, study guidance, enrolment | check first: module structure of Danskuddannelse 3, current deposit amount |
| 5 | `haefte-pantogenbrug` | Municipal waste guide + deposit system | sorting table, bulky waste, recycling-centre hours, deposit machine, A/B/C deposit amounts, bottle collectors, swap shelf, textile rules | check first: current A/B/C pant amounts and Dansk Retursystem's rules |
| 6 | `haefte-vadehavet` | Wadden Sea nature-guide programme | guided walks, tide table, black-sun season, equipment, safety, bird tower, UNESCO status, booking | check first: sort sol season months, UNESCO listing year |

### 5 articles → mode `mc` (3 questions each)

| # | id | Angle | Facts |
|---|---|---|---|
| 7 | `art-ulven` | Who pays for the wolf's return? Sheep farmer vs. biologist | verified: 239 attacks in 2025 vs. 91 in 2024 and 57 in 2023; compensation for 1.285 animals; at least 36 m DKK; 7 packs, 3 pairs, 1 stationary male ≈ 49 wolves; protected across the EU |
| 8 | `art-dialekter` | Bornholmsk is dying while sønderjysk survives — why? | verified: Denmark among Europe's most standardised; no Bornholm dialect features in young speakers' language, even the melody gone; sønderjysk and vendelbomål strong among the young; research at Sprogforandringscentret and Center for Dialektforskning, Københavns Universitet; an AI project to preserve bornholmsk |
| 9 | `art-janteloven` | Do young Danes still believe in Janteloven? | check first: a published survey with a date and a sample size |
| 10 | `art-efterskole` | Why a 15-year-old moves away from home for a year | check first: number of efterskoler, pupils per year, parental contribution and state support |
| 11 | `art-kontanter` | Shops that refuse cash, and who is left behind | check first: Nationalbanken's cash-printing decision, the rule on when a shop may refuse cash, share of cash payments |

### 4 articles → mode `insert` (5 gaps + 2 distractors each)

| # | id | Angle | Facts |
|---|---|---|---|
| 12 | `art-madspild` | How food waste became a Danish export | check first: Stop Spild Af Mad's founding year and founder, Too Good To Go's Danish origin, national food-waste figures |
| 13 | `art-samsoe` | An island that owns its own wind turbines | check first: the 1997 renewable-island competition, turbine count, local co-ownership share |
| 14 | `art-christiania` | The year the residents dug up their own Pusher Street | check first: the 2024 date, who paid, what replaced it |
| 15 | `art-vaernepligt` | Conscription opened to women | check first: the law's date, the lottery system, intake numbers |

### 5 articles → mode `cloze` (8 connector/adverb gaps each)

| # | id | Angle | Facts |
|---|---|---|---|
| 16 | `art-cykelsti` | Cycle superhighways, and the fight for pavement space | check first: number of cykelsuperstier, Cykelslangen's opening year, commuter share by bike in Copenhagen |
| 17 | `art-gaekkebrev` | Why children still cut paper and write rhymes at Easter | check first: the gækkebrev tradition's documented age, the snowdrop convention |
| 18 | `art-fredagsbar` | Alcohol in Danish student life, and the pressure to join | check first: a published study on Danish youth drinking compared with Europe |
| 19 | `art-bakken` | The world's oldest amusement park and its free entrance | check first: 1583 founding, Kirsten Piils Kilde, the no-entrance-fee model |
| 20 | `art-rewilding` | Bison on Bornholm and the plan for untouched forest | check first: Almindingen bison year and herd size, the urørt skov hectare target |

---

## File Structure

```text
laeseforstaaelse/
  index.html                  game shell: theme CSS, start screen, mode registry,
                              round loop, the four question renderers, summary
  data/
    index.js                  window.LAESE_DATA registry + mode config + helpers
    haefter-a.js              hæfter 1–3  (window.LAESE_HAEFTER_A)
    haefter-b.js              hæfter 4–6  (window.LAESE_HAEFTER_B)
    artikler-mc.js            articles 7–11   (window.LAESE_MC)
    artikler-insert.js        articles 12–15  (window.LAESE_INSERT)
    artikler-cloze.js         articles 16–20  (window.LAESE_CLOZE)
docs/
  laeseforstaaelse-tekstmanual.md   the authenticity rubric every author follows
tests/
  laeseforstaaelse-data.mjs   fast node validator: schema, IDs, lengths, rubric
  laeseforstaaelse.mjs        puppeteer UI spec, modelled on tests/tidsmaskinen.mjs
index.html                    add the game card
sitemap.xml                   add the new URL
```

Six data files rather than one because the corpus is ~150 KB; one file per mode keeps each authoring task's diff isolated and lets authoring tasks run in parallel. `data/index.js` is the only file that knows about all of them.

---

## Task 1: The text manual

The authenticity rubric. Everything downstream depends on it, so it ships first and alone.

**Files:**
- Create: `docs/laeseforstaaelse-tekstmanual.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the banned-phrase list that Task 2's validator imports as `BANNED_PHRASES`, and the per-text required-elements checklist that authoring tasks (7–11) are graded against.

- [ ] **Step 1: Write the manual**

Create `docs/laeseforstaaelse-tekstmanual.md` with exactly these sections.

````markdown
# Tekstmanual — Læseforståelse

Hver tekst i `laeseforstaaelse/data/` skal følge denne manual. Validatoren
`tests/laeseforstaaelse-data.mjs` tjekker det, der kan tjekkes maskinelt.
Resten er forfatterens ansvar og gennemgås af tester-agenten.

## 1. Teksten er ny

Ingen sætning må være kopieret eller tæt omskrevet fra en kilde. Fakta er fri;
formuleringen er ikke. Slå tallene op, luk fanen, og skriv teksten selv.

Hver tekst har et `sources`-felt med de rigtige URL'er. De vises i en
sammenfoldet `Kilder`-fod.

## 2. Ingen opdigtede personer, ingen citater

Tekster skrives som saglig fremstilling: forklaring, baggrund, reportage uden
interviewede og overblik over holdninger. Der er **ingen** navngivne personer
fra fantasien, **ingen** anførselstegn og **ingen** *siger X*.

En uenighed beskrives som holdninger hos brede, dokumenterede grupper
(*fåreavlere*, *biologer*, *landbrugsorganisationerne*) — og kun hvor en kilde
understøtter det. Rigtige organisationer må nævnes i faktuelle sætninger (hvad
de gør, hvornår de blev stiftet), men aldrig som den, der siger noget.

Alle tekster viser denne linje nederst:

> Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se kilder.

## 3. Forbudte vendinger (AI-signaler)

Validatoren fejler på disse. De er de mest almindelige tegn på maskinskrevet
dansk.

**Åbninger**
- `I dag er`, `I dag står`, `I en verden hvor`, `Mere end nogensinde`
- `Det er ingen hemmelighed`, `Når man taler om`, `Gennem tiderne`

**Afslutninger**
- `Sammenfattende`, `Alt i alt kan man sige`, `Kun tiden vil vise`
- `Én ting er sikkert`, `Det store spørgsmål er`, `Fremtiden vil vise`

**Fyld**
- `Det er vigtigt at bemærke`, `Det er værd at nævne`, `spiller en afgørende rolle`
- `en central del af`, `ikke kun ... men også`, `i takt med at samfundet`
- `Derudover`, `Endvidere`, `Ligeledes` — tilladt én gang per tekst, ikke mere

**Mønstre**
- Tre-ledede opremsninger i hvert andet afsnit
- Afsnit, der alle er lige lange
- Hver sætning indledt med et bindeord
- Tankestreg-opsamling til sidst i afsnittet

## 4. Krav til en artikel (mode `mc`, `insert`, `cloze`)

Hver artikel skal have:

1. Mindst **fire konkrete oplysninger**: et tal, et årstal, et stednavn,
   et beløb eller en organisation. Alle skal kunne findes i `sources`.
2. Præcis **én uenighed eller afvejning**, beskrevet som holdninger hos brede
   grupper, ikke som ord i munden på en person.
3. **Konkret sprog**: handlinger og ting frem for abstrakte substantiver.
   *Staten betaler for hegnet* er bedre end *der sker en finansiering*.
4. **Variation i sætningslængde**: mindst én sætning på højst 6 ord og mindst
   én på 25 ord eller mere.
5. **Variation i afsnitslængde**: afsnittene må ikke alle ligge inden for
   ±15 % af hinanden.
6. En **genremarkør** i `kicker`-feltet: `Forklaring`, `Reportage`, `Overblik`
   eller `Baggrund`, efterfulgt af emnet (*Overblik · Natur*).
7. **Ingen citater og ingen personer** (afsnit 2).

## 5. Krav til et hæfte (mode `skim`)

1. 8–10 opslag, hver på 1.200–1.800 tegn.
2. Praktisk register: bydeform, klokketider, datoer, priser, telefonnumre.
3. Hvert opslag indeholder mindst **to oplysninger, man kan slå op** — et tal,
   en tid, et navn, en pris.
4. Mindst **tre par af næsten-ens oplysninger** på tværs af opslagene
   (to forskellige åbningstider, to frister, to priser), så man er nødt til at
   læse efter det rigtige sted. Det er hele pointen med delprøve 1.
5. Opslagene hænger sammen om ét tema, men er ikke én sammenhængende tekst.

## 6. Niveau

Niveauet gælder teksten, ikke spørgsmålet.

- **B1**: hovedsætninger og enkle ledsætninger, mest frekvente ord,
  gennemsnitlig sætningslængde 10–15 ord.
- **B2**: flere ledsætninger, abstrakte substantiver, passiv, upersonlige
  konstruktioner, gennemsnitlig sætningslængde 15–22 ord.

## 7. Spørgsmål

Hvert spørgsmål har præcis **ét forsvarligt svar**. Se `danish-grammar-qa`.

- `skim`: svaret står ordret i ét bestemt opslag. `accepted` rummer de
  formuleringer, en læser med rimelighed skriver — både `efter kl. 20` og
  `efter klokken 20`.
- `mc`: de to forkerte svarmuligheder skal være forkerte af en grund, ikke
  bare løse. Én gengiver teksten med en forkert detalje, én er sand men
  svarer ikke på spørgsmålet.
- `insert`: hvert afsnit skal kunne placeres ud fra sammenhængen før og efter
  hullet — et henvisende ord, en tidsangivelse, en modsætning. To
  distraktorer skal passe tematisk men bryde sammenhængen.
- `cloze`: målet er bindeord og adverbier. Hvert hul har en `type`:
  `kontrast`, `konsekvens`, `praecisering`, `tilfoejelse`, `tid`.
  De fire muligheder skal alle være grammatisk mulige på pladsen.

## 8. Kalibreringstekst

Denne tekst er målestokken. Den opfylder alle krav i afsnit 2, 3 og 4. Dens
tal er fra kilderne i planen, men skal genkontrolleres i Task 15 (review),
før den bruges som spørgsmålstekst.

> **Hvem skal betale for ulven?**
> *Overblik · Natur*
>
> Ulven er tilbage. Det koster penge.
>
> I 2023 registrerede myndighederne 57 ulveangreb på husdyr, i 2024 var
> tallet 91, og i 2025 steg det til 239. Der blev udbetalt erstatning for
> 1.285 dræbte dyr, langt de fleste af dem får, og staten brugte mindst 36
> millioner kroner på erstatninger og på tilskud til ulvesikre hegn.
>
> Tallene skal ses ved siden af bestanden. Den seneste overvågning fandt syv
> flokke, tre par og en enlig han. Regner man med syv ulve i hver flok, svarer
> det til omkring 49 dyr. Det er ikke en optælling, men et skøn.
>
> Fåreavlere oplever angrebene som en belastning, der ikke kan måles i kroner
> alene, fordi erstatningen hverken dækker vedligeholdelse af hegn eller den
> frygt, et angreb kan sætte i gang.
>
> Biologer peger på, at ulven er fredet i hele EU. Det betyder, at Danmark
> ikke bare kan beslutte at skyde den.
>
> Landbrugets organisationer vil have en plan. De spørger, hvor mange ulve
> Danmark skal have, og hvem der skal bestemme det.
>
> Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se
> kilder.

Hvorfor den virker: otte konkrete tal, én afvejning beskrevet som holdninger
hos grupper, ingen personer og ingen citater, korte og lange sætninger side
om side (*Ulven er tilbage.* mod en sætning på 29 ord), ingen vending fra
afsnit 3, og afsnit af meget forskellig længde.
````

- [ ] **Step 2: Verify the banned list is machine-checkable**

Run: `grep -c '^- `' docs/laeseforstaaelse-tekstmanual.md`
Expected: a non-zero count. Every banned phrase must sit in a backtick-quoted list item so Task 2 can lift them mechanically.

- [ ] **Step 3: Commit**

```bash
git add docs/laeseforstaaelse-tekstmanual.md
git commit -m "docs(laeseforstaaelse): add text authenticity manual"
```

---

## Task 2: Data schema and validator

TDD: the validator exists before any text does, so every authoring task has a gate to run.

**Files:**
- Create: `tests/laeseforstaaelse-data.mjs`
- Create: `laeseforstaaelse/data/index.js`

**Interfaces:**
- Consumes: the banned-phrase list from `docs/laeseforstaaelse-tekstmanual.md` § 3.
- Produces:
  - `window.LAESE_DATA` = `{ skim: [], mc: [], insert: [], cloze: [] }`, built in `data/index.js` from the five corpus globals.
  - `window.LAESE_DATA.modes` = array of `{ key, label, part, itemCount, minutes }`.
  - `node tests/laeseforstaaelse-data.mjs` exits 0 when the corpus is valid, 1 with a per-text error list otherwise.

The schemas the validator enforces:

```js
// mode 'skim'
{
  id: 'haefte-kolonihave',          // stable, kebab-case, unique across corpus
  mode: 'skim',
  level: 'B1',                      // 'B1' | 'B2'
  title: 'Haveforeningen Solsikken — medlemsmappe',
  theme: 'kolonihaver',
  exam_length: false,               // true only at ~10 normalsider
  notices: [                        // 8-10 entries
    { id: 'haefte-kolonihave-n01', heading: 'Vanding', body: '...' }
  ],
  questions: [                      // exactly 15
    {
      id: 'haefte-kolonihave-q01',
      q: 'Hvornår må man vande med slange?',
      accepted: ['efter kl. 20', 'efter klokken 20'],
      noticeId: 'haefte-kolonihave-n01',
      note: 'Står under Vanding: slange kun efter kl. 20.'
    }
  ],
  sources: ['https://...']
}

// mode 'mc'
{
  id: 'art-ulven', mode: 'mc', level: 'B2',
  title: 'Hvem skal betale for ulven?',
  genre: 'overblik',                // 'forklaring' | 'reportage' | 'overblik' | 'baggrund'
  kicker: 'Overblik · Natur',       // genre label + topic; no author, no date
  paragraphs: ['...', '...'],       // plain strings, no markup, no quotation marks
  questions: [                      // exactly 3
    {
      id: 'art-ulven-q1',
      q: 'Hvad dækker erstatningen til fåreavlerne ikke?',
      options: ['...', '...', '...'],   // exactly 3
      correct: 0,                       // index into options
      evidence: 3,                      // index into paragraphs
      note: 'Afsnit 4: erstatningen dækker ikke vedligeholdelse af hegn.'
    }
  ],
  sources: ['https://...']
}

// mode 'insert'
{
  id: 'art-madspild', mode: 'insert', level: 'B2',
  title: '...', genre: 'reportage', kicker: 'Reportage · Mad',
  paragraphs: ['...'],              // the text WITHOUT the removed sections
  gaps: [                           // exactly 5, ascending by after
    { id: 'art-madspild-g1', after: 1, note: 'Afsnittet før slutter med et spørgsmål.' }
  ],
  blocks: [                         // exactly 7: 5 solutions + 2 distractors
    { id: 'art-madspild-b1', text: '...' }
  ],
  solution: { 'art-madspild-g1': 'art-madspild-b4' },   // gapId -> blockId
  sources: ['https://...']
}

// mode 'cloze'
{
  id: 'art-bakken', mode: 'cloze', level: 'B1',
  title: '...', genre: 'baggrund', kicker: 'Baggrund · Forlystelser',
  // Gap markers {{1}}..{{8}} appear in order across the paragraphs, each exactly once.
  paragraphs: ['Bakken åbnede i 1583. {{1}} er parken stadig gratis at komme ind i.', '...'],
  gaps: [                           // exactly 8; gaps[i] belongs to marker {{i+1}}
    {
      id: 'art-bakken-c1',
      type: 'kontrast',             // kontrast|konsekvens|praecisering|tilfoejelse|tid
      options: ['Alligevel', 'Derfor', 'Desuden', 'Nemlig'],   // exactly 4
      correct: 0,
      note: 'Modsætning til den høje alder i sætningen før.'
    }
  ],
  sources: ['https://...']
}
```

- [ ] **Step 1: Write the failing validator test**

Create `tests/laeseforstaaelse-data.mjs`:

```js
// Data validator for laeseforstaaelse. Run from the repo root:
//   node tests/laeseforstaaelse-data.mjs
// Checks schema, id stability, lengths, question counts and the manual's
// banned-phrase list. No browser, no network — keep it under a second.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_DIR = path.join(ROOT, 'laeseforstaaelse', 'data');
const FILES = ['haefter-a.js', 'haefter-b.js', 'artikler-mc.js',
               'artikler-insert.js', 'artikler-cloze.js', 'index.js'];

const BANNED = [
  'i dag er', 'i dag står', 'i en verden hvor', 'mere end nogensinde',
  'det er ingen hemmelighed', 'når man taler om', 'gennem tiderne',
  'sammenfattende', 'alt i alt kan man sige', 'kun tiden vil vise',
  'én ting er sikkert', 'det store spørgsmål er', 'fremtiden vil vise',
  'det er vigtigt at bemærke', 'det er værd at nævne',
  'spiller en afgørende rolle', 'en central del af', 'i takt med at samfundet'
];
const CAPPED = ['derudover', 'endvidere', 'ligeledes'];   // max 1 per text
const NORMALSIDE = 2400;

const errors = [];
const warns = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warns.push(`${id}: ${msg}`);

// ---- load the data files into a fake window
const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
for (const f of FILES) {
  const p = path.join(DATA_DIR, f);
  // Corpus files appear task by task, so only the registry is mandatory.
  if (!fs.existsSync(p)) {
    if (f === 'index.js') errors.push('missing data file: data/index.js');
    continue;
  }
  vm.runInNewContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: p });
}
const DATA = sandbox.window.LAESE_DATA;
if (!DATA) {
  console.error('FAIL window.LAESE_DATA was never assigned');
  process.exit(1);
}

// ---- helpers
const textOf = t => [t.title, t.kicker || '']
  .concat(t.paragraphs || [])
  .concat((t.notices || []).flatMap(n => [n.heading, n.body]))
  .concat((t.blocks || []).map(b => b.text))
  .join('\n');

const sentences = s => s.split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean);
const words = s => s.split(/\s+/).filter(Boolean).length;

const seenIds = new Set();
const checkId = (owner, id, prefix) => {
  if (typeof id !== 'string' || !id) return fail(owner, 'missing id');
  if (!/^[a-z0-9-]+$/.test(id)) fail(owner, `id not kebab-case: ${id}`);
  if (prefix && !id.startsWith(prefix)) fail(owner, `id ${id} must start with ${prefix}`);
  if (seenIds.has(id)) fail(owner, `duplicate id: ${id}`);
  seenIds.add(id);
};

const checkProse = t => {
  const body = textOf(t).toLowerCase();
  for (const b of BANNED) if (body.includes(b)) fail(t.id, `banned phrase: "${b}"`);
  for (const c of CAPPED) {
    const n = body.split(c).length - 1;
    if (n > 1) fail(t.id, `"${c}" used ${n} times, max 1`);
  }
  if (!Array.isArray(t.sources) || !t.sources.length) fail(t.id, 'sources[] is empty');
  else for (const u of t.sources) if (!/^https?:\/\//.test(u)) fail(t.id, `bad source URL: ${u}`);
  if (!['B1', 'B2'].includes(t.level)) fail(t.id, `level must be B1 or B2, got ${t.level}`);
};

const checkArticleShape = t => {
  if (!Array.isArray(t.paragraphs) || t.paragraphs.length < 4)
    fail(t.id, 'needs at least 4 paragraphs');
  if (!t.kicker) fail(t.id, 'missing kicker (genre label + topic)');
  if (!['forklaring', 'reportage', 'overblik', 'baggrund'].includes(t.genre))
    fail(t.id, `unknown genre: ${t.genre}`);
  if (t.byline) fail(t.id, 'byline is not allowed: no invented authors');

  const all = (t.paragraphs || []).join(' ');
  const sents = sentences(all);
  if (!sents.some(s => words(s) <= 6)) fail(t.id, 'no sentence of 6 words or fewer');
  if (!sents.some(s => words(s) >= 25)) fail(t.id, 'no sentence of 25 words or more');
  // Manual § 2: no quotes, no invented speakers.
  if (/["»«„“”]/.test(all)) fail(t.id, 'quotation marks are not allowed (manual § 2)');
  if (/\b[A-ZÆØÅ][a-zæøå]+ (siger|fortæller|mener|slår fast)\b/.test(all.replace(/(^|[.!?]\s+)\S+/g, '$1')))
    warn(t.id, 'looks like "<Name> siger" — check there is no invented speaker');
  const digits = (all.match(/\d/g) || []).length;
  if (digits < 4) fail(t.id, `only ${digits} digit characters, needs 4 concrete figures`);

  const lens = (t.paragraphs || []).map(p => p.length);
  if (lens.length > 2) {
    const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
    const spread = Math.max(...lens) - Math.min(...lens);
    if (spread < avg * 0.3) fail(t.id, 'paragraph lengths too uniform');
  }

  const chars = all.length;
  if (chars < NORMALSIDE * 1.2) warn(t.id, `${chars} chars — under 1.2 normalsider`);
  if (chars > NORMALSIDE * 2.8) warn(t.id, `${chars} chars — over 2.8 normalsider`);
};

// ---- per-mode checks
const MODES = ['skim', 'mc', 'insert', 'cloze'];
for (const mode of MODES) {
  if (!Array.isArray(DATA[mode])) { errors.push(`LAESE_DATA.${mode} is not an array`); continue; }
  for (const t of DATA[mode]) {
    checkId(t.id || '(no id)', t.id, null);
    if (t.mode !== mode) fail(t.id, `mode is "${t.mode}" but sits in ${mode}`);
    checkProse(t);

    if (mode === 'skim') {
      const n = (t.notices || []).length;
      if (n < 8 || n > 10) fail(t.id, `${n} notices, needs 8-10`);
      for (const no of t.notices || []) {
        checkId(t.id, no.id, t.id + '-n');
        if (!no.heading) fail(t.id, `notice ${no.id} missing heading`);
        const L = (no.body || '').length;
        if (L < 1200 || L > 1800) fail(t.id, `notice ${no.id} is ${L} chars, needs 1200-1800`);
        if (((no.body || '').match(/\d/g) || []).length < 2)
          fail(t.id, `notice ${no.id} has fewer than 2 lookup-able figures`);
      }
      const qs = t.questions || [];
      if (qs.length !== 15) fail(t.id, `${qs.length} questions, needs exactly 15`);
      const noticeIds = new Set((t.notices || []).map(n => n.id));
      for (const q of qs) {
        checkId(t.id, q.id, t.id + '-q');
        if (!q.q) fail(t.id, `${q.id} missing question text`);
        if (!Array.isArray(q.accepted) || !q.accepted.length)
          fail(t.id, `${q.id} has no accepted answers`);
        if (!noticeIds.has(q.noticeId)) fail(t.id, `${q.id} points at unknown notice ${q.noticeId}`);
        if (!q.note) fail(t.id, `${q.id} missing note`);
      }
      if (t.exam_length !== false && t.exam_length !== true)
        fail(t.id, 'exam_length must be true or false');
    }

    if (mode === 'mc') {
      checkArticleShape(t);
      const qs = t.questions || [];
      if (qs.length !== 3) fail(t.id, `${qs.length} questions, needs exactly 3`);
      for (const q of qs) {
        checkId(t.id, q.id, t.id + '-q');
        if (!Array.isArray(q.options) || q.options.length !== 3)
          fail(t.id, `${q.id} needs exactly 3 options`);
        if (!(q.correct >= 0 && q.correct < 3)) fail(t.id, `${q.id} correct out of range`);
        if (!(q.evidence >= 0 && q.evidence < t.paragraphs.length))
          fail(t.id, `${q.id} evidence paragraph ${q.evidence} does not exist`);
        if (new Set(q.options.map(o => o.trim().toLowerCase())).size !== 3)
          fail(t.id, `${q.id} has duplicate options`);
        if (!q.note) fail(t.id, `${q.id} missing note`);
      }
    }

    if (mode === 'insert') {
      checkArticleShape(t);
      const gaps = t.gaps || [], blocks = t.blocks || [];
      if (gaps.length !== 5) fail(t.id, `${gaps.length} gaps, needs exactly 5`);
      if (blocks.length !== 7) fail(t.id, `${blocks.length} blocks, needs 7 (5 + 2 distractors)`);
      for (const b of blocks) {
        checkId(t.id, b.id, t.id + '-b');
        if (!b.text || b.text.length < 80) fail(t.id, `block ${b.id} is too short to be a section`);
      }
      const blockIds = new Set(blocks.map(b => b.id));
      const used = new Set();
      let prev = -1;
      for (const g of gaps) {
        checkId(t.id, g.id, t.id + '-g');
        if (!(g.after >= 0 && g.after < t.paragraphs.length))
          fail(t.id, `gap ${g.id} sits after paragraph ${g.after}, which does not exist`);
        if (g.after <= prev) fail(t.id, `gaps must ascend by after; ${g.id} breaks the order`);
        prev = g.after;
        const sol = (t.solution || {})[g.id];
        if (!sol) fail(t.id, `gap ${g.id} has no solution`);
        else if (!blockIds.has(sol)) fail(t.id, `gap ${g.id} maps to unknown block ${sol}`);
        else if (used.has(sol)) fail(t.id, `block ${sol} is the solution to two gaps`);
        else used.add(sol);
        if (!g.note) fail(t.id, `gap ${g.id} missing note`);
      }
      if (used.size !== 5) fail(t.id, `${used.size} blocks used as solutions, needs 5`);
      if (blocks.length - used.size !== 2) fail(t.id, 'needs exactly 2 unused distractor blocks');
    }

    if (mode === 'cloze') {
      checkArticleShape(t);
      const gaps = t.gaps || [];
      if (gaps.length !== 8) fail(t.id, `${gaps.length} gaps, needs exactly 8`);
      const markers = ((t.paragraphs || []).join(' ').match(/\{\{\d+\}\}/g) || []).map(m => +m.slice(2, -2));
      const wanted = gaps.map((_, i) => i + 1);
      if (markers.join(',') !== wanted.join(','))
        fail(t.id, `gap markers are [${markers}] but must be ${wanted.length ? '{{1}}..{{' + wanted.length + '}} in order, once each' : 'empty'}`);
      const TYPES = ['kontrast', 'konsekvens', 'praecisering', 'tilfoejelse', 'tid'];
      for (const g of gaps) {
        checkId(t.id, g.id, t.id + '-c');
        if (!TYPES.includes(g.type)) fail(t.id, `gap ${g.id} has unknown type ${g.type}`);
        if (!Array.isArray(g.options) || g.options.length !== 4)
          fail(t.id, `gap ${g.id} needs exactly 4 options`);
        if (!(g.correct >= 0 && g.correct < 4)) fail(t.id, `gap ${g.id} correct out of range`);
        if (new Set(g.options.map(o => o.trim().toLowerCase())).size !== 4)
          fail(t.id, `gap ${g.id} has duplicate options`);
        if (!g.note) fail(t.id, `gap ${g.id} missing note`);
      }
      if (new Set(gaps.map(g => g.type)).size < 3)
        fail(t.id, 'cloze gaps must cover at least 3 different connector types');
    }
  }
}

// ---- corpus totals
const counts = MODES.map(m => (DATA[m] || []).length);
const total = counts.reduce((a, b) => a + b, 0);
console.log(`texts: skim=${counts[0]} mc=${counts[1]} insert=${counts[2]} cloze=${counts[3]} total=${total}`);

// --expect=2,3,2,3 asserts exact counts per mode (skim,mc,insert,cloze).
const expectArg = process.argv.find(a => a.startsWith('--expect='));
if (expectArg) {
  const want = expectArg.slice('--expect='.length).split(',').map(Number);
  MODES.forEach((m, i) => {
    if (counts[i] !== want[i]) errors.push(`expected ${want[i]} ${m} text(s), found ${counts[i]}`);
  });
}

for (const w of warns) console.log('WARN ' + w);
if (errors.length) {
  for (const e of errors) console.log('FAIL ' + e);
  console.log(`\n${errors.length} error(s)`);
  process.exit(1);
}
console.log('PASS all corpus checks');
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node tests/laeseforstaaelse-data.mjs`
Expected: exit 1 with `FAIL window.LAESE_DATA was never assigned` (the registry does not exist yet).

- [ ] **Step 3: Write the registry**

Create `laeseforstaaelse/data/index.js`:

```js
// laeseforstaaelse/data/index.js
// Builds window.LAESE_DATA from the five corpus files. Load LAST:
//   <script src="data/haefter-a.js"></script>
//   ... all corpus files ...
//   <script src="data/index.js"></script>
(function () {
  'use strict';

  function arr(v) { return Array.isArray(v) ? v : []; }

  var W = window;
  var skim = arr(W.LAESE_HAEFTER_A).concat(arr(W.LAESE_HAEFTER_B));

  W.LAESE_DATA = {
    skim: skim,
    mc: arr(W.LAESE_MC),
    insert: arr(W.LAESE_INSERT),
    cloze: arr(W.LAESE_CLOZE),

    modes: [
      { key: 'skim',   label: 'Find oplysningen', part: 'Læseforståelse 1', itemCount: 15, minutes: 25 },
      { key: 'mc',     label: 'Læs og vælg',      part: 'Delprøve 2A',      itemCount: 3,  minutes: 15 },
      { key: 'insert', label: 'Sæt afsnittet ind', part: 'Delprøve 2B',     itemCount: 5,  minutes: 25 },
      { key: 'cloze',  label: 'Det manglende ord', part: 'Delprøve 3',      itemCount: 8,  minutes: 25 }
    ],

    // Texts in one mode at the chosen levels. levels is an array like ['B1'].
    textsFor: function (mode, levels) {
      var pool = arr(W.LAESE_DATA[mode]);
      if (!levels || !levels.length) return pool.slice();
      return pool.filter(function (t) { return levels.indexOf(t.level) !== -1; });
    },

    byId: function (id) {
      var modes = ['skim', 'mc', 'insert', 'cloze'];
      for (var i = 0; i < modes.length; i++) {
        var pool = arr(W.LAESE_DATA[modes[i]]);
        for (var j = 0; j < pool.length; j++) if (pool[j].id === id) return pool[j];
      }
      return null;
    },

    // Every answerable item in a text, as { id, textId, mode }.
    itemsOf: function (text) {
      if (!text) return [];
      var list = text.mode === 'insert' || text.mode === 'cloze' ? arr(text.gaps) : arr(text.questions);
      return list.map(function (q) { return { id: q.id, textId: text.id, mode: text.mode }; });
    }
  };
})();
```

- [ ] **Step 4: Run the validator again**

Run: `node tests/laeseforstaaelse-data.mjs`
Expected: exit 0, printing `texts: skim=0 mc=0 insert=0 cloze=0 total=0` then `PASS all corpus checks`. An empty corpus is valid; the counts are asserted in Task 11.

- [ ] **Step 5: Commit**

```bash
git add tests/laeseforstaaelse-data.mjs laeseforstaaelse/data/index.js
git commit -m "feat(laeseforstaaelse): data registry and corpus validator"
```

---

## Task 3: Game shell and the first text

Produces a playable game with one hæfte, so every later mode has a working shell to drop into.

**Files:**
- Create: `laeseforstaaelse/index.html`
- Create: `laeseforstaaelse/data/haefter-a.js`

**Interfaces:**
- Consumes: `window.LAESE_DATA` (Task 2), `DanskCore.store/srs/level/ui/tts/quiz`.
- Produces, as module-level functions inside `index.html`, for Tasks 4–7 to fill in:
  - `renderText(text)` → paints the reading pane, returns nothing.
  - `MODE_RENDERERS[modeKey](text, host, api)` → one per mode. `api` is
    `{ onAnswer(itemId, correct, patternKey), showNote(itemId, note), highlight(paragraphIndex), finish() }`.
  - `recordAnswer(itemId, correct, patternKey)` → SRS + score bookkeeping.
  - `SRS_NS` = `'laeseforstaaelse'`; SRS keys are `laeseforstaaelse:<mode>:<itemId>`.

- [ ] **Step 1: Write the first hæfte**

Create `laeseforstaaelse/data/haefter-a.js` holding **one** text for now, `haefte-kolonihave`, following `docs/laeseforstaaelse-tekstmanual.md` § 5 and § 7: 8 notices of 1.200–1.800 characters, 15 questions, at least three near-miss fact pairs across notices, `exam_length: false`, and `sources` pointing at the allotment-garden URLs in this plan's Sources section.

```js
// laeseforstaaelse/data/haefter-a.js
// Hæfter 1-3 for mode 'skim'. Schema: docs/superpowers/plans/2026-10-06-laeseforstaaelse.md
// Every text follows docs/laeseforstaaelse-tekstmanual.md.
(function () {
  'use strict';
  window.LAESE_HAEFTER_A = [
    {
      id: 'haefte-kolonihave',
      mode: 'skim',
      level: 'B1',
      title: 'Haveforeningen Solsikken — medlemsmappe',
      theme: 'kolonihaver',
      exam_length: false,
      notices: [
        {
          id: 'haefte-kolonihave-n01',
          heading: 'Vanding',
          body: 'Slange og vandkande …'   // 1200-1800 tegn, se manualen § 5
        }
        // … 7 flere opslag
      ],
      questions: [
        {
          id: 'haefte-kolonihave-q01',
          q: 'Hvornår må man vande med slange?',
          accepted: ['efter kl. 20', 'efter klokken 20', 'efter 20'],
          noticeId: 'haefte-kolonihave-n01',
          note: 'Står under Vanding: slange kun efter kl. 20.'
        }
        // … 14 flere spørgsmål
      ],
      sources: [
        'https://trap.lex.dk/Kolonihaverne_i_Danmark',
        'https://boligforeningsweb.dk/saadan-er-knapt-20-000-kolonihaver-fordelt-i-danmark/',
        'https://kolonihaveforbundet.dk/find-kolonihave/'
      ]
    }
  ];
})();
```

- [ ] **Step 2: Run the validator to verify the text passes**

Run: `node tests/laeseforstaaelse-data.mjs`
Expected: exit 0, `texts: skim=1 mc=0 insert=0 cloze=0 total=1`, `PASS all corpus checks`. Fix every `FAIL` line before moving on — notice lengths and the 15-question count are the two that usually bite.

- [ ] **Step 3: Write the shell**

Create `laeseforstaaelse/index.html`. Follow the structure of `boejningsvaerkstedet/index.html`: inline `<style>`, then `<script src="../shared/dansk-core.js">`, the data files, `data/index.js`, then the inline game script. Required pieces:

```html
<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Læseforståelse — øv læsning på dansk som til Prøve i Dansk 3 | Sjovt Dansk</title>
<link rel="stylesheet" href="../shared/sjovt.css" />
<style>
  /* Newsprint reading room. Designer refines in Task 12. */
  :root {
    --lf-paper:  #F4F0E6;
    --lf-ink:    #1E1C1A;
    --lf-muted:  #5E574C;
    --lf-mark:   #E0B43C;   /* highlighter — the evidence marker */
    --lf-accent: #2F6F6B;
    --lf-ok:     #47745A;
    --lf-no:     #9B3D3D;
    --lf-rule:   #D8D0BE;
    --lf-fs:     19px;      /* reader text size: 17 / 19 / 22 */
    --lf-panel:  420px;     /* question-pane width on wide screens */
    --lf-sheet:  52dvh;     /* docked-panel height on narrow screens */
  }
  :root[data-paper="sepia"] { --lf-paper:#EADFC8; --lf-ink:#2B2418; --lf-rule:#CDBF9F; }
  :root[data-paper="dark"]  { --lf-paper:#16191C; --lf-ink:#E6E2D8; --lf-muted:#A59F92; --lf-rule:#2C3238; }
  @media (prefers-color-scheme: dark) {
    :root:not([data-paper]) { --lf-paper:#16191C; --lf-ink:#E6E2D8; --lf-muted:#A59F92; --lf-rule:#2C3238; }
  }

  html, body { height: 100%; margin: 0; background: var(--lf-paper); color: var(--lf-ink); }

  /* App frame: the PAGE never scrolls, the two panes do (decision 1). */
  .lf-app    { display: grid; grid-template-rows: auto 1fr; height: 100dvh; }
  .lf-main   { display: grid; min-height: 0;
               grid-template-columns: minmax(0, 1fr) minmax(340px, var(--lf-panel)); }
  .lf-reader { position: relative; overflow-y: auto; overscroll-behavior: contain;
               -webkit-overflow-scrolling: touch; scrollbar-width: thin;
               padding: 24px clamp(16px, 4vw, 48px) 96px; scroll-padding-block: 24px; }
  .lf-panel  { overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin;
               border-left: 2px solid var(--lf-rule); padding: 20px; }

  /* Reading column: one measure, centred (decision 3). System serif — no download. */
  .lf-text   { max-width: 68ch; margin-inline: auto;
               font: var(--lf-fs) / 1.65 Georgia, "Iowan Old Style", "Times New Roman", serif; }
  .lf-text p { margin: 0 0 1em; position: relative; scroll-margin-block: 24px; }
  /* Margin paragraph numbers (decision 5). */
  .lf-text p[data-par]::before { content: "¶" attr(data-par); position: absolute; right: 100%;
               margin-right: 12px; font: 700 12px/1.9 "SD Mono", ui-monospace, monospace;
               color: var(--lf-muted); }
  .lf-evidence { background: var(--lf-mark); box-shadow: 0 0 0 4px var(--lf-mark); }

  /* Dashed in-text slots for insert and cloze (decision 8). */
  .lf-gap    { display: inline-block; min-width: 4.5em; min-height: 44px; padding: 0 .5em;
               border: 2px dashed var(--lf-muted); background: transparent; color: inherit; font: inherit; }
  .lf-gap[aria-current="true"] { outline: 3px solid var(--lf-accent); outline-offset: 2px; }
  .lf-gap--filled { border-style: solid; }

  /* Tablet landscape: still split, panel 38 % (breakpoints table). */
  @media (min-width: 640px) and (max-width: 1023px) and (orientation: landscape) {
    .lf-main { grid-template-columns: minmax(0, 1fr) minmax(300px, 38%); }
  }
  @media (min-width: 1024px) and (max-width: 1279px) { :root { --lf-panel: 360px; } }

  /* Narrow screens: text on top, docked collapsible panel below (decision 2). */
  @media (max-width: 1023px) and (orientation: portrait), (max-width: 639px) {
    .lf-main  { grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) auto; }
    .lf-panel { border-left: 0; border-top: 2px solid var(--lf-rule);
                max-height: var(--lf-sheet); }
    .lf-panel[data-collapsed="true"] { max-height: 64px; overflow: hidden; }
    .lf-text p[data-par]::before { position: static; display: block; margin: 0 0 2px; }
  }
  @media (min-width: 640px) and (max-width: 1023px) and (orientation: portrait) {
    :root { --lf-sheet: 46dvh; }
  }

  @media (prefers-reduced-motion: reduce) { .lf-evidence, .lf-panel { transition: none; } }
</style>
</head>
<body>
<div class="lf-app">
  <header class="lf-top">
    <!-- title, text-size A−/A+, paper switch, progress, sound, dark toggle -->
  </header>
  <main class="lf-main">
    <!-- progress rail (decision 6) + optional hæfte index (decision 7) sit inside .lf-reader -->
    <section class="lf-reader" tabindex="0" aria-label="Tekst">
      <article class="lf-text" id="lf-text"></article>
    </section>
    <aside class="lf-panel" id="lf-panel" aria-label="Spørgsmål"></aside>
  </main>
  <!-- start screen overlay: title, Spil, mode control, level control, and the
       disclaimer required by Global Constraints -->
  <p class="lf-disclaimer">Øvelsesopgaver i samme format som Prøve i Dansk 3. Ikke officielt prøvemateriale.</p>
</div>

<script src="../shared/dansk-core.js"></script>
<script src="data/haefter-a.js"></script>
<script src="data/index.js"></script>
<script>
(function () {
  'use strict';
  var SRS_NS = 'laeseforstaaelse';
  var store = DanskCore.store.namespace(SRS_NS);
  var srs = DanskCore.srs.load(SRS_NS);

  var state = { mode: 'skim', levels: ['B1', 'B2'], text: null, timed: false,
                index: 0, right: 0, wrong: 0, answered: {} };

  var MODE_RENDERERS = {};   // Tasks 4-7 register into this

  function recordAnswer(itemId, correct, patternKey) {
    if (state.answered[itemId]) return;
    state.answered[itemId] = correct;
    if (correct) state.right++; else state.wrong++;
    DanskCore.srs.record(srs, state.mode + ':' + itemId, correct);
    if (patternKey) DanskCore.srs.pattern(srs, patternKey, correct);
    updateProgress();
  }

  // paragraphIndex is 0-based (the data's `evidence`); the DOM's data-par is 1-based.
  function highlight(paragraphIndex) {
    var el = document.querySelector('[data-par="' + (paragraphIndex + 1) + '"]');
    if (!el) return;
    el.classList.add('lf-evidence');
    el.scrollIntoView({ block: 'center',
      behavior: DanskCore.ui.motion.isReduced() ? 'auto' : 'smooth' });
  }

  // renderText, showNote, finishRound, start-screen controls, timer,
  // Escape/Enter/number-key handling, dark mode, sound, reset-with-confirm.
})();
</script>
</body>
</html>
```

Implementation requirements for this step:
- Start screen holds only the title, one **Spil** button, a mode control (the four `LAESE_DATA.modes` labels) and a level control (B1 / B2). Spil resumes `store.get('mode')` and `store.get('levels')`.
- `Træning` is the default. A `Tid` toggle enables the mode's `minutes` budget with a non-ticking progress bar, per `improvement/specs.md` § 2.8.
- Text pane renders each paragraph as `<p data-par="N">` with N starting at 1, so the margin `¶N` marker and the question pane's `Se afsnit N` agree. `data-par` is 1-based in the DOM; `evidence` in the data is a 0-based index, and `highlight(evidence)` does the +1 itself.
- The footer renders `Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se kilder.` and a `<details>` `Kilder` list from `text.sources`.
- A `Nulstil fremgang` button behind `window.confirm`.
- Zero console errors from `file://`.

The ten layout decisions are built here, not later:
- **Decisions 1–3:** the CSS above, exactly. Both panes scroll; the page does not.
- **Decision 4:** `A−`/`A+` step `--lf-fs` through 17 / 19 / 22 px and a paper switch sets `document.documentElement.dataset.paper` to `light`, `sepia` or `dark`. Both persist with `store.set('reader', { fs, paper })` inside try/catch and apply before first paint to avoid a flash.
- **Decision 5:** paragraph numbers come from the `::before` rule; the question pane says `Se afsnit N` on a wrong answer.
- **Decision 6:** a 6 px-wide rail inside `.lf-reader` (`position: sticky; top: 0; float: right`) with one tick per paragraph, positioned by `offsetTop / scrollHeight`; the current viewport is a filled thumb updated in a `scroll` handler throttled with `requestAnimationFrame`.
- **Decision 7:** in `skim` mode render a sticky `<nav>` of notice-heading buttons above the text; clicking one calls `scrollIntoView` on that notice.
- **Decision 9:** `J`/`K` change question, `[`/`]` jump paragraphs. Arrow keys are never handled, so the focused reading pane scrolls natively.
- **Decision 10:** on `scroll` (debounced 250 ms) save `store.set('scroll:' + text.id, { par: topmostVisibleParagraph, offset })`; on `resize`/`orientationchange` re-anchor to that paragraph, so rotating a tablet keeps the learner on the same line.
- Collapsing the panel (decision 2) is a `<button aria-expanded>` in the panel header; at 360 px the collapsed peek shows only the current question text, one line, ellipsised.

- [ ] **Step 4: Verify it opens and plays**

Run: `node tests/smoke.mjs` (from `tests/`, after `npm install`), then open `laeseforstaaelse/index.html` from `file://` in Chrome.
Expected: start screen renders, Spil opens the kolonihave hæfte, the text scrolls, the console is empty, and at 360 px width there is no horizontal scrollbar.

- [ ] **Step 5: Commit**

```bash
git add laeseforstaaelse/index.html laeseforstaaelse/data/haefter-a.js
git commit -m "feat(laeseforstaaelse): game shell and first hæfte"
```

---

## Task 4: Mode `skim` renderer

**Files:**
- Modify: `laeseforstaaelse/index.html` (register `MODE_RENDERERS.skim`)

**Interfaces:**
- Consumes: `renderText`, `recordAnswer`, `highlight`, `showNote` from Task 3; `DanskCore.diff.check`.
- Produces: nothing new.

- [ ] **Step 1: Write the renderer**

```js
MODE_RENDERERS.skim = function (text, host, api) {
  var q = text.questions[state.index];
  host.innerHTML = '';

  var label = document.createElement('p');
  label.className = 'lf-q';
  label.textContent = (state.index + 1) + '/15 · ' + q.q;
  host.appendChild(label);
  DanskCore.ui.ttsButton(q.q, host);        // platform rule: every prompt replays

  var input = document.createElement('input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.setAttribute('aria-label', q.q);
  host.appendChild(input);

  var submit = document.createElement('button');
  submit.type = 'button';
  submit.textContent = 'Svar';
  host.appendChild(submit);

  // 30-second nudge, from the exam technique: move on rather than stall.
  var nudged = false;
  var nudgeTimer = window.setTimeout(function () {
    nudged = true;
    api.nudge('Gå videre, og vend tilbage til spørgsmålet til sidst.');
  }, 30000);

  function answer() {
    window.clearTimeout(nudgeTimer);
    var res = DanskCore.diff.check(input.value, q.accepted);
    api.onAnswer(q.id, res.correct, null);
    if (!res.correct) {
      api.showNote(q.id, q.accepted[0] + ' — ' + q.note);
      api.highlightNotice(q.noticeId);
    }
    api.next(res.correct ? 800 : 0);
  }

  submit.addEventListener('click', answer);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') answer(); });
  input.focus();
  return function cleanup() { window.clearTimeout(nudgeTimer); };
};
```

`api.highlightNotice(noticeId)` scrolls the named notice into view and marks it with `--lf-mark`; add it next to `highlight` in Task 3's `api` object. `api.nudge(msg)` writes to the `DanskCore.ui.announce` region and a muted line in the question bar — it never blocks or auto-advances.

- [ ] **Step 2: Verify by hand**

Open the game, pick **Find oplysningen**, and answer all 15 questions.
Expected: a correct answer advances after ~800 ms with sound and no praise text; a wrong answer shows the accepted answer plus the note and highlights the right notice; Enter submits; waiting 30 s shows the nudge without advancing.

- [ ] **Step 3: Commit**

```bash
git add laeseforstaaelse/index.html
git commit -m "feat(laeseforstaaelse): skim mode renderer"
```

---

## Task 5: Mode `mc` renderer and its 3 phase-1 articles

**Files:**
- Modify: `laeseforstaaelse/index.html`
- Create: `laeseforstaaelse/data/artikler-mc.js`

**Interfaces:**
- Consumes: Task 3's `api`, `DanskCore.quiz.mc.render`.
- Produces: `window.LAESE_MC`, consumed by `data/index.js`.

- [ ] **Step 1: Write the three articles**

Create `laeseforstaaelse/data/artikler-mc.js` with `art-ulven`, `art-dialekter` and `art-efterskole` (phase 1; `art-janteloven` and `art-kontanter` wait for Task 14). Write `art-ulven` first and hold it to the calibration text in the manual's § 8 — the verified figures are in this plan's topic table. For `art-efterskole` (`check first`), verify every number against a real source and put the URLs in `sources` before writing a word; where a figure cannot be confirmed, leave it out rather than guessing, and set `verify: true` on the text. No people, no quotes, no `siger X`.

- [ ] **Step 2: Run the validator**

Run: `node tests/laeseforstaaelse-data.mjs`
Expected: exit 0, `mc=3`. The checks that usually fail first are `no sentence of 6 words or fewer`, `paragraph lengths too uniform` and `banned phrase` — all three mean the prose still reads mechanically. Fix the prose, not the validator.

- [ ] **Step 3: Write the renderer**

```js
MODE_RENDERERS.mc = function (text, host, api) {
  var q = text.questions[state.index];
  host.innerHTML = '';

  var label = document.createElement('p');
  label.className = 'lf-q';
  label.textContent = (state.index + 1) + '/' + text.questions.length + ' · ' + q.q;
  host.appendChild(label);
  DanskCore.ui.ttsButton(q.q, host);

  DanskCore.quiz.mc.render(
    { prompt: q.q, options: q.options, correct: q.correct },
    host,
    function (chosen) {
      var correct = chosen === q.correct;
      api.onAnswer(q.id, correct, null);
      if (!correct) {
        api.showNote(q.id, q.options[q.correct] + ' — ' + q.note);
        api.highlight(q.evidence);
      }
      api.next(correct ? 800 : 0);
    }
  );
};
```

`DanskCore.quiz.mc.render` already binds number keys 1–3 and Enter, so no extra key handling is needed here.

- [ ] **Step 4: Verify by hand**

Open **Læs og vælg** and play all three articles.
Expected: three questions per article; a wrong answer highlights the evidence paragraph in the text and scrolls it to the centre, and the question pane says `Se afsnit N`; keys 1–3 pick options; the text stays visible and scrollable the whole time.

- [ ] **Step 5: Commit**

```bash
git add laeseforstaaelse/index.html laeseforstaaelse/data/artikler-mc.js
git commit -m "feat(laeseforstaaelse): mc mode and three articles"
```

---

## Task 6: Mode `insert` renderer and its 2 phase-1 articles

**Files:**
- Modify: `laeseforstaaelse/index.html`
- Create: `laeseforstaaelse/data/artikler-insert.js`

**Interfaces:**
- Consumes: Task 3's `api`.
- Produces: `window.LAESE_INSERT`.

- [ ] **Step 1: Write the two articles**

Create `laeseforstaaelse/data/artikler-insert.js` with `art-samsoe` and `art-madspild` (phase 1; `art-christiania` and `art-vaernepligt` wait for Task 14). Both are `check first`: verify every figure and record the URLs in `sources`. Each needs 5 gaps and 7 blocks. Per the manual § 7, each correct block must be placeable from a cohesion signal that straddles the gap — a referring word (`Den beslutning`, `Derfor`), a time marker, or a stated contrast — and each `gaps[].note` must name that signal. The two distractors must fit the topic but break cohesion.

- [ ] **Step 2: Run the validator**

Run: `node tests/laeseforstaaelse-data.mjs`
Expected: exit 0, `insert=2`. The gap/block/solution arithmetic is fully checked, so a mis-wired `solution` map fails here rather than in the browser.

- [ ] **Step 3: Write the renderer**

Tap-to-select then tap-to-place, matching `saetningsmaskinen`'s interaction (no drag, per `improvement/specs.md` § 6.3):

```js
MODE_RENDERERS.insert = function (text, host, api) {
  var chosenBlock = null;
  var placed = {};          // gapId -> blockId

  function renderBank() {
    host.innerHTML = '';
    var hint = document.createElement('p');
    hint.className = 'lf-q';
    hint.textContent = 'Vælg et afsnit, og sæt det ind i et af de fem huller. '
                     + 'To af afsnittene skal ikke bruges.';
    host.appendChild(hint);

    text.blocks.forEach(function (b) {
      if (Object.keys(placed).some(function (g) { return placed[g] === b.id; })) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lf-block';
      btn.textContent = b.text;
      btn.setAttribute('aria-pressed', String(chosenBlock === b.id));
      btn.addEventListener('click', function () {
        chosenBlock = chosenBlock === b.id ? null : b.id;
        renderBank();
        DanskCore.ui.announce(chosenBlock ? 'Afsnit valgt. Vælg nu et hul.' : 'Valg fjernet.');
      });
      host.appendChild(btn);
    });
  }

  // Gap slots live in the reading pane, rendered by renderText from text.gaps.
  function onGapClick(gap) {
    if (!chosenBlock) {
      DanskCore.ui.announce('Vælg først et afsnit nederst.');
      return;
    }
    var correct = text.solution[gap.id] === chosenBlock;
    placed[gap.id] = chosenBlock;
    api.fillGap(gap.id, text.blocks.filter(function (b) { return b.id === chosenBlock; })[0].text, correct);
    api.onAnswer(gap.id, correct, null);
    if (!correct) api.showNote(gap.id, gap.note);
    chosenBlock = null;
    renderBank();
    if (Object.keys(placed).length === text.gaps.length) api.finish();
  }

  api.bindGaps(onGapClick);
  renderBank();
};
```

Add `api.fillGap(gapId, html, correct)` and `api.bindGaps(handler)` to Task 3's `api`. `renderText` renders each gap as a focusable `<button class="lf-gap" data-gap="ID">` (the dashed slot from decision 8, labelled `Hul N`) placed after paragraph `gap.after`; a wrong placement leaves the block in place, marks it with `--lf-no` and reveals the note, so the learner sees why cohesion broke. On wide screens, hovering or focusing a block in the question pane previews its text, greyed, inside the active slot.

- [ ] **Step 4: Verify by hand**

Open **Sæt afsnittet ind** and complete both articles, including a deliberate wrong placement.
Expected: tap a block then a gap to place it; placed blocks leave the bank; two blocks remain unused at the end; the round summary appears after the fifth gap; keyboard Tab reaches every block and every gap; the reading pane still scrolls with a long placed block in it.

- [ ] **Step 5: Commit**

```bash
git add laeseforstaaelse/index.html laeseforstaaelse/data/artikler-insert.js
git commit -m "feat(laeseforstaaelse): insert mode and two articles"
```

---

## Task 7: Mode `cloze` renderer and its 3 phase-1 articles

**Files:**
- Modify: `laeseforstaaelse/index.html`
- Create: `laeseforstaaelse/data/artikler-cloze.js`

**Interfaces:**
- Consumes: Task 3's `api`.
- Produces: `window.LAESE_CLOZE`. SRS pattern keys `connector:<type>` so the summary can report which connector type is weakest.

- [ ] **Step 1: Write the three articles**

Create `laeseforstaaelse/data/artikler-cloze.js` with `art-bakken`, `art-cykelsti` and `art-gaekkebrev` (phase 1; `art-fredagsbar` and `art-rewilding` wait for Task 14). Each is `check first`: verify every figure and record the URLs in `sources`. The gap markers `{{1}}`…`{{8}}` appear in order, once each, inside `paragraphs`, and the text reads as prose when the correct options are spliced in. All four options per gap must be grammatically possible in the slot — the choice is about meaning, not form.

- [ ] **Step 2: Run the validator**

Run: `node tests/laeseforstaaelse-data.mjs`
Expected: exit 0, `cloze=3`. The marker-order check catches the most common authoring slip.

- [ ] **Step 3: Write the renderer**

```js
MODE_RENDERERS.cloze = function (text, host, api) {
  var gap = text.gaps[state.index];
  host.innerHTML = '';

  var label = document.createElement('p');
  label.className = 'lf-q';
  label.textContent = 'Hul ' + (state.index + 1) + '/' + text.gaps.length
                    + ' · Hvilket ord passer?';
  host.appendChild(label);

  api.focusGap(gap.id);     // scrolls the gap into view and marks it active

  gap.options.forEach(function (opt, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lf-opt';
    btn.textContent = (i + 1) + '. ' + opt;
    btn.addEventListener('click', function () { pick(i); });
    host.appendChild(btn);
  });

  function pick(i) {
    var correct = i === gap.correct;
    api.fillGap(gap.id, gap.options[gap.correct], correct);
    api.onAnswer(gap.id, correct, 'connector:' + gap.type);
    if (!correct) api.showNote(gap.id, gap.options[gap.correct] + ' — ' + gap.note);
    api.next(correct ? 800 : 0);
  }

  function onKey(e) {
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= gap.options.length) { e.preventDefault(); pick(n - 1); }
  }
  document.addEventListener('keydown', onKey);
  return function cleanup() { document.removeEventListener('keydown', onKey); };
};
```

`renderText` for `cloze` replaces each `{{n}}` marker with `<button class="lf-gap" data-gap="ID" aria-label="Hul n">`, where ID is `gaps[n-1].id`. A filled gap shows the correct word inline so the text can be re-read as it is repaired. On wide screens, hovering or focusing an option previews it in the active slot.

- [ ] **Step 4: Verify by hand**

Open **Det manglende ord** and play all three articles.
Expected: eight gaps per article; the active gap is outlined and scrolled to the vertical centre of the reading pane; keys 1–4 pick options; a filled gap shows the correct word; the summary names the weakest connector type.

- [ ] **Step 5: Commit**

```bash
git add laeseforstaaelse/index.html laeseforstaaelse/data/artikler-cloze.js
git commit -m "feat(laeseforstaaelse): cloze mode and three articles"
```

---

## Task 8: The second hæfte — Rebildfesten

Phase 1 ships two hæfter. Task 3 wrote `haefte-kolonihave`; this task adds `haefte-rebildfest` and closes phase 1 at ten texts. Its own task because a hæfte is the largest single authoring job (8–10 notices of 1.200–1.800 characters plus 15 questions) and a reviewer should be able to reject it without rejecting the articles.

**Files:**
- Modify: `laeseforstaaelse/data/haefter-a.js` (add the second text to `window.LAESE_HAEFTER_A`)

**Interfaces:**
- Consumes: the manual's § 5 and § 7.
- Produces: the tenth text. The corpus now holds 2 / 3 / 2 / 3 texts (skim / mc / insert / cloze).

- [ ] **Step 1: Write `haefte-rebildfest`**

A programme booklet for the 4 July festival in Rebild Bakker: four-day programme, tickets, parking, bus, food stalls, children's activities, a history board, volunteer shifts. Facts are verified in this plan's Sources (held in Rebild Bakker since 1912, first in 1909, Max Henius donated 56 ha, Nixon, Reagan and Walt Disney attended); invent only the *practical* details a programme would carry (times, prices) and mark them clearly as exercise values in the footer, never as real current prices. At least three near-miss pairs across notices (two different opening times, two deadlines). No people, no quotes.

- [ ] **Step 2: Run the validator with the phase-1 count assertion**

Run: `node tests/laeseforstaaelse-data.mjs --expect=2,3,2,3`
Expected: exit 0, `texts: skim=2 mc=3 insert=2 cloze=3 total=10`, `PASS all corpus checks`.

- [ ] **Step 3: Open the game**

Open `laeseforstaaelse/index.html` and confirm both hæfter are reachable in **Find oplysningen**.

- [ ] **Step 4: Commit**

```bash
git add laeseforstaaelse/data/haefter-a.js
git commit -m "feat(laeseforstaaelse): Rebildfest hæfte, phase-1 corpus complete at 10 texts"
```

---

## Task 9: Round summary and SRS review

**Files:**
- Modify: `laeseforstaaelse/index.html`

**Interfaces:**
- Consumes: `DanskCore.quiz.summary.render`, `DanskCore.srs.nextItems`, `state.answered`.
- Produces: `buildReviewRound()`, used by the summary's `Gentag fejl` button.

- [ ] **Step 1: Wire the summary**

```js
function finishRound() {
  var total = state.right + state.wrong;
  var weak = Object.keys(state.answered)
    .filter(function (id) { return !state.answered[id]; })
    .map(function (id) { return { id: id, label: labelForItem(id) }; });

  DanskCore.quiz.summary.render(
    { score: state.right,
      accuracy: total ? (state.right / total) * 100 : 0,
      weakItems: weak },
    summaryHost,
    function replay() { startRound(state.text); },
    weak.length ? function review() { buildReviewRound(weak); } : null
  );

  // Connector types the learner is weakest at, for cloze rounds only.
  if (state.mode === 'cloze') renderPatternHint(srs);
}
```

`labelForItem(id)` resolves an item id to a short Danish label (the question text, truncated to 60 characters) so the weak-item list is readable. `buildReviewRound(weak)` replays only those items over the same text.

- [ ] **Step 2: Verify by hand**

Play a round with at least two deliberate mistakes in each mode.
Expected: the summary shows points and percentage with no congratulatory copy, lists up to three weak items by their Danish label, and `Gentag fejl` replays exactly those. Reload the page and confirm `DanskCore.srs` kept the record.

- [ ] **Step 3: Commit**

```bash
git add laeseforstaaelse/index.html
git commit -m "feat(laeseforstaaelse): round summary and error review"
```

---

## Task 10: Eksamenstilstand

A single sitting that chains all four parts in the real order and time budget. Separate task because it is the one feature a reviewer might cut without touching anything else.

**Files:**
- Modify: `laeseforstaaelse/index.html`

**Interfaces:**
- Consumes: `LAESE_DATA.modes`, `startRound`, `finishRound`.
- Produces: `startExam()` and a result screen with per-part counts.

- [ ] **Step 1: Implement the chained sitting**

- Picks one random unseen text per mode at the chosen level, in order `skim` → `mc` → `insert` → `cloze`.
- Budgets 25 minutes for `skim`, then 65 minutes for the other three together, matching the real test.
- Shows a `Pause`-free, non-ticking progress bar per part; time runs out → the part closes and the sitting continues.
- The result screen reports 31 items (15 + 3 + 5 + 8) as a per-part breakdown, and states plainly: `Dette er en øvelse. Resultatet siger ikke, om du vil bestå den rigtige prøve.`
- Stores the last sitting under `store.set('exam:last', …)`; never claims a pass or a grade.

- [ ] **Step 2: Verify by hand**

Start Eksamenstilstand, play through all four parts, and let one part's timer expire.
Expected: parts run in order, the expiring part closes without losing earlier answers, the result screen breaks the score down per part and shows the disclaimer.

- [ ] **Step 3: Commit**

```bash
git add laeseforstaaelse/index.html
git commit -m "feat(laeseforstaaelse): eksamenstilstand chaining all four parts"
```

---

## Task 11: UI verification suite

**Files:**
- Create: `tests/laeseforstaaelse.mjs`

**Interfaces:**
- Consumes: `tests/lib/harness.mjs` (`launch`, `openGame`, `sleep`, `hasHorizontalOverflow`, `smallTapTargets`, `focusRingProblems`, `unlabelledButtons`, `shot`).
- Produces: a PASS/FAIL line per section, exit 1 on any FAIL.

- [ ] **Step 1: Write the spec**

Model it on `tests/tidsmaskinen.mjs`, with these sections:

```js
// Functional spec for laeseforstaaelse. Run from the repo root:
//   node tests/laeseforstaaelse.mjs [--shots] [--only=boot,corpus,...]
// Sections: boot, corpus, skim, mc, insert, cloze, exam, persist, kbd, layout, reader, theme
```

- `boot` — opens from `file://` with zero console errors; the start screen shows only title, Spil, mode control, level control and the disclaimer.
- `corpus` — in-page assertion that `LAESE_DATA` holds at least 2 / 3 / 2 / 3 texts (phase 1; phase 2 only adds), every text has non-empty `sources`, every text renders the footer `Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se kilder.`, and no rendered paragraph contains a quotation mark.
- `skim` — answers all 15 questions of one hæfte; a wrong answer reveals the accepted answer, the note and the highlighted notice.
- `mc` / `insert` / `cloze` — one full text each; assert item counts 3 / 5 / 8, that `insert` leaves exactly 2 blocks unused, and that `cloze` fills the gap inline.
- `exam` — Eksamenstilstand runs the four parts in order and the result screen carries the disclaimer string.
- `persist` — answers two items, reloads, and confirms the SRS record under `laeseforstaaelse:*` survived.
- `kbd` — number keys pick options in `mc` and `cloze`, Enter submits in `skim`, Escape closes the info overlay, and Tab reaches every block and gap in `insert`.
- `layout` — repeated at all six viewports (1920×1080, 1440×900, 1280×720, 1024×768, 820×1180, 360×640), each with an `mc` text open:
  - `hasHorizontalOverflow()` is false and `smallTapTargets()` is empty.
  - **The page does not scroll:** `document.scrollingElement.scrollHeight <= innerHeight`.
  - **The reading pane scrolls:** `.lf-reader.scrollHeight > .lf-reader.clientHeight` for a long text, and `scrollTo` moves it.
  - **Layout matches the breakpoint table:** at 1920, 1440, 1280 and 1024 the question pane sits to the right of the reading pane (`panel.left >= reader.right`); at 820×1180 and 360×640 it sits below (`panel.top >= reader.bottom`).
  - **Measure:** the rendered text column is at most 75 characters wide (`.lf-text` width ÷ the width of "0" in the computed font) and at least 45 at 360 px.
  - **Nothing hides the text:** after scrolling the reader to its end, the last paragraph's bottom edge is above the question panel's top edge.
  - **Independent scroll:** wheel-scrolling the question pane to its end does not change `.lf-reader.scrollTop`.
  - **Rotation:** at 1024×768 → 768×1024 the paragraph that was at the top of the reader is still within the first viewport third after the resize.
- `reader` — `A+` raises `--lf-fs` to 22 px and `A−` lowers it to 17 px; the paper switch sets `data-paper`; both survive a reload; the scroll position of a text survives a reload.
- `theme` — dark mode and `prefers-reduced-motion` both apply; `focusRingProblems()` and `unlabelledButtons()` are empty.

- [ ] **Step 2: Run it**

Run: `node tests/laeseforstaaelse.mjs`
Expected: every section PASS. Each FAIL prints its evidence; fix the game, not the test.

- [ ] **Step 3: Commit**

```bash
git add tests/laeseforstaaelse.mjs
git commit -m "test(laeseforstaaelse): UI and accessibility spec"
```

---

## Task 12: Visual theme, home card and discoverability

**Files:**
- Modify: `laeseforstaaelse/index.html` (theme pass)
- Create: `shared/themes/laeseforstaaelse.css` only if the designer agent decides the theme belongs there
- Modify: `index.html` (game card)
- Modify: `sitemap.xml`

**Interfaces:**
- Consumes: the newsprint palette proposed in Task 3.
- Produces: the home-page card entry and the sitemap URL.

- [ ] **Step 1: Designer pass**

Dispatch the **designer** agent with this brief: a newsprint reading room inside the frozen "Sjovt Dansk" pixel-arcade system. Palette as proposed in Task 3 — paper `#F4F0E6`, ink `#1E1C1A`, highlighter `#E0B43C`, accent teal `#2F6F6B`. The highlighter marking the evidence paragraph is the signature mechanic and must read clearly in dark mode and under `prefers-reduced-motion`. Confirm the accent does not collide with `skrivekontrollen`'s proof red `#A13D3D` or its paper `#E8E0C8`, since both games are paper-themed. The designer must not change any question, note or text, and must keep the split-reader structure, the 68ch measure, the serif reading stack, the three papers and the ten layout decisions intact; Task 11's `layout` section must still pass after the theme pass.

- [ ] **Step 2: Add the home card**

In the root `index.html` game list, after the `Tidsmaskinen` entry:

```js
{ title: "Læseforståelse", description: "Læs danske tekster om Danmark, og find svarene — i samme format som Prøve i Dansk 3.", level: "B1–B2", type: "Læsning",
  url: "laeseforstaaelse/index.html", /* color/bg/dark from the designer pass */ },
```

- [ ] **Step 3: SEO pass**

Dispatch the **seo** agent for the `<head>`, the static intro and FAQ copy, JSON-LD and the `sitemap.xml` entry. Primary keyword: `læseforståelse dansk øvelser`. The agent must keep the `Ikke officielt prøvemateriale` disclaimer visible and must not imply affiliation with the official exam.

- [ ] **Step 4: Verify**

Run: `node tests/laeseforstaaelse.mjs` and `node tests/smoke.mjs`
Expected: all PASS, and the new card opens the game from the home page.

- [ ] **Step 5: Commit**

```bash
git add laeseforstaaelse/ index.html sitemap.xml shared/themes/
git commit -m "feat(laeseforstaaelse): visual theme, home card and SEO"
```

---

## Task 13: Measure and optimise the reading view

Phase 1 is playable; now find out whether the reading view is actually good, with numbers, before 10 more texts are written into it. This task changes layout and CSS only — never a text, question or note.

**Files:**
- Modify: `laeseforstaaelse/index.html` (CSS and layout JS only)
- Create: `docs/laeseforstaaelse-layout-report.md`

**Interfaces:**
- Consumes: `tests/laeseforstaaelse.mjs --shots` (Task 11), which writes one screenshot per viewport per mode into `docs/redesign/screenshots/laeseforstaaelse/`.
- Produces: a written report of what was measured, what changed, and what remains open.

- [ ] **Step 1: Capture the baseline**

Run: `node tests/laeseforstaaelse.mjs --only=layout,reader --shots`
Expected: 6 viewports × 4 modes = 24 screenshots. Open them and look at each one yourself.

- [ ] **Step 2: Measure what screenshots cannot show**

Add a `measure` section to `tests/laeseforstaaelse.mjs` that records, per viewport and per mode, and prints as a table:
- characters per line (rendered `.lf-text` width ÷ width of "0");
- visible text area as a share of the viewport (`reader.clientWidth × reader.clientHeight ÷ innerWidth × innerHeight`);
- paragraphs visible without scrolling, and how many viewport-heights the longest text needs;
- question-panel height as a share of the viewport on narrow screens;
- the tallest option or block in the panel and whether it forces the panel itself to scroll.

- [ ] **Step 3: Work through this checklist and fix what fails**

Each is a hypothesis to check against the screenshots and the table, not a fix to apply blindly.
1. **Wide screens waste space.** If the reading column is under 40 % of a 1920 px viewport, check that the paper margin looks intentional (the rail, the paragraph numbers and the hæfte index should fill it), or widen `--lf-panel`.
2. **Panel too tall on a 1280×720 laptop.** If a four-option `cloze` question needs panel scrolling, tighten option padding at heights under 760 px with `@media (max-height: 760px)`.
3. **Phone: text area too small.** If the reader is under 50 % of a 360×640 viewport with the panel open, default the panel to collapsed until the learner has read, and add an `Åbn spørgsmål` affordance; alternatively cap `--lf-sheet` at 40dvh.
4. **Long `insert` blocks.** If a block is taller than a third of the panel, truncate to two lines with an expand control; the full text always appears once placed.
5. **Rail and numbers collide.** At tablet widths the margin `¶N` may overlap the gutter; verify there is no clipped number at 820 px and 1024 px.
6. **Hæfte index on phones.** If the chip row wraps to three lines, make it a single horizontally scrolling row with edge fade.
7. **Contrast.** Check body text, margin numbers and the highlighter against all three papers; text on `--lf-mark` must reach 4.5:1.
8. **Reduced motion.** Confirm the evidence scroll uses `behavior: auto` and there is no animated panel collapse.
9. **iPad rotation.** Confirm the reading position is kept in both directions (Task 11 `layout`).
10. **Scroll chaining and rubber-banding.** On a touch device the panel at its end must not scroll the text behind it (`overscroll-behavior: contain`).

- [ ] **Step 4: Re-run and compare**

Run: `node tests/laeseforstaaelse.mjs` and the `measure` section again.
Expected: all PASS, and the table shows every fixed item moved in the right direction. Anything that did not move goes into the report as open.

- [ ] **Step 5: Write the report and commit**

`docs/laeseforstaaelse-layout-report.md` lists, per checklist item: the measurement before, the change, the measurement after, or `open` with the reason.

```bash
git add laeseforstaaelse/index.html tests/laeseforstaaelse.mjs docs/laeseforstaaelse-layout-report.md
git commit -m "feat(laeseforstaaelse): tune reading view from six-viewport measurements"
```

---

## Task 14: Phase 2 — the other 10 texts

Only start this after Task 13, so the new texts are written for a layout that has already been measured. Each sub-task is independent and can run as its own subagent; each ends with the validator.

**Files:**
- Modify: `laeseforstaaelse/data/artikler-mc.js` (add `art-janteloven`, `art-kontanter`)
- Modify: `laeseforstaaelse/data/artikler-insert.js` (add `art-christiania`, `art-vaernepligt`)
- Modify: `laeseforstaaelse/data/artikler-cloze.js` (add `art-fredagsbar`, `art-rewilding`)
- Create: `laeseforstaaelse/data/haefter-b.js` (`haefte-oefaerge`, `haefte-sprogcenter`, `haefte-pantogenbrug`, `haefte-vadehavet`) and add its script tag after `haefter-a.js`

**Interfaces:**
- Consumes: the manual (Task 1), the validator (Task 2), and the topic table. All ten are `check first`: verify every figure, record the URLs in `sources`, leave out anything unconfirmable, set `verify: true` where in doubt.
- Produces: `window.LAESE_HAEFTER_B` and the final corpus of 20.

- [ ] **Step 1: Write the six articles** (two per mode, in the three article files) — no people, no quotes.
- [ ] **Step 2: Run the validator after each file**

Run: `node tests/laeseforstaaelse-data.mjs`
Expected: exit 0 after each file.

- [ ] **Step 3: Write the four hæfter into `haefter-b.js`**

```js
// laeseforstaaelse/data/haefter-b.js
// Hæfter 3-6 for mode 'skim'.
(function () {
  'use strict';
  window.LAESE_HAEFTER_B = [
    // haefte-oefaerge, haefte-sprogcenter, haefte-pantogenbrug, haefte-vadehavet
  ];
})();
```

For `haefte-oefaerge` pick one real småø and verify its ferry timetable, fares and population; for `haefte-sprogcenter` verify the module structure of Danskuddannelse 3; for `haefte-pantogenbrug` the current A/B/C pant amounts; for `haefte-vadehavet` the sort sol season. Add the script tag in `laeseforstaaelse/index.html` immediately after the `haefter-a.js` tag:

```html
<script src="data/haefter-b.js"></script>
```

- [ ] **Step 4: Run the validator with the final count assertion**

Run: `node tests/laeseforstaaelse-data.mjs --expect=6,5,4,5`
Expected: exit 0, `texts: skim=6 mc=5 insert=4 cloze=5 total=20`.

- [ ] **Step 5: Re-run the UI spec and the measure section**

Run: `node tests/laeseforstaaelse.mjs`
Expected: all PASS; the longest new text still gives a usable reading view at all six viewports.

- [ ] **Step 6: Commit**

```bash
git add laeseforstaaelse/
git commit -m "feat(laeseforstaaelse): phase 2 texts, corpus complete at 20"
```

---

## Task 15: Native-speaker and content gate

The validator cannot judge whether the Danish reads like a Dane wrote it. This gate is the point of the whole plan and must not be skipped. Run it on the 10 phase-1 texts before release, and again on the 10 phase-2 texts after Task 14.

**Files:**
- Create: `docs/laeseforstaaelse-review.md`

- [ ] **Step 1: Tester pass**

Dispatch the **tester** agent to audit every shipped text against `docs/laeseforstaaelse-tekstmanual.md`, plus the `danish-grammar-qa` "one defensible answer" test on every question and gap. Require a verdict per text, with quoted evidence.

- [ ] **Step 2: Native review**

Have a native speaker read every shipped text aloud and mark every sentence that no Dane would write. Record the verdict per text in `docs/laeseforstaaelse-review.md` as `godkendt` / `skal rettes` with the quoted sentence. Until a text is `godkendt`, it carries `verify: true`.

- [ ] **Step 3: Fact re-check**

For every text, open each URL in `sources` and confirm each figure in the text still matches. Record the check date. Any figure that cannot be confirmed comes out of the text.

- [ ] **Step 4: Commit**

```bash
git add docs/laeseforstaaelse-review.md laeseforstaaelse/data/
git commit -m "docs(laeseforstaaelse): native review and fact-check record"
```

---

## Self-review against the brief

**Coverage.** All four PD3 parts are modes (Tasks 4–7) with the real item counts and time budgets; the long-topic booklet is mode `skim` (Tasks 3, 8, 14); 20 Denmark texts at B1–B2 are assigned by id, 10 in phase 1 and 10 in phase 2, and counted by the validator's `--expect`; "not bot-generated" is Task 1's manual, enforced mechanically by Task 2 and by human review in Task 15; no invented people or quotes is a Global Constraint, a manual section and a validator check; the visible/scrollable text on desktop, laptop and tablet is the ten layout decisions, built in Task 3, tested at six viewports in Task 11 and tuned from measurements in Task 13; the name is `Læseforståelse` throughout.

**Known gaps, deliberate.** Hæfter ship at 4–7 normalsider rather than the exam's 10, flagged with `exam_length: false` and stated in the game's info overlay. Eight of the ten phase-1 texts are not yet fact-checked (`check first`); the ulv, dialekt, kolonihave and Rebildfest topics are checked and their URLs are below. The practical details in a hæfte (opening times, prices) are exercise values, not real, and the footer says so.

**Risks.** The corpus is roughly 150.000 characters of hand-written Danish — far more authoring than any previous game in this repo. Phase 1 is deliberately half of it so the format can be judged on real texts first; the validator's count assertions (`--expect=2,3,2,3`, then `6,5,4,5`) are the only place the totals are hard-coded. Removing quotes and people makes texts safer but plainer; if Task 15's native review finds them flat, vary sentence rhythm and concrete detail before reaching for invented voices.

---

## Sources

Facts verified while planning. Every authoring task adds its own.

1. https://danskogproever.dk/sprogcenter/danskproever/om-proeve-i-dansk-3-pd3-indhold-og-niveau/ — PD3 reading structure, per-delprøve question counts and page lengths
2. https://sprogskolen.kolding.dk/proever/proeve-i-dansk-3 — time limits
3. https://www.as3.dk/media/12318/vejledning-om-proeve-i-dansk-3.pdf — official guidance (fetched, but the PDF did not parse; structure above comes from 1 and 2)
4. https://rebildfesten.dk/en/about-us/ — Rebildfesten since 1912, Max Henius, 56 ha, American guests
5. https://www.wikiwand.com/da/articles/Rebildfesten — Rebildfesten history
6. https://trap.lex.dk/Kolonihaverne_i_Danmark — allotment-garden history and counts
7. https://boligforeningsweb.dk/saadan-er-knapt-20-000-kolonihaver-fordelt-i-danmark/ — 19.773 plots in 2024
8. https://kolonihaveforbundet.dk/find-kolonihave/ — Kolonihaveforbundet, waiting lists
9. https://www.dn.dk/nyheder/2025/faktatjek-i-ulvedebatten-vi-gennemgar-de-mest-brugte-argumenter-om-ulve-i-danmark/ — wolf-debate fact check
10. https://effektivtlandbrug.landbrugnet.dk/artikler/politik/123700/ulven-er-her-det-er-et-vilkaar — 239 attacks, ministerial position
11. https://netnatur.dk/ulv-draebte-flere-end-1-200-husdyr-i-2025/ — 1.285 animals compensated
12. https://www.ulveatlas.dk/nyheder/ny-opgoerelsesmetode-skal-give-et-mere-praecist-billede-af-ulvebestanden/ — 7 packs, ≈49 wolves
13. https://www.dr.dk/nyheder/regionale/bornholm/soenderjysk-og-vendelbomaal-overlever-bornholmsk-doer — bornholmsk dying, sønderjysk surviving
14. https://www.dr.dk/nyheder/kultur/danske-dialekter-forsvinder-hurtigere-end-nogensinde — standardisation
15. https://dialekt.ku.dk/maanedens_emne/soenderjysk-udtale-og-boejning-gennem-tre-generationer/ — KU dialect research
16. https://videnskab.dk/kultur-samfund/kunstig-intelligens-skal-redde-det-bornholmske-sprog-om-et-par-generationer-er-det-uddoedt/ — AI preservation project

## NOT VERIFIED

- The official PD3 vejledning PDF would not parse, so delprøve structure rests on two secondary Danish sources that agree with each other. Confirm against the official PDF before release.
- Twelve of the 20 topics are marked `check first`; none of their figures have been verified.
- No Danish text in this plan has been read by a native speaker. The calibration text in Task 1 § 8 is the author's own Danish and is itself subject to Task 13.
- Browser Danish TTS quality is untested in this repo; the game's TTS is limited to questions and evidence sentences, so a poor voice degrades the game rather than breaking it.
