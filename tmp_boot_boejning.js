// Temp headless boot harness for boejningsvaerkstedet/index.html.
// Verifies the game boots with zero console errors and that the Mode 4/5/6
// renderers render + process an answer without throwing. Delete after use.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let consoleErrors = [];
const realErr = console.error.bind(console);
const testConsole = {
  log: () => {},
  warn: () => {},
  error: (...a) => { consoleErrors.push(a.join(' ')); realErr('console.error:', ...a); }
};

// ---- minimal DOM ----
function Element(tag) {
  this.tagName = (tag || 'div').toUpperCase();
  this.children = [];
  this.parentNode = null;
  this._attrs = {};
  this._listeners = {};
  this._classes = new Set();
  this.style = {};
  this._text = '';
  this.value = '';
  this.disabled = false;
  this.spellcheck = true;
  this.type = '';
  this.href = '';
  this.title = '';
  this.id = '';
  const self = this;
  this.classList = {
    add: (...c) => c.forEach(x => self._classes.add(x)),
    remove: (...c) => c.forEach(x => self._classes.delete(x)),
    contains: (c) => self._classes.has(c),
    toggle: (c, force) => {
      const has = self._classes.has(c);
      const on = (force === undefined) ? !has : !!force;
      if (on) self._classes.add(c); else self._classes.delete(c);
      return on;
    }
  };
}
Object.defineProperty(Element.prototype, 'className', {
  get() { return Array.from(this._classes).join(' '); },
  set(v) { this._classes = new Set(String(v).split(/\s+/).filter(Boolean)); }
});
Object.defineProperty(Element.prototype, 'textContent', {
  get() { return this._text; },
  set(v) { this._text = String(v); this.children = []; }
});
Object.defineProperty(Element.prototype, 'innerHTML', {
  get() { return this._html || ''; },
  set(v) { this._html = String(v); if (v === '') this.children = []; }
});
Element.prototype.setAttribute = function (k, v) { this._attrs[k] = String(v); if (k === 'id') this.id = v; };
Element.prototype.getAttribute = function (k) { return this._attrs[k] === undefined ? null : this._attrs[k]; };
Element.prototype.appendChild = function (c) { c.parentNode = this; this.children.push(c); return c; };
Element.prototype.removeChild = function (c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; };
Element.prototype.addEventListener = function (t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); };
Element.prototype.removeEventListener = function (t, fn) {
  if (!this._listeners[t]) return;
  this._listeners[t] = this._listeners[t].filter(f => f !== fn);
};
Element.prototype.dispatch = function (t, ev) {
  ev = ev || {};
  ev.preventDefault = ev.preventDefault || function () {};
  (this._listeners[t] || []).slice().forEach(fn => fn(ev));
};
Element.prototype.click = function () { this.dispatch('click', {}); };
Element.prototype.focus = function () { doc.activeElement = this; };
Element.prototype.querySelectorAll = function (sel) {
  const out = [];
  const wantClass = sel.charAt(0) === '.' ? sel.slice(1) : null;
  const wantTag = wantClass ? null : sel.toUpperCase();
  (function walk(node) {
    node.children.forEach(ch => {
      if (!ch || ch.nodeType === 3) return;
      if ((wantClass && ch._classes && ch._classes.has(wantClass)) ||
          (wantTag && ch.tagName === wantTag)) out.push(ch);
      walk(ch);
    });
  })(this);
  return out;
};
Element.prototype.querySelector = function (sel) { const r = this.querySelectorAll(sel); return r[0] || null; };
Element.prototype.contains = function (node) {
  if (node === this) return true;
  let found = false;
  (function walk(n){ (n.children || []).forEach(c => { if (c === node) found = true; else walk(c); }); })(this);
  return found;
};

const registry = {};
const IDS = ['start-screen', 'play-screen', 'summary-screen', 'mode-list', 'level-list',
  'item-host', 'summary-host', 'progress-fill', 'progress-count',
  'btn-dark', 'btn-sound', 'btn-play', 'btn-back'];
IDS.forEach(id => { const e = new Element('div'); e.id = id; registry[id] = e; });

const docListeners = {};
const doc = {
  hidden: false,
  activeElement: null,
  documentElement: new Element('html'),
  head: new Element('head'),
  body: new Element('body'),
  createElement: (t) => new Element(t),
  createTextNode: (t) => ({ nodeType: 3, textContent: String(t), _text: String(t) }),
  getElementById: (id) => registry[id] || null,
  addEventListener: (t, fn) => { (docListeners[t] = docListeners[t] || []).push(fn); },
  removeEventListener: (t, fn) => { if (docListeners[t]) docListeners[t] = docListeners[t].filter(f => f !== fn); },
  dispatch: (t, ev) => { ev = ev || {}; ev.preventDefault = ev.preventDefault || function () {}; (docListeners[t] || []).slice().forEach(fn => fn(ev)); }
};

