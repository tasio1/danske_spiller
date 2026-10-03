// Tillægsord: stor / stort / store efter en-ord, et-ord og flertal.
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
// Alle former er sikre: en stor bil, et stort hus, store biler, en stor dreng, et stort æble. verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "tillaegsord-form",
  title: "stor, stort, store",
  level: "A1",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Det", "er", "en", "{3}", "bil"], slots: { 3: { answer: "stor" } } },
    { type: "highlight", t: 1200, word: 2, color: "Y" },
    { type: "try", t: 2000, slot: 3, word: "stort", ok: false },
    { type: "try", t: 2000, slot: 3, word: "stor", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["en bil → stor", "et hus → stort", "flertal → store"] },
    { type: "cycle", t: 2800, sentence: { words: ["Det", "er", "et", "{3}", "hus"], slots: { 3: { answer: "stort" } } } },
    { type: "try", t: 1800, slot: 3, word: "stort", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Det", "er", "to", "{3}", "biler"], slots: { 3: { answer: "store" } } } },
    { type: "try", t: 1800, slot: 3, word: "store", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "ser", "en", "{3}", "dreng"], slots: { 3: { answer: "stor" } } } },
    { type: "try", t: 1800, slot: 3, word: "stor", ok: true }
  ]
};
