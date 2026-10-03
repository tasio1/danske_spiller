// Silent explainer: "af" (material, doer) vs "fra" (origin, sender).
// Main rule only; fixed verb phrases (afhænge af, holde af, hjem fra arbejde) are out of scope.
// Total duration: part 1 11.2 s + 3 examples 11.4 s (to 22.6) + final rule 3.0 = ~25.6 s.
window.EXPLAINER_SCENE = {
  id: "af-fra",
  title: "af eller fra?",
  level: "A2",
  verify: false,
  steps: [
    // Part 1: wrong, then right
    { type: "sentence", words: ["Bordet", "er", "lavet", "{3}", "træ"], slots: { 3: { answer: "af" } }, t: 2200 },
    { type: "highlight", word: 4, color: "Y", t: 1200 },
    { type: "try", slot: 3, word: "fra", ok: false, t: 1800 },
    { type: "pause", t: 400 },
    { type: "try", slot: 3, word: "af", ok: true, t: 1800 },
    { type: "rule", lines: ["fra = sted / afsender", "af = lavet / skrevet af", "lavet af træ"], t: 3800 },

    // Part 2: more examples
    { type: "cycle", sentence: { words: ["Jeg", "kommer", "{2}", "Spanien"], slots: { 2: { answer: "fra" } } }, t: 2000 },
    { type: "try", slot: 2, word: "fra", ok: true, t: 1800 },
    { type: "cycle", sentence: { words: ["Brevet", "er", "{2}", "banken"], slots: { 2: { answer: "fra" } } }, t: 2000 },
    { type: "try", slot: 2, word: "fra", ok: true, t: 1800 },
    { type: "cycle", sentence: { words: ["Bogen", "er", "skrevet", "{3}", "læreren"], slots: { 3: { answer: "af" } } }, t: 2000 },
    { type: "try", slot: 3, word: "af", ok: true, t: 1800 },
    { type: "rule", lines: ["fra = sted / afsender", "af = lavet / skrevet af"], t: 3000 }
  ]
};