const store = new Map();
const timers = [];
const win = {
  DanskCore: undefined,
  speechSynthesis: undefined,
  SpeechSynthesisUtterance: undefined,
  AudioContext: undefined,
  webkitAudioContext: undefined,
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  },
  setTimeout: (fn, ms) => { timers.push(fn); return timers.length; },
  clearTimeout: () => {},
  navigator: { language: 'da-DK', userAgent: 'node' }
};
function flushTimers() { while (timers.length) { const fn = timers.shift(); try { fn(); } catch (e) { consoleErrors.push('timer: ' + e.message); realErr(e); } } }

const sandbox = { window: win, document: doc, console: testConsole, navigator: win.navigator,
  localStorage: win.localStorage, setTimeout: win.setTimeout, clearTimeout: win.clearTimeout, Math: Math, Date: Date };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

function load(f) { vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), sandbox, { filename: f }); }

// Extract the inline game <script> (the last one, after data.js include).
const html = fs.readFileSync(path.join(__dirname, 'boejningsvaerkstedet/index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const inline = scripts[scripts.length - 1];

console.error = testConsole.error; // route
try {
  load('shared/dansk-core.js');
  load('shared/data/nouns.js');
  load('shared/data/adjectives.js');
  load('boejningsvaerkstedet/data.js');
  vm.runInContext(inline, sandbox, { filename: 'index.html#inline' });
} catch (e) { consoleErrors.push('BOOT THROW: ' + e.message); realErr(e); }

console.log = () => {};
const log = realErr.bind(null); // use stderr for our own logs to avoid clutter? use console via process
function say(...a) { process.stdout.write(a.join(' ') + '\n'); }

say('Boot console.errors: ' + consoleErrors.length);

// Drive each new mode by clicking its mode button (index in MODES order) then Spil.
const modeIndex = { sammenligningspressen: 3, bestemt_ubestemt: 4, maengdevaerkstedet: 5 };
const itemHost = registry['item-host'];
const play = registry['play-screen'];

function driveMode(key, answerKind) {
  const before = consoleErrors.length;
  const modeBtns = registry['mode-list'].querySelectorAll('.mode-btn');
  const btn = modeBtns[modeIndex[key]];
  if (!btn) { say(key + ': NO MODE BUTTON'); return; }
  if (btn.disabled) { say(key + ': mode button DISABLED (empty pool)'); return; }
  btn.click();
  registry['btn-play'].click();
  // check something rendered
  const host = itemHost;
  const isEmpty = host.querySelectorAll('.empty-state').length > 0;
  const rendered = host.children.length > 0 && !isEmpty;
  say(key + ': rendered=' + rendered + (isEmpty ? ' (EMPTY STATE!)' : ''));

  if (answerKind === 'mc') {
    // number-key path
    const opts = host.querySelectorAll('.opt');
    say('   options=' + opts.length + ' blank=' + (host.querySelectorAll('.blank').length));
    doc.dispatch('keydown', { key: '1' });      // choose option 1 via keyboard
    flushTimers();
  } else if (answerKind === 'cmp') {
    const inputs = host.querySelectorAll('.slot-input');
    say('   slot inputs=' + inputs.length);
    inputs.forEach(inp => { inp.value = 'prøve'; });
    const submit = host.querySelectorAll('button').find(b => b.textContent === 'Sæt i pressen');
    if (submit) submit.click();
    flushTimers();
    // advance through a Videre if present
    const videre = itemHost.querySelectorAll('button').find(b => b.textContent === 'Videre');
    if (videre) { videre.click(); flushTimers(); }
  }
  const after = consoleErrors.length;
  say('   new errors: ' + (after - before));
}

driveMode('sammenligningspressen', 'cmp');
driveMode('bestemt_ubestemt', 'mc');
driveMode('maengdevaerkstedet', 'mc');

// Play a full MC round to completion to exercise summary + advance loop.
(function fullRound() {
  const before = consoleErrors.length;
  registry['mode-list'].querySelectorAll('.mode-btn')[4].click();
  registry['btn-play'].click();
  for (let guard = 0; guard < 40; guard++) {
    if (registry['summary-screen']._classes && !registry['summary-screen']._classes.has('hidden')) break;
    const opts = itemHost.querySelectorAll('.opt');
    if (!opts.length) break;
    opts[0].click();
    flushTimers();
    const videre = itemHost.querySelectorAll('button').find(b => b.textContent === 'Videre');
    if (videre) { videre.click(); flushTimers(); }
  }
  const sumRendered = registry['summary-host'].children.length > 0;
  say('Full round -> summary rendered=' + sumRendered + ', new errors=' + (consoleErrors.length - before));
})();

say('\nTOTAL console.errors: ' + consoleErrors.length);
if (consoleErrors.length) { consoleErrors.forEach(e => say('  ' + e)); process.exitCode = 1; }
else say('ZERO console errors ✓');
