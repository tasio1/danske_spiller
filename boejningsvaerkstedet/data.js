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
    { id:'b6-noget-vand', level:'A2', pattern:'nogen-nogle-noget', context:'Der er ___ vand på gulvet i badeværelset.', options:['noget','nogle','nogen'], correct:'noget', note:'Vand er utælleligt: noget vand.' }
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
