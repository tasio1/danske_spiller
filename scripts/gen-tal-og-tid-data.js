'use strict';
// Generator for tal-og-tid/data.js. Run from repo root: node scripts/gen-tal-og-tid-data.js tal-og-tid/data.js
const fs = require('fs');
const OUT = process.argv[2];

function hash(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let s = hash(seed) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function shuf(arr, seed) { const r = rng(seed), a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pad(n, w) { return String(n).padStart(w || 2, '0'); }
function slug(s) { return String(s).toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
const LV = { A1: 1, A2: 2, B1: 3 };
function maxLv(a, b) { return LV[a] >= LV[b] ? a : b; }

// ---------------- number words ----------------
const U = ['nul', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti', 'elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten'];
const T = { 2: 'tyve', 3: 'tredive', 4: 'fyrre', 5: 'halvtreds', 6: 'tres', 7: 'halvfjerds', 8: 'firs', 9: 'halvfems' };
const TLONG = { 5: 'halvtredsindstyve', 6: 'tresindstyve', 7: 'halvfjerdsindstyve', 8: 'firsindstyve', 9: 'halvfemsindstyve' };
function w99(n, long) {
  if (n < 20) return U[n];
  const t = Math.floor(n / 10), o = n % 10;
  const tw = long && TLONG[t] ? TLONG[t] : T[t];
  return o ? U[o] + 'og' + tw : tw;
}
function w999(n) {
  if (n < 100) return w99(n);
  const h = Math.floor(n / 100), r = n % 100;
  const hw = h === 1 ? 'hundrede' : U[h] + ' hundrede';
  return r ? hw + ' og ' + w99(r) : hw;
}
function yearWord(y, spaced) {
  const base = y >= 2000 ? (spaced ? 'to tusind' : 'totusind') : w99(Math.floor(y / 100)) + (spaced ? ' hundrede' : 'hundrede');
  const r = y % 100;
  return r ? base + ' og ' + w99(r) : base;
}
function yearVariants(y) {
  const out = new Set();
  [false, true].forEach(sp => { const w = yearWord(y, sp); out.add(w); out.add(w.replace(' og ', ' ')); });
  return Array.from(out);
}

const items = { klokken: [], tal: [], aarstal: [] };
function add(mode, it) { it.mode = mode; items[mode].push(it); }

// ---------------- KLOKKEN ----------------
const HW = ['', 'et', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti', 'elleve', 'tolv'];
const nx = h => (h % 12) + 1;
const MIN_W = { 5: 'fem', 10: 'ti', 50: 'ti', 55: 'fem' };
// Traditional :20 / :40 are "ti i halv X" / "ti over halv X"; "tyve over X" / "tyve i X" are accepted variants only (alt_phrases).
function altPhrase(h, m) { return m === 20 ? 'klokken tyve over ' + HW[h] : m === 40 ? 'klokken tyve i ' + HW[nx(h)] : null; }
function phrase(h, m) {
  switch (m) {
    case 0: return 'klokken ' + HW[h];
    case 5: case 10: return 'klokken ' + MIN_W[m] + ' over ' + HW[h];
    case 20: return 'klokken ti i halv ' + HW[nx(h)];
    case 40: return 'klokken ti over halv ' + HW[nx(h)];
    case 15: return 'klokken kvart over ' + HW[h];
    case 25: return 'klokken fem i halv ' + HW[nx(h)];
    case 30: return 'klokken halv ' + HW[nx(h)];
    case 35: return 'klokken fem over halv ' + HW[nx(h)];
    case 50: case 55: return 'klokken ' + MIN_W[m] + ' i ' + HW[nx(h)];
    case 45: return 'klokken kvart i ' + HW[nx(h)];
  }
  throw new Error('bad minute ' + m);
}
const tstr = (h, m) => pad(h) + ':' + pad(m);
function minLevel(m) { return m === 0 || m === 30 ? 'A1' : (m === 20 || m === 25 || m === 35 || m === 40) ? 'B1' : 'A2'; }
function timeNote(h, m, tOverride) {
  const t = tOverride || (h + ':' + pad(m)), H = HW[h], N = HW[nx(h)];
  switch (m) {
    case 0: return 'Hel time: klokken + timetallet, så klokken ' + H + ' er ' + t + '.';
    case 30: return 'Halv ' + N + ' = ' + t + ': halv tæller frem mod den næste time (' + N + '), ikke fra den forrige.';
    case 15: return 'Kvart over ' + H + ' = ' + t + ': et kvarter efter ' + H + '.';
    case 45: return 'Kvart i ' + N + ' = ' + t + ': et kvarter før ' + N + '.';
    case 20: return 'Ti i halv ' + N + ' = ' + t + ': ti minutter før halv ' + N + ' (også sagt "tyve over ' + H + '").';
    case 40: return 'Ti over halv ' + N + ' = ' + t + ': ti minutter efter halv ' + N + ' (også sagt "tyve i ' + N + '").';
    case 5: case 10: return MIN_W[m][0].toUpperCase() + MIN_W[m].slice(1) + ' over ' + H + ' = ' + t + ': ' + (m === 5 ? 'fem' : m === 10 ? 'ti' : 'tyve') + ' minutter efter ' + H + '.';
    case 50: case 55: return MIN_W[m][0].toUpperCase() + MIN_W[m].slice(1) + ' i ' + N + ' = ' + t + ': ' + (60 - m === 5 ? 'fem' : 60 - m === 10 ? 'ti' : 'tyve') + ' minutter før ' + N + '.';
    case 25: return 'Fem i halv ' + N + ' = ' + t + ': fem minutter før halv ' + N + '.';
    case 35: return 'Fem over halv ' + N + ' = ' + t + ': fem minutter efter halv ' + N + '.';
  }
}
const SWAPM = { 0: 30, 5: 55, 10: 50, 15: 45, 20: 40, 25: 35, 30: 0, 35: 25, 40: 20, 45: 15, 50: 10, 55: 5 };
function clockDistractors(h, m) {
  // [h+1,m], [h-1,m], [h, swapped minute]; unique by time
  const prev = h === 1 ? 12 : h - 1;
  const c = [[nx(h), m], [prev, m], [h, SWAPM[m]]];
  // m==0: also [h,30] is the swap; fine. m==30: swap is (h,0).
  const seen = new Set([h + ':' + m]);
  const out = [];
  c.forEach(x => { const k = x[0] + ':' + x[1]; if (!seen.has(k)) { seen.add(k); out.push(x); } });
  if (out.length !== 3) throw new Error('distractor count ' + h + ':' + m);
  return out;
}
const spoken = ph => 'Klokken er ' + ph.replace(/^klokken /, '') + '.';

for (let h = 1; h <= 12; h++) {
  for (let m = 0; m < 60; m += 5) {
    const ph = phrase(h, m), lvl = minLevel(m), id = pad(h) + pad(m), note = timeNote(h, m);
    const d = clockDistractors(h, m);
    add('klokken', {
      id: 'k-aflaes-' + id, level: lvl, group: 'aflaes', kind: 'clock_to_phrase', pattern: 'min-' + pad(m),
      prompt_da: 'Hvad er klokken?', clock: tstr(h, m), alt_phrases: altPhrase(h, m) ? [altPhrase(h, m)] : undefined,
      options: [ph].concat(d.map(x => phrase(x[0], x[1]))), correct: ph, tts: spoken(ph), note
    });
    add('klokken', {
      id: 'k-find-' + id, level: lvl, group: 'find', kind: 'phrase_to_clock', pattern: 'min-' + pad(m),
      prompt_da: 'Find det rigtige ur.', show: ph, alt_phrases: altPhrase(h, m) ? [altPhrase(h, m)] : undefined, tts_prompt: spoken(ph), tts: spoken(ph),
      option_type: 'clock', options: [tstr(h, m)].concat(d.map(x => tstr(x[0], x[1]))), correct: tstr(h, m),
      correct_label: tstr(h, m), note
    });
    // digital: choose 12h or 24h deterministically
    const pm = hash('dig' + id) % 2 === 1;
    const h24 = h === 12 ? (pm ? 12 : 0) : (pm ? h + 12 : h);
    const is24 = h24 >= 13 || h24 === 0;
    const dn = timeNote(h, m, tstr(h24, m));
    const dnote = is24 ? (h24 === 0 ? 'Kl. 00 er midnat og står som 12 på det analoge ur. ' : 'Kl. ' + h24 + ' står som ' + h + ' på det analoge ur. ') + dn : dn;
    add('klokken', {
      id: 'k-digital-' + pad(h24) + pad(m), level: is24 ? maxLv(lvl, 'A2') : lvl, group: 'digital', kind: 'digital_to_phrase', pattern: 'min-' + pad(m),
      prompt_da: 'Hvad er klokken?', show: tstr(h24, m), alt_phrases: altPhrase(h, m) ? [altPhrase(h, m)] : undefined,
      options: [ph].concat(d.map(x => phrase(x[0], x[1]))), correct: ph, tts: spoken(ph), note: dnote
    });
  }
}

// ---------------- TAL ----------------
const HINT = {
  0: 'Nul (0) staves med u i midten.',
  1: 'Ved navneord bruges en eller et: en bil, et hus.',
  2: 'To (2) staves t-o; tallet 12 er tolv, ikke "toten".',
  3: 'Tre (3) hører sammen med tretten (13) og tredive (30).',
  4: 'Fire (4) bliver til fjor- i fjorten (14).',
  5: 'Fem (5) og femten (15) hænger sammen: fem + ten.',
  6: 'Seks (6) staves med ks; 16 er seksten.',
  7: 'Syv (7) staves med y og v; 17 er sytten.',
  8: 'Otte (8) har dobbelt t; 18 er atten.',
  9: 'Ni (9) er kort; 19 er nitten med dobbelt t.',
  10: 'Ti (10): de næste tiere hedder tyve, tredive og fyrre.',
  11: 'Elleve og tolv er egne ord; de følger ikke mønstret med -ten.',
  12: 'Elleve og tolv er egne ord; de følger ikke mønstret med -ten.',
  13: 'Tretten: tre + ten med dobbelt t.',
  14: 'Fjorten: fire ændrer sig til fjor- foran -ten.',
  15: 'Femten: fem + ten.',
  16: 'Seksten: seks + ten.',
  17: 'Sytten: syv bliver til sy- (ikke "syvten").',
  18: 'Atten: otte bliver til at- (ikke "otteten").',
  19: 'Nitten: ni + tten med dobbelt t.',
  20: 'Tyve (20) er grundtallet for 50–90: halvtreds, tres, halvfjerds, firs, halvfems.'
};
const TENS_EXPL = {
  50: 'Halvtreds = 50 (2½ × 20).', 60: 'Tres = 60 (3 × 20).', 70: 'Halvfjerds = 70 (3½ × 20).',
  80: 'Firs = 80 (4 × 20).', 90: 'Halvfems = 90 (4½ × 20).'
};
function numGroup(n) { return n <= 20 ? 'op-til-20' : n <= 49 ? '21-49' : 'boss'; }
function numLevel(n) { return n <= 20 ? 'A1' : n <= 49 ? 'A2' : 'B1'; }
function numNote(n) {
  if (n <= 20) return HINT[n];
  const t = Math.floor(n / 10) * 10, o = n % 10;
  if (!o) {
    if (t === 30) return 'Tredive (30), ikke "tretyve".';
    if (t === 40) return 'Fyrre (40) er et eget ord, ikke "firetyve".';
    return TENS_EXPL[t];
  }
  const base = 'Enerne siges først: ' + U[o] + ' + og + ' + w99(t) + ' = ' + w99(n) + ' (' + n + ').';
  return t >= 50 ? base + ' ' + TENS_EXPL[t] : base;
}
function numDistractors(n) {
  const t = Math.floor(n / 10), o = n % 10;
  const first = [];
  if (n >= 10 && o !== 0 && o !== t) first.push(o * 10 + t);
  if (n >= 50) { if (n + 20 <= 99) first.push(n + 20); if (n - 20 >= 0) first.push(n - 20); }
  const rest = [n + 1, n - 1, n + 10, n - 10, n + 2, n - 2, n + 20, n - 20, n + 9, n - 9];
  const pool = [];
  const seenW = new Set([w99(n)]);
  first.concat(shuf(rest, 'nd' + n)).forEach(x => {
    if (x < 0 || x > 99 || x === 1 || x === n) return;
    const w = w99(x);
    if (seenW.has(w)) return;
    seenW.add(w); pool.push(x);
  });
  return pool.slice(0, 3);
}
for (let n = 0; n <= 99; n++) {
  const g = numGroup(n), lvl = numLevel(n), note = numNote(n), pat = n <= 20 ? 'basis' : n <= 49 ? 'enere-foerst' : 'boss-' + (Math.floor(n / 10) * 10);
  const w = w99(n), id = pad(n);
  if (n !== 1) {
    add('tal', {
      id: 't-vaelg-' + id, level: lvl, group: g, kind: 'num_to_word', pattern: pat,
      prompt_da: 'Hvilket ord passer til tallet?', show: String(n),
      options: [w].concat(numDistractors(n).map(x => w99(x))), correct: w, tts: w, note
    });
    const acc = [w];
    if (n >= 50 && n % 10 !== 0 || (n >= 50 && n % 10 === 0)) { const l = w99(n, true); if (l !== w) acc.push(l); }
    if (n === 40) acc.push('fyrretyve');
    add('tal', {
      id: 't-skriv-ord-' + id, level: maxLv(lvl, n >= 21 ? 'A2' : 'A1'), group: g, kind: 'type_word', pattern: pat,
      prompt_da: 'Skriv tallet med bogstaver.', show: String(n), input: 'text',
      accepted_answers: acc, correct: w, tts: w, note
    });
  }
  add('tal', {
    id: 't-skriv-tal-' + id, level: lvl, group: g, kind: 'word_to_num', pattern: pat,
    prompt_da: 'Skriv tallet med cifre.', show: w, tts_prompt: w, input: 'text', numeric: true,
    accepted_answers: [String(n)], correct: String(n), tts: w, note
  });
}
// hundreds (MC only; B1)
[100, 125, 150, 200, 250, 300, 375, 400, 450, 500, 600, 675, 700, 800, 850, 900, 999].forEach(n => {
  const w = w999(n);
  const h = Math.floor(n / 100), r = n % 100;
  const c = [];
  if (r >= 10 && r % 11 !== 0 && r % 10 !== 0) c.push(h * 100 + (r % 10) * 10 + Math.floor(r / 10));
  if (r) c.push(h * 100 + (r >= 50 ? r - 20 : r + 20));
  c.push((h === 9 ? h - 1 : h + 1) * 100 + r);
  c.push(h * 100 + (r ? 0 : 50));
  c.push(h * 100 + (r ? (r + 5 > 99 ? r - 5 : r + 5) : 25));
  const seen = new Set([w]), opts = [];
  c.forEach(x => { if (x < 100 || x > 999 || x === n) return; const xw = w999(x); if (seen.has(xw)) return; seen.add(xw); opts.push(xw); });
  const note = n === 100 ? 'Hundrede (100) kan også siges "et hundrede".' : r ? (h === 1 ? 'I tal over hundrede står "og" foran de sidste to cifre: ' : 'Hundredtallet siges først, og "og" står foran de sidste to cifre: ') + w + ' (' + n + ').' : 'Tallet før "hundrede" siges først: ' + w + ' (' + n + ').';
  add('tal', {
    id: 't-hundrede-' + n, level: 'B1', group: 'hundreder', kind: 'num_to_word', pattern: 'hundrede',
    prompt_da: 'Hvilket ord passer til tallet?', show: String(n),
    options: [w].concat(opts.slice(0, 3)), correct: w, tts: w, note
  });
});

// ---------------- ÅRSTAL OG ORDENSTAL ----------------
// years
const YEAR_CTX = [
  ['Grundloven blev underskrevet i ___.', 1849], ['Danmark blev medlem af EU i ___.', 1973], ['Danmark blev befriet i ___.', 1945],
  ['Sønderjylland blev genforenet med Danmark i ___.', 1920], ['Kvinder fik valgret ved Grundloven i ___.', 1915],
  ['Øresundsbroen åbnede i ___.', 2000], ['Tivoli åbnede i ___.', 1843], ['Slaget ved Dybbøl var i ___.', 1864],
  ['Reformationen kom til Danmark i ___.', 1536], ['Margrethe blev dronning i ___.', 1972], ['Frederik blev konge i ___.', 2024],
  ['H.C. Andersen blev født i ___.', 1805], ['Lego blev grundlagt i ___.', 1932], ['Danmark blev europamester i fodbold i ___.', 1992],
  ['Danmark blev medlem af NATO i ___.', 1949], ['Cityringen i København åbnede i ___.', 2019],
  ['Jeg er født i ___.', 1985], ['Min mormor er født i ___.', 1951], ['Min far er født i ___.', 1963], ['Min bror er født i ___.', 1994],
  ['Vi flyttede til Danmark i ___.', 2012], ['Huset blev bygget i ___.', 1978], ['Hun begyndte på universitetet i ___.', 2009],
  ['Vi købte vores første bil i ___.', 2003], ['Min søster blev gift i ___.', 2017], ['Han fik sit første job i ___.', 1999],
  ['Skolen blev bygget i ___.', 1924], ['Min kusine er født i ___.', 2006], ['Jeg begyndte at lære dansk i ___.', 2023],
  ['Broen blev renoveret i ___.', 2021], ['Min onkel flyttede til København i ___.', 1987], ['Cykelstien åbnede i ___.', 2014],
  ['Kirken blev bygget i ___.', 1912], ['Min morfar er født i ___.', 1938], ['Vi mødte hinanden i ___.', 2002], ['Firmaet blev grundlagt i ___.', 1967],
  ['Hun rejste til Grønland i ___.', 2018], ['Biblioteket åbnede i ___.', 1996], ['Jeg flyttede hjemmefra i ___.', 2008], ['Vi holdt bryllup i ___.', 2022]
];
function yearDistractors(y) {
  const r = y % 100, c = Math.floor(y / 100);
  const mk = (cc, rr) => cc >= 20 ? yearWord(2000 + rr) : yearWord(cc * 100 + rr);
  const cand = [];
  if (y < 2000) {
    if (r >= 10 && r % 11 !== 0 && r % 10 !== 0) cand.push(c * 100 + (r % 10) * 10 + Math.floor(r / 10));
    cand.push((c - 1) * 100 + r);
    cand.push(c * 100 + (r >= 50 ? r - 10 : r + 10));
    cand.push(c * 100 + (r >= 99 ? r - 1 : r + 1));
    cand.push(c * 100 + (r >= 80 ? r - 20 : r + 20));
  } else {
    if (r >= 10 && r % 11 !== 0 && r % 10 !== 0) cand.push(2000 + (r % 10) * 10 + Math.floor(r / 10));
    cand.push(1900 + r);
    cand.push(2000 + (r >= 20 ? r - 10 : r + 10));
    cand.push(2000 + (r >= 99 ? r - 1 : r + 1));
    cand.push(2000 + (r >= 20 ? r - 5 : r + 5));
  }
  const seen = new Set([yearWord(y)]), out = [];
  cand.forEach(x => { if (x === y) return; const w = yearWord(x); if (seen.has(w)) return; seen.add(w); out.push(w); });
  if (out.length < 3) throw new Error('year distractors ' + y);
  return out.slice(0, 3);
}
function yearNote(y) {
  const r = y % 100;
  if (y >= 2000) return r ? 'Årstal efter 2000 siges som "totusind og ..." plus de to sidste cifre: ' + yearWord(y) + '.' : 'Årstallet 2000 siges "totusind".';
  return r ? 'Årstal før 2000 siges i hundreder: ' + w99(Math.floor(y / 100)) + 'hundrede og ' + w99(r) + ' (' + y + ').' : 'Årstal før 2000 siges i hundreder: ' + yearWord(y) + '.';
}
YEAR_CTX.forEach((c, i) => {
  const y = c[1], w = yearWord(y);
  add('aarstal', {
    id: 'a-aarstal-' + y, level: y >= 2000 ? 'B1' : 'A2', group: 'aarstal', kind: 'cloze_mc', pattern: 'aarstal',
    prompt_da: 'Vælg, hvordan årstallet siges.', sentence_da: c[0], show: String(y),
    options: [w].concat(yearDistractors(y)), correct: w, tts: c[0].replace('___', w), note: yearNote(y), verify: true
  });
});
// typed: spoken year -> digits (every 2nd year, shifted so they differ in sentence form)
YEAR_CTX.forEach((c, i) => {
  if (i % 2 !== 0) return;
  const y = c[1], w = yearWord(y);
  add('aarstal', {
    id: 'a-aarstal-skriv-' + y, level: y >= 2000 ? 'B1' : 'A2', group: 'aarstal', kind: 'year_to_digits', pattern: 'aarstal',
    prompt_da: 'Skriv årstallet med cifre.', show: w, tts_prompt: w, input: 'text', numeric: true,
    accepted_answers: [String(y)], correct: String(y), tts: w, note: yearNote(y), verify: true
  });
});

// ordinals
const ORD_U = { 1: 'første', 2: 'anden', 3: 'tredje', 4: 'fjerde', 5: 'femte', 6: 'sjette', 7: 'syvende', 8: 'ottende', 9: 'niende', 10: 'tiende', 11: 'ellevte', 12: 'tolvte', 13: 'trettende', 14: 'fjortende', 15: 'femtende', 16: 'sekstende', 17: 'syttende', 18: 'attende', 19: 'nittende', 20: 'tyvende' };
function ord(n) {
  if (ORD_U[n]) return ORD_U[n];
  if (n === 30) return 'tredivte';
  if (n > 20 && n < 30) return U[n - 20] + 'og' + 'tyvende';
  if (n === 31) return 'enogtredivte';
  throw new Error('ord ' + n);
}
function ordNote(n) {
  if (n === 1) return 'Datoer og rækkefølge siges med ordenstal: første, ikke "en".';
  if (n === 2) return 'Ordenstallet 2. hedder anden foran fælleskønsord og andet foran intetkønsord.';
  if (n === 3) return 'Tredje (3.) er uregelmæssigt: ikke "treende".';
  if (n === 4) return 'Fjerde (4.) er uregelmæssigt: ikke "fireende".';
  if (n === 5) return 'Femte (5.): fem + -te, ikke "femende".';
  if (n === 6) return 'Sjette (6.) er uregelmæssigt: ikke "seksende".';
  if (n >= 7 && n <= 10) return ord(n)[0].toUpperCase() + ord(n).slice(1) + ' (' + n + '.): dannet med -ende.';
  if (n === 11 || n === 12) return 'Ellevte og tolvte (11. og 12.) er uregelmæssige og ender på -te.';
  if (n >= 13 && n <= 19) return ord(n)[0].toUpperCase() + ord(n).slice(1) + ' (' + n + '.): 13.–19. ender på -ende.';
  if (n === 20) return 'Tyvende (20.): tyve + -ende.';
  if (n > 20 && n < 30) return 'Ordenstal i 20’erne: enerne først, og så tyvende: ' + ord(n) + ' (' + n + '.).';
  return 'Tredivte (30.) og enogtredivte (31.) ender på -te, ikke -ende.';
}
for (let n = 1; n <= 31; n++) {
  if (n === 2) continue;
  const w = ord(n);
  const card = w99(n);
  const nb = [n + 1, n - 1, n + 2, n - 2].filter(x => x >= 1 && x <= 31);
  const opts = [card];
  shuf(nb, 'ord' + n).forEach(x => { if (opts.length < 3) opts.push(ord(x)); });
  // ensure 3 distractors
  [n + 3, n - 3, n + 4].forEach(x => { if (opts.length < 3 && x >= 1 && x <= 31) opts.push(ord(x)); });
  add('aarstal', {
    id: 'a-ordenstal-' + pad(n), level: n <= 10 ? 'A2' : 'B1', group: 'ordenstal', kind: 'num_to_word', pattern: 'ordenstal',
    prompt_da: 'Vælg ordenstallet.', show: n + '.',
    options: [w].concat(opts), correct: w, tts: w, note: ordNote(n), verify: n >= 30
  });
}
// hand-written ordinal cloze items [sentence, hint, correct, wrongs, level, note]
const ORD_CLOZE = [
  ['Min fødselsdag er den ___ maj.', '1.', 'første', ['en', 'først'], 'A2', 'Datoer siges med ordenstal: den første maj, ikke "den en maj".'],
  ['Hun har sin ___ dag på det nye job.', '1.', 'første', ['en', 'først'], 'A2', 'Rækkefølge udtrykkes med ordenstal: første dag, ikke "en dag".'],
  ['___ juledag er den 25. december.', '1.', 'Første', ['En', 'Først'], 'A2', 'Helligdage hedder første og anden: første juledag, anden juledag.'],
  ['___ juledag er den 26. december.', '2.', 'Anden', ['Andet', 'To'], 'A2', 'Dag er et fælleskønsord, så 2. hedder anden: anden juledag.'],
  ['Han bor på ___ sal.', '2.', 'anden', ['andet', 'to'], 'A2', 'Sal er et fælleskønsord (en sal), så 2. hedder anden.'],
  ['Det er hendes ___ barn.', '2.', 'andet', ['anden', 'to'], 'A2', 'Barn er et intetkønsord (et barn), så 2. hedder andet.'],
  ['Det er hans ___ år i Danmark.', '2.', 'andet', ['anden', 'to'], 'A2', 'År er et intetkønsord (et år), så 2. hedder andet.'],
  ['Det er den ___ dag i træk, det sner.', '2.', 'anden', ['andet', 'to'], 'A2', 'Dag er et fælleskønsord (en dag), så 2. hedder anden.'],
  ['Dronning Margrethe den ___ blev født i 1940.', '2.', 'Anden', ['Andet', 'To'], 'A2', 'Efter et regentnavn skrives ordenstallet med stort: Margrethe den Anden.', true],
  ['Nu ringer han for ___ gang i dag.', '3.', 'tredje', ['tre', 'tredive'], 'A2', 'Gentagelser tælles med ordenstal: for første, anden, tredje gang.'],
  ['Marts er den ___ måned i året.', '3.', 'tredje', ['tre', 'tredive'], 'A2', 'Rækkefølge udtrykkes med ordenstal: den tredje måned.'],
  ['Det er min ___ dag på arbejdet.', '4.', 'fjerde', ['fire', 'fjorten'], 'A2', 'Rækkefølge udtrykkes med ordenstal: fjerde, ikke fire.'],
  ['Hun bor på ___ etage.', '5.', 'femte', ['fem', 'femten'], 'A2', 'Etager tælles med ordenstal: femte etage.'],
  ['Det var den ___ gang, jeg så filmen.', '5.', 'femte', ['fem', 'femten'], 'A2', 'Gentagelser tælles med ordenstal: for femte gang.'],
  ['Vi sidder på ___ række.', '6.', 'sjette', ['seksende', 'seks'], 'A2', 'Ordenstallet 6. er uregelmæssigt: sjette, ikke "seksende".'],
  ['Søndag er ugens ___ dag.', '7.', 'syvende', ['syv', 'syttende'], 'A2', 'Ordenstal på 7.–10. ender på -ende: syvende.'],
  ['Børnene går i ___ klasse.', '8.', 'ottende', ['otte', 'attende'], 'A2', 'Klassetrin siges med ordenstal: ottende klasse.'],
  ['Hun går i ___ klasse.', '9.', 'niende', ['ni', 'nittende'], 'A2', 'Klassetrin siges med ordenstal: niende klasse.'],
  ['Oktober er den ___ måned i året.', '10.', 'tiende', ['ti', 'tyvende'], 'A2', 'Rækkefølge udtrykkes med ordenstal: den tiende måned.'],
  ['Kongen hedder Frederik den ___.', '10.', 'Tiende', ['Ti', 'Niende'], 'A2', 'Efter et regentnavn skrives ordenstallet med stort: Frederik den Tiende.', true],
  ['Christian den ___ var konge fra 1912 til 1947.', '10.', 'Tiende', ['Niende', 'Ti'], 'B1', 'Efter et regentnavn skrives ordenstallet med stort: Christian den Tiende.', true],
  ['Hun løber sit ___ maraton i år.', '11.', 'ellevte', ['elleve', 'ellevende'], 'B1', 'Ordenstallene 11. og 12. er uregelmæssige: ellevte, tolvte.'],
  ['December er den ___ måned i året.', '12.', 'tolvte', ['tolv', 'trettende'], 'B1', 'Ordenstallene 11. og 12. er uregelmæssige: ellevte, tolvte.'],
  ['H.C. Andersen levede i det ___ århundrede.', '19.', 'nittende', ['nitten', 'attende'], 'B1', 'Århundreder siges med ordenstal: det nittende århundrede.'],
  ['Det ___ århundrede varede fra 1901 til 2000.', '20.', 'tyvende', ['tyve', 'nittende'], 'B1', 'Århundreder siges med ordenstal: det tyvende århundrede.'],
  ['Vi lever i det ___ århundrede.', '21.', 'enogtyvende', ['enogtyve', 'tyvende'], 'B1', 'Ordenstal i 20’erne: enerne først, så tyvende: enogtyvende.']
];
ORD_CLOZE.forEach(c => {
  add('aarstal', {
    id: 'a-ordenstal-saetning-' + slug(c[0].replace('___', c[2])), level: c[4], group: 'ordenstal', kind: 'cloze_mc', pattern: 'ordenstal',
    prompt_da: 'Vælg det rigtige ordenstal.', sentence_da: c[0], show: c[1],
    options: [c[2]].concat(c[3]), correct: c[2], tts: c[0].replace('___', c[2]), note: c[5], verify: c[6] ? true : undefined
  });
});

// dates
const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const DIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const HOL = [
  [24, 12, 'Juleaften er den ___ december.'], [25, 12, 'Første juledag er den ___ december.'], [26, 12, 'Anden juledag er den ___ december.'],
  [23, 12, 'Lillejuleaften er den ___ december.'], [31, 12, 'Nytårsaften er den ___ december.'], [1, 1, 'Nytårsdag er den ___ januar.'],
  [5, 6, 'Grundlovsdag er den ___ juni.'], [23, 6, 'Sankt Hans aften er den ___ juni.'], [1, 5, 'Arbejdernes internationale kampdag er den ___ maj.'],
  [5, 5, 'Danmarks befrielse markeres den ___ maj.'], [10, 11, 'Mortens aften er den ___ november.'], [13, 12, 'Luciadag er den ___ december.'],
  [14, 2, 'Valentinsdag er den ___ februar.'], [15, 6, 'Valdemarsdag er den ___ juni.']
];
const GEN_T = ['Mødet er den ___ ', 'Eksamen er den ___ ', 'Vi flytter den ___ ', 'Tandlægen har tid den ___ ', 'Min fødselsdag er den ___ ', 'Kurset starter den ___ ', 'Bryllupet er den ___ ', 'Vi rejser den ___ '];
const GEN = [[3, 3], [7, 4], [12, 9], [17, 3], [8, 10], [20, 1], [9, 5], [28, 2], [4, 7], [15, 8], [22, 11], [30, 4], [6, 6], [11, 12], [19, 5], [27, 9], [2, 10], [14, 3], [21, 7], [31, 8], [16, 11], [25, 6], [18, 2], [29, 10], [13, 1], [10, 7], [26, 3], [1, 9], [23, 4], [5, 12]];
function dateItem(d, m, sentence, nm) {
  if (d > DIM[m - 1]) throw new Error('bad date ' + d + '.' + m);
  const w = ord(d), card = w99(d);
  const nb = [d + 1, d - 1, d + 2, d - 2].filter(x => x >= 1 && x <= 31);
  const opts = [card];
  shuf(nb, 'dt' + d + m).forEach(x => { if (opts.length < 3) opts.push(ord(x)); });
  [d + 3, d - 3].forEach(x => { if (opts.length < 3 && x >= 1 && x <= 31) opts.push(ord(x)); });
  add('aarstal', {
    id: 'a-dato-' + pad(d) + '-' + pad(m), level: d <= 12 ? 'A2' : 'B1', group: 'datoer', kind: 'cloze_mc', pattern: 'dato',
    prompt_da: 'Vælg, hvordan datoen siges.', sentence_da: sentence, show: d + '. ' + MONTHS[m - 1],
    options: [w].concat(opts), correct: w, tts: sentence.replace('___', w),
    note: 'Datoer siges med ordenstal: den ' + w + ' ' + MONTHS[m - 1] + ', ikke med grundtallet.' , verify: d >= 30
  });
}
const usedDates = new Set();
HOL.forEach(h => { dateItem(h[0], h[1], h[2]); usedDates.add(h[0] + '.' + h[1]); });
GEN.forEach((g, i) => {
  if (usedDates.has(g[0] + '.' + g[1])) return;
  usedDates.add(g[0] + '.' + g[1]);
  dateItem(g[0], g[1], GEN_T[i % GEN_T.length] + MONTHS[g[1] - 1] + '.');
});

// prices
function priceWord(kr, ore) {
  let s = kr === 1 ? 'en krone' : w999(kr) + ' kroner';
  if (ore) s += ' og ' + w99(ore) + ' øre';
  return s;
}
function priceDigits(kr, ore) { return ore ? kr + ',' + pad(ore) + ' kr.' : kr + ' kr.'; }
const PRICES = [
  ['En kop kaffe koster ___.', 35, 0], ['Et rugbrød koster ___.', 28, 0], ['En liter mælk koster ___.', 13, 0], ['Et æble koster ___.', 4, 0],
  ['En busbillet koster ___.', 24, 0], ['Pant for en flaske er ___.', 1, 0], ['En pizza koster ___.', 85, 0], ['En billet til biografen koster ___.', 110, 0],
  ['En bog koster ___.', 199, 0], ['En T-shirt koster ___.', 149, 0], ['Et par sko koster ___.', 450, 0], ['En flaske vand koster ___.', 12, 0],
  ['Et stykke kage koster ___.', 38, 0], ['En kop te koster ___.', 32, 0], ['En is koster ___.', 25, 0], ['En kebab koster ___.', 60, 0],
  ['Et brev koster ___ i porto.', 17, 0], ['En cykelreparation koster ___.', 275, 0], ['En paraply koster ___.', 99, 0], ['Et glas øl koster ___.', 45, 0],
  ['En sandwich koster ___.', 55, 0], ['Et pizzastykke koster ___.', 20, 0], ['En taske koster ___.', 399, 0], ['En kop kakao koster ___.', 42, 0],
  ['En avis koster ___.', 30, 0], ['En lommebog koster ___.', 250, 0], ['En fødselsdagsgave koster ___.', 75, 0], ['En kuglepen koster ___.', 8, 0],
  ['En bolle koster ___.', 7, 50], ['En kop kaffe koster ___.', 21, 0], ['En chokoladebar koster ___.', 12, 50], ['En pose slik koster ___.', 19, 95],
  ['Et rundstykke koster ___.', 5, 25], ['En lille flaske sodavand koster ___.', 11, 75], ['En gulerod koster ___.', 2, 50], ['En banan koster ___.', 3, 95],
  ['En hel kage koster ___.', 125, 0], ['En sodavand koster ___.', 16, 0], ['Et par handsker koster ___.', 89, 0], ['En togbillet koster ___.', 71, 0],
  ['En weekendbillet koster ___.', 999, 0], ['En cykellygte koster ___.', 65, 0]
];
function priceDistractors(kr, ore) {
  const out = []; const seen = new Set([priceWord(kr, ore)]);
  const cand = [];
  if (ore) { cand.push([kr, ore >= 50 ? ore - 25 : ore + 25]); cand.push([kr + 1, ore]); cand.push([kr - 1 > 0 ? kr - 1 : kr + 2, ore]); cand.push([kr + 5, ore]); }
  else {
    const t = Math.floor(kr / 10), o = kr % 10;
    if (kr >= 10 && o !== 0 && o !== t) cand.push([o * 10 + t, 0]);
    if (kr >= 100) {
      const h = Math.floor(kr / 100), r = kr % 100;
      cand.push([h * 100 + (r >= 50 ? r - 20 : r + 20), 0]); cand.push([(h === 9 ? h - 1 : h + 1) * 100 + r, 0]); cand.push([h * 100 + (r >= 95 ? r - 5 : r + 5), 0]); cand.push([h * 100 + (r ? 0 : 50), 0]);
    } else {
      cand.push([kr + 10, 0]); cand.push([kr - 10, 0]); cand.push([kr + 1, 0]); cand.push([kr - 1, 0]); cand.push([kr + 20, 0]); cand.push([kr - 20, 0]); cand.push([kr + 5, 0]);
    }
  }
  const ordered = (cand.length ? [cand[0]].concat(shuf(cand.slice(1), 'pr' + kr + ore)) : []);
  ordered.forEach(c => {
    if (c[0] < 1 || (c[0] === kr && c[1] === ore)) return;
    const w = priceWord(c[0], c[1]); if (seen.has(w)) return; seen.add(w); out.push(w);
  });
  if (kr === 1 && !ore) { const w = 'en kroner'; if (!seen.has(w)) { out.unshift(w); } }
  if (out.length < 3) throw new Error('price distractors ' + kr + ',' + ore);
  return out.slice(0, 3);
}
function priceNote(kr, ore) {
  if (kr === 1 && !ore) return 'Ved 1 hedder det "en krone" i ental; fra 2 og op hedder det "kroner".';
  if (ore) return 'Kroner og øre siges hver for sig, forbundet med "og": ' + priceWord(kr, ore) + '.';
  if (kr >= 100) return 'Hundredtallet siges først, og "og" kommer før de sidste to cifre: ' + priceWord(kr, ore) + '.';
  if (kr % 10 !== 0 && kr > 20) return 'Enerne siges først: ' + w99(kr) + '. Efter tallet står "kroner" i flertal.';
  return 'Efter et tal over 1 står "kroner" i flertal: ' + priceWord(kr, ore) + '.';
}
PRICES.forEach(p => {
  const kr = p[1], ore = p[2], w = priceWord(kr, ore);
  const id = 'a-pris-' + kr + (ore ? '-' + pad(ore) : '') + '-' + slug(p[0].split(' koster')[0].split(' er')[0]);
  add('aarstal', {
    id, level: ore || kr >= 100 ? 'B1' : 'A2', group: 'priser', kind: 'cloze_mc', pattern: 'pris',
    prompt_da: 'Vælg, hvordan prisen siges.', sentence_da: p[0], show: priceDigits(kr, ore),
    options: [w].concat(priceDistractors(kr, ore)), correct: w, tts: p[0].replace('___', w), note: priceNote(kr, ore), verify: !!ore
  });
});
// typed prices: words -> digits
[[35, 0], [13, 0], [85, 0], [199, 0], [24, 0], [450, 0], [60, 0], [75, 0], [149, 0], [7, 50], [19, 95], [2, 50], [125, 0], [1, 0], [99, 0], [12, 50]].forEach(p => {
  const kr = p[0], ore = p[1], w = priceWord(kr, ore);
  const base = ore ? kr + ',' + pad(ore) : String(kr);
  const acc = ore ? [base, base + ' kr', base + ' kr.'] : [base, base + ' kr', base + ' kr.', base + ',-', base + ',00', base + ',00 kr.'];
  add('aarstal', {
    id: 'a-pris-skriv-' + kr + (ore ? '-' + pad(ore) : ''), level: ore || kr >= 100 ? 'B1' : 'A2', group: 'priser', kind: 'price_to_digits', pattern: 'pris',
    prompt_da: 'Skriv prisen med cifre.', show: w, tts_prompt: w, input: 'text', numeric: true,
    accepted_answers: acc, correct: ore ? base + ' kr.' : kr + ' kr.', tts: w, note: priceNote(kr, ore), verify: !!ore
  });
});

// ---------------- validate + write ----------------
const errs = [];
const all = [];
Object.keys(items).forEach(k => items[k].forEach(it => all.push(it)));
const ids = new Set();
all.forEach(it => {
  if (ids.has(it.id)) errs.push('dup id ' + it.id); ids.add(it.id);
  if (!LV[it.level]) errs.push('level ' + it.id);
  if (!it.note) errs.push('note ' + it.id);
  if (it.options) {
    if (it.options.indexOf(it.correct) === -1) errs.push('correct not in options ' + it.id);
    if (new Set(it.options.map(o => String(o).toLowerCase())).size !== it.options.length) errs.push('dup options ' + it.id);
    if (it.options.length !== 4 && !(it.kind === 'cloze_mc' && it.options.length >= 3)) errs.push('option count ' + it.id + ' ' + it.options.length);
  } else if (!it.accepted_answers || !it.accepted_answers.length) errs.push('no accepted ' + it.id);
});
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }

const header = '// tal-og-tid/data.js\n// Tal og tid dataset - window.TALOGTID_DATA. GENERATED by scripts/gen-tal-og-tid-data.js (programmatic number/clock words + hand-written contexts); edit the generator, not this file.\n' +
  '// keys = mode: klokken, tal, aarstal. Item ids are stable slugs; progress keys are tal-og-tid:<mode>:<id>. Options keep source order (the game shuffles).\n' +
  '// verify:true = needs native-speaker review (spelling of year words, 30./31., ore amounts).\n';
let out = header + '(function () {\n  \'use strict\';\n  window.TALOGTID_DATA = {\n';
Object.keys(items).forEach((k, i, arr) => {
  out += '    ' + k + ': [\n' + items[k].map(it => '      ' + JSON.stringify(it)).join(',\n') + '\n    ]' + (i < arr.length - 1 ? ',' : '') + '\n';
});
out += '  };\n})();\n';
fs.writeFileSync(OUT, out);
const cnt = {}; Object.keys(items).forEach(k => { cnt[k] = items[k].length; const g = {}; items[k].forEach(it => { g[it.group] = (g[it.group] || 0) + 1; }); cnt[k + '_groups'] = g; });
console.log(JSON.stringify(cnt));
