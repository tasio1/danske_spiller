// Temp harness: validate Bøjningsværkstedet Modes 4–6 against shared datasets.
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var V = require('./shared/validate.js');

var root = __dirname;
var sandbox = { window: {}, console: console };
vm.createContext(sandbox);
['shared/data/nouns.js', 'shared/data/adjectives.js', 'boejningsvaerkstedet/data.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
});

var D = sandbox.window.BOEJNINGS_DATA;
var modes = Object.keys(D);
console.log('Modes present:', modes.join(', '));
modes.forEach(function (k) { console.log('  ' + k + ': ' + D[k].length + ' items'); });

var totalErr = 0;

// Mode 4 — sammenligningspressen: slots-based, each slot has non-empty accepted_answers.
(function () {
  var items = D.sammenligningspressen;
  var r = V.validateDataset(items, { requiredFields: ['id', 'level', 'note', 'adjective_id'] });
  var extra = [];
  var seen = {};
  items.forEach(function (it) {
    if (!Array.isArray(it.slots) || it.slots.length !== 3) extra.push(it.id + ': expected 3 slots');
    (it.slots || []).forEach(function (s, i) {
      if (!Array.isArray(s.accepted_answers) || !s.accepted_answers.length) extra.push(it.id + ' slot ' + i + ': empty accepted_answers');
      if (!s.label) extra.push(it.id + ' slot ' + i + ': missing label');
    });
    if (seen[it.id]) extra.push('dup id ' + it.id); seen[it.id] = 1;
  });
  var errs = r.errors.concat(extra);
  totalErr += errs.length;
  console.log('\n[Mode 4 sammenligningspressen] ' + errs.length + ' errors, ' + r.warnings.length + ' warnings');
  errs.slice(0, 20).forEach(function (e) { console.log('  ERROR: ' + e); });
})();

// Modes 5 & 6 — MC items: options + correct.
[['bestemt_ubestemt', 'Mode 5'], ['maengdevaerkstedet', 'Mode 6']].forEach(function (pair) {
  var key = pair[0], label = pair[1];
  var items = D[key];
  var r = V.validateDataset(items, {
    requiredFields: ['id', 'level', 'note', 'context', 'options', 'correct', 'pattern'],
    optionsField: 'options', correctField: 'correct'
  });
  totalErr += r.errors.length;
  console.log('\n[' + label + ' ' + key + '] ' + r.errors.length + ' errors, ' + r.warnings.length + ' warnings');
  r.errors.slice(0, 20).forEach(function (e) { console.log('  ERROR: ' + e); });
  r.warnings.slice(0, 20).forEach(function (w) { console.log('  WARN: ' + w); });
});

console.log('\nTOTAL Modes 4-6 errors: ' + totalErr);
process.exitCode = totalErr ? 1 : 0;
