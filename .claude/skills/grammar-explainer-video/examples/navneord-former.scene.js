// Navneord: ubestemt/bestemt, ental/flertal (bil, bilen, biler, bilerne / hus, huset, huse).
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
// Sikre former (stemmer med shared/data/nouns.js): en bil, bilen, biler, bilerne; et hus, huset, huse, husene.
window.EXPLAINER_SCENE = {
  id: "navneord-former",
  title: "navneord: former",
  level: "A1",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "har", "en", "{3}"], slots: { 3: { answer: "bil" } } },
    { type: "highlight", t: 1200, word: 2, color: "Y" },
    { type: "try", t: 2000, slot: 3, word: "biler", ok: false },
    { type: "try", t: 2000, slot: 3, word: "bil", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["en bil → bilen", "flertal: biler, bilerne", "et hus → huset, huse"] },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "har", "to", "{3}"], slots: { 3: { answer: "biler" } } } },
    { type: "try", t: 1800, slot: 3, word: "biler", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "har", "et", "{3}"], slots: { 3: { answer: "hus" } } } },
    { type: "try", t: 1800, slot: 3, word: "hus", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "har", "en", "bil", "og", "{5}", "er", "rød"], slots: { 5: { answer: "bilen" } } } },
    { type: "try", t: 1800, slot: 5, word: "bilen", ok: true }
  ]
};
