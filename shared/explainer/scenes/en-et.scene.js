// en vs et: fælleskøn og intetkøn (ubestemt artikel + bestemt endelse).
// Total varighed: 27,6 s (sum af t: 3000+1200+2000+2000+600+5000 + 3x(2800+1800) = 27600 ms). Maal: 20-40 s.
// Alle navneord er sikre: en bil, et hus, et æble, en dreng. verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "en-et",
  title: "en eller et",
  level: "A1",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "har", "{2}", "bil"], slots: { 2: { answer: "en" } } },
    { type: "highlight", t: 1200, word: 3, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "et", ok: false },
    { type: "try", t: 2000, slot: 2, word: "en", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["en bil → bilen", "et hus → huset", "Ordet bestemmer en/et"] },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "har", "{2}", "hus"], slots: { 2: { answer: "et" } } } },
    { type: "try", t: 1800, slot: 2, word: "et", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hun", "spiser", "{2}", "æble"], slots: { 2: { answer: "et" } } } },
    { type: "try", t: 1800, slot: 2, word: "et", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "ser", "{2}", "dreng"], slots: { 2: { answer: "en" } } } },
    { type: "try", t: 1800, slot: 2, word: "en", ok: true }
  ]
};
