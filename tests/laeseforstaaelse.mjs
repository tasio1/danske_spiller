// UI spec for Læseforståelse (split-reader shell + mode mc). Reusable for later mode tasks: extend MODE_CASES / add sections.
//   GAME_ROOT=<worktree>/laeseforstaaelse SHOT_ROOT=<dir> OUT=<dir> node tests/laeseforstaaelse.mjs [--shots] [--only=a,b]
// GAME_ROOT defaults to <repo>/laeseforstaaelse (repo = parent of this tests/ dir). Run from any cwd.
// Sections: grep, data, boot, round, persist, kbd, layout, reader, theme, content
// Exit 1 on any FAIL. Metrics (chars/line, pane shares) are printed as NOTE and written to OUT/laese-metrics.json.
import { launch, sleep, hasHorizontalOverflow, smallTapTargets, unlabelledButtons, lowContrast } from './lib/harness.mjs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.env.GAME_ROOT || path.join(HERE, '..', 'laeseforstaaelse'));
const REPO = path.dirname(ROOT);
const FILE = path.join(ROOT, 'index.html');
const SHOTS = process.argv.includes('--shots');
const SHOT_DIR = path.join(process.env.SHOT_ROOT || path.join(os.tmpdir(), 'laese-shots'));
const OUT = process.env.OUT || path.join(os.tmpdir(), 'laese-spectest');
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').replace('--only=', '').split(',').filter(Boolean);
const want = s => !ONLY.length || ONLY.includes(s);
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(SHOT_DIR, { recursive: true });
console.log('NOTE game root ' + ROOT + ' ; out ' + OUT);

const results = [];
const rec = (name, ok, ev) => { results.push({ name, ok, ev }); console.log((ok === null ? 'NV   ' : ok ? 'PASS ' : 'FAIL ') + name + (ev ? '  :: ' + String(ev).slice(0, 700) : '')); };
const note = (name, ev) => console.log('NOTE ' + name + ' :: ' + (typeof ev === 'string' ? ev : JSON.stringify(ev)).slice(0, 900));
const metrics = {};

const VPS = {
  '1920x1080': { width: 1920, height: 1080 }, '1440x900': { width: 1440, height: 900 }, '1280x720': { width: 1280, height: 720 },
  '1024x768': { width: 1024, height: 768 }, '820x1180': { width: 820, height: 1180 },
  '360x640': { width: 360, height: 640, isMobile: true, hasTouch: true },
};
const DISCLAIMER = 'Øvelsesopgaver i samme format som Prøve i Dansk 3. Ikke officielt prøvemateriale.';
const FOOTER = 'Øvelsestekst skrevet til sprogtræning. Tal og fakta er dokumenterede — se kilder.';
const PRAISE = /\b(godt klaret|flot|super|fantastisk|bravo|tillykke|well done|great|dygtig|perfekt|sejt|yes!)\b/i;

const INSTRUMENT = () => {
  window.__osc = 0; window.__st = [];
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC) {
    const o = AC.prototype.createOscillator; AC.prototype.createOscillator = function () { window.__osc++; return o.apply(this, arguments); };
    const b = AC.prototype.createBufferSource; AC.prototype.createBufferSource = function () { window.__osc++; return b.apply(this, arguments); };
  }
  const st = Element.prototype.scrollTo;
  Element.prototype.scrollTo = function (o) { window.__st.push(o && typeof o === 'object' ? { top: o.top, behavior: o.behavior } : { raw: true }); return st.apply(this, arguments); };
};
const THROW_LS = () => {
  const boom = () => { throw new DOMException('blocked', 'SecurityError'); };
  Object.defineProperty(window, 'localStorage', { get: boom, configurable: true });
};

