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
  window.__cur = () => { const h = document.querySelector('#lf-text h1, #lf-text h2'); const D = window.LAESE_DATA; const all = [].concat(D.skim, D.mc, D.insert, D.cloze); return all.find(t => h && t.title === h.textContent) || null; };
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
// Spil rotates through the texts of the chosen mode (last played id is remembered): loop until the wanted text is open
const playText = async (page, id) => { for (let i = 0; i < 4; i++) { await play(page); if ((await page.evaluate(() => window.__cur() && window.__cur().id)) === id) return; await page.click('#btn-menu'); await sleep(200); } throw new Error('could not open ' + id); };
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
    const ans = await page.evaluate(() => window.__cur().questions.map(q => q.correct));
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
  document.querySelectorAll('#lf-q .dc-quiz-option')[window.__cur().questions[cur].correct].click();
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
    const r = run(dv, ['--dir=' + ROOT, '--expect=2,3,2,0']);
    rec('data: laeseforstaaelse-data.mjs --expect=2,3,2,0 exits 0', r.code === 0, 'exit ' + r.code + ' ' + r.out.trim().split('\n').slice(-2).join(' / '));
  } else rec('data: laeseforstaaelse-data.mjs --expect=2,3,2,0 exits 0', null, 'validator not present in ' + REPO + '/tests (run it in the tested worktree)');
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
  await clickOpt(page, ((await page.evaluate(() => window.__cur().questions[0].correct)) + 1) % 3); await sleep(700);
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
  await playText(page, "art-ulven");
  await page.evaluate(() => { document.getElementById('lf-reader').scrollTop = 1100; }); await sleep(500);
  const st1 = await page.evaluate(() => ({ top: Math.round(document.getElementById('lf-reader').scrollTop), saved: JSON.parse(localStorage.getItem('laeseforstaaelse:scroll:art-ulven')) }));
  await reload(page); await playText(page, 'art-ulven'); await sleep(250);
  const st2 = await page.evaluate(() => Math.round(document.getElementById('lf-reader').scrollTop));
  rec('persist: reader scroll position survives reload', Math.abs(st2 - st1.top) <= 3 && st1.top > 500, `before=${st1.top} saved=${JSON.stringify(st1.saved)} after=${st2}`);
  // unfinished answers (plan decision 10) - recorded as NOTE, not asserted
  await clickOpt(page, 1); await sleep(300); await reload(page); await playText(page, 'art-ulven');
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
    const qs = await page.evaluate(() => window.__cur().questions.map(q => q.correct));
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
    const qs = await page.evaluate(() => window.__cur().questions.map(q => q.correct));
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
    const qs = await page.evaluate(() => window.__cur().questions.map(q => q.correct));
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
    const qs2 = await c.page.evaluate(() => window.__cur().questions.map(q => q.correct));
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

