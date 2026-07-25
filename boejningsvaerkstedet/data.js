// boejningsvaerkstedet/data.js
// Bøjningsværkstedet dataset — window.BOEJNINGS_DATA
// Schema and mode targets: see prd.md § Phase 2 and improvement/specs.md § 4.
//
// Mode 1 (fire_former) is generated at load time from window.DANSK_NOUNS so
// the item set always tracks the canonical noun list (currently 188 of the
// 300-noun target — see PROGRESS.md task shared-data-nouns). Regenerating
// here means no manual re-sync is needed when nouns.js grows.
//
// Modes 2-6 are not yet populated (see PROGRESS.md task boejning-data notes).
(function () {
  'use strict';

  var NOUNS = (typeof window !== 'undefined' && window.DANSK_NOUNS) || [];

  // One dataset item per (noun x form). Each item asks for exactly one of
  // the four paradigm cells, matching the Mode 1 schema in prd.md § 2.4.
  var FORMS = [
    { key: 'indefinite_singular', slug: 'ubestemt-ental' },
    { key: 'definite_singular', slug: 'bestemt-ental' },
    { key: 'indefinite_plural', slug: 'ubestemt-flertal' },
    { key: 'definite_plural', slug: 'bestemt-flertal' }
  ];

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function noteFor(noun, formKey) {
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

  function buildFireFormer(nouns) {
    var items = [];
    nouns.forEach(function (noun) {
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
          note: noteFor(noun, form.key)
        });
      });
    });
    return items;
  }

  window.BOEJNINGS_DATA = {
    fire_former: buildFireFormer(NOUNS),
    byg_navneordet: [],
    adjektivvaerkstedet: [],
    sammenligningspressen: [],
    bestemt_ubestemt: [],
    maengdevaerkstedet: []
  };
})();