const browser = await launch();
async function open(vp = '1440x900', { scheme, reduced, init, keepStorage = false } = {}) {
  // fresh incognito context per page: file:// shares one localStorage origin, so state would leak between scenarios
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const origClose = page.close.bind(page); page.close = async () => { await origClose().catch(() => {}); await ctx.close().catch(() => {}); };
  await page.bringToFront();
  const issues = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) issues.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', e => issues.push('pageerror: ' + e.message));
  page.on('requestfailed', r => issues.push('requestfailed: ' + r.url() + ' ' + r.failure()?.errorText));
  const reqs = []; page.on('request', r => reqs.push(r.url()));
  await page.setViewport(VPS[vp] || vp);
  const feats = [];
  if (scheme) feats.push({ name: 'prefers-color-scheme', value: scheme });
  if (reduced) feats.push({ name: 'prefers-reduced-motion', value: 'reduce' });
  if (feats.length) await page.emulateMediaFeatures(feats);
  await page.evaluateOnNewDocument(INSTRUMENT);
  if (init) await page.evaluateOnNewDocument(init);
  await page.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
  await sleep(500);
  return { page, issues, reqs };
}
async function reload(page) { await page.reload({ waitUntil: 'load' }); await sleep(500); }
const play = async page => { await page.click('#btn-play'); await sleep(450); };
const clickOpt = async (page, i) => { await page.evaluate(i => document.querySelectorAll('#lf-q .dc-quiz-option')[i].click(), i); };
const qnum = page => page.$eval('#lf-qnum', n => n.textContent);
const peek = page => page.$eval('#lf-peek', n => n.textContent);
const view = page => page.evaluate(() => ({ start: !document.getElementById('screen-start').hidden, play: !document.getElementById('screen-play').hidden }));
async function shot(page, vp, name) {
  if (!SHOTS) return;
  const dir = path.join(SHOT_DIR, 'shots'); fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${vp}-${name}.png`) });
}
// answer pattern: array of booleans per question (true = pick the correct option, false = a wrong one), driving the real DOM.
async function answerRound(page, pattern) {
  for (let k = 0; k < pattern.length; k++) {
    const ans = await page.evaluate(() => window.LAESE_DATA.byId('art-ulven').questions.map(q => q.correct));
    const qi = (await qnum(page)).match(/(\d) af/)[1] - 1;
    const c = ans[qi];
    const pick = pattern[k] ? c : (c + 1) % 3;
    await clickOpt(page, pick);
    if (pattern[k]) await sleep(1000); else { await sleep(900); await page.click('#btn-continue'); await sleep(250); }
  }
  await sleep(200);
}
// click the correct option of the current question; resolve with ms until the question header changes (auto-advance)
const advTime = page => page.evaluate(() => new Promise(res => {
  const q = document.getElementById('lf-qnum'); const t0 = performance.now();
  const cur = +document.getElementById('lf-qnum').textContent.match(/(\d) af/)[1] - 1;
  new MutationObserver((m, o) => { o.disconnect(); res(Math.round(performance.now() - t0)); }).observe(q, { childList: true, characterData: true, subtree: true });
  document.querySelectorAll('#lf-q .dc-quiz-option')[window.LAESE_DATA.byId('art-ulven').questions[cur].correct].click();
}));
const srsKeys = page => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('srs:laeseforstaaelse') || '{"items":{}}'); return Object.keys(s.items); });
const lsKeys = page => page.evaluate(() => Object.keys(localStorage));
const contrastFn = `(function(){const lum=([r,g,b])=>{const f=v=>(v/=255)<=0.03928?v/12.92:((v+0.055)/1.055)**2.4;return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};
 const parse=c=>(c.match(/[\\d.]+/g)||[]).map(Number);
 const bgOf=el=>{for(;el;el=el.parentElement){const c=parse(getComputedStyle(el).backgroundColor);if(c.length>=3&&(c[3]===undefined?1:c[3])>0.9)return c}return [255,255,255]};
 window.__ratio=(fg,bg)=>{const a=lum(fg),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
 window.__bgOf=bgOf;window.__parse=parse;})()`;

// ============ grep: no network, no analytics
if (want('grep')) {
  const files = fs.readdirSync(ROOT).filter(f => /\.(html|js|css)$/.test(f)).map(f => path.join(ROOT, f));
  const hits = [];
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8').split('\n');
    src.forEach((l, i) => { if (/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|googletagmanager|google-analytics|gtag\(|plausible|cdn\.|cdnjs|unpkg|jsdelivr|<script[^>]+src=["']https?:|<link[^>]+href=["']https?:|@import\s+url\(["']?https?:/i.test(l)) hits.push(path.basename(f) + ':' + (i + 1) + ' ' + l.trim().slice(0, 90)); });
  }
  const shared = ['dansk-core.js', 'dansk-speech.js', 'tts-button.css'].map(f => path.join(REPO, 'shared', f)).filter(fs.existsSync);
  for (const f of shared) fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (/\bfetch\s*\(|XMLHttpRequest|sendBeacon|googletagmanager|gtag\(/.test(l)) hits.push('shared/' + path.basename(f) + ':' + (i + 1)); });
  rec('grep: no fetch/XHR/CDN/analytics in game + loaded shared files (' + files.length + ' game files, ' + shared.length + ' shared)', hits.length === 0, hits.join(' | '));
}

// ============ data: validators
if (want('data')) {
  const run = (script, args) => {
    try { const out = execFileSync('node', [script, ...args], { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); return { code: 0, out }; }
    catch (e) { return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }; }
  };
  const dv = path.join(REPO, 'tests', 'laeseforstaaelse-data.mjs');
  if (fs.existsSync(dv)) {
    const r = run(dv, ['--dir=' + ROOT, '--expect=0,1,0,0']);
    rec('data: laeseforstaaelse-data.mjs --expect=0,1,0,0 exits 0', r.code === 0, 'exit ' + r.code + ' ' + r.out.trim().split('\n').slice(-2).join(' / '));
  } else rec('data: laeseforstaaelse-data.mjs --expect=0,1,0,0 exits 0', null, 'validator not present in ' + REPO + '/tests (run it in the tested worktree)');
  const sv = path.join(REPO, 'shared', 'validate.js');
  if (fs.existsSync(sv)) {
    const r = run(sv, []);
    rec('data: shared/validate.js 0 errors', r.code === 0 && /TOTAL: 0 errors/.test(r.out), 'exit ' + r.code + ' ' + r.out.trim().split('\n').pop());
  } else rec('data: shared/validate.js 0 errors', null, 'missing');
}

// ============ boot + start screen
if (want('boot')) {
  const { page, issues, reqs } = await open('1440x900');
  rec('boot: file:// 1440x900 console/page errors+warnings and failed requests = 0', issues.length === 0, issues.join(' | '));
  rec('boot: every request is file:// (no network)', reqs.every(u => u.startsWith('file://') || u.startsWith('data:')), reqs.filter(u => !u.startsWith('file://')).join(' '));
  const s = await page.evaluate(() => {
    const st = document.getElementById('screen-start');
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden'; };
    const texts = [...st.querySelectorAll('h1,p,button,label,span,a')].filter(vis).map(e => ({ tag: e.tagName.toLowerCase(), id: e.id, t: e.textContent.trim() }));
    return {
      h1: st.querySelector('h1')?.textContent, play: document.getElementById('btn-play')?.textContent,
      modes: [...st.querySelectorAll('#ctl-mode button')].map(b => b.textContent + (b.getAttribute('aria-checked') === 'true' ? '*' : '')),
      levels: [...st.querySelectorAll('#ctl-level button')].map(b => b.textContent + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')),
      disclaimer: [...st.querySelectorAll('p')].map(p => p.textContent.trim()).filter(t => t.includes('Prøve i Dansk')),
      buttons: [...st.querySelectorAll('button')].map(b => b.id || b.textContent.trim()), texts,
      playHidden: document.getElementById('screen-play').hidden, play44: (() => { const r = document.getElementById('btn-play').getBoundingClientRect(); return [r.width, r.height]; })(),
      scroll: [document.documentElement.scrollHeight, innerHeight], lang: document.documentElement.lang, title: document.title,
    };
  });
  note('start screen', s);
  rec('boot: start screen has title Læseforståelse, #btn-play "Spil", compact mode + level controls', s.h1 === 'Læseforståelse' && s.play === 'Spil' && s.modes.length >= 1 && s.levels.length >= 1, JSON.stringify({ h1: s.h1, play: s.play, modes: s.modes, levels: s.levels }));
  rec('boot: disclaimer line exact', s.disclaimer.length === 1 && s.disclaimer[0] === DISCLAIMER, JSON.stringify(s.disclaimer));
  rec('boot: play screen hidden on start; page does not scroll', s.playHidden && s.scroll[0] <= s.scroll[1], JSON.stringify(s.scroll));
  note('start screen extra controls (not in the brief list)', s.buttons.filter(b => !['btn-play'].includes(b)).join(', '));
  rec('boot: html lang=da, title mentions Læseforståelse', s.lang === 'da' && /Læseforståelse/.test(s.title), s.lang + ' / ' + s.title);
  await shot(page, '1440x900', 'start');
  const small = await smallTapTargets(page); rec('boot: start-screen tap targets >=44', small.length === 0, small.join('; '));
  rec('boot: icon buttons labelled', (await unlabelledButtons(page)).length === 0);
  await page.close();
}

// ============ rounds (mc)
if (want('round')) {
  const { page, issues } = await open('1440x900');
  await play(page);
  const d = await page.evaluate(() => { const t = window.LAESE_DATA.byId('art-ulven'); return { nq: t.questions.length, ev: t.questions.map(q => q.evidence), corr: t.questions.map(q => q.correct) }; });
  rec('round: art-ulven has 3 questions, played in order Spørgsmål 1..3 af 3', d.nq === 3 && (await qnum(page)) === 'Spørgsmål 1 af 3', await qnum(page));
  await shot(page, '1440x900', 'play');
  // Q1 correct
  const dtFirst = await advTime(page); // Q1: first correct answer of the page load (first sound cue creates the AudioContext)
  const midText = await page.$eval('#screen-play', n => n.innerText);
  const live = await page.evaluate(() => [...document.querySelectorAll('[aria-live]')].map(n => n.id + ':' + n.textContent.trim()).join(' | '));
  note('correct feedback visible text', midText.replace(/\s+/g, ' ').slice(0, 200)); note('aria-live regions', live);
  rec('round: first correct answer of a page load auto-advances in 700-900 ms', dtFirst >= 700 && dtFirst <= 900, dtFirst + ' ms');
  rec('round: no praise text on correct answer (visible text + live regions)', !PRAISE.test(midText) && !PRAISE.test(live), 'live=' + live);
  await sleep(150);
  const dt = dtFirst;
  rec('round: now on Spørgsmål 2 af 3', (await qnum(page)) === 'Spørgsmål 2 af 3', await qnum(page));
  // Q2 wrong
  await clickOpt(page, (d.corr[1] + 1) % 3); await sleep(1200);
  const w = await page.evaluate((evi) => {
    const box = document.querySelector('.lf-fb-box');
    const rd = document.getElementById('lf-reader'); const rr = rd.getBoundingClientRect();
    const hp = document.querySelector('p.lf-evidence'); const hr = hp && hp.getBoundingClientRect();
    return {
      boxText: box ? box.innerText.replace(/\s+/g, ' ') : null,
      correctMarked: [...document.querySelectorAll('#lf-q .dc-quiz-option.dc-correct')].map(b => b.textContent),
      wrongMarked: [...document.querySelectorAll('#lf-q .dc-quiz-option.dc-wrong')].length,
      notes: document.querySelectorAll('.dc-quiz-note').length + (box ? box.querySelectorAll('p').length - 1 : 0),
      see: [...document.querySelectorAll('.lf-fb-actions button')].map(b => b.textContent),
      hl: [...document.querySelectorAll('p.lf-evidence')].map(p => p.getAttribute('data-par')),
      inView: hr ? (hr.top >= rr.top - 1 && hr.bottom <= rr.bottom + 1) : false,
      centreOff: hr ? Math.round((hr.top + hr.bottom) / 2 - (rr.top + rr.bottom) / 2) : null,
      scrollTop: Math.round(rd.scrollTop), qnum: document.getElementById('lf-qnum').textContent, ariaHidden: document.getElementById('lf-q').querySelector('.dc-quiz-option:not(:disabled)') ? 'enabled' : 'all disabled',
    };
  });
  note('wrong answer state', w);
  rec('round: wrong answer shows correct option marked + wrong option marked (not colour-only: ✓/✗ via ::after)', w.correctMarked.length === 1 && w.wrongMarked === 1, JSON.stringify(w.correctMarked));
  rec('round: wrong answer shows "Rigtigt svar:" + exactly one note', /Rigtigt svar:/.test(w.boxText) && w.notes === 1, `notes=${w.notes} box=${w.boxText}`);
  rec('round: wrong answer offers "Se afsnit ' + (d.ev[1] + 1) + '"', w.see.includes('Se afsnit ' + (d.ev[1] + 1)), w.see.join(' / '));
  rec('round: evidence paragraph highlighted (data-par=' + (d.ev[1] + 1) + ') and scrolled into view/centre', w.hl.length === 1 && w.hl[0] === String(d.ev[1] + 1) && w.inView && Math.abs(w.centreOff) < 60, `hl=${w.hl} inView=${w.inView} centreOff=${w.centreOff}px scrollTop=${w.scrollTop}`);
  rec('round: wrong answer waits for input (still Q2 after 1.2 s; no replay-on-timer)', w.qnum === 'Spørgsmål 2 af 3', w.qnum);
  await shot(page, '1440x900', 'wrong');
  await sleep(1500); rec('round: still on Q2 after 2.7 s total', (await qnum(page)) === 'Spørgsmål 2 af 3');
  // "Se afsnit" re-scroll: scroll away, press, in view
  await page.evaluate(() => { document.getElementById('lf-reader').scrollTop = 0; }); await sleep(250);
  const seeBtn = await page.evaluateHandle(() => [...document.querySelectorAll('.lf-fb-actions button')].find(b => /Se afsnit/.test(b.textContent)));
  await seeBtn.click(); await sleep(1000);
  const inV = await page.evaluate(() => { const hp = document.querySelector('p.lf-evidence').getBoundingClientRect(), rr = document.getElementById('lf-reader').getBoundingClientRect(); return hp.top >= rr.top - 1 && hp.bottom <= rr.bottom + 1; });
  rec('round: "Se afsnit N" button scrolls the paragraph back into view', inV);
  await page.click('#btn-continue'); await sleep(300);
  rec('round: Næste → Q3', (await qnum(page)) === 'Spørgsmål 3 af 3', await qnum(page));
  await clickOpt(page, d.corr[2]); await sleep(1100);
  const sm = await page.evaluate(() => ({ q: document.getElementById('lf-q').innerText.replace(/\s+/g, ' '), btns: [...document.querySelectorAll('#lf-q .dc-summary-actions button')].map(b => b.textContent), weak: [...document.querySelectorAll('#lf-q .dc-summary-weak li')].map(l => l.textContent), hl: document.querySelectorAll('.lf-evidence').length, active: document.activeElement.textContent, head: document.getElementById('lf-qnum').textContent }));
  note('summary', sm);
  rec('round: summary shows score + accuracy (2 of 3 → 67%)', /Point: 2/.test(sm.q) && /Rigtige: 67%/.test(sm.q), sm.q);
  rec('round: summary lists <=3 weakest and exactly one action "Spil igen"', sm.weak.length >= 1 && sm.weak.length <= 3 && sm.btns.length === 1 && sm.btns[0] === 'Spil igen', JSON.stringify(sm));
  rec('round: highlight cleared on summary; Spil igen focused', sm.hl === 0 && sm.active === 'Spil igen', sm.active);
  await shot(page, '1440x900', 'summary');
  // restart
  await page.evaluate(() => [...document.querySelectorAll('#lf-q .dc-summary-actions button')][0].click()); await sleep(300);
  rec('round: Spil igen restarts at Spørgsmål 1 af 3 with fresh options', (await qnum(page)) === 'Spørgsmål 1 af 3' && (await page.$$eval('#lf-q .dc-quiz-option:not(:disabled)', b => b.length)) === 3, await qnum(page));
  const dtWarm = await advTime(page); // warm AudioContext
  rec('round: later correct answers auto-advance in 700-900 ms (sound already initialised)', dtWarm >= 700 && dtWarm <= 900, dtWarm + ' ms');
  await sleep(300); await page.click('#btn-menu'); await sleep(200); await play(page);
  // all wrong round: weakest <= 3
  await answerRound(page, [false, false, false]);
  const sm2 = await page.evaluate(() => ({ q: document.getElementById('lf-q').innerText.replace(/\s+/g, ' '), weak: document.querySelectorAll('#lf-q .dc-summary-weak li').length }));
  rec('round: all-wrong round → Point: 0, Rigtige: 0%, weakest list <= 3', /Point: 0/.test(sm2.q) && /Rigtige: 0%/.test(sm2.q) && sm2.weak <= 3 && sm2.weak >= 1, sm2.q);
  // menu
  await page.click('#btn-menu'); await sleep(250);
  const v = await view(page);
  rec('round: Menu returns to start screen (play hidden, btn-menu hidden)', v.start && !v.play && (await page.$eval('#btn-menu', b => b.hidden)), JSON.stringify(v));
  await play(page);
  rec('round: Spil after Menu starts a fresh round at Q1', (await qnum(page)) === 'Spørgsmål 1 af 3');
  // mid-round Menu + replay then answered-review (J back)
  await clickOpt(page, d.corr[0] === 0 ? 1 : 0); await sleep(700);
  await page.click('#btn-continue'); await sleep(200);
  await page.keyboard.press('j'); await sleep(200);
  const rev = await page.evaluate(() => ({ q: document.getElementById('lf-qnum').textContent, enabled: document.querySelectorAll('#lf-q button.dc-quiz-option').length, marked: document.querySelectorAll('#lf-q .dc-quiz-option.dc-correct, #lf-q .dc-quiz-option.dc-wrong').length }));
  rec('round: revisiting an answered question shows static review (no second attempt)', rev.q === 'Spørgsmål 1 af 3' && rev.enabled === 0 && rev.marked === 2, JSON.stringify(rev));
  rec('round: console clean over whole flow', issues.length === 0, issues.join(' | '));
  await page.close();
}

// ============ persistence
if (want('persist')) {
  const { page, issues } = await open('1440x900');
  await play(page);
  await answerRound(page, [true, false, true]);
  const keys = await srsKeys(page);
  note('srs keys', keys); note('all localStorage keys', await lsKeys(page));
  const want3 = ['mc:art-ulven-q1', 'mc:art-ulven-q2', 'mc:art-ulven-q3'];
  rec('persist: SRS items stored under namespace srs:laeseforstaaelse as mc:<question-id> (= laeseforstaaelse:mc:art-ulven-q1..3), no indices', want3.every(k => keys.includes(k)) && keys.length === 3 && keys.every(k => /^mc:art-ulven-q\d$/.test(k)), keys.join(','));
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('srs:laeseforstaaelse')).items);
  await reload(page);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('srs:laeseforstaaelse')).items);
  rec('persist: SRS state (box/dueAt) survives reload', JSON.stringify(before) === JSON.stringify(after) && after['mc:art-ulven-q2'].box === 1 && after['mc:art-ulven-q1'].box === 2, JSON.stringify(Object.fromEntries(Object.entries(after).map(([k, v]) => [k, v.box]))));
  const lk = await lsKeys(page);
  rec('persist: no index-based keys among all localStorage keys', lk.every(k => !/(^|:)\d+$/.test(k)), lk.join(','));
  // scroll position
  await play(page);
  await page.evaluate(() => { document.getElementById('lf-reader').scrollTop = 1100; }); await sleep(500);
  const st1 = await page.evaluate(() => ({ top: Math.round(document.getElementById('lf-reader').scrollTop), saved: JSON.parse(localStorage.getItem('laeseforstaaelse:scroll:art-ulven')) }));
  await reload(page); await play(page); await sleep(250);
  const st2 = await page.evaluate(() => Math.round(document.getElementById('lf-reader').scrollTop));
  rec('persist: reader scroll position survives reload', Math.abs(st2 - st1.top) <= 3 && st1.top > 500, `before=${st1.top} saved=${JSON.stringify(st1.saved)} after=${st2}`);
  // unfinished answers (plan decision 10) - recorded as NOTE, not asserted
  await clickOpt(page, 1); await sleep(300); await reload(page); await play(page);
  note('mid-round answers after reload (plan decision 10: unfinished answers saved per text)', 'on ' + (await qnum(page)));
  rec('persist: console clean', issues.length === 0, issues.join(' | '));
  await page.close();
  // localStorage throwing
  const t = await open('1440x900', { init: THROW_LS });
  await play(t.page);
  await answerRound(t.page, [true, false, true]);
  const sm = await t.page.$eval('#lf-q', n => n.innerText);
  await t.page.click('#btn-paper'); await t.page.click('#btn-fs-up');
  rec('persist: localStorage throwing → boot, full round, reader controls all work, no errors', /Point: 2/.test(sm) && t.issues.length === 0, t.issues.join(' | ') + ' / ' + sm.replace(/\s+/g, ' '));
  await t.page.close();
}

// ============ keyboard
if (want('kbd')) {
  const { page, issues } = await open('1440x900');
  await play(page);
  // Tab order on play screen
  await page.evaluate(() => document.activeElement && document.activeElement.blur()); await page.mouse.click(5, 5);
  const visited = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return null;
      const cs = getComputedStyle(el); const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2);
      return { k: (el.id || el.tagName.toLowerCase() + ':' + el.textContent.trim().slice(0, 18)), ring, w: cs.outlineWidth, b: cs.boxShadow !== 'none' };
    });
    if (!r) continue;
    if (visited.length && visited[0].k === r.k) break;
    visited.push(r);
  }
  const focusable = await page.evaluate(() => [...document.querySelectorAll('button, a[href], summary, [tabindex="0"], input, select')].filter(e => { const r = e.getBoundingClientRect(); const closed = e.tagName !== 'SUMMARY' && e.closest('details:not([open])'); return r.width && r.height && !closed && getComputedStyle(e).visibility !== 'hidden' && !e.disabled; }).map(e => e.id || e.tagName.toLowerCase() + ':' + e.textContent.trim().slice(0, 18)));
  note('tab order (play, q1)', visited.map(v => v.k).join(' > '));
  const missed = focusable.filter(f => !visited.some(v => v.k === f));
  rec('kbd: Tab reaches every visible control on the play screen', missed.length === 0, 'missed: ' + missed.join(', ') + ' | focusable=' + focusable.length);
  const noRing = visited.filter(v => !v.ring && !v.b).map(v => v.k);
  rec('kbd: every tabbed control shows a focus ring (outline >=2px)', noRing.length === 0, 'no ring: ' + noRing.join(', '));
  await page.close();

  const p2 = await open('1440x900'); const pg = p2.page;
  await play(pg);
  // number keys
  await pg.keyboard.press('1'); await sleep(1000);
  rec('kbd: number key 1 answers Q1 (correct) and advances', (await qnum(pg)) === 'Spørgsmål 2 af 3', await qnum(pg));
  await pg.keyboard.press('2'); await sleep(900);
  const wr = await pg.evaluate(() => !!document.querySelector('.lf-fb-box') && document.querySelectorAll('.dc-quiz-option.dc-wrong').length === 1);
  rec('kbd: number key 2 answers Q2 (wrong → feedback box)', wr);
  await pg.keyboard.press('3'); await sleep(300);
  const still = await qnum(pg);
  rec('kbd: number key after answering does not re-answer', still === 'Spørgsmål 2 af 3' && (await srsKeys(pg)).length === 2, still + ' ' + (await srsKeys(pg)).join(','));
  // Escape: highlight
  const hl0 = await pg.$$eval('.lf-evidence', e => e.length); await pg.keyboard.press('Escape');
  const hl1 = await pg.$$eval('.lf-evidence', e => e.length);
  rec('kbd: Escape clears the evidence highlight', hl0 === 1 && hl1 === 0, `${hl0}→${hl1}`);
  // Escape: details
  await pg.evaluate(() => document.querySelector('.lf-foot details').setAttribute('open', '')); await pg.keyboard.press('Escape');
  rec('kbd: Escape closes the Kilder details', !(await pg.$eval('.lf-foot details', d => d.open)));
  // arrows
  await pg.evaluate(() => { const r = document.getElementById('lf-reader'); r.scrollTop = 0; r.focus(); window.__pd = []; window.addEventListener('keydown', e => window.__pd.push(e.key + ':' + e.defaultPrevented)); });
  const seq = [['ArrowDown', 0, 1], ['PageDown', 0, 1], ['Space', 0, 1], ['ArrowUp', 400, -1], ['PageUp', 800, -1]];
  const tops = [];
  for (const [k, start, dir] of seq) {
    await pg.evaluate(t => { const r = document.getElementById('lf-reader'); r.scrollTop = t; r.focus(); }, start); await sleep(150);
    await pg.keyboard.press(k); await sleep(800); // native key scrolling is animated
    const t = await pg.$eval('#lf-reader', r => Math.round(r.scrollTop)); tops.push(`${k}:${start}→${t}`);
    if (!((t - start) * dir > 0)) tops.push('NOMOVE');
  }
  const pd = await pg.evaluate(() => window.__pd);
  note('arrow/page/space scroll', tops.join(' ')); note('defaultPrevented per key', pd.join(' '));
  rec('kbd: ArrowDown/ArrowUp/PageDown/PageUp/Space are not captured (defaultPrevented false) and scroll the focused reading pane natively', pd.length >= 5 && pd.every(x => x.endsWith(':false')) && !tops.includes('NOMOVE'), tops.join(' ') + ' | ' + pd.join(' '));
  // J / K
  const q0 = await qnum(pg);
  await pg.keyboard.press('k'); await sleep(250); const qk = await qnum(pg);
  await pg.keyboard.press('j'); await sleep(250); const qj = await qnum(pg);
  note('J/K as implemented', `start ${q0}; K → ${qk}; J → ${qj}`);
  rec('kbd: K moves to the next question and J back to the previous (implementation: J=previous, K=next; plan decision 9 lists "J / K = next/previous")', qk === 'Spørgsmål 3 af 3' && qj === 'Spørgsmål 2 af 3', `K: ${q0}→${qk}, J: ${qk}→${qj}`);
  // btn-prev / next aria-disabled behaviour
  await pg.close();

  // stale mc keydown listener after navigating away from an unanswered question
  const p3 = await open('1440x900'); const g3 = p3.page; await play(g3);
  await g3.keyboard.press('k'); await sleep(200); const a1 = await qnum(g3);
  await g3.keyboard.press('j'); await sleep(200); const a2 = await qnum(g3);
  await g3.keyboard.press('1'); await sleep(1000);
  const ks = await srsKeys(g3);
  rec('kbd: J/K navigation over unanswered questions then key 1 records exactly one answer, no errors', ks.length === 1 && p3.issues.length === 0, `nav ${a1} / ${a2}; srs=${ks.join(',')}; issues=${p3.issues.join('|')}`);
  await g3.close();
  rec('kbd: console clean', issues.length === 0 && p2.issues.length === 0, issues.concat(p2.issues).join(' | '));
}

// ============ layout, six viewports
if (want('layout')) {
  for (const vp of Object.keys(VPS)) {
    const { page, issues } = await open(vp);
    const [W, H] = [VPS[vp].width, VPS[vp].height];
    rec(`layout ${vp}: start screen no h-overflow, page no scroll`, !(await hasHorizontalOverflow(page)) && (await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)));
    await shot(page, vp, 'start');
    await play(page);
    await page.evaluate(contrastFn);
    const m = await page.evaluate(() => {
      const rd = document.getElementById('lf-reader'), pn = document.getElementById('lf-panel'), tx = document.getElementById('lf-text');
      const rr = rd.getBoundingClientRect(), pr = pn.getBoundingClientRect();
      const lines = p => { const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); const map = new Map(); let n; while ((n = w.nextNode())) for (let i = 0; i < n.length; i++) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1); const b = r.getClientRects()[0]; if (!b || !b.width) continue; const k = Math.round(b.top); map.set(k, (map.get(k) || 0) + 1); } const a = [...map.values()]; const full = a.slice(0, -1); return { lines: a.length, max: Math.max(...a), medianFull: full.sort((x, y) => x - y)[Math.floor(full.length / 2)] || a[0] }; };
      const ps = [...tx.querySelectorAll('p[data-par]')];
      const longest = ps.reduce((a, b) => (b.textContent.length > a.textContent.length ? b : a));
      const c = lines(longest);
      const allMax = Math.max(...ps.map(p => lines(p).max));
      rd.scrollTo(0, 0); const before = rd.scrollTop; rd.scrollTo(0, 1e6); const end = rd.scrollTop;
      const last = ps[ps.length - 1].getBoundingClientRect(); const rr2 = rd.getBoundingClientRect(); const pr2 = pn.getBoundingClientRect();
      const sideBySide = pr2.left >= rr2.right - 1;
      rd.scrollTo(0, 0);
      return {
        docScroll: [document.documentElement.scrollHeight, innerHeight, document.body.scrollHeight], hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        reader: { sh: rd.scrollHeight, ch: rd.clientHeight, moved: end - before, overscroll: getComputedStyle(rd).overscrollBehaviorY, ofy: getComputedStyle(rd).overflowY },
        panel: { sh: pn.scrollHeight, ch: pn.clientHeight, h: Math.round(pr.height), w: Math.round(pr.width), overscroll: getComputedStyle(pn).overscrollBehaviorY, ofy: getComputedStyle(pn).overflowY },
        sideBySide, below: pr2.top >= rr2.bottom - 1,
        lastBottomVsReader: Math.round(rr2.bottom - last.bottom), lastBottomVsPanelTop: Math.round(pr2.top - last.bottom),
        textW: Math.round(tx.getBoundingClientRect().width), readerW: Math.round(rr.width), readerH: Math.round(rr.height), fs: getComputedStyle(tx).fontSize,
        cpl: c, cplMaxAll: allMax,
      };
    });
    metrics[vp] = { readerShare: +(m.readerH / H).toFixed(2), panelShare: +(m.panel.h / H).toFixed(2), cplMax: m.cplMaxAll, cplMedian: m.cpl.medianFull, readerH: m.readerH, panelH: m.panel.h, textW: m.textW, layout: m.sideBySide ? 'side-by-side' : 'stacked' };
    note(`metrics ${vp}`, metrics[vp]);
    const wantSide = W >= 1024;
    rec(`layout ${vp}: page does not scroll (scrollHeight<=innerHeight)`, m.docScroll[0] <= m.docScroll[1] && m.docScroll[2] <= m.docScroll[1], JSON.stringify(m.docScroll));
    rec(`layout ${vp}: reading pane scrolls (scrollHeight>clientHeight, scrollTo moves it)`, m.reader.sh > m.reader.ch && m.reader.moved > 100, JSON.stringify(m.reader));
    rec(`layout ${vp}: no horizontal overflow (play screen)`, !m.hOverflow);
    rec(`layout ${vp}: panel is ${wantSide ? 'right of' : 'below'} the text`, wantSide ? m.sideBySide : (m.below && !m.sideBySide), `side=${m.sideBySide} below=${m.below}`);
    rec(`layout ${vp}: both panes overflow-y auto + overscroll-behavior contain`, m.reader.ofy === 'auto' && m.panel.ofy === 'auto' && m.reader.overscroll === 'contain' && m.panel.overscroll === 'contain', `${m.reader.ofy}/${m.reader.overscroll} ${m.panel.ofy}/${m.panel.overscroll}`);
    rec(`layout ${vp}: last paragraph bottom above question panel top / inside reader after scrolling to end`, m.lastBottomVsReader >= 0 && (m.sideBySide || m.lastBottomVsPanelTop >= 0), `reader gap ${m.lastBottomVsReader}px, panel gap ${m.lastBottomVsPanelTop}px`);
    rec(`layout ${vp}: <=75 characters per line (max over all paragraphs ${m.cplMaxAll}, median full line ${m.cpl.medianFull})`, m.cplMaxAll <= 75, JSON.stringify(m.cpl));
    const small = await smallTapTargets(page); rec(`layout ${vp}: play-screen tap targets >=44px`, small.length === 0, small.join('; '));
    await shot(page, vp, 'play');
    // wheel isolation (after a wrong answer, panel is at its fullest)
    const qs = await page.evaluate(() => window.LAESE_DATA.byId('art-ulven').questions.map(q => q.correct));
    await clickOpt(page, (qs[0] + 1) % 3); await sleep(1300);
    await shot(page, vp, 'wrong');
    const small2 = await smallTapTargets(page); rec(`layout ${vp}: wrong-answer-state tap targets >=44px`, small2.length === 0, small2.join('; '));
    rec(`layout ${vp}: wrong-answer-state no h-overflow, page no scroll`, !(await hasHorizontalOverflow(page)) && (await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)));
    await page.evaluate(() => { document.getElementById('lf-reader').scrollTop = 300; document.getElementById('lf-panel').scrollTop = 0; });
    const box = async id => page.$eval(id, e => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 80) }; });
    const pb = await box('#lf-panel'); await page.mouse.move(pb.x, pb.y);
    for (let i = 0; i < 4; i++) await page.mouse.wheel({ deltaY: 400 });
    await sleep(300);
    const w1 = await page.evaluate(() => ({ r: Math.round(document.getElementById('lf-reader').scrollTop), p: Math.round(document.getElementById('lf-panel').scrollTop), pScrollable: document.getElementById('lf-panel').scrollHeight > document.getElementById('lf-panel').clientHeight }));
    const rb = await box('#lf-reader'); await page.mouse.move(rb.x, rb.y);
    const pBefore = w1.p;
    for (let i = 0; i < 2; i++) await page.mouse.wheel({ deltaY: 300 });
    await sleep(300);
    const w2 = await page.evaluate(() => ({ r: Math.round(document.getElementById('lf-reader').scrollTop), p: Math.round(document.getElementById('lf-panel').scrollTop) }));
    rec(`layout ${vp}: wheel over question pane does not move reading pane (panel scrollable: ${w1.pScrollable})`, w1.r === 300, JSON.stringify(w1));
    rec(`layout ${vp}: wheel over reading pane scrolls it and does not move question pane`, w2.r > 300 && w2.p === pBefore, JSON.stringify(w2));
    // Kilder links 44px
    await page.evaluate(() => { document.querySelector('.lf-foot details').setAttribute('open', ''); document.getElementById('lf-reader').scrollTo(0, 1e6); }); await sleep(250);
    const small3 = await smallTapTargets(page); rec(`layout ${vp}: tap targets >=44px with Kilder open`, small3.length === 0, small3.join('; '));
    rec(`layout ${vp}: no h-overflow with Kilder open (long URLs wrap)`, !(await hasHorizontalOverflow(page)) && await page.evaluate(() => document.getElementById('lf-reader').scrollWidth <= document.getElementById('lf-reader').clientWidth));
    await shot(page, vp, 'kilder');
    // summary at this viewport
    await page.evaluate(() => document.querySelector('.lf-foot details').removeAttribute('open'));
    await page.click('#btn-continue'); await sleep(200);
    await clickOpt(page, qs[1]); await sleep(1000); await clickOpt(page, qs[2]); await sleep(1000);
    const onSummary = await page.$eval('#lf-q', n => !!n.querySelector('.dc-summary'));
    rec(`layout ${vp}: round completes to summary`, onSummary);
    await shot(page, vp, 'summary');
    const small4 = await smallTapTargets(page); rec(`layout ${vp}: summary tap targets >=44px`, small4.length === 0, small4.join('; '));
    rec(`layout ${vp}: console clean`, issues.length === 0, issues.join(' | '));
    await page.close();
  }
  fs.writeFileSync(path.join(OUT, 'laese-metrics.json'), JSON.stringify(metrics, null, 2));
}

// ============ reader controls
if (want('reader')) {
  const { page, issues } = await open('1440x900', { scheme: 'light' });
  await play(page);
  const fsz = () => page.evaluate(() => ({ px: getComputedStyle(document.getElementById('lf-text')).fontSize, paper: document.documentElement.dataset.paper }));
  const f0 = await fsz();
  await page.click('#btn-fs-up'); const f1 = await fsz(); await page.click('#btn-fs-up'); const f2 = await fsz();
  await page.click('#btn-fs-down'); await page.click('#btn-fs-down'); const f3 = await fsz(); await page.click('#btn-fs-down'); const f4 = await fsz();
  note('A+/A− sizes', [f0, f1, f2, f3, f4].map(x => x.px).join(' → '));
  rec('reader: A+ / A− step 19 → 22 → (clamped) / 19 → 17 → (clamped)', f0.px === '19px' && f1.px === '22px' && f2.px === '22px' && f3.px === '17px' && f4.px === '17px', [f0, f1, f2, f3, f4].map(x => x.px).join(','));
  await page.click('#btn-fs-up'); await page.click('#btn-fs-up'); // → 22
  const papers = [(await fsz()).paper]; for (let i = 0; i < 3; i++) { await page.click('#btn-paper'); papers.push((await fsz()).paper); }
  rec('reader: paper switch cycles light → sepia → dark → light via data-paper', papers.join('>') === 'light>sepia>dark>light', papers.join('>'));
  await page.click('#btn-paper'); // sepia
  const lbl = await page.$eval('#btn-paper', b => b.textContent + ' | ' + b.getAttribute('aria-label'));
  await reload(page);
  const afterFs = await fsz();
  await play(page);
  const afterFs2 = await fsz();
  rec('reader: text size (22px) and paper (sepia) survive reload (also applied before first paint)', afterFs.paper === 'sepia' && afterFs2.px === '22px' && afterFs2.paper === 'sepia', `${lbl} → ${afterFs.paper}/${afterFs2.px}`);
  rec('reader: stored under laeseforstaaelse:reader', await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('laeseforstaaelse:reader')))) === '{"fs":22,"paper":"sepia"}');
  // rotate
  await page.close();
  const r = await open('1024x768'); const g = r.page; await play(g);
  const topPar = () => g.evaluate(() => { const rd = document.getElementById('lf-reader'); const pt = rd.getBoundingClientRect().top; const ps = [...document.querySelectorAll('#lf-text p[data-par]')]; for (const p of ps) { const b = p.getBoundingClientRect(); if (b.bottom > pt + 4) return { par: +p.dataset.par, off: Math.round(pt - b.top), top: Math.round(rd.scrollTop), w: Math.round(rd.clientWidth) }; } return null; });
  await g.evaluate(() => { document.getElementById('lf-reader').scrollTop = 1400; }); await sleep(400);
  const a = await topPar();
  await g.setViewport({ width: 768, height: 1024 }); await sleep(800);
  const b = await topPar();
  const lay = await g.evaluate(() => { const rr = document.getElementById('lf-reader').getBoundingClientRect(), pr = document.getElementById('lf-panel').getBoundingClientRect(); return pr.left >= rr.right - 1 ? 'side' : 'stacked'; });
  await g.setViewport({ width: 1024, height: 768 }); await sleep(800);
  const c = await topPar();
  note('rotate anchor', { landscape: a, portrait: b, portraitLayout: lay, back: c });
  rec('reader: rotate 1024x768 → 768x1024 keeps the same top paragraph (stacked layout after rotation)', a.par === b.par && lay === 'stacked' && Math.abs(a.off - b.off) <= 40, `par ${a.par}→${b.par} off ${a.off}→${b.off}, layout ${lay}`);
  rec('reader: rotating back keeps the same top paragraph', a.par === c.par, `par ${a.par}→${c.par} off ${a.off}→${c.off}`);
  rec('reader: console clean', issues.length === 0 && r.issues.length === 0, issues.concat(r.issues).join(' | '));
  await g.close();
}

// ============ themes, motion, sound
if (want('theme')) {
  const cs = async (page, label) => {
    await page.evaluate(contrastFn);
    return page.evaluate(() => {
      const bg = el => window.__bgOf(el);
      const out = {};
      const body = [...document.querySelectorAll('#lf-text p[data-par]')].find(p => !p.classList.contains('lf-evidence')); out.body = window.__ratio(window.__parse(getComputedStyle(body).color), bg(body));
      const num = getComputedStyle(body, '::before'); out.marginNumber = window.__ratio(window.__parse(num.color), bg(body));
      const ev = document.querySelector('p.lf-evidence'); if (ev) { const evbg = window.__parse(getComputedStyle(ev).backgroundColor); out.evidenceBody = window.__ratio(window.__parse(getComputedStyle(ev).color), evbg); const inside = getComputedStyle(ev, '::before').position !== 'absolute'; out.evidenceNumber = window.__ratio(window.__parse(getComputedStyle(ev, '::before').color), inside ? evbg : bg(ev.parentElement)); }
      const k = document.querySelector('.lf-kicker'); out.kicker = window.__ratio(window.__parse(getComputedStyle(k).color), bg(k));
      const pr = document.querySelector('.dc-quiz-prompt'); if (pr) out.prompt = window.__ratio(window.__parse(getComputedStyle(pr).color), bg(pr));
      const opt = document.querySelector('.dc-quiz-option'); if (opt) out.option = window.__ratio(window.__parse(getComputedStyle(opt).color), window.__parse(getComputedStyle(opt).backgroundColor));
      const fb = document.querySelector('.lf-fb-box'); if (fb) { const fbBg = (() => { const c = window.__parse(getComputedStyle(fb).backgroundColor); const base = window.__bgOf(fb.parentElement); const a = c[3] === undefined ? 1 : c[3]; return [0, 1, 2].map(i => Math.round(c[i] * a + base[i] * (1 - a))); })(); out.feedback = window.__ratio(window.__parse(getComputedStyle(fb).color), fbBg); }
      const ft = document.querySelector('.lf-foot p'); out.footer = window.__ratio(window.__parse(getComputedStyle(ft).color), bg(ft));
      const btn = document.getElementById('btn-paper'); out.button = window.__ratio(window.__parse(getComputedStyle(btn).color), window.__parse(getComputedStyle(btn).backgroundColor));
      return out;
    });
  };
  const checkPaper = async (page, paper, vp) => {
    await sleep(600); // shared base styles transition colours; measure after they settle
    const r = await cs(page, paper);
    const low = Object.entries(r).filter(([, v]) => v < 4.5).map(([k, v]) => k + '=' + v.toFixed(2));
    rec(`theme ${paper} @${vp}: contrast >=4.5 (${Object.entries(r).map(([k, v]) => k + ' ' + v.toFixed(1)).join(', ')})`, low.length === 0, low.join(', '));
  };
  for (const vp of ['1440x900', '360x640']) {
    const { page, issues } = await open(vp, { scheme: 'dark' });
    const initial = await page.evaluate(() => document.documentElement.dataset.paper);
    if (vp === '1440x900') rec('theme: prefers-color-scheme dark with no saved prefs → data-paper=dark', initial === 'dark', initial);
    await play(page);
    const qs = await page.evaluate(() => window.LAESE_DATA.byId('art-ulven').questions.map(q => q.correct));
    await clickOpt(page, (qs[0] + 1) % 3); await sleep(1300);
    await checkPaper(page, 'dark(OS)', vp);
    if (vp === '1440x900') await shot(page, vp, 'dark-wrong');
    for (const want of ['light', 'sepia', 'dark']) {
      for (let i = 0; i < 3 && (await page.evaluate(() => document.documentElement.dataset.paper)) !== want; i++) await page.click('#btn-paper');
      await checkPaper(page, want, vp);
      if (vp === '1440x900') await shot(page, vp, 'paper-' + want);
    }
    for (const want of ['dark', 'sepia', 'light']) {
      for (let i = 0; i < 3 && (await page.evaluate(() => document.documentElement.dataset.paper)) !== want; i++) await page.click('#btn-paper');
      await sleep(600);
      const lc = await lowContrast(page);
      rec(`theme ${want} @${vp}: harness lowContrast (every text element) clean`, lc.length === 0, lc.join('; '));
    }
    rec(`theme @${vp}: console clean`, issues.length === 0, issues.join(' | '));
    await page.close();
  }
  // long words / æøå
  { const { page } = await open('360x640'); await play(page);
    const g = await page.evaluate(() => { const t = document.getElementById('lf-text'); return { aeoa: /[æøå]/.test(t.textContent) && /Læseforståelse|ulveangreb/.test(document.title + t.textContent), h: document.getElementById('lf-reader').scrollWidth <= document.getElementById('lf-reader').clientWidth, font: getComputedStyle(t).fontFamily.slice(0, 40) }; });
    rec('theme: æøå present in rendered text; reader has no horizontal overflow at 360', g.aeoa && g.h, JSON.stringify(g));
    await page.close(); }
  // reduced motion
  { const { page, issues } = await open('1440x900', { reduced: true }); await play(page);
    const qs = await page.evaluate(() => window.LAESE_DATA.byId('art-ulven').questions.map(q => q.correct));
    await clickOpt(page, qs[0]); await sleep(120);
    const anim = await page.evaluate(() => ({ host: getComputedStyle(document.getElementById('lf-q')).animationName, dur: getComputedStyle(document.getElementById('lf-q')).animationDuration }));
    await sleep(900); await clickOpt(page, (qs[1] + 1) % 3); await sleep(900);
    const st = await page.evaluate(() => window.__st);
    const sb = await page.evaluate(() => getComputedStyle(document.getElementById('lf-reader')).scrollBehavior);
    note('reduced-motion scrollTo calls', st); note('flash animation', anim);
    const ok = st.length >= 1 && st.every(s => s.behavior === 'auto');
    rec('motion: prefers-reduced-motion → evidence scroll uses behavior "auto"; css scroll-behavior auto; no flash animation', ok && sb === 'auto' && anim.host === 'none', `scrollTo=${JSON.stringify(st)} css=${sb} anim=${anim.host}`);
    const full = await page.evaluate(() => !!document.querySelector('.lf-fb-box'));
    rec('motion: reduced-motion still fully functional (feedback box shown)', full && issues.length === 0, issues.join(' | '));
    await page.close();
    const c = await open('1440x900'); await play(c.page);
    const qs2 = await c.page.evaluate(() => window.LAESE_DATA.byId('art-ulven').questions.map(q => q.correct));
    await clickOpt(c.page, (qs2[0] + 1) % 3); await sleep(900);
    const st2 = await c.page.evaluate(() => window.__st);
    rec('motion: control (no reduced-motion) uses smooth scrolling', st2.length >= 1 && st2.some(s => s.behavior === 'smooth'), JSON.stringify(st2));
    await c.page.close(); }
  // muted
  { const un = await open('1440x900'); await play(un.page);
    await answerRound(un.page, [true, false, true]);
    const oscOn = await un.page.evaluate(() => window.__osc);
    await un.page.close();
    const mu = await open('1440x900'); await mu.page.click('#btn-sound');
    const lbl = await mu.page.$eval('#btn-sound', b => b.textContent);
    await play(mu.page); await answerRound(mu.page, [true, false, true]);
    const oscOff = await mu.page.evaluate(() => window.__osc);
    await reload(mu.page); const lbl2 = await mu.page.$eval('#btn-sound', b => b.textContent);
    rec('sound: unmuted round creates audio nodes (control), muted round creates none, mute survives reload', oscOn > 0 && oscOff === 0 && lbl === 'Lyd fra' && lbl2 === 'Lyd fra', `unmuted=${oscOn} muted=${oscOff} label=${lbl}/${lbl2}`);
    await mu.page.close(); }
}

// ============ content structure (automatic part; the factual audit is manual)
if (want('content')) {
  const { page, issues } = await open('1440x900'); await play(page);
  const c = await page.evaluate(() => {
    const t = window.LAESE_DATA.byId('art-ulven');
    const foot = document.querySelector('.lf-foot'), last = document.querySelector('#lf-text p[data-par="8"]');
    const links = [...document.querySelectorAll('.lf-foot details a')].map(a => a.getAttribute('href'));
    return {
      pars: document.querySelectorAll('#lf-text p[data-par]').length, nPars: t.paragraphs.length,
      footText: foot.querySelector('p').textContent, footBelow: foot.getBoundingClientRect().top >= last.getBoundingClientRect().bottom - 1 || foot.offsetTop > last.offsetTop,
      links, sources: t.sources, targets: [...document.querySelectorAll('.lf-foot details a')].map(a => a.target + '/' + a.rel), summary: document.querySelector('.lf-foot summary').textContent,
      qs: t.questions.map(q => ({ id: q.id, n: q.options.length, c: q.correct, e: q.evidence, uniq: new Set(q.options).size })),
      text: t.paragraphs.join(' '),
    };
  });
  rec('content: 8 paragraphs rendered with data-par 1..8', c.pars === c.nPars && c.pars === 8, c.pars);
  rec('content: footer text exact and rendered under the text', c.footText === FOOTER && c.footBelow, c.footText);
  rec('content: Kilder lists every URL of sources (' + c.sources.length + ') in order, opens safely', JSON.stringify(c.links) === JSON.stringify(c.sources) && c.summary === 'Kilder' && c.targets.every(x => x === '_blank/noopener noreferrer'), `${c.links.length}/${c.sources.length}`);
  rec('content: each question has 3 distinct options, correct and evidence in range', c.qs.every(q => q.n === 3 && q.uniq === 3 && q.c >= 0 && q.c < 3 && q.e >= 0 && q.e < c.pars), JSON.stringify(c.qs));
  const nums = [...new Set(c.text.match(/\d[\d.,]*/g))];
  note('numerals in article', nums.join(' '));
  const ALLOWED = ['2023', '2024', '2025', '2026', '57', '91', '239', '1.239', '32', '1.285', '36', '35', '80'];
  const stray = nums.map(n => n.replace(/[.,]$/, '')).filter(n => !ALLOWED.includes(n));
  rec('content: every digit token in the article is on the fact-sheet allow-list (' + ALLOWED.join(' ') + ')', stray.length === 0, 'stray: ' + stray.join(' '));
  rec('content: console clean', issues.length === 0, issues.join(' | '));
  await page.close();
}

await browser.close();
const fails = results.filter(r => r.ok === false), nv = results.filter(r => r.ok === null);
console.log(`\nSUMMARY ${results.length - fails.length - nv.length} pass, ${fails.length} fail, ${nv.length} not verified`);
fails.forEach(f => console.log('  FAIL ' + f.name));
fs.writeFileSync(path.join(OUT, 'laese-results.json'), JSON.stringify(results, null, 1));
process.exit(fails.length ? 1 : 0);
