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
      paragraphs: [
        'Ulven lever igen i Danmark, og den sætter spor i regnskabet. I foråret 2026 talte overvågningen ti territorier, altså ti områder, som en flok, et par eller en enlig ulv holder for sig selv. Syv af dem var flokke med hvalpe fra 2025, og tre var par uden hvalpe. Det tiende hørte til en enlig han.',
        'Tallene skal læses med forsigtighed. De er foreløbige og vejledende, og de viser bestanden i foråret, ved starten af et nyt overvågningsår, så de er et øjebliksbillede og ikke et endeligt facit. Når bestanden gøres op, regner man med syv ulve for hver flok, men det er en regneregel, og den fortæller ikke, hvor mange ulve der reelt går rundt i de ti territorier.',
        'Angrebene på husdyr er blevet flere. I 2023 blev der registreret 57 ulveangreb på husdyr i Jylland. Året efter var tallet 91, og i 2025 nåede det op på 239. Tallene stiger hurtigt. Der var 148 flere angreb i 2025 end året før, og samlet er tallet mere end fire gange så højt som i 2023. Alle tre tal gælder registrerede angreb, ikke gæt på, hvor mange der er sket uden at blive meldt.',
        'Erstatningen følger dyrene. For 2025 blev der udbetalt kompensation for 1.239 får, 32 kreaturer, fem heste, otte geder og en vædder, i alt 1.285 dyr. Ulve dræbte altså mindst 1.285 husdyr i Danmark det år, og får udgør langt det meste af tallet. Mere end 96 procent af de dræbte dyr var får, så det er især fåreholdere, der mærker angrebene. Kreaturer, heste og geder fylder til sammen kun 46 af dyrene.',
        'Regningen har to dele. Erstatning er penge til dem, der har mistet dyr, og den kommer, når angrebet er sket. Tilskud til hegn er penge, der gives, for at nye angreb ikke sker. Sammen kostede de staten mindst 36 millioner kroner i 2025. Det var hegnene, der tog det meste, for omkring 35 millioner kroner gik til dem. Staten betaler for at gøre et hegn ulvesikkert, så dyreholderen skal ikke selv bære den udgift.',
        'Hegn er ingen garanti. I 2025 blev omkring 80 dyr, mest får og lam, dræbt bag hegn, der var i orden og virkede helt, som de skulle. Det skete i ti angreb, og der blev udbetalt erstatning for dyrene, selv om hegnet var i orden. Det giver i gennemsnit omkring otte dyr pr. angreb. Staten betaler dermed både for hegnene og for de dyr, som hegnene ikke redder.',
        'Ulvens beskyttelse er også ændret. I 2025 sænkede EU ulvens status fra strengt beskyttet til beskyttet. Før stod ulven i bilag IV, og nu står den i bilag V. Ændringen gælder habitatdirektivet, som er EU-reglerne for beskyttede arter og naturtyper. Ulven er altså stadig beskyttet, men reglerne er ikke så stramme som før.',
        'To ting står over for hinanden. Ulven har en beskyttet status, og samtidig betaler staten erstatninger og hegn. I august 2026 efterlyste landboforeningen Agillix en plan for, hvor stor en ulvebestand Danmark skal have. Både beskyttelsen og regningen kan ændre sig, så tallene i teksten viser kun, hvordan det så ud i 2025 og i foråret 2026.'
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
          q: 'Hvad kostede mest af statens udgifter til ulven i 2025?',
          options: [
            'Tilskud til ulvesikre hegn',
            'Erstatning til ejerne af dræbte dyr',
            'Overvågning af ulvene'
          ],
          correct: 0,
          evidence: 4,
          note: 'Omkring 35 af de mindst 36 millioner kroner gik til hegn; overvågning nævnes ikke som udgift.'
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
    }
  ];
})();
