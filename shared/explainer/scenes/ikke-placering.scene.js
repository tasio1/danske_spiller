// Silent explainer: where "ikke" goes (main clause vs subordinate clause).
// Total duration: 31.0 s (sum of all step `t` values below; target 20-40 s).
// Only canonical sentences; verify:false. Rule: ikke follows the finite verb in
// main clauses and precedes it in subordinate clauses.
window.EXPLAINER_SCENE = {
  id: "ikke-placering",
  title: "ikke: hvor står det?",
  level: "B1",
  verify: false,
  steps: [
    // Part 1: main clause (wrong, then right)
    { type: "sentence", words: ["Jeg", "{1}", "spiser", "kage"], slots: { 1: { none: true } }, t: 2000 },   //  2.0
    { type: "highlight", word: 2, color: "Y", t: 1200 },                                                          //  3.2  finite verb
    { type: "try", slot: 1, word: "ikke", ok: false, t: 2000 },                                                   //  5.2  fails
    { type: "pause", t: 400 },                                                                                    //  5.6
    { type: "cycle", sentence: { words: ["Jeg", "spiser", "{2}", "kage"], slots: { 2: { answer: "ikke" } } }, t: 1600 }, // 7.2
    { type: "arrow", from: 1, to: 2, label: "efter verbet", t: 2000 },                                            //  9.2
    { type: "try", slot: 2, word: "ikke", ok: true, t: 1800 },                                                    // 11.0
    { type: "rule", lines: ["Hovedsætning:", "verbum + ikke", "Jeg spiser ikke kage"], t: 3500 },                 // 14.5

    // Part 2: subordinate clause (wrong order fixed by moving ikke)
    { type: "cycle", sentence: { words: ["at", "jeg", "spiser", "ikke", "kage"] }, t: 2000 },                     // 16.5
    { type: "highlight", word: 3, color: "R", t: 1500 },                                                          // 18.0  wrong spot
    { type: "move", word: 3, to: 2, t: 1800 },                                                                    // 19.8  ikke before verb
    { type: "arrow", from: 2, to: 3, label: "før verbet", t: 2000 },                                              // 21.8
    { type: "highlight", words: [2, 3], color: "G", t: 1500 },                                                    // 23.3
    { type: "rule", lines: ["Bisætning:", "ikke + verbum", "at jeg ikke spiser kage"], t: 3700 },                 // 27.0

    // Part 3: contrast, loops at the end
    { type: "cycle", sentence: { words: ["Jeg", "spiser", "ikke", "kage"] }, t: 2000 },                           // 29.0
    { type: "cycle", sentence: { words: ["at", "jeg", "ikke", "spiser", "kage"] }, t: 2000 }                      // 31.0
  ]
};
