const base = 'http://127.0.0.1:9333';
const res = await fetch(base + '/json/new?about:blank');
const target = await res.json();
const ws = new WebSocket(target.webSocketDebuggerUrl);

let id = 0;
const pending = new Map();
function send(method, params = {}) {
  const msgId = ++id;
  return new Promise((resolve) => {
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

const consoleMessages = [];
const exceptions = [];

ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
    return;
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const text = (msg.params.args || []).map(a => a.value ?? a.description ?? '').join(' ');
    consoleMessages.push(msg.params.type + ': ' + text);
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    exceptions.push(JSON.stringify(msg.params.exceptionDetails));
  }
});

await new Promise((resolve) => { ws.addEventListener('open', resolve); });

await send('Runtime.enable');
await send('Page.enable');
await send('Page.navigate', { url: 'file:///C:/Users/taras/Downloads/danske_spiller/boejningsvaerkstedet/index.html' });

await new Promise(r => setTimeout(r, 1500));

// Click the "Spil" button
async function evalExpr(expr) {
  const result = await send('Runtime.evaluate', { expression: expr, awaitPromise: false, returnByValue: true });
  return result;
}

console.log('--- after initial load ---');
console.log('title check:', (await evalExpr('document.querySelector(".title").textContent')).result.value);

await evalExpr('document.querySelector(".play-btn").click()');
await new Promise(r => setTimeout(r, 500));
console.log('--- after clicking Spil ---');
console.log('prompt:', (await evalExpr('(document.querySelector(".dc-quiz-prompt-text")||{}).textContent')).result.value);
console.log('progress label:', (await evalExpr('(document.querySelector(".progress-label")||{}).textContent')).result.value);

// Answer with a wrong value first
await evalExpr('document.querySelector(".dc-quiz-input").value = "xxx_definitely_wrong_xxx"');
await evalExpr('document.querySelector(".dc-quiz-submit").click()');
await new Promise(r => setTimeout(r, 500));
console.log('--- after wrong answer ---');
console.log('has next btn:', (await evalExpr('!!document.querySelector(".next-btn")')).result.value);
console.log('note shown:', (await evalExpr('(document.querySelector(".dc-quiz-note")||{}).textContent')).result.value);

await evalExpr('document.querySelector(".next-btn").click()');
await new Promise(r => setTimeout(r, 500));
console.log('--- after clicking Naeste ---');
console.log('progress label 2:', (await evalExpr('(document.querySelector(".progress-label")||{}).textContent')).result.value);

// Now answer correctly using the accepted answer captured from data via window
const correctVal = (await evalExpr(`
  (function(){
    var item = null;
    // find current item via closure is not accessible; fallback: read DANSK data by id pattern not available.
    return null;
  })()
`)).result;
console.log('correct helper (unused):', correctVal);

// Loop: answer every remaining item with an obviously wrong string, using the Naeste flow, to reach round-end summary quickly
for (let i = 0; i < 12; i++) {
  const hasInput = (await evalExpr('!!document.querySelector(".dc-quiz-input")')).result.value;
  if (!hasInput) break;
  await evalExpr('var el=document.querySelector(".dc-quiz-input"); if(el){ el.value="zzz_wrong_zzz"; }');
  await evalExpr('var b=document.querySelector(".dc-quiz-submit"); if(b) b.click();');
  await new Promise(r => setTimeout(r, 250));
  await evalExpr('var n=document.querySelector(".next-btn"); if(n) n.click();');
  await new Promise(r => setTimeout(r, 250));
}

console.log('--- after finishing round ---');
console.log('summary heading:', (await evalExpr('(document.querySelector(".title")||{}).textContent')).result.value);
console.log('summary score:', (await evalExpr('(document.querySelector(".dc-summary-score")||{}).textContent')).result.value);

console.log('--- console messages captured ---');
console.log(JSON.stringify(consoleMessages, null, 2));
console.log('--- exceptions captured ---');
console.log(JSON.stringify(exceptions, null, 2));

process.exit(0);
