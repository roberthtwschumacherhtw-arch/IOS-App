// Boot-/Smoke-Test: rendert app.js in echtem Chrome (headless) via DevTools-Protokoll.
// Keine npm-Abhängigkeit — nutzt Node's native WebSocket + fetch.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 8123, DBG = 9222;

const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if(p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  fs.readFile(file, (err, data) => {
    if(err){ res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function cdp(ws, method, params={}){
  const id = cdp._id = (cdp._id||0) + 1;
  return new Promise((res) => {
    cdp._pending = cdp._pending || new Map();
    cdp._pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run(){
  await new Promise(r => server.listen(PORT, r));
  const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logbuch-chrome-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${DBG}`, `--user-data-dir=${userDir}`, 'about:blank'
  ]);

  // Auf DevTools-Endpoint warten
  let wsUrl = null;
  for(let i=0;i<50 && !wsUrl;i++){
    try{
      const r = await fetch(`http://127.0.0.1:${DBG}/json/list`);
      const targets = await r.json();
      const page = targets.find(t => t.type === 'page');
      if(page) wsUrl = page.webSocketDebuggerUrl;
    }catch(e){}
    if(!wsUrl) await sleep(200);
  }
  if(!wsUrl) throw new Error('Chrome DevTools nicht erreichbar');

  const ws = new WebSocket(wsUrl);
  const errors = [];
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if(m.id && cdp._pending?.has(m.id)){ cdp._pending.get(m.id)(m.result); cdp._pending.delete(m.id); }
    else if(m.method === 'Runtime.exceptionThrown'){
      errors.push('EXCEPTION: ' + (m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text));
    }
    else if(m.method === 'Log.entryAdded' && m.params.entry.level === 'error'){
      const txt = m.params.entry.text || '';
      // Netzwerk-404s auf fehlende Assets (Fonts/Icons im minimalen Harness) sind kein App-Fehler
      if(/Failed to load resource/i.test(txt)) return;
      errors.push('LOG-ERROR: ' + txt);
    }
  };
  await cdp(ws, 'Runtime.enable');
  await cdp(ws, 'Log.enable');
  await cdp(ws, 'Page.enable');

  let pass=0, fail=0;
  const check = (name, cond, got) => { if(cond){pass++;console.log('  ok  ',name);} else {fail++;console.log('  FAIL',name,'→',JSON.stringify(got));} };
  const evalJs = async expr => (await cdp(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.value;

  // --- Test A: Frischer Start ---
  await cdp(ws, 'Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
  await sleep(1500);
  const navCount = await evalJs(`document.querySelector('logbuch-app')?.shadowRoot?.querySelectorAll('nav button').length || 0`);
  check('Custom Element + Nav gerendert (7 Tabs)', navCount === 7, navCount);
  const hasHeader = await evalJs(`!!document.querySelector('logbuch-app')?.shadowRoot?.querySelector('header h1')`);
  check('Header vorhanden', hasHeader === true, hasHeader);
  check('Keine JS-Fehler beim Frischstart', errors.length === 0, errors);

  // --- Test B: Migration — altes Backup OHNE nutrition-Feld ---
  const oldBackup = JSON.stringify({
    exercises:['Bankdrücken'], workouts:[], splits:[], exGroups:{}, n8nUrl:'', mealTypes:['Frühstück'],
    body:[{date:'2026-06-01', weight:80, kcal:2400, protein:160, meals:[{id:'x',name:'Frühstück',kcal:500,protein:30}]}],
    goals:{sessions:3, setsPerMuscle:10}
    // absichtlich KEIN nutrition-Feld (wie ein Backup von vor dem Redesign)
  });
  errors.length = 0;
  await evalJs(`localStorage.setItem('logbuch.v1', ${JSON.stringify(oldBackup)})`);
  await cdp(ws, 'Page.reload');
  await sleep(1500);
  const navCount2 = await evalJs(`document.querySelector('logbuch-app')?.shadowRoot?.querySelectorAll('nav button').length || 0`);
  check('App startet mit altem Backup (Migration)', navCount2 === 7, navCount2);
  check('Keine JS-Fehler nach Migration', errors.length === 0, errors);

  console.log(`\n${pass} ok, ${fail} fehlgeschlagen`);

  ws.close();
  chrome.kill();
  server.close();
  try { fs.rmSync(userDir, { recursive:true, force:true }); } catch(e){}
  process.exit(fail ? 1 : 0);
}

run().catch(e => { console.error('Testfehler:', e); try{server.close();}catch(_){}; process.exit(2); });
