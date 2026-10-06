// Corpus validator for Laeseforstaaelse. Dependency-free (node built-ins), no network, <1 s.
//   node tests/laeseforstaaelse-data.mjs                       validate <repo>/laeseforstaaelse
//   node tests/laeseforstaaelse-data.mjs --dir=<path>          validate another folder (fixtures)
//   node tests/laeseforstaaelse-data.mjs --expect=1,1,1,1      exact text counts: skim,mc,insert,cloze
//   node tests/laeseforstaaelse-data.mjs --selftest            run tests/fixtures/laese/good + bad
// Exit 0 = valid, 1 = at least one FAIL. Every FAIL line starts with a [rule-name] tag.
// Rules come from .claude/skills/laese-text-authoring/SKILL.md (banned phrases, no quotes,
// no byline, length/variance, counts) and the schemas in the design reference.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const FIXTURES = path.join(HERE, 'fixtures', 'laese');

const MODES = ['skim', 'mc', 'insert', 'cloze'];
const CORPUS = { skim: ['data-skim.js', 'LAESE_SKIM'], mc: ['data-mc.js', 'LAESE_MC'],
                 insert: ['data-insert.js', 'LAESE_INSERT'], cloze: ['data-cloze.js', 'LAESE_CLOZE'] };
const REGISTRY = 'data.js';

// SKILL.md section 3. Lowercase; matched on word boundaries, whitespace-insensitive.
const BANNED = [
  'i dag er', 'i dag står', 'i en verden hvor', 'mere end nogensinde',
  'det er ingen hemmelighed', 'når man taler om', 'gennem tiderne',
  'sammenfattende', 'alt i alt kan man sige', 'kun tiden vil vise',
  'én ting er sikkert', 'det store spørgsmål er', 'fremtiden vil vise',
  'det er vigtigt at bemærke', 'det er værd at nævne',
  'spiller en afgørende rolle', 'en central del af', 'i takt med at samfundet'
];
const CAPPED = ['derudover', 'endvidere', 'ligeledes'];            // max 1 per text
const OPENERS = new Set(['derudover', 'endvidere', 'ligeledes', 'desuden', 'samtidig', 'dermed', 'derfor',
  'imidlertid', 'således', 'herudover', 'yderligere', 'ydermere', 'tilmed', 'alligevel', 'dertil', 'hermed', 'følgelig']);
