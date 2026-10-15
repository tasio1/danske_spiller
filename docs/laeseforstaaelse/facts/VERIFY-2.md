# VERIFY-2 - independent check of five fact sheets

Verified 2026-10-06 by laese-facts-verify-2. Every source was fetched raw with curl (browser user agent), tags stripped, then searched for the figure and the quoted sentence. The kk.dk PDF was read with pdftotext. WebFetch was not used. Only the energiakademiet.dk pages (HTTP 455) and natmus.dk/danskkulturarv.dk (reachable, no gækkebrev content) could not be used.

Totals: 49 CONFIRMED, 1 CHANGED, 1 UNCONFIRMED. "CONFIRMED" often carries a scope condition; the conditions are in "Safe to use" below and in each line's note.

## art-bakken

| Fact | status | how | note |
|---|---|---|---|
| F1 | CONFIRMED | curl | 1583 is "ifølge traditionen" (lex.dk); sagn, not archive |
| F2 | CONFIRMED | curl | en.wikipedia, verbatim |
| F3 | CONFIRMED | curl | Wikipedia superlative, attribute; 1583 = legend date |
| F4 | CONFIRMED | curl | da.wikipedia |
| F5 | CONFIRMED | curl | bakken.dk "altid gratis entré"; no start year |
| F6 | CONFIRMED | curl | 1756 = Dyrehaven open to all, not Bakken |
| F7 | CONFIRMED | curl | Christian V, 1670, parforcejagt, firdoblet |
| F8 | CONFIRMED | curl | lex.dk |
| F9 | CONFIRMED | curl | 36 rides, bakken.dk, undated |
| F10 | CONFIRMED | curl | 1,8 mio. anslået, 2025, lex.dk |

Safe to use:
- Kirsten Piils kilde, "ifølge sagnet/traditionen" fundet i 1583; københavnerne drog efter vandet fordi byens vand var dårligt (en.wikipedia).
- Bakken ligger i Jægersborg Dyrehave ved Klampenborg nord for København.
- Bakken har gratis entré (Bakkens egen hjemmeside, nutid); man betaler for forlystelser.
- Besøgstallet kan ikke tælles nøjagtigt, fordi der ikke er entré; anslået 1,8 mio. i 2025 (lex.dk).
- Frederik V åbnede Dyrehaven officielt 1746 og gav i 1756 alle fri adgang til den kongelige Dyrehave.
- Christian V (konge 1670) elskede parforcejagt og udvidede sin fars dyrehave til det firdobbelte.
- "36 forlystelser ifølge Bakkens hjemmeside" (uden årstal) eller intet tal.

Must not be used: 2,5-2,9 mio. (en.wikipedia, undated, conflicts with 1,8); 32 (2013) and 33 rides as current; "Bakken opened 1583" as an archival fact; any year for the naming of Jægersborg Dyrehave (lex/en.wikipedia give no safe year; en.wikipedia says 1671, one source).

Extra checks:
- 1583: sourced only as the Kirsten Piil legend. lex.dk says "ifølge traditionen blev fundet i 1583 og genopdaget i 1732"; da.wikipedia says "Parken opstod i 1583" and bakken.dk calls it the spring found "1583" in a poem. Treat 1583 as legend date. Verdict: usable with "ifølge sagnet".
- Visitors: 1,8 mio. (2025, anslået, lex.dk) CONFIRMED; 2,5-2,9 mio. (en.wikipedia, undated) not usable.
- Rides: 36 (bakken.dk, undated) / 32 (da.wikipedia, 2013) / 33 (en.wikipedia infobox) all exist on the raw pages; only 36 with attribution.
- Free entrance: bakken.dk states "Bakken har altid gratis entré" (present policy, Bakkens own words) and en.wikipedia says "Entrance into the park area is free of charge". No source gives a start date. 1756 is free access to the Dyrehave; en.wikipedia says the park was "off-limits to the public until 1756".

Corrections to the topic angle: "free entrance" IS supported as a present-day fact (bakken.dk) and as the reason the visitor count is only an estimate (F10). It is NOT supported as an old tradition dating from 1756, and "altid" must be attributed to Bakken ("Bakken skriver selv, at der altid har været gratis entré"). Suggested frame: dated legend (1583) plus free access to the Dyrehave since 1756 plus today's free entry, with the three clearly separated.

## art-cykelsti

