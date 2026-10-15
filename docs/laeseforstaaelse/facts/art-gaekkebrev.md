# art-gaekkebrev — fact sheet
topic: Gækkebrevet, den danske påsketradition | genre: baggrund | researched: 2026-10-06 | author: laese-facts-d

Method note: WebFetch returns a model-extracted answer, not raw HTML; quotes are copied from those extracts and should be re-matched by the checker. The natmus.dk page tried returned only a menu, so lex.dk, Bo Bedre and Kristendom.dk are used instead; no museum source was reached.

## Facts
F1 | Et gækkebrev er et klippet og pyntet brev med et lille vers og eventuelt en blomst. | "Et gækkebrev er et fantasifuldt klippet og dekoreret brev med et lille vers samt evt. en indlagt blomst." | https://lex.dk/g%C3%A6kkebrev | read: FETCHED | status: CONFIRMED | verified: 2026-10-06 by laese-facts-verify-2 | how: curl | note: lex.dk raw sentence matches exactly.
F2 | Afsenderen er anonym eller skriver sit navn med prikker eller andre tegn. | "Enten er brevet sendt helt anonymt, eller også har afsenderen angivet sit navn med prikker eller andre tegn" | https://lex.dk/g%C3%A6kkebrev | read: FETCHED | status: CONFIRMED | verified: 2026-10-06 by laese-facts-verify-2 | how: curl | note: lex.dk raw sentence matches exactly (same paragraph as F1).
F3 | Det første kendte gækkebrev er fra 1770. | "det første gækkebrev, man kender til, er fra 1770" | https://bobedre.dk/paaske/hvorfor-sender-vi-gaekkebreve | read: FETCHED | status: CONFIRMED | verified: 2026-10-06 by laese-facts-verify-2 | how: curl | note: bobedre.dk raw: "det første gækkebrev, man kender til, er fra 1770". da.wikipedia raw: "Det ældste bevarede gækkebrev blev sendt til Maria Christiane Hansdatter i Odense i 1770"; kristendom.dk: "det ældste gækkebrev er fra 1770". Three sources agree; say "det ældste kendte/bevarede", not start of the tradition. lex.dk only says "slutningen af 1700-tallet".
F4 | Gækkebrevets forløber er bindebrevet, som kom fra Tyskland. | "Gækkebrevets forløber er 'bindebrevet', der stammer fra Tyskland." | https://www.kristendom.dk/liv-sjael/fem-vigtige-ting-om-gaekkebrevet | read: FETCHED | status: CONFIRMED | verified: 2026-10-06 by laese-facts-verify-2 | how: curl | note: kristendom.dk raw sentence matches exactly; lex.dk raw: "det tyske bindebrev, som vi kender fra 1600-tallets Danmark".
F5 | Man lægger traditionelt en vintergæk i det klippede brev. | "Der er tradition for at vedlægge en vintergæk sammen med det sirligt klippede brev." | https://www.kristendom.dk/liv-sjael/fem-vigtige-ting-om-gaekkebrevet | read: FETCHED | status: CONFIRMED | verified: 2026-10-06 by laese-facts-verify-2 | how: curl | note: kristendom.dk raw sentence matches exactly.
F6 | Man skriver navnet med én prik for hvert bogstav. | "man skriver sit navn med prikker – én prik for hvert bogstav" | https://bobedre.dk/paaske/hvorfor-sender-vi-gaekkebreve | read: FETCHED | status: CONFIRMED | verified: 2026-10-06 by laese-facts-verify-2 | how: curl | note: bobedre.dk raw: "Som ledetråd afslutter man brevet med at skrive sit navn med prikker - én prik for hvert bogstav." (quote in line is a near-exact reordering).
F7 | Reglen: bliver man gættet, skylder man modtageren et påskeæg; bliver man ikke gættet, eller gættes der forkert, skylder modtageren afsenderen et påskeæg. | "Bliver man gættet som afsender af gækkebrevet, skylder man modtageren et påskeæg. Bliver man ikke gættet – eller bliver der gættet forkert – er det modtageren af brevet, der skylder afsenderen et påskeæg" | https://bobedre.dk/paaske/hvorfor-sender-vi-gaekkebreve | read: FETCHED | status: CONFIRMED | verified: 2026-10-06 by laese-facts-verify-2 | how: curl | note: bobedre.dk raw sentences match verbatim. da.wikipedia differs: "Hvis det ikke gættes første gang, skylder modtageren afsenderen et påskeæg" plus an alternative "for hvert fejlgæt" rule. Say "ifølge en udbredt regel"; the guessed-case sentence rests on bobedre.dk alone.
F8 | Brevet skal ifølge traditionen gættes inden palmesøndag, hvor påsken officielt begynder. | "Der er tradition for, at det skal være inden Palmesøndag, hvor påsken officielt begynder." | https://www.kristendom.dk/liv-sjael/fem-vigtige-ting-om-gaekkebrevet | read: FETCHED | status: CONFIRMED | verified: 2026-10-06 by laese-facts-verify-2 | how: curl | note: kristendom.dk raw: "Der findes ingen regler for, hvornår man skal have gættet ... men der er tradition for, at det skal være inden Palmesøndag, hvor påsken officielt begynder." So a tradition, not a rule. No museum text found (natmus.dk and danskkulturarv.dk reachable, no gækkebrev content).

