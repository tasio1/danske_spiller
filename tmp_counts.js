global.window = {};
require('./shared/data/nouns.js');
require('./shared/data/adjectives.js');
require('./boejningsvaerkstedet/data.js');
var d = global.window.BOEJNINGS_DATA;
var targets = {fire_former:900, byg_navneordet:500, adjektivvaerkstedet:400, sammenligningspressen:180, bestemt_ubestemt:250, maengdevaerkstedet:220};
Object.keys(targets).forEach(function(k){
  console.log(k, (d[k]||[]).length, '/', targets[k]);
});
console.log('NOUNS', global.window.DANSK_NOUNS.length, 'ADJ', global.window.DANSK_ADJECTIVES.length);
