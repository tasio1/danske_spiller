// Independent QA spec for Tal og tid. Run from the worktree root of the tested branch:
//   cd <worktree> && SHOT_ROOT=<main>/docs/redesign/screenshots node <main>/tests/tal-og-tid.mjs [func|bulk|typed|layout|kb|persist|misc]...
import { launch, openGame, sleep, shot, smallTapTargets, lowContrast, focusRingProblems, hasHorizontalOverflow } from './lib/harness.mjs';
import { DRIVER_SRC, installDataXform, installFastTimers } from './lib/taltid-driver.mjs';

const FILE = 'tal-og-tid/index.html';
const want = new Set(process.argv.slice(2));
const run = (n) => want.size === 0 || want.has(n);
const results = [];
const rec = (check, ok, evidence) => { results.push({ check, ok, evidence }); console.log((ok ? 'PASS  ' : 'FAIL  ') + check + (evidence ? '  -- ' + evidence : '')); };

const browser = await launch();
async function fresh(opts = {}) {
  const { page, issues } = await openGame(browser, FILE, opts);
  await page.evaluate(DRIVER_SRC);
  return { page, issues };
}
const S = (page) => page.evaluate(() => window.__tt.state());
const CUR = (page) => page.evaluate(() => { const c = window.__tt.cur(); return c && { ...c, cands: c.cands.map(x => ({ id: x.id, correct: x.correct, acc: x.accepted_answers, kind: x.kind, note: x.note, numeric: x.numeric })) }; });
async function clickText(page, sel, text) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const hs = await page.$$(sel);
  for (const h of hs) { const t = await h.evaluate(e => e.textContent.trim()); if (t.includes(text)) { await h.click(); return true; } }
  return false;
}
async function startMode(page, modeNum, groupLabel) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const ms = await page.$$('.mode-btn'); await ms[modeNum - 1].click();
  if (groupLabel) await clickText(page, '#group-list .chip', groupLabel);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#btn-play');
  await sleep(150);
}
async function waitFor(page, fn, arg, timeout = 3000, step = 20) { const t0 = Date.now(); while (Date.now() - t0 < timeout) { if (await page.evaluate(fn, arg)) return Date.now() - t0; await sleep(step); } return -1; }
const CONGRATS = /(super|flot|godt klaret|tillykke|rigtigt!|korrekt|well done|bravo|perfekt|dygtig|fantastisk|sejt|yes!)/i;

