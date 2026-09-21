// Temporary validation harness for Bøjningsværkstedet Modes 4-6.
// Loads shared data + game data.js in a sandbox, runs shared/validate.js checks,
// plus Mode-specific integrity checks. Not committed.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const V = require(path.join(root, 'shared', 'validate.js'));

const sandbox = { window: {}, console: console };
vm.createContext(sandbox);
['shared/data/nouns.js', 'shared/data/adjectives.js', 'boejningsvaerkstedet/data.js'].forEach(function (rel) {
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  vm.runInContext(code, sandbox, { filename: rel });
});

const DATA = sandbox.window.BOEJNINGS_DATA;
let totalErrors = 0;

function report(name, res) {
  totalErrors += res.errors.length;
  console.log(name + ': ' + DATA[keyFor(name)].length + ' items — ' +
    res.errors.length + ' errors, ' + res.warnings.length + ' warnings');
  res.errors.forEach(function (e) { console.log('  ERROR: ' + e); });
  res.warnings.slice(0, 10).forEach(function (w) { console.log('  WARN: ' + w); });
}
function keyFor(n){ return n; }

// Mode 4 — sammenligningspressen: id, level, note required; slots non-empty with accepted_answers.
(function () {
  const items = DATA.sammenligningspressen;
  const res = V.validateDataset(items, { requiredFields: ['id', 'level', 'note'] });
  items.forEach(function (it) {
    if (!Array.isArray(it.slots) || it.slots.length !== 3) {
      res.errors.push(it.id + ': slots must have exactly 3 entries');
    } else {
      it.slots.forEach(function (s, i) {
        if (!Array.isArray(s.accepted_answers) || !s.accepted_answers.length) {
          res.errors.push(it.id + ': slot ' + i + ' has empty accepted_answers');
        }
        if (!s.label) res.errors.push(it.id + ': slot ' + i + ' missing label');
      });
    }
  });
  report('sammenligningspressen', res);
})();

// Mode 5 — bestemt_ubestemt: MC, correct must be in options.
(function () {
  const items = DATA.bestemt_ubestemt;
  const res = V.validateDataset(items, {
    requiredFields: ['id', 'level', 'note', 'context'],
    optionsField: 'options', correctField: 'correct'
  });
  report('bestemt_ubestemt', res);
})();

// Mode 6 — maengdevaerkstedet: MC, correct must be in options.
(function () {
  const items = DATA.maengdevaerkstedet;
  const res = V.validateDataset(items, {
    requiredFields: ['id', 'level', 'note', 'context'],
    optionsField: 'options', correctField: 'correct'
  });
  report('maengdevaerkstedet', res);
})();

// Cross-mode: global unique ids across ALL six modes (SRS keys are id-scoped per mode,
// but a global uniqueness check catches accidental collisions).
(function () {
  const seen = {};
  let dupes = 0;
  Object.keys(DATA).forEach(function (mode) {
    DATA[mode].forEach(function (it) {
      if (seen[it.id]) { console.log('  GLOBAL DUP ID: ' + it.id); dupes++; }
      seen[it.id] = true;
    });
  });
  console.log('global id uniqueness across all modes: ' + dupes + ' collisions');
  totalErrors += dupes;
})();

// Every MC item's blank marker present (context has ___).
(function () {
  let missing = 0;
  ['bestemt_ubestemt', 'maengdevaerkstedet'].forEach(function (mode) {
    DATA[mode].forEach(function (it) {
      if (!/_{2,}/.test(String(it.context))) { console.log('  NO BLANK in ' + it.id); missing++; }
    });
  });
  console.log('MC blank-marker check: ' + missing + ' missing');
  totalErrors += missing;
})();

console.log('\nTOTAL ERRORS: ' + totalErrors);
process.exitCode = totalErrors ? 1 : 0;
