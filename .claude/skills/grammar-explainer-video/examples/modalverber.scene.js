// modalverber: modalverbum + infinitiv uden 'at' (jeg kan svoemme, ikke: jeg kan at svoemme).
// Total varighed: 25,8 s (3000+1200+2000+600+5200 + 3x(2800+1800) = 25800 ms). Maal: 20-40 s.
// Saetninger er sikre (kan/skal/vil + infinitiv; 'tale fem sprog' er fra spillets modal-data). verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "modalverber",
  title: "kan, skal, vil + verbum",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "kan", "{2}", "svømme"], slots: { 2: { none: true } } },
    { type: "highlight", t: 1200, word: 1, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "at", ok: false },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["kan/skal/vil + verbum", "jeg kan svømme", "ikke: kan at svømme"] },
    { type: "cycle", t: 2800, sentence: { words: ["Hun", "skal", "{2}", "i", "morgen"], slots: { 2: { answer: "arbejde" } } } },
    { type: "try", t: 1800, slot: 2, word: "arbejde", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Vi", "vil", "{2}", "til", "Norge"], slots: { 2: { answer: "rejse" } } } },
    { type: "try", t: 1800, slot: 2, word: "rejse", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hun", "kan", "{2}", "fem", "sprog"], slots: { 2: { answer: "tale" } } } },
    { type: "try", t: 1800, slot: 2, word: "tale", ok: true }
  ]
};