| Fact | status | how | note |
|---|---|---|---|
| F1 | CONFIRMED | curl | 244 km, 16 ruter, 2024; links 21 of 27 kommuner |
| F2 | CONFIRMED | curl | +87 % is cykeltrafik, not count of cyklister |
| F3 | CONFIRMED | curl | 14 % of new cyclists; 12 km per trip |
| F4 | CONFIRMED | curl | 14 April (2012 from release dated 3 Apr 2012) |
| F5 | CONFIRMED | curl | 17,5 km vs 18 km: real conflict |
| F6 | CHANGED | curl | length 230 m (text) vs 235 m (caption): omit length |
| F7 | CONFIRMED | curl+pdftotext | 43 % 2025 vs 46 % 2024, trips to work/education in Copenhagen |
| F8 | CONFIRMED | curl+pdftotext | 2025, area between buildings, excl. parks |
| F9 | CONFIRMED | curl+pdftotext | 401 km / 64 km in Copenhagen, 2025 |
| F10 | CONFIRMED | curl | 60+ / 850+ / 27; 2045 vision on press release |

Safe to use:
- 2024: 244 km supercykelsti på 16 ruter, forbinder 21 af samarbejdets 27 kommuner (supercykelstier.dk).
- 2024: cykeltrafikken på de 16 ruter er i gennemsnit 87 % højere end i førmålingerne; 14 % af de nye cyklister tog før bilen; gennemsnitlig tur 12 km.
- Albertslundruten (C99) er Danmarks første cykelsupersti, åbnet lørdag den 14. april 2012, gennem fem kommuner. Længde: udelad eller "omkring 18 km".
- Cykelslangen: indviet sommeren 2014, fra Dybbølsbro til Havneholmen i fortsættelse af Bryggebroen (indviet 2006). Ingen længde.
- København, 2025: 43 % af turene til arbejde og uddannelse på cykel (46 % i 2024; målet var 50 % i 2025).
- København, 2025, areal mellem husene (uden parker og grønne områder): kørebaner 49 %, fodgængerarealer 32 %, cykelstier og cykelbaner 6 % (plus 4 % fælles gang- og cykelstier), bilparkering 8 %, cykelparkering 1 %.
- København 2025: 401 km cykelsti, heraf 64 km supercykelsti. Region Hovedstaden 2025: 244 km supercykelsti (kk.dk table).
- Vision: over 850 km på mere end 60 ruter i 2045.

Must not be used: Cykelslangen length (230/235 m); 7 % of street space (search snippet, not fetched); 220 km or 28 routes/300 km (snippets); mixing 47 %/55 %/31 % figures from the same report with 43 %.

Extra checks:
- 16 ruter / 244 km (2024): CONFIRMED, the sentence is verbatim in the 2024 press release; kk.dk table 2025 also shows 244 km for the region.
- Albertslundruten 14 April: CONFIRMED (Saturday); the year 2012 comes from the release date (3 April 2012) and the route page ("2012 lanceringsår"). Length 17,5 km (press release) vs 18 km (route page): conflict stays; omit.
- Cykelslangen summer 2014: CONFIRMED. Length: CHANGED to "omit" (230 vs 235 on the same lex.dk page).
- 43 % (2025) vs 46 % (2024): CONFIRMED in the PDF, scope trips to work and education in Copenhagen.
- kk.dk space shares: CONFIRMED. Year 2025 (Figur 21 "Arealet mellem byens huse 2025"), area = space between buildings in Copenhagen municipality, parks and green areas excluded; GeoDanmark base data were updated since the 2024 count. "Cykelstier og cykelbaner 6 %" does not include 4 % shared walk/cycle paths.

Corrections to the topic angle: the sheet has no direct source for a conflict between pedestrians and cyclists on the same pavement. "Kampen om pladsen" is supported only as an area comparison (49 % kørebaner against 6 % cykelstier og cykelbaner, 32 % fodgængerareal) in Copenhagen, 2025. Do not describe it as a documented dispute with named groups.

## art-gaekkebrev

| Fact | status | how | note |
|---|---|---|---|
| F1 | CONFIRMED | curl | lex.dk |
| F2 | CONFIRMED | curl | lex.dk |
| F3 | CONFIRMED | curl | 1770 in bobedre, da.wikipedia, kristendom.dk |
| F4 | CONFIRMED | curl | bindebrev from Germany |
| F5 | CONFIRMED | curl | vintergæk |
| F6 | CONFIRMED | curl | én prik pr. bogstav |
| F7 | CONFIRMED | curl | egg rule; one source for guessed case |
| F8 | CONFIRMED | curl | tradition, not rule; before palmesøndag |

Safe to use: gækkebrev = klippet, dekoreret brev med vers og evt. en blomst; anonymt eller navn med prikker (én pr. bogstav); bindebrevet fra Tyskland som forløber (kendt i Danmark i 1600-tallet); ældste kendte/bevarede gækkebrev er fra 1770 (sendt til Maria Christiane Hansdatter i Odense, da.wikipedia); traditionen med en vintergæk; ifølge en udbredt regel skylder man modtageren et påskeæg, hvis man bliver gættet, og ellers skylder modtageren afsenderen et æg; der er tradition for, at brevet gættes inden palmesøndag.