Relationships for cloze: bindebrev (kendt i 1600-tallet) -> gækkebrev (første kendte 1770) (tid); gættet -> afsenderen skylder et æg, ikke gættet -> modtageren skylder (kontrast, F7); brevet skal gættes inden palmesøndag, hvor påsken begynder (tid, F8); navn med prikker giver et lille fingerpeg uden at afsløre afsenderen (præcisering, F2+F6).

## Conflicts and caveats
- Egg rule differs by source: bobedre.dk (F7) vs da.wikipedia (fetch extract: "Hvis det ikke gættes første gang, skylder modtageren afsenderen et påskeæg. En anden tradition: For hvert fejlgæt, skylder modtageren afsenderen et påskeæg."). The two agree on the not-guessed case; only F7 states the guessed case. Write "ifølge en udbredt regel".
- Age: 1770 is the oldest KNOWN gækkebrev (bobedre.dk), not the start of the tradition. lex.dk (fetch extract, paraphrased) says only that the oldest preserved examples are from the late 1700s and that the bindebrev was known in Denmark in the 1600s; that "1600s" detail is not a verbatim-quoted fact here.
- The fetch tool returned paraphrases (no verbatim sentence) of lex.dk on: the vintergæk blooming despite frost and tricking people, eggs in the 1800s (boiled decorated eggs, later sugar/chocolate eggs), and "sent at Easter". These are therefore NOT in Facts. Its English wording "winter aconite" for vintergæk is the tool's wording; Danish vintergæk is the snowdrop. Do not name a Latin species.
- Search snippets (not fetched) claim the letter is sent "in the weeks before Easter" while the first snowdrops appear; unverified.

## UNCONFIRMED
- A museum source (Nationalmuseet, danskkulturarv.dk): not reached.
- Verbatim sentence for the snowdrop connection ("gæk" = narre; the flower fools people into thinking winter is over); only the vintergæk-in-the-letter convention (F5) is confirmed.
- Verbatim "sent at Easter / when sent" sentence other than F8 (palmesøndag deadline); the exact sending window.
- Verbatim sentence for the 1800s egg history.

## Sources
- https://lex.dk/g%C3%A6kkebrev (FETCHED)
- https://bobedre.dk/paaske/hvorfor-sender-vi-gaekkebreve (FETCHED)
- https://www.kristendom.dk/liv-sjael/fem-vigtige-ting-om-gaekkebrevet (FETCHED)
- https://da.wikipedia.org/wiki/G%C3%A6kkebrev (FETCHED; caveats only)
