// Validates data files: unique ids, non-empty answers.
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'shared');
let errors = 0;
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
  const items = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const ids = new Set();
  for (const it of items) {
    if (ids.has(it.id)) { console.log(`${f}: duplicate id ${it.id}`); errors++; }
    ids.add(it.id);
    if (!it.answer) { console.log(`${f}: empty answer ${it.id}`); errors++; }
  }
  console.log(`${f}: ${items.length} items`);
}
console.log(`TOTAL errors: ${errors}`);
process.exit(errors ? 1 : 0);
