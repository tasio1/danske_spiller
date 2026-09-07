global.window = {};
require('./shared/data/nouns.js');
require('./shared/data/adjectives.js');
require('./boejningsvaerkstedet/data.js');
var V = require('./shared/validate.js');
var D = window.BOEJNINGS_DATA;

function report(name, items, opts) {
  var r = V.validateDataset(items, opts || {});
  console.log(name.padEnd(24), 'n=' + String(items.length).padEnd(5),
    'errors=' + r.errors.length, 'warnings=' + r.warnings.length);
  r.errors.slice(0, 8).forEach(function (e) { console.log('   ERR', e); });
  r.warnings.slice(0, 4).forEach(function (w) { console.log('   WARN', w); });
  return r.errors.length;
}

var total = 0;
total += report('fire_former', D.fire_former, { requiredFields: ['id', 'level', 'note'], acceptedAnswersField: 'accepted_answers' });
total += report('byg_navneordet', D.byg_navneordet, { requiredFields: ['id', 'level', 'note'] });
total += report('adjektivvaerkstedet', D.adjektivvaerkstedet, { requiredFields: ['id', 'level', 'note'], acceptedAnswersField: 'accepted_answers' });

// Mode 2 structural: accepted_orders non-empty; every order token is in pieces.
var bad = 0;
D.byg_navneordet.forEach(function (it) {
  if (!Array.isArray(it.accepted_orders) || !it.accepted_orders.length) { bad++; console.log('   no order', it.id); return; }
  if (it.accepted_orders[0].length !== 3) { bad++; console.log('   bad slot count', it.id); }
  it.accepted_orders[0].forEach(function (tok) {
    if (it.pieces.indexOf(tok) === -1) { bad++; console.log('   missing piece', it.id, tok); }
  });
});
console.log('Mode 2 order/piece problems:', bad);

// Cross-mode: unique ids across every mode combined (SRS keys must not collide within a mode,
// but ids may repeat across modes since SRS key is <game>:<mode>:<id> — check per mode only).
console.log('TOTAL structural errors:', total + bad);
