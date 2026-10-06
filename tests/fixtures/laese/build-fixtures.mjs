// FIXTURE generator for tests/laeseforstaaelse-data.mjs. Node built-ins only.
//   node tests/fixtures/laese/build-fixtures.mjs
// Rewrites good/ and bad/<rule>/ next to this file. The prose is invented test material
// (cycle paths, a garden-association folder) written to obey .claude/skills/laese-text-authoring.
// It is NOT game content and must never be copied into laeseforstaaelse/data-*.js.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const clone = o => JSON.parse(JSON.stringify(o));

// ---------------------------------------------------------------- hæfte (skim)
const N = [
  ['Vanding',
   'Vandet i haveforeningen kommer fra egen boring og er gratis for medlemmer, men det er ikke ubegrænset. Hanerne på fællesarealet åbnes den 1. maj og lukkes igen den 30. september, så der er ikke vand i ledningerne uden for den periode. Vil du vande med slange, må du kun gøre det efter kl. 20 og før kl. 7. I dagtimerne skal du bruge vandkande, og du kan fylde den ved hanen bag redskabsskuret. Sprinklere er forbudt, fordi de bruger for meget vand på kort tid, og det kan tømme boringen midt på sommeren. Går en slange itu, eller drypper en hane, skal du straks lukke for vandet ved din egen stophane og skrive til vandudvalget. Stophanen sidder i en lille brønd ved siden af din havelåge og er mærket med dit havenummer. Opdager du et brud på hovedledningen, ringer du til vandudvalgets vagttelefon på 55 12 34 78. Telefonen er åben alle dage mellem kl. 8 og kl. 21. Uden for de tider kan du lægge en besked, og du får svar næste morgen. Bliver der indført vandforbud i en tør sommer, hænger udvalget en seddel op på opslagstavlen ved porten og sender en sms til alle medlemmer. Vandforbud betyder, at heller ikke vandkander må fyldes ved fællesarealets haner, og at du i stedet må hente vand i dit eget hus. Overtræder du forbuddet, får du en advarsel første gang og et gebyr på 300 kroner, hvis det sker igen.'],
  ['Affald og storskrald',
   'Husholdningsaffald lægges i de grønne containere ved porten, og glas og papir afleveres i de to klokker ved siden af. Containerne tømmes hver mandag, og om sommeren også hver torsdag fra den 1. juni til den 31. august. Havaffald som grene, græs og løv må ikke komme i containerne. Det køres i stedet til komposthaugen bag parkeringspladsen, som er åben for medlemmer hver lørdag mellem kl. 9 og kl. 14. Haugen må ikke bruges til sten, jord, planter med rodnet eller trykimprægneret træ. Storskrald hentes af kommunen fire gange om året, den første tirsdag i marts, juni, september og december. Du skal selv tilmelde det til kommunen senest fem hverdage før afhentningen, og du stiller tingene ved porten tidligst aftenen før. Møbler, hvidevarer og store stykker træ regnes som storskrald, men batterier, maling og kemikalier skal du aflevere på genbrugspladsen på Industrivej 12. Pladsen er åben alle hverdage fra kl. 10 til kl. 18 og i weekenden fra kl. 10 til kl. 16. Haveforeningens medlemmer afleverer gratis, hvis de viser deres medlemskort. Står der affald uden for containerne, rydder vedligeholdelsesudvalget op, og udgiften på 450 kroner deles mellem de haver, hvor affaldet kan spores til. Er du i tvivl om, hvor noget hører hjemme, kan du spørge vedligeholdelsesudvalget på mail, før du kører det væk.'],
  ['Fællesarbejde',
   'Alle medlemmer deltager i fællesarbejde to gange om året, den første lørdag i april og den sidste lørdag i oktober. Vi mødes ved fælleshuset kl. 9, og arbejdet slutter senest kl. 13 med en let frokost, som foreningen betaler. Opgaverne fordeles af vedligeholdelsesudvalget ugen før og hænges op på opslagstavlen. Typiske opgaver er at klippe hække langs fællesstierne, feje grus, male bænke og rense render. Du medbringer selv handsker og de redskaber, du plejer at bruge i din egen have. Større maskiner som hækklipper og kantskærer kan lånes i redskabsskuret mod en underskrift i den blå bog. Kan du ikke komme, skal du melde afbud til formanden senest tre dage før på telefon 55 12 34 90 eller på mail. Du kan sende en stedfortræder, for eksempel et voksent familiemedlem, men personen skal være over 16 år. Udebliver du uden afbud, opkræver kassereren et gebyr på 400 kroner pr. gang. Gebyret går til indkøb af nye redskaber. Medlemmer over 75 år er fritaget for fællesarbejde, men de er velkomne til frokosten. Hvis vejret er dårligt, aflyser formanden senest kl. 7 om morgenen, og beskeden sendes som sms. Fællesarbejdet rykkes i så fald til den følgende lørdag på samme tidspunkt. Datoen for det næste fællesarbejde står altid på opslagstavlen ved porten, så du kan sætte den i kalenderen i god tid.'],
  ['Fælleshuset',
   'Fælleshuset kan lejes af medlemmer til private fester og møder. Huset har plads til 40 personer, et lille køkken med komfur og opvaskemaskine og et toilet med adgang for kørestole. Leje koster 600 kroner for en hel dag og 350 kroner for en aften efter kl. 17. Dertil kommer et depositum på 1.000 kroner, som du får tilbage, når nøglen er afleveret og huset er gjort rent. Du booker ved at skrive til husudvalget, og bookinger tages tidligst et år før og senest 14 dage før arrangementet. Nøglen hentes hos husudvalgets formand fredag mellem kl. 16 og kl. 18 og afleveres igen mandag inden kl. 10. Musik skal slukkes senest kl. 23 på hverdage og kl. 1 i weekenden, fordi nabohusene ligger tæt på. Stearinlys må ikke brændes uden opsyn, og rygning er kun tilladt udendørs ved siden af askebægeret ved døren. Efter brug skal du feje gulv, vaske borde, tømme køleskabet og tage skraldeposen med til containerne. Findes der skader, skal du skrive det på sedlen ved indgangen, ellers hæfter du for udgiften. Til foreningens egne møder er huset gratis, og det samme gælder bestyrelsens arbejdsmøder, som afholdes den første torsdag i hver måned kl. 19. Vil du bruge huset til noget andet, kan du spørge husudvalget, som afgør sagen på næste møde.'],
  ['Parkering og bom',
   'Bilen parkeres på parkeringspladsen foran porten, og der er plads til 60 biler. Hvert medlem har ret til én fast plads, som er mærket med havenummeret, og gæsterne bruger de 12 pladser nærmest porten. Gæster må holde i højst 48 timer ad gangen. Vil gæsten blive længere, skal du aftale det med pladsudvalget og få et gæstekort, som koster 50 kroner pr. døgn. Bommen ved indkørslen åbnes med en brik, og den første brik er gratis. Mister du den, koster en ny 150 kroner. Bommen er låst fra kl. 22 til kl. 6, så du kan ikke køre ind eller ud i de timer, og der er heller ikke adgang for varebiler. Leverancer af brænde, jord eller sten leveres i stedet mellem kl. 7 og kl. 15 på hverdage og kl. 9 til kl. 12 om lørdagen. Du må ikke køre ind på fællesstierne med bil, men trillebør og cykler er tilladt. Hastigheden på pladsen er 10 kilometer i timen, og der må ikke vaskes biler eller skiftes olie. Cykler stilles i cykelstativet ved fælleshuset. Står en bil forkert, sætter pladsudvalget en seddel under vinduet første gang og kræver et gebyr på 200 kroner anden gang. Spørgsmål til pladsudvalget kan du stille på telefon 55 12 34 56 mellem kl. 17 og kl. 19 om tirsdagen. Uden for de tider kan du skrive til udvalget, og så får du svar inden for en uge.'],
  ['Dyr og støj',
   'Hunde skal være i snor på fællesarealerne, og ejeren skal samle efter dem. På den enkelte have må hunden gå frit, hvis haven har et hegn, der er mindst 120 centimeter højt. Højst to hunde pr. have er tilladt. Katte kan løbe frit, men de må ikke fodres på fællesarealerne, fordi det tiltrækker rotter. Høns er ikke tilladt, men bistader kan godkendes af bestyrelsen, hvis naboerne på begge sider skriftligt har sagt ja. Ansøgningen sendes senest den 1. marts, og svaret kommer i løbet af 14 dage. Støjende arbejde med motorsav, græsklipper, kantskærer og bore- eller slibemaskiner er tilladt på hverdage mellem kl. 8 og kl. 18 og om lørdagen mellem kl. 9 og kl. 15. Om søndagen og på helligdage er det forbudt. Hvert år fra den 1. juni til den 31. august gælder der desuden stilletid mellem kl. 13 og kl. 15, hvor ingen maskiner må være i gang. Fester i haven skal slutte kl. 23, og vil du holde en større fest med flere end 20 gæster, skal du give besked til naboerne mindst en uge før. Klager over støj sendes skriftligt til bestyrelsen, som tager sagen op på næste møde. Gentagne klager kan føre til en skriftlig advarsel, og efter tre advarsler kan medlemmet indkaldes til en samtale. Alle sager behandles fortroligt, og ingen navne hænges op på opslagstavlen.'],
  ['Byggeri og beplantning',
   'Vil du bygge, ændre eller male udhuset, skal du først have bestyrelsens tilladelse. Huset må højst være 50 kvadratmeter, og det må ikke ligge tættere end 2,5 meter på skel. Ansøgningen sendes på det grønne skema, som findes i fælleshuset og på foreningens hjemmeside, og den skal være modtaget senest en måned før arbejdet starter. Bestyrelsen svarer inden 21 dage, og tilladelsen er gyldig i 12 måneder. Hegn mod fællesstien må højst være 140 centimeter høje, og de skal være klippet inden den 15. juni og igen inden den 15. september. Træer må ikke vokse højere end fem meter uden tilladelse, og det gælder især frugttræer og birk, som kaster skygge ind i nabohaven. Ønsker du at fælde et træ, skal du melde det til havekonsulenten på telefon 55 12 34 33, som er til stede i foreningen hver anden onsdag mellem kl. 16 og kl. 18. Græsplænen skal slås mindst hver anden uge i sommerhalvåret, og ukrudt må ikke gå i frø. Brug af sprøjtegifte er forbudt hele året, og det samme gælder kunstgødning i nærheden af grøften langs den nordlige side. Overtrædelser rettes først med en skriftlig henvendelse. Hvis du ikke rydder op inden for 30 dage, lader foreningen arbejdet udføre for din regning, og beløbet opkræves med næste kvartalsopkrævning.'],
  ['Kontingent og kontakt',
   'Kontingentet er 2.400 kroner pr. kvartal og dækker vand, el til fællesarealer, forsikring af fælleshuset og vedligeholdelse af stierne. Det opkræves den 1. i hvert kvartal, og betalingsfristen er 14 dage. Betaler du for sent, lægges der et rykkergebyr på 100 kroner til, og efter anden rykker overgår sagen til foreningens advokat. Kan du ikke betale til tiden, kan du aftale en delbetaling med kassereren, som har træffetid hver onsdag mellem kl. 17 og kl. 19 i fælleshuset. Ønsker du at sælge din have, skal du først tilbyde den til foreningens venteliste, som lige nu har 38 navne. Salgsprisen må ikke være højere end den vurdering, som en uvildig taksator har lavet, og vurderingen må højst være to år gammel. Den ordinære generalforsamling holdes den sidste lørdag i marts kl. 10 i fælleshuset, og indkaldelsen sendes ud senest fire uger før. Forslag til dagsordenen skal være hos formanden senest den 1. februar. Bestyrelsen består af fem medlemmer, som vælges for to år ad gangen, og halvdelen er på valg hvert år. Formanden træffes på telefon 55 12 34 90 mandag til torsdag mellem kl. 16 og kl. 20. Generelle spørgsmål kan sendes til foreningens mailadresse, og der svares inden for tre hverdage.']
];
const Q = [
  [0, 'Hvornår åbnes hanerne på fællesarealet?', ['den 1. maj', '1. maj'], 'Står under Vanding: hanerne åbnes den 1. maj.'],
  [0, 'Hvornår må man vande med slange?', ['efter kl. 20', 'efter klokken 20'], 'Står under Vanding: slange kun efter kl. 20 og før kl. 7.'],
  [0, 'Hvad er telefonnummeret til vandudvalgets vagttelefon?', ['55 12 34 78', '55123478'], 'Står under Vanding: vagttelefonen er 55 12 34 78.'],
  [1, 'Hvornår er komposthaugen åben for medlemmer?', ['hver lørdag', 'lørdag'], 'Står under Affald og storskrald: hver lørdag mellem kl. 9 og kl. 14.'],
  [1, 'Hvornår er genbrugspladsen åben i weekenden?', ['fra kl. 10 til kl. 16', 'kl. 10 til kl. 16'], 'Står under Affald og storskrald: i weekenden fra kl. 10 til kl. 16, ikke som på hverdage.'],
  [2, 'Hvornår begynder fællesarbejdet?', ['kl. 9', 'klokken 9'], 'Står under Fællesarbejde: man mødes ved fælleshuset kl. 9.'],
  [2, 'Hvor stort er gebyret, hvis man udebliver uden afbud?', ['400 kroner', '400 kr.'], 'Står under Fællesarbejde: gebyret er 400 kroner pr. gang.'],
  [3, 'Hvad koster det at leje fælleshuset en hel dag?', ['600 kroner', '600 kr.'], 'Står under Fælleshuset: 600 kroner for en hel dag, 350 for en aften.'],
  [3, 'Hvornår skal nøglen til fælleshuset afleveres?', ['mandag inden kl. 10', 'mandag før kl. 10'], 'Står under Fælleshuset: nøglen afleveres igen mandag inden kl. 10.'],
  [4, 'Hvor mange biler er der plads til på parkeringspladsen?', ['60 biler', '60'], 'Står under Parkering og bom: plads til 60 biler, hvoraf 12 pladser er til gæster.'],
  [4, 'Hvad koster en ny bombrik?', ['150 kroner', '150 kr.'], 'Står under Parkering og bom: en ny brik koster 150 kroner, den første er gratis.'],
  [4, 'Hvor længe må gæster holde på pladsen ad gangen?', ['højst 48 timer', '48 timer'], 'Står under Parkering og bom: højst 48 timer ad gangen.'],
  [5, 'Hvornår må man bruge støjende maskiner om lørdagen?', ['mellem kl. 9 og kl. 15', 'kl. 9 til kl. 15'], 'Står under Dyr og støj: om lørdagen mellem kl. 9 og kl. 15, på hverdage kl. 8 til kl. 18.'],
  [6, 'Hvor høje må hegn mod fællesstien højst være?', ['140 centimeter', '140 cm'], 'Står under Byggeri og beplantning: hegn mod fællesstien højst 140 centimeter.'],
  [7, 'Hvor mange navne står der på ventelisten?', ['38 navne', '38'], 'Står under Kontingent og kontakt: ventelisten har 38 navne.']
];
const skimId = 'fixture-have-skim';
const pad2 = n => String(n).padStart(2, '0');
const SKIM = [{
  id: skimId, mode: 'skim', level: 'B1',
  title: 'Haveforeningen Bøgebakken — medlemsmappe', theme: 'kolonihaver', exam_length: false,
  notices: N.map(([heading, body], i) => ({ id: `${skimId}-n${pad2(i + 1)}`, heading, body })),
  questions: Q.map(([n, q, accepted, note], i) => ({ id: `${skimId}-q${pad2(i + 1)}`, q, accepted, noticeId: `${skimId}-n${pad2(n + 1)}`, note })),
  sources: ['https://example.org/fixture/haveforening']
}];