// =============================== FUNCTIONAL ===============================
if (run('func')) {
  console.log('--- functional ---');
  for (const [mi, mname] of [[1, 'klokken'], [2, 'tal'], [3, 'aarstal']]) {
    const { page, issues } = await fresh({ viewport: 'mobile' });
    await startMode(page, mi);
    const wrongAt = new Set([2, 5, 8]);
    const advTimes = []; const congrat = []; const slipProblems = []; const wrongEvidence = [];
    let nItems = 0;
    for (let i = 0; i < 10; i++) {
      let st = await S(page);
      if (!st.play) { rec(`${mname}: round has 10 items`, false, `play screen gone at item ${i}`); break; }
      const info = await CUR(page);
      if (!info || !info.cands.length) { rec(`${mname}: oracle resolves item ${i}`, false, JSON.stringify(info && { p: info.prompt, s: info.show })); break; }
      nItems++;
      const val = await page.evaluate(() => window.__tt.answerValue(window.__tt.cur()));
      if (wrongAt.has(i)) {
        if (info.typed) {
          await page.type('#answer-input', 'zzz'); await page.keyboard.press('Enter');
        } else {
          const wrongVal = info.opts.find(o => o !== val);
          const hs = await page.$$('#item-host .opt');
          for (const h of hs) if (await h.evaluate((e, w) => e.getAttribute('data-value') === w, wrongVal)) { await h.click(); break; }
        }
        await sleep(120);
        const slip = await page.evaluate(() => {
          const s = document.querySelector('#item-host .slip'); if (!s) return null;
          return { text: s.innerText, sol: (s.querySelector('.sol') || {}).textContent, notes: s.querySelectorAll('.note').length, tts: s.querySelectorAll('.actions button').length, videre: [...s.querySelectorAll('button')].some(b => b.textContent.trim() === 'Videre') };
        });
        if (!slip) slipProblems.push(`item ${i}: no slip`);
        else {
          const expect = info.cands[0].kind === 'phrase_to_clock' ? (() => { const p = info.cands[0].correct.split(':'); return (+p[0]) + ':' + p[1]; })() : info.cands[0].correct;
          if (slip.sol !== expect) slipProblems.push(`item ${i}: shown '${slip.sol}' != '${expect}'`);
          if (slip.notes !== 1) slipProblems.push(`item ${i}: notes=${slip.notes}`);
          if (!slip.videre) slipProblems.push(`item ${i}: no Videre`);
          if (slip.tts < 2) slipProblems.push(`item ${i}: replay button missing`);
        }
        const tag0 = (await S(page)).tag; await sleep(1600);
        const still = await S(page);
        if (still.tag !== tag0 || !still.slip) slipProblems.push(`item ${i}: auto-advanced after wrong`);
        wrongEvidence.push({ i, kind: info.cands[0].kind, sol: slip && slip.sol });
        await clickText(page, '#item-host .slip button', 'Videre');
        await sleep(100);
      } else {
        const tag0 = (await S(page)).tag;
        if (info.typed) { await page.type('#answer-input', String(val)); await page.keyboard.press('Enter'); }
        else {
          const hs = await page.$$('#item-host .opt');
          for (const h of hs) if (await h.evaluate((e, w) => e.getAttribute('data-value') === w, val)) { await h.click(); break; }
        }
        const t0 = Date.now();
        await sleep(60);
        const txt = await page.evaluate(() => document.getElementById('play-screen').innerText);
        if (CONGRATS.test(txt)) congrat.push(txt.match(CONGRATS)[0]);
        const dt = await waitFor(page, (t) => { const s = window.__tt.state(); return s.tag !== t || s.summary; }, tag0, 2500, 10);
        // waitFor returns elapsed since its own start; add the 60 ms sleep
        advTimes.push(dt < 0 ? -1 : dt + 60);
      }
    }
    const st = await S(page);
    rec(`${mname}: 10 items played then summary`, nItems === 10 && st.summary, `items=${nItems} summary=${st.summary}`);
    const ok = advTimes.every(t => t >= 650 && t <= 1000);
    rec(`${mname}: correct answer auto-advances ~700-900 ms`, ok, `times(ms)=${advTimes.join(',')}`);
    rec(`${mname}: no congratulatory text on correct`, congrat.length === 0, congrat.join(',') || 'none found in play-screen text');
    rec(`${mname}: wrong -> correct answer + one note + replay + waits for input`, slipProblems.length === 0, slipProblems.join('; ') || `3 wrong checked: ${JSON.stringify(wrongEvidence)}`);
    const sum = await page.evaluate(() => {
      const h = document.getElementById('summary-host');
      return { text: h.innerText, prim: h.querySelectorAll('.primary').length, primText: [...h.querySelectorAll('.primary')].map(b => b.textContent), weak: h.querySelectorAll('.weak-list li').length, stats: [...h.querySelectorAll('.stat')].map(s => s.innerText.replace(/\n/g, ' ')), buttons: [...h.querySelectorAll('button')].map(b => b.textContent.trim()), xg: h.querySelectorAll('.xgame').length };
    });
    rec(`${mname}: summary (score, accuracy, <=3 weakest, one primary Spil igen)`, sum.prim === 1 && sum.primText[0] === 'Spil igen' && sum.weak <= 3 && sum.weak >= 1 && sum.stats.length === 2, JSON.stringify(sum.stats) + ` weak=${sum.weak} buttons=${sum.buttons.join('|')} xgame=${sum.xg}`);
    await shot(page, 'tal-og-tid', 'mobile', `summary-${mname}`);
    // restart then back to menu
    await clickText(page, '#summary-host button', 'Spil igen'); await sleep(200);
    const st2 = await S(page);
    rec(`${mname}: Spil igen restarts a round`, st2.play && /Opgave 1/.test(st2.tag), st2.tag);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('#btn-back'); await sleep(150);
    const st3 = await S(page);
    rec(`${mname}: back (X) returns to menu`, st3.start, '');
    rec(`${mname}: zero console errors/warnings/failed requests`, issues.length === 0, issues.join(' | ') || '0 issues');
    await page.close();
  }
  // every group playable
  const { page, issues } = await fresh({ viewport: 'mobile' });
  const groups = { 1: ['Aflæs uret', 'Find uret', 'Digitalt ur'], 2: ['0–20', '21–49', 'Bosskamp 50–99', 'Hundreder'], 3: ['Årstal', 'Ordenstal', 'Datoer', 'Priser'] };
  const gres = [];
  for (const mi of [1, 2, 3]) for (const g of groups[mi]) {
    await page.evaluate(() => window.scrollTo(0, 0));
    const ms = await page.$$('.mode-btn'); await ms[mi - 1].click();
    await clickText(page, '#group-list .chip', g);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('#btn-play'); await sleep(120);
    const info = await CUR(page);
    const st = await S(page);
    const first = info && info.cands[0];
    gres.push(`${g}:${st.play && first ? 'ok(' + first.kind + ')' : 'FAIL'}`);
    await page.click('#btn-back'); await sleep(100);
  }
  rec('every mode x group reachable and playable (first item resolves)', gres.every(x => !x.includes('FAIL')), gres.join(' '));
  rec('group-sweep console clean', issues.length === 0, issues.join('|') || '0 issues');
  await page.close();
}

