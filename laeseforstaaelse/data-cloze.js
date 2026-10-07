// Læseforståelse, mode 'cloze' (Sæt ord ind): one article, eight gaps, four connectors or adverbs per gap.
// Rules: .claude/skills/laese-text-authoring/SKILL.md. Facts: docs/laeseforstaaelse/facts/{art-bakken,art-cykelsti,art-gaekkebrev}.md
// (CONFIRMED lines and the VERIFY-2 "safe to use" lists only). Gap markers {{1}}..{{8}} appear in order, once each.
// Every gap names its relation; the wrong options fail for the reason written in the per-text table below.
(function () {
  'use strict';
  window.LAESE_CLOZE = [

    // =====================================================================================
    // art-bakken (baggrund)
    // Traceability: paragraph (1-based) -> fact in docs/laeseforstaaelse/facts/art-bakken.md
    //   1 Jægersborg Dyrehave ved Klampenborg nord for København: F4, F8; navnet Dyrehavsbakken (titel på lex.dk/Wikipedia-kilderne); gammel kongelig dyrehave: F6, F7;
    //     36 forlystelser ifølge Bakkens egen hjemmeside, udateret, andre kilder har andre tal: F9 + Conflicts; sagn og dyrehave er almindelig ordforklaring
    //   2 ifølge sagnet fandt Kirsten Piil en (hellig) kilde i 1583: F1; københavnerne drak vandet, byens vand var dårligt, mange troede det var sundt og kunne helbrede: F2 (+ note);
    //     stavemåden Kirstine Piil: Conflicts (name)
    //   3 regnes for verdens ældste forlystelsespark, der stadig er i drift: F3; 1583 = sagnets årstal, ikke arkivdato: F1, F3 notes
    //   4 Christian V konge 1670, elskede parforcejagt, udvidede sin fars dyrehave til det firdobbelte ("fire gange så stor" = firdoblet): F7; Frederik V åbnede haven officielt 1746 og gav fri adgang til Dyrehaven 1756: F6;
    //     adgangen gjaldt haven, ikke Bakken, og 1756 er ikke begyndelsen på Bakkens entré: F6 note
    //   5 gratis entré (Bakkens egne ord, "altid"), man betaler for forlystelserne, også ved koncerter og børneunderholdning: F5; ingen start-årstal på hjemmesiden: F5 note + UNCONFIRMED
    //   6 gæsterne betaler ikke entré, så besøgstallet kan ikke gøres nøjagtigt op: F10; anslået 1,8 mio. i 2025, andre kilder har andre tal: F10 + Conflicts;
    //     "ingen billetter at tælle" og "ingen kan sige præcis" er læsning af "kan ikke gøres nøjagtigt op" (F10)
    //   7 sagn 1583 / Dyrehave 1756 / entré: F1, F6, F5 (adskillelsen er sheetens egen ramme)
    // Derived figures: none. Not used: 2,5-2,9 mio., 32/33 forlystelser, navngivningsåret for Jægersborg Dyrehave, 1732.
    // Gap table: gap -> type -> relation -> why each wrong option fails
    //   c1 tid: Kirsten Piil finder kilden, derefter tager københavnerne derud. Tidligere: wrong order. Alligevel: nothing in the context is a concession. I stedet: nothing is replaced.
    //   c2 praecisering (nemlig): byens dårlige vand forklarer, hvorfor man drog til kilden. dog: no contrast. derfor: reverses the cause. alligevel: no concession.
    //   c3 kontrast (Dog): parken regnes for verdens ældste, men 1583 er kun sagnets årstal. Derfor: the second sentence does not follow from the first. Senere / Tidligere: no time order is stated.
    //   c4 tid (Senere): Frederik V (1746) kom efter Christian V (konge 1670). Tidligere: reverses the order. Samtidig: the two kings are 76 years apart. Derfor: no cause is stated.
    //   c5 kontrast (imidlertid): man skulle tro, der er entré, men Bakken skriver, at der altid er gratis entré. nemlig: gives a reason where there is a contradiction. desuden: adds instead of opposing. derfor: not a consequence.
    //   c6 kontrast (Til gengæld): ingen betaling for entré, til gengæld betaler man for forlystelserne. Heraf: nothing is a part of something. Tidligere / Senere: no time order.
    //   c7 tilfoejelse (Desuden): entréen er også gratis ved koncerter og børneunderholdning. Derfor: not a consequence of paying for rides. Senere: no time order. Heraf: not a part of the previous sentence.
    //   c8 konsekvens (derfor): ingen betaler entré, så besøgstallet kan ikke gøres nøjagtigt op. alligevel / dog: would suggest the count should have been easy. senere: no time order.
    // =====================================================================================
    {
      id: 'art-bakken',
      mode: 'cloze',
      level: 'B1',
      title: 'Bakken, sagnet og den gratis entré',
      genre: 'baggrund',
      kicker: 'Baggrund · Kultur',
      paragraphs: [
        'Bakken er en forlystelsespark i Jægersborg Dyrehave ved Klampenborg, nord for København. Parken hedder også Dyrehavsbakken. Den ligger i en skov, som er en gammel kongelig dyrehave. En dyrehave er et stort område med vilde dyr, hvor kongen kunne jage. Ifølge Bakkens egen hjemmeside er der 36 forlystelser i parken. Tallet er ikke dateret, og andre kilder nævner et lidt andet antal, så det er ikke en præcis optælling. Historien om Bakken begynder ikke med en forlystelse. Den begynder med en kilde i skoven, og den historie er et sagn. Et sagn er en gammel fortælling, som folk har fortalt videre, men som ingen kan bevise.',
        'Ifølge sagnet fandt Kirsten Piil en hellig kilde i skoven i 1583. {{1}} tog københavnerne ud for at drikke af vandet. Vandet i byen var {{2}} dårligt på den tid, og mange troede, at kildevandet var sundt og kunne helbrede. Nogle steder staves navnet Kirstine Piil, men det er den samme kvinde i sagnet. Sagnet kan ingen bevise, men det hører med til Bakkens historie.',
        'Parken regnes for verdens ældste forlystelsespark, der stadig er i drift. {{3}} er 1583 kun sagnets årstal, og det er ikke et dokumenteret åbningsår. Man skal derfor læse tallet som en tradition og ikke som en dato fra et arkiv. Det er en grund til at være forsigtig, når man hører, at Bakken er verdens ældste forlystelsespark.',
        'Dyrehaven har også en kongelig historie. Christian V blev konge i 1670, og han elskede parforcejagt, som er jagt med heste og hunde. Han udvidede sin fars dyrehave til det firdobbelte, så den blev fire gange så stor. {{4}} åbnede Frederik V haven officielt i 1746, og i 1756 gav han alle fri adgang til den kongelige Dyrehave. Den adgang gjaldt haven. Den gjaldt ikke selve Bakken, så årstallet 1756 er ikke begyndelsen på Bakkens gratis entré.',
        'Entré er prisen for at komme ind på et sted, for eksempel ved en indgang. Man skulle tro, at en park med så mange forlystelser tager entré. Bakken skriver {{5}} selv, at der altid har været gratis entré. Man kan altså gå ind i parken uden at betale. {{6}} betaler man for de enkelte forlystelser. {{7}} gælder den frie entré, selv når der er koncerter og børneunderholdning. Bakkens hjemmeside har ikke noget årstal for, hvornår den frie entré begyndte. Ordet altid er Bakkens eget.',
        'Gratis entré har en bagside. Gæsterne betaler ikke entré, og {{8}} kan det årlige besøgstal ikke gøres nøjagtigt op. Uden entré er der ingen billetter at tælle, og det betyder, at ingen kan sige præcis, hvor mange der kommer. For 2025 er tallet anslået til 1,8 millioner gæster, men andre kilder nævner andre tal, så det er kun ét skøn blandt flere. Anslået betyder, at tallet er et skøn og ikke en optælling.',
        'Når man læser om Bakken, er det nyttigt at holde tre ting adskilt: sagnet fra 1583, kongens frie adgang til haven i 1756 og den gratis entré, som Bakken selv beskriver. De hører til tre forskellige historier, og kun den sidste handler om, hvad der gælder på Bakken nu.'
      ],
      gaps: [
        { id: 'art-bakken-c1', type: 'tid', options: ['Tidligere', 'Alligevel', 'Derefter', 'I stedet'], correct: 2,
          note: 'Tid: først finder Kirsten Piil kilden, derefter tager københavnerne derud.' },
        { id: 'art-bakken-c2', type: 'praecisering', options: ['dog', 'derfor', 'nemlig', 'alligevel'], correct: 2,
          note: 'Begrundelse: at byens vand var dårligt, forklarer, hvorfor københavnerne tog til kilden.' },
        { id: 'art-bakken-c3', type: 'kontrast', options: ['Derfor', 'Senere', 'Tidligere', 'Dog'], correct: 3,
          note: 'Modsætning: parken regnes for verdens ældste, men 1583 er kun sagnets årstal.' },
        { id: 'art-bakken-c4', type: 'tid', options: ['Samtidig', 'Tidligere', 'Derfor', 'Senere'], correct: 3,
          note: 'Tid: Frederik V kom efter Christian V, der blev konge i 1670; 1746 ligger efter.' },
        { id: 'art-bakken-c5', type: 'kontrast', options: ['nemlig', 'imidlertid', 'desuden', 'derfor'], correct: 1,
          note: 'Modsætning: man skulle tro, at der er entré, men Bakken skriver, at den er gratis.' },
        { id: 'art-bakken-c6', type: 'kontrast', options: ['Heraf', 'Tidligere', 'Til gengæld', 'Senere'], correct: 2,
          note: 'Modsætning: ingen betaling for entré, til gengæld betaler man for forlystelserne.' },
        { id: 'art-bakken-c7', type: 'tilfoejelse', options: ['Derfor', 'Desuden', 'Senere', 'Heraf'], correct: 1,
          note: 'Tilføjelse: den frie entré gælder også ved koncerter og børneunderholdning.' },
        { id: 'art-bakken-c8', type: 'konsekvens', options: ['alligevel', 'derfor', 'dog', 'senere'], correct: 1,
          note: 'Følge: ingen betaler entré, så besøgstallet kan ikke gøres nøjagtigt op.' }
      ],
      sources: [
        'https://lex.dk/Dyrehavsbakken',
        'https://en.wikipedia.org/wiki/Dyrehavsbakken',
        'https://da.wikipedia.org/wiki/Dyrehavsbakken',
        'https://www.bakken.dk/',
        'https://www.bakken.dk/om-bakken/bakkens-historie/bakkens-historie-kapitel-3/'
      ],
      verify: true
    },

    // =====================================================================================
    // art-cykelsti (forklaring)
    // Traceability: paragraph (1-based) -> fact in docs/laeseforstaaelse/facts/art-cykelsti.md
    //   1 cykelpendlerruter (page wording): F2 headline; 27 kommuner + region, vision over 850 km / mere end 60 ruter i 2045: F10 + VERIFY-2; 244 km på 16 ruter i 2024: F1; 21 af 27 kommuner: F1 note; pendler = ordforklaring
    //   2 Albertslundruten (C99) Danmarks første cykelsupersti, åbnet lørdag 14. april 2012, gennem fem kommuner (Albertslund, Glostrup, Rødovre, Frederiksberg, København = 5): F4 (længde udeladt, F5);
    //     flere ruter siden (1 rute i 2012 -> 16 ruter i 2024): F4 + F1
    //   3 +87 % i gennemsnit fra førmålinger til tællinger 2024, gennemsnit af de 16 ruter: F2 ("næsten dobbelt så meget" = 1,87 gange); 12 km pr. tur: F3; 14 % af de nye cyklister tog før bilen: F3
    //   4 Cykelslangen: bro for cyklister (navnet; ikke i sheet), indviet sommeren 2014, Dybbølsbro til Havneholmen, fortsættelse af Bryggebroen (indviet 2006): F6 (længde udeladt: 230/235 m); "i København" er stedsnavnene
    //   5 målet 50 % i 2025, 43 % i 2025, 46 % i 2024, turene til arbejde og uddannelse i København: F7; "tre procentpoint" = 46 - 43; "under halvdelen i begge år" = 46 og 43 < 50
    //   6 areal mellem husene i København 2025, uden parker og grønne områder: kørebaner 49 %, fodgængerarealer 32 % (fortove, gågader, torve, pladser), cykelstier og cykelbaner 6 %, 4 % fælles gang- og cykelstier (ikke i de 6 %), bilparkering 8 %, cykelparkering 1 %: F8 + VERIFY-2;
    //     "ture vs. areal kan ikke sammenlignes direkte" er forbehold, ikke fakta; ingen kvotient mellem andelene brugt
    //   7 401 km cykelsti i København 2025, heraf 64 km supercykelsti: F9; "arealet er givet, så mere plads til cyklister betyder mindre til andet" er logik, ikke fakta; sidste sætning om 2025-tallene: F7, F8
    // Derived figures: 87 % -> "næsten dobbelt" (F2); 46 - 43 = 3 procentpoint (F7); fem kommuner (F4). Not used: 47/55/31 %, 7 % of street space, 220 km / 28 routes, lengths of Albertslundruten and Cykelslangen.
    // Gap table: gap -> type -> relation -> why each wrong option fails
    //   c1 tid (Foreløbig): visionen gælder 2045, 244 km i 2024 er et mellemtrin. Derfor: 244 km is not a consequence of the vision. Heraf: nothing is split. Tidligere: 2024 is not before something else here.
    //   c2 tid (Siden): efter 2012 er der kommet flere ruter til. Tidligere: reverses the order. Heraf: nothing is split. Dengang: points to the past, but the new routes came after 2012.
    //   c3 tilfoejelse (Desuden): endnu en oplysning om evalueringen. Derfor: the 14 % is not caused by the 12 km. Alligevel: nothing is conceded. I stedet: nothing is replaced.
    //   c4 praecisering (Mere præcist): "i København" gøres præcist med de to steder. Derfor: no cause. Alligevel: no concession. Tværtimod: no negated claim to contradict.
    //   c5 kontrast (Alligevel): målet var 50 %, alligevel blev det 43 %. Derfor: the result is not a consequence of the goal. Desuden: it does not add anything. Tidligere: 2025 is not earlier.
    //   c6 kontrast (dog): kørebaner og fodgængerarealer fylder 49 % og 32 %, cykelstier og cykelbaner dog kun 6 %. nemlig: gives no reason. derfor: not a consequence. også: there is no earlier "only" to add to.
    //   c7 tilfoejelse (Dertil): de 4 % er en anden slags sti, som kommer oveni de 6 %. Heraf: would make the 4 % a part of the 6 %, which the text rules out. Derfor: no cause. Senere: no time order.
    //   c8 praecisering (Heraf): 64 km af de 401 km er supercykelsti. Dertil: would add 64 km to the 401 km. Derfor: no cause. Desuden: adds, but the 64 km is part of the 401 km.
    // =====================================================================================
    {
      id: 'art-cykelsti',
      mode: 'cloze',
      level: 'B1',
      title: 'Supercykelstier og pladsen i byen',
      genre: 'forklaring',
      kicker: 'Forklaring · Trafik',
      paragraphs: [
        'Supercykelstier er ruter for cykelpendlere. En pendler er en person, der cykler eller kører langt til arbejde eller uddannelse. Samarbejdet mellem 27 kommuner og regionen har en vision om over 850 km supercykelsti på mere end 60 ruter i 2045. {{1}} var der i 2024 244 km på 16 ruter, og ruterne forbandt 21 af de 27 kommuner.',
        'Danmarks første cykelsupersti er Albertslundruten, som også hedder C99. Den åbnede lørdag den 14. april 2012 og går gennem Albertslund, Glostrup, Rødovre, Frederiksberg og København. Ruten går altså gennem fem kommuner. {{2}} er der kommet flere ruter til, så der i 2024 var 16 ruter i alt.',
        'På de 16 ruter steg cykeltrafikken i gennemsnit med 87 %. Det betyder, at der blev cyklet næsten dobbelt så meget som før. Tallet måler stigningen fra førmålingerne til tællingerne i 2024, og det er et gennemsnit af alle 16 ruter, så nogle ruter kan have haft en større stigning og andre en mindre. En førmåling er en tælling fra tidligere, som man kan sammenligne med. En gennemsnitlig tur på en supercykelsti er 12 km. {{3}} tog 14 % af de nye cyklister på ruterne før bilen.',
        'Cykelslangen er en bro for cyklister i København. {{4}} går den fra Dybbølsbro til Havneholmen som en fortsættelse af Bryggebroen. Cykelslangen blev indviet i sommeren 2014, mens Bryggebroen blev indviet i 2006. At indvie en bro betyder at åbne den officielt. De to broer ligger altså i forlængelse af hinanden.',
        'Cyklen er vigtig for turene til arbejde og uddannelse i København. En strategi er en plan for, hvad man vil opnå. Målet i cykelstrategien var, at 50 % af turene skulle foregå på cykel i 2025. {{5}} blev andelen 43 % i 2025, mod 46 % i 2024. Andelen er altså lavere end målet og tre procentpoint lavere end året før. I begge år blev under halvdelen af turene foretaget på cykel.',
        'Turene og pladsen er to forskellige slags tal: Det ene tæller ture, og det andet måler areal, så man kan ikke sammenligne dem direkte. Men det er værd at se på, hvordan pladsen mellem husene er fordelt. Tallene gælder Københavns Kommune. Fodgængerarealer er fortove, gågader, torve og pladser. Uden parker og grønne områder udgjorde kørebaner 49 % af arealet mellem husene i København i 2025, og fodgængerarealer udgjorde 32 %. Cykelstier og cykelbaner udgjorde {{6}} kun 6 %. {{7}} var der 4 % fælles gang- og cykelstier, som ikke er talt med i de 6 %. Bilparkering udgjorde 8 % af arealet, og cykelparkering udgjorde 1 %. Kørebaner udgjorde altså en langt større andel end cykelstier og cykelbaner, og bilparkering udgjorde en større andel end cykelparkering.',
        'I 2025 var der 401 km cykelsti i København. {{8}} var 64 km supercykelsti, og resten var andre slags cykelstier. Supercykelstier er altså kun en del af alle cykelstier. Arealet mellem husene er givet, så mere plads til cyklister betyder mindre plads til noget andet, for eksempel kørebaner eller parkering. Tallene fra 2025 viser, hvordan pladsen var fordelt, men de siger ikke, hvordan den bør fordeles.'
      ],
      gaps: [
        { id: 'art-cykelsti-c1', type: 'tid', options: ['Derfor', 'Foreløbig', 'Heraf', 'Tidligere'], correct: 1,
          note: 'Tid: visionen gælder 2045, så 244 km i 2024 er foreløbig kun et mellemtrin.' },
        { id: 'art-cykelsti-c2', type: 'tid', options: ['Tidligere', 'Siden', 'Heraf', 'Dengang'], correct: 1,
          note: 'Tid: efter åbningen i 2012 er der kommet flere ruter til.' },
        { id: 'art-cykelsti-c3', type: 'tilfoejelse', options: ['Derfor', 'Alligevel', 'Desuden', 'I stedet'], correct: 2,
          note: 'Tilføjelse: endnu en oplysning fra evalueringen af ruterne.' },
        { id: 'art-cykelsti-c4', type: 'praecisering', options: ['Derfor', 'Alligevel', 'Tværtimod', 'Mere præcist'], correct: 3,
          note: 'Præcisering: de to steder gør det præcist, hvor broen går i København.' },
        { id: 'art-cykelsti-c5', type: 'kontrast', options: ['Derfor', 'Desuden', 'Alligevel', 'Tidligere'], correct: 2,
          note: 'Modsætning: målet var 50 %, men andelen blev 43 %.' },
        { id: 'art-cykelsti-c6', type: 'kontrast', options: ['nemlig', 'dog', 'derfor', 'også'], correct: 1,
          note: 'Modsætning: kørebaner og fortove fylder meget, cykelstier og cykelbaner dog kun 6 %.' },
        { id: 'art-cykelsti-c7', type: 'tilfoejelse', options: ['Heraf', 'Dertil', 'Derfor', 'Senere'], correct: 1,
          note: 'Tilføjelse: de 4 % kommer oven i de 6 % og er ikke en del af dem.' },
        { id: 'art-cykelsti-c8', type: 'praecisering', options: ['Dertil', 'Derfor', 'Heraf', 'Desuden'], correct: 2,
          note: 'Præcisering: de 64 km er en del af de 401 km cykelsti.' }
      ],
      sources: [
        'https://supercykelstier.dk/blog/pressemeddelelse/supercykelstierne-virker-87-stigning-i-snit-paa-regionale-cykelpendlerruter-i-2024/',
        'https://www.mynewsdesk.com/dk/albertslund-kommune/news/albertslundruten-er-danmarks-foerste-cykelsupersti-38368',
        'https://supercykelstier.dk/rute/albertslundruten/',
        'https://lex.dk/Cykelslangen',
        'https://byudvikling.kk.dk/sites/default/files/2026-07/Mobilitetsredeg%C3%B8relse%202026_opt-a.pdf',
        'https://supercykelstier.dk/english/'
      ],
      verify: true
    },

    // =====================================================================================
    // art-gaekkebrev (baggrund)
    // Traceability: paragraph (1-based) -> fact in docs/laeseforstaaelse/facts/art-gaekkebrev.md
    //   1 klippet (fantasifuldt) og dekoreret brev med et lille vers, evt. en blomst: F1; vintergæk som tradition, sammen med det sirligt klippede brev: F5; dansk påsketradition: sheetens emne; vers/afsender/modtager er ordforklaring
    //   2 anonymt eller navn med prikker eller andre tegn: F2; én prik for hvert bogstav: F6; "fem/otte bogstaver, fem/otte prikker" er samme regel brugt på et eksempel (F6)
    //   3 bindebrevet som forløber, kom fra Tyskland, kendt i Danmark i 1600-tallet: F4; ældste kendte gækkebrev fra 1770, sendt til en kvinde i Odense (VERIFY-2 safe list, da.wikipedia), ikke traditionens start: F3
    //   4 tradition for at gætte inden palmesøndag, hvor påsken officielt begynder; ingen regel for hvornår: F8; tradition/regel er ordforklaring
    //   5 ifølge en udbredt regel skylder man et æg: F7 (gættet = afsenderen skylder, ikke gættet eller gættet forkert = modtageren skylder); tolkningen "modtageren får ægget" følger af reglen
    //   6 reglen findes i flere varianter: F7 note (da.wikipedia-variant, ikke nævnt)
    // Derived figures: "fem/otte bogstaver" (example of F6, not a fact). Not used: gæk = narre, 1800s egg history, sending window, Latin species, fejlgæt rule.
    // Gap table: gap -> type -> relation -> why each wrong option fails
    //   c1 tilfoejelse (Desuden): vintergækken er endnu en ting, der hører til brevet ved siden af verset. Alligevel: nothing is conceded. Derfor: the flower does not follow from the verse. Tidligere: no time order.
    //   c2 konsekvens (Derfor): anonymt eller prikker, derfor må modtageren gætte. Tidligere: no time order. Desuden: the guessing is a result, not an extra fact. Heraf: nothing is split.
    //   c3 praecisering (Med andre ord): én prik pr. bogstav sagt med et eksempel. Alligevel: no concession. Senere: no time order. Omvendt: nothing is reversed.
    //   c4 tid (Senere): bindebrevet kendes fra 1600-tallet, gækkebrevet kom senere. Tidligere: reverses the order (a forerunner comes before). Samtidig: a forerunner is not simultaneous. Alligevel: no concession.
    //   c5 kontrast (Dog): der er en tradition om palmesøndag, men ingen regel. Derfor: a tradition does not cause a missing rule. Senere: no time order. Heraf: nothing is split.
    //   c6 tid (Derefter): først gætter modtageren, derefter afgøres ægget. Tidligere: reverses the order. Samtidig: the egg depends on the guess, so it cannot be decided at the same time. Omvendt: nothing is reversed.
    //   c7 kontrast (Omvendt): bliver man gættet, skylder afsenderen et æg; omvendt skylder modtageren. Derefter: both cases cannot follow each other. Derfor: no cause. Heraf: nothing is split.
    //   c8 tilfoejelse (også): samme følge ved forkert gæt som ved ikke gættet. derfor: no cause. tidligere: no time order. omvendt: the same rule applies, not the opposite.
    // =====================================================================================
    {
      id: 'art-gaekkebrev',
      mode: 'cloze',
      level: 'B1',
      title: 'Gækkebrevet, en leg med påsken',
      genre: 'baggrund',
      kicker: 'Baggrund · Påske',
      paragraphs: [
        'Et gækkebrev er et brev, der er klippet ud på en fantasifuld måde og dekoreret, og det har et lille vers. Et vers er et kort digt. {{1}} lægger man traditionelt en vintergæk i brevet, og den ligger sammen med det sirligt klippede brev. Vintergækken er en lille blomst, men den er ikke et krav, for nogle breve har ingen blomst. Det er en dansk påsketradition, hvor man leger med at gætte, hvem der har sendt et brev. Den, der sender brevet, kalder man afsenderen. Den, der får det, kalder man modtageren.',
        'Afsenderen skriver ikke bare sit navn under brevet. Brevet er anonymt, altså uden navn, eller også skriver afsenderen sit navn med prikker eller andre tegn. {{2}} må modtageren gætte, hvem der har sendt det. Man skriver én prik for hvert bogstav i navnet. {{3}} får et navn med fem bogstaver fem prikker, og et navn med otte bogstaver får otte. Prikkerne er altså et fingerpeg, for modtageren kan tælle dem, men de afslører ikke navnet. Modtageren skal ikke kun læse verset. Modtageren skal også tænke over, hvem der kan have sendt brevet, og hvem der har et navn med lige så mange bogstaver, som der er prikker.',
        'Gækkebrevet har en forløber, som hedder bindebrevet. En forløber er noget, der kommer før. Et bindebrev kom fra Tyskland, og man kendte det i Danmark i 1600-tallet. Bindebrevet kom altså til Danmark udefra. {{4}} kom gækkebrevet, og det ældste gækkebrev, man kender til, er fra 1770. Det blev sendt til en kvinde i Odense. Det betyder ikke, at traditionen begyndte det år. Årstallet viser kun, hvilket brev der er bevaret, og det siger ikke noget om, hvornår man begyndte at sende dem, for bindebrevet kendte man jo allerede i 1600-tallet.',
        'Der er tradition for, at brevet gættes inden palmesøndag, hvor påsken officielt begynder. Det betyder, at brevet helst skal gættes, før påsken er begyndt. {{5}} findes der ingen regel for, hvornår man skal have gættet. Det er derfor op til den enkelte, hvornår man vil gætte. En tradition er noget, man gør, fordi andre har gjort det før, og en regel er noget, man skal følge.',
        'Modtageren gætter først. {{6}} afgøres det ifølge en udbredt regel, hvem der skylder et påskeæg. Skylder betyder, at man har pligt til at give noget. Bliver afsenderen gættet, skylder afsenderen modtageren et påskeæg, så modtageren får ægget ved at gætte rigtigt. {{7}} skylder modtageren afsenderen et påskeæg, hvis brevet ikke bliver gættet. Det gælder {{8}}, hvis der bliver gættet forkert. Modtageren får altså et æg, hvis modtageren gætter rigtigt, og afsenderen får et æg, hvis modtageren ikke gætter rigtigt. Æggene går altså kun mellem afsenderen og modtageren.',
        'Begge kan altså komme til at skylde et æg, og det gør brevet til en leg for to. Et gækkebrev er mere end papir: Det har et vers, traditionelt en vintergæk og en afsender, der er anonym eller skjult bag prikker. Reglen om ægget er udbredt, men den findes i flere varianter, så alle bruger den ikke på samme måde.'
      ],
      gaps: [
        { id: 'art-gaekkebrev-c1', type: 'tilfoejelse', options: ['Alligevel', 'Derfor', 'Desuden', 'Tidligere'], correct: 2,
          note: 'Tilføjelse: vintergækken er endnu en ting, der hører til brevet ved siden af verset.' },
        { id: 'art-gaekkebrev-c2', type: 'konsekvens', options: ['Tidligere', 'Derfor', 'Desuden', 'Heraf'], correct: 1,
          note: 'Følge: brevet er anonymt eller har prikker, så modtageren må gætte afsenderen.' },
        { id: 'art-gaekkebrev-c3', type: 'praecisering', options: ['Alligevel', 'Senere', 'Omvendt', 'Med andre ord'], correct: 3,
          note: 'Præcisering: reglen om én prik pr. bogstav sagt med et eksempel.' },
        { id: 'art-gaekkebrev-c4', type: 'tid', options: ['Samtidig', 'Tidligere', 'Senere', 'Alligevel'], correct: 2,
          note: 'Tid: bindebrevet kendes fra 1600-tallet, det ældste kendte gækkebrev er fra 1770.' },
        { id: 'art-gaekkebrev-c5', type: 'kontrast', options: ['Derfor', 'Senere', 'Dog', 'Heraf'], correct: 2,
          note: 'Modsætning: der er en tradition om palmesøndag, men ingen regel for tidspunktet.' },
        { id: 'art-gaekkebrev-c6', type: 'tid', options: ['Tidligere', 'Samtidig', 'Derefter', 'Omvendt'], correct: 2,
          note: 'Tid: først gætter modtageren, derefter afgøres det, hvem der skylder et æg.' },
        { id: 'art-gaekkebrev-c7', type: 'kontrast', options: ['Derefter', 'Omvendt', 'Derfor', 'Heraf'], correct: 1,
          note: 'Modsætning: bliver man gættet, skylder afsenderen et æg; omvendt skylder modtageren et.' },
        { id: 'art-gaekkebrev-c8', type: 'tilfoejelse', options: ['derfor', 'også', 'tidligere', 'omvendt'], correct: 1,
          note: 'Tilføjelse: samme følge, når brevet ikke gættes og når der gættes forkert.' }
      ],
      sources: [
        'https://lex.dk/g%C3%A6kkebrev',
        'https://bobedre.dk/paaske/hvorfor-sender-vi-gaekkebreve',
        'https://www.kristendom.dk/liv-sjael/fem-vigtige-ting-om-gaekkebrevet',
        'https://da.wikipedia.org/wiki/G%C3%A6kkebrev'
      ],
      verify: true
    }

  ];
})();
