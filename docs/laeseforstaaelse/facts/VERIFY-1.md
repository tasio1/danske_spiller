# VERIFY-1 — independent check of five fact sheets
verifier: laese-facts-verify-1 | date: 2026-10-06 | method: raw page via `curl -sL` (browser User-Agent, `--compressed`), tags stripped, grep for figure and quoted sentence. WebFetch was used only for the EU primary-law attempt (returned nothing). Every status below is therefore `how: curl`.

Totals: CONFIRMED 58, CHANGED 2, UNCONFIRMED 0 (60 fact lines). Two CHANGED: art-dialekter F6, haefte-rebildfest F4. "CONFIRMED" means the sentence (or the same figure with the same year and scope) is on the raw page; it does not mean the fact is safe without its scope note.

## art-ulven

| Fact | status | how | note |
|---|---|---|---|
| F1 239 attacks 2025 | CONFIRMED | curl | verbatim, "i Jylland", article 14.7.2026 |
| F2 91 vs 57 | CONFIRMED | curl | sgav.dk 3.7.2025, corrected 9.7.2025 (89 was wrong) |
| F3 1.285 compensated animals | CONFIRMED | curl | breakdown sums to 1.285 |
| F4 at least 1.285 killed | CONFIRMED | curl | "mindst" |
| F5 at least 36,3 mio. kr. | CONFIRMED | curl | netnatur: TV 2's calculation; compensation + fence subsidies |
| F6 7 packs, 3 pairs, 1 male | CONFIRMED | curl | spring stock for monitoring year 2026/27, page 18.5.2026, "vejledende"; superseded 24.9.2026 |
| F7 factor 7 per pack | CONFIRMED | curl | caption verbatim; 49 not printed |
| F8 EU "strengt" to "beskyttet" | CONFIRMED | curl | europarl.europa.eu, 8.5.2025 |
| F9 bilag IV to V | CONFIRMED | curl | sgavmst.dk 3.6.2025; 1.7.2025 only an expectation |
| F10 state pays for fences | CONFIRMED | curl | DN 28.4.2025 |
| F11 Agillix wants a plan | CONFIRMED | curl | 14.8.2026 |
| F12 about 80 animals behind fences | CONFIRMED | curl | netnatur, 10 attacks, 2025 |

Step-6 verdicts:
- EU status: CONFIRMED that the wolf is now "beskyttet" (Annex V), no longer "strengt beskyttet" (Annex IV). Quote, European Parliament (8.5.2025): "ændret ulves beskyttelsesstatus fra 'strengt beskyttet' til 'beskyttet'". Quote, Danish agency (3.6.2025): "ulven fra bilag IV til bilag V i habitatdirektivet". Quote, Commission (7.3.2025): the status changed "from `strictly protected' to `protected' under the Bern Convention, which entered into force today". The legal text (Directive (EU) 2025/1237) could not be opened (eur-lex returns an empty HTTP 202 to curl and WebFetch), so the EU entry-into-force date is UNCONFIRMED and the author's "7 March 2025 EU entry into force" is wrong: 7 March is the Bern Convention date. Member states may keep "strengt beskyttet" in national law (Parliament page).
- 57/91/239 attacks: 57 (2023) and 91 (2024) CONFIRMED on sgav.dk; 239 (2025) CONFIRMED. Different registers, same agency.
- 1.285 animals: CONFIRMED (and the 1.239+32+5+8+1 sum).
- At least 36,3 mio. kr.: CONFIRMED on netnatur; effektivtlandbrug rounds to "mindst 36 millioner". Covers compensation AND fence subsidies.
- "7 packs, 3 pairs, 1 male" = spring 2026 (forårsbestand at the start of monitoring year 2026/27, page dated 18.5.2026): CONFIRMED. "49" is NOT on the page; it is 7 x 7 derived from the printed factor: CONFIRMED as derived.

Safe to use in a text:
- 2023: 57 attacks; 2024: 91; 2025: 239 (Jylland, registered/documented). Compensation 2025: 1.285 animals (1.239 får, 32 kreaturer, 5 heste, 8 geder, 1 vædder), "mindst".
- State cost 2025: "mindst 36 mio. kr." (36,3) for erstatninger OG tilskud til ulvesikre hegn together; fences account for about 35 mio.
- Spring 2026 stock: 7 packs with pups, 3 pairs without pups, 1 lone male, preliminary. Conversion factor 7 per pack; 49 may be given only as "et skøn" by the text's own multiplication.
- Wolf is "beskyttet" in EU law since 2025 (moved from Annex IV to V). Agillix (a landboforening) asks for a plan for population size (Aug 2026). Fences paid by the state. About 80 animals killed in 10 attacks behind functioning fences in 2025.