// ---------------------------------------------------------------- article base (mc / insert / cloze)
// Tokens [[key]] are the connector words; cloze turns them into {{n}}, the others keep the word.
const GAPS = {
  derfor:   { type: 'konsekvens',   options: ['Alligevel', 'Derfor', 'Imidlertid', 'Tværtimod'],  correct: 1, note: 'Konsekvens: broen er blevet trang, så kommunen bygger en ekstra sti.' },
  foerst:   { type: 'tid',          options: ['Derfor', 'Alligevel', 'Først', 'Tværtimod'],       correct: 2, note: 'Rækkefølge: kommunen betaler først, så kommer statens del.' },
  alligevel:{ type: 'kontrast',     options: ['Derfor', 'Dermed', 'Alligevel', 'Eksempelvis'],    correct: 2, note: 'Modsætning: beløbet er stort, men organisationerne kalder det billigt.' },
  faktisk:  { type: 'praecisering', options: ['Imidlertid', 'Faktisk', 'Derfor', 'Dermed'],       correct: 1, note: 'Uddyber påstanden om, at cyklister handler oftere.' },
  konkret:  { type: 'praecisering', options: ['Imidlertid', 'Derfor', 'Alligevel', 'Konkret'],    correct: 3, note: 'Gør mellemvejen konkret med tal.' },
  desuden:  { type: 'tilfoejelse',  options: ['Eksempelvis', 'Alligevel', 'Desuden', 'Tværtimod'], correct: 2, note: 'Lægger endnu en indvending oven i den forrige.' },
  indtil:   { type: 'tid',          options: ['Indtil da', 'Derfor', 'Alligevel', 'Tværtimod'],   correct: 0, note: 'Tid: perioden frem til byrådets beslutning i oktober.' },
  dermed:   { type: 'konsekvens',   options: ['Alligevel', 'Tværtimod', 'Eksempelvis', 'Dermed'], correct: 3, note: 'Konsekvens: tallene giver politikerne grundlag for at vurdere effekten.' }
};
const WORD = { derfor: 'Derfor', foerst: 'Først', alligevel: 'Alligevel', faktisk: 'Faktisk', konkret: 'Konkret', desuden: 'Desuden', indtil: 'Indtil da', dermed: 'Dermed' };
const P = [
  'Cyklen vinder frem i byerne. Det koster plads.',
  'I 2019 talte kommunen 41.000 cykelture om dagen over den mest brugte bro. I 2024 var tallet steget til 58.000, hvilket er en stigning på omkring 40 procent. Tællingen foregår med slanger i asfalten, som registrerer hvert hjul, der kører over dem, og tallene bliver lagt ud på kommunens hjemmeside hvert kvartal.',
  'Stigningen har gjort broen trang. [[derfor]] vil kommunen lægge en ekstra cykelsti ved siden af den gamle, og arbejdet begynder i foråret 2026. På en travl morgen kan der stå op til 30 cykler foran det røde lys i den østlige ende af broen, og de ældre cyklister venter ofte to gange, før de når over.',
  'Den nye sti bliver tre meter bred og koster 18 millioner kroner. Pengene kommer fra to steder. [[foerst]] betaler kommunen 12 millioner kroner, og så lægger staten de sidste 6 millioner oveni. Belysning langs stien er ikke med i prisen og skal bevilges senere.',
  'Beløbet er ikke småpenge. [[alligevel]] mener cykelorganisationerne, at det er en billig løsning, når man sammenligner med prisen på en ny bilvej. En kilometer motorvej koster flere hundrede millioner kroner, og en ny cykelsti kan bygges for en brøkdel af det beløb. Prisen på selve asfalten er lav, og det meste af regningen går til at flytte kabler og afvandingsrender under vejen.',
  'Ikke alle er enige i, at pladsen skal tages fra bilerne. Butiksejerne på hovedgaden frygter, at kunderne bliver væk, når de 120 parkeringspladser langs gaden forsvinder. Mange af butikkerne er små familiebutikker, og de lever af kunder, som kommer forbi flere gange om ugen.',
  'Cykelorganisationerne peger på, at cyklister handler oftere end bilister, fordi de kan standse lige ved døren. [[faktisk]] viste en undersøgelse fra en anden by, at cyklister i gennemsnit besøgte butikkerne 11 gange om måneden, mens bilisterne kom 7 gange. Butiksejerne svarer, at tallene stammer fra en by med helt andre gader end deres egen.',
  'Kommunen har valgt en mellemvej. [[konkret]] fjernes 70 af de 120 pladser, og de øvrige 50 flyttes til en ny p-plads, som ligger 200 meter fra hovedgaden. Ordningen skal gælde i to år og derefter vurderes på ny.',
  'Butiksejerne er ikke tilfredse. De mener, at 200 meter er for langt for kunder med tunge poser. [[desuden]] frygter de, at de ældre kunder helt holder op med at komme, hvis de ikke kan parkere tæt på døren.',
  'Debatten fortsætter, for byrådet tager først endelig stilling i oktober. [[indtil]] måler kommunen hver tirsdag og lørdag, hvor mange der cykler og kører bil på hovedgaden. Målingerne foregår klokken 8 til 9 og klokken 15 til 16, så både morgentrafikken og eftermiddagstrafikken bliver talt med.',
  'Måleresultaterne bliver lagt frem for politikerne. [[dermed]] kan de se, om cyklisterne erstatter bilerne, eller om de kommer oven i den trafik, der i forvejen fylder gaderne i myldretiden om morgenen og om eftermiddagen. Resultatet kommer ikke til at afgøre sagen alene, men det giver begge sider noget fælles at tage udgangspunkt i.'
];
const plain = s => s.replace(/\[\[(\w+)\]\]/g, (m, k) => WORD[k]);

