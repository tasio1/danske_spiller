# laese-shell gate — RETEST (one cycle)

Verdict: PASS WITH ISSUES
Tested: task/laese-shell@b42426850d639e0bfdf7d5c7f274ad9eccbe0f16 (diff vs 0b5f969: data-mc.js + index.html only; shared/ untouched)
Spec: task/laese-tests@3d6f01d1a75a72af293dc0946ce4495a0c58ec2c (adds section `retest`); logs and screenshots in retest\ (shots\ viewed: 1920 margin, 1024 wrong, 820 wrong)

| Check | Result | Evidence |
|---|---|---|
| B1 chars/line, six viewports (median/max) | PASS | 1920/1440/1280/1024/820: 64/69 each (column 551 px, 29em); 360: 36-37/41 (accepted ISSUE). Times New Roman fallback forced: 69/75 at 1440, 1280, 1024. Both coder figures confirmed independently. |
| Margin numbers ¶N | PASS | room left of the column: 1920 475 px, 1440 235, 1280 155, 1024 57 (need 21); stacked at 820/360 as a block above the paragraph. Seen in screenshots, not clipped, not overlapping. |
| Layout at 1024 split, 820 stacked, all six | PASS | page no scroll, reader scrolls, last paragraph above panel, no h-overflow, tap targets >=44 (play/wrong/Kilder/summary), wheel isolation, panel position |
| B2 advance timing | PASS | 6 fresh loads unmuted: 802-817 ms for first and second answer; muted: 803-818 ms. (before: 974-1026 first answer) |
| Muted: 0 audio nodes with AudioContext on Spil | PASS | osc=0 (unmuted control still 9 in the main run) |
| AudioContext unavailable | PASS (FLAKY harness) | standalone 2/2 pass, 0 console errors; in one full run the spec crashed at that scenario with "detached Frame" on the Spil click (harness, not an assertion; a first full run also lost the browser during a screenshot while smoke ran in parallel) |
| Smoke | PASS | own exit code 0, 28/28 |
| data validator --expect=0,1,0,0 / shared/validate.js | PASS | exit 0 / exit 0 (0 errors) |
| Spec sections boot, persist, kbd, reader, theme (+round, layout, content, grep) | PASS | full run 211 PASS, 0 FAIL before the harness crash above |
| Content audit of changed text | PASS (doubtful items below) | see below |

## Content re-audit
- B3 par 8 last sentence: now "viser kun, hvordan det så ud fra 2023 til 2025 og i foråret 2026" — consistent with par 2/3 (2023, 2024 and 2025 figures plus spring 2026). Fixed.
- C1 par 3: "I 2023 ... registreret 57 ulveangreb på husdyr. Året efter var tallet 91, og i 2025 blev der registreret 239 i Jylland." Scope "i Jylland" now only on 239 (F1); 57/91 (F2) unscoped. Fixed. Note: "i 2025 blev der registreret 239 i Jylland" now reads as if the 2023/2024 series is not Jutland while Q1 still compares them; wording, not a fact error. Native read: "registreret 239 i Jylland" ok.
- C2 par 7: "Ændringen flytter ulven fra bilag IV til bilag V i habitatdirektivet" — F9 phrase; "før/nu står" gone. Fixed. Remaining: "Ulven er altså stadig beskyttet" (F8, dated 2025) and "I 2025 sænkede EU" (F8, Parliament 8.5.2025) are supported; "stadig" is a present-tense reading of a 2025 source, softened by par 8's closing hedge. ok.
- C3 par 2: "Opgørelsen viser bestanden i foråret" — natural wording; no flag.
- Numerals re-traced, all on F1-F12: 2023, 2024, 2025, 2026, 57 (F2), 91 (F2), 239 (F1), 1.239/32/fem/otte/en (F3), 1.285 (F3/F4; 1239+32+5+8+1 = 1285), mindst 36 (F5), 35 (F5 caveat), 80 and ti (F12), syv (F6/F7), tre/en (F6). Spec allow-list check: PASS. No new numerals.
- Questions unchanged and still single-answer: Q1 par 3 (57, 91, 239 present: "steg hvert år"), Q2 par 5 (36 and 35 mio.), Q3 par 6 (80 dyr bag hegn; "Staten betaler dermed ..."). Evidence paragraphs 3, 5, 6 unchanged and still contain the answers.
- Notes re-read: Q1 "Tallene er 57 i 2023, 91 i 2024 og 239 i 2025, så antallet steg hvert år." ok. Q2 "Omkring 35 af de mindst 36 millioner kroner gik til hegn; beløbet dækker kun erstatning og hegn." ok (F5). Q3 "I 2025 blev omkring 80 dyr dræbt bag hegn i orden, og staten betaler for at gøre hegn ulvesikre." ok (F12, F10). No speakers, quotes, invented people, banned phrases (no 49, 89, "strengt beskyttet" as current, "36 mio. i erstatning", biologists, L&F) found. Q1 note says "239 i 2025" while par 3 now scopes 239 "i Jylland": consistent enough.
- Still doubtful (carried): par 3 comparability of 57/91 (SGAV "opgjort") and 239 ("registreret") per VERIFY-1 "different registers" — safe-list allows it; native/fact owner may confirm.

## Remaining ISSUES (accepted)
laese-ux-tune: 360x640 reader 39 % of screen at 37 chars/line, question text twice (peek + body), wrong-answer box and "Næste" below the fold of the 333 px panel. Not built in shell: progress rail, `[` `]` jump, unfinished answers saved.

## Bugs
None open. B1, B2, B3 closed.

Not covered (retest): same as before (touch, non-Windows fonts, screen reader, Firefox/Safari, native Danish); the harness flake above.

---
# PREVIOUS FINDINGS (cycle 1, task/laese-shell@0b5f969, verdict FAIL)
B1 text measure 93 chars/line (68ch); B2 first-answer advance 974-1026 ms; B3 par 8 inconsistency; doubtful: par 3 "i Jylland" scope, par 7 "nu står den i bilag V", par 2 "viser foråret". Full cycle-1 report: laese-shell-previous.md.
