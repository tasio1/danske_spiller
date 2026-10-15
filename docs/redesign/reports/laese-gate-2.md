# laese-gate-2 — skim mode UI + content audit

Verdict: FAIL
Tested: feat/laeseforstaaelse@60a1e946a529636ca2c91192498f593b3f4ba17a (re-confirmed unchanged at resume)
Spec: task/laese-tests-2@daa6572bb518a1cc74738d9b6a984f7e492fa81f (`GAME_ROOT=<wt>/laeseforstaaelse SHOT_ROOT=<dir> OUT=<dir> node tests/laeseforstaaelse.mjs --shots`; full run: 469 pass, 9 fail, 0 NV; logs gate2\final\run.log, earlier runs r1-r4). Screenshots: gate2\shots\ (34 files, max 201 KB). Viewed: 1440 play/wrong/summary/dark, 1024 wrong, 820 wrong, 360 wrong/jump.

## Part A
| Check | Result | Evidence |
|---|---|---|
| a) data validator --expect=2,3,2,0 / shared/validate.js / smoke own exit / grep fetch-XHR-CDN | PASS | exit 0 / exit 0 / exit 0 (smoke: all PASS) / spec grep section clean. 4 WARNs under 1.2 normalsider (style flag). shared/ untouched vs master. |
| b) boot 1440x900 | PASS | 0 console errors/warnings, 0 failed requests, all requests file://; title, Spil, modes `skim`+`mc` (44 px tall), mc default, B1/B2, disclaimer exact |
| c) skim rounds, both booklets, 30 questions | PASS | accepted[0] typed through UI: 30/30 marked correct; advance 803-820 ms every question; 6 fresh loads 804-817 ms (first answer included); no praise text (live region only "Rigtigt."); wrong string on all 30: shows accepted[0], exactly 1 note (= data note), "Se opslag <heading>", waits for Næste, exactly one highlight == noticeId, heading in reader below sticky nav; "Se opslag" re-scrolls; empty/whitespace ignored; variants (UPPER+".", padded, capitalised+"!") accepted; 660 variant checks pass |
| c') accepted[] coverage | PASS WITH ISSUES | exact-match normaliser (case, trailing .!? only). 53 of 106 plausible variants rejected, e.g. "efter kl 20", "kl 9-17", "10 juni", "300,-", "kl. 9.00-17.00", "60 kvm", "omkring 6 år", "fra den 15. april til den 15. oktober" (list in r1\run.log). Minor fairness issue. |
| d) jump-list | PASS WITH ISSUES | 10 `<button>` in `<nav aria-label=Opslag>`, order = notices; click scrolls notice, heading 10 px below nav in 10/10 at 1440 and 360; aria-current correct after jump and while scrolling; 360 row scrolls horizontally; nav sticky, opaque. Smooth scroll takes up to 1.8 s on far jumps. **FAIL sub-check:** current chip not kept visible (bug B2). |
| e) nudge, drafts, Gentag fejl, summary | PASS | time shim: nudge text after "30 s" timer, never advances/blocks, still answerable; control: none after 2.2 s. Drafts kept per question over Forrige/Næste. Gentag fejl asks exactly 3,7,11. Summary: Point/Rigtige, exactly 3 weakest, Spil igen (+ Gentag fejl, identical style) |
| f) persistence / mc | PASS WITH ISSUES | keys `skim:haefte-kolonihave-q01..` in srs:laeseforstaaelse, no indices, boxes survive reload; scroll position (notice 6) survives reload; localStorage throwing: full skim round OK. mc: 3 articles (ulven, dialekter, efterskole) full rounds, 9 keys `mc:<id>` unchanged. **FAIL:** fresh text opens scrolled (B1). |
| g) layout six viewports x 2 booklets | PASS | 132 checks, 0 fail: page no scroll, reader scrolls, no h-overflow, tap >=44 (play, wrong, summary), panel right >=1024 / below 820,360, wheel isolation, last notice and footer above panel. Chars/line median/max: 63/70-71 at 1920-820 (mc 64/69), 36/43 at 360. ISSUE (ux-tune): 360 reader 44 % of screen, panel 47 %; question text duplicated (peek + prompt) at every viewport; at 360 Næste below the fold after a wrong answer. |
| h) keyboard | PASS WITH ISSUES | Tab reaches 22/22 controls (chips -> Kilder -> TTS -> input -> Svar -> Forrige -> Næste), all with focus ring; Enter submits and Enter on Næste continues; Escape in input closes Kilder; arrows/PageUp/PageDown/Space not captured; typing "jk" is text; æøå ² typed. J/K as implemented: J=previous, K=next (plan decision 9 reads "J/K = next/previous"): minor doc mismatch. |
| i) papers / motion / muted | PASS | light/sepia/dark: notice text, §N, chips, current chip, highlighted notice, kicker, input, Svar, feedback, footer all >=4.5 (min 5.8 Svar); harness lowContrast clean; OS dark -> dark paper; reduced motion -> scrollTo behavior auto (control: smooth); muted skim round 0 audio nodes (unmuted 4); long word Kolonihaveforbundet + æøå OK at 360 |

