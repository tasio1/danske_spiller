// Læseforståelse registry. Builds window.LAESE_DATA from the corpus globals that exist.
// Load order: data-mc.js (and later data-skim/insert/cloze.js), then this file.
(function () {
  'use strict';
  var skim = window.LAESE_SKIM || [];
  var mc = window.LAESE_MC || [];
  var insert = window.LAESE_INSERT || [];
  var cloze = window.LAESE_CLOZE || [];

  // `available` flips to true when a mode's renderer and corpus exist.
  var modes = [
    { key: 'skim', label: 'Find oplysningen', part: 'Læseforståelse 1', itemCount: 15, minutes: 25, available: false },
    { key: 'mc', label: 'Læs og vælg', part: 'Delprøve 2A', itemCount: 3, minutes: 15, available: true },
    { key: 'insert', label: 'Sæt afsnittet ind', part: 'Delprøve 2B', itemCount: 5, minutes: 20, available: false },
    { key: 'cloze', label: 'Det manglende ord', part: 'Delprøve 3', itemCount: 8, minutes: 15, available: false }
  ];

  var byMode = { skim: skim, mc: mc, insert: insert, cloze: cloze };

  function textsFor(mode, levels) {
    var list = byMode[mode] || [];
    if (!levels || !levels.length) return list.slice();
    return list.filter(function (t) { return levels.indexOf(t.level) !== -1; });
  }

  function byId(id) {
    for (var i = 0; i < modes.length; i++) {
      var list = byMode[modes[i].key];
      for (var j = 0; j < list.length; j++) if (list[j].id === id) return list[j];
    }
    return null;
  }

  // The answerable items of a text: questions (skim, mc) or gaps (insert, cloze).
  function itemsOf(text) {
    if (!text) return [];
    return text.questions || text.gaps || [];
  }

  window.LAESE_DATA = {
    skim: skim, mc: mc, insert: insert, cloze: cloze,
    modes: modes, textsFor: textsFor, byId: byId, itemsOf: itemsOf
  };
})();
