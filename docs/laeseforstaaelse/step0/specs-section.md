# Spec section for Læseforståelse — for the user to add to `specs.md` and `improvement/specs.md`

Agents may not edit `specs.md` or `prd.md`. Review the scope boundary (the first bullet below is the point that needs your decision), then paste the block into `specs.md` under "New Games", and the longer design reference stays in `docs/superpowers/plans/2026-10-06-laeseforstaaelse.md`.

**Decision needed:** the `cloze` mode (connectors and adverbs gapped in a 1.5-page text) sits next to Konjunktion Crush ("do not create another conjunction cloze game"), Forbindeord ("do not create another connector game") and Adverbier og bindeord ("do not create another general adverb game"). The boundary below says those games drill isolated sentences and this one tests cohesion inside a continuous text. If you consider that the same game, delete mode 4 and keep three modes.

```
### laeseforstaaelse
- **Folder:** `laeseforstaaelse/`
- **Files:** `index.html`, `data.js` (registry), `data-skim.js`, `data-mc.js`, `data-insert.js`, `data-cloze.js`
- **Game ID:** `laeseforstaaelse`
- **Status:** Planned
- **Levels:** B1–B2
- **Domain:** Reading comprehension in the format of Prøve i Dansk 3, over original Danish texts about Denmark
- **Scope boundary:** Skrivekontrollen tests writing (error correction); this game tests reading. Konjunktion Crush, Forbindeord and Adverbier og bindeord drill connectors on isolated sentences; here connector and adverb choice is tested only inside a continuous 1.5-page text (cohesion), scored per connector type. Not an official exam and never presented as one.
- **Modes (4 + sitting):**
  1. Find oplysningen — hæfte of 8–10 short notices, 15 short-answer questions (30 s per question guidance)
  2. Læs og vælg — one article, 3 multiple-choice questions, 3 options
  3. Sæt afsnittet ind — 5 removed paragraphs, 7 offered, 2 distractors
  4. Det manglende ord — 8 connector/adverb gaps, 4 options
  5. Eksamenstilstand — modes 1–4 in order, 25 + 65 minute budget; Træning is the default
- **Content rules:** all texts newly written; no invented people, no quotation marks, no `siger X`; every figure traceable to a source recorded in `sources[]`; footer "Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se kilder."; one defensible answer per question; hæfte practical details are exercise values
- **Item targets:** phase 1 = 2 hæfter, 3 mc, 2 insert, 3 cloze (10 texts, ~70 items); phase 2 = 6 / 5 / 4 / 5 (20 texts, 165 items)
- **Layout:** split reader — scrollable text pane plus question pane, both independent (≥1024 px and tablet landscape), docked collapsible panel below on narrow screens; 60–75 characters per line; text-size control; paper light/sepia/dark; margin paragraph numbers; the text is never covered by feedback
- **Visual theme:** newsprint reading room; paper #F4F0E6, ink #1E1C1A, highlighter #E0B43C, accent #2F6F6B (check against Skrivekontrollen's paper and proof red)
- **Full spec:** `docs/superpowers/plans/2026-10-06-laeseforstaaelse.md` (design reference)
```

Also add a one-line entry to the `Existing/New Games` list in `improvement/specs.md` § 1 so the new game is excluded from "missing games" scope checks.