// ---- mc
const MC = [{
  id: 'fixture-cykel-mc', mode: 'mc', level: 'B2',
  title: 'Mere plads til cyklen', genre: 'forklaring', kicker: 'Forklaring · Trafik',
  paragraphs: P.map(plain),
  questions: [
    { id: 'fixture-cykel-mc-q1', q: 'Hvor langt fra hovedgaden bliver den nye p-plads?', options: ['200 meter', '70 meter', '50 meter'], correct: 0, evidence: 7, note: 'Afsnit 8: p-pladsen ligger 200 meter fra hovedgaden; 70 og 50 er antal pladser.' },
    { id: 'fixture-cykel-mc-q2', q: 'Hvad mener butiksejerne om den nye p-plads?', options: ['Den ligger for langt væk for kunder med tunge poser.', 'Den er for dyr at bygge.', 'Den har for få pladser til cyklister.'], correct: 0, evidence: 8, note: 'Afsnit 9: butiksejerne synes, 200 meter er for langt for kunder med tunge poser.' },
    { id: 'fixture-cykel-mc-q3', q: 'Hvornår tager byrådet endelig stilling?', options: ['I oktober', 'I foråret 2026', 'Hver tirsdag og lørdag'], correct: 0, evidence: 9, note: 'Afsnit 10: byrådet beslutter først i oktober; foråret 2026 er byggestarten, og tirsdag og lørdag er målingerne.' }
  ],
  sources: ['https://example.org/fixture/cykelstier']
}];

