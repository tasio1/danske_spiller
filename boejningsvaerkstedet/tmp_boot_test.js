// Temporary DOM-shim boot test for Bøjningsværkstedet.
// Boots the inline game script from index.html in a minimal fake DOM with
// TTS / AudioContext / matchMedia ABSENT (must degrade silently) and exercises
// Modes 4, 5, 6 end-to-end. Not committed.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let consoleErrors = [];

// ---------- minimal DOM ----------
let idSeq = 0;
function mkEl(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(),
    children: [], _listeners: {}, _attrs: {}, style: {}, dataset: {},
    _text: '', _html: '', value: '', disabled: false, spellcheck: true,
    classList: {
      _s: {},
      add(...c){ c.forEach(x => this._s[x] = 1); },
      remove(...c){ c.forEach(x => delete this._s[x]); },
      toggle(c, on){ if (on === undefined) on = !this._s[c]; if (on) this._s[c]=1; else delete this._s[c]; },
      contains(c){ return !!this._s[c]; }
    },
    get className(){ return Object.keys(this.classList._s).join(' '); },
    set className(v){ this.classList._s = {}; String(v).split(/\s+/).forEach(c => { if (c) this.classList._s[c] = 1; }); },
    get textContent(){ return this._text; },
    set textContent(v){ this._text = String(v); this.children = []; },
    get innerHTML(){ return this._html; },
    set innerHTML(v){ this._html = String(v); this.children = []; },
    appendChild(c){ this.children.push(c); c.parentNode = this; return c; },
    removeChild(c){ this.children = this.children.filter(x => x !== c); return c; },
    setAttribute(k,v){ this._attrs[k]=String(v); },
    getAttribute(k){ return this._attrs[k]; },
    removeAttribute(k){ delete this._attrs[k]; },
    addEventListener(t,fn){ (this._listeners[t] = this._listeners[t]||[]).push(fn); },
    removeEventListener(t,fn){ if(this._listeners[t]) this._listeners[t] = this._listeners[t].filter(f=>f!==fn); },
    dispatch(t,ev){ (this._listeners[t]||[]).slice().forEach(fn => fn(ev||{})); },
    click(){ this.dispatch('click', {}); },
    focus(){ doc.activeElement = this; },
    querySelectorAll(sel){ return collectByClass(this, sel.replace(/^\./,'')); },
    querySelector(sel){ return this.querySelectorAll(sel)[0] || null; },
    _id: ++idSeq
  };
  return el;
}
function collectByClass(node, cls){
  let out = [];
  (node.children || []).forEach(ch => {
    if (ch.classList && ch.classList.contains(cls)) out.push(ch);
    out = out.concat(collectByClass(ch, cls));
  });
  return out;
}

const byId = {};
const doc = {
  activeElement: null,
  _listeners: {},
  createElement: mkEl,
  createTextNode(t){ return { nodeType:3, textContent:String(t), _text:String(t), children:[] }; },
  getElementById(id){ return byId[id] || null; },
  addEventListener(t,fn){ (this._listeners[t]=this._listeners[t]||[]).push(fn); },
  removeEventListener(t,fn){ if(this._listeners[t]) this._listeners[t]=this._listeners[t].filter(f=>f!==fn); },
  dispatch(t,ev){ (this._listeners[t]||[]).slice().forEach(fn=>fn(ev||{})); },
  documentElement: mkEl('html'),
  head: mkEl('head'),
  hidden: false,
  body: mkEl('body')
};

// register the fixed ids the game looks up
['start-screen','play-screen','summary-screen','mode-list','level-list',
 'item-host','summary-host','progress-fill','progress-count',
 'btn-dark','btn-sound','btn-play','btn-back'].forEach(id => {
  const e = mkEl('div'); e._attrs.id = id; byId[id] = e;
});

const timers = [];
const win = {
  document: doc,
  setTimeout(fn){ timers.push(fn); return timers.length; },
  clearTimeout(){},
  localStorage: (function(){ const m={}; return {
    getItem:k=>k in m?m[k]:null, setItem:(k,v)=>{m[k]=String(v);}, removeItem:k=>{delete m[k];}
  };})(),
  // matchMedia, speechSynthesis, AudioContext deliberately ABSENT
  navigator: { language: 'da-DK' }
};
win.window = win;
doc.defaultView = win;

const console2 = {
  log: (...a) => process.stdout.write(a.join(' ') + '\n'),
  warn: (...a) => process.stdout.write('WARN ' + a.join(' ') + '\n'),
  error: (...a) => { consoleErrors.push(a.join(' ')); process.stdout.write('ERROR ' + a.join(' ') + '\n'); }
};

const ctx = vm.createContext(Object.assign(win, { console: console2 }));

function run(rel){
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  try { vm.runInContext(code, ctx, { filename: rel }); }
  catch(e){ consoleErrors.push(rel + ' THREW: ' + e.message + '\n' + e.stack); }
}

