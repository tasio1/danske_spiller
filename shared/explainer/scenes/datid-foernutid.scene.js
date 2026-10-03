// datid eller foernutid: afsluttet tid -> datid; siden (naar det gaelder nu) -> har + tillaegsform.
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Saetninger er hentet fra spillets egne data (preterite_vs_perfect): har boet, boede, flyttede (siden-mønsteret er udvidet med: har arbejdet). verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "datid-foernutid",
  title: "datid eller førnutid",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Hun", "{1}", "i", "Aarhus", "siden", "2023"], slots: { 1: { answer: "har boet" } } },
    { type: "highlight", t: 1200, words: [4, 5], color: "Y" },
    { type: "try", t: 2000, slot: 1, word: "boede", ok: false },
    { type: "try", t: 2000, slot: 1, word: "har boet", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["siden → har boet", "afsluttet → boede"] },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "{1}", "i", "Odense", "fra", "2019", "til", "2021"], slots: { 1: { answer: "boede" } } } },
    { type: "try", t: 1800, slot: 1, word: "boede", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hun", "{1}", "til", "København", "for", "to", "år", "siden"], slots: { 1: { answer: "flyttede" } } } },
    { type: "try", t: 1800, slot: 1, word: "flyttede", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Han", "{1}", "her", "siden", "marts"], slots: { 1: { answer: "har arbejdet" } } } },
    { type: "try", t: 1800, slot: 1, word: "har arbejdet", ok: true }
  ]
};
