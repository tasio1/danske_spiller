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
    }
  ];
})();