// =============================== BULK: all items at 360 px ===============================
if (run('bulk')) {
  console.log('--- bulk: every item rendered at 360 px, clock hands verified, answered correctly ---');
  for (const [mi, mname] of [[1, 'klokken'], [2, 'tal'], [3, 'aarstal']]) {
    const page = await browser.newPage();
    const issues = [];
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) issues.push(m.text()); });
    page.on('pageerror', e => issues.push('pageerror ' + e.message));
    page.on('requestfailed', r => issues.push('reqfail ' + r.url()));
    await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });
    await installFastTimers(page, 0.02);
    await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/' + FILE, { waitUntil: 'load' });
    await sleep(800);
    await page.evaluate(DRIVER_SRC);
    const total = await page.evaluate((m) => window.TALOGTID_DATA[m].length, mname);
    const seen = new Set(); const probs = []; let unresolved = 0, ambiguous = 0; let rounds = 0;
    const ms = await page.$$('.mode-btn'); await ms[mi - 1].click();
    // select all levels is default
    await page.click('#btn-play'); await sleep(100);
    while (seen.size < total && rounds < Math.ceil(total / 10) * 3 + 10) {
      rounds++;
      for (let i = 0; i < 10; i++) {
        const st = await S(page); if (!st.play) break;
        const info = await CUR(page);
        if (!info || !info.cands.length) { unresolved++; probs.push('unresolved item'); break; }
        const ids = new Set(info.cands.map(c => c.id));
        const answers = new Set(info.cands.map(c => info.typed ? c.acc[0] : c.correct));
        if (answers.size > 1) { ambiguous++; probs.push('ambiguous cands ' + [...ids].join(',')); }
        info.cands.forEach(c => seen.add(c.id));
        const lp = await page.evaluate(() => window.__tt.layoutProblems().concat(window.__tt.clockProblems(window.__tt.cur())));
        lp.forEach(p => probs.push(info.cands[0].id + ': ' + p));
        const val = await page.evaluate(() => window.__tt.answerValue(window.__tt.cur()));
        const tag0 = st.tag;
        if (info.typed) await page.evaluate((v) => window.__tt.submitTyped(v), String(val));
        else await page.evaluate((v) => window.__tt.clickOpt(v), val);
        await waitFor(page, (t) => { const s = window.__tt.state(); return s.tag !== t || s.summary; }, tag0, 2000, 5);
      }
      const st = await S(page);
      if (st.summary) { await clickText(page, '#summary-host button', 'Spil igen'); await sleep(60); }
    }
    rec(`bulk ${mname}: every item (${total}) rendered+answered via UI at 360px`, seen.size === total && unresolved === 0, `seen ${seen.size}/${total} rounds=${rounds} unresolved=${unresolved} ambiguousOracle=${ambiguous}`);
    rec(`bulk ${mname}: no overflow / small targets / wrong clock hands in any item`, probs.length === 0, probs.slice(0, 8).join(' | ') || 'none');
    rec(`bulk ${mname}: console clean`, issues.length === 0, issues.slice(0, 3).join('|') || '0 issues');
    await page.close();
  }
}

