// Temp harness: boot Bøjningsværkstedet index.html inline script in a minimal
// DOM shim (no TTS, no AudioContext, no matchMedia) and exercise Modes 4-6.
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var root = __dirname;

var errors = [];

// ---- minimal DOM ----
function classListFor(el) {
  return {
    add: function () { for (var i = 0; i < arguments.length; i++) if (el._classes.indexOf(arguments[i]) === -1) el._classes.push(arguments[i]); },
    remove: function () { for (var i = 0; i < arguments.length; i++) { var k = el._classes.indexOf(arguments[i]); if (k !== -1) el._classes.splice(k, 1); } },
    toggle: function (c, force) { var has = el._classes.indexOf(c) !== -1; var want = (force === undefined) ? !has : !!force; if (want && !has) el._classes.push(c); if (!want && has) el._classes.splice(el._classes.indexOf(c), 1); return want; },
    contains: function (c) { return el._classes.indexOf(c) !== -1; }
  };
}
function Element(tag) {
  this.tagName = (tag || 'div').toUpperCase();
  this.children = [];
  this.parentNode = null;
  this._classes = [];
  this._attrs = {};
  this._listeners = {};
  this._text = '';
  this.style = {};
  this.value = '';
  this.disabled = false;
  this.spellcheck = true;
  this.classList = classListFor(this);
}
Object.defineProperty(Element.prototype, 'className', {
  get: function () { return this._classes.join(' '); },
  set: function (v) { this._classes = String(v).split(/\s+/).filter(Boolean); }
});
Object.defineProperty(Element.prototype, 'textContent', {
  get: function () { return this._text; },
  set: function (v) { this._text = String(v); this.children = []; }
});
Object.defineProperty(Element.prototype, 'innerHTML', {
  get: function () { return this._html || ''; },
  set: function (v) { this._html = String(v); this.children = []; this._text = ''; }
});
Element.prototype.appendChild = function (c) { c.parentNode = this; this.children.push(c); return c; };
Element.prototype.removeChild = function (c) { var i = this.children.indexOf(c); if (i !== -1) this.children.splice(i, 1); c.parentNode = null; return c; };
Element.prototype.insertBefore = function (c, ref) { var i = this.children.indexOf(ref); if (i === -1) this.children.push(c); else this.children.splice(i, 0, c); c.parentNode = this; return c; };
Element.prototype.setAttribute = function (k, v) { this._attrs[k] = String(v); };
Element.prototype.getAttribute = function (k) { return this._attrs.hasOwnProperty(k) ? this._attrs[k] : null; };
Element.prototype.removeAttribute = function (k) { delete this._attrs[k]; };
Element.prototype.hasAttribute = function (k) { return this._attrs.hasOwnProperty(k); };
Element.prototype.addEventListener = function (t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); };
Element.prototype.removeEventListener = function (t, fn) { var a = this._listeners[t]; if (a) { var i = a.indexOf(fn); if (i !== -1) a.splice(i, 1); } };
Element.prototype.dispatch = function (t, ev) { ev = ev || {}; ev.preventDefault = ev.preventDefault || function () {}; (this._listeners[t] || []).slice().forEach(function (fn) { fn(ev); }); };
Element.prototype.click = function () { this.dispatch('click', {}); };
Element.prototype.focus = function () { doc.activeElement = this; };
Element.prototype.matchesSel = function (sel) {
  if (sel.charAt(0) === '.') return this._classes.indexOf(sel.slice(1)) !== -1;
  if (sel.charAt(0) === '#') return this._attrs.id === sel.slice(1);
  return this.tagName === sel.toUpperCase();
};
Element.prototype._collect = function (sel, out) {
  this.children.forEach(function (c) { if (c.matchesSel(sel)) out.push(c); c._collect(sel, out); });
  return out;
};
Element.prototype.querySelectorAll = function (sel) { return this._collect(sel, []); };
Element.prototype.querySelector = function (sel) { var a = this._collect(sel, []); return a.length ? a[0] : null; };

// ---- document ----
var byId = {};
var IDS = ['start-screen', 'play-screen', 'summary-screen', 'mode-list', 'level-list',
  'item-host', 'summary-host', 'progress-fill', 'progress-count',
  'btn-dark', 'btn-sound', 'btn-play', 'btn-back'];
var doc = {
  head: new Element('head'),
  body: new Element('body'),
  documentElement: new Element('html'),
  activeElement: null,
  _listeners: {},
  createElement: function (t) { return new Element(t); },
  getElementById: function (id) { return byId[id] || null; },
  addEventListener: function (t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); },
  removeEventListener: function (t, fn) { var a = this._listeners[t]; if (a) { var i = a.indexOf(fn); if (i !== -1) a.splice(i, 1); } },
  dispatch: function (t, ev) { ev = ev || {}; ev.preventDefault = ev.preventDefault || function () {}; (this._listeners[t] || []).slice().forEach(function (fn) { fn(ev); }); },
  hidden: false
};
doc.documentElement.setAttribute('data-theme', '');
doc.documentElement.getAttribute = Element.prototype.getAttribute.bind(doc.documentElement);
IDS.forEach(function (id) { var e = new Element('div'); e._attrs.id = id; byId[id] = e; doc.body.appendChild(e); });

