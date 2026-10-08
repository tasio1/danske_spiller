// Page-side driver for tal-og-tid: identifies the current item from the DOM (oracle) and answers it.
// Used by tests/tal-og-tid.mjs. Everything runs against the real UI over file://.

export const DRIVER_SRC = `
window.__tt = (function(){
  var MN = {'Klokken':'klokken','Tal':'tal','Årstal og ordenstal':'aarstal'};
  function sameSet(a,b){ a=a.slice().sort().join('\\u0001'); b=b.slice().sort().join('\\u0001'); return a===b; }
  function ang(el){ var m=/rotate\\(([-\\d.]+)/.exec(el.getAttribute('transform')||''); return m?parseFloat(m[1]):NaN; }
  function expAngles(t){ var p=t.split(':'),h=(+p[0])%12,m=+p[1]; return {h:(h+m/60)*30, m:m*6}; }
  function near(a,b){ var d=Math.abs(a-b)%360; return Math.min(d,360-d)<0.2; }
  function cur(){
    var D=window.TALOGTID_DATA, host=document.getElementById('item-host');
    var tag=host.querySelector('.case-tag'); if(!tag) return null;
    var mode=MN[tag.textContent.split(' · ')[1]];
    var q=function(s){var e=host.querySelector(s);return e?e.textContent:'';};
    var prompt=q('.prompt'), show=q('.bigshow, .hint');
    var se=host.querySelector('.sentence'), sent=se?se.textContent:'';
    var hasClock=!!host.querySelector('.clock-wrap');
    var typed=!!host.querySelector('#answer-input');
    var opts=[].slice.call(host.querySelectorAll('.opt')).map(function(b){return b.getAttribute('data-value');});
    var cands=(D[mode]||[]).filter(function(it){
      return (it.prompt_da||'')===prompt && (it.show||'')===show &&
        (it.sentence_da?it.sentence_da.replace(/_{2,}/,'?'):'')===sent &&
        !!it.clock===hasClock && !!it.input===typed && (typed || sameSet(it.options||[],opts));
    });
    return {mode:mode,prompt:prompt,show:show,sent:sent,hasClock:hasClock,typed:typed,opts:opts,cands:cands};
  }
  function clockProblems(info){
    var host=document.getElementById('item-host'), out=[];
    var c=info.cands[0]; if(!c) return out;
    if(info.hasClock){
      var svg=host.querySelector('.clock-wrap svg'); var e=expAngles(c.clock);
      if(!near(ang(svg.querySelector('.c-hour')),e.h)||!near(ang(svg.querySelector('.c-min')),e.m)) out.push('main clock hands wrong for '+c.id+' '+c.clock);
    }
    [].slice.call(host.querySelectorAll('.clockopt')).forEach(function(b){
      var v=b.getAttribute('data-value'), e=expAngles(v), s=b.querySelector('svg');
      var p=v.split(':'); var lab=(+p[0])+':'+p[1];
      if(b.getAttribute('aria-label').indexOf('ur '+lab)===-1) out.push('aria-label mismatch '+v+' / '+b.getAttribute('aria-label'));
      if(!near(ang(s.querySelector('.c-hour')),e.h)||!near(ang(s.querySelector('.c-min')),e.m)) out.push('option hands wrong '+v+' in '+c.id);
    });
    return out;
  }
  function layoutProblems(){
    var out=[], de=document.documentElement;
    if(de.scrollWidth>de.clientWidth) out.push('h-scroll '+de.scrollWidth+'>'+de.clientWidth);
    [].slice.call(document.querySelectorAll('#item-host .opt, #item-host .sentence, #item-host .bigshow, #item-host .prompt')).forEach(function(e){
      if(e.scrollWidth>e.clientWidth+1) out.push('overflow in '+e.className+' "'+e.textContent.slice(0,30)+'"');
      var r=e.getBoundingClientRect(); if(r.right>de.clientWidth+1) out.push('offscreen '+e.className);
    });
    [].slice.call(document.querySelectorAll('#item-host button, #item-host input')).forEach(function(e){
      var r=e.getBoundingClientRect(); if(r.width&&(r.width<44||r.height<44)) out.push('small target '+e.tagName+' '+Math.round(r.width)+'x'+Math.round(r.height)+' "'+(e.textContent||e.id).slice(0,20)+'"');
    });
    return out;
  }
  function answerValue(info){ var c=info.cands[0]; return info.typed? c.accepted_answers[0] : c.correct; }
  function clickOpt(val){ var bs=[].slice.call(document.querySelectorAll('#item-host .opt')); var b=bs.filter(function(x){return x.getAttribute('data-value')===val;})[0]; if(!b) return false; b.click(); return true; }
  function submitTyped(txt){ var i=document.getElementById('answer-input'); i.value=txt; document.querySelector('#item-host form button[type=submit]').click(); }
  function state(){
    var vis=function(id){return !document.getElementById(id).classList.contains('hidden');};
    return {start:vis('start-screen'),play:vis('play-screen'),summary:vis('summary-screen'),
      tag:(document.querySelector('#item-host .case-tag')||{}).textContent||'',
      slip:!!document.querySelector('#item-host .slip'),
      inputClass:(document.getElementById('answer-input')||{}).className||''};
  }
  return {cur:cur,clockProblems:clockProblems,layoutProblems:layoutProblems,answerValue:answerValue,clickOpt:clickOpt,submitTyped:submitTyped,state:state};
})();
`;

/** Install a data transform before the game's inline script reads window.TALOGTID_DATA. xformSrc = "(function(d){ ...return d; })" */
export async function installDataXform(page, xformSrc) {
  await page.evaluateOnNewDocument((src) => {
    let orig, cache;
    Object.defineProperty(window, 'TALOGTID_DATA', {
      configurable: true,
      set(v) { orig = v; cache = null; },
      get() { if (!cache && orig) cache = (0, eval)(src)(JSON.parse(JSON.stringify(orig))); return cache; },
    });
  }, xformSrc);
}

/** Speed up timers (not the real-time check): scales setTimeout delays. */
export async function installFastTimers(page, factor = 0.02) {
  await page.evaluateOnNewDocument((f) => {
    const st = window.setTimeout;
    window.setTimeout = (fn, ms, ...a) => st(fn, (ms || 0) * f, ...a);
  }, factor);
}