// ---- insert: remove paragraphs 1,3,5,7,9 (solutions), keep 0,2,4,6,8,10
const REMOVED = [1, 3, 5, 7, 9];
const KEPT = P.map((_, i) => i).filter(i => !REMOVED.includes(i));
const iid = 'fixture-cykel-insert';
const BLOCK_ORDER = [5, 'd1', 1, 9, 3, 'd2', 7];     // shuffled: solutions by paragraph index, d* = distractors
const DISTRACT = {
  d1: 'I Sverige lejer flere kommuner elcykler ud til turister i sommerhalvåret, og en dagsleje koster typisk 150 kroner. Ordningen er især populær i kystbyerne.',
  d2: 'Cykelhjelm er ikke påbudt for voksne, men Færdselsstyrelsen anbefaler hjelm til alle, der cykler i tæt trafik. Mange børnefamilier vælger derfor hjelm til hele familien.'
};
const blockId = k => `${iid}-b${BLOCK_ORDER.indexOf(k) + 1}`;
const GAP_NOTES = [
  'Afsnittet før er kun to korte sætninger; blokken giver tallene bag dem.',
  'Afsnittet før nævner en ekstra cykelsti; blokken beskriver den nye sti.',
  'Afsnittet før handler om cykelorganisationernes syn; blokken åbner en modsatrettet holdning.',
  'Afsnittet før beskriver cyklisters indkøb; blokken fortæller, hvad kommunen har besluttet.',
  'Afsnittet før slutter med butiksejernes frygt; blokken skifter til byrådets tidsplan.'
];
const INSERT = [{
  id: iid, mode: 'insert', level: 'B2',
  title: 'Mere plads til cyklen', genre: 'forklaring', kicker: 'Forklaring · Trafik',
  paragraphs: KEPT.map(i => plain(P[i])),
  gaps: REMOVED.map((r, n) => ({ id: `${iid}-g${n + 1}`, after: n, note: GAP_NOTES[n] })),
  blocks: BLOCK_ORDER.map(k => ({ id: blockId(k), text: typeof k === 'number' ? plain(P[k]) : DISTRACT[k] })),
  solution: Object.fromEntries(REMOVED.map((r, n) => [`${iid}-g${n + 1}`, blockId(r)])),
  sources: ['https://example.org/fixture/cykelstier']
}];