// load library + data
run('shared/dansk-core.js');
run('shared/data/nouns.js');
run('shared/data/adjectives.js');
run('boejningsvaerkstedet/data.js');

// extract inline game <script> (the last <script> block without src) from index.html
const html = fs.readFileSync(path.join(root, 'boejningsvaerkstedet/index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const gameScript = scripts[scripts.length - 1];
try { vm.runInContext(gameScript, ctx, { filename: 'index.html#inline' }); }
catch(e){ consoleErrors.push('inline game script THREW: ' + e.message + '\n' + e.stack); }

// ---------- drive the game ----------
function findMode(num){
  // mode buttons are appended to mode-list in MODES order
  return byId['mode-list'].children[num-1];
}
function play(){ byId['btn-play'].click(); }

function exerciseMode(modeNum, modeName){
  console2.log('\n=== Mode ' + modeNum + ' (' + modeName + ') ===');
  // select mode
  const mbtn = findMode(modeNum);
  if (!mbtn) { consoleErrors.push('Mode button ' + modeNum + ' missing'); return; }
  if (mbtn.disabled) { consoleErrors.push('Mode ' + modeNum + ' is DISABLED (no data)'); return; }
  mbtn.click();
  play();
  const host = byId['item-host'];
  console2.log('  item rendered, host has ' + host.children.length + ' child(ren)');

  if (modeName === 'sammenligningspressen') {
    const inputs = collectByClass(host, 'slot-input');
    console2.log('  slot inputs: ' + inputs.length);
    inputs.forEach(i => { i.value = 'x'; });               // wrong answers on purpose
    const submit = collectByClass(host, 'accent')[0];
    submit && submit.click();
    const slip = collectByClass(host, 'slip')[0];
    console2.log('  feedback slip present: ' + !!slip + (slip ? ' class=' + Object.keys(slip.classList._s).join(',') : ''));
  } else {
    // MC modes 5 & 6
    const opts = collectByClass(host, 'opt');
    console2.log('  option buttons: ' + opts.length);
    opts[0] && opts[0].click();                            // choose first option
    const slip = collectByClass(host, 'slip')[0];
    console2.log('  feedback slip present: ' + !!slip + (slip ? ' class=' + Object.keys(slip.classList._s).join(',') : ''));
  }
  // go back to start for next mode
  doc.dispatch('keydown', { key: 'Escape', preventDefault(){} });
}

function dumpTree(node, depth){
  const pad = '  '.repeat(depth);
  const cls = node.classList ? Object.keys(node.classList._s).join('.') : '';
  const tag = node.tagName || (node.nodeType===3 ? '#text' : '?');
  console2.log(pad + tag + (cls ? '.'+cls : '') + (node._text ? ' "'+node._text.slice(0,20)+'"' : ''));
  (node.children||[]).forEach(c => dumpTree(c, depth+1));
}
// probe: render one mode-5 item and dump the tree
findMode(5).click(); play();
console2.log('--- Mode 5 item-host tree probe ---');
dumpTree(byId['item-host'], 0);
doc.dispatch('keydown', { key:'Escape', preventDefault(){} });

exerciseMode(4, 'sammenligningspressen');
exerciseMode(5, 'bestemt_ubestemt-MC');
exerciseMode(6, 'maengdevaerkstedet-MC');

// Also confirm a full round can finish -> summary (drive mode 6 to completion)
console2.log('\n=== Full-round summary check (Mode 6) ===');
findMode(6).click();
play();
let guard = 0;
while (!byId['summary-screen'].classList.contains('hidden') === false && guard < 40) {
  const host = byId['item-host'];
  const opts = collectByClass(host, 'opt');
  if (opts.length) { opts[0].click(); }
  // flush any pending auto-advance timers (correct answers)
  while (timers.length) { const t = timers.shift(); try { t(); } catch(e){ consoleErrors.push('timer THREW: '+e.message); } }
  guard++;
  if (!byId['summary-screen'].classList.contains('hidden')) break;
}
const sumHost = byId['summary-host'];
console2.log('  summary rendered, host children: ' + sumHost.children.length +
  ', summary visible: ' + !byId['summary-screen'].classList.contains('hidden'));

console2.log('\nCONSOLE ERRORS: ' + consoleErrors.length);
consoleErrors.forEach(e => console2.log('  ' + e));
process.exitCode = consoleErrors.length ? 1 : 0;

// ---- probe DATA counts + level.filter inside ctx ----
vm.runInContext(
  "console.log('DATA keys: ' + Object.keys(window.BOEJNINGS_DATA).map(function(k){return k+'='+window.BOEJNINGS_DATA[k].length;}).join(', '));" +
  "var d=window.BOEJNINGS_DATA.bestemt_ubestemt;" +
  "console.log('sample b_u levels: ' + d.slice(0,3).map(function(x){return x.level;}).join(','));" +
  "console.log('filter A1-B2 -> ' + window.DanskCore.level.filter(d, ['A1','A2','B1','B2']).length);",
  ctx, { filename: 'probe' });
