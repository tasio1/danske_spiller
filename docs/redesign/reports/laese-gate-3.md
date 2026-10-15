# laese-gate-3 (incremental)
Tested: feat/laeseforstaaelse@5faafc17235e56f693f263b70405a8ea57a916e6 (confirmed)
Spec branch: task/laese-tests-3 (base same tip)

## PART 0 — spec hygiene (full spec run on tip, before edits: 471 pass / 7 fail)
| Failure | Verdict | Evidence |
|---|---|---|
| data `--expect=2,3,2,0` | stale | corpus now 2,3,2,3; spec updated; validator `--expect=2,3,2,3` exit 0 |
| grep fetch/XHR/CDN flagged index.html:13 | stale (new, not in the designer's list) | `<link rel="canonical" href="https://sjovtdansk.dk/...">` is not a request; grep now skips rel=canonical |
| round: revisiting an answered question shows static review | stale | spec pressed J to go back; J is now NEXT, so it landed on unanswered Q3 (enabled 3 options); now presses K |
| kbd J/K, skim nav J/K | stale | assertion encoded J=previous/K=next; flipped to J=next/K=previous, passes after edit (see Part A) |
| skim boot (modes.length===2) | stale | start screen now offers 4 modes (skim, mc, insert, cloze, all 44 px tall); assertion updated |
| skimdata haefte-rebildfest-q04 | REAL (minor data defect) | accepted[0] is now "kl. 14-16.30" but the notice reads "kl. 14.00-16.30"; the wrong-answer box shows accepted[0] as "Rigtigt svar", so the learner is shown a string that is not in the text. Owner: data-skim.js, put the verbatim variant first. |

## PART A progress
- (a) validator --expect=2,3,2,3 exit 0 (4 WARN under 1.2 normalsider: dialekter 2390, efterskole 1841, samsoe 2040, madspild 2225); shared/validate.js exit 0; seo-static exit 0 ("all passed"); smoke own exit 0 (28 PASS); fetch/XHR/CDN grep clean (only the rel=canonical link, not a request).
- (b) first visit, fresh storage, full intro curtain present: first click on Spil right after DOMContentLoaded starts the game at 1440x900 and 360x640 (sd-pre has pointer-events:none); curtain gone <2 s; 0 console errors/warnings/failed requests; start screen: 4 modes selectable and each opens its first screen, mc default, 'Øv videre' block with 2 working links, static bar. PASS.
- (i) title 56 chars, description 148, 2 JSON-LD blocks parse (LearningResource, BreadcrumbList), canonical/og/icons resolve, sitemap lists the game, seo-static exit 0. PASS.
- (h) home card renders and opens the game at 1440x900 and 360x640 (rerun after fixing my uppercase-regex assertion): see final table.
- (c) insert x2, cloze x3 played to the end (spec sections g3insert/g3cloze, run r2): 86 pass, 2 fail (the 2 = my "✓ Valgt" regex vs upper-case rendering, fixed). Insert: 7 blocks/5 slots, correct placement advances 812-816 ms, wrong placement -> "Afsnittet passer ikke i Hul 2." + gap note + focused "Prøv igen", slot text "✗ passer ikke her", block returns to bank (7), first-attempt scoring (4/5 after one wrong attempt, 5/5 clean), 2 distractors remain until the end ("To afsnit blev ikke brugt."), keys 1-7 (+Escape, 8/9 ignored), slot-first and block-first both work, resume after reload (2 placed -> 2 placed, bank 5), SRS keys insert:<gap-id>. Cloze: 24 gaps via UI, correct option fills the gap inline with ✓ (advance 804-821 ms), wrong option reveals "Rigtigt ord", note, waits for Næste, locks options; scripted misses give exact 'Svageste type' lines (bakken "modsætning (3 af 3 forkert)", cykelsti tie "modsætning og tilføjelse (1 af 2 forkert)", gaekkebrev "følge (1 af 1 forkert)"); keys 1-4; Gentag fejl asks exactly the missed gaps; resume at Hul 4; patterns connector:<type>. OBSERVATION: after Gentag fejl the summary shows 8/8 / 5/5 although attempts were missed (same design as skim; SRS keeps the first miss).
- (d)/(e)/(f) run r3 (g3persist + g3layout, 4 modes x 7 viewports, old reach metric): 287 pass. All texts open at scrollTop 0 at 1440 and 360 (cloze: active gap fully visible; gate-2 B1 FIXED); scroll anchor survives reload (skim, mc, insert, cloze); SRS keys `mc|skim|insert|cloze:<id>` + `connector:<type>`, no indices. Layout: page never scrolls, reader scrolls, no h-overflow, targets >=44, panel right at >=1024 / below at 820, 360, 390, last paragraph above panel, wheel isolation, margin ¶N room: PASS in all 28 combos. Spec artefacts found and fixed: "retry reachable" metric and "peek hidden" metric (peek is visually hidden by clip, still in DOM).
- (e) keyboard g3kbd (mc, insert, cloze): Tab reaches every control incl. 8 inline cloze gaps, 5 insert slots and 7 bank blocks, focus rings, Escape closes Kilder, arrows/PageUp/PageDown not captured; J = next / K = previous in mc, cloze, insert (open gaps) and skim. Spec artefact fixed: cloze wrong-answer helper used gap 1 after navigation.

## PART B - content audit
### B1. Cloze articles (never audited before): art-bakken, art-cykelsti, art-gaekkebrev (sentence-by-sentence against sheet F-lines and VERIFY-2 Safe to use / Must not be used)
Lengths (clean text): bakken 2897 chars (1.21 normalsider), cykelsti 2919 (1.22), gaekkebrev 2884 (1.20): all >= 1.2. No Derudover/Endvidere/Ligeledes anywhere (text or options) in any data file (cap OK). No quotation marks, no `siger X`, no invented person (Kirsten Piil is the legend figure, always "ifølge sagnet"; Maria Christiane Hansdatter is not named). No figure from a Must-not-be-used list (no 2,5-2,9 mio., 32/33 rides, no Cykelslangen length, no 7 %, no 220 km, no 1800s egg history, no gæk=narre).

| Sentence | Sheet / verdict |
|---|---|
| bakken: Bakken i Jægersborg Dyrehave ved Klampenborg nord for København; hedder også Dyrehavsbakken | F4, F8 |
| 36 forlystelser "ifølge Bakkens egen hjemmeside", undated, other sources differ | F9 (+caveat) |
| Kirsten Piil fandt kilde i 1583 "ifølge sagnet"; københavnerne drak vandet fordi byens vand var dårligt, mange troede det var sundt | F1, F2 |
| Parken regnes for verdens ældste ... 1583 kun sagnets årstal | F3 (attributed "regnes for") |
| Christian V konge 1670, parforcejagt, firdoblede sin fars dyrehave | F7 |
| Frederik V åbnede haven officielt 1746, fri adgang 1756 | F6 |
| "Den adgang gjaldt haven. Den gjaldt ikke selve Bakken" | **source check (minor)**: F6/VERIFY say the source is about the Dyrehave and silent on Bakken's entry; "gjaldt ikke selve Bakken" asserts more than the source |
| Bakken skriver selv "altid" gratis entré; intet årstal; "altid" er Bakkens eget; man betaler for forlystelser; også ved koncerter | F5 (VERIFY correction applied) |
| besøgstal kan ikke gøres nøjagtigt op, anslået 1,8 mio. for 2025, andre kilder andre tal | F10 |
| closing: tre ting holdes adskilt (1583 / 1756 / gratis entré) | consistent with the body |
| cykelsti: 27 kommuner, vision over 850 km / mere end 60 ruter i 2045 | F10 + VERIFY (2045 on the press release) |
| 2024: 244 km på 16 ruter, ruterne forbandt 21 af 27 kommuner | F1 |
| Albertslundruten, C99, første, lørdag 14. april 2012, fem kommuner (5 named = 5); length omitted | F4, F5 |
| +87 % cykeltrafik i gennemsnit, "næsten dobbelt så meget" (1,87x), scope gennemsnit af 16 ruter | F2 (+arithmetic) |
| 14 % af de nye cyklister tog før bilen; gennemsnitlig tur 12 km | F3 (present tense "er 12 km" from a 2024 evaluation: minor) |
| Cykelslangen indviet sommer 2014, Dybbølsbro-Havneholmen, forlængelse af Bryggebroen (2006), no length | F6 (CHANGED: length omitted) |
| 43 % (2025) mod 46 % (2024), mål 50 %, "tre procentpoint lavere" (46-43 = 3), scope arbejde og uddannelse i København | F7 |
| areal mellem husene, København 2025, uden parker: kørebaner 49, fodgængerarealer 32, cykelstier/-baner 6 (+4 fælles), bilparkering 8, cykelparkering 1 (sum 100 %) | F8 |
| "Fodgængerarealer er fortove, gågader, torve og pladser" | **source check (minor)**: definition not in the sheet |
| 401 km cykelsti i København 2025, heraf 64 km supercykelsti | F9 (scope stated in ¶6) |
| "mere plads til cyklister betyder mindre plads til noget andet" | editorial inference from a fixed area; VERIFY: only the area comparison is sourced; minor |
| gækkebrev: definition, vers, evt. blomst; vintergæk "traditionelt", ikke et krav | F1, F5 |
| anonymt eller navn med prikker; én prik pr. bogstav | F2, F6 |
| bindebrev fra Tyskland, kendt i Danmark i 1600-tallet; ældste kendte gækkebrev 1770, til en kvinde i Odense; "betyder ikke, at traditionen begyndte det år" | F4, F3 (+VERIFY wording) |
| tradition: gættet inden palmesøndag, ingen regel | F8 |
| udbredt regel: gættet afsender skylder modtageren æg; ikke gættet / gættet forkert: modtageren skylder afsenderen æg; varianter findes | F7 (+VERIFY "udbredt regel") |

Minor internal tension (gaekkebrev): ¶4 defines "regel" as something you must follow, while the egg custom is later called "en udbredt regel" (VERIFY-approved wording).

24-gap simulation (every option read in every slot):

| Gap | Correct | Second option defensible? |
|---|---|---|
| bakken c1 tid | Derefter | no (Alligevel needs an obstacle that is not there) |
| c2 praecisering | nemlig | no. Note says "Begrundelse" but type is praecisering: label mismatch only |
| c3 kontrast | Dog | no |
| c4 tid | Senere | no |
| c5 kontrast | imidlertid | borderline: "nemlig" could read as an explanation; native check, low |
| c6 kontrast | Til gengæld | no |
| c7 tilfoejelse | Desuden | no |
| c8 konsekvens | derfor | no ("og dog" is not a contrast here) |
| cykelsti c1 tid | Foreløbig | **PROBABLE second answer "Heraf"**: "over 850 km ... Heraf var der i 2024 244 km på 16 ruter" is grammatical and coherent (built network = part of the vision) -> native check |
| c2 tid | Siden | no |
| c3 tilfoejelse | Desuden | **possible "Derfor"**: reads as a consequence of the 12 km trip length; causally unsupported but the sheet itself labels this relation "konsekvens" -> native check |
| c4 praecisering | Mere præcist | no |
| c5 kontrast | Alligevel | no |
| c6 kontrast | dog | **possible "også"** ("udgjorde også kun 6 %" reads as another list item; awkward) -> native check, low |
| c7 tilfoejelse | Dertil | no (Heraf contradicts "ikke talt med i de 6 %") |
| c8 praecisering | Heraf | no (Dertil/Desuden would add 64 km to 401) |
| gaekkebrev c1 tilfoejelse | Desuden | no |
| c2 konsekvens | Derfor | **possible "Desuden"** (adds a further fact; Derfor much stronger) -> native check, low |
| c3 praecisering | Med andre ord | no; the phrase introduces an example, slightly unnatural |
| c4 tid | Senere | no |
| c5 kontrast | Dog | no |
| c6 tid | Derefter | no |
| c7 kontrast | Omvendt | no |
| c8 tilfoejelse | også | no |

Authors' flagged pairs: bakken c1, bakken c8 ok; cykelsti c3 possible; cykelsti c6 possible; gaekkebrev c2 possible/low. NEW, not flagged by the authors: cykelsti c1 "Heraf". Padding definitions read childlike in places ("Entré er prisen for at komme ind på et sted, for eksempel ved en indgang") and recur in all three articles: style flag.

### B2. Re-audit of reworked texts (git diff 60a1e94..5faafc1; every gate-2 finding)

| Gate-2 finding | Status on tip |
|---|---|
| kolonihave n04 "lukker for vandet" vs n02 1. oktober (clear error) | FIXED: n04 now "rydder fællesarealerne"; no second closing date |
| kolonihave n10 five lots = law? | FIXED: "Wikipedia skriver også, at ..." |
| kolonihave "Knap 40.000 af haverne er medlem" | FIXED (medlemmer) |
| rebild n09 "80 frivillige", capacities, n10 purpose clause | FIXED ("I dette eksempel / i eksemplet" on every capacity; n10 "I 2023 var der blandt andet amerikansk fodbold og baseball på programmet") |
| rebild n03 "Gæsterne kommer ind fra kl. 12", n05 p-plads vs evening, n06 hvert 10. minut | FIXED (Pladsen foran scenen åbner kl. 12; aftenparkering langs vejen; second bus frequency removed so q09 is unambiguous) |
| "informationstelt" x4 | FIXED (informationsteltet everywhere) |
| dialekter ¶1 "viste", ¶3 plural/present, ¶2 tense | FIXED ("begyndte en undersøgelse", "Et første, foreløbigt resultat", "Sprogforskeren formodede ... var høj", "ville tage") |
| efterskole ¶5 present tense from 2023 | FIXED (past tense; Q3 now "ifølge oversigten med tal fra 2023") |
| samsø b7 "To år efter åbningen" | FIXED (plain F12 fact) |
| samsø b4 "så skulle planen vise" | FIXED |
| samsø b3 "Pengene kom ikke kun fra staten" | FIXED (F4 + scope sentence only) |
| samsø b6 mood/tense | FIXED ("Om overdragelsen blev gennemført, siger kilderne ikke") |
| madspild b1 causal implicature | FIXED (neutral P1 question, b1 "For husholdningerne findes der tal") |
| madspild Wefood self-reported figures | FIXED ("Folkekirkens Nødhjælps egen pressemeddelelse", "organisationens eget tal") |
| madspild b2 "1/3-reglen" never explained | OPEN, minor (no CONFIRMED definition in the sheet) |

New from the rework: rebildfest-q04 accepted[0] = "kl. 14-16.30" while the notice says "kl. 14.00-16.30" (the wrong-answer box shows accepted[0] as "Rigtigt svar"): minor data bug. samsø P2 "Indtil november 2018 ..." with b6 "Om overdragelsen blev gennemført, siger kilderne ikke" implies ownership ended in Nov 2018 (announcement 12 Nov 2018); VERIFY-approved "indtil 2018", minor.

art-ulven: `git diff 60a1e94..HEAD -- laeseforstaaelse/data-mc.js` has no ulven line, so its numbers are unchanged (57, 91, 239, 1.285, 36, 35, 80). PASS.

Skim answers: 30 accepted[] lists (529 entries, 3-38 per question) pass the case/punctuation variants; over 6.000 wrong near-miss values (other questions' answers, every other time/price/date/measure in the same booklet incl. "fra" and no-"kl." forms, +-1 digit perturbations) are rejected (spec g3answers). Only exception: the q04 formatting issue.

Insert 7x5 grids after the rework (Y own gap, - no fit, m second fit closed only by elimination or a named hook):
- samsø: b1 -,Y,m,-,- | b2 -,-,-,Y,- | b3 (distractor) -,-,-,-,- (repeats P1's DR sentence verbatim wherever it goes; no cohesion signal) | b4 Y,-,-,-,- | b5 -,-,-,-,Y | b6 -,-,Y,-,- | b7 (distractor) -,-,-,-,- (plain ferry fact; P1 "Skiftet", P3 "Møllerne", P4 "Omstillingen / nyt mål" all reject it)
- madspild: b1 -,Y,-,-,- | b2 -,-,-,Y,m | b3 Y,-,-,-,- | b4 -,-,-,m,Y | b5 -,-,Y,m,- | b6 (distractor) -,-,-,-,- (duplicate of P2) | b7 (distractor) -,-,-,-,- (its only topical home is g1, where P1 "Samme år" lacks a year: the intended cohesion mechanism)
Decision on the author's list: b3@g1 (samsø) and b6@g3 (madspild) repeat the paragraph beside the gap and are not plausible fits; b7@g1 (madspild) fits the topic but fails "Samme år", same mechanism as any distractor; b1@g3 (samsø), b2@g5, b4@g4, b5@g4 (madspild) are second fits of CORRECT blocks closed by elimination. No distractor plausibly fills a gap, so no defect.

- Spec committed task/laese-tests-3@702fcdf (final run in progress, log gate3/final/run.log).
- Interim findings from partial runs: cloze gap-number badge on dark paper 4.36:1 (<4.5) [lf-cz-n, colour rgb(171,165,152) on gap bg rgb(51,65,61)]; rebildfest-q04 accepted[0] not verbatim; phone: Næste/Prøv igen below the visible panel at 360x640 (measured, reachable by scrolling the panel; see metrics).

## FINAL (tip 5faafc1, spec task/laese-tests-3@702fcdf): full run 995 pass, 4 fail (3 distinct defects), 0 NV
Fails: rebildfest-q04 accepted[0] not verbatim (x2 assertions); cloze gap-number badge dark 4.36:1 (x2 assertions, state + results).
Only sub-4.5 text pairs found across 4 modes x 3 papers x (bank/state/results): cloze `.lf-cz-n` badge on dark paper (rgb 171,165,152 on gap bg 51,65,61 = 4.36). Everything else >= 4.94 (lowest: insert gapRightTag light 4.94). TTS icon vs fill 12.2-16.1:1 all papers; TTS frame vs surround 1.03 (light) / 1.09 (sepia) but icon itself passes.
Phone tables: see final reply.