// ---- cloze: markers in order of appearance
const cid = 'fixture-cykel-cloze';
const order = [];
const clozeParas = P.map(p => p.replace(/\[\[(\w+)\]\]/g, (m, k) => { order.push(k); return `{{${order.length}}}`; }));
const CLOZE = [{
  id: cid, mode: 'cloze', level: 'B2',
  title: 'Mere plads til cyklen', genre: 'forklaring', kicker: 'Forklaring · Trafik',
  paragraphs: clozeParas,
  gaps: order.map((k, i) => ({ id: `${cid}-c${i + 1}`, ...GAPS[k] })),
  sources: ['https://example.org/fixture/cykelstier']
}];

// ---------------------------------------------------------------- registry stand-in
const REGISTRY = `// FIXTURE — stand-in for the game's data.js registry; only used by the validator tests.
(function () {
  'use strict';
  function arr(v) { return Array.isArray(v) ? v : []; }
  var W = window;
  W.LAESE_DATA = {
    skim: arr(W.LAESE_SKIM), mc: arr(W.LAESE_MC), insert: arr(W.LAESE_INSERT), cloze: arr(W.LAESE_CLOZE),
    modes: [
      { key: 'skim', label: 'Find oplysningen', itemCount: 15 },
      { key: 'mc', label: 'Læs og vælg', itemCount: 3 },
      { key: 'insert', label: 'Sæt afsnittet ind', itemCount: 5 },
      { key: 'cloze', label: 'Det manglende ord', itemCount: 8 }
    ]
  };
})();
`;
const FILE = { skim: ['data-skim.js', 'LAESE_SKIM'], mc: ['data-mc.js', 'LAESE_MC'], insert: ['data-insert.js', 'LAESE_INSERT'], cloze: ['data-cloze.js', 'LAESE_CLOZE'] };
const dataFile = (mode, arr) => `// FIXTURE — invented test material for tests/laeseforstaaelse-data.mjs, not game content.\nwindow.${FILE[mode][1]} = ${JSON.stringify(arr, null, 2)};\n`;

