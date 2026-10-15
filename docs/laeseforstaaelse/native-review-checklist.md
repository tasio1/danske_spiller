# Native-speaker review — Læseforståelse

Every text in `laeseforstaaelse/data-*.js` carries `verify: true`: the Danish was written by an AI agent, checked against fact sheets and audited by an independent tester, but **no native speaker has read it yet**. This list says where to look first. Tick a line when you have read the text aloud and are happy with it, or write the correction next to it. When a text is approved, its `verify: true` is removed in the same change.

How to read: open `laeseforstaaelse/index.html` in a browser (works from disk), pick the mode and play the text, or read the strings in the data file. For cloze, check that **exactly one** of the four options is defensible in each gap. For insert, check that each block fits only its own gap.

## Questions for every text
- Does it sound like Danish a Dane would write, or like translated or machine-written text?
- Is the level right (B1 or B2)?
- Any sentence that says more than the facts allow, or that sounds like a template (many sentences repeat "Tallet gælder kun … og viser ikke …")?

## Mode: Læs og vælg (mc) — `data-mc.js`
- [ ] `art-ulven` (B2) — whole text; paragraph 7 "Ulven er altså stadig beskyttet"; paragraph 3 compares "opgjort" (57, 91) with "registreret" (239).
- [ ] `art-dialekter` (B2) — whole text; tense and wording in paragraphs 1–3 ("Sprogforskeren formodede …").
- [ ] `art-efterskole` (B1) — whole text; "højeste andel i Efterskolernes ti-årige opgørelse"; the three questions.

## Mode: Find oplysningen (skim) — `data-skim.js`
- [ ] `haefte-kolonihave` — rules wording in notices n02, n03, n06 (slangetid, hækkeregler, kompost); n09 (`60 m²`, `erstatter en byggetilladelse`, 14/21 dage); questions q12 and q14.
- [ ] `haefte-rebildfest` — notices n03, n06, n09 (`tegnsprogstolk`, `vagtleder`, `ventehuset`); n10 (`er over 100 år gammelt`, `mere end fordoblet arealet`).
- [ ] Do the accepted answers (about 530 variants) cover what a learner would reasonably type?

## Mode: Sæt afsnittet ind (insert) — `data-insert.js`
- [ ] `art-samsoe` — whole text; P2 "Indtil november 2018 …" next to the hedge "Om overdragelsen blev gennemført, siger kilderne ikke"; block b6 tense.
- [ ] `art-madspild` — whole text; block b2 uses "1/3-reglen" without explaining it.
- [ ] For each gap: does only the intended block fit? (Second fits that are closed only by elimination: samsø b1 at g3; madspild b2 at g5, b4 at g4, b5 at g4.)

## Mode: Det manglende ord (cloze) — `data-cloze.js`
- [ ] `art-bakken` — c5: `imidlertid` (correct) vs `desuden`; c2 `nemlig`.
- [ ] `art-cykelsti` — c3: `Desuden` (correct) vs `Derfor`; c6: `dog` (correct) vs `tværtimod`.
- [ ] `art-gaekkebrev` — c2 `Derfor` (correct) vs `Dog`; "Med andre ord" introducing an example reads slightly stiff; paragraph 4 defines "regel" as something you must follow, while the egg custom is later called "en udbredt regel".
- [ ] Do the short definitions in the cloze articles ("En pendler er …", "Et vers er et kort digt") read naturally, or childlike?

## Known and accepted (do not need a verdict)
- Six articles are shorter than the 1.2 normalsider target (dialekter, efterskole, samsø, madspild, bakken, cykelsti): the confirmed facts ran out and padding was refused.
- Practical details in the two booklets (times, prices, rules, programme) are invented exercise values and the page says so.
- The Eksamenstilstand sitting (all four parts in one go) is not built yet.

## Where to record the result
Edit this file, or comment on the pull request. A text with corrections gets a follow-up commit changing the data file; a text that is fine gets `verify: true` removed.