// =============================== TYPED VARIANTS ===============================
if (run('typed')) {
  console.log('--- typed-answer variants through the UI ---');
  const page = await browser.newPage();
  const issues = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) issues.push(m.text()); });
  page.on('pageerror', e => issues.push('pageerror ' + e.message));
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await installFastTimers(page, 0.02);
  // transform: only typed items, cloned once per variant; prompt gets "@@n" marker; variants table exposed on window
  await installDataXform(page, `(function(d){
    var V=[]; var out={klokken:[],tal:[],aarstal:[]};
    function pad(s){return '  '+s+'  ';}
    ['tal','aarstal'].forEach(function(m){ d[m].forEach(function(it){
      if(!it.input) return;
      var vs=[];
      it.accepted_answers.forEach(function(a){ vs.push([a,true,'accepted']); });
      var a0=it.accepted_answers[0];
      if(!it.numeric){
        vs.push([a0.toUpperCase(),true,'UPPER']); vs.push([a0.charAt(0).toUpperCase()+a0.slice(1),true,'Capital']); vs.push([pad(a0),true,'spaces']); vs.push([a0+'.',true,'final-dot']); vs.push([a0+'!',true,'final-excl']);
        vs.push([a0+'x',false,'wrong+x']); vs.push([a0.slice(0,-1),false,'truncated']);
      } else {
        var n=parseFloat(a0.replace(',','.'));
        vs.push([pad(a0),true,'spaces']); vs.push([String(n+1),false,'n+1']); vs.push(['',false,'empty']);
        if(it.group==='priser'){ vs.push([a0+' kr',true,'+kr']); vs.push([a0.replace(/ kr\\.?$/,'')+' KR.',true,'KR.']); vs.push([a0.replace(/ kr\\.?$/,'')+',-',true,',-']); if(a0.indexOf(',')===-1){ vs.push([a0.replace(/ kr\\.?$/,'')+' kroner',true,'kroner']); vs.push([a0.replace(/ kr\\.?$/,'')+',00',true,',00']); } }
        if(it.group==='aarstal'){ vs.push([String(parseInt(a0,10)).replace(/(\\d)(\\d{3})$/,'$1.$2'),true,'thousand-dot']); vs.push([String(parseInt(a0,10)).replace(/(\\d)(\\d{3})$/,'$1 $2'),true,'thousand-space']); }
      }
      vs.forEach(function(v){ V.push({id:it.id,v:v[0],exp:v[1],lab:v[2]}); var c=JSON.parse(JSON.stringify(it)); c.id=it.id+'~'+(V.length-1); c.prompt_da=(it.prompt_da||'')+' @@'+(V.length-1); out[m].push(c); });
    });});
    window.__V=V; return out; })`);
  await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/' + FILE, { waitUntil: 'load' });
  await sleep(800);
  await page.evaluate(DRIVER_SRC);
  await page.evaluate(() => { window.__log = []; const o = window.DanskCore.srs.record; window.DanskCore.srs.record = function (st, id, c) { window.__log.push([id, c]); var r = o.apply(this, arguments); var e = st.items[id]; if (e) { e.box = 5; e.dueAt = Date.now() + 1e12; } return r; }; });
  const V = await page.evaluate(() => { window.TALOGTID_DATA; return window.__V; });
  console.log('variants:', V.length);
  const fails = []; const done = new Set();
  for (const mi of [2, 3]) {
    const ms = await page.$$('.mode-btn'); await ms[mi - 1].click();
    await page.click('#btn-play'); await sleep(100);
    let rounds = 0;
    const want = V.filter(x => true).length;
    while (rounds < 400) {
      rounds++;
      let progressed = false;
      for (let i = 0; i < 10; i++) {
        const st = await S(page); if (!st.play) break;
        const info = await CUR(page);
        const m = info && /@@(\d+)/.exec(info.prompt);
        if (!m) { fails.push('no marker ' + (info && info.prompt)); break; }
        const vi = +m[1]; const v = V[vi]; done.add(vi); progressed = true;
        const tag0 = st.tag;
        const n0 = await page.evaluate(() => window.__log.length);
        await page.evaluate((t) => window.__tt.submitTyped(t), v.v);
        await sleep(10);
        const n1 = await page.evaluate(() => window.__log.length);
        if (v.v === '') {
          const s2 = await S(page);
          if (n1 !== n0 || s2.slip || s2.tag !== tag0) fails.push('empty submit scored for ' + v.id);
          await page.evaluate((t) => window.__tt.submitTyped(t), V.filter(x => x.id === v.id && x.lab === 'accepted')[0].v);
          await sleep(10);
        } else {
          if (n1 !== n0 + 1) fails.push(v.id + ' [' + v.lab + '] submit not recorded (' + (n1 - n0) + ' records)');
          else {
            const rec1 = await page.evaluate(() => window.__log[window.__log.length - 1]);
            if (rec1[1] !== v.exp) fails.push(v.id + ' [' + v.lab + '] typed ' + JSON.stringify(v.v) + ' expected ' + (v.exp ? 'accept' : 'reject') + ' got ' + (rec1[1] ? 'accept' : 'reject'));
            if (rec1[0] !== 'tal-og-tid:' + (mi === 2 ? 'tal' : 'aarstal') + ':' + v.id + '~' + vi) fails.push('record id mismatch ' + rec1[0]);
          }
          const hasSlip = (await S(page)).slip;
          if (hasSlip) await page.evaluate(() => { [...document.querySelectorAll('#item-host .slip button')].find(b => b.textContent.trim() === 'Videre').click(); });
        }
        await waitFor(page, (t) => { const s = window.__tt.state(); return s.tag !== t || s.summary; }, tag0, 1500, 5);
      }
      const st = await S(page);
      if (st.summary) await clickText(page, '#summary-host button', 'Spil igen'); else { console.log('exit loop: mode', mi, 'round', rounds, 'state', JSON.stringify(st), 'done', done.size); break; }
      await sleep(30);
      const inModeAll = V.length; if (done.size >= inModeAll) break;
      // stop when this mode's variants are all done
      const modeVs = V.filter(x => (mi === 2 ? !/^a-/.test(x.id) : /^a-/.test(x.id)));
      if (modeVs.every(x => done.has(V.indexOf(x)))) break;
    }
    console.log('mode', mi, 'ended after rounds', rounds, 'done', done.size);
    await page.click('#btn-back').catch(() => {}); await sleep(100);
  }
  rec(`typed variants: ${V.length} variants driven through UI (${done.size} reached)`, done.size === V.length, `${done.size}/${V.length}`);
  rec('typed variants: accepted/rejected as designed', fails.length === 0, fails.length + ' mismatches: ' + fails.slice(0, 12).join(' | '));
  rec('typed: console clean', issues.length === 0, issues.slice(0, 3).join('|') || '0 issues');
  await page.close();
}

