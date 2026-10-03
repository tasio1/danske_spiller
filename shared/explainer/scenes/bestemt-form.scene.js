// Bestemt form: endelsen -en / -et sættes på navneordet (en bil -> bilen, et hus -> huset).
// Total varighed: 28,5 s (se validatoren). Maal: 20-40 s.
// Alle navneord er sikre: en bil, et hus, en dreng, et barn. verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "bestemt-form",
  title: "bilen, huset",
  level: "A1",
  verify: false,
  steps: [
    { type: "sentence", t: 2600, words: ["Jeg", "ser", "en", "bil"] },
    { type: "highlight", t: 1500, words: [2, 3], color: "Y" },
    { type: "cycle", t: 2400, sentence: { words: ["Jeg", "ser", "{2}"], slots: { 2: { answer: "bilen" } } } },
    { type: "try", t: 1800, slot: 2, word: "bilet", ok: false },
    { type: "try", t: 1800, slot: 2, word: "bilen", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["en bil → bilen", "et hus → huset", "Endelse = en eller et"] },
    { type: "cycle", t: 2400, sentence: { words: ["Jeg", "ser", "{2}"], slots: { 2: { answer: "huset" } } } },
    { type: "try", t: 1800, slot: 2, word: "huset", ok: true },
    { type: "cycle", t: 2400, sentence: { words: ["Jeg", "ser", "{2}"], slots: { 2: { answer: "drengen" } } } },
    { type: "try", t: 1800, slot: 2, word: "drengen", ok: true },
    { type: "cycle", t: 2400, sentence: { words: ["Jeg", "ser", "{2}"], slots: { 2: { answer: "barnet" } } } },
    { type: "try", t: 1800, slot: 2, word: "barnet", ok: true }
  ]
};
