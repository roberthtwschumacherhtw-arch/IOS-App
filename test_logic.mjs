// Extrahiert die ECHTEN Funktionen aus app.js und testet die Kalorien-Logik.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

// Balancierter Extraktor: ab Startmuster bis zur schließenden Klammer des ersten { oder [.
function grab(startRe){
  const i = src.search(startRe);
  if(i < 0) throw new Error('nicht gefunden: ' + startRe);
  let s = i;
  while(src[s] !== '{' && src[s] !== '[') s++;
  const open = src[s], close = open === '{' ? '}' : ']';
  let depth = 0, k = s;
  for(; k < src.length; k++){
    if(src[k] === open) depth++;
    else if(src[k] === close){ depth--; if(depth === 0){ k++; break; } }
  }
  return src.slice(i, k);
}

const pieces = [
  grab(/const CUT_LEVELS\s*=/),
  grab(/const BULK_LEVELS\s*=/),
  grab(/const DEFAULT_NUTRITION\s*=/),
  grab(/function linSlope\s*\(/),
  grab(/function estimateMaintenance\s*\(/),
  grab(/function phaseDelta\s*\(/),
  grab(/function calorieTarget\s*\(/),
].join(';\n');

// Synthetische Körperdaten: 20 Tage, Gewicht -0,05 kg/Tag, 2400 kcal.
function makeBody(days){
  const out = [];
  for(let i = 0; i < days; i++){
    const d = new Date(2026, 5, 1 + i);
    out.push({ date: d.toISOString().slice(0,10), weight: 80 - i*0.05, kcal: 2400, protein: 160 });
  }
  return out;
}

const harness = `
  ${pieces};
  let db = { body: [], nutrition: {...DEFAULT_NUTRITION} };
  function bodySorted(){ return [...db.body].sort((a,b)=>a.date<b.date?-1:1); }
  return { setBody:b=>db.body=b, setNut:n=>db.nutrition=n, estimateMaintenance, calorieTarget, CUT_LEVELS, BULK_LEVELS };
`;
const api = new Function(harness)();

let pass = 0, fail = 0;
function check(name, cond, got){
  if(cond){ pass++; console.log('  ok  ', name); }
  else { fail++; console.log('  FAIL', name, '→ bekam:', JSON.stringify(got)); }
}

// 1) Erhaltungsbedarf bei genug Daten
api.setBody(makeBody(20));
const maint = api.estimateMaintenance();
check('Erhaltungsbedarf ~2785 kcal', Math.abs(maint - 2785) < 5, maint);

// 2) Maintain-Phase = Erhaltungsbedarf
api.setNut({ phase:'maintain', cutLevel:'moderat', bulkLevel:'standard', mode:'auto', manualKcal:null });
const tMaint = api.calorieTarget();
check('Maintain ≈ Erhaltungsbedarf', Math.abs(tMaint.kcal - Math.round(maint)) < 2, tMaint);

// 3) Cut moderat = maint - 450
api.setNut({ phase:'cut', cutLevel:'moderat', bulkLevel:'standard', mode:'auto', manualKcal:null });
const tCut = api.calorieTarget();
check('Cut moderat = maint - 450', tCut.kcal === Math.round(maint) - 450, tCut);

// 4) Cut aggressiv = maint - 800
api.setNut({ phase:'cut', cutLevel:'aggressiv', bulkLevel:'standard', mode:'auto', manualKcal:null });
const tCutA = api.calorieTarget();
check('Cut aggressiv = maint - 800', tCutA.kcal === Math.round(maint) - 800, tCutA);

// 5) Bulk standard = maint + 300
api.setNut({ phase:'bulk', cutLevel:'moderat', bulkLevel:'standard', mode:'auto', manualKcal:null });
const tBulk = api.calorieTarget();
check('Bulk standard = maint + 300', tBulk.kcal === Math.round(maint) + 300, tBulk);

// 6) Ordering Cut < Maintain < Bulk
check('Cut < Maintain < Bulk', tCut.kcal < tMaint.kcal && tMaint.kcal < tBulk.kcal, {c:tCut.kcal,m:tMaint.kcal,b:tBulk.kcal});

// 7) Manueller Modus überschreibt
api.setNut({ phase:'cut', cutLevel:'moderat', bulkLevel:'standard', mode:'manual', manualKcal:2000 });
const tMan = api.calorieTarget();
check('Manuell = 2000 (ignoriert Phase)', tMan.kcal === 2000 && tMan.source === 'manual', tMan);

// 8) Zu wenig Daten → null statt Fantasiewert
api.setBody([{ date:'2026-06-01', weight:80, kcal:2400 }]);
api.setNut({ phase:'cut', cutLevel:'moderat', bulkLevel:'standard', mode:'auto', manualKcal:null });
const tNone = api.calorieTarget();
check('Zu wenig Daten → kcal null', tNone.kcal === null && tNone.reason, tNone);

console.log(`\n${pass} ok, ${fail} fehlgeschlagen`);
process.exit(fail ? 1 : 0);