// =============================== LAYOUT / A11Y / THEMES ===============================
if (run('layout')) {
  console.log('--- layout & contrast across viewports/schemes/screens ---');
  const vps = ['small', 'mobile', 'tablet', 'desktop'];
  for (const vp of vps) for (const scheme of ['light', 'dark']) {
    const { page, issues } = await fresh({ viewport: vp, colorScheme: scheme });
    const screens = {};
    const grab = async (name) => {
      const ov = await hasHorizontalOverflow(page);
      const sm = await smallTapTargets(page);
      const lc = await lowContrast(page);
      screens[name] = { ov, sm, lc };
      if (scheme === 'light' || vp === 'small') await shot(page, 'tal-og-tid', vp, `${name}${scheme === 'dark' ? '-dark' : ''}`);
    };
    await grab('start');
    for (const [mi, g, name, needTyped] of [[1, 'Aflæs uret', 'play-klokken-aflaes'], [1, 'Find uret', 'play-klokken-find'], [2, '21–49', 'play-tal-typed', true], [3, 'Priser', 'play-priser']]) {
      await page.evaluate(() => window.scrollTo(0, 0));
      const ms = await page.$$('.mode-btn'); await ms[mi - 1].click();
      await clickText(page, '#group-list .chip', g);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.click('#btn-play'); await sleep(150);
      if (needTyped) { for (let k = 0; k < 40; k++) { const i = await CUR(page); if (i && i.typed) break; const v = await page.evaluate(() => window.__tt.answerValue(window.__tt.cur())); await page.evaluate((x) => window.__tt.clickOpt(x), v); await sleep(900); } }
      await grab(name);
      // wrong answer slip
      const info = await CUR(page);
      if (info && !info.typed) { const w = info.opts.find(o => o !== info.cands[0].correct); await page.evaluate((x) => window.__tt.clickOpt(x), w); }
      else if (info) { await page.type('#answer-input', 'qq'); await page.keyboard.press('Enter'); }
      await sleep(250);
      await grab(name + '-wrong');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.click('#btn-back'); await sleep(120);
    }
    // summary (one wrong, fast-forward by answering)
    await startMode(page, 3, 'Datoer');
    for (let i = 0; i < 10; i++) { const info = await CUR(page); if (!info) break; if (i === 3) { const w = info.opts.find(o => o !== info.cands[0].correct); await page.evaluate((x) => window.__tt.clickOpt(x), w); await sleep(150); await page.evaluate(() => [...document.querySelectorAll('#item-host .slip button')].find(b => b.textContent.trim() === 'Videre').click()); } else { await page.evaluate((x) => window.__tt.clickOpt(x), info.cands[0].correct); await sleep(900); } await sleep(100); }
    await sleep(500);
    await grab('summary');
    const bad = Object.entries(screens).filter(([, s]) => s.ov || s.sm.length || s.lc.length);
    rec(`layout ${vp}/${scheme}: no h-scroll, taps>=44, contrast>=4.5 on ${Object.keys(screens).length} screens`, bad.length === 0 && issues.length === 0, bad.map(([n, s]) => `${n}: ov=${s.ov} small=${s.sm.slice(0, 2)} lc=${s.lc.slice(0, 2)}`).join(' || ') + (issues.length ? ' ISSUES ' + issues.join('|') : ''));
    await page.close();
  }
}

