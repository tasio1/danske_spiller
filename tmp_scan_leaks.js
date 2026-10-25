const fs = require("fs");
global.window = global;
eval(fs.readFileSync("tidsmaskinen/data.js", "utf8"));
const data = window.TIDS_DATA || global.TIDS_DATA;
let allItems = [];
for (const mode in data) {
  if (Array.isArray(data[mode])) allItems.push(...data[mode]);
}
function norm(s){ return (s||"").toLowerCase().normalize("NFC"); }
function esc(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
let leaks = [];
for (const it of allItems) {
  const ctx = norm(it.context || "");
  const answers = [];
  if (it.correct) answers.push(it.correct);
  if (it.accepted_answers) answers.push(...it.accepted_answers);
  if (it.slots) it.slots.forEach(s => s.accepted_answers && answers.push(...s.accepted_answers));
  for (const a of answers) {
    const an = norm(a);
    const wordCount = an.trim().split(/\s+/).length;
    if (wordCount < 2) continue;
    const re = new RegExp("\\b" + esc(an) + "\\b");
    if (re.test(ctx)) {
      leaks.push({id: it.id, mode: it.mode, context: it.context, sentence: it.sentence, answer: a});
      break;
    }
  }
}
console.log("MULTI-WORD LEAK COUNT:", leaks.length);
leaks.forEach(l => console.log("---\nid:", l.id, "| mode:", l.mode, "\nanswer:", l.answer, "\ncontext:", l.context, "\nsentence:", l.sentence));