// ============ retest extras: margin numbers, advance timing over fresh loads, font fallback measure, no-audio boot
if (want('retest')) {
  const cplFn = () => { const lines = p => { const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); const map = new Map(); let n; while ((n = w.nextNode())) for (let i = 0; i < n.length; i++) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1); const b = r.getClientRects()[0]; if (!b || !b.width) continue; const k = Math.round(b.top); map.set(k, (map.get(k) || 0) + 1); } return [...map.values()]; };
    const all = [...document.querySelectorAll('#lf-text p[data-par]')].map(lines); const full = all.flatMap(a => a.slice(0, -1)).sort((x, y) => x - y); return { median: full[Math.floor(full.length / 2)], max: Math.max(...all.flat()) }; };
  for (const vp of Object.keys(VPS)) {
    const { page } = await open(vp); await play(page);
    const m = await page.evaluate(cplFn);
    const g = await page.evaluate(() => {
      const rd = document.getElementById('lf-reader'), tx = document.getElementById('lf-text'), p = tx.querySelector('p[data-par]');
      const cs = getComputedStyle(p, '::before'); const sp = document.createElement('span'); sp.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${cs.font}`; sp.textContent = '¶8'; document.body.appendChild(sp);
      const w = sp.getBoundingClientRect().width; sp.remove();
      const stacked = cs.position !== 'absolute';
      const gap = tx.getBoundingClientRect().left - rd.getBoundingClientRect().left;
      return { stacked, numW: Math.round(w), gap: Math.round(gap), need: Math.round(w + 8), display: cs.display, content: cs.content };
    });
    note(`retest cpl ${vp}`, { ...m, ...g });
    rec(`retest ${vp}: chars/line median ${m.median} max ${m.max} (<=75; 60-75 median at wide widths)`, m.max <= 75 || vp === '360x640', JSON.stringify(m));
    rec(`retest ${vp}: margin number ¶N has room (${g.stacked ? 'stacked, inline block' : 'gap ' + g.gap + 'px >= ' + g.need + 'px'}) and is not clipped by reader`, g.stacked || g.gap >= g.need, JSON.stringify(g));
    if (VPS[vp].width >= 1024 && VPS[vp].width < 1300 || vp === '1440x900') {
      await page.addStyleTag({ content: '.lf-text{font-family:"Times New Roman",serif !important}' }); await sleep(200);
      const t = await page.evaluate(cplFn); note(`retest Times New Roman ${vp}`, t);
      rec(`retest ${vp}: Times New Roman fallback chars/line <= 80 (info)`, t.max <= 80, JSON.stringify(t));
    }
    if (SHOTS) { await page.evaluate(() => { document.getElementById('lf-reader').scrollTop = 120; }); await sleep(200); await shot(page, vp, 'retest-margin'); }
    await page.close();
  }
  for (const muted of [false, true]) {
    const times = [];
    for (let i = 0; i < 6; i++) {
      const { page } = await open('1440x900');
      if (muted) await page.click('#btn-sound');
      await play(page);
      const t1 = await advTime(page); await sleep(200); const t2 = await advTime(page); await sleep(200);
      times.push([t1, t2]); await page.close();
    }
    const flat = times.flat();
    rec(`retest advance ${muted ? 'muted' : 'unmuted'}: first and second correct answers 700-900 ms over 6 fresh loads`, flat.every(x => x >= 700 && x <= 900), JSON.stringify(times));
  }
  { // muted: still 0 audio nodes with AudioContext now built on Spil
    const { page } = await open('1440x900'); await page.click('#btn-sound'); await play(page); await answerRound(page, [true, false, true]);
    const n = await page.evaluate(() => window.__osc); rec('retest sound: muted round makes 0 audio nodes (AudioContext built on Spil)', n === 0, 'osc=' + n); await page.close(); }
  { const { page, issues } = await open('1440x900', { init: () => { delete window.AudioContext; delete window.webkitAudioContext; } });
    await play(page); await answerRound(page, [true, false, true]);
    const ok = await page.$eval('#lf-q', n => /Point: 2/.test(n.innerText));
    rec('retest sound: AudioContext unavailable -> full round works, no console error', ok && issues.length === 0, issues.join(' | ')); await page.close(); }
}

// ===================================================================================================================
// SKIM (hæfte) sections, added for gate laese-gate-2: skimdata, skim, skimjump, skimlayout, skimkbd, skimtheme, mcall
// Run alone: node tests/laeseforstaaelse.mjs --only=skimdata,skim,skimjump,skimlayout,skimkbd,skimtheme,mcall [--shots]
// ===================================================================================================================
const vm = await import('node:vm');
const skimCtx = { }; skimCtx.window = skimCtx; vm.createContext(skimCtx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data-skim.js'), 'utf8'), skimCtx);
const SKIM = skimCtx.LAESE_SKIM || [];
const FOOTER_SKIM = 'Tider, priser og regler i opslagene er øvelsesværdier, ikke rigtige oplysninger.';
const WRONG = 'xyzzy plugh';
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasAnswer = (body, a) => new RegExp('(?<![\\d.,])' + esc(a.toLowerCase().replace(/\s+/g, ' ')) + '(?![\\d]|[.,]\\d)').test(body.toLowerCase().replace(/\s+/g, ' '));

// open a skim booklet (0 = kolonihave, 1 = rebildfest): Spil rotates from the last played id, so seed prefs for the second one
async function openSkim(vp, { haefte = 0, scheme, reduced, init, muted = false } = {}) {
  const o = await open(vp, { scheme, reduced, init });
  if (haefte === 1) {
    await o.page.evaluate(() => localStorage.setItem('laeseforstaaelse:prefs', JSON.stringify({ mode: 'skim', levels: ['B1', 'B2'], last: 'haefte-kolonihave' })));
    await reload(o.page);
  } else await o.page.evaluate(() => document.querySelector('#ctl-mode [data-mode="skim"]').click());
  if (muted) await o.page.click('#btn-sound');
  await play(o.page);
  return o;
}
// type a string and press Svar; returns ms until the question header changes (-1 = never within 3 s) and the input's data-state
const submitMeasured = (page, s, wait = 3000) => page.evaluate((s, wait) => new Promise(res => {
  const i = document.getElementById('lf-input'); i.value = s; i.dispatchEvent(new Event('input', { bubbles: true }));
  const q = document.getElementById('lf-qnum'); const t0 = performance.now(); const before = q.textContent;
  const mo = new MutationObserver(() => { if (q.textContent !== before) { mo.disconnect(); res({ ms: Math.round(performance.now() - t0), state }); } });
  mo.observe(q, { childList: true, characterData: true, subtree: true });
  setTimeout(() => { mo.disconnect(); res({ ms: -1, state }); }, wait);
  document.getElementById('btn-submit').click();
  var state = i.getAttribute('data-state');
}), s, wait);
const skimQ = page => page.evaluate(() => { const t = window.__cur(); const n = +document.getElementById('lf-qnum').textContent.match(/(\d+) af/)[1]; return { id: t.id, i: n - 1, q: t.questions[n - 1] }; });
const sumText = page => page.$eval('#lf-q', n => n.innerText.replace(/\s+/g, ' '));
const sumBtns = page => page.$$eval('#lf-q .dc-summary-actions button', b => b.map(x => x.textContent));
const clickBtn = (page, label) => page.evaluate(l => { const b = [...document.querySelectorAll('#lf-q button')].find(x => x.textContent === l); if (b) b.click(); return !!b; }, label);
// wait until the reading pane stopped scrolling (smooth scroll over a long booklet takes up to ~2 s)
const settle = async (page, max = 5000) => { let last = -1, same = 0; const t0 = Date.now(); while (Date.now() - t0 < max) { const t = await page.$eval('#lf-reader', r => Math.round(r.scrollTop)); if (t === last) { if (++same >= 3) return Date.now() - t0; } else { same = 0; last = t; } await sleep(100); } return Date.now() - t0; };
const geom = page => page.evaluate(() => {
  const rd = document.getElementById('lf-reader').getBoundingClientRect(), nav = document.getElementById('lf-jump').getBoundingClientRect();
  const sec = document.querySelector('section.lf-evidence'); if (!sec) return null;
  const h = sec.querySelector('h2').getBoundingClientRect(), s = sec.getBoundingClientRect();
  return { id: sec.getAttribute('data-notice'), n: document.querySelectorAll('.lf-evidence').length, headTop: Math.round(h.top), navBottom: Math.round(nav.bottom), readerTop: Math.round(rd.top), readerBottom: Math.round(rd.bottom), secTop: Math.round(s.top), secBottom: Math.round(s.bottom), headBelowNav: h.top >= nav.bottom - 1, headInReader: h.bottom <= rd.bottom + 1 };
});

// ============ skimdata: node-level audit of data-skim.js (no browser)
if (want('skimdata')) {
  rec('skimdata: LAESE_SKIM has 2 hæfter, 15 questions each, 8-10 notices, ids unique', SKIM.length === 2 && SKIM.every(t => t.questions.length === 15 && t.notices.length >= 8 && t.notices.length <= 10 && new Set(t.notices.map(n => n.id)).size === t.notices.length && new Set(t.questions.map(q => q.id)).size === 15), SKIM.map(t => t.id + ' ' + t.notices.length + 'n/' + t.questions.length + 'q').join('; '));
  rec('skimdata: every notice body is 1.200-1.800 characters', SKIM.every(t => t.notices.every(n => n.body.length >= 1200 && n.body.length <= 1800)), SKIM.map(t => t.id + ' ' + Math.min(...t.notices.map(n => n.body.length)) + '-' + Math.max(...t.notices.map(n => n.body.length))).join('; '));
  const EXPECTED_SHARED = { 'haefte-rebildfest-q03': 'haefte-rebildfest-n07' }; // "kl. 13.30" also in n07 (buy food before 13.30): different referent, question names the opening
  const bad = [], shared = [], missing = [];
  for (const t of SKIM) for (const q of t.questions) {
    const own = t.notices.find(n => n.id === q.noticeId); if (!own) { missing.push(q.id); continue; }
    if (!hasAnswer(own.body, q.accepted[0])) bad.push(q.id + ' "' + q.accepted[0] + '" not verbatim in ' + q.noticeId);
    const others = t.notices.filter(n => n.id !== q.noticeId && hasAnswer(n.body, q.accepted[0])).map(n => n.id);
    others.forEach(o => shared.push(q.id + '+' + o.slice(-3)));
  }
  rec('skimdata: all 30 accepted[0] answers sit verbatim in the notice named by noticeId (word-boundary match)', bad.length === 0 && missing.length === 0, bad.concat(missing).join(' | ') || '30/30');
  const unexpected = shared.filter(s => !Object.entries(EXPECTED_SHARED).some(([q, n]) => s === q + '+' + n.slice(-3)));
  note('skimdata: accepted[0] string also present in another notice (info)', shared.join(', ') || 'none');
  rec('skimdata: exactly one notice holds each answer string (only the adjudicated exception haefte-rebildfest-q03/n07 allowed)', unexpected.length === 0, 'unexpected: ' + unexpected.join(', '));
  const allVariantsHit = []; // every accepted variant should be readable in some notice or be a pure format variant (info)
  for (const t of SKIM) for (const q of t.questions) for (const v of q.accepted) if (!t.notices.some(n => hasAnswer(n.body, v))) allVariantsHit.push(q.id.slice(-3) + ':' + v);
  note('skimdata: accepted[] entries not literally in any notice (format variants such as klokken / til / hektar), info', allVariantsHit.join(' | '));
  const phone = [];
  const PH = /tlf|\+45|\b\d{8}\b|\b\d{2} \d{2} \d{2} \d{2}\b|\b\d{4} \d{4}\b|telefon/i;
  for (const t of SKIM) for (const n of t.notices) { const m = n.body.match(PH); if (m) phone.push(n.id + ': ..' + n.body.slice(Math.max(0, m.index - 30), m.index + 40) + '..'); }
  note('skimdata: phone-pattern hits (telefon/tlf/8 digits)', phone.join(' | ') || 'none');
  rec('skimdata: no invented telephone number (no tlf / +45 / 8-digit pattern); only the word "telefonnummer" about the learner own number allowed', SKIM.every(t => t.notices.every(n => !/tlf|\+45|\b\d{8}\b|\b\d{2} \d{2} \d{2} \d{2}\b|\b\d{4} \d{4}\b/i.test(n.body))), phone.join(' | '));
  rec('skimdata: titles say "(eksempel)" and n01 states plainly that the details are invented ("opfundet")', SKIM.every(t => /\(eksempel\)/.test(t.title) && /opfundet|opfundne/.test(t.notices[0].body)), SKIM.map(t => t.title + ' / n01: ' + (t.notices[0].body.match(/[^.]*opfundet[^.]*\./) || [''])[0]).join(' || '));
  rec('skimdata: index.html carries the exercise-value footer line for skim', fs.readFileSync(FILE, 'utf8').includes(FOOTER_SKIM), FOOTER_SKIM);
  const NM = {
    'haefte-kolonihave': { 'opening times': ['tirsdag kl. 17-18', 'torsdag kl. 16-17', 'første lørdag i måneden kl. 10-12'], deadlines: ['10. juni', '1. juli', '1. september', '5 dage før'], prices: ['300 kr.', '350 kr.', '50 kr.', '150 kr.', '400 kr.', '600 kr.'] },
    'haefte-rebildfest': { 'opening times': ['kl. 9-17', 'kl. 10-18', 'kl. 11-17'], deadlines: ['25. juni', '20. juni'], prices: ['120 kr.', '100 kr.', '60 kr.', '45 kr.', '30 kr.'], 'event times': ['kl. 13.30', 'kl. 14.00-16.30', 'kl. 12-14'] },
  };
  for (const t of SKIM) {
    const sum = [];
    for (const [kind, vals] of Object.entries(NM[t.id])) {
      const where = vals.map(v => t.notices.filter(n => hasAnswer(n.body, v)).map(n => n.id.slice(-3)));
      const ok = where.every(w => w.length >= 1) && new Set(where.flat()).size >= 2;
      sum.push(kind + ': ' + vals.map((v, i) => v + '@' + where[i].join('+')).join(' | ') + (ok ? '' : ' MISSING'));
      if (!ok) rec(`skimdata ${t.id}: near-miss set "${kind}" exists across >=2 notices`, false, sum[sum.length - 1]);
    }
    rec(`skimdata ${t.id}: >=3 near-miss sets (opening times, deadlines, prices...) each spread over >=2 notices`, Object.keys(NM[t.id]).length >= 3, sum.join(' || '));
    // for each question: do other notices carry a same-kind value (time / price / date / measure)? info on how many questions are near-miss-guarded
    const KIND = { time: /kl\.? ?\d|klokken/i, price: /\d\s?kr/i, date: /\d+\.? (januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december)/i };
    let guarded = 0; const un = [];
    for (const q of t.questions) {
      const a = q.accepted[0]; const k = Object.entries(KIND).find(([, r]) => r.test(a));
      const g = k ? t.notices.some(n => n.id !== q.noticeId && new RegExp(k[1].source, 'i').test(n.body)) : false;
      if (g) guarded++; else un.push(q.id.slice(-3) + (k ? '[' + k[0] + ']' : '[other]'));
    }
    note(`skimdata ${t.id}: questions whose answer kind (time/price/date) also occurs in another notice`, `${guarded}/15; not guarded: ${un.join(', ')}`);
  }
  rec('skimdata: every notice heading unique and non-empty; questions end with "?"', SKIM.every(t => new Set(t.notices.map(n => n.heading)).size === t.notices.length && t.notices.every(n => n.heading.trim()) && t.questions.every(q => /\?$/.test(q.q))), '');
}

// ============ skim: functional rounds on both booklets
if (want('skim')) {
  { // start screen with skim offered
    const { page, issues, reqs } = await open('1440x900');
    rec('skim boot: file:// 1440x900 console/page errors+warnings and failed requests = 0', issues.length === 0, issues.join(' | '));
    rec('skim boot: every request is file:// (no network)', reqs.every(u => u.startsWith('file://') || u.startsWith('data:')), reqs.filter(u => !u.startsWith('file://')).join(' '));
    const s = await page.evaluate(() => {
      const st = document.getElementById('screen-start');
      return { h1: st.querySelector('h1').textContent, play: document.getElementById('btn-play').textContent,
        modes: [...st.querySelectorAll('#ctl-mode button')].map(b => b.getAttribute('data-mode') + ':' + b.textContent + (b.getAttribute('aria-checked') === 'true' ? '*' : '') + ' [' + Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height) + ']'),
        levels: [...st.querySelectorAll('#ctl-level button')].map(b => b.textContent + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')),
        disclaimer: [...st.querySelectorAll('p')].map(p => p.textContent.trim()).filter(t => t.includes('Prøve i Dansk')) };
    });
    note('start screen', s);
    rec('skim boot: title Læseforståelse, #btn-play "Spil", compact mode control offers skim AND mc, mc is the default, level control, disclaimer line',
      s.h1 === 'Læseforståelse' && s.play === 'Spil' && s.modes.length === 2 && s.modes.some(m => /^skim:/.test(m)) && s.modes.some(m => /^mc:.*\*/.test(m)) && !s.modes.some(m => /^skim:.*\*/.test(m)) && s.levels.length === 2 && s.disclaimer.length === 1 && s.disclaimer[0] === DISCLAIMER, JSON.stringify(s));
    rec('skim boot: mode buttons >=44x44', (await smallTapTargets(page)).length === 0, (await smallTapTargets(page)).join('; '));
    await shot(page, '1440x900', 'skim-start');
    await page.close();
  }
  // unit: every accepted[] entry survives case / trailing punctuation / surrounding whitespace; wrong string rejected; coverage battery
  {
    const { page } = await open('1440x900');
    const res = await page.evaluate(() => {
      const bad = []; let n = 0;
      for (const t of window.LAESE_DATA.skim) for (const q of t.questions) {
        for (const v of q.accepted) for (const f of [x => x, x => x.toUpperCase(), x => x.toLowerCase() + '.', x => ' ' + x + '  ', x => x.charAt(0).toUpperCase() + x.slice(1) + '!']) {
          n++; if (!DanskCore.diff.check(f(v), q.accepted).correct) bad.push(q.id + ':' + f(v));
        }
        if (DanskCore.diff.check('xyzzy plugh', q.accepted).correct || DanskCore.diff.check('', q.accepted).correct) bad.push(q.id + ': wrong/empty accepted');
      }
      return { bad, n };
    });
    rec('skim answers: every accepted[] entry passes DanskCore.diff.check as typed / UPPER / lower+"." / padded / Capitalised+"!" and "xyzzy plugh" or empty is rejected (' + res.n + ' checks)', res.bad.length === 0, res.bad.slice(0, 8).join(' | '));
    // plausible learner answers that are NOT in accepted[] (coverage gaps; info, graded in the report)
    const EXTRA = {
      'haefte-kolonihave-q01': ['tirsdag kl. 17.00-18.00', 'tirsdag fra 17 til 18', 'kl. 17-18', 'hver tirsdag'], 'haefte-kolonihave-q02': ['efter kl 20', 'efter klokken 20.00', 'efter kl. 20.00', 'efter 20.00'],
      'haefte-kolonihave-q03': ['1 oktober', '1. oktober.', 'den 1. oktober'], 'haefte-kolonihave-q04': ['1.5 meter', '1,5 m.', '1,5 meter', '150 cm'], 'haefte-kolonihave-q05': ['12. april', 'lørdag den 12. april', 'lørdag d. 12. april'],
      'haefte-kolonihave-q06': ['300,-', '300 kr', '300 kroner'], 'haefte-kolonihave-q07': ['torsdag kl. 16.00-17.00', 'torsdag 16 til 17', 'kl. 16-17'], 'haefte-kolonihave-q08': ['350,-', '350 kroner', '350 kr'],
      'haefte-kolonihave-q09': ['første lørdag i måneden', 'den første lørdag i hver måned kl. 10-12', 'første lørdag kl. 10-12'], 'haefte-kolonihave-q10': ['senest 10. juni', '10 juni'], 'haefte-kolonihave-q11': ['150 kr. årligt', '150 kroner om året', '150 kr. pr. år'],
      'haefte-kolonihave-q12': ['ca. 6 år', 'cirka 6 år', '6 år', 'omkring 6 år', 'cirka seks år'], 'haefte-kolonihave-q13': ['15. april - 15. oktober', 'fra 15. april til 15. oktober', 'fra den 15. april til den 15. oktober'], 'haefte-kolonihave-q14': ['60 m²', '60 kvm', '60 m2', '60 kvadratmeter'],
      'haefte-kolonihave-q15': ['11. maj 1908', '11 maj 1908', 'den 11. maj 1908', '11/5-1908'],
      'haefte-rebildfest-q01': ['kl 9-17', 'kl. 9.00-17.00', 'kl. 09-17', 'fra 9 til 17', 'kl. 9 - 17'], 'haefte-rebildfest-q02': ['kl. 10.00', 'fredag kl. 10', 'kl 10'], 'haefte-rebildfest-q03': ['kl. 13.30', '13:30', 'klokken 13.30', 'kl 13.30'],
      'haefte-rebildfest-q04': ['kl. 14.00-16.30', '14-16.30', 'kl. 14 til 16.30', 'kl 14.00-16.30', 'fra kl. 14.00 til 16.30'], 'haefte-rebildfest-q05': ['120 kr', '120,-', '120 kroner'], 'haefte-rebildfest-q06': ['25 juni', 'den 25. juni', 'til og med 25. juni'],
      'haefte-rebildfest-q07': ['60 kr. pr. bil', '60 kr', '60,-'], 'haefte-rebildfest-q08': ['kl 10-18', 'kl. 10.00-18.00', 'fra 10 til 18'], 'haefte-rebildfest-q09': ['hvert 20. minut', 'hvert 20 minut', 'hver 20. minut', 'hvert tyvende minut', 'med 20 minutters mellemrum', '20 minutter'],
      'haefte-rebildfest-q10': ['45 kr', '45,-', '45 kroner'], 'haefte-rebildfest-q11': ['kl. 12-14', 'kl 12-14', 'kl. 12.00-14.00', 'fra 12 til 14'], 'haefte-rebildfest-q12': ['20 juni', 'senest 20. juni', 'den 20. juni'],
      'haefte-rebildfest-q13': ['1912', 'i 1912', 'år 1912'], 'haefte-rebildfest-q14': ['80 ha', 'cirka 80 ha', 'ca. 80 hektar', '80 hektar', 'omkring 80 ha'], 'haefte-rebildfest-q15': ['1961', 'i 1961'],
    };
    const gaps = await page.evaluate(EX => { const out = []; for (const t of window.LAESE_DATA.skim) for (const q of t.questions) for (const v of (EX[q.id] || [])) if (!DanskCore.diff.check(v, q.accepted).correct) out.push(q.id.slice(-3) + ' "' + v + '"'); return out; }, EXTRA);
    note('skim answers: plausible learner variants rejected by accepted[] (coverage gaps, minor)', gaps.length + ': ' + gaps.join(' | '));
    metrics.acceptedGaps = gaps;
    rec('skim answers: coverage battery run (' + Object.values(EXTRA).flat().length + ' plausible variants); gaps listed above', true, gaps.length + ' rejected');
    await page.close();
  }
  for (const bi of [0, 1]) {
    const t = SKIM[bi]; const tag = `skim ${t.id}`;
    const { page, issues } = await openSkim('1440x900', { haefte: bi });
    const first = await page.evaluate(() => ({ id: window.__cur().id, h1: document.querySelector('#lf-text h1').textContent, notices: document.querySelectorAll('#lf-text section.lf-notice').length, h2: [...document.querySelectorAll('#lf-text section.lf-notice > h2')].length, chips: document.querySelectorAll('#lf-jump button').length, q: document.getElementById('lf-qnum').textContent, foot: [...document.querySelectorAll('.lf-foot > p')].map(p => p.textContent), prompt: document.querySelector('.dc-quiz-prompt').textContent, label: document.querySelector('label[for="lf-input"]').textContent, input: document.activeElement && document.activeElement.id }));
    note(tag + ' first screen', first);
    rec(`${tag}: opens as the expected booklet, ${t.notices.length} notices as <section> with <h2>, ${t.notices.length} jump chips, Spørgsmål 1 af 15`, first.id === t.id && first.h1 === t.title && first.notices === t.notices.length && first.h2 === t.notices.length && first.chips === t.notices.length && first.q === 'Spørgsmål 1 af 15', JSON.stringify(first));
    rec(`${tag}: both footer lines rendered (source line + exercise-values line); question prompt matches data`, first.foot.includes(FOOTER) && first.foot.includes(FOOTER_SKIM) && first.prompt.includes(t.questions[0].q), first.foot.join(' | '));
    rec(`${tag}: no keyboard focus stolen into the input on start (no pop-up keyboard)`, first.input !== 'lf-input', 'active=' + first.input);
    const top0 = await page.evaluate(() => { const r = document.getElementById('lf-reader'); const k = document.querySelector('.lf-kicker').getBoundingClientRect(), h = document.querySelector('#lf-text h1').getBoundingClientRect(), rr = r.getBoundingClientRect(); return { scrollTop: Math.round(r.scrollTop), kickerRel: Math.round(k.top - rr.top), titleRel: Math.round(h.top - rr.top) }; });
    rec(`${tag}: a freshly opened booklet starts at the top (kicker and title visible, scrollTop 0)`, top0.kickerRel >= 0 && top0.titleRel >= 0, JSON.stringify(top0));
    const cov = await page.evaluate(() => { const h = document.querySelector('section.lf-notice > h2').getBoundingClientRect(), nav = document.getElementById('lf-jump').getBoundingClientRect(); return { h1Top: Math.round(h.top), navBottom: Math.round(nav.bottom), coveredPx: Math.max(0, Math.round(nav.bottom - h.top)) }; });
    rec(`${tag}: on first open the first notice heading is not hidden under the sticky jump-list`, cov.coveredPx === 0, JSON.stringify(cov));
    await shot(page, '1440x900', `skim-${bi}-play`);
    // empty answers
    await page.evaluate(() => { document.getElementById('lf-input').value = ''; document.getElementById('btn-submit').click(); }); await sleep(200);
    await page.evaluate(() => { const i = document.getElementById('lf-input'); i.value = '   '; i.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('btn-submit').click(); }); await sleep(200);
    const emp = await page.evaluate(() => ({ q: document.getElementById('lf-qnum').textContent, fb: !!document.querySelector('.lf-fb-box'), dis: document.getElementById('lf-input').disabled, st: document.getElementById('lf-input').getAttribute('data-state') }));
    rec(`${tag}: empty / whitespace answer is ignored (still Q1, no feedback, input enabled, nothing recorded)`, emp.q === 'Spørgsmål 1 af 15' && !emp.fb && !emp.dis && !emp.st && (await srsKeys(page)).length === 0, JSON.stringify(emp));
    // ROUND 1: all 15 with accepted[0]
    const adv = [], notOk = [], praise = [];
    for (let k = 0; k < 15; k++) {
      const q = (await skimQ(page)).q;
      const r = await submitMeasured(page, q.accepted[0]);
      if (r.state !== 'ok') notOk.push(q.id.slice(-3));
      adv.push(r.ms);
      if (k === 0) { const vis = await page.$eval('#screen-play', n => n.innerText); const live = await page.evaluate(() => [...document.querySelectorAll('[aria-live]')].map(n => n.textContent.trim()).join(' | ')); praise.push(PRAISE.test(vis) || PRAISE.test(live)); note(tag + ' live regions after first correct', live); }
      await sleep(120);
    }
    await sleep(400);
    rec(`${tag}: all 15 accepted[0] answers typed through the UI are marked correct (data-state ok)`, notOk.length === 0, 'not ok: ' + notOk.join(',') + ' | advance ms ' + adv.join(','));
    rec(`${tag}: every correct answer advances in 700-900 ms (first answer of the page load included)`, adv.every(x => x >= 700 && x <= 900), 'first=' + adv[0] + ' all=' + adv.join(','));
    rec(`${tag}: no praise text in visible text or live regions after a correct answer`, praise[0] === false, '');
    const s1 = await sumText(page), b1 = await sumBtns(page), w1 = await page.$$eval('#lf-q .dc-summary-weak li', l => l.length);
    rec(`${tag}: 15/15 summary: Point: 15, Rigtige: 100%, no weakest list, one action "Spil igen" (no Gentag fejl without errors)`, /Point: 15/.test(s1) && /Rigtige: 100%/.test(s1) && w1 === 0 && b1.length === 1 && b1[0] === 'Spil igen', s1 + ' | ' + b1.join('/'));
    await shot(page, '1440x900', `skim-${bi}-summary-perfect`);
    // ROUND 2: variants through the UI
    await clickBtn(page, 'Spil igen'); await sleep(300);
    const adv2 = [], no2 = [];
    for (let k = 0; k < 15; k++) {
      const q = (await skimQ(page)).q; const v = k % 3 === 0 ? q.accepted[0].toUpperCase() + '.' : k % 3 === 1 ? '  ' + q.accepted[q.accepted.length - 1].toLowerCase() + ' ' : q.accepted[1 % q.accepted.length].charAt(0).toUpperCase() + q.accepted[1 % q.accepted.length].slice(1) + '!';
      const r = await submitMeasured(page, v); if (r.state !== 'ok') no2.push(q.id.slice(-3) + ':' + v); adv2.push(r.ms); await sleep(120);
    }
    await sleep(400);
    rec(`${tag}: variant answers (UPPER+".", last accepted lower-case padded, 2nd accepted capitalised+"!") through the UI are all marked correct`, no2.length === 0 && /Point: 15/.test(await sumText(page)), no2.join(' | '));
    // ROUND 3: all wrong
    await clickBtn(page, 'Spil igen'); await sleep(300);
    const wrongRows = [];
    for (let k = 0; k < 15; k++) {
      const q = (await skimQ(page)).q;
      const r = await submitMeasured(page, WRONG, 150); await sleep(1000);
      const info = await page.evaluate(() => {
        const box = document.querySelector('.lf-fb-box'); const g = box ? [...box.querySelectorAll(':scope > p')].map(p => p.innerText.replace(/\s+/g, ' ')) : [];
        return { head: document.getElementById('lf-qnum').textContent, ps: g, acts: box ? [...box.querySelectorAll('.lf-fb-actions button')].map(b => b.textContent) : [], st: document.getElementById('lf-input').getAttribute('data-state'), dis: document.getElementById('lf-input').disabled };
      });
      const g = await geom(page);
      const sec = t.notices.find(n => n.id === q.noticeId);
      const row = {
        q: q.id.slice(-3), advanced: r.ms !== -1, waits: info.head === `Spørgsmål ${k + 1} af 15`, state: info.st,
        ans: info.ps[0] && info.ps[0].replace(/\s+/g, ' ').startsWith('Rigtigt svar: ' + q.accepted[0]), notes: info.ps.length - 1, noteText: info.ps[1] === q.note, see: info.acts.includes('Se opslag ' + sec.heading), next: info.acts.includes(k === 14 ? 'Se resultat' : 'Næste'),
        hl: g && g.n === 1 && g.id === q.noticeId, headVisible: g && g.headBelowNav && g.headInReader && g.headTop < g.readerBottom - 20, geom: g,
      };
      wrongRows.push(row);
      if (k === 7) { // "Se opslag" re-scroll
        await page.evaluate(() => { document.getElementById('lf-reader').scrollTop = 0; }); await sleep(300);
        await page.evaluate(() => [...document.querySelectorAll('.lf-fb-actions button')].find(b => /^Se opslag/.test(b.textContent)).click()); await sleep(1000);
        const g2 = await geom(page); row.reScroll = g2 && g2.headBelowNav && g2.headInReader;
        if (k === 7) await shot(page, '1440x900', `skim-${bi}-wrong`);
      }
      await page.evaluate(() => document.getElementById('btn-continue').click()); await sleep(250);
    }
    const bad3 = wrongRows.filter(r => r.advanced || !r.waits || r.state !== 'no' || !r.ans || r.notes !== 1 || !r.noteText || !r.see || !r.next || !r.hl || !r.headVisible);
    note(`${tag}: wrong-answer rows`, wrongRows.map(r => r.q + (r.hl ? '' : '!hl') + (r.headVisible ? '' : '!vis')).join(' '));
    rec(`${tag}: all 15 wrong answers: shows accepted[0], exactly one note (= data note), "Se opslag <heading>", waits for Næste, highlights exactly the notice == noticeId`, bad3.length === 0, JSON.stringify(bad3.slice(0, 3)));
    rec(`${tag}: highlighted notice heading is scrolled into the reader, below the sticky jump-list (not covered), for all 15 questions`, wrongRows.every(r => r.headVisible), JSON.stringify(wrongRows.filter(r => !r.headVisible).map(r => ({ q: r.q, g: r.geom }))).slice(0, 600));
    rec(`${tag}: "Se opslag" button scrolls the notice back into view after the learner scrolled away`, wrongRows[7].reScroll === true, String(wrongRows[7].reScroll));
    const s3 = await sumText(page), b3 = await sumBtns(page), w3 = await page.$$eval('#lf-q .dc-summary-weak li', l => l.length);
    const stylesEq = await page.$$eval('#lf-q .dc-summary-actions button', b => b.map(x => getComputedStyle(x).backgroundColor).join(' / '));
    rec(`${tag}: all-wrong summary: Point: 0, Rigtige: 0%, <=3 weakest (exactly 3), "Spil igen" present`, /Point: 0/.test(s3) && /Rigtige: 0%/.test(s3) && w3 === 3 && b3[0] === 'Spil igen', s3.slice(0, 200) + ' | btns ' + b3.join('/'));
    note(`${tag}: summary action buttons (shared quiz.summary renders Spil igen and Gentag fejl with the same style)`, b3.join(' / ') + ' | bg ' + stylesEq);
    await shot(page, '1440x900', `skim-${bi}-summary`);
    // ROUND 4: Gentag fejl replays exactly the missed ones
    await clickBtn(page, 'Spil igen'); await sleep(300);
    const MISS = [2, 6, 10]; const seen = [];
    for (let k = 0; k < 15; k++) {
      const q = (await skimQ(page)).q;
      if (MISS.includes(k)) { await submitMeasured(page, WRONG, 150); await sleep(900); await page.evaluate(() => document.getElementById('btn-continue').click()); } else { await submitMeasured(page, q.accepted[0]); }
      await sleep(150);
    }
    await sleep(900);
    const s4 = await sumText(page), b4 = await sumBtns(page);
    rec(`${tag}: after 3 misses (q3,q7,q11): Point: 12, Rigtige: 80%, weakest lists exactly the 3 missed question texts, actions Spil igen + Gentag fejl`, /Point: 12/.test(s4) && /Rigtige: 80%/.test(s4) && MISS.every(i => s4.includes(t.questions[i].q)) && b4.includes('Gentag fejl') && b4.includes('Spil igen'), s4.slice(0, 260) + ' | ' + b4.join('/'));
    await clickBtn(page, 'Gentag fejl'); await sleep(400);
    for (let k = 0; k < 3; k++) { const c = await skimQ(page); seen.push(c.i + 1); await submitMeasured(page, c.q.accepted[0]); await sleep(1000); }
    await sleep(300);
    const s5 = await sumText(page);
    rec(`${tag}: Gentag fejl asks exactly the missed questions (3, 7, 11), then summary 15/15`, JSON.stringify(seen) === '[3,7,11]' && /Point: 15/.test(s5) && /Rigtige: 100%/.test(s5), 'asked ' + JSON.stringify(seen) + ' | ' + s5.slice(0, 80));
    // Spil igen / Menu
    await clickBtn(page, 'Spil igen'); await sleep(300);
    rec(`${tag}: Spil igen restarts at Spørgsmål 1 af 15 with an empty input`, (await qnum(page)) === 'Spørgsmål 1 af 15' && (await page.$eval('#lf-input', i => i.value === '' && !i.disabled)), await qnum(page));
    await page.click('#btn-menu'); await sleep(250);
    rec(`${tag}: Menu returns to the start screen`, (await view(page)).start, '');
    rec(`${tag}: console clean over all rounds`, issues.length === 0, issues.join(' | '));
    await page.close();
  }
  // advance timing over 6 fresh loads (3 per booklet): first and second answer
  { const times = [];
    for (const bi of [0, 1, 0, 1, 0, 1]) {
      const { page } = await openSkim('1440x900', { haefte: bi });
      const a = (await skimQ(page)).q; const t1 = await submitMeasured(page, a.accepted[0]); await sleep(200);
      const b = (await skimQ(page)).q; const t2 = await submitMeasured(page, b.accepted[0]);
      times.push([t1.ms, t2.ms]); await page.close();
    }
    rec('skim advance: first and second correct answer of 6 fresh page loads advance in 700-900 ms', times.flat().every(x => x >= 700 && x <= 900), JSON.stringify(times)); }
  { // drafts, Forrige/Næste, J/K, nudge
    const { page, issues } = await openSkim('1440x900', { haefte: 0 });
    const type = async s => { await page.evaluate(s => { const i = document.getElementById('lf-input'); i.value = s; i.dispatchEvent(new Event('input', { bubbles: true })); }, s); };
    const val = () => page.$eval('#lf-input', i => i.value);
    await type('udkast et'); await page.click('#btn-next'); await sleep(250);
    const atQ2 = await qnum(page); const v2 = await val(); await type('udkast to');
    await page.click('#btn-prev'); await sleep(250); const v1 = await val(); const atQ1 = await qnum(page);
    await page.click('#btn-next'); await sleep(250); const v2b = await val();
    rec('skim nav: Næste/Forrige keep typed drafts per question (Q1 "udkast et", Q2 "udkast to")', atQ2 === 'Spørgsmål 2 af 15' && v2 === '' && atQ1 === 'Spørgsmål 1 af 15' && v1 === 'udkast et' && v2b === 'udkast to', JSON.stringify({ atQ2, v2, atQ1, v1, v2b }));
    await page.evaluate(() => document.body.focus()); await page.keyboard.press('j'); await sleep(250); const j1 = await qnum(page); const jv = await val();
    await page.keyboard.press('k'); await sleep(250); const k1 = await qnum(page);
    note('skim J/K as implemented', `from Q2: J → ${j1}, K → ${k1}`);
    rec('skim nav: J goes to previous and K to next question with drafts kept (as implemented; plan decision 9 text lists "J / K = next/previous")', j1 === 'Spørgsmål 1 af 15' && jv === 'udkast et' && k1 === 'Spørgsmål 2 af 15', `${j1} / "${jv}" / ${k1}`);
    // typing j/k inside the input is text, not navigation
    await page.click('#lf-input'); await page.keyboard.type('jk'); const q3 = await qnum(page); const vv = await val();
    rec('skim nav: typing "jk" inside the input is plain text (no J/K navigation while typing)', q3 === 'Spørgsmål 2 af 15' && vv.endsWith('jk'), q3 + ' / ' + vv);
    // draft survives answering another question first and coming back? (skip: answered questions are static review)
    await type(''); await page.close();
    const o2 = await openSkim('1440x900', { haefte: 0, init: () => { const st = window.setTimeout; window.__t30 = 0; window.setTimeout = function (f, d, ...a) { if (d === 30000) { window.__t30++; d = 400; } return st.call(window, f, d, ...a); }; } });
    const p2 = o2.page; await sleep(700);
    const nud = await p2.evaluate(() => ({ el: !!document.getElementById('lf-nudge'), txt: (document.getElementById('lf-nudge') || {}).textContent, t30: window.__t30, q: document.getElementById('lf-qnum').textContent, dis: document.getElementById('lf-input').disabled }));
    await sleep(1500);
    const nud2 = await p2.evaluate(() => ({ el: !!document.getElementById('lf-nudge'), q: document.getElementById('lf-qnum').textContent, dis: document.getElementById('lf-input').disabled, fb: !!document.querySelector('.lf-fb-box'), keys: Object.keys(localStorage).filter(k => /srs/.test(k)) }));
    rec('skim nudge: a 30 s timer is armed per question (time shim 30000→400 ms); the nudge text "Gå videre, og vend tilbage til spørgsmålet til sidst." appears', nud.t30 >= 1 && nud.el && nud.txt === 'Gå videre, og vend tilbage til spørgsmålet til sidst.', JSON.stringify(nud));
    rec('skim nudge: never advances or blocks (still Q1 after 1.9 s, input enabled, no feedback box, nothing recorded) and the learner can still answer', nud2.q === 'Spørgsmål 1 af 15' && !nud2.dis && !nud2.fb && nud2.keys.length === 0, JSON.stringify(nud2));
    const q1 = (await skimQ(p2)).q; const r = await submitMeasured(p2, q1.accepted[0]);
    rec('skim nudge: answering after the nudge works normally (nudge removed, advance 700-900 ms)', r.state === 'ok' && r.ms >= 700 && r.ms <= 900 && !(await p2.$('#lf-nudge')), JSON.stringify(r));
    const ctl = await openSkim('1440x900', { haefte: 0 }); await sleep(2200);
    rec('skim nudge control: without the shim no nudge after 2.2 s (real delay is 30 s)', !(await ctl.page.$('#lf-nudge')), '');
    await ctl.page.close(); await o2.page.close();
    rec('skim nav: console clean', issues.length === 0 && o2.issues.length === 0, issues.concat(o2.issues).join(' | '));
  }
  // persistence
  { const { page, issues } = await openSkim('1440x900', { haefte: 0 });
    const qq = SKIM[0].questions;
    await submitMeasured(page, qq[0].accepted[0]); await sleep(900);
    await submitMeasured(page, WRONG, 150); await sleep(900); await page.evaluate(() => document.getElementById('btn-continue').click()); await sleep(250);
    await submitMeasured(page, qq[2].accepted[0]); await sleep(900);
    const keys = await srsKeys(page);
    note('skim srs keys', keys); note('skim localStorage keys', await lsKeys(page));
    rec('skim persist: SRS items stored as skim:<question-id> in srs:laeseforstaaelse (= laeseforstaaelse:skim:haefte-kolonihave-qNN), no indices', keys.length === 3 && keys.every(k => /^skim:haefte-kolonihave-q\d\d$/.test(k)) && ['q01', 'q02', 'q03'].every(x => keys.includes('skim:haefte-kolonihave-' + x)), keys.join(','));
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem('srs:laeseforstaaelse')).items);
    await reload(page);
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('srs:laeseforstaaelse')).items);
    rec('skim persist: SRS state survives reload (q01 box 2, q02 box 1, q03 box 2)', JSON.stringify(before) === JSON.stringify(after) && after['skim:haefte-kolonihave-q01'].box === 2 && after['skim:haefte-kolonihave-q02'].box === 1 && after['skim:haefte-kolonihave-q03'].box === 2, JSON.stringify(Object.fromEntries(Object.entries(after).map(([k, v]) => [k, v.box]))));
    rec('skim persist: no index-based keys among all localStorage keys', (await lsKeys(page)).every(k => !/(^|:)\d+$/.test(k)), (await lsKeys(page)).join(','));
    await playText(page, 'haefte-kolonihave');
    await page.evaluate(() => { const r = document.getElementById('lf-reader'), s = document.querySelector('[data-notice="haefte-kolonihave-n06"]'); r.scrollTop = s.getBoundingClientRect().top - r.getBoundingClientRect().top + r.scrollTop - 80; }); await sleep(500);
    const st1 = await page.evaluate(() => ({ top: Math.round(document.getElementById('lf-reader').scrollTop), saved: JSON.parse(localStorage.getItem('laeseforstaaelse:scroll:haefte-kolonihave')) }));
    await reload(page); await playText(page, 'haefte-kolonihave'); await sleep(300);
    const st2 = await page.evaluate(() => Math.round(document.getElementById('lf-reader').scrollTop));
    rec('skim persist: reader scroll position (notice 6) survives reload', st1.top > 500 && Math.abs(st2 - st1.top) <= 3 && st1.saved && st1.saved.par >= 5, `before=${st1.top} saved=${JSON.stringify(st1.saved)} after=${st2}`);
    rec('skim persist: console clean', issues.length === 0, issues.join(' | '));
    await page.close();
    const t = await open('1440x900', { init: THROW_LS });
    await t.page.evaluate(() => document.querySelector('#ctl-mode [data-mode="skim"]').click()); await play(t.page);
    for (let k = 0; k < 15; k++) { const q = (await skimQ(t.page)).q; await submitMeasured(t.page, k % 5 === 4 ? WRONG : q.accepted[0]); await sleep(k % 5 === 4 ? 900 : 1000); if (k % 5 === 4) { await t.page.evaluate(() => document.getElementById('btn-continue').click()); await sleep(200); } }
    await sleep(300);
    rec('skim persist: localStorage throwing -> skim round to the summary works (Point: 12), reader controls work, no errors', /Point: 12/.test(await sumText(t.page)) && t.issues.length === 0, t.issues.join(' | ') + ' / ' + (await sumText(t.page)).slice(0, 60));
    await t.page.close(); }
}

// ============ mcall: mc still works on all 3 articles; keys unchanged
if (want('mcall')) {
  const { page, issues } = await open('1440x900');
  const seen = []; const sums = [];
  for (let k = 0; k < 3; k++) {
    if (k > 0) { await page.click('#btn-menu'); await sleep(250); }
    await play(page);
    const id = await page.evaluate(() => window.__cur().id); seen.push(id);
    const top0 = await page.evaluate(() => { const r = document.getElementById('lf-reader'); const k = document.querySelector('.lf-kicker').getBoundingClientRect(), rr = r.getBoundingClientRect(); return { scrollTop: Math.round(r.scrollTop), kickerRel: Math.round(k.top - rr.top) }; });
    rec(`mc ${id}: a freshly opened article starts at the top (kicker visible)`, top0.kickerRel >= 0, JSON.stringify(top0));
    await answerRound(page, k === 0 ? [true, true, true] : k === 1 ? [true, false, true] : [false, true, true]);
    sums.push(id + ': ' + (await sumText(page)).slice(0, 40));
    await shot(page, '1440x900', 'mc-' + id + '-summary');
  }
  const keys = await srsKeys(page);
  note('mc round order', seen.join(' > ')); note('mc summaries', sums.join(' | ')); note('mc srs keys', keys);
  rec('mc: full round on each of the 3 articles (art-ulven, art-dialekter, art-efterskole) reaches the summary', JSON.stringify([...seen].sort()) === JSON.stringify(['art-dialekter', 'art-efterskole', 'art-ulven']) && /Point: 3/.test(sums[0]) && /Point: 2/.test(sums[1]) && /Point: 2/.test(sums[2]), sums.join(' | '));
  const WANT = ['art-ulven', 'art-dialekter', 'art-efterskole'].flatMap(a => [1, 2, 3].map(n => `mc:${a}-q${n}`));
  rec('mc: SRS keys unchanged: mc:<question-id> for all 9 questions (= laeseforstaaelse:mc:<id>), no indices', WANT.every(k => keys.includes(k)) && keys.length === 9 && keys.every(k => /^mc:art-[a-z]+-q\d$/.test(k)), keys.join(','));
  rec('mc: console clean over three rounds', issues.length === 0, issues.join(' | '));
  await page.close();
}

// ============ skimjump: jump-list
if (want('skimjump')) {
  for (const vp of ['1440x900', '360x640']) {
    const { page, issues } = await openSkim(vp, { haefte: 0 });
    const t = SKIM[0];
    const info = await page.evaluate(() => {
      const nav = document.getElementById('lf-jump'), bs = [...nav.querySelectorAll('button')], secs = [...document.querySelectorAll('section.lf-notice')];
      return { navTag: nav.tagName, aria: nav.getAttribute('aria-label'), n: bs.length, same: bs.every((b, i) => b.getAttribute('data-jump') === secs[i].getAttribute('data-notice') && b.textContent === secs[i].querySelector('h2').textContent), labels: bs.map(b => b.getAttribute('aria-label')).slice(0, 2), types: bs.every(b => b.tagName === 'BUTTON' && b.type === 'button'),
        sticky: getComputedStyle(nav).position, ox: getComputedStyle(nav).overflowX, scrollW: nav.scrollWidth, clientW: nav.clientWidth, h: Math.round(nav.getBoundingClientRect().height) };
    });
    note(`jump ${vp}`, info);
    rec(`jump ${vp}: every notice heading is a <button type=button> in <nav aria-label="Opslag">, text = heading, in notice order`, info.navTag === 'NAV' && info.aria === 'Opslag' && info.n === t.notices.length && info.same && info.types, JSON.stringify(info.labels));
    rec(`jump ${vp}: row is sticky, overflow-x auto${vp === '360x640' ? ' and scrolls horizontally (scrollWidth > clientWidth)' : ''}`, info.sticky === 'sticky' && info.ox === 'auto' && (vp !== '360x640' || info.scrollW > info.clientW), `${info.sticky} ${info.ox} ${info.scrollW}/${info.clientW} h=${info.h}`);
    // click each chip
    const rows = [];
    for (let i = 0; i < t.notices.length; i++) {
      await page.evaluate(() => document.getElementById('lf-reader').scrollTo(0, 0)); await sleep(200);
      await page.evaluate(i => { const b = document.querySelectorAll('#lf-jump button')[i]; b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, i);
      const rect = await page.evaluate(i => { const r = document.querySelectorAll('#lf-jump button')[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, i);
      await page.mouse.click(rect.x, rect.y); await sleep(150); const settleMs = await settle(page);
      const m = await page.evaluate(i => {
        const rd = document.getElementById('lf-reader').getBoundingClientRect(), nav = document.getElementById('lf-jump').getBoundingClientRect(), sec = document.querySelectorAll('section.lf-notice')[i], h = sec.querySelector('h2').getBoundingClientRect();
        const cur = [...document.querySelectorAll('#lf-jump button')].map((b, j) => b.getAttribute('aria-current') === 'true' ? j : -1).filter(j => j >= 0);
        const chip = document.querySelectorAll('#lf-jump button')[i].getBoundingClientRect(); const chipR = Math.round(chip.right - nav.right), chipL = Math.round(chip.left - nav.left);
        const maxScroll = document.getElementById('lf-reader').scrollHeight - document.getElementById('lf-reader').clientHeight, top = document.getElementById('lf-reader').scrollTop;
        return { cur, headBelowNav: h.top >= nav.bottom - 1, gap: Math.round(h.top - nav.bottom), headInReader: h.bottom <= rd.bottom + 1, navTop: Math.round(nav.top - rd.top), chipR, chipL, chipInNav: chip.left >= nav.left - 1 && chip.right <= nav.right + 1, atEnd: top >= maxScroll - 2 };
      }, i);
      rows.push({ i: i + 1, settleMs, ...m });
    }
    note(`jump ${vp} click rows (gap px between nav bottom and heading; settle ms)`, rows.map(r => `${r.i}:gap${r.gap}/${r.settleMs}ms${r.atEnd ? '(end)' : ''}${r.cur.join('+') === String(r.i - 1) ? '' : '!cur=' + r.cur}`).join(' '));
    metrics['jump settle ms ' + vp] = rows.map(r => r.settleMs);
    rec(`jump ${vp}: clicking chip N scrolls notice N into view with its heading below the sticky nav (not covered), for all ${rows.length} notices`, rows.every(r => r.headBelowNav && r.headInReader), JSON.stringify(rows.filter(r => !(r.headBelowNav && r.headInReader))).slice(0, 400));
    rec(`jump ${vp}: after a jump exactly that chip has aria-current (last notices at end of scroll may differ: ${rows.filter(r => r.atEnd).map(r => r.i).join(',') || 'none'})`, rows.every(r => r.cur.length === 1 && (r.cur[0] === r.i - 1 || r.atEnd)), JSON.stringify(rows.map(r => r.cur)));
    const clipped = rows.filter(r => r.chipR > 2 || r.chipL < -2);
    rec(`jump ${vp}: the clicked (current) chip is fully inside the visible chip row after the jump (no clipped edge)`, clipped.length === 0, 'clipped by: ' + clipped.map(r => `chip${r.i} R+${r.chipR}px L${r.chipL}px`).join(', '));
    rec(`jump ${vp}: sticky nav stays at the top of the reader after each jump (navTop 0)`, rows.every(r => Math.abs(r.navTop) <= 1), rows.map(r => r.navTop).join(','));
    // aria-current follows manual scrolling
    const follow = [];
    for (let i = 0; i < t.notices.length; i++) {
      await page.evaluate(i => { const r = document.getElementById('lf-reader'), s = document.querySelectorAll('section.lf-notice')[i], nav = document.getElementById('lf-jump'); r.scrollTop = s.getBoundingClientRect().top - r.getBoundingClientRect().top + r.scrollTop - nav.offsetHeight - 6; }, i); await sleep(250);
      follow.push(await page.evaluate(() => [...document.querySelectorAll('#lf-jump button')].findIndex(b => b.getAttribute('aria-current') === 'true')));
    }
    const maxed = await page.evaluate(() => { const r = document.getElementById('lf-reader'); return r.scrollTop >= r.scrollHeight - r.clientHeight - 2; });
    rec(`jump ${vp}: aria-current follows manual scrolling (scrollTop set per notice): ${follow.join(',')}`, follow.every((c, i) => c === i || (i === follow.length - 1 && maxed) || c === i + 1 && i >= follow.length - 2), JSON.stringify(follow));
    if (vp === '360x640') {
      const chipVis = await page.evaluate(() => { const nav = document.getElementById('lf-jump'), cur = nav.querySelector('[aria-current="true"]'), a = nav.getBoundingClientRect(), b = cur.getBoundingClientRect(); return { inRow: b.left >= a.left - 1 && b.right <= a.right + 1, scrollLeft: Math.round(nav.scrollLeft), page: document.documentElement.scrollLeft, reader: document.getElementById('lf-reader').scrollLeft }; });
      rec('jump 360: after manual scrolling to the last notice the page and reader never scroll sideways (chip row keeps the current chip in view; clipping is graded in the click rows)', chipVis.page === 0 && chipVis.reader === 0 && chipVis.scrollLeft > 0, JSON.stringify(chipVis));
      const sl = await page.evaluate(() => { const n = document.getElementById('lf-jump'); n.scrollLeft = 0; n.scrollLeft = 120; return n.scrollLeft; });
      rec('jump 360: the chip row can be scrolled horizontally by script/touch (scrollLeft moves)', sl > 0, 'scrollLeft ' + sl);
      const small = await smallTapTargets(page); rec('jump 360: chips and all play-screen tap targets >=44px', small.length === 0, small.join('; '));
      await shot(page, vp, 'skim-jump');
    }
    rec(`jump ${vp}: console clean`, issues.length === 0, issues.join(' | '));
    await page.close();
  }
}

// ============ skimlayout: six viewports with a skim booklet open
if (want('skimlayout')) {
  const cplSkim = () => { const lines = p => { const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); const map = new Map(); let n; while ((n = w.nextNode())) for (let i = 0; i < n.length; i++) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1); const b = r.getClientRects()[0]; if (!b || !b.width) continue; const k = Math.round(b.top); map.set(k, (map.get(k) || 0) + 1); } return [...map.values()]; };
    const all = [...document.querySelectorAll('#lf-text .lf-notice p')].map(lines); const full = all.flatMap(a => a.slice(0, -1)).sort((x, y) => x - y); return { median: full[Math.floor(full.length / 2)], max: Math.max(...all.flat()) }; };
  for (const vp of Object.keys(VPS)) {
    for (const bi of [0, 1]) {
      const { page, issues } = await openSkim(vp, { haefte: bi });
      const [W, H] = [VPS[vp].width, VPS[vp].height]; const tag = `skimlayout ${vp} ${SKIM[bi].id}`;
      await page.evaluate(contrastFn);
      const m = await page.evaluate(() => {
        const rd = document.getElementById('lf-reader'), pn = document.getElementById('lf-panel'), tx = document.getElementById('lf-text');
        const rr = rd.getBoundingClientRect(), pr = pn.getBoundingClientRect();
        const secs = [...tx.querySelectorAll('section.lf-notice')]; const lastP = secs[secs.length - 1].querySelector('p:last-of-type');
        const foot = tx.querySelector('.lf-foot');
        rd.scrollTo(0, 0); const before = rd.scrollTop; rd.scrollTo(0, 1e6); const end = rd.scrollTop;
        const lp = lastP.getBoundingClientRect(), fo = foot.getBoundingClientRect(); const rr2 = rd.getBoundingClientRect(), pr2 = pn.getBoundingClientRect();
        const sideBySide = pr2.left >= rr2.right - 1; const res = {
          docScroll: [document.documentElement.scrollHeight, innerHeight, document.body.scrollHeight], hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth || rd.scrollWidth > rd.clientWidth,
          reader: { sh: rd.scrollHeight, ch: rd.clientHeight, moved: end - before, ofy: getComputedStyle(rd).overflowY, ov: getComputedStyle(rd).overscrollBehaviorY },
          panel: { sh: pn.scrollHeight, ch: pn.clientHeight, h: Math.round(pr.height), ofy: getComputedStyle(pn).overflowY, ov: getComputedStyle(pn).overscrollBehaviorY },
          sideBySide, below: pr2.top >= rr2.bottom - 1, lastNoticeToPanel: Math.round((sideBySide ? rr2.bottom : pr2.top) - lp.bottom), footToPanel: Math.round((sideBySide ? rr2.bottom : pr2.top) - fo.bottom),
          readerW: Math.round(rr.width), readerH: Math.round(rr.height), textW: Math.round(tx.getBoundingClientRect().width), fs: getComputedStyle(tx).fontSize,
          peek: document.getElementById('lf-peek').textContent, prompt: (document.querySelector('.dc-quiz-prompt span') || {}).textContent,
        }; rd.scrollTo(0, 0); return res;
      });
      const cpl = await page.evaluate(cplSkim);
      metrics[`skim ${vp} ${bi}`] = { readerShare: +(m.readerH / H).toFixed(2), panelShare: +(m.panel.h / H).toFixed(2), cplMedian: cpl.median, cplMax: cpl.max, layout: m.sideBySide ? 'side-by-side' : 'stacked', textW: m.textW, dupQuestionText: m.peek.includes(m.prompt) };
      note(tag + ' metrics', metrics[`skim ${vp} ${bi}`]);
      const wantSide = W >= 1024;
      rec(`${tag}: page does not scroll`, m.docScroll[0] <= m.docScroll[1] && m.docScroll[2] <= m.docScroll[1], JSON.stringify(m.docScroll));
      rec(`${tag}: reading pane scrolls (scrollHeight>clientHeight, scrollTo moves it)`, m.reader.sh > m.reader.ch && m.reader.moved > 100, JSON.stringify(m.reader));
      rec(`${tag}: no horizontal overflow (page and reader)`, !m.hOverflow, '');
      rec(`${tag}: panel is ${wantSide ? 'right of' : 'below'} the text`, wantSide ? m.sideBySide : (m.below && !m.sideBySide), `side=${m.sideBySide} below=${m.below}`);
      rec(`${tag}: both panes overflow-y auto + overscroll contain`, m.reader.ofy === 'auto' && m.panel.ofy === 'auto' && m.reader.ov === 'contain' && m.panel.ov === 'contain', `${m.reader.ofy}/${m.reader.ov} ${m.panel.ofy}/${m.panel.ov}`);
      rec(`${tag}: last notice and footer reachable above the panel / inside the reader after scrolling to the end`, m.lastNoticeToPanel >= 0 && m.footToPanel >= 0, `last notice gap ${m.lastNoticeToPanel}px, footer gap ${m.footToPanel}px`);
      rec(`${tag}: characters per line max <=75 (median ${cpl.median}, max ${cpl.max}; mc was 64/69; 360 px exempt as before)`, cpl.max <= 75 || vp === '360x640', JSON.stringify(cpl));
      const small = await smallTapTargets(page); rec(`${tag}: play-screen tap targets >=44px (chips, input, Svar, nav)`, small.length === 0, small.join('; '));
      if (bi === 0) {
        await shot(page, vp, 'skim-play');
        // wrong state
        await submitMeasured(page, WRONG, 150); await sleep(1300);
        await shot(page, vp, 'skim-wrong');
        const small2 = await smallTapTargets(page); rec(`${tag}: wrong-answer-state tap targets >=44px`, small2.length === 0, small2.join('; '));
        rec(`${tag}: wrong-answer-state no h-overflow, page does not scroll`, !(await hasHorizontalOverflow(page)) && (await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)), '');
        const vis = await page.evaluate(() => { const b = document.querySelector('#btn-continue').getBoundingClientRect(), pn = document.getElementById('lf-panel').getBoundingClientRect(); return { inPanel: b.top >= pn.top - 1 && b.bottom <= pn.bottom + 1, btnBottom: Math.round(b.bottom), panelBottom: Math.round(pn.bottom), innerHeight }; });
        note(`${tag}: Næste visible without scrolling the panel`, vis);
        metrics[`skim ${vp} 0`].nextVisibleInPanel = vis.inPanel;
        // wheel isolation
        const gg = await geom(page);
        await page.evaluate(() => { document.getElementById('lf-reader').scrollTop = 300; document.getElementById('lf-panel').scrollTop = 0; });
        const box = async id => page.$eval(id, e => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 80) }; });
        const pb = await box('#lf-panel'); await page.mouse.move(pb.x, pb.y); for (let i = 0; i < 3; i++) await page.mouse.wheel({ deltaY: 400 }); await sleep(250);
        const r1 = await page.$eval('#lf-reader', r => Math.round(r.scrollTop));
        rec(`${tag}: wheel over the question pane does not move the reading pane`, r1 === 300, 'reader scrollTop ' + r1);
        await page.evaluate(() => document.getElementById('btn-continue').click()); await sleep(250);
        // finish quickly: summary tap targets
        for (let k = 1; k < 15; k++) { const q = (await skimQ(page)).q; await submitMeasured(page, q.accepted[0]); await sleep(1000); }
        await sleep(300);
        const small3 = await smallTapTargets(page); rec(`${tag}: summary tap targets >=44px`, small3.length === 0 && /Point: 14/.test(await sumText(page)), small3.join('; ') + ' ' + (await sumText(page)).slice(0, 40));
        await shot(page, vp, 'skim-summary');
      }
      rec(`${tag}: console clean`, issues.length === 0, issues.join(' | '));
      await page.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'laese-skim-metrics.json'), JSON.stringify(metrics, null, 2));
}

// ============ skimkbd
if (want('skimkbd')) {
  const { page, issues } = await openSkim('1440x900', { haefte: 0 });
  await page.evaluate(() => document.activeElement && document.activeElement.blur()); await page.mouse.click(5, 5); await page.evaluate(() => window.scrollTo(0, 0));
  const visited = [];
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; const cs = getComputedStyle(el); return { k: el.id || (el.getAttribute('data-jump') ? 'chip:' + el.getAttribute('data-jump').slice(-3) : el.tagName.toLowerCase() + ':' + (el.getAttribute('aria-label') || el.textContent).trim().slice(0, 18)), ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2, b: cs.boxShadow !== 'none' }; });
    if (!r) continue; if (visited.length && visited[0].k === r.k) break; visited.push(r);
  }
  const focusable = await page.evaluate(() => [...document.querySelectorAll('button, a[href], summary, [tabindex="0"], input, select')].filter(e => { const r = e.getBoundingClientRect(); const closed = e.tagName !== 'SUMMARY' && e.closest('details:not([open])'); return r.width && r.height && !closed && getComputedStyle(e).visibility !== 'hidden' && !e.disabled; }).map(e => e.id || (e.getAttribute('data-jump') ? 'chip:' + e.getAttribute('data-jump').slice(-3) : e.tagName.toLowerCase() + ':' + (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 18))));
  note('skim tab order', visited.map(v => v.k).join(' > '));
  const missed = focusable.filter(f => !visited.some(v => v.k === f));
  const order = visited.map(v => v.k);
  rec('skim kbd: Tab reaches every visible control (10 chips, TTS buttons, input, Svar, Forrige/Næste, header buttons, Kilder summary)', missed.length === 0, 'missed: ' + missed.join(', ') + ' | focusable=' + focusable.length);
  rec('skim kbd: the Tab order contains the nav chips, then #lf-input, #btn-submit, #btn-next', order.filter(k => k.startsWith('chip:')).length === 10 && order.indexOf('lf-input') > order.lastIndexOf(order.filter(k => k.startsWith('chip:')).pop()) && order.indexOf('btn-submit') > order.indexOf('lf-input') && order.includes('btn-next'), order.join(' > '));
  const noRing = visited.filter(v => !v.ring && !v.b).map(v => v.k); rec('skim kbd: every tabbed control shows a focus ring (outline >=2px)', noRing.length === 0, 'no ring: ' + noRing.join(', '));
  await page.close();

  const p2 = await openSkim('1440x900', { haefte: 0 }); const pg = p2.page;
  // real keyboard: type with the keyboard, Enter submits
  await pg.focus('#lf-input'); const q1 = SKIM[0].questions[0];
  await pg.keyboard.type(q1.accepted[0]);
  await pg.keyboard.press('Enter'); await sleep(1200);
  rec('skim kbd: Enter submits the typed answer (keyboard.type + Enter): Q1 marked correct and advances to Q2', (await qnum(pg)) === 'Spørgsmål 2 af 15' && (await srsKeys(pg)).length === 1, await qnum(pg));
  // æøå + ² + digits typed
  await pg.focus('#lf-input'); await pg.keyboard.type('æøå 60 m²'); const tv = await pg.$eval('#lf-input', i => i.value);
  rec('skim kbd: æøå, digits and ² can be typed into the answer field', tv === 'æøå 60 m²', tv);
  await pg.$eval('#lf-input', i => { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); });
  // Escape inside the input closes Kilder; clears highlight
  await pg.focus('#lf-input'); await pg.keyboard.type('halvfærdigt'); await pg.evaluate(() => document.querySelector('.lf-foot details').setAttribute('open', ''));
  await pg.keyboard.press('Escape');
  rec('skim kbd: Escape inside the input closes the Kilder details (and keeps the typed text)', !(await pg.$eval('.lf-foot details', d => d.open)) && (await pg.$eval('#lf-input', i => i.value)) === 'halvfærdigt', '');
  // arrows / page keys not captured: focus in reader and in input
  await pg.evaluate(() => { window.__pd = []; window.addEventListener('keydown', e => window.__pd.push((document.activeElement.id || document.activeElement.tagName) + ':' + e.key + ':' + e.defaultPrevented)); });
  const tops = [];
  for (const [k, start, dir] of [['ArrowDown', 0, 1], ['PageDown', 0, 1], ['Space', 0, 1], ['ArrowUp', 600, -1], ['PageUp', 900, -1]]) {
    await pg.evaluate(t => { const r = document.getElementById('lf-reader'); r.scrollTop = t; r.focus(); }, start); await sleep(150);
    await pg.keyboard.press(k); await sleep(800);
    const t = await pg.$eval('#lf-reader', r => Math.round(r.scrollTop)); tops.push(`${k}:${start}->${t}`); if (!((t - start) * dir > 0)) tops.push('NOMOVE');
  }
  await pg.focus('#lf-input'); for (const k of ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'ArrowLeft', 'ArrowRight']) await pg.keyboard.press(k);
  const pd = await pg.evaluate(() => window.__pd);
  rec('skim kbd: arrows / PageUp / PageDown / Space are not captured (defaultPrevented false) in the reader and in the input; the focused reader scrolls natively', pd.length >= 11 && pd.every(x => x.endsWith(':false')) && !tops.includes('NOMOVE'), tops.join(' ') + ' | ' + pd.filter(x => !x.endsWith(':false')).join(' '));
  note('skim kbd: reader tabindex/label', await pg.$eval('#lf-reader', r => r.getAttribute('tabindex') + ' / ' + r.getAttribute('aria-label')));
  // number keys do nothing special in skim; with focus on body no answer recorded
  await pg.evaluate(() => document.activeElement.blur()); const nBefore = (await srsKeys(pg)).length; await pg.keyboard.press('1'); await pg.keyboard.press('2'); await sleep(300);
  rec('skim kbd: number keys outside the input neither answer nor throw in skim mode (they are for mc options only)', (await srsKeys(pg)).length === nBefore && p2.issues.length === 0, p2.issues.join(' | '));
  // labels
  const lab = await pg.evaluate(() => ({ input: document.getElementById('lf-input').labels[0] && document.getElementById('lf-input').labels[0].textContent, icon: [...document.querySelectorAll('button')].filter(b => !(b.textContent || '').trim() && !b.getAttribute('aria-label')).length, jump: document.querySelectorAll('#lf-jump button[aria-label]').length }));
  rec('skim kbd: answer input has a visible <label> ("Dit svar"), every chip has an aria-label, no unlabelled icon buttons', lab.input === 'Dit svar' && lab.icon === 0 && lab.jump === 10, JSON.stringify(lab));
  // wrong answer feedback not colour-only: text present; focus moves to Næste
  await pg.$eval('#lf-input', i => { i.value = ''; }); await submitMeasured(pg, WRONG, 150); await sleep(900);
  const fb = await pg.evaluate(() => ({ active: document.activeElement.id, txt: document.querySelector('.lf-fb-box').innerText.slice(0, 60), live: [...document.querySelectorAll('[aria-live]')].map(n => n.textContent).join('|') }));
  rec('skim kbd: after a wrong answer focus is on Næste (Enter continues), feedback is text (Rigtigt svar:), announced in a live region', fb.active === 'btn-continue' && /Rigtigt svar:/.test(fb.txt) && /Forkert/.test(fb.live), JSON.stringify(fb));
  await pg.keyboard.press('Enter'); await sleep(400);
  rec('skim kbd: Enter on Næste continues to the next question', /Spørgsmål 3 af 15/.test(await qnum(pg)), await qnum(pg));
  rec('skim kbd: console clean', issues.length === 0 && p2.issues.length === 0, issues.concat(p2.issues).join(' | '));
  await pg.close();
}

// ============ skimtheme: contrast on three papers, reduced motion, muted
if (want('skimtheme')) {
  const measure = page => page.evaluate(() => {
    const R = (el, pseudo) => { const cs = getComputedStyle(el, pseudo); return { fg: window.__parse(cs.color), bg: cs.backgroundColor }; };
    const out = {}; const bg = el => window.__bgOf(el);
    const sec = [...document.querySelectorAll('section.lf-notice')].find(s => !s.classList.contains('lf-evidence'));
    const p = sec.querySelector('p'); out.noticeText = window.__ratio(window.__parse(getComputedStyle(p).color), bg(p));
    const h = sec.querySelector('h2'); out.noticeHeading = window.__ratio(window.__parse(getComputedStyle(h).color), bg(h));
    const nm = getComputedStyle(h, '::before'); out.marginSection = window.__ratio(window.__parse(nm.color), bg(h));
    const chips = [...document.querySelectorAll('#lf-jump button')]; const chip = chips.find(c => c.getAttribute('aria-current') !== 'true'), cur = chips.find(c => c.getAttribute('aria-current') === 'true');
    out.chip = window.__ratio(window.__parse(getComputedStyle(chip).color), window.__parse(getComputedStyle(chip).backgroundColor));
    out.chipCurrent = window.__ratio(window.__parse(getComputedStyle(cur).color), window.__parse(getComputedStyle(cur).backgroundColor));
    const nav = document.getElementById('lf-jump'); const nb = getComputedStyle(nav).backgroundColor; out.navBgOpaque = window.__parse(nb)[3] === undefined || window.__parse(nb)[3] > 0.9 ? 1 : 0;
    const ev = document.querySelector('section.lf-evidence');
    if (ev) { const evbg = window.__parse(getComputedStyle(ev).backgroundColor); const ep = ev.querySelector('p'); out.evidenceText = window.__ratio(window.__parse(getComputedStyle(ep).color), evbg); out.evidenceHeading = window.__ratio(window.__parse(getComputedStyle(ev.querySelector('h2')).color), evbg); { const pb = getComputedStyle(ev.querySelector('h2'), '::before'); out.evidenceSection = window.__ratio(window.__parse(pb.color), pb.position === 'absolute' ? window.__bgOf(ev.parentElement) : evbg); }
      out.evidenceVsPaper = window.__ratio(evbg, window.__bgOf(ev.parentElement)); }
    const kk = document.querySelector('.lf-kicker'); out.kicker = window.__ratio(window.__parse(getComputedStyle(kk).color), bg(kk));
    const inp = document.getElementById('lf-input'); { const c = window.__parse(getComputedStyle(inp).backgroundColor), base = window.__bgOf(inp.parentElement), a = c[3] === undefined ? 1 : c[3]; out.input = window.__ratio(window.__parse(getComputedStyle(inp).color), [0, 1, 2].map(i => Math.round(c[i] * a + base[i] * (1 - a)))); }
    const sb = document.getElementById('btn-submit'); out.submit = window.__ratio(window.__parse(getComputedStyle(sb).color), window.__parse(getComputedStyle(sb).backgroundColor));
    const fb = document.querySelector('.lf-fb-box'); if (fb) { const c = window.__parse(getComputedStyle(fb).backgroundColor), base = window.__bgOf(fb.parentElement), a = c[3] === undefined ? 1 : c[3]; const mix = [0, 1, 2].map(i => Math.round(c[i] * a + base[i] * (1 - a))); out.feedback = window.__ratio(window.__parse(getComputedStyle(fb.querySelector('p')).color), mix); }
    const nd = document.querySelector('.lf-foot p'); out.footer = window.__ratio(window.__parse(getComputedStyle(nd).color), bg(nd));
    return out;
  });
  for (const vp of ['1440x900', '360x640']) {
    const { page, issues } = await openSkim(vp, { haefte: 0, scheme: 'dark' });
    await page.evaluate(contrastFn);
    if (vp === '1440x900') rec('skim theme: prefers-color-scheme dark with no saved prefs -> data-paper=dark on the booklet', (await page.evaluate(() => document.documentElement.dataset.paper)) === 'dark', '');
    await submitMeasured(page, WRONG, 150); await sleep(1300);
    for (const paper of ['dark', 'light', 'sepia']) {
      for (let i = 0; i < 4 && (await page.evaluate(() => document.documentElement.dataset.paper)) !== paper; i++) await page.click('#btn-paper');
      await sleep(700); await page.evaluate(contrastFn);
      const r = await measure(page);
      const low = Object.entries(r).filter(([k, v]) => k !== 'navBgOpaque' && k !== 'evidenceVsPaper' && v < 4.5).map(([k, v]) => k + '=' + v.toFixed(2));
      rec(`skim theme ${paper} @${vp}: contrast >=4.5 notice text/heading, §N margin, chip, current chip, highlighted notice (text/heading/§N), kicker, input, Svar, feedback, footer (${Object.entries(r).filter(([k]) => k !== 'navBgOpaque').map(([k, v]) => k + ' ' + v.toFixed(1)).join(', ')})`, low.length === 0, low.join(', '));
      rec(`skim theme ${paper} @${vp}: sticky nav background opaque (text never shows through)`, r.navBgOpaque === 1, '');
      note(`skim theme ${paper} @${vp}: highlight vs surrounding paper (non-text contrast, info)`, r.evidenceVsPaper && r.evidenceVsPaper.toFixed(2));
      if (vp === '1440x900') await shot(page, vp, 'skim-paper-' + paper);
      const lc = await lowContrast(page); rec(`skim theme ${paper} @${vp}: harness lowContrast (every text element) clean`, lc.length === 0, lc.join('; '));
    }
    rec(`skim theme @${vp}: console clean`, issues.length === 0, issues.join(' | '));
    await page.close();
  }
  { // long words / æøå at 360
    const { page } = await openSkim('360x640', { haefte: 0 });
    const g = await page.evaluate(() => { const rd = document.getElementById('lf-reader'); const txt = document.getElementById('lf-text').textContent; return { aeoa: /[æøå]/.test(txt) && /Kolonihaveforbundet/.test(txt), noH: rd.scrollWidth <= rd.clientWidth && document.documentElement.scrollWidth <= document.documentElement.clientWidth }; });
    rec('skim theme: æøå and the long word "Kolonihaveforbundet" render at 360 px without horizontal overflow', g.aeoa && g.noH, JSON.stringify(g));
    await page.close();
  }
  // reduced motion
  { const { page, issues } = await openSkim('1440x900', { haefte: 0, reduced: true });
    await page.evaluate(() => { document.querySelectorAll('#lf-jump button')[4].click(); }); await sleep(500);
    await submitMeasured(page, WRONG, 150); await sleep(500);
    const st = await page.evaluate(() => window.__st); const sb = await page.evaluate(() => getComputedStyle(document.getElementById('lf-reader')).scrollBehavior);
    note('skim reduced-motion scrollTo calls', st);
    rec('skim motion: prefers-reduced-motion -> jump-list click and highlight scroll use behavior "auto"; css scroll-behavior auto', st.length >= 2 && st.every(s => s.behavior === 'auto') && sb === 'auto', JSON.stringify(st) + ' css=' + sb);
    const g = await geom(page); rec('skim motion: reduced-motion round still fully functional (feedback box, highlight, no errors)', !!g && !!(await page.$('.lf-fb-box')) && issues.length === 0, issues.join(' | '));
    await page.close();
    const c = await openSkim('1440x900', { haefte: 0 }); await c.page.evaluate(() => { document.querySelectorAll('#lf-jump button')[4].click(); }); await sleep(300);
    const st2 = await c.page.evaluate(() => window.__st); rec('skim motion: control without reduced-motion uses smooth scrolling for the jump', st2.some(s => s.behavior === 'smooth'), JSON.stringify(st2)); await c.page.close(); }
  // muted
  { const un = await openSkim('1440x900', { haefte: 0 }); const q = SKIM[0].questions;
    await submitMeasured(un.page, q[0].accepted[0]); await sleep(900); await submitMeasured(un.page, WRONG, 150); await sleep(500);
    const oscOn = await un.page.evaluate(() => window.__osc); await un.page.close();
    const mu = await openSkim('1440x900', { haefte: 0, muted: true });
    await submitMeasured(mu.page, q[0].accepted[0]); await sleep(900); await submitMeasured(mu.page, WRONG, 150); await sleep(500);
    for (let k = 2; k < 15; k++) { await mu.page.evaluate(() => { const b = document.getElementById('btn-continue'); if (b) b.click(); }); await sleep(100); const cq = (await skimQ(mu.page)).q; await submitMeasured(mu.page, cq.accepted[0]); await sleep(900); }
    const oscOff = await mu.page.evaluate(() => window.__osc); const lbl = await mu.page.$eval('#btn-sound', b => b.textContent);
    rec('skim sound: unmuted correct+wrong answer create audio nodes (control), a muted skim round to the summary creates 0 audio nodes', oscOn > 0 && oscOff === 0 && lbl === 'Lyd fra', `unmuted=${oscOn} muted=${oscOff} label=${lbl}`);
    await mu.page.close(); }
}


await browser.close();
const fails = results.filter(r => r.ok === false), nv = results.filter(r => r.ok === null);
console.log(`\nSUMMARY ${results.length - fails.length - nv.length} pass, ${fails.length} fail, ${nv.length} not verified`);
fails.forEach(f => console.log('  FAIL ' + f.name));
fs.writeFileSync(path.join(OUT, 'laese-results.json'), JSON.stringify(results, null, 1));
process.exit(fails.length ? 1 : 0);