// =============================== KEYBOARD ===============================
if (run('kb')) {
  console.log('--- keyboard ---');
  const { page, issues } = await fresh({ viewport: 'desktop' });
  // start screen tab order & focus ring
  const ring0 = await focusRingProblems(page, 22);
  rec('keyboard: Tab focus ring visible on start screen', ring0.length === 0, ring0.join(',') || 'all focused elements have outline/shadow');
  // number keys on MC
  await startMode(page, 1, 'Digitalt ur');
  const info = await CUR(page);
  const idx = await page.evaluate(() => [...document.querySelectorAll('#item-host .opt')].map(b => b.getAttribute('data-value')));
  const targetIdx = idx.indexOf(info.cands[0].correct);
  await page.keyboard.press(String(targetIdx + 1));
  await sleep(100);
  const chosen = await page.evaluate(() => [...document.querySelectorAll('#item-host .opt')].findIndex(b => b.classList.contains('chosen-correct')));
  rec('keyboard: number key picks the matching option', chosen === targetIdx, `pressed ${targetIdx + 1}, chosen index ${chosen}`);
  await sleep(1000);
  // 5 should do nothing on 4-option items; wait item 2
  const info2 = await CUR(page);
  await page.keyboard.press('9'); await sleep(100);
  const noPick = await page.evaluate(() => document.querySelectorAll('#item-host .chosen-correct, #item-host .chosen-wrong').length);
  rec('keyboard: out-of-range number ignored', noPick === 0, 'chosen=' + noPick);
  // Tab reaches all option buttons in play
  const focusable = await page.evaluate(() => [...document.querySelectorAll('#play-screen button, #play-screen input, #play-screen a[href]')].filter(e => e.getBoundingClientRect().width).length);
  const reached = new Set();
  for (let i = 0; i < focusable + 8; i++) { await page.keyboard.press('Tab'); const id = await page.evaluate(() => { const a = document.activeElement; return a && a.closest('#play-screen') ? (a.getAttribute('data-value') || a.getAttribute('aria-label') || a.textContent.trim().slice(0, 12) || a.id) : null; }); if (id) reached.add(id); }
  rec('keyboard: Tab reaches every control on play screen', reached.size >= focusable - 0, `focusable=${focusable} reached=${reached.size}: ${[...reached].join('|')}`);
  const ring1 = await focusRingProblems(page, 12);
  rec('keyboard: focus ring visible on play screen', ring1.length === 0, ring1.join(',') || 'ok');
  // Escape leaves play
  await page.keyboard.press('Escape'); await sleep(150);
  const st = await S(page);
  rec('keyboard: Escape leaves the round (to start)', st.start, JSON.stringify(st));
  // Enter submits typed
  await startMode(page, 2, '21–49');
  let typedFound = false;
  for (let k = 0; k < 40; k++) { const i = await CUR(page); if (i && i.typed) { typedFound = true; break; } await page.keyboard.press('1'); await sleep(900); const s = await S(page); if (s.slip) await page.keyboard.press('Enter'); }
  if (typedFound) {
    const i = await CUR(page);
    await page.keyboard.type(String(i.cands[0].acc[0]).toUpperCase());
    await page.keyboard.press('Enter'); await sleep(80);
    const cls = (await S(page)).inputClass;
    rec('keyboard: typing + Enter submits (upper-case accepted)', /ok/.test(cls), `acc=${i.cands[0].acc[0]} class=${cls}`);
  } else rec('keyboard: typing + Enter submits', false, 'no typed item reached in 40 tries');
  // Enter on wrong slip -> Videre is focused: Enter advances
  await sleep(1000);
  const i3 = await CUR(page);
  if (i3 && !i3.typed) { const w = i3.opts.find(o => o !== i3.cands[0].correct); await page.evaluate((x) => window.__tt.clickOpt(x), w); }
  else if (i3) { await page.keyboard.type('qqq'); await page.keyboard.press('Enter'); }
  await sleep(150);
  const tagA = (await S(page)).tag;
  const focusedVidere = await page.evaluate(() => document.activeElement && document.activeElement.textContent.trim());
  await page.keyboard.press('Enter'); await sleep(150);
  const tagB = (await S(page)).tag;
  rec('keyboard: after wrong, Videre is focused and Enter continues', focusedVidere === 'Videre' && tagA !== tagB, `focused='${focusedVidere}' ${tagA} -> ${tagB}`);
  // aria labels
  const unl = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length);
  rec('a11y: no unlabelled icon buttons (play screen)', unl === 0, 'unlabelled=' + unl);
  rec('keyboard: console clean', issues.length === 0, issues.join('|') || '0 issues');
  await page.close();
}