Must not be used: the "gæk = narre / vintergæk narrer folk" explanation, the 1800s egg history, "sent in the weeks before Easter" (no verbatim page sentence found); the Latin species; "for hvert fejlgæt" as the rule (it is a variant on da.wikipedia).

Extra checks:
- 1770: CONFIRMED as "the oldest known/preserved", on three raw pages. lex.dk instead says only "slutningen af 1700-tallet". Never write that the tradition began in 1770.
- Egg rule: CONFIRMED verbatim on bobedre.dk. da.wikipedia states only the not-guessed case ("første gang") and adds a per-wrong-guess variant, so write "ifølge en udbredt regel".
- Palmesøndag: CONFIRMED, but the page itself says "Der findes ingen regler ... men der er tradition for". Write "traditionen siger".
- Museum source: NOT found. natmus.dk and danskkulturarv.dk load (HTTP 200) but carry no gækkebrev text; da.wikipedia's reference list has no museum link.

Corrections to the topic angle: none needed, but "regel" must be softened to "tradition/udbredt regel", and 1770 must stay "ældste kendte".

## art-madspild

| Fact | status | how | note |
|---|---|---|---|
| F1 | CONFIRMED | curl | 31 July 2008, Selina Juul |
| F2 | CONFIRMED | curl | daglig leder |
| F3 | CONFIRMED | curl | secondary report, attribute |
| F4 | CONFIRMED | curl | REMA 1000 since 2008 |
| F5 | CONFIRMED | curl | households only, 2011-2017 |
| F6 | UNCONFIRMED | curl | figure on page but no year; page has conflicting totals |
| F7 | CONFIRMED | curl | 2015, Denmark, Copenhagen HQ |
| F8 | CONFIRMED | curl | company claim, Aug 2023 |
| F9 | CONFIRMED | curl | Wefood Feb 2016, volunteers |
| F10 | CONFIRMED | curl | 3.036 tons over ten years |
| F11 | CONFIRMED | curl | page dated 8 Dec 2025 |

Safe to use:
- Stop Spild Af Mad stiftet 31. juli 2008 af Selina Juul (daglig leder); REMA 1000 har samarbejdet med bevægelsen siden 2008 og afskaffet mængderabatter.
- Husholdningernes madspild faldt med 14.000 ton fra 2011 til 2017 (261.000 til 247.000 ton; Miljøstyrelsens kortlægning, tal fra 2018). Husholdninger only.
- Too Good To Go er skabt i Danmark i 2015, hovedkontor København; ifølge virksomheden selv (pr. august 2023) 164.000 virksomheder, 62 mio. brugere, 155 mio. poser reddet. Founders per Wikipedia: Thomas Bjørn Momsen, Klaus Bagge Pedersen, Stian Michael Hånes Olesen, Adam Sigbrand, Brian Christensen. Founders are not needed in a text.
- Wefood åbnede på Amager i februar 2016 og drives af frivillige under Folkekirkens Nødhjælp; på ti år 3.036 ton overskudsvarer solgt (pressemeddelelse feb. 2026).
- Fødevarestyrelsen ændrede i december 2025 fortolkningen af 1/3-reglen, så donation af overskudsmad undtages.
- "25 % fra 2010 til 2015" only as "ifølge rapportering i 2015", never as Stop Spild Af Mad's own result.

Must not be used: 881.062 ton (no year, conflicts on the same page with "over 700.000 ton, tal fra 2015" and household 235.000 ton); the national total as one number of any year; 507.000-610.000 ton (Miljøstyrelsen household madaffald incl. inedible parts, different measure); "over 700.000 ton" as current.

