# Tal og tid - independent QA

Verdict: PASS WITH ISSUES (no blocker/major bug found; content items need native check)
Tested: task/tal-og-tid@fde26335a5e2e817eea914038960a53558bfe374 (worktree `.claude/worktrees/agent-ad156e45a2435543a`, game files unmodified; HEAD re-checked at end of run)

Specs: `tests/tal-og-tid.mjs` (sections: func | bulk | typed | layout | kb | persist | misc), helpers `tests/lib/taltid-driver.mjs`.
Rerun: `cd <worktree> && SHOT_ROOT=<main>/docs/redesign/screenshots node <main>/tests/tal-og-tid.mjs [section...]`
(`node shared/validate.js` + smoke: `node tests/smoke.mjs tal-og-tid/index.html --shots`).

| Check | Result | Evidence |
|---|---|---|
| Data structure (965 items: klokken 432, tal 315, aarstal 218) | PASS | own script: unique kebab ids, levels A1/A2/B1, `mode` = key, `correct` in options (MC) / in `accepted_answers` (typed), no duplicate options, no empty answers, no duplicate (mode,kind,sentence,show). `node shared/validate.js` = 0 errors/0 warnings (note: it does not cover game data.js) |
| Every correct answer recomputed independently | PASS | wrote separate Danish number/ordinal/year/clock generators: all 315 `tal` items, 60 year items (cloze + year_to_digits), 56 ordinal items, 44 date items, 432 clock items (clock phrase parsed to minutes; correct matches shown/drawn time, no option shares a meaning with the correct one) agree. 0 mismatches (2 case-only: `Første`/`Anden` at sentence start). Every non-standard distractor is an intentional wrong form (`en kroner`, `seksende`, `ellevende`, `først`, `andet`...) |
| Single defensible answer / second-valid-answer scan | PASS | no option set contains two readings of the same value; type_word skips 1 (en/et) and 2 for ordinals is only used with a gender-fixing noun |
| Content audit (sample + full programmatic) | PASS WITH ISSUES | all numbers/times/years/dates/prices verified by recomputation; notes grouped into 219 templates (digits/number words masked) and every template read - no factual error found (items 3-5 in flags are nuances, TT-1 a wording slip). Native-check flags below |
| Smoke matrix (`smoke.mjs --shots`) | PASS | 28/28 (console, h-scroll, taps, focus ring, contrast dark/light, reduced motion, localStorage blocked) |
| Functional, 3 modes | PASS | per mode via real UI: 10 items; correct auto-advances 787-814 ms (21 samples), no congratulatory text in visible text; wrong shows `Rigtigt svar:` + exactly 1 `.note` + replay button + `Videre`, stays 1.6 s without advancing (9 wrong cases incl. clock/typed); summary has score + accuracy + 3 weakest + exactly one primary `Spil igen` (+ `Gentag fejl`, `Til start`); restart and X-to-menu work. 0 console errors/warnings/failed requests |
| All 11 groups reachable and playable | PASS | Aflæs/Find/Digitalt, 0-20/21-49/Bosskamp/Hundreder, Årstal/Ordenstal/Datoer/Priser each start a round |
| Every one of 965 items rendered + answered through UI at 360 px | PASS | no h-scroll, no overflow in option/sentence, no target <44 px, console clean. Longest option 38 chars wraps |
| Analog clocks correct | PASS | for all aflæs (144) and find (144) items the SVG hand angles equal the item time and each option's `aria-label` matches its value (negative control: mutated expected time is detected) |
| Free-text variants (1567 variants through the UI) | PASS | all accepted_answers; UPPER / Capital / padded spaces / final `.` / `!` for words; prices `199 kr`, `199 KR.`, `199,-`, `199,00`, `199 kroner`; years `1.985`, `1 985`; øre `7,50`; negatives (+x, truncated, n+1) rejected; empty submit not scored |
| Persistence | PASS | `localStorage['srs:tal-og-tid'] = {items,patterns}`; item keys `tal-og-tid:<mode>:<id>` (10/10 match regex, all map to real ids, none index-based); box 1 after wrong, 2 after correct; survives reload byte-identical; next round contains the 3 missed and 0 of 7 box-2 items; mode/group prefs restored; Nulstil clears SRS only; localStorage throwing -> full round playable to summary |
| Keyboard | PASS | digit picks matching option, out-of-range ignored, Tab reaches all 5 controls with visible ring, Enter submits typed, Escape leaves round, after wrong `Videre` focused and Enter continues, no unlabelled buttons |
| Layout/contrast matrix | PASS | 360/390/820/1440 x light/dark x 10 screens (start, 4 play, 4 wrong-slip, summary): no h-scroll, no target <44 px, no text contrast <4.5 |
| Reduced motion | PASS | no running animation/transition on visible elements after wrong/correct, no `.press` pulse, no confetti on summary (motion on: confetti present); still fully playable |
| Muted mode silent | PASS | muted: 0 audio nodes created over a correct+wrong answer; unmuted control: 5 |
| æøå render | PASS (screenshots) | seen rendered in `Årstal og ordenstal`, `fødselsdag`, `Øv disse igen`; canvas glyph check in spec is weak, screenshot is the evidence |
| No fetch/XHR/CDN | PASS | grep of index.html, data.js, theme css: no fetch/XHR/@import/external src; only canonical/og/JSON-LD URLs. Opened via `file://` throughout |
| Timed mode defaults to Træning | N/A | no timed mode |
| Registration in root index.html / sitemap.xml / llms.txt | NOT DONE (expected) | `grep -c tal-og-tid` = 0 in all three; releaser/PM |
| Regression of shared/ | N/A | `shared/` unchanged by this branch (diff vs master: only tal-og-tid files, theme css, generator, report, screenshots) |