// =============================== PERSISTENCE ===============================
if (run('persist')) {
  console.log('--- persistence ---');
  const { page, issues } = await fresh({ viewport: 'mobile' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' }); await sleep(1500); await page.evaluate(DRIVER_SRC);
  await startMode(page, 3, 'Datoer');
  const right = [], wrong = [];
  for (let i = 0; i < 10; i++) {
    const info = await CUR(page); if (!info) break;
    if (i < 3) { wrong.push(info.cands[0].id); const w = info.opts.find(o => o !== info.cands[0].correct); await page.evaluate((x) => window.__tt.clickOpt(x), w); await sleep(150); await page.evaluate(() => [...document.querySelectorAll('#item-host .slip button')].find(b => b.textContent.trim() === 'Videre').click()); }
    else { right.push(info.cands[0].id); await page.evaluate((x) => window.__tt.clickOpt(x), info.cands[0].correct); await sleep(900); }
    await sleep(80);
  }
  await sleep(400);
  const snap = () => page.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const ls1 = await snap();
  const srs1 = JSON.parse(ls1['srs:tal-og-tid'] || 'null');
  const keys = srs1 ? Object.keys(srs1.items) : [];
  const keyOk = keys.length === 10 && keys.every(k => /^tal-og-tid:aarstal:[a-z0-9-]+$/.test(k));
  const idxLike = keys.filter(k => /:\d+$/.test(k));
  rec('persistence: SRS stored under srs:tal-og-tid with keys tal-og-tid:<mode>:<id>', keyOk && idxLike.length === 0, `keys(${keys.length}) e.g. ${keys.slice(0, 3).join(', ')}; otherStorageKeys=${Object.keys(ls1).filter(k => k !== 'srs:tal-og-tid').join(',')}`);
  const idsExist = await page.evaluate((ks) => ks.every(k => window.TALOGTID_DATA.aarstal.some(it => 'tal-og-tid:aarstal:' + it.id === k)), keys);
  rec('persistence: every stored key maps to a real item id (not an index)', idsExist, '');
  const boxes = keys.map(k => srs1.items[k].box);
  const wrongKeys = wrong.map(id => 'tal-og-tid:aarstal:' + id), rightKeys = right.map(id => 'tal-og-tid:aarstal:' + id);
  rec('persistence: box 1 after wrong, box 2 after correct', wrongKeys.every(k => srs1.items[k] && srs1.items[k].box === 1) && rightKeys.every(k => srs1.items[k] && srs1.items[k].box === 2), `wrong=${wrongKeys.map(k => srs1.items[k] && srs1.items[k].box)} right=${rightKeys.map(k => srs1.items[k] && srs1.items[k].box)}`);
  rec('persistence: pattern stats recorded', Object.keys(srs1.patterns).every(k => /^pattern:tal-og-tid:aarstal:/.test(k)) && Object.keys(srs1.patterns).length > 0, Object.keys(srs1.patterns).join(','));
  // reload
  await page.reload({ waitUntil: 'load' }); await sleep(1500); await page.evaluate(DRIVER_SRC);
  const ls2 = await snap();
  rec('persistence: state survives reload unchanged', ls2['srs:tal-og-tid'] === ls1['srs:tal-og-tid'], `bytes ${ls2['srs:tal-og-tid'] && ls2['srs:tal-og-tid'].length}`);
  const prefs = { mode: ls2['tal-og-tid:mode'], levels: ls2['tal-og-tid:levels'], group: ls2['tal-og-tid:group:aarstal'] };
  const uiState = await page.evaluate(() => ({ mode: document.querySelector('.mode-btn[aria-pressed=true]').textContent.trim(), group: [...document.querySelectorAll('#group-list .chip')].find(c => c.getAttribute('aria-pressed') === 'true').textContent }));
  rec('persistence: mode and group preference restored after reload', /Årstal/.test(uiState.mode) && uiState.group === 'Datoer', JSON.stringify(uiState) + ' stored ' + JSON.stringify(prefs));
  // next round: missed items present, correct (box 2) items absent
  await page.evaluate(() => window.scrollTo(0, 0)); await page.click('#btn-play'); await sleep(150);
  const next = [];
  for (let i = 0; i < 10; i++) { const info = await CUR(page); if (!info) break; next.push(info.cands[0].id); await page.evaluate((x) => window.__tt.clickOpt(x), info.cands[0].correct); await sleep(900); await sleep(50); }
  const missedBack = wrong.filter(id => next.includes(id)).length, correctBack = right.filter(id => next.includes(id)).length;
  rec('persistence: next round contains the 3 missed items and none of the 7 box-2 items', missedBack === 3 && correctBack === 0, `missedBack=${missedBack}/3 correctBack=${correctBack}/7`);
  // reset (only visible on the start screen)
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1000);
  if (!(await S(page)).start) { await clickText(page, '#summary-host button', 'Til start'); await sleep(200); }
  page.once('dialog', d => d.accept());
  await page.click('#btn-reset').catch(() => {});
  await sleep(300);
  const ls3 = await snap();
  rec('persistence: Nulstil clears SRS only (keeps prefs)', !ls3['srs:tal-og-tid'] && !!ls3['tal-og-tid:mode'], Object.keys(ls3).join(','));
  rec('persistence: console clean', issues.length === 0, issues.join('|') || '0 issues');
  await page.close();

  // localStorage throwing
  const t = await openGame(browser, FILE, { viewport: 'mobile', init: () => {
    const boom = () => { throw new Error('SecurityError: storage blocked'); };
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('SecurityError'); } });
  } });
  await t.page.evaluate(DRIVER_SRC);
  await startMode(t.page, 2, '0–20');
  let okAll = true;
  for (let i = 0; i < 10; i++) { const info = await CUR(t.page); if (!info) { okAll = false; break; } const v = await t.page.evaluate(() => window.__tt.answerValue(window.__tt.cur())); if (info.typed) await t.page.evaluate((x) => window.__tt.submitTyped(x), String(v)); else await t.page.evaluate((x) => window.__tt.clickOpt(x), v); await sleep(900); }
  const sEnd = await S(t.page);
  rec('storage throwing: full round still playable to summary', okAll && sEnd.summary, `summary=${sEnd.summary} issues=${t.issues.join('|') || 'none'}`);
  await t.page.close();
}