const GENRES = ['forklaring', 'reportage', 'overblik', 'baggrund'];
const GAP_TYPES = ['kontrast', 'konsekvens', 'praecisering', 'tilfoejelse', 'tid'];
const NORMALSIDE = 2400;
const QUOTES = /["»«„“”]/;
// Rules every selftest run must have a bad fixture for.
const REQUIRED_BAD = ['banned-phrase', 'quotation-mark', 'byline', 'gap-count', 'unknown-block',
  'marker-order', 'duplicate-id', 'missing-sources', 'notice-length', 'option-count'];

// ---------- text helpers
const nfc = s => String(s == null ? '' : s).normalize('NFC');
const ABBR = /\b(kl|ca|nr|f\.eks|bl\.a|m\.fl|osv|mv|dvs|jf|tlf|evt|inkl|pr|st|kr)\./gi;
const sentences = s => nfc(s).replace(ABBR, m => m.slice(0, -1) + '\u0001')
  .split(/(?<=[.!?])\s+(?=[A-ZÆØÅ0-9{])/).map(x => x.replace(/\u0001/g, '.').trim()).filter(Boolean);
const wordCount = s => s.split(/\s+/).filter(Boolean).length;
const firstWord = s => (nfc(s).match(/^[^\p{L}]*([\p{L}]+)/u) || [, ''])[1].toLowerCase();
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const phraseRe = p => new RegExp('(?<![\\p{L}])' + escRe(p).replace(/ /g, '\\s+') + '(?![\\p{L}])', 'giu');
const isStr = v => typeof v === 'string' && v.trim().length > 0;
const isInt = v => Number.isInteger(v);

// The prose a reader sees, with cloze markers filled by the correct option and
// insert blocks that solve a gap included. Distractor blocks are not part of the text.
function prose(t) {
  let paras = Array.isArray(t.paragraphs) ? t.paragraphs.filter(p => typeof p === 'string') : [];
  if (t.mode === 'cloze' && Array.isArray(t.gaps)) {
    paras = paras.map(p => p.replace(/\{\{(\d+)\}\}/g, (m, n) => {
      const g = t.gaps[+n - 1];
      return g && Array.isArray(g.options) && typeof g.options[g.correct] === 'string' ? g.options[g.correct] : m;
    }));
  }
  if (t.mode === 'insert' && Array.isArray(t.blocks) && t.solution && typeof t.solution === 'object') {
    const used = new Set(Object.values(t.solution));
    paras = paras.concat(t.blocks.filter(b => b && used.has(b.id) && typeof b.text === 'string').map(b => b.text));
  }
  return paras;
}

// ---------- loading
function load(dir) {
  const errors = [];
  const win = {}; win.window = win;
  const ctx = vm.createContext({ window: win, console });
  const run = (f) => {
    const p = path.join(dir, f);
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p, timeout: 1000 }); return true; }
    catch (e) { errors.push({ rule: 'load-error', id: f, msg: `failed to load: ${e.message}` }); return false; }
  };
  for (const m of MODES) {
    const [f, g] = CORPUS[m];
    if (!fs.existsSync(path.join(dir, f))) continue;               // corpus arrives task by task
    if (run(f) && !Array.isArray(win[g])) errors.push({ rule: 'corpus-global', id: f, msg: `window.${g} is not an array after loading ${f}` });
  }
  if (!fs.existsSync(path.join(dir, REGISTRY))) {
    errors.push({ rule: 'missing-file', id: REGISTRY, msg: `missing data file: ${REGISTRY} (looked in ${dir})` });
    return { DATA: null, errors };
  }
  run(REGISTRY);
  const DATA = win.LAESE_DATA;
  if (!DATA || typeof DATA !== 'object') {
    errors.push({ rule: 'registry', id: REGISTRY, msg: 'window.LAESE_DATA was never assigned by data.js' });
    return { DATA: null, errors };
  }
  return { DATA, errors };
}