## Bugs
- **B1 major** Fresh text opens scrolled past its title and kicker. Repro: Spil on any text, first open. Expected scrollTop 0 (kicker/title visible). Actual: mc ulven 114 px, dialekter/efterskole 151, both hæfter 224 (1440; 188-298 at 360). For hæfter the first notice heading is also hidden under the sticky jump-list by 57 px, and the title carrying "(eksempel)" is out of sight. Cause: startPlay `anchor || {par:1,offset:0}` -> applyAnchor scrolls ¶1/§1 to the top (index.html startPlay / applyAnchor; ignores nav height). Spec: `skim ...starts at the top`, `...not hidden under the sticky jump-list`, `mc ...starts at the top` (5 FAIL, reproduced in 4 runs).
- **B2 minor** Jump-list current chip not scrolled into view. 1440: after jumping to notice 4-10 the current chip sits 139-228 px outside the 551 px row (invisible); 360: chip clipped 8 px at the right edge. Cause: setCurrent uses `bs[i].offsetLeft - nav.offsetLeft` (nav is the offsetParent, so the subtraction is wrong). Spec: `jump 1440x900/360x640: ...fully inside the visible chip row` (2 FAIL).
- **B3 minor** accepted[] coverage gaps (see c').
- **B4 minor** J/K direction differs from plan text.
- Observation: summary shows "Spil igen" and "Gentag fejl" in identical accent style (shared quiz.summary); brief asked for one primary.

## Part B content audit
Sheets read: haefte-kolonihave, haefte-rebildfest, art-dialekter, art-efterskole, art-samsoe, art-madspild + VERIFY-1/2. Every numeral/date/name traced; sums recomputed (36,2 > 33,3 %; 30.911 vs 31.018 = -107; 261.000-247.000 = 14.000; 1997+10 = 2007; Feb 2016 -> Dec 2025 = 9 y 10 m "næsten ti år"; 410/195 Risskov). No figure on any "Must not be used" list found (no 56 ha, 234, 881.062, 3700 investors, purchase year, 4 July/5 Aug 1912, Disney attendance). No invented person, no quote, no phone number (only "telefonnummer" = learner's own). No organisation shown as speaker of a demand.

### Hæfter (30 questions)
All 30 accepted[0] sit verbatim (word-boundary) in the noticeId notice; each string occurs in exactly one notice except haefte-rebildfest-q03 "kl. 13.30" (also n07, "købe mad før kl. 13.30": different referent, question names the opening): ok. Near-miss sets: kolonihave opening times (n01 tirsdag 17-18 / n05 torsdag 16-17 / n06 lørdag 10-12), deadlines (n07 10. juni / n03 1. juli, 1. sept / n04 5 dage), prices (300/350/50/150/400/600); rebild opening times (n01 9-17 / n05 10-18 / n07 11-17), deadlines (25. juni / 20. juni), prices (120/100/60/45/30), event times (13.30 / 14.00-16.30 / 12-14). Titles say "(eksempel)", n01 says "opfundet", footer line present, no phone number. n10 real-fact table:

| Sentence | Sheet |
|---|---|
| første kolonihaver Aalborg; København 1891, 1892 | kolonihave F6 |
| 1904 cirka 20.000 (attributed Wikipedia) | F7 |
| Forbundet 11. maj 1908, "Kolonihavelejerforeningens Forbund" | F5 |
| Loven 2001, Svend Auken | F8 |
| mindst fem lodder, gennemsnit højst 400 m2 | F9 |
| ca. 62.000 / godt 1.000 foreninger (lex.dk) | F2 |
| knap 40.000 i Forbundet | F4 |
| 19.773 i 2024 (Boligforeningsweb/DST) | F1 |
| Risskov 2018: 410 / 195 / otte til ti år, scoped | F12 |
| n09 Copenhagen overnatning 1.4-31.10, 60 m2 on <=400 m2, scoped "Københavns regler" | F11 |
| Rebild: Rebildselskabet first DK-US association, >100 år; "kaldes" largest 4 July; 1909 Aarhus; first Rebild fest 1912 (no day); ca. 80 ha, 1912, later more than doubled; three conditions; hvert år siden 1914 except wars/corona; Disney 1961, Nixon 1962, Reagan 1972; op mod 50.000 after WWII, few thousand recently (2023); football/baseball 2023 | Rebild F1, F2, F3, F6, F7, F8, F9, F11, F12 |

Findings:
- **clear error** kolonihave n04 "Om efteråret ... lukker for vandet" (fællesarbejde 18. oktober) contradicts n02 "Hanerne ... lukkes den 1. oktober"; q03 "Hvilken dato lukkes der for vandet?" gets a second readable answer.
- **source check** kolonihave n10 "Et kolonihaveområde har mindst fem havelodder ..." stands right after the Kolonihavelove sentence but F9 is Wikipedia's wording, not the law text.
- **source check** rebild n09 "Festen bruger hvert år 80 frivillige" (no F-line; invented specific stated about a real festival; footer covers "tider, priser og regler" only). Same class: 3.000 places, 800 cars, 20/12 toilets, Rebildselskabet members free.
- **source check** rebild n10 "...baseball på programmet for at gøre festen mere levende": purpose clause and "kom" not in F12/safe line ("i år" = 2023).
- doubtful, consistency: rebild n03 "Gæsterne kommer ind fra kl. 12" vs n08 activities from 10; n05 p-plads closes 18 vs evening events to 23; q03 "åbningen af hovedprogrammet" 13.30 while the programme itself starts 14.00 (one answer, but wording tight).
- **native check** "i informationstelt" x4 (n01, n02, n08, n09) vs "informationsteltet" x1; "adgang forbudt" (n03); "Knap 40.000 af haverne er medlem" (n10).
- Reachability: each notice is one 1.2-1.4k-character paragraph (style).

### mc (3 questions each, evidence paragraph contains answer in all 6)
art-dialekter:
- **source check** ¶1 "Det viste en undersøgelse fra 2015" is stronger than F1/F2 "Lige nu ser det ud til" and than its own ¶2 "foreløbigt".
- **source check/native** ¶3 "Forskere formodede dengang ... fordi mobiliteten er høj" pluralises one researcher's presumption (F6/VERIFY: "a researcher") and keeps present tense inside the dated frame.
- native: "Forskeren regnede med, at feltarbejdet tager omkring et år" (tense).
- Q1-Q3: one defensible answer, distractors wrong for the stated reason (wrong detail / true but not an answer); notes ok.
art-efterskole:
- **source check (minor)** ¶5 sentences 2-4 ("Tilskuddet er betinget ...", "Hvert år fastsættes ...") are present tense from a 2023 VIFO page; only sentence 1 carries "tal fra 2023" (¶6 hedges at the end).
- ¶2 "36,2 procent af hele årgangen" scoped by the next sentence; matches F2/F3/VERIFY. Q1-Q3 ok (Q3 option B "mindst 238 elever" invented but plainly wrong).
Notes of all six questions read: no speakers, quotes or banned phrases.

### insert (assembled files gate2\assembled-art-samsoe.txt, assembled-art-madspild.txt; both read as continuous prose)
Grid, Y = own gap, m = grammatical in isolation but weak (cohesion detail breaks it), - = no:

art-samsoe
| | g1 | g2 | g3 | g4 | g5 |
|---|---|---|---|---|---|
| b1 | - | Y | m | - | - |
| b2 | - | - | - | Y | - |
| b3 (distractor) | m | - | - | - | m |
| b4 | Y | - | - | - | - |
| b5 | - | - | - | - | Y |
| b6 | - | - | Y | - | - |
| b7 (distractor) | - | - | - | - | - |

art-madspild
| | g1 | g2 | g3 | g4 | g5 |
|---|---|---|---|---|---|
| b1 | - | Y | - | - | - |
| b2 | - | - | - | Y | m |
| b3 | Y | - | - | - | - |
| b4 | - | - | - | m | Y |
| b5 | - | - | Y | m | - |
| b6 (distractor) | - | - | m | - | - |
| b7 (distractor) | m | - | - | - | - |

All 10 correct blocks fit their own gap; five have a second "m" slot that is closed only by elimination or a detail (b1@g3 needs b6 at g3; b2@g5 needs b4 at g5; b4@g4 states Wefood tonnage before it is given; "också" in P4 needs b2). Distractors: samsø b3 repeats P1 verbatim (70 %/440 mio.); madspild b6 repeats P2; madspild b7 fits g1 on topic and fails only on "Samme år" (no year): intended trap, ok. Cohesion signals in all 10 gap notes are real.
- **clear error** samsø distractor b7 "To år efter åbningen, i 2015, blev færgen ..." — "åbningen" has no antecedent and implies an unsupported 2013 opening (F12 says only "I 2015 blev færgen sat ind").
- **source check** samsø b4 "Samsø vandt, og så skulle planen vise, at skiftet kunne lade sig gøre" (not in F1/F2).
- **source check** samsø b3 "Pengene kom ikke kun fra staten" (only a csr.dk note, no F-line).
- **source check** madspild b1 "Det kan ses i tallene for husholdningerne" answers P1's "Men ændrer det noget i de danske hjem?" after the REMA sentence, implying REMA's change shows in the data; contradicts its own last sentence "viser ikke, hvad faldet skyldes".
- **source check (minor)** madspild: Wefood "verdenspressen mødte talstærkt op" and the 3.036 ton are Folkekirkens Nødhjælp's own press release; the text does not say so (it does for Too Good To Go). b2 uses "1/3-reglen" without saying what it is.
- native: samsø b6 "Hvis overdragelsen blev gennemført, er havmøllerne ikke længere fortrinsvis ejet" (mood/tense); "Her står lokalt ejerskab over for et salg"; "Indtil november 2018" (announcement 12 Nov 2018, completion unconfirmed; text keeps it conditional: ok).
- present tense from undated/old pages is attributed ("Ifølge csr.dk/DR (2018)/lex.dk (2025)"): ok.
All 7 texts carry verify:true.

### Style flags (not failures)
- Scope-disclaimer phrases per text: efterskole 5, madspild 7, dialekter 3, samsø 2, ulven 1 — template-like ("Tallet gælder kun ... og viser ikke ...").
- Length (assembled): dialekter 2398 chars (1.00 ns), efterskole 1827 (0.76), samsø 2049 (0.85), madspild 2191 (0.91): all < 1.2.
- No trade-off/disagreement paragraph in dialekter, efterskole, madspild (skill §4.2).

## Content flags per text
- haefte-kolonihave: clear error n04 vs n02 water closing; source check n10 F9 (Wikipedia vs law).
- haefte-rebildfest: source check n09 "80 frivillige" + invented capacities, n10 football/baseball purpose; native "informationstelt"; consistency n03/n08/n05.
- art-dialekter: source check ¶1 "viste", ¶3 plural/present; native ¶2 tense.
- art-efterskole: source check ¶5 present tense from 2023.
- art-samsoe: clear error b7; source check b4, b3; native b6.
- art-madspild: source check b1 causal implicature, PR self-report, "1/3-reglen"; no clear error.

## Not covered
Touch devices, non-Windows fonts, screen reader, Firefox/Safari, native Danish judgement (all Danish wording only flagged), TTS audio output, live source pages (audit is against the fact sheets and VERIFY files only, not re-fetched). The 30 s nudge was tested through a time shim, not a real 30 s wait. Eksamenstilstand not tested (not built).

Lessons: 3 (see memory)