## Bugs
- [TT-1] minor · k-digital-0000 note text · repro: Klokken > Digitalt ur, item 00:00 · expected a note about midnight/24-hour reading · actual `Kl. 0 svarer til 12 på det analoge ur, så hel time: klokken + timetallet, så klokken tolv er 12:00.` (note mixes two templates and says 12:00 for a 00:00 item; same prefix on all 00:xx digital notes) · data via scripts/gen-tal-og-tid-data.js.
- [TT-2] minor (housekeeping) · branch commits 13 screenshots named `360-light-start.png`, `360-dark-slip.png` ... in `docs/redesign/screenshots/tal-og-tid/`, not the `<viewport>-<screen>.png` convention (`small|mobile|tablet|desktop-...`) and `docs/redesign/reports/tal-og-tid.md` in the worktree is a design note; QA report is therefore saved as `tal-og-tid-qa.md`.
- No functional, layout, a11y, persistence or console defects found.

## Content flags (native check; none is a clear error)
1. **Clock `tyve over X` (X:20) and `tyve i X` (X:40)** - 72 items: every `k-*-HH20` and `k-*-HH40` (pattern min-20 / min-40, 36 each). Traditional spoken Danish for these is `ti i halv X` / `ti over halv X`; `tyve over/tyve i` is used but is it the single accepted form? Learners who know `ti i halv` are marked wrong (the options never contain both, so no ambiguity inside an item).
2. **Regent ordinal capitalisation** - `a-ordenstal-saetning-kongen-hedder-frederik-den-tiende`, `...christian-den-tiende-var-konge-fra-1912-til-1947`, `...dronning-margrethe-den-anden-blev-foedt-i-1940`: correct word shown lower-case (`den tiende`); royal-name convention may be `den Tiende`.
3. `a-dato-05-05` "Danmarks befrielse markeres den femte maj" - usually evening of 4 May plus 5 May; defensible only because the `show` field gives 5. maj.
4. `a-aarstal-1973` "Danmark blev medlem af EU i 1973" - was EF then; fine as shorthand?
5. Digital times are shown `13:05` (colon); Danish convention is often `13.05`. And 24 h -> 12 h spoken form (`13:05` = `fem over et`) is a design choice, not the formal 24 h reading.
6. All 76 `verify: true` items (all 60 year items, 31. / 30. ordinals and dates, all øre prices): my independent generator agrees with every form; remaining need is native confirmation of conventions only (e.g. `totusind og sytten`, `tredivte`, `enogtredivte`, `halvtreds øre`).
7. Notes use absolute wording in places (`Årstal efter 2000 siges som "totusind og ..."`, `Årstal før 2000 siges i hundreder`); `tyve-sytten`-style readings exist informally.