function write(dir, files) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), text);
}

// ---------------------------------------------------------------- good
const good = { 'data.js': REGISTRY };
for (const [m, a] of [['skim', SKIM], ['mc', MC], ['insert', INSERT], ['cloze', CLOZE]]) good[FILE[m][0]] = dataFile(m, a);
write(path.join(HERE, 'good'), good);

// ---------------------------------------------------------------- bad: one fault each, named after the rule
const BASE = { skim: SKIM, mc: MC, insert: INSERT, cloze: CLOZE };
const bad = {};   // rule -> [mode, mutate(arr) -> arr | void]
const def = (rule, mode, fn) => { bad[rule] = [mode, fn]; };
const t0 = a => a[0];
const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1);

def('banned-phrase', 'mc', a => { t0(a).paragraphs[9] += ' Alt i alt kan man sige, at valget er svært.'; });
def('capped-connector', 'mc', a => { t0(a).paragraphs[4] += ' Derudover er prisen lav.'; t0(a).paragraphs[8] += ' Derudover er forslaget omstridt.'; });
def('quotation-mark', 'mc', a => { t0(a).paragraphs[7] += ' Politikerne kalder det »en mellemvej«.'; });
def('byline', 'mc', a => { t0(a).byline = 'Af Mette Hansen'; });
def('gap-count', 'insert', a => { const t = t0(a); const g = t.gaps.pop(); delete t.solution[g.id]; });
def('block-count', 'insert', a => { t0(a).blocks.splice(5, 1); });
def('unknown-block', 'insert', a => { const t = t0(a); t.solution[t.gaps[0].id] = `${t.id}-b99`; });
def('gap-order', 'insert', a => { t0(a).gaps[1].after = 0; });
def('block-length', 'insert', a => { t0(a).blocks[1].text = 'For kort.'; });
def('marker-order', 'cloze', a => { const t = t0(a); t.paragraphs = t.paragraphs.map(p => p.replace('{{2}}', '@@').replace('{{3}}', '{{2}}').replace('@@', '{{3}}')); });
def('duplicate-options', 'cloze', a => { const g = t0(a).gaps[0]; g.options[0] = g.options[1]; });
def('cloze-type', 'cloze', a => { t0(a).gaps[0].type = 'andet'; });
def('connector-types', 'cloze', a => { t0(a).gaps.forEach(g => { g.type = 'konsekvens'; }); });
def('duplicate-id', 'mc', a => { a.push(clone(a[0])); });
def('missing-sources', 'mc', a => { t0(a).sources = []; });
def('bad-source-url', 'mc', a => { t0(a).sources = ['ftp://example.org/x']; });
def('level', 'mc', a => { t0(a).level = 'C1'; });
def('genre', 'mc', a => { t0(a).genre = 'debat'; });
def('kicker', 'mc', a => { t0(a).kicker = 'Trafik'; });
def('verify-type', 'mc', a => { t0(a).verify = 'ja'; });
def('notice-length', 'skim', a => { t0(a).notices[0].body = t0(a).notices[0].body.slice(0, 300); });
def('notice-digits', 'skim', a => { const n = t0(a).notices[7]; n.body = n.body.replace(/\d/g, 'x'); });
def('notice-count', 'skim', a => { const t = t0(a); t.notices.pop(); t.questions.forEach(q => { if (q.noticeId.endsWith('n08')) q.noticeId = `${t.id}-n01`; }); });
def('question-count', 'skim', a => { t0(a).questions.pop(); });
def('accepted', 'skim', a => { t0(a).questions[0].accepted = []; });
def('notice-ref', 'skim', a => { t0(a).questions[0].noticeId = `${t0(a).id}-n99`; });
def('option-count', 'mc', a => { t0(a).questions[0].options.push('Ingen af delene'); });
def('correct-range', 'mc', a => { t0(a).questions[0].correct = 3; });
def('evidence-range', 'mc', a => { t0(a).questions[0].evidence = 99; });
def('digits', 'mc', a => { t0(a).paragraphs = t0(a).paragraphs.map(p => p.replace(/\d+(\.\d+)?/g, 'mange')); });
def('paragraph-variance', 'mc', a => {
  t0(a).paragraphs = [1, 2, 3, 4, 5, 6].map(i => { let s = P[i].replace(/\[\[(\w+)\]\]/g, (m, k) => WORD[k]).slice(0, 150); return s.slice(0, s.lastIndexOf(' ')) + '.'; });
  t0(a).questions.forEach(q => { q.evidence = 0; });
});
def('connector-openings', 'mc', a => {
  const op = ['Desuden', 'Dermed', 'Derfor', 'Samtidig'];
  let n = 0;
  t0(a).paragraphs = t0(a).paragraphs.map(p => p.match(/[^.]+\./g).map(s => `${op[n++ % 4]} ${lowerFirst(s.trim())}`).join(' '));
});
def('triple-list', 'mc', a => { t0(a).paragraphs = t0(a).paragraphs.map((p, i) => i % 2 ? p : p + ' Der er cykler, biler og busser.'); });
def('dash-summary', 'mc', a => { [2, 4].forEach(i => { t0(a).paragraphs[i] += ' – et svært valg.'; }); });
def('sentence-variance', 'mc', a => {
  // no sentence reaches 25 words once every clause is its own sentence
  t0(a).paragraphs = t0(a).paragraphs.map(p => p.replace(/, (\p{L})/gu, (m, c) => '. ' + c.toUpperCase()));
});

