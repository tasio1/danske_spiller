---
name: laese-text-authoring
description: Rules for writing and auditing the reading texts of Læseforståelse (laeseforstaaelse/data-*.js) — original B1–B2 Danish about Denmark, no invented people or quotes, every figure traceable to a fact sheet. Use when authoring or reviewing texts, hæfter, questions or gaps for that game. Not for grammar-game data (use danish-grammar-qa).
---

# Writing Læseforståelse texts

A learner trains for the reading part of Prøve i Dansk 3. A text that sounds machine-written teaches the wrong ear, and a wrong figure teaches a wrong fact. Both are product bugs.

## 1. Write from the fact sheet only

Each text has a fact sheet in `docs/laeseforstaaelse/facts/<id>.md`: facts with the verbatim source sentence, URL, fetch date and a `CONFIRMED` / `CHANGED` / `UNCONFIRMED` mark from an independent checker.

- Use only `CONFIRMED` facts. Leave out anything else; never guess a number.
- Do not open the source pages while writing. Facts are free to reuse, wording is not: no sentence may be copied or closely paraphrased from DR, Politiken, Kristeligt Dagblad, Wikipedia or any other source.
- Copy each text's `sources[]` from its fact sheet.

## 2. No invented people, no quotes

Write as plain explanation: forklaring, baggrund, reportage uden interviewede, overblik over holdninger.

- No named fictional persons, no anførselstegn, no `siger X`, no author byline.
- A debate is described as positions held by broad, documented groups (*fåreavlere*, *biologer*, *landbrugsorganisationerne*), only where the fact sheet supports it.
- Real organisations may be named in factual statements (what they do, when they were founded), never as the speaker of anything.
- Every text renders: `Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se kilder.`
- Hæfte practical details (opening times, prices) are exercise values and must never look like real current prices.

## 3. Banned phrases (machine-writing signals)

The validator fails on these.

- Openings: `I dag er`, `I dag står`, `I en verden hvor`, `Mere end nogensinde`, `Det er ingen hemmelighed`, `Når man taler om`, `Gennem tiderne`
- Endings: `Sammenfattende`, `Alt i alt kan man sige`, `Kun tiden vil vise`, `Én ting er sikkert`, `Det store spørgsmål er`, `Fremtiden vil vise`
- Filler: `Det er vigtigt at bemærke`, `Det er værd at nævne`, `spiller en afgørende rolle`, `en central del af`, `i takt med at samfundet`
- Capped at one per text: `Derudover`, `Endvidere`, `Ligeledes`
- Patterns: a triple list in every second paragraph; all paragraphs the same length; every sentence opening with a connector; a dash-summary at the end of a paragraph.

## 4. Articles (modes mc, insert, cloze)

1. At least four concrete facts (a figure, a year, a place, an amount, an organisation), all in `sources`.
2. Exactly one disagreement or trade-off, described as group positions.
3. Concrete language: actions and things, not abstract nouns (*Staten betaler for hegnet*, not *der sker en finansiering*).
4. Sentence length varies: at least one sentence of 6 words or fewer and one of 25 or more.
5. Paragraph length varies: not all within ±15 % of each other; at least 4 paragraphs; 1.2–2.8 normalsider (1 normalside = 2.400 characters).
6. A `kicker` of the form `Overblik · Natur` (genre `forklaring` | `reportage` | `overblik` | `baggrund`, then topic).

## 5. Hæfter (mode skim)

1. 8–10 notices of 1.200–1.800 characters each.
2. Practical register: imperatives, times, dates, prices, telephone numbers.
3. Every notice holds at least two look-up-able facts.
4. At least three near-miss pairs across notices (two opening times, two deadlines, two prices) so the learner must read for the right place — that is the point of delprøve 1.
5. One theme, but not one continuous text.

## 6. Level

- **B1:** main clauses and simple subordinate clauses, frequent words, 10–15 words per sentence on average.
- **B2:** more subordinate clauses, abstract nouns, passive, impersonal constructions, 15–22 words per sentence.

Level belongs to the text, not the question.

## 7. Questions and gaps — one defensible answer

See `danish-grammar-qa`.

- **skim:** the answer sits verbatim in one notice; `accepted[]` lists reasonable variants (`efter kl. 20`, `efter klokken 20`).
- **mc:** the two wrong options are wrong for a reason: one repeats the text with a wrong detail, one is true but does not answer the question.
- **insert:** each paragraph is placeable from a cohesion signal across the gap (a referring word, a time marker, a contrast); the two distractors fit the topic but break cohesion.
- **cloze:** target connectors and adverbs; each gap has a `type` (`kontrast`, `konsekvens`, `praecisering`, `tilfoejelse`, `tid`); all four options are grammatically possible in the slot, so the choice is about meaning. Gap markers `{{1}}`…`{{8}}` appear in order, once each, inside `paragraphs`.

## 8. Calibration text (the bar)

> **Hvem skal betale for ulven?** · *Overblik · Natur*
>
> Ulven er tilbage. Det koster penge.
>
> I 2023 registrerede myndighederne 57 ulveangreb på husdyr, i 2024 var tallet 91, og i 2025 steg det til 239. Der blev udbetalt erstatning for 1.285 dræbte dyr, langt de fleste af dem får, og staten brugte mindst 36 millioner kroner på erstatninger og på tilskud til ulvesikre hegn.
>
> Tallene skal ses ved siden af bestanden. Den seneste overvågning fandt syv flokke, tre par og en enlig han. Regner man med syv ulve i hver flok, svarer det til omkring 49 dyr. Det er ikke en optælling, men et skøn.
>
> Fåreavlere oplever angrebene som en belastning, der ikke kan måles i kroner alene, fordi erstatningen hverken dækker vedligeholdelse af hegn eller den frygt, et angreb kan sætte i gang.
>
> Biologer peger på, at ulven er fredet i hele EU. Det betyder, at Danmark ikke bare kan beslutte at skyde den.
>
> Landbrugets organisationer vil have en plan. De spørger, hvor mange ulve Danmark skal have, og hvem der skal bestemme det.

Why it works: eight concrete figures, one trade-off as group positions, no people and no quotes, a 3-word sentence beside a 29-word one, no banned phrase, paragraphs of very different length. Its figures come from planning-stage searches and must be re-confirmed on the fact sheet before this text is shipped; the EU-protection sentence in particular is not yet backed by a fetched source.
