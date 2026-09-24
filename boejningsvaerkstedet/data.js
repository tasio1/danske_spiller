// boejningsvaerkstedet/data.js
// Bøjningsværkstedet dataset — window.BOEJNINGS_DATA
// Schema and mode targets: see prd.md § Phase 2 and improvement/specs.md § 4.
//
// Modes 1–3 are generated at load time from the canonical shared datasets
// (window.DANSK_NOUNS, window.DANSK_ADJECTIVES) so the item sets always track
// the canonical word lists — no manual re-sync needed when those files grow.
//
//   Mode 1 fire_former         ← DANSK_NOUNS × 4 paradigm cells
//   Mode 2 byg_navneordet      ← curated natural noun+adjective pairs × 3 phrase forms
//   Mode 3 adjektivvaerkstedet ← DANSK_ADJECTIVES × agreement contexts
//
// Modes 4–6 are not yet populated (see PROGRESS.md task boejning-data).
(function () {
  'use strict';

  var NOUNS = (typeof window !== 'undefined' && window.DANSK_NOUNS) || [];
  var ADJECTIVES = (typeof window !== 'undefined' && window.DANSK_ADJECTIVES) || [];

  var NOUN_BY_ID = {};
  NOUNS.forEach(function (n) { NOUN_BY_ID[n.id] = n; });
  var ADJ_BY_ID = {};
  ADJECTIVES.forEach(function (a) { ADJ_BY_ID[a.id] = a; });

  var LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];
  function maxLevel(a, b) {
    return LEVEL_ORDER.indexOf(a) >= LEVEL_ORDER.indexOf(b) ? a : b;
  }
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function uniq(arr) {
    var seen = {}, out = [];
    arr.forEach(function (x) { if (x && !seen[x]) { seen[x] = true; out.push(x); } });
    return out;
  }

  // Adjectives whose definite/plural form is a plural-only form (differs from
  // the definite singular, e.g. lille → små) or otherwise inflect irregularly
  // for agreement. Unsafe for mechanical phrase/agreement generation.
  var ADJ_EXCLUDE = { lille: 1, anden: 1, egen: 1, megen: 1, liden: 1, al: 1 };

  // =====================================================================
  //  Mode 1 — Fire former (noun paradigm, one cell per item)
  // =====================================================================
  var FORMS = [
    { key: 'indefinite_singular', slug: 'ubestemt-ental' },
    { key: 'definite_singular', slug: 'bestemt-ental' },
    { key: 'indefinite_plural', slug: 'ubestemt-flertal' },
    { key: 'definite_plural', slug: 'bestemt-flertal' }
  ];

  function fireFormerNote(noun, formKey) {
    switch (formKey) {
      case 'indefinite_singular':
        return capitalize(noun.base) + ' er et \'' + noun.gender + '\'-ord: ' + noun.indefinite_singular + '.';
      case 'definite_singular':
        return 'Bestemt ental dannes ved at føje en bestemt endelse til stammen: ' +
          noun.base + ' → ' + noun.definite_singular + '.';
      case 'indefinite_plural':
        return noun.note;
      case 'definite_plural':
        return 'Bestemt flertal dannes ved at føje -ne/-ene til ubestemt flertal: ' +
          noun.indefinite_plural + ' → ' + noun.definite_plural + '.';
      default:
        return noun.note;
    }
  }

  function buildFireFormer() {
    var items = [];
    NOUNS.forEach(function (noun) {
      FORMS.forEach(function (form) {
        var answer = noun[form.key];
        if (!answer) { return; }
        items.push({
          id: noun.id + '-' + form.slug,
          noun_id: noun.id,
          level: noun.level,
          mode: 'fire_former',
          requested_form: form.key,
          accepted_answers: [answer],
          note: fireFormerNote(noun, form.key)
        });
      });
    });
    return items;
  }

  // =====================================================================
  //  Mode 3 — Adjektivværkstedet (adjective agreement, free-text)
  //  Schema: prd.md § 2.4 (adjective agreement item)
  // =====================================================================
  function buildAdjektiv() {
    var items = [];
    ADJECTIVES.forEach(function (a) {
      if (a.verify) { return; }            // skip forms not yet native-verified
      if (ADJ_EXCLUDE[a.id]) { return; }
      var common = a.common_form, neuter = a.neuter_form, ePlur = a.definite_plural_form;
      if (!common || !neuter || !ePlur) { return; }

      if (a.indeclinable) {
        // One representative item — indeclinable adjectives never change form.
        items.push({
          id: a.id + '-adj-intetkoen',
          level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
          gender: 'neuter', definiteness: 'indefinite', number: 'singular',
          accepted_answers: [neuter],
          note: capitalize(a.base) + ' er ubøjeligt og har samme form i alle køn, tal og bestemthed.'
        });
        return;
      }

      var neuterNote;
      if (neuter === common + 't') {
        neuterNote = 'Intetkøn (et-ord) ubestemt ental: tillægsordet får -t: ' + neuter + '.';
      } else if (neuter === common) {
        neuterNote = capitalize(a.base) + ' ændrer sig ikke i intetkøn ubestemt ental: ' + neuter + '.';
      } else {
        neuterNote = 'Intetkøn ubestemt ental af ' + a.base + ': ' + neuter + '.';
      }

      items.push({
        id: a.id + '-adj-faelleskoen',
        level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
        gender: 'common', definiteness: 'indefinite', number: 'singular',
        accepted_answers: [common],
        note: 'Fælleskøn (en-ord) ubestemt ental: tillægsordet står i grundform: ' + common + '.'
      });
      items.push({
        id: a.id + '-adj-intetkoen',
        level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
        gender: 'neuter', definiteness: 'indefinite', number: 'singular',
        accepted_answers: [neuter], note: neuterNote
      });
      items.push({
        id: a.id + '-adj-flertal',
        level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
        gender: null, definiteness: 'indefinite', number: 'plural',
        accepted_answers: [ePlur],
        note: 'I flertal ender tillægsordet på -e: ' + ePlur + '.'
      });
      items.push({
        id: a.id + '-adj-bestemt',
        level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
        gender: 'common', definiteness: 'definite', number: 'singular',
        accepted_answers: [ePlur],
        note: 'Bestemt form bruger også -e-formen: ' + ePlur + '.'
      });
    });
    return items;
  }

  // =====================================================================
  //  Mode 2 — Byg navneordet (noun-phrase construction, tap-to-place tiles)
  //  Schema: prd.md § 2.4 / § 4.6 (noun-phrase construction item)
  // =====================================================================
  // Curated natural pairings only (spec § 4.7: filter for semantic
  // naturalness). Universal size/age/quality adjectives combine naturally
  // with any concrete count noun; the two pools keep animate vs. object
  // combinations plausible.
  var PEOPLE = ['mand', 'kvinde', 'dreng', 'pige', 'ven', 'veninde', 'nabo', 'kat', 'hund', 'hest', 'fugl', 'gris', 'loeve', 'elefant', 'abe', 'bjoern', 'raev', 'ulv'];
  var PEOPLE_ADJ = ['stor', 'ung', 'god', 'smuk', 'sjov'];
  var OBJECTS = ['hus', 'bord', 'stol', 'seng', 'lampe', 'bil', 'tog', 'baad', 'skib', 'cykel', 'telefon', 'computer', 'bog', 'sko', 'by', 'park', 'kirke', 'butik', 'restaurant', 'skole'];
  var OBJECTS_ADJ = ['stor', 'ny', 'god', 'dyr', 'flot'];

  function phraseItems(nounId, adjId) {
    var noun = NOUN_BY_ID[nounId], adj = ADJ_BY_ID[adjId];
    if (!noun || !adj || ADJ_EXCLUDE[adjId]) { return []; }
    var base = noun.base, defsg = noun.definite_singular,
        plur = noun.indefinite_plural, defpl = noun.definite_plural, gender = noun.gender;
    var common = adj.common_form, neuter = adj.neuter_form, ePlur = adj.definite_plural_form;
    if (!base || !defsg || !plur || !defpl || !common || !neuter || !ePlur) { return []; }
    if (gender !== 'en' && gender !== 'et') { return []; }

    var isNeuter = gender === 'et';
    var artIndef = gender;                       // en / et
    var artDef = isNeuter ? 'det' : 'den';
    var artOpp = isNeuter ? 'en' : 'et';         // wrong-gender distractor
    var adjIndef = isNeuter ? neuter : common;
    var adjForms = uniq([common, neuter, ePlur]);
    var lvl = maxLevel(noun.level, adj.level);
    var featGender = isNeuter ? 'neuter' : 'common';

    return [
      {
        id: adjId + '-' + nounId + '-ubestemt-ental',
        level: lvl, mode: 'byg_navneordet', noun_id: nounId, adjective_id: adjId,
        features: { number: 'singular', definiteness: 'indefinite', gender: featGender },
        pieces: uniq([artIndef, artOpp].concat(adjForms).concat([base, defsg])),
        accepted_orders: [[artIndef, adjIndef, base]],
        note: (isNeuter ? 'Intetkøn' : 'Fælleskøn') + ' ubestemt ental: ' +
          artIndef + ' + ' + (isNeuter ? 'intetkønsformen' : 'grundformen') + ' + navneord.'
      },
      {
        id: adjId + '-' + nounId + '-bestemt-ental',
        level: lvl, mode: 'byg_navneordet', noun_id: nounId, adjective_id: adjId,
        features: { number: 'singular', definiteness: 'definite', gender: featGender },
        pieces: uniq([artDef, artOpp].concat(adjForms).concat([base, defsg])),
        accepted_orders: [[artDef, ePlur, base]],
        note: 'Bestemt ental med tillægsord: foranstillet ' + artDef +
          ' + -e-form + grundform af navneordet (ikke ' + defsg + ').'
      },
      {
        id: adjId + '-' + nounId + '-bestemt-flertal',
        level: lvl, mode: 'byg_navneordet', noun_id: nounId, adjective_id: adjId,
        features: { number: 'plural', definiteness: 'definite', gender: featGender },
        pieces: uniq(['de', artDef].concat(adjForms).concat([plur, defpl])),
        accepted_orders: [['de', ePlur, plur]],
        note: 'Bestemt flertal med tillægsord: de + -e-form + ubestemt flertal (ikke ' + defpl + ').'
      }
    ];
  }

  function buildByg() {
    var items = [];
    PEOPLE.forEach(function (nid) {
      PEOPLE_ADJ.forEach(function (aid) { items = items.concat(phraseItems(nid, aid)); });
    });
    OBJECTS.forEach(function (nid) {
      OBJECTS_ADJ.forEach(function (aid) { items = items.concat(phraseItems(nid, aid)); });
    });
    return items;
  }

  // =====================================================================
  //  Mode 4 — Sammenligningspressen (comparison, three-slot free-text)
  //  Schema: prd.md § 2.4 (comparison item). Generated from adjectives.js so
  //  the set tracks the canonical adjective list. Skips indeclinable adjectives
  //  (no comparison) and verify:true forms (not yet native-verified).
  // =====================================================================
  function buildSammenligning() {
    var items = [];
    ADJECTIVES.forEach(function (a) {
      if (a.verify) { return; }
      if (a.indeclinable) { return; }
      var grund = a.common_form, komp = a.comparative,
          sup = a.superlative_indefinite, supDef = a.superlative_definite;
      if (!grund || !komp || !sup) { return; }

      var ctype = a.irregular ? 'irregular' : (a.periphrastic ? 'periphrastic' : 'regular');
      // Superlative: accept the bare form, the definite form, and the natural
      // "den/det + definite" phrasing used predicatively/attributively.
      var supAns = uniq([sup, supDef, 'den ' + supDef, 'det ' + supDef]);

      var note;
      if (a.irregular) {
        note = capitalize(a.base) + ' gradbøjes uregelmæssigt: ' + grund + ' → ' + komp + ' → ' + sup + '.';
      } else if (a.periphrastic) {
        note = capitalize(a.base) + ' gradbøjes med mere/mest: ' + komp + ' → ' + sup + '.';
      } else {
        note = capitalize(a.base) + ' gradbøjes med -ere/-est: ' + komp + ' → ' + sup + '.';
      }

      items.push({
        id: a.id + '-sammenligning',
        level: maxLevel(a.level, 'A2'),
        mode: 'sammenligningspressen',
        adjective_id: a.id,
        comparison_type: ctype,
        slots: [
          { label: 'grundform', accepted_answers: [grund] },
          { label: 'komparativ', accepted_answers: [komp] },
          { label: 'superlativ', accepted_answers: supAns }
        ],
        note: note
      });
    });
    return items;
  }

  // =====================================================================
  //  Mode 5 — Bestemt eller ubestemt? (definiteness in context, MC)
  //  Schema: prd.md § 2.4 (contextual definiteness item). Hand-authored short
  //  contexts (2–3 sentences); each item has exactly one defensible answer.
  //  `pattern` groups items for SRS pattern keys.
  // =====================================================================
  var BESTEMT_UBESTEMT = [
    // --- first mention (ubestemt) ---
    { id:'b5-koebte-bog', level:'A2', pattern:'foerste-omtale', context:'Jeg købte ___ i går. Bogen var alt for dyr.', options:['en bog','bogen','den bog'], correct:'en bog', note:'Første gang noget nævnes, bruges ubestemt form: en bog.' },
    { id:'b5-saa-kat', level:'A1', pattern:'foerste-omtale', context:'Jeg så ___ i haven i morges. Katten jagede en fugl.', options:['en kat','katten'], correct:'en kat', note:'Ved første omtale bruges ubestemt form: en kat.' },
    { id:'b5-fik-brev', level:'A2', pattern:'foerste-omtale', context:'Hun fik ___ i dag. Brevet var fra banken.', options:['et brev','brevet'], correct:'et brev', note:'Første omtale af et nyt et-ord: et brev.' },
    { id:'b5-moedte-mand', level:'A2', pattern:'foerste-omtale', context:'Jeg mødte ___ på toget. Han var meget venlig.', options:['en mand','manden'], correct:'en mand', note:'En ny, ukendt person nævnes med ubestemt form: en mand.' },
    // --- subsequent mention (bestemt) ---
    { id:'b5-ny-laerer', level:'A2', pattern:'anden-omtale', context:'Vi har fået en ny lærer. ___ hedder Mette.', options:['Læreren','En lærer','Lærer'], correct:'Læreren', note:'Ved anden omtale er personen kendt: bestemt form læreren.' },
    { id:'b5-et-hus', level:'A2', pattern:'anden-omtale', context:'Han fortalte om et hus ved stranden. ___ var meget gammelt.', options:['Huset','Et hus','Hus'], correct:'Huset', note:'Anden omtale bruger bestemt form: huset.' },
    { id:'b5-en-hund', level:'A1', pattern:'anden-omtale', context:'Der kom en hund løbende. ___ var helt våd.', options:['Hunden','En hund'], correct:'Hunden', note:'Hunden er nu kendt fra første sætning: bestemt form.' },
    { id:'b5-en-cykel', level:'A2', pattern:'anden-omtale', context:'Jeg har købt en cykel. ___ er blå.', options:['Cyklen','En cykel'], correct:'Cyklen', note:'Anden omtale: bestemt form cyklen.' },
    { id:'b5-en-film', level:'A2', pattern:'anden-omtale', context:'Vi så en film i går. ___ var meget kedelig.', options:['Filmen','En film'], correct:'Filmen', note:'Filmen er kendt fra første sætning: bestemt form.' },
    // --- professions without article ---
    { id:'b5-bror-laege', level:'A2', pattern:'erhverv', context:'Min bror er ___.', options:['læge','en læge','lægen'], correct:'læge', note:'Erhverv efter er/blive står uden artikel: han er læge.' },
    { id:'b5-som-sygeplejerske', level:'A2', pattern:'erhverv', context:'Hun arbejder som ___ på et hospital.', options:['sygeplejerske','en sygeplejerske'], correct:'sygeplejerske', note:'Efter som står erhverv uden artikel.' },
    { id:'b5-blive-laerer', level:'A2', pattern:'erhverv', context:'Jeg vil gerne være ___, når jeg er færdig med at læse.', options:['lærer','en lærer'], correct:'lærer', note:'Erhverv efter være står uden artikel: være lærer.' },
    { id:'b5-far-tjener', level:'A2', pattern:'erhverv', context:'Hendes far er ___ på en restaurant i byen.', options:['tjener','en tjener','tjeneren'], correct:'tjener', note:'Erhverv uden nærmere beskrivelse står uden artikel: er tjener.' },
    // --- possessive: no definite suffix ---
    { id:'b5-min-taske', level:'A2', pattern:'ejestedord', context:'Jeg kan ikke finde ___. Har du set den?', options:['min taske','min tasken','tasken min'], correct:'min taske', note:'Ejestedord + navneord i grundform: min taske, ikke min tasken.' },
    { id:'b5-mine-noegler', level:'A2', pattern:'ejestedord', context:'Åh nej, jeg har glemt ___ derhjemme.', options:['mine nøgler','mine nøglerne'], correct:'mine nøgler', note:'Efter ejestedord bruges grundform uden bestemt endelse: mine nøgler.' },
    { id:'b5-hans-bil', level:'A2', pattern:'ejestedord', context:'Den røde bil der — det er ___.', options:['hans bil','hans bilen'], correct:'hans bil', note:'Ejestedord + navneord uden bestemt endelse: hans bil.' },
    { id:'b5-dit-hus', level:'A2', pattern:'ejestedord', context:'Er det store, gule hus ___?', options:['dit hus','dit huset'], correct:'dit hus', note:'Ejestedord styrer grundform: dit hus, ikke dit huset.' },
    // --- demonstratives ---
    { id:'b5-dette-hus', level:'B1', pattern:'paapegende', context:'Jeg vil helst have ___ her, ikke det derovre.', options:['dette hus','denne hus','det hus'], correct:'dette hus', note:'Dette bruges påpegende om et-ord: dette hus.' },
    { id:'b5-denne-bog', level:'B1', pattern:'paapegende', context:'Har du læst ___ her? Den er rigtig god.', options:['denne bog','dette bog','denne bogen'], correct:'denne bog', note:'Denne bruges påpegende om en-ord: denne bog.' },
    { id:'b5-disse-sko', level:'B1', pattern:'paapegende', context:'___ her er alt for små til mig.', options:['Disse sko','Denne sko','Disse skoene'], correct:'Disse sko', note:'Disse bruges påpegende om flertal: disse sko.' },
    { id:'b5-den-mand', level:'B1', pattern:'paapegende', context:'___ mand derovre har ventet længe.', options:['Den','Det','De'], correct:'Den', note:'Den bruges påpegende om et en-ord: den mand.' },
    // --- definite adjective construction (no double definiteness) ---
    { id:'b5-store-hus', level:'B1', pattern:'foranstillet-tillaegsord', context:'Jeg kan rigtig godt lide ___ nede ved søen.', options:['det store hus','det store huset','store huset'], correct:'det store hus', note:'Med foranstillet tillægsord: det + -e-form + grundform: det store hus.' },
    { id:'b5-roede-bil', level:'B1', pattern:'foranstillet-tillaegsord', context:'Hvor er ___ parkeret henne?', options:['den røde bil','den røde bilen'], correct:'den røde bil', note:'Bestemt form med tillægsord: den røde bil, ikke bilen.' },
    { id:'b5-gamle-mand', level:'B1', pattern:'foranstillet-tillaegsord', context:'Kender du ___, der bor på hjørnet?', options:['den gamle mand','den gamle manden'], correct:'den gamle mand', note:'Foranstillet tillægsord giver grundform: den gamle mand.' },
    { id:'b5-nye-computer', level:'B1', pattern:'foranstillet-tillaegsord', context:'Må jeg lige låne ___?', options:['den nye computer','den nye computeren'], correct:'den nye computer', note:'Bestemt form med tillægsord: den nye computer.' },
    // --- generic plural ---
    { id:'b5-aebler-sunde', level:'A2', pattern:'generisk-flertal', context:'___ er sunde og fulde af vitaminer.', options:['Æbler','Æblerne','Et æble'], correct:'Æbler', note:'Generelle udsagn om en hel gruppe bruger ubestemt flertal: æbler.' },
    { id:'b5-hunde-generic', level:'A2', pattern:'generisk-flertal', context:'Kan du lide ___? Jeg elsker dem.', options:['hunde','hundene'], correct:'hunde', note:'Om hunde i almindelighed: ubestemt flertal hunde.' },
    { id:'b5-boern-leger', level:'A2', pattern:'generisk-flertal', context:'___ elsker at lege udenfor.', options:['Børn','Børnene'], correct:'Børn', note:'Generelt om alle børn: ubestemt flertal børn.' },
    { id:'b5-blomster-dufter', level:'A2', pattern:'generisk-flertal', context:'___ dufter dejligt om foråret.', options:['Blomster','Blomsterne'], correct:'Blomster', note:'Almen sandhed om blomster: ubestemt flertal blomster.' },
    // --- fixed expressions ---
    { id:'b5-i-skole', level:'A2', pattern:'fast-udtryk', context:'Mit barn går i ___ hver dag klokken otte.', options:['skole','skolen','en skole'], correct:'skole', note:'Fast udtryk: gå i skole — uden artikel.' },
    { id:'b5-i-seng', level:'A2', pattern:'fast-udtryk', context:'Jeg går altid i ___ klokken elleve.', options:['seng','sengen','en seng'], correct:'seng', note:'Fast udtryk: gå i seng — uden artikel.' },
    { id:'b5-paa-arbejde', level:'A2', pattern:'fast-udtryk', context:'Han tager på ___ klokken syv hver morgen.', options:['arbejde','arbejdet'], correct:'arbejde', note:'Fast udtryk: på arbejde — uden bestemt endelse.' },
    { id:'b5-spise-aftensmad', level:'A2', pattern:'fast-udtryk', context:'Vi spiser ___ klokken seks om aftenen.', options:['aftensmad','aftensmaden'], correct:'aftensmad', note:'Fast udtryk: spise aftensmad — uden artikel.' },
    { id:'b5-i-byen', level:'A2', pattern:'fast-udtryk', context:'Skal vi tage i ___ og handle på lørdag?', options:['byen','by','en by'], correct:'byen', note:'Fast udtryk: i byen — med bestemt form.' },
    // --- specific vs nonspecific reference ---
    { id:'b5-tolk-nonspecific', level:'B1', pattern:'specifik-reference', context:'Vi leder efter ___, der kan tale arabisk.', options:['en tolk','tolken'], correct:'en tolk', note:'Om en hvilken som helst (ikke-bestemt) person: ubestemt form en tolk.' },
    { id:'b5-manden-specific', level:'B1', pattern:'specifik-reference', context:'___, jeg talte med i går, ringer tilbage i morgen.', options:['Manden','En mand'], correct:'Manden', note:'En bestemt, kendt person: bestemt form manden.' },
    { id:'b5-loesning-nonspecific', level:'B1', pattern:'specifik-reference', context:'Vi har brug for ___ på det her problem.', options:['en løsning','løsningen'], correct:'en løsning', note:'En endnu ukendt løsning: ubestemt form en løsning.' }
  ];

  // =====================================================================
  //  Mode 6 — Mængdeværkstedet (quantifiers & countability, MC)
  //  Schema: prd.md § 2.4 (quantifier item). Hand-authored; `pattern` groups
  //  items for SRS pattern keys. Countable vs. uncountable is the core split.
  // =====================================================================
  var MAENGDE = [
    // --- mange / meget ---
    { id:'b6-mange-mennesker', level:'A1', pattern:'mange-meget', context:'Der er ___ mennesker i parken i dag.', options:['mange','meget','lidt'], correct:'mange', note:'Mange bruges om tælleligt flertal: mange mennesker.' },
    { id:'b6-meget-arbejde', level:'A1', pattern:'mange-meget', context:'Han har ___ arbejde for tiden.', options:['meget','mange','få'], correct:'meget', note:'Meget bruges om utælleligt: meget arbejde.' },
    { id:'b6-meget-tid', level:'A1', pattern:'mange-meget', context:'Jeg har ikke ___ tid i dag.', options:['meget','mange'], correct:'meget', note:'Tid er utælleligt: meget tid.' },
    { id:'b6-mange-boeger', level:'A1', pattern:'mange-meget', context:'Hun har læst ___ bøger i år.', options:['mange','meget'], correct:'mange', note:'Bøger er tælleligt: mange bøger.' },
    { id:'b6-mange-penge', level:'A2', pattern:'mange-meget', context:'Hvor ___ penge har du med?', options:['mange','meget'], correct:'mange', note:'Penge er flertal og tælles: mange penge.' },
    // --- få / lidt ---
    { id:'b6-faa-gaester', level:'A2', pattern:'faa-lidt', context:'Der kom kun ___ gæster til festen.', options:['få','lidt','meget'], correct:'få', note:'Få bruges om tælleligt: få gæster.' },
    { id:'b6-lidt-maelk', level:'A2', pattern:'faa-lidt', context:'Vi har kun ___ mælk tilbage.', options:['lidt','få'], correct:'lidt', note:'Mælk er utælleligt: lidt mælk.' },
    { id:'b6-faa-ord', level:'A2', pattern:'faa-lidt', context:'Han sagde kun ___ ord til mødet.', options:['få','lidt'], correct:'få', note:'Ord er tælleligt: få ord.' },
    { id:'b6-lidt-sukker', level:'A2', pattern:'faa-lidt', context:'Kom ___ sukker i kaffen, tak.', options:['lidt','få'], correct:'lidt', note:'Sukker er utælleligt: lidt sukker.' },
    { id:'b6-faa-fejl', level:'A2', pattern:'faa-lidt', context:'Der var kun ___ fejl i opgaven.', options:['få','lidt'], correct:'få', note:'Fejl er tælleligt: få fejl.' },
    // --- flere / mere ---
    { id:'b6-mere-kaffe', level:'A2', pattern:'flere-mere', context:'Kan jeg få ___ kaffe, tak?', options:['mere','flere'], correct:'mere', note:'Mere bruges om utælleligt: mere kaffe.' },
    { id:'b6-flere-stole', level:'A2', pattern:'flere-mere', context:'Vi skal bruge ___ stole til gæsterne.', options:['flere','mere'], correct:'flere', note:'Flere bruges om tælleligt: flere stole.' },
    { id:'b6-mere-vand', level:'A2', pattern:'flere-mere', context:'Planten har brug for ___ vand.', options:['mere','flere'], correct:'mere', note:'Vand er utælleligt: mere vand.' },
    // --- færre / mindre ---
    { id:'b6-faerre-studerende', level:'B1', pattern:'faerre-mindre', context:'I år er der ___ studerende end sidste år.', options:['færre','mindre'], correct:'færre', note:'Færre bruges om tælleligt: færre studerende.' },
    { id:'b6-mindre-kaffe', level:'B1', pattern:'faerre-mindre', context:'Jeg prøver at drikke ___ kaffe end før.', options:['mindre','færre'], correct:'mindre', note:'Kaffe er utælleligt: mindre kaffe.' },
    { id:'b6-faerre-biler', level:'B1', pattern:'faerre-mindre', context:'Der er ___ biler på vejen om søndagen.', options:['færre','mindre'], correct:'færre', note:'Biler er tælleligt: færre biler.' },
    // --- al / alt / alle ---
    { id:'b6-alle-boern', level:'A2', pattern:'al-alt-alle', context:'___ børnene legede ude i haven.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle børn.' },
    { id:'b6-al-mad', level:'A2', pattern:'al-alt-alle', context:'Han spiste ___ maden op med det samme.', options:['al','alle','alt'], correct:'al', note:'Al bruges om utælleligt fælleskøn: al maden.' },
    { id:'b6-alt-i-orden', level:'A2', pattern:'al-alt-alle', context:'Er ___ i orden med dig?', options:['alt','al','alle'], correct:'alt', note:'Alt står alene om noget abstrakt/utælleligt: er alt i orden?' },
    { id:'b6-alt-vand', level:'A2', pattern:'al-alt-alle', context:'___ vandet løb ud på gulvet.', options:['Alt','Al','Alle'], correct:'Alt', note:'Alt bruges om utælleligt intetkøn: alt vandet.' },
    // --- hver / hvert ---
    { id:'b6-hver-dag', level:'A1', pattern:'hver-hvert', context:'___ dag går jeg en lang tur.', options:['Hver','Hvert'], correct:'Hver', note:'Hver bruges om en-ord: hver dag.' },
    { id:'b6-hvert-barn', level:'A2', pattern:'hver-hvert', context:'___ barn fik en ballon med hjem.', options:['Hvert','Hver'], correct:'Hvert', note:'Hvert bruges om et-ord: hvert barn.' },
    { id:'b6-hver-uge', level:'A2', pattern:'hver-hvert', context:'Vi mødes ___ uge til træning.', options:['hver','hvert'], correct:'hver', note:'Uge er en-ord: hver uge.' },
    { id:'b6-hvert-aar', level:'A2', pattern:'hver-hvert', context:'De rejser til Norge ___ år.', options:['hvert','hver'], correct:'hvert', note:'År er et-ord: hvert år.' },
    // --- begge ---
    { id:'b6-begge-foraeldre', level:'A2', pattern:'begge', context:'___ mine forældre arbejder som lærere.', options:['Begge','Hver','Al'], correct:'Begge', note:'Begge bruges om præcis to: begge mine forældre.' },
    { id:'b6-begge-haender', level:'A2', pattern:'begge', context:'Hun holdt fast om koppen med ___ hænder.', options:['begge','hver','alle'], correct:'begge', note:'Begge bruges om et par (to): begge hænder.' },
    // --- ingen / intet ---
    { id:'b6-ingen-maelk', level:'A2', pattern:'ingen-intet', context:'Der er ___ mælk tilbage i køleskabet.', options:['ingen','intet'], correct:'ingen', note:'Ingen bruges om fælleskøn og flertal: ingen mælk.' },
    { id:'b6-intet-problem', level:'B1', pattern:'ingen-intet', context:'Han har ___ problem med at vente.', options:['intet','ingen'], correct:'intet', note:'Intet bruges om et-ord: intet problem.' },
    { id:'b6-ingen-kom', level:'A2', pattern:'ingen-intet', context:'___ kom til mødet i morges.', options:['Ingen','Intet'], correct:'Ingen', note:'Ingen bruges om personer: ingen kom.' },
    { id:'b6-intet-svar', level:'B1', pattern:'ingen-intet', context:'Vi fik ___ svar på vores brev.', options:['intet','ingen'], correct:'intet', note:'Svar er et-ord: intet svar.' },
    // --- nogen / nogle / noget ---
    { id:'b6-nogen-hjemme', level:'A2', pattern:'nogen-nogle-noget', context:'Er der ___ hjemme?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges i spørgsmål om en enkelt person: er der nogen?' },
    { id:'b6-nogle-aebler', level:'A2', pattern:'nogen-nogle-noget', context:'Jeg har købt ___ æbler til madpakken.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et ubestemt tælleligt flertal: nogle æbler.' },
    { id:'b6-noget-kaffe', level:'A2', pattern:'nogen-nogle-noget', context:'Vil du have ___ kaffe?', options:['noget','nogen','nogle'], correct:'noget', note:'Noget bruges om utælleligt: noget kaffe.' },
    { id:'b6-nogle-venner', level:'A2', pattern:'nogen-nogle-noget', context:'Jeg mødtes med ___ venner i weekenden.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle venner.' },
    { id:'b6-noget-vand', level:'A2', pattern:'nogen-nogle-noget', context:'Der er ___ vand på gulvet i badeværelset.', options:['noget','nogle','nogen'], correct:'noget', note:'Vand er utælleligt: noget vand.' },
    // --- mange / meget (extra) ---
    { id:'b6-meget-sne', level:'A2', pattern:'mange-meget', context:'Der faldt ___ sne i weekenden.', options:['meget','mange'], correct:'meget', note:'Sne er utælleligt: meget sne.' },
    { id:'b6-mange-timer', level:'A2', pattern:'mange-meget', context:'Han bruger ___ timer på lektier.', options:['mange','meget'], correct:'mange', note:'Timer er tælleligt flertal: mange timer.' },
    { id:'b6-meget-salt', level:'A2', pattern:'mange-meget', context:'Der er ___ salt i suppen.', options:['meget','mange'], correct:'meget', note:'Salt er utælleligt: meget salt.' },
    { id:'b6-mange-elever', level:'A2', pattern:'mange-meget', context:'Der går ___ elever på skolen.', options:['mange','meget'], correct:'mange', note:'Elever er tælleligt flertal: mange elever.' },
    { id:'b6-meget-regn', level:'A2', pattern:'mange-meget', context:'Vi fik ___ regn i sommer.', options:['meget','mange'], correct:'meget', note:'Regn er utælleligt: meget regn.' },
    { id:'b6-mange-spoergsmaal', level:'A2', pattern:'mange-meget', context:'Eleverne stillede ___ spørgsmål.', options:['mange','meget'], correct:'mange', note:'Spørgsmål er tælleligt flertal: mange spørgsmål.' },
    { id:'b6-meget-hjaelp', level:'A2', pattern:'mange-meget', context:'Tak for ___ hjælp.', options:['meget','mange'], correct:'meget', note:'Hjælp er utælleligt: meget hjælp.' },
    { id:'b6-mange-lande', level:'B1', pattern:'mange-meget', context:'Hun har besøgt ___ lande.', options:['mange','meget'], correct:'mange', note:'Lande er tælleligt flertal: mange lande.' },
    { id:'b6-meget-mad', level:'A1', pattern:'mange-meget', context:'Der er ___ mad tilbage fra festen.', options:['meget','mange'], correct:'meget', note:'Mad er utælleligt: meget mad.' },
    { id:'b6-mange-ideer', level:'B1', pattern:'mange-meget', context:'Vi fik ___ gode idéer på mødet.', options:['mange','meget'], correct:'mange', note:'Idéer er tælleligt flertal: mange idéer.' },
    { id:'b6-meget-musik', level:'A2', pattern:'mange-meget', context:'Han hører ___ musik om aftenen.', options:['meget','mange'], correct:'meget', note:'Musik er utælleligt: meget musik.' },
    { id:'b6-mange-huse', level:'A2', pattern:'mange-meget', context:'Der bliver bygget ___ nye huse i byen.', options:['mange','meget'], correct:'mange', note:'Huse er tælleligt flertal: mange huse.' },
    { id:'b6-meget-kaerlighed', level:'B1', pattern:'mange-meget', context:'Der er ___ kærlighed i den familie.', options:['meget','mange'], correct:'meget', note:'Kærlighed er utælleligt: meget kærlighed.' },
    { id:'b6-mange-dage', level:'A2', pattern:'mange-meget', context:'Der er gået ___ dage, siden vi sås.', options:['mange','meget'], correct:'mange', note:'Dage er tælleligt flertal: mange dage.' },
    { id:'b6-meget-sukker', level:'A1', pattern:'mange-meget', context:'Der er ___ sukker i sodavand.', options:['meget','mange'], correct:'meget', note:'Sukker er utælleligt: meget sukker.' },
    { id:'b6-mange-planter', level:'A2', pattern:'mange-meget', context:'Hun har ___ planter i vindueskarmen.', options:['mange','meget'], correct:'mange', note:'Planter er tælleligt flertal: mange planter.' },
    { id:'b6-meget-erfaring', level:'B1', pattern:'mange-meget', context:'Han har ___ erfaring med børn.', options:['meget','mange'], correct:'meget', note:'Erfaring er utælleligt: meget erfaring.' },
    { id:'b6-mange-katte', level:'A2', pattern:'mange-meget', context:'Der bor ___ katte i den gade.', options:['mange','meget'], correct:'mange', note:'Katte er tælleligt flertal: mange katte.' },
    { id:'b6-meget-plads', level:'A2', pattern:'mange-meget', context:'Der er ___ plads i den nye lejlighed.', options:['meget','mange'], correct:'meget', note:'Plads er utælleligt: meget plads.' },
    { id:'b6-mange-fejl', level:'A2', pattern:'mange-meget', context:'Der var ___ fejl i teksten.', options:['mange','meget'], correct:'mange', note:'Fejl er tælleligt flertal: mange fejl.' },
    { id:'b6-meget-vin', level:'B1', pattern:'mange-meget', context:'Der blev drukket ___ vin til festen.', options:['meget','mange'], correct:'meget', note:'Vin er utælleligt her: meget vin.' },
    { id:'b6-mange-turister', level:'B1', pattern:'mange-meget', context:'Der kommer ___ turister om sommeren.', options:['mange','meget'], correct:'mange', note:'Turister er tælleligt flertal: mange turister.' },
    { id:'b6-meget-benzin', level:'B1', pattern:'mange-meget', context:'Bilen bruger ___ benzin.', options:['meget','mange'], correct:'meget', note:'Benzin er utælleligt: meget benzin.' },
    // --- få / lidt (extra) ---
    { id:'b6-lidt-vand', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ vand tilbage i flasken.', options:['lidt','få'], correct:'lidt', note:'Vand er utælleligt: lidt vand.' },
    { id:'b6-faa-venner', level:'A2', pattern:'faa-lidt', context:'Han har kun ___ venner.', options:['få','lidt'], correct:'få', note:'Venner er tælleligt: få venner.' },
    { id:'b6-lidt-tid', level:'A2', pattern:'faa-lidt', context:'Jeg har kun ___ tid i dag.', options:['lidt','få'], correct:'lidt', note:'Tid er utælleligt: lidt tid.' },
    { id:'b6-faa-boeger', level:'A2', pattern:'faa-lidt', context:'Der stod kun ___ bøger på hylden.', options:['få','lidt'], correct:'få', note:'Bøger er tælleligt: få bøger.' },
    { id:'b6-lidt-kaffe', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ kaffe tilbage.', options:['lidt','få'], correct:'lidt', note:'Kaffe er utælleligt: lidt kaffe.' },
    { id:'b6-faa-biler', level:'A2', pattern:'faa-lidt', context:'Der holdt kun ___ biler på pladsen.', options:['få','lidt'], correct:'få', note:'Biler er tælleligt: få biler.' },
    { id:'b6-lidt-broed', level:'A2', pattern:'faa-lidt', context:'Vi har kun ___ brød tilbage.', options:['lidt','få'], correct:'lidt', note:'Brød er utælleligt her: lidt brød.' },
    { id:'b6-faa-elever', level:'A2', pattern:'faa-lidt', context:'Der var kun ___ elever i klassen i dag.', options:['få','lidt'], correct:'få', note:'Elever er tælleligt: få elever.' },
    { id:'b6-lidt-salt', level:'A2', pattern:'faa-lidt', context:'Kom kun ___ salt i.', options:['lidt','få'], correct:'lidt', note:'Salt er utælleligt: lidt salt.' },
    { id:'b6-faa-timer', level:'A2', pattern:'faa-lidt', context:'Vi har kun ___ timer tilbage.', options:['få','lidt'], correct:'få', note:'Timer er tælleligt: få timer.' },
    { id:'b6-lidt-snee', level:'A2', pattern:'faa-lidt', context:'Der faldt kun ___ sne i nat.', options:['lidt','få'], correct:'lidt', note:'Sne er utælleligt: lidt sne.' },
    { id:'b6-faa-penge', level:'A2', pattern:'faa-lidt', context:'Jeg har kun ___ penge med.', options:['få','lidt'], correct:'få', note:'Penge er flertal og tælles: få penge.' },
    { id:'b6-lidt-mad', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ mad i køleskabet.', options:['lidt','få'], correct:'lidt', note:'Mad er utælleligt: lidt mad.' },
    { id:'b6-faa-dage', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ dage til ferien.', options:['få','lidt'], correct:'få', note:'Dage er tælleligt: få dage.' },
    { id:'b6-lidt-te', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ te tilbage i kanden.', options:['lidt','få'], correct:'lidt', note:'Te er utælleligt: lidt te.' },
    { id:'b6-faa-spoergsmaal', level:'A2', pattern:'faa-lidt', context:'Der var kun ___ spørgsmål til sidst.', options:['få','lidt'], correct:'få', note:'Spørgsmål er tælleligt: få spørgsmål.' },
    { id:'b6-lidt-plads', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ plads i skabet.', options:['lidt','få'], correct:'lidt', note:'Plads er utælleligt: lidt plads.' },
    { id:'b6-faa-huse', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ huse til salg lige nu.', options:['få','lidt'], correct:'få', note:'Huse er tælleligt: få huse.' },
    { id:'b6-lidt-regn', level:'A2', pattern:'faa-lidt', context:'Der kom kun ___ regn i dag.', options:['lidt','få'], correct:'lidt', note:'Regn er utælleligt: lidt regn.' },
    { id:'b6-faa-stole', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ stole tilbage.', options:['få','lidt'], correct:'få', note:'Stole er tælleligt: få stole.' },
    { id:'b6-lidt-hjaelp', level:'A2', pattern:'faa-lidt', context:'Jeg fik kun ___ hjælp.', options:['lidt','få'], correct:'lidt', note:'Hjælp er utælleligt: lidt hjælp.' },
    { id:'b6-faa-aebler', level:'A2', pattern:'faa-lidt', context:'Der var kun ___ æbler tilbage på træet.', options:['få','lidt'], correct:'få', note:'Æbler er tælleligt: få æbler.' },
    // --- flere / mere (extra) ---
    { id:'b6-flere-boeger', level:'A2', pattern:'flere-mere', context:'Jeg vil gerne læse ___ bøger til sommer.', options:['flere','mere'], correct:'flere', note:'Bøger er tælleligt: flere bøger.' },
    { id:'b6-mere-tid', level:'A2', pattern:'flere-mere', context:'Vi har brug for ___ tid til opgaven.', options:['mere','flere'], correct:'mere', note:'Tid er utælleligt: mere tid.' },
    { id:'b6-flere-venner', level:'A2', pattern:'flere-mere', context:'Hun har fået ___ venner efter flytningen.', options:['flere','mere'], correct:'flere', note:'Venner er tælleligt: flere venner.' },
    { id:'b6-mere-mad', level:'A2', pattern:'flere-mere', context:'Er der ___ mad tilbage?', options:['mere','flere'], correct:'mere', note:'Mad er utælleligt: mere mad.' },
    { id:'b6-flere-timer', level:'B1', pattern:'flere-mere', context:'Han vil gerne arbejde ___ timer.', options:['flere','mere'], correct:'flere', note:'Timer er tælleligt: flere timer.' },
    { id:'b6-mere-sukker', level:'A2', pattern:'flere-mere', context:'Kagen skal have ___ sukker.', options:['mere','flere'], correct:'mere', note:'Sukker er utælleligt: mere sukker.' },
    { id:'b6-flere-elever', level:'B1', pattern:'flere-mere', context:'Skolen har fået ___ elever i år.', options:['flere','mere'], correct:'flere', note:'Elever er tælleligt: flere elever.' },
    { id:'b6-mere-maelk', level:'A2', pattern:'flere-mere', context:'Vi skal købe ___ mælk.', options:['mere','flere'], correct:'mere', note:'Mælk er utælleligt: mere mælk.' },
    { id:'b6-flere-detaljer', level:'B1', pattern:'flere-mere', context:'Kan du give mig ___ detaljer?', options:['flere','mere'], correct:'flere', note:'Detaljer er tælleligt: flere detaljer.' },
    { id:'b6-mere-salt', level:'A2', pattern:'flere-mere', context:'Suppen mangler ___ salt.', options:['mere','flere'], correct:'mere', note:'Salt er utælleligt: mere salt.' },
    { id:'b6-flere-biler', level:'B1', pattern:'flere-mere', context:'Der kommer ___ biler på vejene hvert år.', options:['flere','mere'], correct:'flere', note:'Biler er tælleligt: flere biler.' },
    { id:'b6-mere-plads', level:'A2', pattern:'flere-mere', context:'Vi har brug for ___ plads.', options:['mere','flere'], correct:'mere', note:'Plads er utælleligt: mere plads.' },
    { id:'b6-flere-spoergsmaal', level:'B1', pattern:'flere-mere', context:'Har I ___ spørgsmål?', options:['flere','mere'], correct:'flere', note:'Spørgsmål er tælleligt: flere spørgsmål.' },
    { id:'b6-mere-information', level:'B1', pattern:'flere-mere', context:'Jeg har brug for ___ information om kurset.', options:['mere','flere'], correct:'mere', note:'Information er utælleligt: mere information.' },
    { id:'b6-flere-dage', level:'A2', pattern:'flere-mere', context:'Kan vi blive ___ dage?', options:['flere','mere'], correct:'flere', note:'Dage er tælleligt: flere dage.' },
    { id:'b6-mere-te', level:'A2', pattern:'flere-mere', context:'Vil du have ___ te?', options:['mere','flere'], correct:'mere', note:'Te er utælleligt: mere te.' },
    { id:'b6-flere-huse', level:'B1', pattern:'flere-mere', context:'Der skal bygges ___ huse.', options:['flere','mere'], correct:'flere', note:'Huse er tælleligt: flere huse.' },
    { id:'b6-mere-sne', level:'A2', pattern:'flere-mere', context:'Der kommer ___ sne i morgen.', options:['mere','flere'], correct:'mere', note:'Sne er utælleligt: mere sne.' },
    { id:'b6-flere-lande', level:'B1', pattern:'flere-mere', context:'Hun vil gerne besøge ___ lande.', options:['flere','mere'], correct:'flere', note:'Lande er tælleligt: flere lande.' },
    // --- færre / mindre (extra) ---
    { id:'b6-mindre-sukker', level:'B1', pattern:'faerre-mindre', context:'Prøv at spise ___ sukker.', options:['mindre','færre'], correct:'mindre', note:'Sukker er utælleligt: mindre sukker.' },
    { id:'b6-faerre-fejl', level:'B1', pattern:'faerre-mindre', context:'Jeg laver ___ fejl nu end før.', options:['færre','mindre'], correct:'færre', note:'Fejl er tælleligt: færre fejl.' },
    { id:'b6-mindre-salt', level:'B1', pattern:'faerre-mindre', context:'Læger anbefaler ___ salt i maden.', options:['mindre','færre'], correct:'mindre', note:'Salt er utælleligt: mindre salt.' },
    { id:'b6-faerre-elever', level:'B1', pattern:'faerre-mindre', context:'Der er ___ elever i klassen i år.', options:['færre','mindre'], correct:'færre', note:'Elever er tælleligt: færre elever.' },
    { id:'b6-mindre-tid', level:'B1', pattern:'faerre-mindre', context:'Jeg har ___ tid nu end tidligere.', options:['mindre','færre'], correct:'mindre', note:'Tid er utælleligt: mindre tid.' },
    { id:'b6-faerre-timer', level:'B1', pattern:'faerre-mindre', context:'Han arbejder ___ timer om ugen nu.', options:['færre','mindre'], correct:'færre', note:'Timer er tælleligt: færre timer.' },
    { id:'b6-mindre-mad', level:'B1', pattern:'faerre-mindre', context:'Vi smider ___ mad ud end før.', options:['mindre','færre'], correct:'mindre', note:'Mad er utælleligt: mindre mad.' },
    { id:'b6-faerre-turister', level:'B1', pattern:'faerre-mindre', context:'Der kom ___ turister i år.', options:['færre','mindre'], correct:'færre', note:'Turister er tælleligt: færre turister.' },
    { id:'b6-mindre-koed', level:'B1', pattern:'faerre-mindre', context:'Han spiser ___ kød end før.', options:['mindre','færre'], correct:'mindre', note:'Kød er utælleligt: mindre kød.' },
    { id:'b6-faerre-boeger', level:'B1', pattern:'faerre-mindre', context:'Folk læser ___ bøger i dag.', options:['færre','mindre'], correct:'færre', note:'Bøger er tælleligt: færre bøger.' },
    { id:'b6-mindre-benzin', level:'B1', pattern:'faerre-mindre', context:'Nye biler bruger ___ benzin.', options:['mindre','færre'], correct:'mindre', note:'Benzin er utælleligt: mindre benzin.' },
    { id:'b6-faerre-penge', level:'B1', pattern:'faerre-mindre', context:'Vi har ___ penge til rådighed i år.', options:['færre','mindre'], correct:'færre', note:'Penge er flertal og tælles: færre penge.' },
    { id:'b6-mindre-regn', level:'B1', pattern:'faerre-mindre', context:'Der faldt ___ regn end normalt.', options:['mindre','færre'], correct:'mindre', note:'Regn er utælleligt: mindre regn.' },
    { id:'b6-faerre-ulykker', level:'B1', pattern:'faerre-mindre', context:'Der sker ___ ulykker på den nye vej.', options:['færre','mindre'], correct:'færre', note:'Ulykker er tælleligt: færre ulykker.' },
    { id:'b6-mindre-plads', level:'B1', pattern:'faerre-mindre', context:'Den nye lejlighed har ___ plads.', options:['mindre','færre'], correct:'mindre', note:'Plads er utælleligt: mindre plads.' },
    { id:'b6-faerre-gaester', level:'B1', pattern:'faerre-mindre', context:'Der kom ___ gæster end forventet.', options:['færre','mindre'], correct:'færre', note:'Gæster er tælleligt: færre gæster.' },
    { id:'b6-mindre-stress', level:'B1', pattern:'faerre-mindre', context:'Hun har ___ stress i det nye job.', options:['mindre','færre'], correct:'mindre', note:'Stress er utælleligt: mindre stress.' },
    // --- al / alt / alle (extra) ---
    { id:'b6-alle-gaester', level:'A2', pattern:'al-alt-alle', context:'___ gæsterne var kommet til tiden.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle gæster.' },
    { id:'b6-al-tiden', level:'A2', pattern:'al-alt-alle', context:'Han brugte ___ tiden på at læse.', options:['al','alt','alle'], correct:'al', note:'Al bruges om utælleligt fælleskøn: al tiden.' },
    { id:'b6-alt-melet', level:'A2', pattern:'al-alt-alle', context:'___ melet blev brugt til brødet.', options:['Alt','Al','Alle'], correct:'Alt', note:'Alt bruges om utælleligt intetkøn: alt melet.' },
    { id:'b6-alle-elever', level:'A2', pattern:'al-alt-alle', context:'___ eleverne bestod prøven.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle elever.' },
    { id:'b6-al-kaffen', level:'A2', pattern:'al-alt-alle', context:'Hun drak ___ kaffen selv.', options:['al','alt','alle'], correct:'al', note:'Al bruges om utælleligt fælleskøn: al kaffen.' },
    { id:'b6-alt-arbejdet', level:'A2', pattern:'al-alt-alle', context:'Han lavede ___ arbejdet selv.', options:['alt','al','alle'], correct:'alt', note:'Alt bruges om utælleligt intetkøn: alt arbejdet.' },
    { id:'b6-alle-boeger', level:'A2', pattern:'al-alt-alle', context:'___ bøgerne stod på hylden.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle bøger.' },
    { id:'b6-al-maelken', level:'A2', pattern:'al-alt-alle', context:'Katten drak ___ mælken.', options:['al','alt','alle'], correct:'al', note:'Al bruges om utælleligt fælleskøn: al mælken.' },
    { id:'b6-alt-broedet', level:'A2', pattern:'al-alt-alle', context:'Vi spiste ___ brødet.', options:['alt','al','alle'], correct:'alt', note:'Alt bruges om utælleligt intetkøn: alt brødet.' },
    { id:'b6-alle-biler', level:'B1', pattern:'al-alt-alle', context:'___ bilerne var parkeret udenfor.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle biler.' },
    { id:'b6-alt-sukkeret', level:'A2', pattern:'al-alt-alle', context:'Han brugte ___ sukkeret.', options:['alt','al','alle'], correct:'alt', note:'Sukker er intetkøn og utælleligt: alt sukkeret.' },
    { id:'b6-al-vinen', level:'B1', pattern:'al-alt-alle', context:'Gæsterne drak ___ vinen.', options:['al','alt','alle'], correct:'al', note:'Vin er fælleskøn og utælleligt: al vinen.' },
    { id:'b6-alt-saltet', level:'A2', pattern:'al-alt-alle', context:'Hun kom ___ saltet i gryden.', options:['alt','al','alle'], correct:'alt', note:'Salt er intetkøn og utælleligt: alt saltet.' },
    { id:'b6-alle-venner', level:'A2', pattern:'al-alt-alle', context:'___ mine venner kom til festen.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle mine venner.' },
    { id:'b6-al-energien', level:'B1', pattern:'al-alt-alle', context:'Han brugte ___ sin energi på projektet.', options:['al','alt','alle'], correct:'al', note:'Energi er fælleskøn og utælleligt: al sin energi.' },
    { id:'b6-alt-koedet', level:'B1', pattern:'al-alt-alle', context:'Hunden spiste ___ kødet.', options:['alt','al','alle'], correct:'alt', note:'Kød er intetkøn og utælleligt: alt kødet.' },
    { id:'b6-alle-huse', level:'B1', pattern:'al-alt-alle', context:'___ husene i gaden er gamle.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle huse.' },
    { id:'b6-al-pladsen', level:'B1', pattern:'al-alt-alle', context:'Møblerne tog ___ pladsen op.', options:['al','alt','alle'], correct:'al', note:'Plads er fælleskøn og utælleligt: al pladsen.' },
    { id:'b6-alt-godt', level:'A2', pattern:'al-alt-alle', context:'Bare rolig, ___ er godt.', options:['alt','al','alle'], correct:'alt', note:'Alt står alene om noget abstrakt: alt er godt.' },
    { id:'b6-alle-laerere', level:'A2', pattern:'al-alt-alle', context:'___ lærerne var til møde.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle lærere.' },
    { id:'b6-al-musikken', level:'B1', pattern:'al-alt-alle', context:'___ musikken kom fra én højttaler.', options:['Al','Alt','Alle'], correct:'Al', note:'Musik er fælleskøn og utælleligt: al musikken.' },
    { id:'b6-alt-vaek', level:'B1', pattern:'al-alt-alle', context:'Da vi kom hjem, var ___ væk.', options:['alt','al','alle'], correct:'alt', note:'Alt står alene om en samlet mængde: alt var væk.' },
    // --- hver / hvert (extra) ---
    { id:'b6-hver-morgen', level:'A2', pattern:'hver-hvert', context:'Hun løber en tur ___ morgen.', options:['hver','hvert'], correct:'hver', note:'Morgen er en-ord: hver morgen.' },
    { id:'b6-hvert-vaerelse', level:'A2', pattern:'hver-hvert', context:'___ værelse har sit eget bad.', options:['Hvert','Hver'], correct:'Hvert', note:'Værelse er et-ord: hvert værelse.' },
    { id:'b6-hver-gang', level:'A2', pattern:'hver-hvert', context:'___ gang jeg ser filmen, græder jeg.', options:['Hver','Hvert'], correct:'Hver', note:'Gang er en-ord: hver gang.' },
    { id:'b6-hvert-hus', level:'A2', pattern:'hver-hvert', context:'___ hus i gaden har en have.', options:['Hvert','Hver'], correct:'Hvert', note:'Hus er et-ord: hvert hus.' },
    { id:'b6-hver-time', level:'A2', pattern:'hver-hvert', context:'Vi holder pause ___ time.', options:['hver','hvert'], correct:'hver', note:'Time er en-ord: hver time.' },
    { id:'b6-hvert-land', level:'A2', pattern:'hver-hvert', context:'___ land har sit eget flag.', options:['Hvert','Hver'], correct:'Hvert', note:'Land er et-ord: hvert land.' },
    { id:'b6-hver-maaned', level:'A2', pattern:'hver-hvert', context:'Jeg betaler husleje ___ måned.', options:['hver','hvert'], correct:'hver', note:'Måned er en-ord: hver måned.' },
    { id:'b6-hvert-brev', level:'A2', pattern:'hver-hvert', context:'___ brev blev læst højt.', options:['Hvert','Hver'], correct:'Hvert', note:'Brev er et-ord: hvert brev.' },
    { id:'b6-hver-elev', level:'A2', pattern:'hver-hvert', context:'___ elev fik en bog.', options:['Hver','Hvert'], correct:'Hver', note:'Elev er en-ord: hver elev.' },
    { id:'b6-hvert-spoergsmaal', level:'B1', pattern:'hver-hvert', context:'___ spørgsmål gav ét point.', options:['Hvert','Hver'], correct:'Hvert', note:'Spørgsmål er et-ord: hvert spørgsmål.' },
    { id:'b6-hver-gaest', level:'A2', pattern:'hver-hvert', context:'___ gæst fik et glas vin.', options:['Hver','Hvert'], correct:'Hver', note:'Gæst er en-ord: hver gæst.' },
    { id:'b6-hvert-bord', level:'A2', pattern:'hver-hvert', context:'Der stod blomster på ___ bord.', options:['hvert','hver'], correct:'hvert', note:'Bord er et-ord: hvert bord.' },
    { id:'b6-hver-aften', level:'A2', pattern:'hver-hvert', context:'Vi ser nyhederne ___ aften.', options:['hver','hvert'], correct:'hver', note:'Aften er en-ord: hver aften.' },
    { id:'b6-hvert-aeg', level:'A2', pattern:'hver-hvert', context:'___ æg blev kogt i ti minutter.', options:['Hvert','Hver'], correct:'Hvert', note:'Æg er et-ord: hvert æg.' },
    { id:'b6-hver-sommer', level:'A2', pattern:'hver-hvert', context:'De tager til Italien ___ sommer.', options:['hver','hvert'], correct:'hver', note:'Sommer er en-ord: hver sommer.' },
    { id:'b6-hvert-medlem', level:'B1', pattern:'hver-hvert', context:'___ medlem betaler kontingent.', options:['Hvert','Hver'], correct:'Hvert', note:'Medlem er et-ord: hvert medlem.' },
    { id:'b6-hver-bil', level:'B1', pattern:'hver-hvert', context:'___ bil skal synes hvert år.', options:['Hver','Hvert'], correct:'Hver', note:'Bil er en-ord: hver bil.' },
    { id:'b6-hvert-punkt', level:'B1', pattern:'hver-hvert', context:'___ punkt på listen er vigtigt.', options:['Hvert','Hver'], correct:'Hvert', note:'Punkt er et-ord: hvert punkt.' },
    { id:'b6-hver-kvinde', level:'B1', pattern:'hver-hvert', context:'___ kvinde i rummet nikkede.', options:['Hver','Hvert'], correct:'Hver', note:'Kvinde er en-ord: hver kvinde.' },
    { id:'b6-hvert-svar', level:'B1', pattern:'hver-hvert', context:'___ svar tæller.', options:['Hvert','Hver'], correct:'Hvert', note:'Svar er et-ord: hvert svar.' },
    // --- begge (extra) ---
    { id:'b6-begge-boern', level:'A2', pattern:'begge', context:'___ børn går i skole.', options:['Begge','Hver','Alle'], correct:'Begge', note:'Begge bruges om præcis to: begge børn.' },
    { id:'b6-begge-biler', level:'A2', pattern:'begge', context:'___ biler er røde.', options:['Begge','Alle','Hver'], correct:'Begge', note:'Begge bruges om præcis to: begge biler.' },
    { id:'b6-begge-oejne', level:'A2', pattern:'begge', context:'Han lukkede ___ øjne.', options:['begge','alle','hver'], correct:'begge', note:'Man har to øjne, så begge bruges: begge øjne.' },
    { id:'b6-begge-lande', level:'B1', pattern:'begge', context:'___ lande underskrev aftalen.', options:['Begge','Alle','Hver'], correct:'Begge', note:'Begge bruges om præcis to: begge lande.' },
    { id:'b6-begge-broedre', level:'A2', pattern:'begge', context:'___ mine brødre bor i Aarhus.', options:['Begge','Alle','Hver'], correct:'Begge', note:'Begge bruges om præcis to: begge mine brødre.' },
    { id:'b6-begge-foedder', level:'A2', pattern:'begge', context:'Hun stod på ___ fødder.', options:['begge','alle','hver'], correct:'begge', note:'Man har to fødder, så begge bruges: begge fødder.' },
    { id:'b6-begge-muligheder', level:'B1', pattern:'begge', context:'Vi overvejede ___ muligheder.', options:['begge','alle','hver'], correct:'begge', note:'Der var to muligheder: begge muligheder.' },
    { id:'b6-begge-boeger', level:'A2', pattern:'begge', context:'Jeg har læst ___ bøger.', options:['begge','alle','hver'], correct:'begge', note:'Der er tale om to bøger: begge bøger.' },
    { id:'b6-begge-veje', level:'B1', pattern:'begge', context:'Man kan køre ___ veje.', options:['begge','alle','hver'], correct:'begge', note:'Der er to veje: begge veje.' },
    { id:'b6-begge-piger', level:'A2', pattern:'begge', context:'___ piger vandt en medalje.', options:['Begge','Alle','Hver'], correct:'Begge', note:'Der er tale om to piger: begge piger.' },
    { id:'b6-begge-svar', level:'B1', pattern:'begge', context:'___ svar er rigtige.', options:['Begge','Alle','Hvert'], correct:'Begge', note:'Der er to svar: begge svar.' },
    { id:'b6-begge-sider', level:'B1', pattern:'begge', context:'Skriv på ___ sider af papiret.', options:['begge','alle','hver'], correct:'begge', note:'Papiret har to sider: begge sider.' },
    // --- ingen / intet (extra) ---
    { id:'b6-ingen-tid', level:'A2', pattern:'ingen-intet', context:'Jeg har ___ tid i dag.', options:['ingen','intet'], correct:'ingen', note:'Tid er fælleskøn: ingen tid.' },
    { id:'b6-intet-hus', level:'B1', pattern:'ingen-intet', context:'Der var ___ hus at se i miles omkreds.', options:['intet','ingen'], correct:'intet', note:'Hus er et-ord: intet hus.' },
    { id:'b6-ingen-penge', level:'A2', pattern:'ingen-intet', context:'Han har ___ penge tilbage.', options:['ingen','intet'], correct:'ingen', note:'Penge er flertal: ingen penge.' },
    { id:'b6-intet-brev', level:'B1', pattern:'ingen-intet', context:'Der lå ___ brev i postkassen.', options:['intet','ingen'], correct:'intet', note:'Brev er et-ord: intet brev.' },
    { id:'b6-ingen-kaffe', level:'A2', pattern:'ingen-intet', context:'Der er ___ kaffe tilbage.', options:['ingen','intet'], correct:'ingen', note:'Kaffe er fælleskøn: ingen kaffe.' },
    { id:'b6-intet-ord', level:'B1', pattern:'ingen-intet', context:'Hun sagde ___ ord hele aftenen.', options:['intet','ingen'], correct:'intet', note:'Ord er et-ord: intet ord.' },
    { id:'b6-ingen-biler', level:'A2', pattern:'ingen-intet', context:'Der holdt ___ biler på vejen.', options:['ingen','intet'], correct:'ingen', note:'Biler er flertal: ingen biler.' },
    { id:'b6-intet-haab', level:'B1', pattern:'ingen-intet', context:'Der var ___ håb tilbage.', options:['intet','ingen'], correct:'intet', note:'Håb er et-ord: intet håb.' },
    { id:'b6-ingen-gaester', level:'A2', pattern:'ingen-intet', context:'Der kom ___ gæster til festen.', options:['ingen','intet'], correct:'ingen', note:'Gæster er flertal: ingen gæster.' },
    { id:'b6-intet-valg', level:'B1', pattern:'ingen-intet', context:'Vi havde ___ valg.', options:['intet','ingen'], correct:'intet', note:'Valg er et-ord: intet valg.' },
    { id:'b6-ingen-hjaelp', level:'A2', pattern:'ingen-intet', context:'Han fik ___ hjælp fra naboerne.', options:['ingen','intet'], correct:'ingen', note:'Hjælp er fælleskøn: ingen hjælp.' },
    { id:'b6-intet-barn', level:'B1', pattern:'ingen-intet', context:'Der var ___ barn på legepladsen.', options:['intet','ingen'], correct:'intet', note:'Barn er et-ord: intet barn.' },
    { id:'b6-ingen-plads', level:'A2', pattern:'ingen-intet', context:'Der er ___ plads i bilen.', options:['ingen','intet'], correct:'ingen', note:'Plads er fælleskøn: ingen plads.' },
    { id:'b6-intet-lys', level:'B1', pattern:'ingen-intet', context:'Der var ___ lys i huset.', options:['intet','ingen'], correct:'intet', note:'Lys er et-ord: intet lys.' },
    { id:'b6-ingen-venner', level:'A2', pattern:'ingen-intet', context:'Han havde ___ venner på den nye skole.', options:['ingen','intet'], correct:'ingen', note:'Venner er flertal: ingen venner.' },
    { id:'b6-intet-arbejde', level:'B1', pattern:'ingen-intet', context:'Der var ___ arbejde at få.', options:['intet','ingen'], correct:'intet', note:'Arbejde er et-ord: intet arbejde.' },
    { id:'b6-ingen-forskel', level:'B1', pattern:'ingen-intet', context:'Det gør ___ forskel.', options:['ingen','intet'], correct:'ingen', note:'Forskel er fælleskøn: ingen forskel.' },
    { id:'b6-intet-navn', level:'B1', pattern:'ingen-intet', context:'Der stod ___ navn på døren.', options:['intet','ingen'], correct:'intet', note:'Navn er et-ord: intet navn.' },
    { id:'b6-ingen-svarede', level:'A2', pattern:'ingen-intet', context:'Jeg ringede, men ___ svarede.', options:['ingen','intet'], correct:'ingen', note:'Ingen bruges om personer: ingen svarede.' },
    { id:'b6-intet-tegn', level:'B1', pattern:'ingen-intet', context:'Der var ___ tegn på liv.', options:['intet','ingen'], correct:'intet', note:'Tegn er et-ord: intet tegn.' },
    // --- nogen / nogle / noget (extra) ---
    { id:'b6-noget-mad', level:'A2', pattern:'nogen-nogle-noget', context:'Vil du have ___ mad?', options:['noget','nogle','nogen'], correct:'noget', note:'Mad er utælleligt: noget mad.' },
    { id:'b6-nogle-boeger', level:'A2', pattern:'nogen-nogle-noget', context:'Han købte ___ bøger i går.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle bøger.' },
    { id:'b6-nogen-spurgt', level:'A2', pattern:'nogen-nogle-noget', context:'Har ___ spurgt efter mig?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges i spørgsmål om en person: har nogen spurgt?' },
    { id:'b6-noget-te', level:'A2', pattern:'nogen-nogle-noget', context:'Skal jeg lave ___ te?', options:['noget','nogle','nogen'], correct:'noget', note:'Te er utælleligt: noget te.' },
    { id:'b6-nogle-elever', level:'A2', pattern:'nogen-nogle-noget', context:'___ elever var syge i dag.', options:['Nogle','Nogen','Noget'], correct:'Nogle', note:'Nogle bruges om et tælleligt flertal: nogle elever.' },
    { id:'b6-nogen-peter', level:'A2', pattern:'nogen-nogle-noget', context:'Har du set ___ til Peter?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges her i betydningen noget som helst: set nogen til.' },
    { id:'b6-noget-sukker', level:'A2', pattern:'nogen-nogle-noget', context:'Kom ___ sukker i, tak.', options:['noget','nogle','nogen'], correct:'noget', note:'Sukker er utælleligt: noget sukker.' },
    { id:'b6-nogle-dage', level:'A2', pattern:'nogen-nogle-noget', context:'Vi bliver ___ dage i Berlin.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle dage.' },
    { id:'b6-nogen-ringet', level:'A2', pattern:'nogen-nogle-noget', context:'Har der været ___ og ringet?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges i spørgsmål om en person: været nogen.' },
    { id:'b6-noget-broed', level:'A2', pattern:'nogen-nogle-noget', context:'Er der ___ brød tilbage?', options:['noget','nogle','nogen'], correct:'noget', note:'Brød er utælleligt her: noget brød.' },
    { id:'b6-nogle-blomster', level:'A2', pattern:'nogen-nogle-noget', context:'Hun plukkede ___ blomster.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle blomster.' },
    { id:'b6-noget-arbejde', level:'B1', pattern:'nogen-nogle-noget', context:'Har du ___ arbejde til mig?', options:['noget','nogle','nogen'], correct:'noget', note:'Arbejde er utælleligt: noget arbejde.' },
    { id:'b6-nogle-timer', level:'A2', pattern:'nogen-nogle-noget', context:'Vi ventede ___ timer.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle timer.' },
    { id:'b6-nogen-hjaelpe', level:'A2', pattern:'nogen-nogle-noget', context:'Er der ___, der kan hjælpe?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges om en ubestemt person: nogen der kan hjælpe.' },
    { id:'b6-noget-salt', level:'A2', pattern:'nogen-nogle-noget', context:'Mangler der ___ salt?', options:['noget','nogle','nogen'], correct:'noget', note:'Salt er utælleligt: noget salt.' },
    { id:'b6-nogle-huse', level:'B1', pattern:'nogen-nogle-noget', context:'___ huse i gaden er til salg.', options:['Nogle','Nogen','Noget'], correct:'Nogle', note:'Nogle bruges om et tælleligt flertal: nogle huse.' },
    { id:'b6-nogen-penge', level:'A2', pattern:'nogen-nogle-noget', context:'Har du ___ penge på dig?', options:['nogen','nogle','noget'], correct:'nogen', note:'I spørgsmål bruges nogen om penge: har du nogen penge?' },
    { id:'b6-noget-maelk', level:'A2', pattern:'nogen-nogle-noget', context:'Der er vist ___ mælk i køleskabet.', options:['noget','nogle','nogen'], correct:'noget', note:'Mælk er utælleligt: noget mælk.' },
    { id:'b6-nogle-spoergsmaal', level:'B1', pattern:'nogen-nogle-noget', context:'Jeg har ___ spørgsmål.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle spørgsmål.' },
    { id:'b6-noget-galt', level:'B1', pattern:'nogen-nogle-noget', context:'Er der ___ galt?', options:['noget','nogen','nogle'], correct:'noget', note:'Noget bruges om noget abstrakt/utælleligt: noget galt.' },
    { id:'b6-nogle-lande', level:'B1', pattern:'nogen-nogle-noget', context:'___ lande har ikke underskrevet.', options:['Nogle','Nogen','Noget'], correct:'Nogle', note:'Nogle bruges om et tælleligt flertal: nogle lande.' },
    // --- hverken ... eller ---
    { id:'b6-hverken-kaffe-te', level:'A2', pattern:'hverken', context:'Jeg drikker ___ kaffe eller te.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken bruges sammen med eller ved negation: hverken kaffe eller te.' },
    { id:'b6-hverken-han-hun', level:'B1', pattern:'hverken', context:'___ han eller hun kom til mødet.', options:['Hverken','Enten','Både'], correct:'Hverken', note:'Hverken ... eller udtrykker negation af begge: hverken han eller hun.' },
    { id:'b6-hverken-tid-lyst', level:'B1', pattern:'hverken', context:'Jeg har ___ tid eller lyst.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken tid eller lyst.' },
    { id:'b6-hverken-penge-tid', level:'B1', pattern:'hverken', context:'Vi har ___ penge eller tid.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken penge eller tid.' },
    { id:'b6-hverken-set-hoert', level:'B1', pattern:'hverken', context:'Jeg har ___ set eller hørt fra ham.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken set eller hørt.' },
    { id:'b6-hverken-stor-lille', level:'B1', pattern:'hverken', context:'Huset er ___ stort eller lille.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken stort eller lille.' },
    { id:'b6-hverken-mor-far', level:'B1', pattern:'hverken', context:'___ min mor eller far ved det.', options:['Hverken','Enten','Både'], correct:'Hverken', note:'Hverken ... eller: hverken mor eller far.' },
    { id:'b6-hverken-regn-sne', level:'B1', pattern:'hverken', context:'Der faldt ___ regn eller sne.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken regn eller sne.' },
    { id:'b6-hverken-ja-nej', level:'B1', pattern:'hverken', context:'Han sagde ___ ja eller nej.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken ja eller nej.' },
    { id:'b6-hverken-laese-skrive', level:'B1', pattern:'hverken', context:'Barnet kan ___ læse eller skrive endnu.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken læse eller skrive.' }
  ];

  window.BOEJNINGS_DATA = {
    fire_former: buildFireFormer(),
    byg_navneordet: buildByg(),
    adjektivvaerkstedet: buildAdjektiv(),
    sammenligningspressen: buildSammenligning(),
    bestemt_ubestemt: BESTEMT_UBESTEMT,
    maengdevaerkstedet: MAENGDE
  };
})();