Must not be used: any EU entry-into-force date; "strengt beskyttet" as current; "49" as a counted number; 89 attacks; "36 mio. i erstatning"; "7/3/1" as "the latest" (see below); positions of biologists or L&F (not supported); the old lf.dk status.

Corrections to the topic angle:
- The calibration text in SKILL.md §8 says "Den seneste overvågning fandt syv flokke, tre par og en enlig han". Newer (24.9.2026): 11 kobler, 2 par, 2 enlige hanner, mindst 61 hvalpe. The text must say "i foråret 2026" and may add that a later status is higher, or stay with spring 2026 consistently.
- Calibration text "staten brugte mindst 36 millioner kroner på erstatninger og på tilskud til ulvesikre hegn" is correct only as "mindst 36,3" for both together.

## art-dialekter

| Fact | status | how | note |
|---|---|---|---|
| F1 young Bornholmers | CONFIRMED | curl | DR 14.9.2015 |
| F2 Sønderjylland/Vendsyssel | CONFIRMED | curl | page hedges "Lige nu ser det ud til" (preliminary) |
| F3 researcher does not know why | CONFIRMED | curl | |
| F4 interviews incl. Nexø school | CONFIRMED | curl | |
| F5 most standardised country | CONFIRMED | curl | DR 24.12.2015 |
| F6 explanation by mobility/media | CHANGED | curl | only "Vi har en formodning om" that loss speeds up because of mobility, tv and media |
| F7 young sønderjyder still speak dialect | CONFIRMED | curl | KU page 16.1.2024 |
| F8 9th class + 3 generations | CONFIRMED | curl | typo "bedstedforældre" is on the page |
| F9 LANCHART 2005 | CONFIRMED | curl | |
| F10 translator prototype | CONFIRMED | curl | videnskab.dk 7.11.2019 |
| F11 180.000 words | CONFIRMED | curl | |
| F12 30 volunteers, over 70 | CONFIRMED | curl | 2019 |

Dating check: every claim is dated by the sheet (2015 F1-F6, 2024 F7-F8, 2019 F10-F12). Nothing may be written as present-day fact from F1-F6: they are a 2015 snapshot of the start of a study, and the DR lead ("I løbet af en generation eller to er der stort set ikke længere nogen, der taler bornholmsk") is a 2015 forecast.

Safe to use in a text: "I 2015 sagde en forsker fra KU, at unge på Bornholm stort set ikke længere talte dialekt; i Sønderjylland og Vendsyssel talte unge dialekt (foreløbigt resultat)". "Forskerne vidste ikke dengang, hvorfor." "En KU-undersøgelse offentliggjort 2024: der er stadig unge sønderjyder, der taler dialekt, men næsten alle ændringer går mod standarddansk; forskerne fulgte en 9. klasse og forældre og bedsteforældre." "Sprogforandringscentret blev grundlagt 2005." 2019: prototype of a translation tool trained on små 180.000 ord, goal at least one million, about 30 volunteers, average age over 70; a researcher said traditional bornholmsk may die out within a couple of generations.

