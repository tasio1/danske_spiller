var fs=require('fs'),path=require('path'),vm=require('vm');
var root=__dirname;var sb={window:{},console:console};vm.createContext(sb);
['shared/dansk-core.js','shared/data/nouns.js','shared/data/adjectives.js','boejningsvaerkstedet/data.js'].forEach(function(f){vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sb,{filename:f});});
var DC=sb.window.DanskCore, D=sb.window.BOEJNINGS_DATA;
['bestemt_ubestemt','maengdevaerkstedet','sammenligningspressen'].forEach(function(k){
  var all=D[k];
  var levels=all.map(function(i){return i.level;});
  var uniq={};levels.forEach(function(l){uniq[l]=(uniq[l]||0)+1;});
  var filtered=DC.level.filter(all,['A1','A2','B1','B2']);
  console.log(k+': total='+all.length+' filtered(A1-B2)='+filtered.length+' levelDist='+JSON.stringify(uniq));
});
console.log('DC.level.LEVELS=',DC.level.LEVELS);