// ---------- validation
function validate(dir, expect) {
  const { DATA, errors } = load(dir);
  const warns = [];
  const fail = (rule, id, msg) => errors.push({ rule, id, msg });
  const warn = (id, msg) => warns.push({ id, msg });
  const counts = [0, 0, 0, 0];
  if (!DATA) return { errors, warns, counts };

  const seen = new Set();
  const checkId = (owner, id, prefix) => {
    if (!isStr(id)) return fail('bad-id', owner, 'missing id');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) fail('bad-id', owner, `id not kebab-case: ${id}`);
    if (prefix && !id.startsWith(prefix)) fail('bad-id', owner, `id ${id} must start with ${prefix}`);
    if (seen.has(id)) fail('duplicate-id', owner, `duplicate id: ${id}`);
    seen.add(id);
  };

  const checkCommon = (t) => {
    const id = t.id;
    if (!isStr(t.title)) fail('title', id, 'missing title');
    if (!['B1', 'B2'].includes(t.level)) fail('level', id, `level must be B1 or B2, got ${t.level}`);
    if (!Array.isArray(t.sources) || !t.sources.length) fail('missing-sources', id, 'sources[] is empty or missing');
    else for (const u of t.sources) if (typeof u !== 'string' || !/^https?:\/\/\S+$/.test(u)) fail('bad-source-url', id, `source is not an http(s) URL: ${u}`);
    if (t.verify !== undefined && typeof t.verify !== 'boolean') fail('verify-type', id, 'verify must be a boolean when present');

    // banned phrases and capped connectors on everything the learner reads
    const paras = prose(t);
    const readable = [t.title, t.kicker || '', ...paras, ...(t.notices || []).flatMap(n => [n && n.heading, n && n.body]),
      ...(t.questions || []).map(q => q && q.q)].filter(s => typeof s === 'string').map(nfc).join('\n');
    for (const b of BANNED) if (phraseRe(b).test(readable)) fail('banned-phrase', id, `banned phrase: "${b}"`);
    for (const c of CAPPED) {
      const n = (readable.match(phraseRe(c)) || []).length;
      if (n > 1) fail('capped-connector', id, `"${c}" used ${n} times, max 1`);
    }
  };

  const checkArticle = (t) => {
    const id = t.id;
    if (!Array.isArray(t.paragraphs) || t.paragraphs.length < 4 || !t.paragraphs.every(isStr)) fail('paragraph-count', id, 'needs at least 4 non-empty paragraph strings');
    if (!isStr(t.kicker)) fail('kicker', id, 'missing kicker (genre label + topic, e.g. "Overblik · Natur")');
    else if (!/^\S.* · \S/.test(t.kicker)) fail('kicker', id, `kicker should read "<Genre> · <Emne>", got "${t.kicker}"`);
    if (!GENRES.includes(t.genre)) fail('genre', id, `genre must be one of ${GENRES.join('|')}, got ${t.genre}`);
    for (const k of ['byline', 'author', 'forfatter']) if (t[k] !== undefined) fail('byline', id, `"${k}" is not allowed: no invented authors`);

    const quoted = [t.title, t.kicker, ...(t.paragraphs || []), ...(t.blocks || []).map(b => b && b.text)].filter(s => typeof s === 'string');
    if (quoted.some(s => QUOTES.test(s))) fail('quotation-mark', id, 'quotation marks are not allowed in article text (" » « „ “ ”)');

    const paras = prose(t);
    const all = paras.join(' ');
    const sents = paras.flatMap(sentences);
    if (!sents.some(s => wordCount(s) <= 6)) fail('sentence-variance', id, 'no sentence of 6 words or fewer');
    if (!sents.some(s => wordCount(s) >= 25)) fail('sentence-variance', id, 'no sentence of 25 words or more');
    const digits = (all.match(/\d/g) || []).length;
    if (digits < 4) fail('digits', id, `only ${digits} digit characters, needs at least 4 (concrete figures)`);

    const lens = paras.map(p => p.length);
    if (lens.length > 2) {
      const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
      if (Math.max(...lens) - Math.min(...lens) < avg * 0.3) fail('paragraph-variance', id, 'paragraph lengths too uniform (spread < 30 % of mean)');
    }
    if (sents.length >= 8) {
      const share = sents.filter(s => OPENERS.has(firstWord(s))).length / sents.length;
      if (share > 0.4) fail('connector-openings', id, `${Math.round(share * 100)} % of sentences open with a connector (max 40 %)`);
    }
    const dashEnd = paras.filter(p => /\s[–—-]\s[^.!?]*[.!?]?$/.test(sentences(p).slice(-1)[0] || '')).length;
    if (dashEnd >= 2) fail('dash-summary', id, `${dashEnd} paragraphs end in a dash-summary`);
    if (paras.length >= 4) {
      const triple = /(?<![\p{L}-])[\p{L}-]+(?: [\p{L}-]+)?, [\p{L}-]+(?: [\p{L}-]+)?,? og [\p{L}-]+/u;
      const n = paras.filter(p => triple.test(p)).length;
      if (n * 2 >= paras.length) fail('triple-list', id, `${n} of ${paras.length} paragraphs hold an "A, B og C" list (max under half)`);
    }
    if (/[A-ZÆØÅ][a-zæøå]+ (siger|fortæller|mener|slår fast)\b/.test(all.replace(/(^|[.!?]\s+)\S+/g, '$1')))
      warn(id, 'looks like "<Navn> siger" — check there is no invented speaker');
    if (all.length < NORMALSIDE * 1.2) warn(id, `${all.length} chars — under 1.2 normalsider (${NORMALSIDE * 1.2})`);
    if (all.length > NORMALSIDE * 2.8) warn(id, `${all.length} chars — over 2.8 normalsider (${NORMALSIDE * 2.8})`);
  };

  // registry shape
  if (DATA.modes !== undefined) {
    if (!Array.isArray(DATA.modes) || !DATA.modes.every(m => m && MODES.includes(m.key)))
      fail('registry', REGISTRY, 'LAESE_DATA.modes must be an array of entries whose key is skim|mc|insert|cloze');
  }

  MODES.forEach((mode, mi) => {
    if (!Array.isArray(DATA[mode])) return fail('registry', REGISTRY, `LAESE_DATA.${mode} is not an array`);
    counts[mi] = DATA[mode].length;
    for (const t of DATA[mode]) {
      if (!t || typeof t !== 'object') { fail('schema', mode, 'text is not an object'); continue; }
      const id = t.id || '(no id)';
      checkId(id, t.id, null);
      if (t.mode !== mode) fail('mode-mismatch', id, `mode is "${t.mode}" but sits in ${mode}`);
      checkCommon(t);

      if (mode === 'skim') {
        if (!isStr(t.theme)) fail('theme', id, 'missing theme');
        if (typeof t.exam_length !== 'boolean') fail('exam-length', id, 'exam_length must be true or false');
        const notices = Array.isArray(t.notices) ? t.notices : [];
        if (notices.length < 8 || notices.length > 10) fail('notice-count', id, `${notices.length} notices, needs 8-10`);
        for (const n of notices) {
          checkId(id, n && n.id, id + '-n');
          if (!isStr(n.heading)) fail('notice-heading', id, `notice ${n.id} missing heading`);
          const body = nfc(n.body);
          if (body.length < 1200 || body.length > 1800) fail('notice-length', id, `notice ${n.id} is ${body.length} chars, needs 1200-1800`);
          if ((body.match(/\d/g) || []).length < 2) fail('notice-digits', id, `notice ${n.id} has fewer than 2 digits (look-up-able facts)`);
        }
        const qs = Array.isArray(t.questions) ? t.questions : [];
        if (qs.length !== 15) fail('question-count', id, `${qs.length} questions, needs exactly 15`);
        const byId = new Map(notices.map(n => [n.id, n]));
        for (const q of qs) {
          checkId(id, q && q.id, id + '-q');
          if (!isStr(q.q)) fail('question-text', id, `${q.id} missing question text`);
          if (!Array.isArray(q.accepted) || !q.accepted.length || !q.accepted.every(isStr)) fail('accepted', id, `${q.id} needs a non-empty accepted[] of strings`);
          if (!byId.has(q.noticeId)) fail('notice-ref', id, `${q.id} points at unknown notice ${q.noticeId}`);
          else if (Array.isArray(q.accepted) && !q.accepted.some(a => isStr(a) && nfc(byId.get(q.noticeId).body).toLowerCase().includes(nfc(a).trim().toLowerCase())))
            warn(id, `${q.id}: no accepted answer appears verbatim in notice ${q.noticeId}`);
          if (!isStr(q.note)) fail('note-missing', id, `${q.id} missing note`);
        }
      }

      if (mode === 'mc') {
        checkArticle(t);
        const qs = Array.isArray(t.questions) ? t.questions : [];
        if (qs.length !== 3) fail('question-count', id, `${qs.length} questions, needs exactly 3`);
        const np = Array.isArray(t.paragraphs) ? t.paragraphs.length : 0;
        for (const q of qs) {
          checkId(id, q && q.id, id + '-q');
          if (!isStr(q.q)) fail('question-text', id, `${q.id} missing question text`);
          const opts = Array.isArray(q.options) ? q.options : [];
          if (opts.length !== 3 || !opts.every(isStr)) fail('option-count', id, `${q.id} needs exactly 3 non-empty options, has ${opts.length}`);
          if (!isInt(q.correct) || q.correct < 0 || q.correct >= opts.length) fail('correct-range', id, `${q.id} correct ${q.correct} is not an index into options`);
          if (!isInt(q.evidence) || q.evidence < 0 || q.evidence >= np) fail('evidence-range', id, `${q.id} evidence ${q.evidence} is not a 0-based paragraph index`);
          if (new Set(opts.map(o => nfc(o).trim().toLowerCase())).size !== opts.length) fail('duplicate-options', id, `${q.id} has duplicate options`);
          if (!isStr(q.note)) fail('note-missing', id, `${q.id} missing note`);
        }
      }

      if (mode === 'insert') {
        checkArticle(t);
        const gaps = Array.isArray(t.gaps) ? t.gaps : [], blocks = Array.isArray(t.blocks) ? t.blocks : [];
        const np = Array.isArray(t.paragraphs) ? t.paragraphs.length : 0;
        if (gaps.length !== 5) fail('gap-count', id, `${gaps.length} gaps, needs exactly 5`);
        if (blocks.length !== 7) fail('block-count', id, `${blocks.length} blocks, needs 7 (5 solutions + 2 distractors)`);
        for (const b of blocks) {
          checkId(id, b && b.id, id + '-b');
          if (!isStr(b.text) || b.text.length < 80) fail('block-length', id, `block ${b.id} is too short to be a section (<80 chars)`);
        }
        const blockIds = new Set(blocks.map(b => b.id));
        const gapIds = new Set(gaps.map(g => g.id));
        const sol = t.solution && typeof t.solution === 'object' ? t.solution : {};
        for (const k of Object.keys(sol)) if (!gapIds.has(k)) fail('unknown-gap', id, `solution key ${k} is not a gap id`);
        const used = new Set();
        let prev = -1;
        for (const g of gaps) {
          checkId(id, g && g.id, id + '-g');
          if (!isInt(g.after) || g.after < 0 || g.after >= np) fail('gap-position', id, `gap ${g.id} sits after paragraph ${g.after}, which does not exist`);
          else if (g.after <= prev) fail('gap-order', id, `gaps must ascend strictly by after; ${g.id} breaks the order`);
          if (isInt(g.after)) prev = g.after;
          const s = sol[g.id];
          if (!s) fail('missing-solution', id, `gap ${g.id} has no solution`);
          else if (!blockIds.has(s)) fail('unknown-block', id, `gap ${g.id} maps to unknown block ${s}`);
          else if (used.has(s)) fail('duplicate-solution', id, `block ${s} is the solution to two gaps`);
          else used.add(s);
          if (!isStr(g.note)) fail('note-missing', id, `gap ${g.id} missing note`);
        }
        if (gaps.length === 5 && blocks.length === 7 && used.size === 5 && blocks.length - used.size !== 2) fail('unused-blocks', id, 'needs exactly 2 unused distractor blocks');
      }

      if (mode === 'cloze') {
        checkArticle(t);
        const gaps = Array.isArray(t.gaps) ? t.gaps : [];
        if (gaps.length !== 8) fail('gap-count', id, `${gaps.length} gaps, needs exactly 8`);
        const joined = (Array.isArray(t.paragraphs) ? t.paragraphs : []).join('\n');
        const markers = (joined.match(/\{\{\d+\}\}/g) || []).map(m => +m.slice(2, -2));
        const stray = (joined.replace(/\{\{\d+\}\}/g, '').match(/\{\{|\}\}/g) || []).length;
        const want = Array.from({ length: gaps.length }, (_, i) => i + 1);
        if (markers.join(',') !== want.join(',') || stray) fail('marker-order', id, `gap markers are [${markers}] but must be {{1}}..{{${gaps.length}}} in order, once each, inside paragraphs${stray ? ' (malformed marker found)' : ''}`);
        for (const g of gaps) {
          checkId(id, g && g.id, id + '-c');
          if (!GAP_TYPES.includes(g.type)) fail('cloze-type', id, `gap ${g.id} has unknown type ${g.type}`);
          const opts = Array.isArray(g.options) ? g.options : [];
          if (opts.length !== 4 || !opts.every(isStr)) fail('option-count', id, `gap ${g.id} needs exactly 4 non-empty options, has ${opts.length}`);
          if (!isInt(g.correct) || g.correct < 0 || g.correct >= opts.length) fail('correct-range', id, `gap ${g.id} correct ${g.correct} is not an index into options`);
          if (new Set(opts.map(o => nfc(o).trim().toLowerCase())).size !== opts.length) fail('duplicate-options', id, `gap ${g.id} has duplicate options`);
          if (!isStr(g.note)) fail('note-missing', id, `gap ${g.id} missing note`);
        }
        if (new Set(gaps.map(g => g.type)).size < 3) fail('connector-types', id, 'cloze gaps must cover at least 3 different connector types');
      }
    }
  });

  if (expect) {
    MODES.forEach((m, i) => {
      if (expect[i] !== undefined && counts[i] !== expect[i]) fail('expect-count', m, `expected ${expect[i]} ${m} text(s), found ${counts[i]}`);
    });
  }
  return { errors, warns, counts };
}