Must not be used: mobility/media as a proven cause (only a researcher's presumption, 2015); any cause for Bornholm's decline or sønderjysk's survival; the researchers' names in text; "i dag"; translator as finished; melody (tonefald); vendelbomål figures.

Corrections to the topic angle: the title question "hvorfor?" has no sourced answer. The text can only say that the cause was open in 2015 and that a researcher presumed faster loss from mobility and media. "Bornholmsk dør" must be framed as a 2015/2019 forecast by named kinds of source, not a fact.

## art-efterskole

| Fact | status | how | note |
|---|---|---|---|
| F1 30.911 pupils 2026/27 | CONFIRMED | curl | 27.8.2026 |
| F2 24.804 in 10th grade, 36,2 % | CONFIRMED | curl | share of year cohort, 10th grade only |
| F3 "hver tredje" | CONFIRMED | curl | page: "Mere end hver tredje"; highest in a ten-year series |
| F4 238 schools | CONFIRMED | curl | 238 = August 2025; 234 = "Alle 234 efterskoler har oplyst" (2026 survey), no school count stated |
| F5 31.018 / 24.408 in 2025/26 | CONFIRMED | curl | 24.408 vs 24.212 conflict |
| F6 14-18 years | CONFIRMED | curl | vifo.dk |
| F7 42 weeks | CONFIRMED | curl | "typisk" |
| F8 50.000-100.000 kr. | CONFIRMED | curl | after state support, "typisk" |
| F9 support depends on income | CONFIRMED | curl | |
| F10 58.800 / 119.700 example | CONFIRMED | curl | assumes income 400.000 kr.; weekly price 2.600-3.000 kr. on same page |
| F11 taxameter | CONFIRMED | curl | VIFO, 2023 data |
| F12 minimum payment | CONFIRMED | curl | |

Step-6 verdicts: 30.911 (2026/27) CONFIRMED. 24.804 in 10th grade = 36,2 % of the year cohort CONFIRMED (the same release: "mod 24.212 sidste år"; 28,8 % ten years earlier). 238 vs 234: 238 CONFIRMED for August 2025; 234 is only the number of schools that answered the August 2026 survey, so it must not be written as "there are 234 efterskoler". 42 weeks CONFIRMED ("typisk"). 50.000-100.000 kr. CONFIRMED as "typisk" parental payment after state support.

Safe to use in a text: in schoolyear 2026/27, 30.911 pupils started at efterskole, 24.804 of them in 10th grade; that is 36,2 % of the cohort, more than every third 15-year-old (highest in Efterskolerne's ten-year series; 28,8 % ten years earlier). 238 efterskoler in August 2025. A stay typically lasts 42 weeks; parents typically pay 50.000-100.000 kr. after state support, which depends on parental income. Age 14-18, pupils live and attend school together. Never use "36,2 %" as share of all pupils or all efterskole pupils.

Must not be used: 234 as a school count; the 2025/26 10th-grade figure (24.408 vs 24.212); "rekord/nogensinde"; a single price per week or year; example 58.800 kr. without "ved en husstandsindkomst på 400.000 kr."; any all-in share of a cohort.

Corrections to the topic angle: motives ("hvorfor flytter en 15-årig hjemmefra") are not supported by any fact; the text can describe what efterskole is, how many go and how it is paid for, not why pupils choose it.

## haefte-kolonihave

| Fact | status | how | note |
|---|---|---|---|
| F1 19.773 (2024) | CONFIRMED | curl | Boligforeningsweb, DST figures; method unknown |
| F2 ca. 62.000 in godt 1.000 foreninger | CONFIRMED | curl | no year on lex.dk; 62.150 in 2001 per Wikipedia |
| F3 ca. 60.000 (2013) | CONFIRMED | curl | |
| F4 ca. 40.000 members | CONFIRMED | curl | kolonihaveforbundet.dk resolves scope |
| F5 11 May 1908 | CONFIRMED | curl | |
| F6 Aalborg, 1891, 1892 | CONFIRMED | curl | |
| F7 20.000 in 1904 | CONFIRMED | curl | lex.dk says 1907 |
| F8 law 2001 | CONFIRMED | curl | |
| F9 five lots, 400 m2 | CONFIRMED | curl | Wikipedia |
| F10 no year-round living | CONFIRMED | curl | Wikipedia, varies |
| F11 Copenhagen rules | CONFIRMED | curl | overnatningshaver only |
| F12 Risskov 410 / 8-10 years | CONFIRMED | curl | article 30.8.2018 |

Step-6 counts: all four numbers are on raw pages and measure different things. 62.000 = all gardens (lex.dk; kolonihaveforbundet.dk faktaboks "Der findes 62.000 kolonihaver i Danmark"). About 40.000 = "Knap 40.000 af dem er medlem af Kolonihaveforbundet" (400 haveforeninger, 21 kredse; page fetched with curl, so the authors' SNIPPET-ONLY note is now resolved). 60.000 = Trap, 2013. 19.773 = Boligforeningsweb with Danmarks Statistik numbers for 2024, 73 kommuner; the page does not say what it counts, so why it is a third of 62.000 stays UNKNOWN. Risskov: "410 personer på venteliste til i alt 195 haver" and "mellem otte og ti år", from an article published 30.8.2018 (the sheet said the date was unknown).

Safe to use in a text: "ca. 62.000 kolonihaver i godt 1.000 foreninger"; "knap 40.000 af dem hører til Kolonihaveforbundet (400 foreninger)"; Kolonihaveforbundet 1908; first gardens in Aalborg, Copenhagen associations 1891 and 1892; Kolonihaveloven 2001 (Svend Auken); a kolonihaveområde has at least five lots averaging at most 400 m2 (Wikipedia wording); in Aarhus in 2018 Haveforeningen Risskov had 410 people on the waiting list for 195 gardens and 8-10 years wait; Copenhagen's kommuneplan allows overnatning 1 April-31 October in overnatningshaver, house max 60 m2 on parcels up to 400 m2.

Must not be used: 19.773 as "the" number of gardens; one total without source and year; Risskov figures as present-day or as the exercise association's; Copenhagen m2 or season as national law; the interwar/1949 peak of about 100.000 (lex.dk says 1949, Wikipedia says interwar - conflicting, not a fact line); 20.000 in 1904 and 1907 together.

Corrections to the topic angle: the booklet is an exercise; association-specific rules, prices, dates and waiting times stay invented. Real figures may enter only as framed, dated background.

## haefte-rebildfest

| Fact | status | how | note |
|---|---|---|---|
| F1 first Danish-American friendship association | CONFIRMED | curl | |
| F2 largest 4 July outside US | CONFIRMED | curl | say "kaldes" |
| F3 precursor 1909 | CONFIRMED | curl | |
| F4 140 tønder, bought 1910 | CHANGED | curl | purchase year 1910 vs 1911; no year usable |
| F5 condition: celebrate Independence Day | CONFIRMED | curl | a plan on da.wikipedia |
| F6 80 ha, 1912 | CONFIRMED | curl | Biografisk Leksikon; later more than doubled |
| F7 three conditions | CONFIRMED | curl | en.wikipedia |
| F8 every year since 1914 | CONFIRMED | curl | |
| F9 Disney 1961, Nixon 1962, Reagan 1972 | CONFIRMED | curl | two sources each, see below |
| F10 Disney and Reagan keynote | CONFIRMED | curl | TV 2 Nord 4.7.2023 |
| F11 up to 50.000 / few thousand | CONFIRMED | curl | 2023 article |
| F12 American football and baseball | CONFIRMED | curl | "i år" = 2023 |

Step-6 verdicts:
- Area donated: 56 ha is UNCONFIRMED and found on no Rebild page (the only "56 ha" in the downloaded pages is an unrelated property listing). Sources: 80 ha initially purchased and in 1912 handed to the state, "Ved senere køb er arealet mere end fordoblet" (Dansk Biografisk Leksikon, curl); "almost 200 acres" (en.wikipedia, 1911); "140 tønder" (da.wikipedia, 1910). Safest: "omkring 80 hektar i begyndelsen" with the source, or no size.
- First fest date: rebildfesten.dk (the organiser) says 4 July 1912; da.wikipedia and en.wikipedia say 5 August 1912 (en: painting "first Rebild Celebration August 5th 1912"). Conflict is real; write only "1912". The purchase year also conflicts (1910 da.wikipedia, 1911 rebildfesten.dk and en.wikipedia).
- Speakers: Walt Disney 1961: en.wikipedia list, DR ("I 1961 trak Walt Disney 25.000 gæster"), TV 2 Nord 2023, mouseplanet. Richard Nixon 1962: en.wikipedia list and DR ("hovedtaler på Rebildfesten i 1962"); he was former vice president. Ronald Reagan 1972: en.wikipedia ("Governor Ronald Reagan"), DR ("i 1972 med sin kone Nancy"), TV 2 Nord. Each has at least two raw-page sources. Attendance for Disney conflicts (25.000 DR, nearly 20.000 mouseplanet): do not use.

Safe to use in a text: Rebildselskabet, the first Danish-American friendship association, over 100 years old, organises the celebration, called the largest 4 July celebration outside the USA; a precursor was held in Aarhus in 1909; first Rebild celebration in 1912 (no day); held every year since 1914 except world wars and the coronavirus pandemic; gift to the state with three conditions (nature, open to public, Danish-Americans may celebrate American holidays); initially about 80 ha (Biografisk Leksikon); Disney 1961, Nixon 1962, Reagan 1972 as speakers; after WWII up to 50.000 visitors, in recent years (2023) a few thousand; 2023 programme added American football and baseball.

Must not be used: 56 ha; a purchase year; 4 July or 5 August 1912; "hvert år siden 1912"; Disney attendance; Queen Margrethe as protector; 2022 programme and prices.

Corrections to the topic angle: plan said 56 ha and "4. juli-festen" from 1912: the size is wrong and the first-fest date is disputed, so the history board must say only "1912" and "ca. 80 hektar". All programme times, tickets and parking remain exercise values.