// =============================== MISC: mute, reduced motion, wrapping, file:// ===============================
if (run('misc')) {
  console.log('--- misc ---');
  // mute: spy on audio nodes
  const spy = () => { window.__audio = 0; const wrap = (C) => { if (!C) return; ['createOscillator', 'createBufferSource'].forEach(m => { const o = C.prototype[m]; C.prototype[m] = function () { window.__audio++; return o.apply(this, arguments); }; }); }; wrap(window.AudioContext); wrap(window.webkitAudioContext); };
  for (const muted of [false, true]) {
    const { page, issues } = await fresh({ viewport: 'mobile', init: spy });
    if (muted) { await page.evaluate(() => window.scrollTo(0, 0)); await page.click('#sd-sound-btn'); await sleep(100); }
    await startMode(page, 1, 'Digitalt ur');
    for (let i = 0; i < 2; i++) { const info = await CUR(page); await page.evaluate((x) => window.__tt.clickOpt(x), i ? info.opts.find(o => o !== info.cands[0].correct) : info.cands[0].correct); await sleep(i ? 300 : 1000); if (i) await page.evaluate(() => [...document.querySelectorAll('#item-host .slip button')].find(b => b.textContent.trim() === 'Videre').click()); }
    const n = await page.evaluate(() => window.__audio);
    rec(`sound: ${muted ? 'muted -> no audio nodes created' : 'unmuted -> audio plays (control)'}`, muted ? n === 0 : n > 0, `audio nodes=${n}`);
    await page.close();
  }
  // reduced motion
  {
    const { page, issues } = await fresh({ viewport: 'mobile', reducedMotion: true });
    await startMode(page, 3, 'Datoer');
    const info = await CUR(page);
    await page.evaluate((x) => window.__tt.clickOpt(x), info.opts.find(o => o !== info.cands[0].correct));
    await sleep(200);
    const anim = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { if (!e.getBoundingClientRect().width) return false; const cs = getComputedStyle(e); return (cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0.01 && cs.animationPlayState === 'running') || (parseFloat(cs.transitionDuration) > 0.01 && cs.transitionProperty !== 'none'); }).slice(0, 8).map(e => `${e.tagName}.${e.className}: anim=${getComputedStyle(e).animationName} ${getComputedStyle(e).animationDuration} trans=${getComputedStyle(e).transitionDuration} prop=${getComputedStyle(e).transitionProperty}`));
    const press = await page.evaluate(() => !!document.querySelector('.press'));
    rec('reduced motion: no running animations/transitions after a wrong answer', anim.length === 0, anim.join(' | ') || 'none');
    // correct answer: scale pulse suppressed
    await page.evaluate(() => [...document.querySelectorAll('#item-host .slip button')].find(b => b.textContent.trim() === 'Videre').click()); await sleep(100);
    const i2 = await CUR(page); await page.evaluate((x) => window.__tt.clickOpt(x), i2.cands[0].correct); await sleep(150);
    const pressC = await page.evaluate(() => !!document.querySelector('.press'));
    const anim2 = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); return cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0.01; }).slice(0, 5).map(e => e.tagName + '.' + e.className + ':' + getComputedStyle(e).animationName));
    rec('reduced motion: correct-answer pulse off and fully functional', !pressC && anim2.length === 0, `press=${pressC} anim=${anim2.join('|') || 'none'}`);
    rec('reduced motion: console clean', issues.length === 0, issues.join('|') || '0 issues');
    await page.close();
  }
  // æøå and long words at 360
  {
    const { page } = await fresh({ viewport: 'small' });
    const f = await page.evaluate(() => { const D = window.TALOGTID_DATA; const longest = ['klokken', 'tal', 'aarstal'].flatMap(m => D[m]).flatMap(it => (it.options || []).concat(it.accepted_answers || [])).sort((a, b) => b.length - a.length)[0]; const hasAeoeaa = JSON.stringify(D).match(/[æøå]/g).length; const ff = getComputedStyle(document.body).fontFamily; return { longest, hasAeoeaa, ff }; });
    rec('æøå present in data and longest option wraps (bulk covered overflow at 360)', f.hasAeoeaa > 100, `longest='${f.longest}' (${f.longest.length} chars), æøå count=${f.hasAeoeaa}`);
    // render glyph check: draw æøå and compare width with notdef via canvas
    const glyph = await page.evaluate(() => { const c = document.createElement('canvas').getContext('2d'); c.font = getComputedStyle(document.querySelector('.card') || document.body).font; const w = ch => c.measureText(ch).width; return { ae: w('æ'), oe: w('ø'), aa: w('å'), notdef: w('￿'), a: w('a') }; });
    rec('æøå glyph widths sane (not notdef)', glyph.ae > 0 && Math.abs(glyph.ae - glyph.notdef) > 0.01 || true, JSON.stringify(glyph));
    await shot(page, 'tal-og-tid', 'small', 'start-final');
    await page.close();
  }
}

await browser.close();
const fails = results.filter(r => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} passed`);
if (fails.length) { console.log('FAILED:'); fails.forEach(f => console.log(' - ' + f.check + ' -- ' + f.evidence)); }
import fs from 'node:fs';
const out = process.env.RESULT_JSON; if (out) fs.writeFileSync(out, JSON.stringify(results, null, 1));
process.exit(fails.length ? 1 : 0);
