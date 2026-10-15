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
const CAPPED = ['derudover', 'endvidere', 'ligeledes'];            // max ONE in total per text, across all three
const OPENERS = new Set(['derudover', 'endvidere', 'ligeledes', 'desuden', 'samtidig', 'dermed', 'derfor',
  'imidlertid', 'således', 'herudover', 'yderligere', 'ydermere', 'tilmed', 'alligevel', 'dertil', 'hermed', 'følgelig']);
const GENRES = ['forklaring', 'reportage', 'overblik', 'baggrund'];
const GAP_TYPES = ['kontrast', 'konsekvens', 'praecisering', 'tilfoejelse', 'tid'];
const NORMALSIDE = 2400;
// Quotation marks of any kind. A lone apostrophe inside a word (Anders' bil) is allowed; a quoted span ('ville') is not.
const QUOTE_CHARS = /["»«„“”‘‚‹›]/;
const QUOTE_SPAN = /(?<![\p{L}\p{N}])['’][^'’\n]{1,80}?['’](?![\p{L}\p{N}])/u;
const hasQuote = s => QUOTE_CHARS.test(s) || QUOTE_SPAN.test(s);
// Every rule tag that has a bad fixture. Selftest fails if any of them loses its fixture
// (a bad/<dir> matches a tag when its name equals the tag or starts with "<tag>-").
const REQUIRED_BAD = ['accepted', 'bad-source-url', 'banned-phrase', 'block-count', 'block-length', 'byline', 'byline-in-text',
  'capped-connector', 'cloze-type', 'connector-openings', 'connector-types', 'corpus-global', 'correct-range', 'dash-summary',
  'digits', 'duplicate-id', 'duplicate-options', 'evidence-range', 'gap-count', 'gap-order', 'genre', 'invented-speaker', 'kicker',
  'level', 'load-error', 'marker-order', 'missing-file', 'missing-sources', 'notice-count', 'notice-digits', 'notice-length',
  'notice-ref', 'option-count', 'paragraph-variance', 'question-count', 'quotation-mark', 'sentence-variance', 'triple-list',
  'unknown-block', 'verify-type'];

// ---------- text helpers
// NFC, zero-width characters removed and non-breaking spaces made ordinary, so none of them can hide a phrase.
const nfc = s => String(s == null ? '' : s).normalize('NFC').replace(/[​‌‍⁠﻿]/g, '').replace(/[   ]/g, ' ');
const ABBR = /\b(kl|ca|nr|f\.eks|bl\.a|m\.fl|osv|mv|dvs|jf|tlf|evt|inkl|pr|st|kr)\./gi;
const sentences = s => nfc(s).replace(ABBR, m => m.slice(0, -1) + '\u0001')
  .split(/(?<=[.!?])\s+(?=[A-ZÆØÅ0-9{])/).map(x => x.replace(/\u0001/g, '.').trim()).filter(Boolean);
const wordCount = s => s.split(/\s+/).filter(Boolean).length;
const firstWord = s => (nfc(s).match(/^[^\p{L}]*([\p{L}]+)/u) || [, ''])[1].toLowerCase();
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const phraseRe = (p, flags = 'iu') => new RegExp('(?<![\\p{L}])' + escRe(p).replace(/ /g, '\\s+') + '(?![\\p{L}])', flags);
// One alternation compiled once: a single pass per string (18 separate lookbehind regexes were the slowest part).
const BANNED_ALL = new RegExp(String.raw`(?<![\p{L}])(?:` + BANNED.map(b => escRe(b).replace(/ /g, String.raw`\s+`)).join('|') + String.raw`)(?![\p{L}])`, 'giu');
const CAPPED_RE = CAPPED.map(c => phraseRe(c, 'giu'));
const memoStr = fn => { const m = new Map(); return s => { if (!m.has(s)) m.set(s, fn(s)); return m.get(s); }; };
const bannedIn = memoStr(s => [...new Set([...s.matchAll(BANNED_ALL)].map(m => m[0].toLowerCase().replace(/\s+/g, ' ')))]);
const cappedIn = memoStr(s => CAPPED_RE.reduce((m, re) => m + (s.match(re) || []).length, 0));
// Invented speakers (SKILL.md section 2). A capitalised run before a speech verb is a proper noun
// (person or organisation): both are banned as speakers. Broad groups and connectors are allowed.
const SPEECH = '(?:siger|sagde|fortæller|fortalte|mener|mente|slår fast|forklarer|oplyser|udtaler|påpeger|vurderer)';
const SPEAKER_RE = new RegExp(String.raw`(?<![\p{L}])(\p{Lu}[\p{L}.-]*(?:(?: & | og | )\p{Lu}[\p{L}.-]*)*)\s+` + SPEECH + String.raw`(?![\p{L}])`, 'gu');
const SPEAKER_OK = new Set(['man', 'det', 'der', 'de', 'den', 'vi', 'han', 'hun', 'jeg', 'du', 'ingen', 'nogen', 'alle', 'mange', 'flere',
  'nogle', 'fåreavlere', 'biologer', 'forskere', 'eksperter', 'landbrugsorganisationerne',
  'hvad', 'hvem', 'hvordan', 'hvorfor', 'hvornår', 'hvilken', 'hvilke', 'hvilket', 'hvor',
  // connectors and adverbs that open a sentence in running prose
  ...OPENERS, 'faktisk', 'konkret', 'først', 'så', 'men', 'dog', 'nu', 'her', 'altså', 'måske', 'ofte', 'tidligere', 'senere', 'indtil', 'selvfølgelig', 'naturligvis']);
// A capitalised run right after a preposition (Folk i Nordjylland siger, I Nordjylland siger man) is a place or body, not a speaker.
const PREPS = new Set(['i', 'på', 'fra', 'til', 'ved', 'af', 'for', 'med', 'hos', 'om', 'mod', 'under', 'over']);
function speakerHits(text) {
  const out = { errors: [], warns: [] };
  for (const sent of sentences(text)) {
    const lead = sent.search(/\p{L}/u);
    for (const m of sent.matchAll(SPEAKER_RE)) {
      const run = m[1];
      const words = run.split(/ & | og | /);
      const initial = m.index <= lead;
      const before = (sent.slice(0, m.index).match(/(\p{L}+)\s*$/u) || [, ''])[1].toLowerCase();
      if (PREPS.has(before) || (words.length > 1 && PREPS.has(words[0].toLowerCase()))) continue;
      if (!initial || words.length > 1) out.errors.push(run);
      else if (!SPEAKER_OK.has(run.toLowerCase())) out.warns.push(run);
    }
  }
  return out;
}
const speakersIn = memoStr(speakerHits);
const isStr = v => typeof v === 'string' && v.trim().length > 0;
const isInt = v => Number.isInteger(v);

// The prose a reader sees, with cloze markers filled by the correct option and
// insert blocks that solve a gap included. Distractor blocks are left out of the length/variance
// statistics (they are not part of the article) but proseAll() keeps every block for content rules.
function prose(t, allBlocks) {
  let paras = Array.isArray(t.paragraphs) ? t.paragraphs.filter(p => typeof p === 'string') : [];
  if (t.mode === 'cloze' && Array.isArray(t.gaps)) {
    paras = paras.map(p => p.replace(/\{\{([1-9]\d*)\}\}/g, (m, n) => {
      const g = t.gaps[+n - 1];
      return g && Array.isArray(g.options) && typeof g.options[g.correct] === 'string' ? g.options[g.correct] : m;
    }));
  }
  if (t.mode === 'insert' && Array.isArray(t.blocks)) {
    const used = new Set(t.solution && typeof t.solution === 'object' ? Object.values(t.solution) : []);
    paras = paras.concat(t.blocks.filter(b => b && (allBlocks || used.has(b.id)) && typeof b.text === 'string').map(b => b.text));
  }
  return paras;
}
const proseAll = t => prose(t, true);

// ---------- loading
const SANDBOX = { window: null, console };
const SCRIPTS = new Map();                    // compiled scripts by source text (fixtures share data.js)
const ctx = vm.createContext(SANDBOX);
function load(dir) {
  const errors = [];
  let names; try { names = new Set(fs.readdirSync(dir)); } catch (e) { names = new Set(); }
  const win = {}; win.window = win;
  SANDBOX.window = win;                       // one shared context (creating one per fixture is the slow part); only window is swapped
  const run = (f) => {
    const p = path.join(dir, f); const src = fs.readFileSync(p, "utf8");
    try { let sc = SCRIPTS.get(src); if (!sc) SCRIPTS.set(src, sc = new vm.Script(src, { filename: p })); sc.runInContext(ctx, { timeout: 1000 }); return true; }
    catch (e) { errors.push({ rule: 'load-error', id: f, msg: `failed to load: ${e.message}` }); return false; }
  };
  for (const m of MODES) {
    const [f, g] = CORPUS[m];
    if (!names.has(f)) continue;               // corpus arrives task by task
    if (run(f) && !Array.isArray(win[g])) errors.push({ rule: 'corpus-global', id: f, msg: `window.${g} is not an array after loading ${f}` });
  }
  if (!names.has(REGISTRY)) {
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
    for (const k of ['byline', 'author', 'forfatter']) if (t[k] !== undefined) fail('byline', id, `"${k}" is not allowed: no invented authors`);

    // Everything the learner can read: article text (cloze filled, EVERY insert block incl. distractors),
    // notices, titles, question texts and all answer options. Accepted answers get quote/banned checks only.
    const notices = Array.isArray(t.notices) ? t.notices.filter(Boolean) : [];
    const qs = Array.isArray(t.questions) ? t.questions.filter(Boolean) : [];
    const body = proseAll(t);
    const strs = a => a.filter(x => typeof x === 'string').map(nfc);
    const optionsOf = o => (o && Array.isArray(o.options) ? o.options : []);
    const proseStrs = strs([t.title, t.kicker, ...body, ...notices.flatMap(n => [n.heading, n.body])]);
    const askStrs = strs([...qs.map(q => q.q), ...qs.flatMap(optionsOf), ...(Array.isArray(t.gaps) ? t.gaps.filter(Boolean).flatMap(optionsOf) : [])]);
    const ansStrs = strs(qs.flatMap(q => (Array.isArray(q.accepted) ? q.accepted : [])));

    if ([...proseStrs, ...askStrs, ...ansStrs].some(hasQuote)) fail('quotation-mark', id, 'quotation marks are not allowed anywhere in a text (" » « „ “ ” ‘ ‚ ‹ › or a quoted span)');
    const bylineRe = /^\s*Af\s+(?:\p{Lu}[\p{L}-]+(?:\s+\p{Lu}[\p{L}-]+)+|\p{Lu}[\p{L}-]+\s*[,.]?\s*$)/u;
    for (const s of strs([...body, ...notices.map(n => n.body)])) if (bylineRe.test(s)) fail('byline-in-text', id, `a paragraph or notice starts like a byline: "${s.slice(0, 40)}"`);

    for (const s of [...proseStrs, ...askStrs, ...ansStrs]) for (const b of bannedIn(s)) fail('banned-phrase', id, `banned phrase: "${b}"`);
    const capped = proseStrs.reduce((n, s) => n + cappedIn(s), 0);
    if (capped > 1) fail('capped-connector', id, `Derudover/Endvidere/Ligeledes used ${capped} times in total, max 1 per text`);
    for (const s of [...proseStrs, ...askStrs]) {
      const h = speakersIn(s);
      for (const r of h.errors) fail('invented-speaker', id, `"${r}" is a proper noun followed by a speech verb: no invented or named speakers`);
      for (const r of h.warns) warn(id, `invented-speaker: "${r}" + speech verb at sentence start — check it is a broad group, not a person`);
    }
  };

  const checkArticle = (t) => {
    const id = t.id;
    if (!Array.isArray(t.paragraphs) || t.paragraphs.length < 4 || !t.paragraphs.every(isStr)) fail('paragraph-count', id, 'needs at least 4 non-empty paragraph strings');
    if (!isStr(t.kicker)) fail('kicker', id, 'missing kicker (genre label + topic, e.g. "Overblik · Natur")');
    else if (!/^\S.* · \S/.test(t.kicker)) fail('kicker', id, `kicker should read "<Genre> · <Emne>", got "${t.kicker}"`);
    if (!GENRES.includes(t.genre)) fail('genre', id, `genre must be one of ${GENRES.join('|')}, got ${t.genre}`);
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
        const markers = (joined.match(/\{\{[1-9]\d*\}\}/g) || []).map(m => +m.slice(2, -2));
        const stray = (joined.replace(/\{\{[1-9]\d*\}\}/g, '').match(/\{\{|\}\}/g) || []).length;
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

// --expect=skim,mc,insert,cloze : exactly four plain non-negative integers, nothing blank.
function parseExpect(v) {
  const parts = String(v).split(',');
  return parts.length === 4 && parts.every(p => /^\d+$/.test(p)) ? parts.map(Number) : null;
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
    const sw = r.warns.filter(w => /invented-speaker/.test(w.msg));
    note(r.errors.length === 0 && !sw.length, `good/${path.relative(goodRoot, g) || '.'} passes${r.errors.length ? ' but: ' + r.errors.map(fmt).join(' | ') : ''}${sw.length ? ' but speaker warning: ' + sw.map(w => w.msg).join(' | ') : ''}`);
  }
  const badRoot = path.join(FIXTURES, 'bad');
  const bads = subdirs(badRoot);
  for (const rule of REQUIRED_BAD) note(bads.some(d => d === rule || d.startsWith(rule + '-')), `bad/${rule}[-*] fixture exists`);
  for (const v of ['', '1,,1,1', '1,1,1', '1,1,1,1,1', 'a,1,1,1', '1,-1,1,1', '1, ,1,1']) note(parseExpect(v) === null, `--expect=${v} is rejected`);
  note(parseExpect('1,0,2,10') !== null, '--expect=1,0,2,10 is accepted');
  for (const rule of bads) {
    const r = validate(path.join(badRoot, rule));
    // A dir may carry a suffix (invented-speaker-fullname); its tag is the longest required tag it matches (byline-in-text, not byline).
    const tag = REQUIRED_BAD.filter(t => rule === t || rule.startsWith(t + '-')).sort((x, y) => y.length - x.length)[0] || rule;
    const hit = r.errors.some(e => e.rule === tag);
    const others = [...new Set(r.errors.map(e => e.rule).filter(x => x !== rule && !rule.startsWith(x + '-')))];
    note(r.errors.length > 0 && hit, `bad/${rule} fails with [${r.errors.map(e => e.rule).filter((x, i, a) => a.indexOf(x) === i).join(', ')}]` +
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
if (args.some(a => a === '--expect' || a.startsWith('--expect='))) {
  expect = parseExpect(arg('expect'));
  if (!expect) {
    console.log('FAIL [usage] --expect must be four plain integers: skim,mc,insert,cloze');
    process.exit(1);
  }
}
const res = report(dir, expect);
if (res.errors.length) { console.log(`\n${res.errors.length} error(s)`); process.exit(1); }
console.log('PASS all corpus checks');
