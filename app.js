/* ============================================================================
   <logbuch-app> — Integrierte App-Shell im 1b-Design.
   Bindet koerper-/analyse-/training-/plan-/daten-view + bottom-nav an den
   ECHTEN Store/db (localStorage-Key 'logbuch.v1', gleiche Datenstruktur wie
   deine bisherige LogbuchApp).

   Einbinden (Reihenfolge wichtig — Views zuerst):
     <script src="koerper-view.js"></script>
     <script src="analyse-view.js"></script>
     <script src="training-view.js"></script>
     <script src="plan-view.js"></script>
     <script src="daten-view.js"></script>
     <script src="bottom-nav.js"></script>
     <script src="logbuch-app.js"></script>
     <logbuch-app></logbuch-app>

   Ersetzt die alte monolithische LogbuchApp. Datenschema unverändert, alte
   Backups (JSON) lassen sich direkt einspielen.
============================================================================ */
(function () {
  const KEY = 'logbuch.v1';
  const DEFAULT_EX = ['Bankdrücken','Schrägbankdrücken KH','Kniebeuge','Kreuzheben','Rudern vorgebeugt','Latzug','Schulterdrücken KH','Beinpresse','Bizepscurls KH','Trizepsdrücken Kabel'];
  const DEFAULT_MEALS = ['Frühstück','Mittagessen','Abendessen','Snack'];
  const DEFAULT_GOALS = { sessions:3, setsPerMuscle:10, kcalTarget:2200, proteinTarget:150 };
  const CUT_LEVELS = [
    { id:'sanft', delta:-300, label:'Sanft' }, { id:'moderat', delta:-450, label:'Moderat' },
    { id:'zuegig', delta:-650, label:'Zügig' }, { id:'aggressiv', delta:-800, label:'Aggressiv' },
  ];
  const BULK_LEVELS = [
    { id:'lean', delta:200, label:'Lean' }, { id:'standard', delta:300, label:'Standard' }, { id:'aggressiv', delta:450, label:'Aggressiv' },
  ];
  const DEFAULT_NUTRITION = { phase:'maintain', cutLevel:'moderat', bulkLevel:'standard', mode:'auto', manualKcal:null };

  const Store = {
    async load() {
      try { if (window.storage) { const r = await window.storage.get(KEY); if (r && r.value) return JSON.parse(r.value); } } catch (e) {}
      try { const l = localStorage.getItem(KEY); if (l) return JSON.parse(l); } catch (e) {}
      return null;
    },
    async save(d) {
      const s = JSON.stringify(d);
      try { localStorage.setItem(KEY, s); } catch (e) {}
      try { if (window.storage) await window.storage.set(KEY, s); } catch (e) {}
    },
  };

  /* ---------- Helfer (aus der bisherigen App portiert) ---------- */
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
  const TODAY = iso(new Date());
  const T = s => new Date(s + 'T12:00:00').getTime();
  const num = v => { const n = parseFloat(String(v).replace(',','.')); return isFinite(n) ? n : null; };
  const e1rm = (w,r) => r>0 ? w*(1+r/30) : 0;
  const round = (n,d=1) => Math.round(n*10**d)/10**d;
  const uid = () => Math.random().toString(36).slice(2,9);
  const de = n => Number(n).toLocaleString('de-DE');
  const dec = n => Number(n).toLocaleString('de-DE',{minimumFractionDigits:1,maximumFractionDigits:1});
  const fmtDate = s => { const [y,m,d]=s.split('-'); return `${d}.${m}.`; };

  function sessionStats(w) {
    const sets = (w.sets||[]).filter(s => s.w!=null && s.r!=null);
    const vol = sets.reduce((a,s)=>a+s.w*s.r,0);
    const best = sets.reduce((a,s)=>Math.max(a,e1rm(s.w,s.r)),0);
    return { vol, best, n:sets.length };
  }
  function linSlope(pts) {
    const n = pts.length; if (n<2) return null;
    const mx = pts.reduce((a,p)=>a+p.x,0)/n, my = pts.reduce((a,p)=>a+p.y,0)/n;
    let nu=0, de2=0; for (const p of pts){ nu+=(p.x-mx)*(p.y-my); de2+=(p.x-mx)**2; }
    return de2===0 ? null : nu/de2;
  }
  const MUSCLE_RULES = [
    ['Bauch',['bauch','crunch','plank','situp','abs','core','rumpf','beinheben']],
    ['Beine',['kniebeuge','squat','beinpresse','bein','leg','ausfall','lunge','wade','calf','glute','hip','rdl']],
    ['Trizeps',['trizep','tricep','pushdown','dip','french','skull']],
    ['Bizeps',['bizep','bicep','curl','hammer']],
    ['Schultern',['schulter','shoulder','seitheben','lateral','delt','military','overhead','arnold','face pull','frontheben']],
    ['Brust',['bank','brust','chest','fliegende','butterfly','fly','pec','liegestütz','push-up','pushup']],
    ['Rücken',['ruder','row','lat','klimm','pull','kreuzheb','deadlift','überzüge','zug','shrug','hyperextension']],
  ];
  const GROUP_ORDER = ['Brust','Rücken','Schultern','Beine','Bizeps','Trizeps','Bauch','Sonstige'];
  function muscleOf(ex) {
    const s = String(ex).toLowerCase();
    for (const [g, keys] of MUSCLE_RULES) if (keys.some(k => s.includes(k))) return g;
    return 'Sonstige';
  }

  let db = { exercises:[...DEFAULT_EX], workouts:[], body:[], splits:[], exGroups:{}, exNotes:{}, customBarcodes:{}, sex:'m', age:null, height:null, n8nUrl:'', mealTypes:[...DEFAULT_MEALS], goals:{...DEFAULT_GOALS}, foodFav:[], nutrition:{...DEFAULT_NUTRITION}, ui:{ theme:'dark' } };
  const bodySorted = () => [...db.body].sort((a,b)=>a.date<b.date?-1:1);
  const latestWeight = () => { const ws = bodySorted().filter(x=>x.weight!=null); return ws.length ? ws[ws.length-1].weight : null; };

  /* ---------- Kalorienziel (kompakt, faithful) ---------- */
  const EMP_MIN_WEIGHTS=10, EMP_MIN_SPAN_D=14, EMP_MIN_KCAL_DAYS=7;
  function empiricalEnough() {
    const b = bodySorted(), ws = b.filter(x=>x.weight!=null), kd = b.filter(x=>x.kcal!=null);
    const span = ws.length>1 ? (T(ws[ws.length-1].date)-T(ws[0].date))/864e5 : 0;
    return ws.length>=EMP_MIN_WEIGHTS && span>=EMP_MIN_SPAN_D && kd.length>=EMP_MIN_KCAL_DAYS;
  }
  function estimateMaintenance() {
    if (!empiricalEnough()) return null;
    const b = bodySorted(), recent = b.filter(x=>x.weight!=null);
    const slope = linSlope(recent.map(x=>({x:T(x.date)/864e5, y:x.weight})));
    const perWk = slope!=null ? slope*7 : null;
    const kc = b.map(x=>x.kcal).filter(v=>v!=null);
    const kcAvg = kc.length ? kc.reduce((a,c)=>a+c,0)/kc.length : null;
    const bal = perWk!=null ? perWk*7700/7 : null;
    return (bal!=null && kcAvg!=null) ? kcAvg - bal : null;
  }
  function bmrMifflin() {
    const w = latestWeight(), h = db.height, a = db.age;
    if (!w || !h || !a) return null;
    return 10*w + 6.25*h - 5*a + (db.sex==='w' ? -161 : 5);
  }
  function activityFactor() {
    const st = bodySorted().map(x=>x.steps).filter(v=>v!=null).slice(-30);
    if (!st.length) return 1.5;
    const avg = st.reduce((a,c)=>a+c,0)/st.length;
    return avg<5000?1.4:avg<7500?1.5:avg<10000?1.6:avg<12500?1.7:1.8;
  }
  function estimateFormula() { const b = bmrMifflin(); return b==null ? null : b*activityFactor(); }
  function phaseDelta() {
    const n = db.nutrition || DEFAULT_NUTRITION;
    if (n.phase==='cut') return (CUT_LEVELS.find(l=>l.id===n.cutLevel)||CUT_LEVELS[1]).delta;
    if (n.phase==='bulk') return (BULK_LEVELS.find(l=>l.id===n.bulkLevel)||BULK_LEVELS[1]).delta;
    return 0;
  }
  function calorieTarget() {
    const n = db.nutrition || DEFAULT_NUTRITION;
    if (n.mode==='manual') return { kcal: n.manualKcal!=null ? n.manualKcal : (db.goals.kcalTarget||null), maint:null };
    const maint = estimateMaintenance();
    if (maint!=null) return { kcal: Math.round(maint + phaseDelta()), maint:Math.round(maint) };
    const est = estimateFormula();
    if (est!=null) return { kcal: Math.round(est + phaseDelta()), maint:Math.round(est) };
    return { kcal:null, maint:null };
  }
  function macroTargets() {
    const kcal = calorieTarget().kcal;
    const pt = (db.goals && db.goals.proteinTarget) || 0;
    let fat=null, carb=null;
    if (kcal!=null) { fat = Math.round(kcal*0.25/9); carb = Math.max(0, Math.round((kcal - pt*4 - fat*9)/4)); }
    return { kcal, protein:pt||null, fat, carb };
  }

  /* ---------- View-Modelle aus db ---------- */
  function vmKoerper() {
    const b = bodySorted(), ws = b.filter(x=>x.weight!=null);
    const m = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
    const cur = m(ws.slice(-7).map(x=>x.weight)), prev = m(ws.slice(-14,-7).map(x=>x.weight));
    const e = db.body.find(x=>x.date===TODAY) || {};
    const meals = e.meals || [];
    const tg = macroTargets(), kt = tg.kcal;
    const byType = {}; for (const mm of meals){ const t=mm.name||'Mahlzeit'; (byType[t]=byType[t]||[]).push(mm); }
    const order = [...(db.mealTypes||[]), ...Object.keys(byType).filter(t=>!(db.mealTypes||[]).includes(t))];
    const saltC = Math.round(meals.reduce((a,mm)=>a+(mm.salt||0),0)*10)/10;
    const fibC = Math.round(meals.reduce((a,mm)=>a+(mm.fiber||0),0)*10)/10;
    return {
      weight: {
        avg7: cur!=null ? round(cur,1) : 0,
        deltaWeek: (prev!=null && cur!=null) ? round(cur-prev,1) : 0,
        spark: ws.slice(-10).map(x=>x.weight),
      },
      kcal: { eaten: Math.round(e.kcal||0), target: kt },
      phase: { maintain:'Maintain · Recomp', cut:'Cut', bulk:'Bulk' }[(db.nutrition||{}).phase] || '',
      macros: [
        { lab:'Protein',  cur:Math.round(e.protein||0), tgt:tg.protein||0, col:'var(--teal)' },
        { lab:'Fett',     cur:Math.round(e.fat||0),     tgt:tg.fat||0,     col:'var(--ochre)' },
        { lab:'Kohlenh.', cur:Math.round(e.carbs||0),   tgt:tg.carb||0,    col:'var(--purple)' },
      ],
      secondary: [
        { lab:'Ballaststoffe', cur:fibC,  tgt:30, col:'var(--fiber)', unit:'g' },
        { lab:'Salz',          cur:dec(saltC), tgt:'6,5', col:'var(--salt)', unit:'g' },
      ],
      meals: order.map(t => ({
        name: t,
        items: (byType[t]||[]).map(mm => ({ t: mm.pname||mm.text||'Eintrag', amt: mm.g?Math.round(mm.g)+' g':'', k: Math.round(mm.kcal||0) })),
      })),
    };
  }

  function vmTraining() {
    const g = db.goals || DEFAULT_GOALS;
    const nd = new Date(), dow = (nd.getDay()+6)%7;
    const mon = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate()-dow).getTime(), sun = mon+7*864e5;
    const inWeek = d => { const t=T(d); return t>=mon && t<sun; };
    const sessSet = {}; const byG = {};
    for (const w of db.workouts) if (inWeek(w.date)) { sessSet[w.sessionId||w.id]=1; const gr=muscleOf(w.exercise); byG[gr]=(byG[gr]||0)+(w.sets||[]).length; }
    const sessions = Object.keys(sessSet).length;
    const muscles = GROUP_ORDER.filter(x=>byG[x]).map(x=>({ g:x, cur:byG[x], tgt:g.setsPerMuscle }));
    // Letzte Einheiten gruppiert nach Session
    const bySess = {};
    for (const w of [...db.workouts].sort((a,b)=>a.date<b.date?1:-1)) { const k=w.sessionId||w.id; (bySess[k]=bySess[k]||[]).push(w); }
    const last = Object.values(bySess).slice(0,5).map(list => {
      const groups = [...new Set(list.map(w=>muscleOf(w.exercise)))].join(' · ');
      const vol = list.reduce((a,w)=>a+sessionStats(w).vol,0);
      const lines = list.map(w=>{ const s=(w.sets||[])[0]; return w.exercise + (s?` ${s.w}×${s.r}`:''); }).slice(0,3).join(' · ');
      return { day: list[0].day || 'Freies Training', date: fmtDate(list[0].date), groups, lines, vol: de(Math.round(vol))+' kg' };
    });
    return {
      goals: [{ t:'Gym-Einheiten', cur:sessions, tgt:g.sessions, sub:'' }],
      muscles: muscles.length ? muscles : GROUP_ORDER.slice(0,4).map(x=>({ g:x, cur:0, tgt:g.setsPerMuscle })),
      session: { day:'Freies Training', date:fmtDate(TODAY), blocks:[ { name:db.exercises[0]||'Bankdrücken', ref:'Neue Einheit — Sätze eintragen.', sets:[{kg:'',reps:''},{kg:'',reps:''}] } ] },
      last,
    };
  }

  function vmPlan() {
    const catByG = {};
    for (const e of db.exercises) (catByG[muscleOf(e)] = catByG[muscleOf(e)]||[]).push(e);
    const catalog = GROUP_ORDER.filter(g=>catByG[g]).map(g => ({
      g, ex: catByG[g].map(n => ({ n, s: db.workouts.filter(w=>w.exercise===n).length })),
    }));
    const splits = (db.splits||[]).map(sp => ({
      name: sp.name || 'Split',
      days: (sp.days||[]).map(d => ({ name:d.name||'Tag', ex:(d.exercises||d.ex||[]).map(x=>typeof x==='string'?x:x.name) })),
    }));
    return { splits, catalog };
  }

  function inWin(dateStr, days) {
    if (days==='all') return true;
    return T(dateStr) >= Date.now() - days*864e5;
  }
  function vmAnalyse(period) {
    const days = period==='all' ? 'all' : parseInt(period,10);
    const b = bodySorted().filter(x=>inWin(x.date, days));
    const weights = b.filter(x=>x.weight!=null);
    const slope = linSlope(weights.map(x=>({x:T(x.date)/864e5,y:x.weight})));
    const perWk = slope!=null ? slope*7 : null;
    const kc = b.map(x=>x.kcal).filter(v=>v!=null);
    const kcAvg = kc.length ? kc.reduce((a,c)=>a+c,0)/kc.length : null;
    const bal = perWk!=null ? perWk*7700/7 : null;
    const maint = estimateMaintenance();
    // Kraft: beste Übung nach Datenlage
    const exCount = {}; for (const w of db.workouts) if (inWin(w.date,days)) exCount[w.exercise]=(exCount[w.exercise]||0)+1;
    const topEx = Object.keys(exCount).sort((a,c)=>exCount[c]-exCount[a])[0] || db.exercises[0] || '—';
    const exW = db.workouts.filter(w=>w.exercise===topEx && inWin(w.date,days)).sort((a,c)=>a.date<c.date?-1:1);
    const e1 = exW.map(w=>round(sessionStats(w).best,1)).filter(v=>v>0);
    const vol = exW.map(w=>Math.round(sessionStats(w).vol));
    const balByG = {}; for (const w of db.workouts) if (inWin(w.date,days)) { const g=muscleOf(w.exercise); balByG[g]=(balByG[g]||0)+(w.sets||[]).length; }
    // Ernährung
    const daysK = b.filter(x=>x.kcal!=null);
    const kt = calorieTarget().kcal || db.goals.kcalTarget || null;
    let within=0, over=0, under=0, devSum=0;
    if (kt) for (const x of daysK){ const dd=x.kcal-kt; devSum+=dd; if(Math.abs(dd)<=kt*0.07)within++; else if(dd>0)over++; else under++; }
    const avg = k => { const a=b.map(x=>x[k]).filter(v=>v!=null); return a.length?a.reduce((s,c)=>s+c,0)/a.length:0; };
    const empty = { k:'—', v:'—', s:'—' };
    return {
      period,
      body: {
        weight: weights.length ? weights.map(x=>x.weight) : [0,0],
        stats: [
          { k:'Trend / Woche', v: perWk!=null ? (perWk>0?'+':'')+dec(perWk)+' kg' : '—', s: weights.length+' Messungen' },
          { k:'ø Kalorien', v: kcAvg!=null?de(Math.round(kcAvg)):'—', s:'im Zeitraum' },
          { k:'Bilanz geschätzt', v: bal!=null?(bal>0?'+':'')+de(Math.round(bal)):'—', s:'kcal / Tag' },
          { k:'Erhaltungsbedarf', v: maint!=null?de(Math.round(maint)):'—', s:'aus Trend + kcal' },
        ],
        insight: perWk!=null ? '<b>'+(perWk>0?'+':'')+dec(perWk)+' kg/Woche</b>'+(maint!=null?'. Erhaltungsbedarf ~<b>'+de(maint)+' kcal</b>.':'.') : 'Zu wenig Gewichtsdaten im Zeitraum für einen Trend.',
      },
      strength: {
        exercise: topEx,
        e1rm: e1.length?e1:[0,0], volume: vol.length?vol:[0,0],
        stats: [
          { k:'Bestes e1RM', v: e1.length?dec(Math.max(...e1)):'—', s:'kg (Epley)' },
          { k:'e1RM-Änderung', v: e1.length>1?((e1[e1.length-1]/e1[0]-1)*100>=0?'+':'')+dec((e1[e1.length-1]/e1[0]-1)*100)+'%':'—', s:'seit Beginn' },
          { k:'Volumen ø', v: vol.length?de(Math.round(vol.slice(-3).reduce((a,c)=>a+c,0)/Math.min(3,vol.length))):'—', s:'kg / Einheit' },
          { k:'Einheiten', v: String(exW.length), s: exW.length?'zuletzt '+fmtDate(exW[exW.length-1].date):'—' },
        ],
        insight: e1.length>1 ? '<b>'+topEx+'</b>: e1RM '+((e1[e1.length-1]/e1[0]-1)*100>=0?'+':'')+dec((e1[e1.length-1]/e1[0]-1)*100)+'% über '+exW.length+' Einheiten.' : 'Für diese Übung noch zu wenig Daten im Zeitraum.',
        balance: GROUP_ORDER.filter(g=>balByG[g]).map(g=>({ g, sets:balByG[g] })),
      },
      nutrition: {
        kcal: daysK.length?daysK.map(x=>Math.round(x.kcal)):[0,0],
        target: kt || 2050,
        stats: [
          { k:'Kalorienziel', v: kt?de(kt):'—', s:'kcal/Tag' },
          { k:'Treffer ±7%', v: (kt&&daysK.length)?Math.round(within/daysK.length*100)+'%':'—', s: within+'/'+daysK.length+' Tage' },
          { k:'ø Abweichung', v: (kt&&daysK.length)?((devSum/daysK.length>=0?'+':'')+de(Math.round(devSum/daysK.length))):'—', s:'kcal/Tag' },
          { k:'Über / Unter', v: over+' / '+under, s:'Tage' },
        ],
        macros: [
          { lab:'Protein', g:Math.round(avg('protein')), col:'var(--mp)' },
          { lab:'Fett', g:Math.round(avg('fat')), col:'var(--mf)' },
          { lab:'KH', g:Math.round(avg('carbs')), col:'var(--mc)' },
        ],
        insight: (kt&&daysK.length) ? 'Ziel (~<b>'+de(kt)+' kcal</b>) an <b>'+Math.round(within/daysK.length*100)+'%</b> der '+daysK.length+' erfassten Tage getroffen.' : 'Setz ein Kalorienziel und trag ein paar Tage ein.',
      },
    };
  }

  function vmDaten() {
    const sessSet = {}; for (const w of db.workouts) sessSet[w.sessionId||w.id]=1;
    const dates = db.workouts.map(w=>w.date).sort();
    const since = dates.length ? 'seit ' + dates[0].slice(5,7)+'/'+dates[0].slice(2,4) : '—';
    return {
      overview: { sessions:Object.keys(sessSet).length, measures:db.body.filter(x=>x.weight!=null).length, exercises:db.exercises.length, since },
      backup: db,
      webhook: db.n8nUrl || '',
    };
  }

  /* ---------- Shell-Komponente ---------- */
  const SHELL_CSS = `
    :host{ display:block; min-height:100vh; background:#10151A; }
    :host([theme="light"]){ background:#F4F6F8; }
    .screen{ min-height:calc(100vh - 62px); }
    .screen > *{ display:none; }
    .screen > .on{ display:block; }
    bottom-nav{ position:sticky; bottom:0; z-index:20; display:block; }
  `;

  class LogbuchApp extends HTMLElement {
    connectedCallback() {
      if (this._i) return; this._i = 1;
      this._root = this.attachShadow({ mode:'open' });
      this._view = 'training';
      this._anPeriod = 'all';
      this._boot();
    }
    async _boot() {
      const saved = await Store.load();
      if (saved) db = {
        exercises: saved.exercises?.length ? saved.exercises : [...DEFAULT_EX],
        workouts: saved.workouts||[], body: saved.body||[], splits: saved.splits||[],
        exGroups: saved.exGroups||{}, exNotes: saved.exNotes||{}, customBarcodes: saved.customBarcodes||{},
        sex: saved.sex||'m', age: saved.age||null, height: saved.height||null, n8nUrl: saved.n8nUrl||'',
        mealTypes: saved.mealTypes?.length ? saved.mealTypes : [...DEFAULT_MEALS],
        goals: {...DEFAULT_GOALS, ...(saved.goals||{})}, foodFav: saved.foodFav||[],
        nutrition: {...DEFAULT_NUTRITION, ...(saved.nutrition||{})}, ui: {...(saved.ui||{theme:'dark'})},
      };
      this._theme = (db.ui && db.ui.theme) || 'dark';
      this._build();
    }

    _build() {
      const t = this._theme;
      this.setAttribute('theme', t);
      this._root.innerHTML = `<style>${SHELL_CSS}</style>
        <div class="screen">
          <training-view data-v="training" theme="${t}"></training-view>
          <plan-view     data-v="plan"     theme="${t}"></plan-view>
          <koerper-view  data-v="koerper"  theme="${t}"></koerper-view>
          <analyse-view  data-v="analyse"  theme="${t}"></analyse-view>
          <daten-view    data-v="daten"    theme="${t}"></daten-view>
        </div>
        <bottom-nav active="${this._view}" theme="${t}"></bottom-nav>`;

      this.$ = s => this._root.querySelector(s);
      this._els = {
        training: this.$('training-view'), plan: this.$('plan-view'), koerper: this.$('koerper-view'),
        analyse: this.$('analyse-view'), daten: this.$('daten-view'), nav: this.$('bottom-nav'),
      };
      this._feed();
      this._show(this._view);
      this._wire();
    }

    _feed() {
      this._els.training.data = vmTraining();
      this._els.plan.data = vmPlan();
      this._els.koerper.data = vmKoerper();
      this._els.analyse.data = vmAnalyse(this._anPeriod);
      this._els.daten.data = vmDaten();
    }

    _show(v) {
      this._view = v;
      this._root.querySelectorAll('.screen > [data-v]').forEach(el => el.classList.toggle('on', el.dataset.v === v));
      this._els.nav.setAttribute('active', v);
      this._root.querySelector('.screen').scrollTo && window.scrollTo(0,0);
    }

    _setTheme(t) {
      this._theme = t; this.setAttribute('theme', t);
      db.ui = db.ui || {}; db.ui.theme = t; Store.save(db);
      Object.values(this._els).forEach(el => el.setAttribute('theme', t));
    }

    _wire() {
      const r = this._root;
      r.addEventListener('navigate', e => this._show(e.detail.view));
      r.addEventListener('theme-change', e => this._setTheme(e.detail.theme));

      // Training speichern → Workout(s) anlegen
      r.addEventListener('save-session', async e => {
        const s = e.detail.session, sid = uid(); let added = 0;
        for (const bl of s.blocks) {
          const sets = bl.sets.map(x => ({ w:num(x.kg), r:num(x.reps) })).filter(x => x.w!=null && x.r!=null);
          if (!sets.length) continue;
          db.workouts.push({ id:uid(), sessionId:sid, date:TODAY, day:s.day||null, exercise:(bl.name||'Übung').trim(), sets, note:bl.note||'' });
          added++;
        }
        if (added) { await Store.save(db); this._feed(); }
      });

      // Daten: Backup einspielen / CSV etc. (nur Backup wird real verarbeitet)
      r.addEventListener('import-file', async e => {
        const { kind, file } = e.detail;
        if (kind !== 'backup') return; // CSV/Notes-Import bleibt der bisherigen Pipeline vorbehalten
        try {
          const d = JSON.parse(await file.text());
          if (!d.workouts || !d.body) throw 0;
          db = { ...db, ...d, ui: db.ui };
          await Store.save(db); this._feed(); this._show('daten');
        } catch (err) { alert('Datei nicht lesbar'); }
      });
      r.addEventListener('save-webhook', async e => { db.n8nUrl = e.detail.url; await Store.save(db); });
    }
  }

  if (!customElements.get('logbuch-app')) customElements.define('logbuch-app', LogbuchApp);
})();
