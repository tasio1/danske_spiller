// Læseforståelse, mode 'mc' (Læs og vælg): one article, three questions, three options each.
// Rules: .claude/skills/laese-text-authoring/SKILL.md. Facts: docs/laeseforstaaelse/facts/art-ulven.md
// (CONFIRMED lines and the VERIFY-1 "safe to use" list only). `evidence` is a 0-based paragraph index.
(function () {
  'use strict';
  window.LAESE_MC = [
    {
      id: 'art-ulven',
      mode: 'mc',
      level: 'B2',
      title: 'Hvem skal betale for ulven?',
      genre: 'overblik',
      kicker: 'Overblik · Natur',
      // Traceability: paragraph (1-based, = data-par) -> fact in docs/laeseforstaaelse/facts/art-ulven.md
      //   1 spring-2026 stock 7 flokke / 3 par / 1 enlig han, foreløbig: F6
      //   2 forårsbestand, start af overvågningsår: F6; syv ulve pr. flok: F7; years 2023-25 / 2025 / spring 2026: F1, F2, F5, F6
      //   3 57 (2023), 91 (2024): F2 (no scope stated, so none given); 239 (2025, scope i Jylland): F1
      //   4 1.239 får, 32 kreaturer, 5 heste, 8 geder, 1 vædder, i alt 1.285 (sum printed on the sheet): F3; mindst 1.285 dræbt: F4
      //   5 mindst 36 mio. kr. (erstatning + hegnstilskud): F5; omkring 35 mio. til hegn: F5 caveat; staten betaler hegn: F10
      //   6 omkring 80 dyr, ti angreb, bag hegn i orden (2025): F12; staten betaler: F10
      //   7 strengt beskyttet -> beskyttet (2025): F8; bilag IV -> V (the change, no current-status claim): F9
      //   8 landboforening (unnamed) beder om en plan, august 2026: F11
      // Derived figures: none. Definitions (erstatning, tilskud, mindst) are plain vocabulary, not facts.
      paragraphs: [
        'Ulven lever igen i Danmark, og den sætter spor i regnskabet. I foråret 2026 var der syv flokke med hvalpe fra 2025, tre par uden hvalpe og en enlig han. Det er en foreløbig opgørelse, som kun er vejledende. Det betyder, at tallene kan ændre sig, når der kommer nye målinger.',
        'Tallene skal læses med forsigtighed. Opgørelsen viser bestanden i foråret, ved starten af et nyt overvågningsår, så den er et øjebliksbillede og ikke et endeligt facit. Når bestanden gøres op, regner man med syv ulve for hver flok, men det er en regneregel, og den fortæller ikke sikkert, hvor mange ulve der reelt findes. Tallene hører også til forskellige år: angrebene er talt for 2023 til 2025, regningen gælder 2025, og bestanden er fra foråret 2026. Man kan derfor ikke lægge dem sammen til ét samlet tal.',
        'Angrebene på husdyr er blevet flere. I 2023 blev der registreret 57 ulveangreb på husdyr. Året efter var tallet 91, og i 2025 blev der registreret 239 i Jylland. Tallene stiger hurtigt.',
        'Erstatningen følger dyrene. For 2025 blev der udbetalt kompensation for 1.239 får, 32 kreaturer, fem heste, otte geder og en vædder, i alt 1.285 dyr. Kompensation og erstatning betyder her det samme, nemlig penge for dyr, som ulve har dræbt. Tallet gælder dyr og ikke angreb, så de 1.285 dyr og de 239 angreb er to forskellige tal. Ulve dræbte altså mindst 1.285 husdyr i Danmark det år, og får udgør langt det meste af tallet, så det er især fåreholdere, der er ramt.',
        'Regningen har to dele. Erstatning er penge til dem, der har mistet dyr, og den kommer, når angrebet er sket. Tilskud til hegn er penge, der gives, for at nye angreb ikke sker. Sammen kostede de staten mindst 36 millioner kroner i 2025, og mindst betyder, at beløbet kan være højere. Det var hegnene, der tog det meste, for omkring 35 millioner kroner gik til dem. Staten betaler for at gøre et hegn ulvesikkert, så dyreholderen ikke selv skal bære den udgift.',
        'Et ulvesikkert hegn skal holde ulve ude af folden, men det er ingen garanti. I 2025 blev omkring 80 dyr, mest får og lam, dræbt bag hegn, der var i orden og virkede helt, som de skulle. Det skete i ti angreb, og der blev udbetalt erstatning for dyrene. Staten betaler dermed både for hegnene og for de dyr, som hegnene ikke redder.',
        'Ulvens beskyttelse er også ændret. I 2025 sænkede EU ulvens status fra strengt beskyttet til beskyttet. Ændringen flytter ulven fra bilag IV til bilag V i habitatdirektivet. Ulven er altså stadig beskyttet, men reglerne er ikke så stramme som før.',
        'To ting står over for hinanden. Ulven har en beskyttet status, og samtidig betaler staten erstatninger og hegn. I august 2026 bad en landboforening om en plan for, hvor mange ulve Danmark skal have. Debatten handler altså om, hvor meget ulven må koste, og hvor mange ulve landet vil have. Både beskyttelsen og regningen kan ændre sig, så tallene i teksten viser kun, hvordan det så ud fra 2023 til 2025 og i foråret 2026.'
      ],
      questions: [
        {
          id: 'art-ulven-q1',
          q: 'Hvad viser tallene om ulveangreb på husdyr fra 2023 til 2025?',
          options: [
            'Antallet af angreb steg fra år til år.',
            'Antallet af angreb faldt efter 2024.',
            'Antallet af angreb var det samme hvert år.'
          ],
          correct: 0,
          evidence: 2,
          note: 'Tallene er 57 i 2023, 91 i 2024 og 239 i 2025, så antallet steg hvert år.'
        },
        {
          id: 'art-ulven-q2',
          q: 'Hvad gik de fleste af de mindst 36 millioner kroner til, som staten brugte i 2025?',
          options: [
            'Tilskud til ulvesikre hegn',
            'Erstatning til ejerne af dræbte dyr',
            'Udgifter til at tælle ulvene'
          ],
          correct: 0,
          evidence: 4,
          note: 'Omkring 35 af de mindst 36 millioner kroner gik til hegn; beløbet dækker kun erstatning og hegn.'
        },
        {
          id: 'art-ulven-q3',
          q: 'Hvad siger teksten om ulvesikre hegn?',
          options: [
            'De beskytter ikke altid, for dyr blev dræbt bag hegn, der var i orden.',
            'De har holdt alle ulve ude, så ingen dyr er blevet dræbt bag dem.',
            'De betales af dyreholderne selv, så de koster staten ingenting.'
          ],
          correct: 0,
          evidence: 5,
          note: 'I 2025 blev omkring 80 dyr dræbt bag hegn i orden, og staten betaler for at gøre hegn ulvesikre.'
        }
      ],
      sources: [
        'https://effektivtlandbrug.landbrugnet.dk/artikler/politik/123700/ulven-er-her-det-er-et-vilkaar',
        'https://sgav.dk/alle-nyheder/nyheder/2025/jul/antallet-af-ulveangreb-paa-husdyr-var-89-i-2024-',
        'https://netnatur.dk/ulv-draebte-flere-end-1-200-husdyr-i-2025/',
        'https://www.ulveatlas.dk/nyheder/april-2026-maanedlig-status-fra-ulveovervaagningen/',
        'https://www.ulveatlas.dk/nyheder/ny-opgoerelsesmetode-skal-give-et-mere-praecist-billede-af-ulvebestanden/',
        'https://www.europarl.europa.eu/news/da/press-room/20250502IPR28221/ulve-mep-erne-giver-gront-lyst-til-at-aendre-beskyttelsesstatus-i-eu',
        'https://sgavmst.dk/nyheder/2025/juni/hoering-beskyttelsen-af-ulven-bliver-aendret',
        'https://www.dn.dk/nyheder/2025/faktatjek-i-ulvedebatten-vi-gennemgar-de-mest-brugte-argumenter-om-ulve-i-danmark/',
        'https://effektivtlandbrug.landbrugnet.dk/artikler/politik/124191/flere-ulve-kan-spaende-ben-for-naturplejen'
      ],
      verify: true
    },
    {
      id: 'art-dialekter',
      mode: 'mc',
      level: 'B2',
      title: 'Bornholmsk og sønderjysk: hvad forskerne vidste',
      genre: 'forklaring',
      kicker: 'Forklaring · Sprog',
      // Traceability: paragraph (1-based, = data-par) -> fact in docs/laeseforstaaelse/facts/art-dialekter.md
      // (CONFIRMED lines only; F6 is CHANGED and used only as a dated presumption, "forskere formodede"; no cause stated as fact)
      //   1 undersøgelse begyndt 2015 (interviews gik i gang, intet resultat påstået), interviews af unge på Bornholm / i Vendsyssel / i Sønderjylland, skole i Nexø, KU-centrene: F4;
      //     Sprogforandringscentret grundlagt 2005 med bevilling fra Danmarks Grundforskningsfond: F9
      //   2 september 2015, foreløbigt resultat: F1, F2; Bornholm mest isoleret af de tre, forskeren ville ikke gætte, feltarbejde ca. et år (F3 note): F3; Paradisbakkeskolen i Nexø (F4 note): F4
      //   3 december 2015, KU-sprogforsker (unnamed), et af Europas mest standardiserede lande: F5; sprogforskerens formodning (dec. 2015, datid, én forsker) om mobilitet, tv og medier: F6 (CHANGED, so worded as presumption)
      //   4 januar 2024, stadig unge sønderjyder med dialekt, ændringer mod standarddansk: F7; 9. klasse, forældre og bedsteforældre, tre generationer: F8
      //   5 2019, forløber for Google Translate-agtigt program bornholmsk-dansk: F10; små 180.000 ord, mål mindst en million: F11; godt 30 frivillige, gennemsnitsalder lige over 70: F12
      //   6 closing: dates of F1-F12 only (2015, 2019, 2024); no new claim
      // Derived figures: none.
      paragraphs: [
        'I 2015 begyndte en undersøgelse af unges dialekter. Forskere fra Sprogforandringscentret og Center for Dialektforskning ved Københavns Universitet gik i gang med at interviewe unge på tre steder: på Bornholm, i Vendsyssel og i Sønderjylland. På Bornholm indgik blandt andet Paradisbakkeskolen i Nexø. Sprogforandringscentret var grundlagt i 2005 med en bevilling fra Danmarks Grundforskningsfond.',
        'Et første, foreløbigt resultat kom i september 2015. Unge i Sønderjylland og Vendsyssel talte dialekt, mens unge på Bornholm stort set ikke længere talte bornholmsk. Resultatet var foreløbigt, fordi undersøgelsen lige var begyndt. Bornholm er det af de tre områder, der ligger mest isoleret, men forskeren ville endnu ikke gætte på, om det havde noget med forskellen at gøre. Forskeren regnede med, at feltarbejdet ville tage omkring et år, før man kunne sige mere om årsagen. Det var altså ikke afklaret, hvorfor Bornholm skilte sig ud.',
        'I december 2015 beskrev en sprogforsker fra Københavns Universitet Danmark som et af de mest standardiserede lande i Europa. Sprogforskeren formodede, at dialekterne forsvandt hurtigere end før, fordi mobiliteten var høj, og fordi tv og medier gav kontakt med langt flere mennesker end tidligere. Det var kun en formodning.',
        'I januar 2024 beskrev Center for Dialektforskning en undersøgelse af sønderjysk. På hvert sted, forskerne besøgte, fulgte de en 9. klasse i skole- og fritidsliv, og de interviewede udvalgte forældre og bedsteforældre, så tre generationer kunne sammenlignes. Resultatet var, at der stadig var unge sønderjyder, der talte dialekt. De talte dog ikke sønderjysk på samme måde som deres forældre og bedsteforældre, og alle ændringer på nær én gik i retning af standarddansk.',
        'Bornholmsk har sit eget projekt. I 2019 havde forskere ved Københavns Universitet udviklet en forløber for en slags Google Translate, der kan oversætte fra bornholmsk til dansk og omvendt. Systemet var trænet på små 180.000 ord fra bornholmske tekster, og målet var mindst en million ord. Godt 30 frivillige bornholmere deltog, og deres gennemsnitsalder var lige over 70 år.',
        'Udsagnene hører til tre forskellige år: 2015, 2019 og 2024. De viser, hvad forskerne vidste og mente på de tidspunkter, og de fortæller ikke, hvordan unge talte senere. Årsagen til forskellen mellem Bornholm og Sønderjylland var åben i 2015, og kilderne i teksten giver ikke noget svar.'
      ],
      questions: [
        {
          id: 'art-dialekter-q1',
          q: 'Hvad viste det foreløbige resultat fra 2015 om de unge i de tre områder?',
          options: [
            'Unge på Bornholm og i Vendsyssel talte dialekt, mens unge i Sønderjylland stort set ikke gjorde.',
            'Unge i Sønderjylland og Vendsyssel talte dialekt, mens unge på Bornholm stort set ikke længere talte bornholmsk.',
            'Forskerne interviewede blandt andet unge på en skole i Nexø.'
          ],
          correct: 1,
          evidence: 1,
          note: 'Teksten skelner mellem Bornholm på den ene side og Sønderjylland og Vendsyssel på den anden; Nexø-skolen er et sted, ikke et resultat.'
        },
        {
          id: 'art-dialekter-q2',
          q: 'Hvad vidste forskeren i 2015 om årsagen til, at Bornholm skilte sig ud?',
          options: [
            'Forskeren ville endnu ikke gætte på en årsag, selv om Bornholm er det mest isolerede af de tre områder.',
            'Forskeren forklarede, at isolationen var årsagen til, at de unge ikke talte bornholmsk.',
            'Sprogforandringscentret var grundlagt i 2005 med en bevilling fra Danmarks Grundforskningsfond.'
          ],
          correct: 0,
          evidence: 1,
          note: 'Isolationen nævnes kun som en kendsgerning om området og ikke som bevist årsag; centrets grundlæggelse svarer ikke på spørgsmålet.'
        },
        {
          id: 'art-dialekter-q3',
          q: 'Hvad kunne den forløber til et oversættelsesprogram, som forskere havde udviklet i 2019?',
          options: [
            'Den var trænet på mindst en million ord fra bornholmske tekster.',
            'Godt 30 frivillige bornholmere deltog i projektet.',
            'Den kunne oversætte fra bornholmsk til dansk og omvendt.'
          ],
          correct: 2,
          evidence: 4,
          note: 'Systemet var trænet på små 180.000 ord; en million var kun målet. De frivillige beskriver projektet, ikke hvad programmet kunne.'
        }
      ],
      sources: [
        'https://www.dr.dk/nyheder/regionale/bornholm/soenderjysk-og-vendelbomaal-overlever-bornholmsk-doer',
        'https://www.dr.dk/nyheder/kultur/danske-dialekter-forsvinder-hurtigere-end-nogensinde',
        'https://dialekt.ku.dk/maanedens_emne/soenderjysk-udtale-og-boejning-gennem-tre-generationer/',
        'https://dgcss.hum.ku.dk/om/',
        'https://videnskab.dk/kultur-samfund/kunstig-intelligens-skal-redde-det-bornholmske-sprog-om-et-par-generationer-er-det-uddoedt/'
      ],
      verify: true
    },
    {
      id: 'art-efterskole',
      mode: 'mc',
      level: 'B1',
      title: 'Efterskole: hvem går, og hvad koster det?',
      genre: 'baggrund',
      kicker: 'Baggrund · Uddannelse',
      // Traceability: paragraph (1-based, = data-par) -> fact in docs/laeseforstaaelse/facts/art-efterskole.md
      // (CONFIRMED lines only; no motives, no start/end months, no amount of elevstøtte)
      //   1 unge mellem 14 og 18 år, bor og går i skole sammen: F6; typisk 42 uger: F7
      //   2 august 2026, 30.911 i 2026/27, heraf 24.804 i 10. klasse: F1, F2; 36,2 procent af årgangen (kun 10. klasse), mere end hver tredje 15-årige,
      //     højeste i Efterskolernes ti-årige opgørelse, ti år tidligere 28,8 procent: F2, F3 (+ VERIFY-1 safe list); 31.018 i 2025/26: F5
      //   3 238 efterskoler, august 2025: F4 (234 is only the number of schools that answered the 2026 survey, not used)
      //   4 typisk 50.000-100.000 kr. egenbetaling, efter statens støtte: F8; støtte afhænger af forældrenes indkomst: F9;
      //     eksempel 2025/26: 58.800 kr. ved samlet pris 119.700 kr. og forældreindkomst 400.000 kr.: F10
      //   5 taxametertilskud efter årselever, minimumsbeløb for elevbetaling, tal fra 2023: F11, F12
      //   6 closing: years and scopes of the figures above; no new claim
      // Derived figures: none (no sum, ratio or difference is printed).
      paragraphs: [
        'En efterskole er en skole for unge mellem 14 og 18 år. Eleverne bor og går i skole sammen. Et efterskoleophold varer typisk 42 uger.',
        'I august 2026 startede 30.911 unge på efterskole i skoleåret 2026/27. Af dem gik 24.804 i 10. klasse. Det svarer til 36,2 procent af hele årgangen, altså mere end hver tredje 15-årige. Procenten gælder kun dem, der gik i 10. klasse på efterskole. Andre klassetrin er ikke med i tallet. Ti år tidligere var andelen 28,8 procent, og 36,2 procent er den højeste andel i Efterskolernes ti-årige opgørelse. Året før, i 2025/26, startede 31.018 elever på efterskole, så det samlede elevtal var lidt lavere i 2026/27.',
        'Der var 238 efterskoler i Danmark ved skolestart i august 2025. Elevtallene og skoletallet hører altså til to forskellige år.',
        'Et efterskoleophold koster penge. Forældrene betaler typisk mellem 50.000 og 100.000 kr. Det er det beløb, de selv skal betale, efter at staten har givet støtte. Støttens størrelse afhænger af, hvor meget forældrene tjener. Et eksempel fra skoleåret 2025/26 viser, hvordan det kan se ud: Koster opholdet i alt 119.700 kr., og tjener forældrene samlet 400.000 kr., er egenbetalingen for ét barn 58.800 kr. Eksemplet er kun én mulighed, for beløbet ændrer sig med indkomsten.',
        'Staten støtter også selve skolerne. Ifølge en oversigt med tal fra 2023 bestod det meste af tilskuddet af taxametertilskud, som blev beregnet ud fra antallet af årselever. Tilskuddet var betinget af, at eleverne også selv betalte. Hvert år blev der fastsat et minimumsbeløb for elevbetalingen. Skolerne kunne altså ikke få statens penge uden betaling fra eleverne.',
        'Tallene i teksten har forskellige år. Elevtallene gælder skoleårene 2025/26 og 2026/27, antallet af skoler gælder august 2025, og reglerne for tilskuddet er fra 2023. Prisen for forældrene er et typisk interval og ikke en fast pris.'
      ],
      questions: [
        {
          id: 'art-efterskole-q1',
          q: 'Hvor mange af de unge, der startede på efterskole i skoleåret 2026/27, gik i 10. klasse?',
          options: [
            '30.911',
            '24.804',
            '31.018'
          ],
          correct: 1,
          evidence: 1,
          note: '30.911 er alle elever i 2026/27, og 31.018 er det samlede tal for 2025/26; 24.804 gik i 10. klasse.'
        },
        {
          id: 'art-efterskole-q2',
          q: 'Hvad står der i teksten om statens støtte til forældre, hvis barn går på efterskole?',
          options: [
            'Støtten er den samme for alle forældre, uanset hvad de tjener.',
            'Et efterskoleophold varer typisk 42 uger.',
            'Støttens størrelse afhænger af, hvor meget forældrene tjener.'
          ],
          correct: 2,
          evidence: 3,
          note: 'Støtten afhænger af forældrenes indkomst; opholdets længde er sand, men svarer ikke på spørgsmålet om støtten.'
        },
        {
          id: 'art-efterskole-q3',
          q: 'Hvad var en betingelse for statens tilskud til skolerne ifølge oversigten med tal fra 2023?',
          options: [
            'At eleverne også selv betalte mindst et beløb, som blev fastsat hvert år.',
            'At skolen havde mindst 238 elever.',
            'At det meste af tilskuddet blev beregnet ud fra antallet af årselever.'
          ],
          correct: 0,
          evidence: 4,
          note: 'Tilskuddet var betinget af elevbetaling; at taxametertilskuddet blev beregnet efter årselever er sandt, men er ikke en betingelse.'
        }
      ],
      sources: [
        'https://www.efterskolerne.dk/om-efterskoleforeningen/nyheder/analyser/pressemeddelelse-rekordstor-andel-gaar-i-10-klasse-paa-efterskole/',
        'https://www.efterskolerne.dk/om-efterskoleforeningen/nyheder/analyser/nye-elevtal-over-en-tredjedel-af-en-ungdomsaargang-vaelger-fortsat-efterskole/',
        'https://www.vifo.dk/om-folkeoplysning/efterskoler/',
        'https://www.efterskolerne.dk/da/Pris/Hvad_koster_det',
        'https://lifeindenmark.borger.dk/school-and-education/school/lower-secondary-boarding-schools'
      ],
      verify: true
    }
  ];
})();
