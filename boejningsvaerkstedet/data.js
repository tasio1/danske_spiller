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

  window.BOEJNINGS_DATA = {
    fire_former: buildFireFormer(),
    byg_navneordet: buildByg(),
    adjektivvaerkstedet: buildAdjektiv(),
    sammenligningspressen: [],
    bestemt_ubestemt: [],
    maengdevaerkstedet: []
  };
})();
