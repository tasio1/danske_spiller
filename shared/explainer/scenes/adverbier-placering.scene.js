// Silent explainer: where a sentence adverb (stadig, altid ...) goes.
// Main clause: finite verb first, adverb after it (verb is 2nd = V2).
// Subordinate clause: adverb before the finite verb (same pattern as "ikke").
// Total duration: 29.0 s (sum of all step `t` values below; target 20-40 s).
// Only canonical sentences; verify:false. The moved tile is lowercase on purpose.
window.EXPLAINER_SCENE = {
  id: "adverbier-placering",
  title: "stadig: hvor står det?",
  level: "B1",
  verify: false,
  steps: [
    // Part 1: main clause (wrong, then right)
    { type: "sentence", words: ["Han", "{1}", "bor", "i", "Aarhus"], slots: { 1: { none: true } }, t: 2000 },    //  2.0
    { type: "highlight", word: 2, color: "Y", t: 1200 },                                                          //  3.2  finite verb
    { type: "try", slot: 1, word: "stadig", ok: false, t: 2000 },                                                 //  5.2  fails
    { type: "pause", t: 400 },                                                                                    //  5.6
    { type: "cycle", sentence: { words: ["Han", "bor", "{2}", "i", "Aarhus"], slots: { 2: { answer: "stadig" } } }, t: 1600 }, // 7.2
    { type: "arrow", from: 1, to: 2, label: "efter verbet", t: 2000 },                                            //  9.2
    { type: "try", slot: 2, word: "stadig", ok: true, t: 1800 },                                                  // 11.0
    { type: "rule", lines: ["Hovedsætning:", "verbum + stadig", "Han bor stadig i Aarhus"], t: 3500 },           // 14.5

    // Part 2: subordinate clause (move the adverb before the verb)
    { type: "cycle", sentence: { words: ["fordi", "han", "bor", "stadig", "her"] }, t: 2000 },                    // 16.5
    { type: "highlight", word: 3, color: "R", t: 1500 },                                                          // 18.0  wrong spot
    { type: "move", word: 3, to: 2, t: 1800 },                                                                    // 19.8  adverb before verb
    { type: "highlight", words: [2, 3], color: "G", t: 1500 },                                                    // 21.3
    { type: "rule", lines: ["Bisætning:", "stadig + verbum", "fordi han stadig bor her"], t: 3700 },              // 25.0

    // Part 3: contrast, loops at the end
    { type: "cycle", sentence: { words: ["Han", "bor", "stadig", "her"] }, t: 2000 },                             // 27.0
    { type: "cycle", sentence: { words: ["fordi", "han", "stadig", "bor", "her"] }, t: 2000 }                     // 29.0
  ]
};
