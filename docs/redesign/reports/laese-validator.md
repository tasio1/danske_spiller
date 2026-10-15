# laese-validator audit, ROUND 2 (retest)

Verdict: PASS WITH ISSUES
Tested: task/laese-validator@bf6942a799c6a358678b880a74c83a2b4e154e46 (git rev-parse HEAD confirmed; round 1 was e3ac2c7)

Harness: scratch `mut.mjs` + `batch1-4.mjs`; outputs `r2_batch*.out`; round-1 outputs in `old/`. Round-1 harness (162) rerun unchanged + 105 new probes (batch4) = 267 runs; all 267 landed (batch1's 5 NOTLANDED flags are the same JSON-escaping marker artefacts as round 1, verified by grep then; batch4 105/105 landed).

| Check | Result | Evidence |
|---|---|---|
| 1 selftest x3 | PASS | exit 0 x3, 0.64/0.68/0.69 s (was 0.31 s; still < 1 s); "PASS (3 good, 63 bad fixtures)" |
| 1 scope | PASS | `git diff --name-only master...HEAD` minus tests/fixtures/laese/** = only tests/laeseforstaaelse-data.mjs |
| 2 full round-1 harness | PASS, no regression | verdict diff old vs new: 21 mutations flipped MISSED/WRONG-FAILS -> CAUGHT/OK, 0 flipped the other way |
| 3 FP probes | PASS WITH ISSUES | all 7 requested legit sentences pass with exit 0 and no WARN; see B1 |
| 3 speakers still fail | PASS | `så Mette siger ja`, `Jens Hansen forklarer`, `Landbrug & Fødevarer mener` (mid and initial) all fail [invented-speaker]; `Mette fra Aarhus siger ja` passes (known gap) |
| 4 V1/V2 locations | PASS WITH ISSUES | banned/speaker/quote caught in insert distractors (2 blocks), mc options (right and wrong), cloze wrong option, title, kicker, mc question text, skim heading, skim question text, skim notice; not caught in notes/theme (B2) |
| 4 V3 byline-in-text | PASS WITH ISSUES | `Af Jens Hansen, journalist.` at paragraph start, as own paragraph, `Af Jens.`, in skim notice start, in insert block: caught. FP probes `Af de tre veje er den korteste…`, `Af 120 pladser…`, `Af hensyn til…`, `Af Danmarks broer er…`, `Af Aarhus Kommunes veje…` pass. See B3 |
| 4 V8 zero-width / NBSP | PASS WITH ISSUES | 3 phrases (Det er vigtigt at bemærke / Kun tiden vil vise / Mere end nogensinde) x ZWSP-in-word, ZWSP-after-space, NBSP, U+202F, U+2060, tab: all caught; soft hyphen U+00AD not (B4) |
| 5 real article | PASS | `--dir=…laese-shell/laeseforstaaelse --expect=0,1,0,0` -> "texts: skim=0 mc=1 insert=0 cloze=0", PASS all corpus checks, exit 0, no WARN |

## Round-1 findings status
- V1 (distractor blocks) FIXED. V2 (options, titles, cloze wrong options) FIXED for banned/speaker/quote; notes still unscanned (B2).
- V3 (skim quotes, skim byline field) FIXED; byline-in-paragraph FIXED only for paragraph/notice/block START (B3).
- V4 curly/single quotes FIXED. V5 Derudover+Endvidere now fails capped-connector (FIXED, total cap). V6 `{{08}}` FIXED (caught).
- V7: not re-probed individually (`--expect` blank/deleted-file behaviour is by design); real-article run with `--expect` works. NOT VERIFIED as changed.
- V8 FIXED for ZWSP/NBSP/U+2060/U+202F; soft hyphen remains (B4).
- V9 FIXED: all five round-1 false positives now pass. V10 (WARN noise for sentence-initial ordinary groups) unchanged, exit stays 0.

## Bugs (remaining / new)
- B1 minor · false positive: `Efter Corona siger tallene noget andet.` -> FAIL [invented-speaker] "Corona" (preposition list is i/på/fra/til/ved/af/for/med/hos/om/mod/under/over; `efter`, `siden`, `mellem`, `blandt`, `ifølge` etc. missing). `Efter 2020 siger tallene…` passes. Also by design: person after a listed preposition evades (`Derfor, med Peter Hansen, siger mange…` and `Derfor i Peter Hansen mener man…` pass) - unrealistic phrasing, noted only.
- B2 minor · notes still unscanned: banned phrase / speaker / quote in mc `note`, insert gap `note`, cloze gap `note` and skim `theme` all pass exit 0 (notes are shown to the learner after a wrong answer). Skim `accepted[]` is scanned for banned/quote but not speaker (not prose).
- B3 minor · byline-in-text is start-anchored: mid-paragraph `Af Jens Hansen, journalist.`, after an in-paragraph newline, lowercase `af Jens Hansen.`, `Skrevet af Jens Hansen.`, `Tekst: Jens Hansen` all pass.
- B4 minor · soft hyphen (U+00AD) inside a banned phrase evades all three phrases tested.
- Known/accepted gaps unchanged (speaker after verb, other verbs, `Mette fra Aarhus siger ja`, sentence-initial single name only WARNs).

## Not covered
V7 not individually re-run; real corpus beyond the one mc article; skim/insert/cloze on the real corpus (none exist); B1/B2 sentence-length level rule (validator has none). Arithmetic in the real article is a content matter, not tested.

---
# PREVIOUS FINDINGS (round 1, e3ac2c7)
# laese-validator audit

Verdict: PASS WITH ISSUES
Tested: task/laese-validator@e3ac2c7fe9dabbee70505884b0c662930b2f1605 (git rev-parse HEAD confirmed)

Harness: scratch `mut.mjs` + `batch1/2/3.mjs` (outputs batch*.out), copy of good fixtures in `base/`, mutated copies in `m/`. 162 mutations/probes run; all 162 landed (verified by on-disk marker check; 6 initially flagged NOTLANDED were marker-escaping artefacts of JSON-escaped `"`/wrong marker and were confirmed in-file with grep). Baseline copy of good/ passes.

| Check | Result | Evidence |
|---|---|---|
| a) selftest exit 0, x3 | PASS | 3 runs exit 0, 0.31/0.37/0.31 s; "selftest: PASS (2 good, 41 bad fixtures)", 53 ok lines |
| b) scope | PASS | `git diff --name-only master...HEAD` = only tests/laeseforstaaelse-data.mjs and tests/fixtures/laese/** |
| c) false negatives, required list | PASS (all 15+ requested kinds caught) | banned upper/mixed case/nbsp/double space/NFD (caught); all 6 quote kinds in cloze para, insert solution+distractor block (caught); byline/author/forfatter; unknown genre; B3; 2/4 mc options; 4/6 gaps; two gaps->one block; markers swapped/duplicated/missing/spaced; dup ids across modes; notice 1199/1801 caught, 1200/1800 pass; 14/16 questions; empty/missing/non-URL sources; equal paragraph lengths; no sentence <=6 words; 3 digits caught, 4 pass; Derudover x2; cloze dup options (also case/space); `så Mette siger ja` |
| c2) false negatives, extra probes | FAIL (gaps, see bugs) | see V1-V8 |
| d) false positives | PASS WITH ISSUES | Biologer peger på / Landbrugsorganisationerne mener / Fåreavlere oplever / Man siger / i Nordjylland / fra Samsø pass with no error; SKILL section 8 calibration text as mc fixture: exit 0, only a length WARN (951 chars). But place/org after a group noun errors, see V9 |
| e) selftest honesty | PASS WITH ISSUES | Stripped the quote from bad/quotation-mark and substituted another fault: selftest FAIL ("fails with [level, kicker] but got..."); validator copy with QUOTES disabled: selftest FAIL; fixed bad/option-count: selftest FAIL. Weak spots: extra faults only reported as "(also: ...)", still ok (E2); deleting a non-required bad fixture (dash-summary) still PASS (only 10 rules are in REQUIRED_BAD) |
| f) --expect / missing / timing | PASS | wrong counts exit 1 (`[expect-count]`); 3 values / `a,b,c,d` exit 1 `[usage]`; missing data.js exit 1 "missing data file: data.js (looked in <dir>)"; real default dir (absent) exit 1; syntax error -> `[load-error]` exit 1; infinite loop data -> load-error after 1 s timeout; runs 0.31-0.36 s |

## Bugs
- V1 major · false negative · banned phrase in an unused insert DISTRACTOR block (`blocks[1].text += " I takt med at samfundet ændrer sig."`) -> exit 0. Distractors are shown to the learner; `prose()` excludes them from banned-phrase, invented-speaker, derudover cap, digits etc. (only quote check covers blocks). Same for `Derfor Peter Hansen mener noget andet.` in a distractor -> exit 0. Pointer: use all blocks, not only solution blocks, in checkCommon.
- V2 major · false negative · mc/cloze option texts and titles are not scanned for banned phrases or speakers: mc option `Sammenfattende 70 meter` exit 0; mc option `Peter Hansen siger 70 meter` exit 0; title `Peter Hansen mener noget` exit 0; cloze WRONG option `Sammenfattende` exit 0 (cloze correct option is scanned via substitution). Mc `note` with `Én ting er sikkert.` exit 0 (notes arguably not learner prose; flag for the decision).
- V3 major · skim notices get no quote check: `notices[3].body += ' Du skal skrive »tak«.'` and with ASCII `"tak"` -> exit 0. SKILL.md section 2 says no anførselstegn without exempting hæfter. Also `byline: "Af Jens Hansen"` on a skim text -> exit 0 (checkArticle not run for skim), and a byline line inside a paragraph (`Af Jens Hansen, journalist.`) is not detected (field check only).
- V4 minor · other quotation styles not caught: curly single `‘cykelby’`, `‹cykelby›` in article text -> exit 0 (QUOTES regex lists only " » « „ “ ”).
- V5 minor · `Derudover` once + `Endvidere` once passes (cap is per word). SKILL says "Capped at one per text: Derudover, Endvidere, Ligeledes", ambiguous whether total; confirm intent.
- V6 minor · cloze marker `{{08}}` accepted in place of `{{8}}` (regex \d+ -> number). Trivial.
- V7 minor · `--expect=1,,1,1` silently treats blank as 0 (Number('')) and demands 0 mc texts; and without `--expect`, a deleted corpus file (data-cloze.js removed) passes ("PASS all corpus checks", total=3). By design ("arrives task by task") but easy to forget --expect.
- V8 minor · zero-width space inside a banned phrase (`Gennem​ tiderne`) not detected (NFC does not strip it). Unlikely in practice.
- V9 minor-major · FALSE POSITIVES, hard FAIL on legitimate Danish, a place/org name between a group noun and the speech verb:
  - `Folk i Nordjylland siger ofte, at vejret er værst i februar.` -> [invented-speaker] "Nordjylland"
  - `Mange i Danmark mener, at cykelstier er en god idé.` -> [invented-speaker] "Danmark"
  - `De fleste i Aarhus mener, at broen er for smal.` -> same
  - `I Nordjylland siger man ofte, at vejret skifter hurtigt.` -> error, run = "I Nordjylland" (sentence-initial I + capitalised place counts as multiword name)
  - `Flertallet i Folketinget mener, at loven bør ændres.` -> error (arguably org; but the subject is Flertallet)
  Mid-sentence single capitalised word before speech verb is always an error (no place allow-list). `Mange i Danmark mener` is a natural debate-overview sentence; authors must rephrase.
- V10 minor · WARN noise: sentence-initial ordinary groups warn (`Cykelorganisationerne mener`, `Butiksejerne siger`, `Politikerne mener`, `Kommunen mener`, `Staten forklarer`, `Danskerne mener`, `Tallene forklarer`, `Ulven fortæller`, `Biologerne vurderer`, `Regeringen mener`); only a short allow-list is silent. Exit stays 0. Note SPEECH list has no `peger på`/`oplever`/`vil have`, so those are never checked.
- Accepted/known gaps confirmed, not counted: speaker after verb (`Her fortæller Anne-Mette`, `udtaler Danmarks Naturfredningsforening`, `siger Mette`), other verbs, lower-case name, sentence-initial `Mette siger` / `Rigsrevisionen vurderer` only WARN.
- Selftest: V11 minor · REQUIRED_BAD lists only 10 of 41 rules; removing any other bad fixture goes unnoticed (E3).

## Content flags
None (tooling task; no Danish content audited beyond fixture sentences I wrote myself).

## Not covered
Real corpus (`laeseforstaaelse/` does not exist in this worktree). Good-fixture content quality. B1/B2 words-per-sentence level check (validator has none; SKILL section 6 not enforced, not tested). Sentence splitter with unusual abbreviations. Stdout/exit under non-Windows shells. 1 run per mutation (no flakiness seen: all outputs deterministic; selftest 3x identical).

## Lessons candidate
Piping validator through head/tail hides exit codes; use unpiped runs for exit checks.