## Not covered
- Native-speaker judgement of any Danish (flags above).
- Real TTS output/quality (only that the replay button exists); screen reader.
- Whether `scripts/gen-tal-og-tid-data.js` regenerates data.js byte-identically (not run, would overwrite game data).
- Cross-game link (`en-og-et`) target correctness beyond href presence; real touch devices.
- Retest cycle: this was the first test of this commit; nothing retested.

---

# Retest cycle 1 - 547dea6364d4df4b204e988cd1035ecfa26c9953

Verdict: PASS (TT-1 fixed; flag 1 and 2 resolved in data; native flags 3-7 remain)
Tested: task/tal-og-tid@547dea6364d4df4b204e988cd1035ecfa26c9953 (index.html and shared/ unchanged since fde2633; data.js, generator, tests changed)

| Check | Result | Evidence |
|---|---|---|
| Data structure + independent recomputation | PASS | 965 items; klokken A1 60 / A2 228 / B1 144; my clock parser agrees with all 432 (x:20 = `ti i halv X`, x:40 = `ti over halv X`), no option shares the correct meaning; numbers/years/ordinals unchanged and still match; 0 duplicates |
| TT-1 midnight notes | PASS | `k-digital-0000`: "Kl. 00 er midnat og står som 12 på det analoge ur. Hel time: ... klokken tolv er 00:00." |
| Flag 1 (tyve over/i) | RESOLVED | primary answers now `ti i halv X`/`ti over halv X`; 72 items carry `alt_phrases` (`tyve over/i X`), none appear as options. Note: `alt_phrases` is data only - the game never reads it; no impact |
| Flag 2 (regent capitals) | RESOLVED | `Tiende`, `Anden` (3 items) |
| Full spec, run 1 | PASS | 73/73 |
| bulk + typed repeated, runs 2 and 3 | PASS | 12/12 each (every one of 965 items at 360 px; 1567 typed variants) |
| Smoke | PASS | all green |

## The reported "flake" (bulk 144/432 klokken seen, typed section failing) was a harness defect, not a game flake
- Cause: every puppeteer page on `file://` shares one localStorage. The `func` section's group-sweep leaves the last chosen group saved (`tal-og-tid:group:<mode>`), and the next section (bulk/typed) inherited it. Numbers reproduce exactly: klokken 144 = group *Digitalt ur*, tal 17 = *Hundreder*, aarstal 58 = *Priser*. The typed section then hit an empty pool (Hundreder has no typed items): the game correctly showed its "Der er ingen opgaver" empty state, which my oracle read as `no marker`. Observed once in my own combined run and once by the coder, both when `func` preceded the later sections; every section passes when run alone.
- Fix (in `tests/tal-og-tid.mjs`, main repo): each page gets its own browser context. Evidence after fix: full spec 73/73, then bulk+typed twice more 12/12 and 12/12 (3 consecutive green runs, 0 flakes).
- The branch's committed copy of `tests/tal-og-tid.mjs` is the pre-fix version and will still fail when run as a full combined spec; copy `tests/tal-og-tid.mjs` from the main repo (or the PM merges mine).
- Harness note: two overlapping background runs also killed each other's Chrome ("Target closed"); that was my own scheduling mistake, not the game.

Not covered (unchanged): native judgement of Danish, real TTS, screen reader.

---

# Retest cycle 2 (branch tip) - fa0c0fc

