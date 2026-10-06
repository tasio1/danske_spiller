# art-cykelsti — fact sheet
topic: Cykelsuperstier i hovedstadsregionen og kampen om pladsen | genre: forklaring | researched: 2026-10-06 | author: laese-facts-d

Method note: WebFetch returns a model-extracted answer, not raw HTML. For the kk.dk PDF (F7-F9) the downloaded PDF was text-extracted with pdftotext and the quotes copied from that text. The checker should re-match each quote on the page.

## Facts
F1 | I 2024 var der 244 km supercykelsti fordelt på 16 ruter. | "I 2024 har Supercykelstisamarbejdet 244 km etableret supercykelsti fordelt på 16 ruter" | https://supercykelstier.dk/blog/pressemeddelelse/supercykelstierne-virker-87-stigning-i-snit-paa-regionale-cykelpendlerruter-i-2024/ | read: FETCHED | status: AUTHOR-READ
F2 | Cyklisttallet steg i gennemsnit 87 % på de 16 ruter, målt fra førmålingerne til tællingerne i 2024. | "fra de 16 ruters respektive førmålinger til cykeltællingerne i 2024 er der målt en gennemsnitlig stigning på 87 %" | (same URL as F1) | read: FETCHED | status: AUTHOR-READ
F3 | 14 % af de nye cyklister tog før bilen; en gennemsnitlig tur på en supercykelsti er 12 km. | "14 % af de nye cyklister tog før bilen" (same page, separate line: "Den gennemsnitlige turlængde på supercykelstierne er 12 km pr. tur") | (same URL as F1) | read: FETCHED | status: AUTHOR-READ
F4 | Danmarks første cykelsupersti er Albertslundruten (C99), åbnet lørdag den 14. april 2012; den går gennem Albertslund, Glostrup, Rødovre, Frederiksberg og København. | "Albertslundruten er Danmarks første cykelsupersti" | https://www.mynewsdesk.com/dk/albertslund-kommune/news/albertslundruten-er-danmarks-foerste-cykelsupersti-38368 | read: FETCHED | status: AUTHOR-READ
F5 | Albertslundruten er 17,5 km lang ifølge kommunens pressemeddelelse; supercykelstier.dk oplyser 18 km og lanceringsår 2012. | "2012 lanceringsår" (fetch extract of the route page; length "18 km") | https://supercykelstier.dk/rute/albertslundruten/ | read: FETCHED | status: AUTHOR-READ
F6 | Cykelslangen blev indviet sommeren 2014; broen er 230 m lang og går fra Dybbølsbro til Havneholmen som fortsættelse af Bryggebroen. | "Broen blev indviet sommeren 2014" | https://lex.dk/Cykelslangen | read: FETCHED | status: AUTHOR-READ
F7 | I 2025 blev 43 % af turene til arbejde og uddannelse i København foretaget på cykel, mod 46 % i 2024; målet i cykelstrategien var 50 % i 2025. | "Således blev 43 % af turene til arbejde og uddannelse foretaget på cykel i 2025 mod 46 % i 2024." | https://byudvikling.kk.dk/sites/default/files/2026-07/Mobilitetsredeg%C3%B8relse%202026_opt-a.pdf | read: FETCHED | status: AUTHOR-READ
F8 | Pladsen mellem husene i København er delt sådan: kørebaner 49 %, fodgængerarealer 32 %, cykelstier og cykelbaner 6 % (plus 4 % cykel- og gangstier), bilparkering 8 %, cykelparkering 1 %. | "Af det samlede areal mellem byens huse, hvor fx parker og grønne områder er taget ud af beregningen, udgør kørebaner 49 %." | (same URL as F7) | read: FETCHED | status: AUTHOR-READ
F9 | I 2025 var der 401 km cykelsti i København, heraf 64 km supercykelsti. | "I 2025 var der 401 km cykelsti i København. Heraf er der 66 km Grønne Ruter og 64 km supercykelsti." | (same URL as F7) | read: FETCHED | status: AUTHOR-READ
F10 | Samarbejdet mellem 27 kommuner og regionen sigter mod over 60 ruter og over 850 km. | "60+ routes" / "850+ km" / "27 municipalities" (list items on the English page) | https://supercykelstier.dk/english/ | read: FETCHED | status: AUTHOR-READ

Relationships for cloze: Albertslundruten 2012 -> 16 ruter og 244 km i 2024 (tid); flere cyklister på ruterne (+87 %) -> 14 % af de nye cyklister tog før bilen (konsekvens); målet var 50 %, men resultatet blev 43 % (kontrast, F7); biler og kørebaner 49 % af pladsen, cykelstier og cykelbaner 6 % (kontrast, F8); Cykelslangen er bygget i forlængelse af Bryggebroen (præcisering, F6).

## Conflicts and caveats
- Commuter share: 43 % (2025) and 46 % (2024) are for trips to work and education IN Copenhagen. The same report gives other figures for Copenhageners' own trips: 47 % cycled in 2025 for work/education, 55 % for those who also work/study in the municipality, 31 % for all trips. Do not mix them; write "43 % af turene til arbejde og uddannelse i København i 2025".
- Network size: 16 routes / 244 km (2024, supercykelstier.dk); the kk.dk 2025 table also gives 244 km for Region Hovedstaden (177 km in 2021, table row; checker should confirm in the PDF). Search snippets (not fetched) mention 220 km and "28 planned routes, 300 km"; do not use. Vision "60+ routes, 850+ km" has no target year on the fetched page (a snippet said 2045; unconfirmed). Municipality count: 27 on supercykelstier.dk English page; a snippet said 21 municipalities have routes.
- Albertslundruten length: 17,5 km (press release) vs 18 km (supercykelstier.dk).
- Cykelslangen length: lex.dk 230 m (caption says 235 m); other snippets 220 m. Use 230 m with lex.dk or leave out.
- Names: "cykelsuperstier" and "supercykelstier" are both in use; the official brand is "Supercykelstier".

## UNCONFIRMED
- Cyklistforbundet's claim that cyclists have 7 % of the street space (search snippet only; F8 from kk.dk replaces it).
- A Region Hovedstaden page with the route count (the supercykelstier.dk secretariat page is used instead).
- The target year of the 850 km vision.
- A named source for pedestrian-versus-cyclist conflict on the same pavement (only the area shares in F8 were found).

## Sources
- https://supercykelstier.dk/blog/pressemeddelelse/supercykelstierne-virker-87-stigning-i-snit-paa-regionale-cykelpendlerruter-i-2024/ (FETCHED)
- https://www.mynewsdesk.com/dk/albertslund-kommune/news/albertslundruten-er-danmarks-foerste-cykelsupersti-38368 (FETCHED)
- https://supercykelstier.dk/rute/albertslundruten/ (FETCHED)
- https://lex.dk/Cykelslangen (FETCHED)
- https://byudvikling.kk.dk/sites/default/files/2026-07/Mobilitetsredeg%C3%B8relse%202026_opt-a.pdf (FETCHED, text-extracted)
- https://supercykelstier.dk/english/ (FETCHED)
