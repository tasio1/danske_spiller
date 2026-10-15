// FIXTURE — stand-in for the game's data.js registry; only used by the validator tests.
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