for (const [rule, [mode, fn]] of Object.entries(bad)) {
  const arr = clone(BASE[mode]);
  fn(arr);
  write(path.join(HERE, 'bad', rule), { 'data.js': REGISTRY, [FILE[mode][0]]: dataFile(mode, arr) });
}
// Structural fixtures that are not a mutation of the good data
write(path.join(HERE, 'bad', 'missing-file'), { [FILE.mc[0]]: dataFile('mc', MC) });
write(path.join(HERE, 'bad', 'load-error'), { 'data.js': REGISTRY, 'data-mc.js': '// FIXTURE — deliberately broken syntax\nwindow.LAESE_MC = [ { id: ;\n' });
write(path.join(HERE, 'bad', 'corpus-global'), { 'data.js': REGISTRY, 'data-mc.js': '// FIXTURE — file loads but assigns a non-array\nwindow.LAESE_MC = { id: "x" };\n' });

// size report (chars of reader-visible prose) for tuning
const len = a => a.join(' ').length;
console.log('article chars  mc=%d insert=%d cloze=%d', len(MC[0].paragraphs), len(INSERT[0].paragraphs) + REMOVED.reduce((n, r) => n + P[r].length, 0), len(clozeParas));
console.log('notice chars   ' + SKIM[0].notices.map(n => n.body.length).join(' '));
