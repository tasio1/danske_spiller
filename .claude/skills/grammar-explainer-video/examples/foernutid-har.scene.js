// foernutid: har + tillaegsform (jeg har spist). Kun 'har'-verber; 'er'-verber (er kommet) er udeladt.
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Alle former er sikre: spist, koebt, lavet, skrevet. verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "foernutid-har",
  title: "har + tillægsform",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "har", "{2}", "pizza"], slots: { 2: { answer: "spist" } } },
    { type: "highlight", t: 1200, word: 1, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "spiste", ok: false },
    { type: "try", t: 2000, slot: 2, word: "spist", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["har + tillægsform", "jeg har spist", "ikke: har spiste"] },
    { type: "cycle", t: 2800, sentence: { words: ["Hun", "har", "{2}", "en", "bog"], slots: { 2: { answer: "købt" } } } },
    { type: "try", t: 1800, slot: 2, word: "købt", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Vi", "har", "{2}", "aftensmad"], slots: { 2: { answer: "lavet" } } } },
    { type: "try", t: 1800, slot: 2, word: "lavet", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["De", "har", "{2}", "et", "brev"], slots: { 2: { answer: "skrevet" } } } },
    { type: "try", t: 1800, slot: 2, word: "skrevet", ok: true }
  ]
};
