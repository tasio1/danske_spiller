// Læseforståelse, mode 'insert' (Sæt afsnittene ind, PD3 delprøve 2B): five paragraphs are removed from an
// article; the learner places 5 of 7 offered paragraphs (2 are distractors) by following cohesion signals.
// Rules: .claude/skills/laese-text-authoring/SKILL.md. Facts: docs/laeseforstaaelse/facts/art-samsoe.md and
// art-madspild.md (CONFIRMED lines and the VERIFY-2 "safe to use" lists only). gap.after = 0-based index of the
// visible paragraph the gap sits behind. Assembled order is printed in each table below.
(function () {
  'use strict';
  window.LAESE_INSERT = [

    // =====================================================================================================
    // art-samsoe (reportage). Angle: the island where residents invested themselves (not "owns its turbines").
    // Assembled order: P0 [g1=b4] P1 [g2=b1] P2 [g3=b6] P3 [g4=b2] P4 [g5=b5]; distractors b3, b7.
    //
    // Traceability: paragraph/block -> fact in docs/laeseforstaaelse/facts/art-samsoe.md
    //   P0  omkring 3.600-3.700 indbyggere (VERIFY-2 range, no single figure): F11; vedvarende energi-ø, 1997, konkurrence: F1
    //   b4  konkurrence udskrevet af Energiministeriet, mest realistiske plan, region eller ø, skifte til vedvarende energi: F2; Samsø vandt konkurrencen om at blive vedvarende energi-ø: F1 (nothing about what the plan had to prove)
    //   P1  ca. 70 % af ca. 440 mio. kr., al vedvarende energi, ikke kun møller, DR 2018: F4 (no investor count used)
    //   b1  11 landmøller og ti havmøller, ifølge DR (2021): F3; husejerne kunne købe andele i møllerne: F6
    //   P2  indtil november 2018 fortrinsvis ejet af samsinger, én andelsmølle med over 800 andelshavere, fem møller ejet af Samsø Kommune: F5 (dated, past tense)
    //   b6  november 2018: ni af ti havmøller skulle overdrages til Wind Estate A/S, hvis tilladelser opnås: F5 (dated past statement; 'Om overdragelsen blev gennemført, siger kilderne ikke' = completion on no fetched page)
    //   P3  fire fjernvarmeanlæg, tre halm, ét sol og flis (ifølge csr.dk, source undated): F7
    //   b2  mere end halvdelen af de privatejede oliefyr i ca. 2.000 husstande erstattet af pillefyr, solvarme, varmepumper, DR 2018: F8
    //   P4  Samsø Energiakademi opført 2007: F9; ti år efter 1997 (derived: 2007 - 1997 = 10): F1, F9; 'nyt mål' = hook to b5 (F10 says målet er nu)
    //   b5  målet en fossilfri ø i 2030, der bruges stadig (2025) fossile brændsler (lex.dk): F10 (sheet note quotes the continuation)
    //   b3  (distractor) ca. 70 % af ca. 440 mio. kr., al vedvarende energi og ikke kun møllerne, DR 2018: F4 only (no inference)
    //   b7  (distractor) 'I 2015 blev færgen Prinsesse Isabella sat ind på ruten Sælvig-Hou': F12 (stated plainly; 'Ruten forbinder øen med Jylland' only restates Sælvig-Hou)
    // Not stated anywhere: a self-sufficiency year, present-tense island ownership of the offshore park, one exact population,
    // 70 % as a share of turbines, any investor count.
    //
    // Gap -> cohesion signal (each gap is locked from BOTH sides)
    //   g1 (after P0 -> b4): P0 ends 'en konkurrence'; b4 opens 'Konkurrencen' (definite, refers back); b4 ends 'skiftet', P1 opens 'Skiftet kostede penge'.
    //   g2 (after P1 -> b1): P1 ends with the open question 'hvem der ejer hvilke møller'; b1 opens 'Ejerskabet ...' and states the land turbines; P2 opens 'Havmøllerne var en anden sag' (contrast that needs land turbines first).
    //   g3 (after P2 -> b6): P2 says 'Indtil november 2018'; b6 opens 'Men netop i november 2018' (contrast + same date); P3 opens 'Møllerne leverer strøm' (needs turbines just discussed).
    //   g4 (after P3 -> b2): P3 ends with fjernvarme; b2 opens 'Ud over fjernvarmen'; P4 opens 'Omstillingen fik også sin egen bygning' (refers to the heating switch).
    //   g5 (after P4 -> b5): P4 ends 'Siden da har øen fået et nyt mål' (open hook); b5 opens 'Nu ser øen frem mod 2030' and names the goal (time marker 1997 -> 2007 -> 2030); end of the article.
    // Interchange check: b4 needs P1's 'Skiftet' and P0's 'konkurrence' (only g1); b1 needs P1's question and P2's contrast (only g2); b6 needs 'november 2018' in P2 (only g3);
    //   b2 needs fjernvarme in P3 (only g4); b5 needs 2007 before it and nothing after (only g5). No two correct blocks fit each other's gaps.
    // Distractor check (simulated learner, each of the five gaps):
    //   b3 repeats the 70 %/440 mio. point that P1 (always visible) already makes; g1: P1 would then say it twice and 'Skiftet' has no antecedent; g2: P2's 'Havmøllerne var en anden sag' has no land turbines before it
    //      and P1's question stays unanswered; g3: P3 'Møllerne' and P2's 'Indtil november 2018' get no continuation; g4: P4 'Omstillingen' follows no heating switch; g5: repeats and closes nothing. Fits none.
    //   b7 is a plain ferry fact with no hook on either side. g1: P1 'Skiftet' has no antecedent; g2: P1's question about who owns the turbines stays unanswered and P2 'Havmøllerne var en anden sag' needs land turbines;
    //      g3: P2 'Indtil november 2018' needs a contrast and P3 'Møllerne' needs turbines; g4: P3 ends on fjernvarme, P4 'Omstillingen' needs a heating switch; g5: P4 ends 'nyt mål', a ferry does not name one. Fits none.
    // 7x5 simulation after rework (Y own gap, - no fit, m grammatical but a named hook breaks):
    //          g1 g2 g3 g4 g5
    //   b1      -  Y  m  -  -     (b1@g3: P2 'Indtil november 2018' then 'Ejerskabet...' lacks the contrast; b6 owns g3)
    //   b2      -  -  -  Y  -
    //   b3      m  -  -  -  -     (b3@g1: P1 'Skiftet' has no antecedent and P1 then repeats the 70 % point)
    //   b4      Y  -  -  -  -
    //   b5      -  -  -  -  Y
    //   b6      -  -  Y  -  -
    //   b7      -  -  -  -  -
    // Unique solution: every correct block has exactly one Y; the m cells are closed by the hooks named in the gap notes.
    // =====================================================================================================
    {
      id: 'art-samsoe',
      mode: 'insert',
      level: 'B2',
      title: 'Samsø: øen, hvor beboerne selv investerede i møllerne',
      genre: 'reportage',
      kicker: 'Reportage · Energi',
      paragraphs: [
        'Samsø er en dansk ø med omkring 3.600-3.700 indbyggere og et ry som vedvarende energi-ø. Det ry stammer fra 1997. Dengang vandt Samsø en konkurrence.',
        'Skiftet kostede penge, og en stor del af pengene kom fra beboerne selv. Ifølge DR (2018) har samsinger selv investeret ca. 70 % af de ca. 440 mio. kr., der er brugt på vedvarende energi. Tallet gælder hele investeringen og ikke kun møllerne, og en andel af pengene siger intet om, hvem der ejer hvilke møller.',
        'Havmøllerne var en anden sag. Indtil november 2018 var de ti møller fortrinsvis ejet af samsinger, og én af dem var en andelsmølle med over 800 andelshavere, mens Samsø Kommune ejede fem af møllerne.',
        'Møllerne leverer strøm, men en ø skal også have varme. Ifølge csr.dk er der fire fjernvarmeanlæg på Samsø, tre baseret på halm og ét baseret på sol og flis.',
        'Omstillingen fik også sin egen bygning. I 2007, ti år efter sejren i konkurrencen, blev Samsø Energiakademi opført. Siden da har øen fået et nyt mål.'
      ],
      gaps: [
        { id: 'art-samsoe-g1', after: 0, note: 'Konkurrencen henviser til en konkurrence i 1997, og skiftet i slutningen knytter an til næste afsnit.' },
        { id: 'art-samsoe-g2', after: 1, note: 'Ejerskabet svarer på spørgsmålet om, hvem der ejer møllerne, og landmøllerne skal nævnes før Havmøllerne er en anden sag.' },
        { id: 'art-samsoe-g3', after: 2, note: 'Indtil november 2018 mødes af Men netop i november 2018, et tidspunkt og en modsætning.' },
        { id: 'art-samsoe-g4', after: 3, note: 'Ud over fjernvarmen bygger videre på fjernvarmeanlæggene, og Omstillingen peger tilbage på skiftet af opvarmning.' },
        { id: 'art-samsoe-g5', after: 4, note: 'Slutningen af afsnittet før varsler et nyt mål, og Nu ser øen frem mod 2030 nævner det og afslutter teksten.' }
      ],
      blocks: [
        { id: 'art-samsoe-b1', text: 'Ejerskabet var ikke ens for alle møller. Ifølge DR (2021) har Samsø 11 vindmøller på land og ti i vandet, og på land fik husejerne mulighed for at købe andele i møllerne. En andel er en del af en mølle, ikke hele møllen.' },
        { id: 'art-samsoe-b2', text: 'Ud over fjernvarmen har mange husstande skiftet opvarmning. Ifølge DR (2018) var mere end halvdelen af de privatejede oliefyr i de ca. 2.000 husstande på øen erstattet af pillefyr, solvarmeanlæg og varmepumper.' },
        { id: 'art-samsoe-b3', text: 'Ifølge DR (2018) har samsinger selv investeret ca. 70 % af de ca. 440 mio. kr., der er brugt på vedvarende energi. Det gælder al vedvarende energi på øen og ikke kun møllerne.' },
        { id: 'art-samsoe-b4', text: 'Konkurrencen var udskrevet af Energiministeriet og gik ud på at lave den mest realistiske plan for, hvordan en region eller en ø kunne skifte til vedvarende energi. Samsø vandt konkurrencen om at blive en vedvarende energi-ø.' },
        { id: 'art-samsoe-b5', text: 'Nu ser øen frem mod 2030. Ifølge lex.dk er målet en fossilfri ø det år, og der bruges stadig (2025) fossile brændsler på øen, så målet er endnu ikke nået.' },
        { id: 'art-samsoe-b6', text: 'Men netop i november 2018 blev det meldt, at ni af de ti havmøller skulle overdrages til Wind Estate A/S, hvis myndighederne gav de nødvendige tilladelser. Om overdragelsen blev gennemført, siger kilderne ikke. Her stod lokalt ejerskab over for et muligt salg.' },
        { id: 'art-samsoe-b7', text: 'I 2015 blev færgen Prinsesse Isabella sat ind på ruten mellem Sælvig på Samsø og Hou i Jylland. Ruten forbinder øen med Jylland.' }
      ],
      solution: {
        'art-samsoe-g1': 'art-samsoe-b4',
        'art-samsoe-g2': 'art-samsoe-b1',
        'art-samsoe-g3': 'art-samsoe-b6',
        'art-samsoe-g4': 'art-samsoe-b2',
        'art-samsoe-g5': 'art-samsoe-b5'
      },
      sources: [
        'https://www.csr.dk/sams%C3%B8-har-luft-under-vingerne',
        'https://www.osti.gov/etdeweb/biblio/925651',
        'https://www.dr.dk/nyheder/politik/kommunalvalg/fra-hele-verdens-klimakaeledaegge-til-nye-dieselfaerger-er-samsoes',
        'https://www.dr.dk/nyheder/viden/klima/den-klimavenlige-oenskeoe',
        'https://www.energy-supply.dk/article/view/631499/dansk_havmollepark_solgt_til_wind_estate',
        'https://greenpowerdenmark.dk/nyheder/miljoepioneren-fra-samsoe-vi-moeller-er-bedre-dem-moeller',
        'https://lex.dk/Sams%C3%B8_Energiakademi',
        'https://da.wikipedia.org/wiki/Sams%C3%B8',
        'https://en.wikipedia.org/wiki/Sams%C3%B8'
      ],
      verify: true
    },

    // =====================================================================================================
    // art-madspild (baggrund). Angle: from a Danish consumer movement to solutions that have drawn attention
    // (not "Danish export"). No national total, no founders, no 2016 app launch.
    // Assembled order: P0 [g1=b3] P1 [g2=b1] P2 [g3=b5] P3 [g4=b2] P4 [g5=b4]; distractors b6, b7.
    //
    // Traceability: paragraph/block -> fact in docs/laeseforstaaelse/facts/art-madspild.md
    //   P0  three solutions between 2008 and 2016 (2008 F1, 2015 F7, 2016 F9; span 2016 - 2008 = 8, stated as 'mellem 2008 og 2016')
    //   b3  Stop Spild Af Mad, stiftet 31. juli 2008: F1; 'den ældste af de tre' (2008 < 2015 < 2016): F1, F7, F9
    //   P1  REMA 1000 har siden 2008 samarbejdet med bevægelsen, afskaffet mængderabatter: F4 (REMA as doer, never as speaker)
    //   b1  husholdningers madspild 261.000 ton (2011/12) til 247.000 ton (2017), forskel 14.000 ton (261 - 247 = 14), Miljøstyrelsen, tal fra 2018, households only: F5
    //   P2  Too Good To Go skabt i Danmark i 2015: F7; hovedkontor København ifølge Wikipedia: F7 (2015 lies inside 2011-2017 from b1)
    //   b5  pr. august 2023: 164.000 virksomheder, 62 mio. brugere, 155 mio. poser, virksomhedens egne tal: F8
    //   P3  Wefood åbnede på Amager i februar 2016: F9; verdenspressen mødte talstærkt op, frivillige kræfter under Folkekirkens Nødhjælp: F9, now stated as 'Folkekirkens Nødhjælps egen pressemeddelelse fra februar 2026' (self-reported)
    //   b2  december 2025 ændrede Fødevarestyrelsen fortolkningen af 1/3-reglen, donation af overskudsmad undtages, ikke en ny lov: F11; 'næsten ti år efter åbningen' (feb. 2016 -> dec. 2025 = 9 år 10 mdr.)
    //   P4  på ti år solgt overskudsvarer svarende til 3.036 ton mad og drikke, 'samme pressemeddelelse' = 'organisationens eget tal', solgte varer only: F10
    //   b4  closing: the figures measure different things and cannot be added (restates scopes of F5, F8, F10 only)
    //   b6  (distractor) Too Good To Go 2015, København again: F7
    //   b7  (distractor) bevægelsens daglige leder is also its founder, drives af frivillig arbejdskraft (ifølge Wikipedia): F2 (founder not named)
    // Not stated anywhere: 881.062 t or any national total, 700.000 t, 507.000-610.000 t, the 25 % report (F3), founders, a 2016 TGTG launch, export.
    //
    // Gap -> cohesion signal (each gap is locked from BOTH sides)
    //   g1 (after P0 -> b3): P0 ends 'Historien begynder med bevægelsen'; b3 names it and gives 2008; P1 opens 'Samme år' (needs the year 2008 in the block).
    //   g2 (after P1 -> b1): P1 ends with the neutral question 'hvad ved vi om madspildet i de danske hjem?' (no causal claim); b1 opens 'For husholdningerne findes der tal' (answer); P2 opens 'I mellemtiden' (needs the span 2011-2017 so that 2015 lies inside).
    //   g3 (after P2 -> b5): P2 introduces 'Appen' and 'virksomhedens hovedkontor'; b5 opens 'Hvor langt appen er nået'; P3 opens 'Wefood gik en anden vej end appen' (contrast with the app).
    //   g4 (after P3 -> b2): P3 has the opening in 'februar 2016'; b2 opens 'Næsten ti år efter åbningen' (time marker); P4 opens 'Overskudsvarer er også grundlaget' (needs 'overskudsmad' just before).
    //   g5 (after P4 -> b4): b4 opens 'Tallene i denne tekst' (refers to the figures of P4 and the blocks) and ends the article.
    // Interchange check: b3 only g1 (P1 'Samme år'); b1 only g2 (question + 'I mellemtiden'); b5 only g3 ('appen' on both sides); b2 only g4 ('åbningen' + 'overskudsmad'); b4 only g5 (last paragraph). No two blocks swap.
    // Distractor check (simulated learner, each of the five gaps):
    //   b6 repeats the Too Good To Go point of P2 (always visible). g1: P1 'Samme år' has no year before it; g2: the question about the households stays unanswered and P2 repeats it; g3: repeats P2, and b5 would
    //      then have no gap; g4: P4 'Overskudsvarer er også grundlaget' has no overskudsmad before it and no ten-year marker; g5: repeats an earlier point, closes nothing. Fits none without repeating P2.
    //   b7 has no year and no referent for the hooks: g1: P1 'Samme år' needs a year, b7 gives none; g2: does not answer the question about households; g3: nothing about the app for 'end appen'; g4: no 'åbningen', no overskudsmad;
    //      g5: a leap back to the founding after the closing figures, no link to P4. Fits none.
    // 7x5 simulation after rework (Y own gap, - no fit, m grammatical but a named hook breaks):
    //          g1 g2 g3 g4 g5
    //   b1      -  Y  -  -  -
    //   b2      -  -  -  Y  m     (b2@g5: P4 'Overskudsvarer er også grundlaget' and the ten-year story need b2 BEFORE P4; b4 owns g5)
    //   b3      Y  -  -  -  -
    //   b4      -  -  -  m  Y     (b4@g4: P4 'Overskudsvarer er også grundlaget' needs 'overskudsmad' just before, and b4 cites the Wefood tons before P4 gives them)
    //   b5      -  -  Y  m  -     (b5@g4: P4 needs overskudsmad, P3 -> 'Hvor langt appen er nået' has no app in P3's last sentence)
    //   b6      -  -  m  -  -
    //   b7      m  -  -  -  -     (b7@g1: P1 'Samme år' has no year)
    // Unique solution: every correct block has exactly one Y; the m cells are closed by the hooks named in the gap notes.
    // =====================================================================================================
    {
      id: 'art-madspild',
      mode: 'insert',
      level: 'B2',
      title: 'Madspild: fra en dansk bevægelse til kendte løsninger',
      genre: 'baggrund',
      kicker: 'Baggrund · Mad og miljø',
      paragraphs: [
        'Madspild er mad, der bliver smidt ud, selv om den kunne være spist. I Danmark kom der mellem 2008 og 2016 tre løsninger på problemet: en forbrugerbevægelse, en app og en butik. Historien begynder med bevægelsen.',
        'Samme år fik bevægelsen en samarbejdspartner i detailhandlen. Kæden REMA 1000 har siden 2008 samarbejdet med den og har blandt andet afskaffet mængderabatter for at mindske madspild. Men hvad ved vi om madspildet i de danske hjem?',
        'I mellemtiden kom der nye løsninger til. Appen Too Good To Go blev skabt i Danmark i 2015, og ifølge Wikipedia ligger virksomhedens hovedkontor i København.',
        'Wefood gik en anden vej end appen. Butikken åbnede på Amager i februar 2016. Ifølge Folkekirkens Nødhjælps egen pressemeddelelse fra februar 2026 mødte verdenspressen talstærkt op, og butikkerne drives af frivillige kræfter under Folkekirkens Nødhjælp.',
        'Overskudsvarer er også grundlaget for Wefood. Ifølge samme pressemeddelelse er der på ti år solgt overskudsvarer fra butikkerne svarende til 3.036 ton mad og drikke. Det er organisationens eget tal, og det gælder solgte varer og ikke det samlede madspild.'
      ],
      gaps: [
        { id: 'art-madspild-g1', after: 0, note: 'Bevægelsen nævnes først i slutningen af indledningen, og Samme år kræver et årstal i afsnittet før.' },
        { id: 'art-madspild-g2', after: 1, note: 'Spørgsmålet om madspildet i de danske hjem får svar i tal for husholdningerne, og I mellemtiden kræver perioden 2011-2017.' },
        { id: 'art-madspild-g3', after: 2, note: 'Appen går igen før og efter hullet, og end appen er en modsætning, som kræver, at appen er beskrevet.' },
        { id: 'art-madspild-g4', after: 3, note: 'Næsten ti år efter åbningen fortsætter fra februar 2016, og overskudsmad forbereder Overskudsvarer er også grundlaget.' },
        { id: 'art-madspild-g5', after: 4, note: 'Tallene i denne tekst henviser til de tal, der er nævnt, og afsnittet runder teksten af.' }
      ],
      blocks: [
        { id: 'art-madspild-b1', text: 'For husholdningerne findes der tal. Ifølge Miljøstyrelsens kortlægning (tal fra 2018) faldt madspildet i husholdningerne fra 261.000 ton i 2011/12 til 247.000 ton i 2017, og forskellen er 14.000 ton. Tallet gælder kun husholdninger og viser ikke, hvad faldet skyldes.' },
        { id: 'art-madspild-b2', text: 'Næsten ti år efter åbningen blev en regel fortolket anderledes. I december 2025 ændrede Fødevarestyrelsen fortolkningen af 1/3-reglen, så donation af overskudsmad undtages fra reglen. Der er tale om en ændret fortolkning og ikke om en ny lov.' },
        { id: 'art-madspild-b3', text: 'Den hedder Stop Spild Af Mad og blev stiftet den 31. juli 2008. Det gør den til den ældste af de tre løsninger.' },
        { id: 'art-madspild-b4', text: 'Tallene i denne tekst måler forskellige ting. Husholdningernes ton gælder årene 2011 til 2017, virksomhedens poser er dens egen opgørelse pr. august 2023, og Wefoods ton gælder solgte varer over ti år. De kan derfor ikke lægges sammen til ét tal for madspild i Danmark.' },
        { id: 'art-madspild-b5', text: 'Hvor langt appen er nået, viser virksomhedens egne tal. Pr. august 2023 var der 164.000 virksomheder, 62 millioner brugere og 155 millioner reddede poser mad. Det er virksomhedens egen opgørelse og ikke en uafhængig måling.' },
        { id: 'art-madspild-b6', text: 'Too Good To Go er en dansk idé. Virksomheden blev skabt i Danmark i 2015, og ifølge Wikipedia ligger dens hovedkontor i København.' },
        { id: 'art-madspild-b7', text: 'Den, der stiftede bevægelsen, er ifølge Wikipedia også dens daglige leder, og organisationen drives af frivillig arbejdskraft.' }
      ],
      solution: {
        'art-madspild-g1': 'art-madspild-b3',
        'art-madspild-g2': 'art-madspild-b1',
        'art-madspild-g3': 'art-madspild-b5',
        'art-madspild-g4': 'art-madspild-b2',
        'art-madspild-g5': 'art-madspild-b4'
      },
      sources: [
        'https://www.fodevarefokus.dk/10-aar-med-madspild-i-fokus/',
        'https://da.wikipedia.org/wiki/Stop_Spild_Af_Mad',
        'https://stopspildafmad.org/om-madspild/madspild-i-tal/',
        'https://en.wikipedia.org/wiki/Too_Good_To_Go',
        'https://via.ritzau.dk/pressemeddelelse/14808502/10-ar-med-wefood-verdens-forste-madspildssupermarked?publisherId=13559172&lang=da',
        'https://fvm.dk/nyheder-og-pressemeddelelser/2025/dec/mindre-madspild-nu-bliver-det-lettere-at-donere-overskudsmad',
        'https://en.wikipedia.org/wiki/Stop_Wasting_Food',
        'https://mst.dk/nyheder/2023/maj/affaldsmaengden-fra-de-danske-husstande-er-kortlagt'
      ],
      verify: true
    }
  ];
})();