// ---- window ----
var timers = [];
var store = {};
var win = {
  document: doc,
  setTimeout: function (fn) { timers.push(fn); return timers.length; },
  clearTimeout: function () {},
  matchMedia: undefined,           // absent → dark/motion fall back
  localStorage: {
    getItem: function (k) { return store.hasOwnProperty(k) ? store[k] : null; },
    setItem: function (k, v) { store[k] = String(v); },
    removeItem: function (k) { delete store[k]; }
  },
  addEventListener: function () {},
  navigator: { language: 'da-DK' }
  // speechSynthesis / AudioContext intentionally absent
};
win.window = win;

var sandbox = { window: win, document: doc, console: {
  log: function () {}, warn: function () {}, info: function () {},
  error: function () { errors.push('console.error: ' + Array.prototype.join.call(arguments, ' ')); }
}, setTimeout: win.setTimeout };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function load(f) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f }); }
  catch (e) { errors.push('LOAD ERROR in ' + f + ': ' + e.message + '\n' + (e.stack || '')); }
}

load('shared/dansk-core.js');
load('shared/data/nouns.js');
load('shared/data/adjectives.js');
load('boejningsvaerkstedet/data.js');

// ---- extract & run inline game script ----
var html = fs.readFileSync(path.join(root, 'boejningsvaerkstedet/index.html'), 'utf8');
var scripts = html.match(/<script>[\s\S]*?<\/script>/g) || [];
var inline = scripts[scripts.length - 1].replace(/^<script>/, '').replace(/<\/script>$/, '');
try { vm.runInContext(inline, sandbox, { filename: 'index.html:inline' }); }
catch (e) { errors.push('BOOT ERROR: ' + e.message + '\n' + (e.stack || '')); }

console.log('Booted. Errors so far: ' + errors.length);

// ---- helper to drive a mode ----
function pickMode(key) {
  var modeBtns = byId['mode-list'].querySelectorAll('.mode-btn');
  var found = null;
  // Mode buttons render in MODES order; find the one whose click sets state.mode.
  // We click each and check aria-pressed via the disabled flag; simplest: click by index.
  return modeBtns;
}

function flushTimers() { var t = timers.splice(0); t.forEach(function (fn) { try { fn(); } catch (e) { errors.push('timer error: ' + e.message); } }); }

// Drive a given mode: click its start-screen mode button, press Spil, render, answer.
function driveMode(modeIndex, label, answerFn) {
  errors.length; // keep
  var modeBtns = byId['mode-list'].querySelectorAll('.mode-btn');
  if (!modeBtns[modeIndex]) { errors.push(label + ': mode button ' + modeIndex + ' not found'); return; }
  if (modeBtns[modeIndex].disabled) { errors.push(label + ': mode button DISABLED (empty pool)'); return; }
  modeBtns[modeIndex].click();               // sets state.mode
  byId['btn-play'].click();                  // startRound → renderItem
  var host = byId['item-host'];
  if (!host.children.length) { errors.push(label + ': item-host empty after start'); return; }
  // diagnostic: dump the render tree shape
  var dump = host.children.map(function (c) { return c.tagName + '.' + c.className + '(' + c.children.length + ')'; }).join(', ');
  console.log('  [' + label + '] host top children: ' + dump);
  try {
    var res = answerFn(host);
    console.log('  ' + label + ': rendered + answered → ' + res);
  } catch (e) { errors.push(label + ' answer error: ' + e.message + '\n' + (e.stack || '')); }
}

// Mode 4 — sammenligningspressen: fill inputs with WRONG value, submit, expect slip.
driveMode(3, 'Mode 4 sammenligningspressen', function (host) {
  var inputs = host.querySelectorAll('input');
  if (inputs.length !== 3) throw new Error('expected 3 inputs, got ' + inputs.length);
  inputs.forEach(function (inp) { inp.value = 'zzz'; });
  var submit = host.querySelectorAll('button').filter ? null : null;
  var btns = host.querySelectorAll('button');
  var sub = btns[btns.length - 1];
  sub.click();
  // wrong answer → slip with a Videre button should appear; correct-reveal fills inputs
  var slip = host.querySelector('.slip');
  if (!slip) throw new Error('no proofing slip after wrong submit');
  return 'wrong→slip shown, class=' + slip.className;
});

// Mode 5 — bestemt_ubestemt: click first option, expect resolution.
driveMode(4, 'Mode 5 bestemt_ubestemt', function (host) {
  var opts = host.querySelectorAll('.opt');
  if (!opts.length) throw new Error('no option buttons');
  opts[0].click();
  var slip = host.querySelector('.slip');
  if (!slip) throw new Error('no slip after choosing option');
  return opts.length + ' options, slip class=' + slip.className;
});

// Mode 6 — maengdevaerkstedet: click first option.
driveMode(5, 'Mode 6 maengdevaerkstedet', function (host) {
  var opts = host.querySelectorAll('.opt');
  if (!opts.length) throw new Error('no option buttons');
  opts[0].click();
  var slip = host.querySelector('.slip');
  if (!slip) throw new Error('no slip after choosing option');
  return opts.length + ' options, slip class=' + slip.className;
});

flushTimers();

console.log('\nRENDERERS present: ' + ['sammenligningspressen', 'bestemt_ubestemt', 'maengdevaerkstedet'].join(', '));
console.log('\nTOTAL boot/render errors: ' + errors.length);
errors.forEach(function (e) { console.log('--- ' + e); });
process.exitCode = errors.length ? 1 : 0;
