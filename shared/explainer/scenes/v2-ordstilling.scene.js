// V2-ordstilling: verbet er altid nr. 2 i en hovedsaetning.
// Total duration: 2000+1500+1500+1200+1500+1500+1500 (10.7) + rule 3500 (14.2)
//   + cycle 2000+1200+1500+1200+1200+1500+1500+600 (10.7) + final rule 3000 = 27.9 s (target 20-40 s).
// Tiles are lowercase throughout on purpose (the player cannot re-capitalise a moved tile).
// "en kage" and "i dag"/"i morgen" are single tiles = one sentence element each.
window.EXPLAINER_SCENE = {
  id: "v2-ordstilling",
  title: "Verbum nr. 2",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", words: ["jeg", "spiser", "en kage", "i dag"], t: 2000 },
    { type: "highlight", word: 1, color: "Y", t: 1500 },
    // fronting only the adverbial -> wrong order: verb ends up as element 3
    { type: "move", word: 3, to: 0, t: 1500 },
    { type: "highlight", word: 2, color: "R", t: 1200 },
    { type: "arrow", from: 2, to: 0, label: "✗ verbum nr. 3", t: 1500 },
    { type: "swap", words: [1, 2], t: 1500 },
    { type: "highlight", word: 1, color: "G", t: 1500 },
    { type: "rule", lines: ["Hovedsætning:", "verbum er nr. 2", "I dag spiser jeg en kage"], t: 3500 },
    { type: "cycle", sentence: { words: ["vi", "drikker", "kaffe", "i morgen"] }, t: 2000 },
    { type: "highlight", word: 1, color: "Y", t: 1200 },
    { type: "move", word: 3, to: 0, t: 1500 },
    { type: "highlight", word: 2, color: "R", t: 1200 },
    { type: "arrow", from: 2, to: 0, label: "✗ verbum nr. 3", t: 1200 },
    { type: "swap", words: [1, 2], t: 1500 },
    { type: "highlight", word: 1, color: "G", t: 1500 },
    { type: "pause", t: 600 },
    { type: "rule", lines: ["1. noget som helst", "2. verbum", "3. subjekt: vi"], t: 3000 }
  ]
};