Tested: task/tal-og-tid@fa0c0fc1d398d935033c32a04f61690a26a46993 (HEAD re-checked after the run, worktree clean)
Verdict: PASS

Changes since 547dea6: committed spec + QA appendix, portal registration (index.html card + GAMES entry, llms.txt, sitemap.xml, build-dist.sh DIRS).

| Check | Result | Evidence |
|---|---|---|
| Full spec (committed tests/tal-og-tid.mjs) | PASS | 73/73, exit 0; smoke exit 0 |
| Root portal loads, zero console errors | PASS | worktree tree and built dist, 360 and 1440 px, light and dark: 0 issues, no h-scroll, 15 cards incl. Tal og tid, card visible, no small tap target in the card |
| Card links to the game | PASS | click on `./tal-og-tid/index.html` card at 360 px lands on `tal-og-tid/index.html`, title "Tal og tid på dansk …", `#btn-play` present, 0 issues (tree and dist) |
| Card visual | PASS | screenshot `docs/redesign/screenshots/tal-og-tid/portal-card-small.png` viewed: stopur sprite, title, tag Tal, A1-B1, description, Spil button |
| sitemap.xml | PASS | XML parses; 29 `<url>`, 29 `<loc>` unique; new entry `https://sjovtdansk.dk/tal-og-tid/index.html` |
| llms.txt | PASS | entry added with matching URL |
| build-dist.sh | PASS | `bash -n` OK; run in a `git archive` copy under scratchpad (repo untouched): "dist ready: 118 files", `dist/tal-og-tid/{index.html,data.js}` and `dist/shared/themes/tal-og-tid.css` present, 3 manifest entries |

Observations (not caused by this change): portal has one contrast item `TRYK START` (1.62:1), identical on master; the portal search box did not filter cards in my quick test on either master or the branch (not investigated). `build-dist.sh` was not run in the repo itself.

---

# Retest cycle 3 (after merge of origin/master) - 42d5502

Tested: task/tal-og-tid@42d5502eb3c6b5528469560302318dfab3a7113b (HEAD unchanged after the run; only releaser agent-memory files dirty in the worktree, none of them game files)
Verdict: PASS

| Check | Result | Evidence |
|---|---|---|
| No conflict markers | PASS | `git grep` for `<<<<<<<`, `=======`, `>>>>>>>` over all tracked non-PNG files: none |
| Portal, both cards | PASS | tree and built dist, 360/1440 px, light/dark: 16 cards, `Tal og tid` and `Læseforståelse` both visible, no h-scroll, 0 console issues |
| Both cards link and games open | PASS | clicks land on `tal-og-tid/index.html` and `laeseforstaaelse/index.html` (tree and dist), titles correct, buttons render, 0 console issues |
| sitemap.xml | PASS | parses; 30 `<loc>`, no duplicates; both entries present |
| llms.txt | PASS | both entries present (1 each) |
| build-dist.sh | PASS | `bash -n` OK; throwaway `git archive` copy: "dist ready: 126 files", both dirs in dist, 8 manifest entries under the two dirs |
| Spec (tests/tal-og-tid.mjs) | PASS | 73/73, exit 0 |

Not covered: Læseforståelse itself beyond opening it (another task's scope).

---

# Retest cycle 4 (merge of cb53f74) - f1831f0

Tested: task/tal-og-tid@f1831f0cd0cd6a2eaf86637995ab4bb420b07b8f
Verdict: PASS

- `git diff 42d5502 f1831f0 --stat`: only `index.html`, 1 insertion: `<!-- <meta name="google-site-verification" content="REPLACE_WITH_TOKEN"> -->` (an HTML comment, inert).
- Portal (tree and throwaway dist, 360/1440, light/dark): 16 cards, Tal og tid and Læseforståelse visible, 0 console issues, no h-scroll; both cards open their games, 0 issues.
- sitemap.xml parses, 0 duplicate locs; no conflict markers; build-dist copy "dist ready: 126 files".
- tests/tal-og-tid.mjs: 73/73, exit 0. HEAD unchanged after the run.
