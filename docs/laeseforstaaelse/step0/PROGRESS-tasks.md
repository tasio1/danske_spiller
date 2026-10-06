# Læseforståelse tasks — for the product-manager to append to `PROGRESS.md` on master

Paste under `## Next Up` after the spec section is in `specs.md` (a task whose `spec:` has no matching section goes to Blocked). Also add this row to the `Game Quick Reference` table:

`| Læseforståelse | laeseforstaaelse/ | B1–B2 | 4 + Eksamenstilstand | 10 texts phase 1 (20 phase 2) | Paper #F4F0E6, Ink #1E1C1A, Highlighter #E0B43C, Teal #2F6F6B |`

Branch per task: `git worktree add .worktrees/<id> -b task/<id> master`. The design reference for code and CSS is `docs/superpowers/plans/2026-10-06-laeseforstaaelse.md`; the pipeline plan is `docs/superpowers/plans/2026-10-06-laeseforstaaelse-pipeline.md`.

```yaml
- id: laese-validator
  spec: laeseforstaaelse
  type: test
  status: todo
  priority: P1
  title: "tester: tests/laeseforstaaelse-data.mjs — corpus validator (test-first, before any text exists)"
  acceptance: "fails on a bad fixture for each rule (banned phrase, quotation mark, wrong gap/question counts, bad solution map, bad {{n}} markers); passes on a good fixture; --expect=a,b,c,d asserts per-mode text counts; runs in under 1 s. Pattern: tests/pronomen-data-guard.mjs; code in reference plan Task 2."
  notes: "Allowed files: tests/laeseforstaaelse-data.mjs, tests/fixtures/laese/*. Rules come from .claude/skills/laese-text-authoring."

- id: laese-facts-a
  spec: laeseforstaaelse
  type: chore
  status: todo
  priority: P1
  title: "fact sheets (web): art-ulven, art-dialekter, art-efterskole"
  acceptance: "docs/laeseforstaaelse/facts/<text-id>.md per text; 6-12 facts each with verbatim source sentence, URL, fetch date; figures that cannot be confirmed are marked UNCONFIRMED; no game prose written"
  notes: "Dispatch a general-purpose agent (coder and tester have no web tools). Ulven, dialekter are already partly verified in the reference plan's Sources; efterskole needs full research."

- id: laese-facts-b
  spec: laeseforstaaelse
  type: chore
  status: todo
  priority: P1
  title: "fact sheets (web): haefte-kolonihave, haefte-rebildfest"
  acceptance: "same as laese-facts-a; plus a list of practical details (times, prices) that will be exercise values and must not be presented as real"

- id: laese-facts-c
  spec: laeseforstaaelse
  type: chore
  status: todo
  priority: P1
  title: "fact sheets (web): art-samsoe, art-madspild"
  acceptance: "same as laese-facts-a"

- id: laese-facts-d
  spec: laeseforstaaelse
  type: chore
  status: todo
  priority: P1
  title: "fact sheets (web): art-bakken, art-cykelsti, art-gaekkebrev"
  acceptance: "same as laese-facts-a"

- id: laese-facts-verify
  spec: laeseforstaaelse
  type: chore
  status: todo
  priority: P1
  depends_on: [laese-facts-a, laese-facts-b, laese-facts-c, laese-facts-d]
  title: "independent verification of every fact sheet (a different agent dispatch than the author)"
  acceptance: "every URL re-fetched; every figure marked CONFIRMED / CHANGED / UNCONFIRMED in the sheet; the author of a sheet never verifies it; user spot-checks 2-3 sheets"

- id: laese-shell
  spec: laeseforstaaelse
  type: code
  status: todo
  priority: P1
  depends_on: [laese-validator]
  title: "Læseforståelse — index.html shell + data.js registry + split-reader layout + mode mc on art-ulven"
  acceptance: "boots from file:// with zero console errors; start button id btn-play; start screen = title + Spil + mode/level controls + disclaimer; reading pane and question pane scroll independently while the page does not; mc mode playable on art-ulven; SRS keys laeseforstaaelse:mc:<id>; validator exits 0"
  notes: "Allowed files: laeseforstaaelse/index.html, laeseforstaaelse/data.js, laeseforstaaelse/data-mc.js. Structural CSS only; theme belongs to the designer. Reuse the CSS block and api design from the reference plan Task 3. art-ulven is written from the calibration text in the laese-text-authoring skill."

- id: laese-theme
  spec: laeseforstaaelse
  type: design
  status: todo
  priority: P1
  depends_on: [laese-shell]
  title: "Læseforståelse — newsprint theme: papers (light/sepia/dark), evidence highlighter"
  acceptance: "shared/themes/laeseforstaaelse.css only; contrast >= 4.5:1 on all three papers; screenshots at 360, 820, 1440; reduced-motion safe; index.html untouched"

- id: laese-mode-skim
  spec: laeseforstaaelse
  type: code
  status: todo
  priority: P1
  depends_on: [laese-shell]
  title: "Læseforståelse — mode skim: 15 short-answer questions, hæfte jump-list"
  acceptance: "answers checked with DanskCore.diff.check against accepted[]; jump-list of notice headings; 30 s nudge never auto-advances; one sample hæfte passes the validator"
  notes: "Allowed files: laeseforstaaelse/index.html, laeseforstaaelse/data-skim.js. index.html is serial: only one coder branch at a time."

- id: laese-mode-insert
  spec: laeseforstaaelse
  type: code
  status: todo
  priority: P1
  depends_on: [laese-mode-skim]
  title: "Læseforståelse — mode insert: place 5 removed paragraphs (7 offered)"
  acceptance: "tap-to-select then tap-to-place; slots are inline dashed buttons; two blocks stay unused; wrong placement shows the cohesion note; keyboard reaches every block and slot"
  notes: "Allowed files: laeseforstaaelse/index.html, laeseforstaaelse/data-insert.js."

- id: laese-mode-cloze
  spec: laeseforstaaelse
  type: code
  status: todo
  priority: P1
  depends_on: [laese-mode-insert]
  title: "Læseforståelse — mode cloze: 8 connector/adverb gaps"
  acceptance: "{{n}} markers become inline buttons; 4 options, keys 1-4; summary names the weakest connector type via DanskCore.srs.pattern"
  notes: "Allowed files: laeseforstaaelse/index.html, laeseforstaaelse/data-cloze.js."

- id: laese-summary-exam
  spec: laeseforstaaelse
  type: code
  status: todo
  priority: P1
  depends_on: [laese-mode-cloze]
  title: "Læseforståelse — round-end screen and Eksamenstilstand"
  acceptance: "round-end shows score, accuracy, <=3 weakest, Spil igen, optional Gentag fejl; Eksamenstilstand chains the four parts (25 + 65 min), Træning is default, never claims a pass or grade"
  notes: "Allowed files: laeseforstaaelse/index.html."

- id: laese-data-mc
  spec: laeseforstaaelse
  type: data
  status: todo
  priority: P1
  depends_on: [laese-shell, laese-facts-verify]
  title: "Læseforståelse data-mc.js — art-dialekter, art-efterskole (art-ulven comes with the shell)"
  acceptance: "3 mc texts in total (--expect mc=3); written only from CONFIRMED facts of the fact sheets; validator exits 0; verify:true where unsure; no filler or clone-generators"
  notes: "Allowed files: laeseforstaaelse/data-mc.js. Load .claude/skills/laese-text-authoring first."

- id: laese-data-skim
  spec: laeseforstaaelse
  type: data
  status: todo
  priority: P1
  depends_on: [laese-mode-skim, laese-facts-verify]
  title: "Læseforståelse data-skim.js — haefte-kolonihave, haefte-rebildfest"
  acceptance: "2 hæfter, 8-10 notices of 1200-1800 chars each, 15 questions each, >= 3 near-miss pairs each; validator exits 0 with --expect skim=2; practical times and prices are exercise values and the footer says so"
  notes: "Allowed files: laeseforstaaelse/data-skim.js."

- id: laese-data-insert
  spec: laeseforstaaelse
  type: data
  status: todo
  priority: P1
  depends_on: [laese-mode-insert, laese-facts-verify]
  title: "Læseforståelse data-insert.js — art-samsoe, art-madspild"
  acceptance: "2 insert texts, 5 gaps and 7 blocks each, each gap note names the cohesion signal; validator exits 0 with --expect insert=2"
  notes: "Allowed files: laeseforstaaelse/data-insert.js."

- id: laese-data-cloze
  spec: laeseforstaaelse
  type: data
  status: todo
  priority: P1
  depends_on: [laese-mode-cloze, laese-facts-verify]
  title: "Læseforståelse data-cloze.js — art-bakken, art-cykelsti, art-gaekkebrev"
  acceptance: "3 cloze texts, 8 gaps each, >= 3 connector types each, markers {{1}}..{{8}} in order; validator exits 0 with --expect cloze=3"
  notes: "Allowed files: laeseforstaaelse/data-cloze.js."

- id: laese-seo
  spec: laeseforstaaelse
  type: chore
  status: todo
  priority: P2
  depends_on: [laese-summary-exam, laese-data-mc, laese-data-skim, laese-data-insert, laese-data-cloze]
  title: "seo agent: head copy, JSON-LD, sitemap entry for laeseforstaaelse/index.html"
  acceptance: "primary keyword 'læseforståelse dansk øvelser'; JSON-LD parses; 'ikke officielt prøvemateriale' stays visible; sitemap.xml lists the page; tests/seo-static.mjs passes"

- id: laese-home-card
  spec: laeseforstaaelse
  type: code
  status: todo
  priority: P2
  depends_on: [laese-seo]
  title: "root index.html — Læseforståelse card (games array and static cards)"
  acceptance: "card opens the game; both places in sync; existing sprite reused; a new sprite is a shared-system request to the user"
  notes: "Allowed files: root index.html only."

- id: laese-ux-tune
  spec: laeseforstaaelse
  type: design
  status: todo
  priority: P2
  depends_on: [laese-summary-exam]
  title: "Læseforståelse reading-view tuning from six-viewport measurements"
  acceptance: "1920x1080, 1440x900, 1280x720, 1024x768, 820x1180, 360x640: chars/line, visible-text share and panel height measured per mode; the 10-point checklist from the reference plan Task 13 with before/after numbers; items that did not improve listed open"
  notes: "designer then tester. Allowed files: shared/themes/laeseforstaaelse.css, docs/redesign/reports/laeseforstaaelse-layout.md."

- id: laese-native-review
  spec: laeseforstaaelse
  type: data
  status: todo
  priority: P1
  depends_on: [laese-data-mc, laese-data-skim, laese-data-insert, laese-data-cloze]
  title: "native-speaker review of all phase-1 texts and every verify:true item"
  acceptance: "every phase-1 text read aloud by a native speaker; verdict recorded per text; flags cleared or the text fixed; validator and tester re-run"
  notes: "Human task. Until done every text carries verify:true."
```

## Phase 2 (add after `laese-ux-tune`, P2)

`laese-facts-e` (haefte-oefaerge, haefte-sprogcenter), `laese-facts-f` (haefte-pantogenbrug, haefte-vadehavet), `laese-facts-g` (art-janteloven, art-kontanter), `laese-facts-h` (art-christiania, art-vaernepligt), `laese-facts-i` (art-fredagsbar, art-rewilding), `laese-facts-verify-2`, then `laese-data-skim-2`, `laese-data-mc-2`, `laese-data-insert-2`, `laese-data-cloze-2` with `--expect=6,5,4,5`, then `laese-native-review-2`.
