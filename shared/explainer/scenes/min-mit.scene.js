// min, mit eller mine: eje-ordet retter sig efter det ejede navneord (en-ord, et-ord, flertal).
// Saetninger er hentet fra spillets egne data (possessive_agreement): mit vaerelse, min mor, mine noegler.
// Total varighed: 27,1 s (sum af t: 3000+1400+2000+2000+500+5000 + 3x(2600+1800) = 27100 ms). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "min-mit",
  title: "min, mit eller mine",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "elsker", "{2}", "værelse"], slots: { 2: { answer: "mit" } } },
    { type: "highlight", t: 1400, word: 3, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "min", ok: false },
    { type: "try", t: 2000, slot: 2, word: "mit", ok: true },
    { type: "pause", t: 500 },
    { type: "rule", t: 5000, lines: ["min + en-ord", "mit + et-ord", "mine + flertal"] },
    { type: "cycle", t: 2600, sentence: { words: ["Jeg", "ringer", "til", "{3}", "mor"], slots: { 3: { answer: "min" } } } },
    { type: "try", t: 1800, slot: 3, word: "min", ok: true },
    { type: "cycle", t: 2600, sentence: { words: ["Jeg", "tager", "{2}", "nøgler"], slots: { 2: { answer: "mine" } } } },
    { type: "try", t: 1800, slot: 2, word: "mine", ok: true },
    { type: "cycle", t: 2600, sentence: { words: ["Jeg", "elsker", "{2}", "arbejde"], slots: { 2: { answer: "mit" } } } },
    { type: "try", t: 1800, slot: 2, word: "mit", ok: true }
  ]
};
