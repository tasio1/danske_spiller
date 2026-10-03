// Silent explainer: place prepositions "i" (inside) vs "på" (on a surface).
// Main rule only; fixed expressions (på arbejde, i byen/på gaden ...) are out of scope.
// Total duration: see validator (target 20-40 s).
window.EXPLAINER_SCENE = {
  id: "i-paa",
  title: "i eller på?",
  level: "A2",
  verify: false,
  steps: [
    // Part 1: wrong, then right
    { type: "sentence", words: ["Bogen", "ligger", "{2}", "bordet"], slots: { 2: { answer: "på" } }, t: 2200 },
    { type: "highlight", word: 3, color: "Y", t: 1200 },
    { type: "try", slot: 2, word: "i", ok: false, t: 1800 },
    { type: "pause", t: 400 },
    { type: "try", slot: 2, word: "på", ok: true, t: 1800 },
    { type: "arrow", from: 2, to: 3, label: "oven på", t: 1500 },
    { type: "rule", lines: ["på = oven på", "i = inde i", "Bogen ligger på bordet"], t: 3800 },

    // Part 2: more examples
    { type: "cycle", sentence: { words: ["Mælken", "står", "{2}", "køleskabet"], slots: { 2: { answer: "i" } } }, t: 2000 },
    { type: "try", slot: 2, word: "i", ok: true, t: 1800 },
    { type: "cycle", sentence: { words: ["Billedet", "hænger", "{2}", "væggen"], slots: { 2: { answer: "på" } } }, t: 2000 },
    { type: "try", slot: 2, word: "på", ok: true, t: 1800 },
    { type: "cycle", sentence: { words: ["Kaffen", "er", "{2}", "koppen"], slots: { 2: { answer: "i" } } }, t: 2000 },
    { type: "try", slot: 2, word: "i", ok: true, t: 1800 },
    { type: "rule", lines: ["på = oven på", "i = inde i"], t: 3000 }
  ]
};