Extra checks:
- Export: NO fetched page says Danish food-waste know-how is an export. The word "eksport" appears only in site navigation. What the pages do support: Stop Spild Af Mad "samarbejder med EU, FN og samtlige danske regeringer" (fodevarefokus.dk), Too Good To Go (founded in Denmark) operates in "European cities" and since October 2020 North America (en.wikipedia), and Wefood is called "verdens første madspildssupermarked" by its own press release.
- National totals: 881.062 ton (all five sectors, Miljøstyrelsen, no year on the page: UNCONFIRMED); household 261.000 to 247.000 ton (2011/12 to 2017: CONFIRMED); the table on the same page lists households at 235.000 ton and "over 700.000 ton" (tal fra 2015); en.wikipedia Stop Wasting Food: "over 700,000 tons" (Danish Agriculture and Food Council, older). These are different scopes and years; never combine.
- Stop Spild Af Mad: 31 July 2008, Selina Juul: CONFIRMED (fodevarefokus.dk and da.wikipedia infobox). Another page line credits Klaus Jørgensen (L&F) with the first calculations in 2006; Juul founded the movement.
- Too Good To Go: 2015 and the five founders are on en.wikipedia raw (CONFIRMED as Wikipedia's claim). A 2016 app launch was not on the fetched page.

Corrections to the topic angle: "madspild blev en dansk eksportvare" is NOT supported. Suggested reframing the sources do support: "Fra en dansk forbrugerbevægelse til løsninger, der er bredt kendt: Stop Spild Af Mad (2008), Too Good To Go (skabt i Danmark 2015, nu i flere lande ifølge Wikipedia), og Wefood (2016)." Describe Too Good To Go's spread as the company's own count with date.

## art-samsoe

| Fact | status | how | note |
|---|---|---|---|
| F1 | CONFIRMED | curl | 1997 |
| F2 | CONFIRMED | curl | osti abstract |
| F3 | CONFIRMED | curl | 11 land, 10 sea (DR, 30 Oct 2021) |
| F4 | CONFIRMED | curl | DR June 2018; do not use "3700 investors" |
| F5 | CONFIRMED | curl | pre-sale (12 Nov 2018) |
| F6 | CONFIRMED | curl | husejere kunne købe andele |
| F7 | CONFIRMED | curl | csr.dk; 70 % of heat |
| F8 | CONFIRMED | curl | DR 2018 |
| F9 | CONFIRMED | curl | building 2007 |
| F10 | CONFIRMED | curl | fossilfri 2030, as of 2025 |
| F11 | CONFIRMED | curl | 3.658, DR 2021 |
| F12 | CONFIRMED | curl | ferry 2015 |

Safe to use: 1997 vandt Samsø Energiministeriets/Energistyrelsens konkurrence om en vedvarende energi-ø; 11 landmøller og 10 havmøller (DR 2021); fire fjernvarmeanlæg (tre halm, ét sol og flis); over halvdelen af de private oliefyr i ca. 2.000 husstande skiftet ud (DR 2018); husejere kunne købe andele i landmøllerne; Samsø Energiakademi opført 2007; mål om en fossilfri ø i 2030 (lex.dk, 2025); færgen Prinsesse Isabella sat ind 2015 mellem Sælvig og Hou.
Conditional: "ifølge DR (2018) har samsinger selv investeret ca. 70 % af de ca. 440 mio. kr., der er brugt på vedvarende energi" (not "3.700 investors"); "omkring 3.600-3.700 indbyggere" rather than one figure; the 2018 offshore ownership (800 andelshavere, fem møller ejet af kommunen) only as "indtil 2018".

Must not be used: any single year for 100 % energy self-sufficiency; "the offshore turbines are owned by islanders" in the present tense; 3.658/3.617/3.724 as one current population; "the park was sold" as completed.

Extra checks:
- Self-sufficiency year: UNRESOLVED, do not state. Lex.dk "Siden 2007" and da.wikipedia "i 2007" (footnote: McNamara, 8 March 2007); csr.dk "Allerede i 2003 ... 100 % vedvarende energi"; 1998 occurs on the csr.dk raw page only as the spring when Søren Hermansen went door to door; the energiakademiet.dk page returned HTTP 455, so the claimed 1998 could not be checked. Note the three claims may measure different things (electricity vs total energy).
- Population: 3.658 (DR, article dated 30 Oct 2021, no population year), 3.617 (da.wikipedia, januar 2026), 3.724 (en.wikipedia, 2017), "omkring 3700" (DR 2018). Use "omkring 3.600-3.700".
- "70 % af 440 mio. kr.": DR 2018 raw sentence confirmed. Its meaning: private islanders' share of the total investment in renewable energy (csr.dk: total 440 mio. kr., public subsidies 35 mio. kr.); the same DR page says the turbines alone cost 300 mio. kr. "3700 samsinger" equals the island's whole population, so do not read it as a count of investors.
- 2018 offshore change: energy-supply.dk, 12 Nov 2018: "overdrages Samsø Havvind og 9 ud af 10 havvindmøller til Wind Estate A/S, såfremt nødvendige myndighedstilladelser opnås". It is announced and conditional; completion appears on no fetched page, and ownership of the onshore turbines was not checked.

Corrections to the topic angle: "Samsø, øen der ejer sine egne vindmøller" overstates. Supported: islanders co-owned and co-invested heavily (F4, F5, F6), but as of Nov 2018 nine of ten offshore turbines were to be handed to Wind Estate A/S. Suggested reframing: "Samsø, øen hvor beboerne selv investerede i vindmøllerne", with dated verbs (investerede, fik mulighed for at købe andele, ejede indtil 2018).