// ---------- reporting
const fmt = e => `[${e.rule}] ${e.id}: ${e.msg}`;
function report(dir, expect, quiet) {
  const r = validate(dir, expect);
  const c = r.counts;
  if (!quiet) console.log(`texts: skim=${c[0]} mc=${c[1]} insert=${c[2]} cloze=${c[3]} total=${c.reduce((a, b) => a + b, 0)}`);
  if (!quiet) for (const w of r.warns) console.log(`WARN ${w.id}: ${w.msg}`);
  if (!quiet) for (const e of r.errors) console.log('FAIL ' + fmt(e));
  return r;
}

function subdirs(dir) {
  return fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort() : [];
}

function selftest() {
  let bad = 0;
  const note = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) bad++; };
  const goodRoot = path.join(FIXTURES, 'good');
  const goods = [];
  if (fs.existsSync(path.join(goodRoot, REGISTRY))) goods.push(goodRoot);
  for (const d of subdirs(goodRoot)) if (fs.existsSync(path.join(goodRoot, d, REGISTRY))) goods.push(path.join(goodRoot, d));
  if (!goods.length) note(false, 'no good fixture found under tests/fixtures/laese/good');
  for (const g of goods) {
    const r = validate(g);
    note(r.errors.length === 0, `good/${path.relative(goodRoot, g) || '.'} passes${r.errors.length ? ' but: ' + r.errors.map(fmt).join(' | ') : ''}`);
  }
  const badRoot = path.join(FIXTURES, 'bad');
  const bads = subdirs(badRoot);
  for (const rule of REQUIRED_BAD) note(bads.includes(rule), `bad/${rule} fixture exists`);
  for (const rule of bads) {
    const r = validate(path.join(badRoot, rule));
    const hit = r.errors.some(e => fmt(e).includes(`[${rule}]`));
    const others = [...new Set(r.errors.map(e => e.rule).filter(x => x !== rule))];
    note(r.errors.length > 0 && hit, `bad/${rule} fails with [${rule}]` +
      (hit ? (others.length ? ` (also: ${others.join(', ')})` : '') : r.errors.length ? ` — but got: ${r.errors.map(fmt).join(' | ')}` : ' — but it PASSED'));
  }
  console.log(bad ? `\nselftest: ${bad} problem(s)` : `\nselftest: PASS (${goods.length} good, ${bads.length} bad fixtures)`);
  return bad ? 1 : 0;
}

// ---------- main
const args = process.argv.slice(2);
const arg = k => (args.find(a => a.startsWith(`--${k}=`)) || '').slice(k.length + 3);
if (args.includes('--selftest')) process.exit(selftest());
const dir = path.resolve(process.cwd(), arg('dir') || path.join(ROOT, 'laeseforstaaelse'));
let expect;
if (arg('expect')) {
  expect = arg('expect').split(',').map(Number);
  if (expect.length !== 4 || expect.some(n => !Number.isInteger(n) || n < 0)) {
    console.log('FAIL [usage] --expect must be four integers: skim,mc,insert,cloze');
    process.exit(1);
  }
}
const res = report(dir, expect);
if (res.errors.length) { console.log(`\n${res.errors.length} error(s)`); process.exit(1); }
console.log('PASS all corpus checks');
