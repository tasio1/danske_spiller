---
name: conditional-slot-multiword-word-order
description: tidsmaskinen conditional slots are literal string substitution; multi-word accepted answers (vil tage) break V2 when the blank precedes the subject
metadata:
  type: feedback
---

When auditing an `accepted_answers` addition in tidsmaskinen conditional slots, render the full sentence for EVERY accepted answer (engine does a literal `sentence.replace(/_{2,}/, display)`, index.html ~line 418).

**Why:** `hvis-du-ikke-kommer-til-tiden-tager-vi-uden-dig` got "vil tage"/"vil gå" added to slot 2 of "Hvis ..., ___ vi uden dig." -> "vil tage vi uden dig" (ungrammatical; needs "vil vi tage uden dig"). A reading of the note/grammar rule alone says "correct"; only rendering the sentence exposes it. The sibling item "Vi ___ hjemme" is fine because the subject precedes the blank.

**How to apply:** for any slot with a multi-word answer, check where the blank sits relative to the subject (inverted main clause after a fronted hvis/når clause = infinitive must follow the subject). Script it: loop accepted answers, print rendered sentences.
