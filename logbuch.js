(function(){
const PALETTE_CSS = `
/* ===================================================================
   DESIGN-TOKENS — einzige Quelle für Farben, Radien und Schriften.

   Um das Erscheinungsbild der GESAMTEN App zu ändern, muss nur dieser
   Block angefasst werden. Der restliche CSS-Code und alle zur Laufzeit
   erzeugten Charts referenzieren ausschließlich diese Variablen.
   Eine neue Palette (z. B. aus Claude Design) wird hier eingesetzt —
   sonst nirgends.

   Flächen      --bg      Seitenhintergrund
                --card    Kartenfläche
                --field   Eingabefelder
                --line    Rahmen und Trennlinien
                --grid    Chart-Gitter und Papierraster
   Text         --ink     Primärtext
                --ink-60  Sekundärtext
                --ink-30  Tertiärtext, inaktive Icons
   Akzent       --accent-base  Markenfarbe. Daraus zieht --accent per
                               oklch je Theme die passende Helligkeit
                               (hell 0.48 / dunkel 0.74), damit der
                               Kontrast in beiden Modi stimmt.
                --on-accent    Text auf Akzentflächen
   Status       --teal    positiv    --ochre  Warnung
                --signal  kritisch, Rekorde, Löschen
   Makros       --mp Protein · --mf Fett · --mc Kohlenhydrate
                --fiber Ballaststoffe · --salt Salz
   Form         --r  Kartenradius     --ri  Radius für Felder/Buttons
   Schrift      --sans Fließtext      --mono Zahlen und Messwerte

   Wichtig beim Austausch: Jeder Token, der unten im hellen :host-Block
   steht, muss dort einen Wert haben. Die beiden Dark-Blöcke überschreiben
   nur, was sich im Dunkelmodus tatsächlich ändert.
   =================================================================== */

/* ---------- Hell (Standard) ---------- */
:host{
  --bg:#F5F2ED;
  --card:#FFFDFA;
  --field:#F0ECE4;
  --line:#E3DBCF;
  --grid:#EDE7DC;

  --ink:#221E1A;
  --ink-60:#665C50;
  --ink-30:#877C6E;

  --accent-base:#2F6E9E;
  --accent:var(--accent-base);
  --accent:oklch(from var(--accent-base) 0.48 c h);
  --on-accent:#FFFFFF;
  --blue:var(--accent);

  --teal:#2C7A6B;
  --ochre:#96681A;
  --signal:#BC4530;

  --mp:#1F6B66;
  --mf:#A87716;
  --mc:#5A56AE;
  --fiber:#5B8F3C;
  --salt:#A34E6E;

  --r:18px;
  --ri:11px;
  --tap:44px;
  --mono:ui-monospace,"SF Mono",SFMono-Regular,Menlo,monospace;
  --sans:"Instrument Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}

/* ---------- Dunkel: automatisch nach Systemeinstellung ---------- */
@media (prefers-color-scheme:dark){
  :host([theme="auto"]){
    --bg:#17140F;
    --card:#221E18;
    --field:#100E0A;
    --line:#312B23;
    --grid:#251F19;

    --ink:#F1EBE1;
    --ink-60:#ABA090;
    --ink-30:#7E7364;

    --accent:var(--accent-base);
    --accent:oklch(from var(--accent-base) 0.74 c h);
    --on-accent:#14110D;

    --teal:#5CC0A9;
    --ochre:#D6AA50;
    --signal:#F0806A;

    --mp:#54BDB2;
    --mf:#DBAB4E;
    --mc:#A79CF2;
    --fiber:#96CC6C;
    --salt:#E88CAF;
  }
}

/* ---------- Dunkel: manuell erzwungen ----------
   Muss wertgleich zum Auto-Block darüber bleiben. */
:host([theme="dark"]){
  --bg:#17140F;
  --card:#221E18;
  --field:#100E0A;
  --line:#312B23;
  --grid:#251F19;

  --ink:#F1EBE1;
  --ink-60:#ABA090;
  --ink-30:#7E7364;

  --accent:var(--accent-base);
  --accent:oklch(from var(--accent-base) 0.74 c h);
  --on-accent:#14110D;

  --teal:#5CC0A9;
  --ochre:#D6AA50;
  --signal:#F0806A;

  --mp:#54BDB2;
  --mf:#DBAB4E;
  --mc:#A79CF2;
  --fiber:#96CC6C;
  --salt:#E88CAF;
}
`;
// Liest einen Token-Wert direkt aus der Palette. Gebraucht fuer Stellen, die
// kein CSS sehen: theme-color-Meta, Web-Manifest, Anti-Flash-Hintergrund.
function tok(name, dark){
  const block = dark ? PALETTE_CSS.slice(PALETTE_CSS.lastIndexOf(":host([theme=\"dark\"])")) : PALETTE_CSS.slice(0, PALETTE_CSS.indexOf("@media"));
  const m = block.match(new RegExp("\\"+name+"\\s*:\\s*([^;]+);"));
  return m ? m[1].trim() : "#000";
}
const CSS = "\n:host{\n  display:block; min-height:100vh;\n  background:var(--bg); color:var(--ink);\n  font-family:var(--sans); font-size:15px; line-height:1.5;\n  padding-bottom:calc(86px + env(safe-area-inset-bottom));\n  -webkit-font-smoothing:antialiased;\n}\n:host([paper=\"true\"]){\n  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);\n  background-size:22px 22px;\n}\n*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\n.wrap{max-width:580px;margin:0 auto;padding:0 16px}\n\nheader{\n  padding:calc(16px + env(safe-area-inset-top)) 16px 13px;\n  border-bottom:1px solid var(--line);\n  background:color-mix(in srgb,var(--bg) 86%,transparent);\n  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);\n  position:sticky;top:0;z-index:20;\n}\nheader .inner{max-width:580px;margin:0 auto;display:flex;align-items:baseline;justify-content:space-between}\nh1{font:650 17px/1 var(--sans);letter-spacing:-.01em;margin:0}\nh1::before{content:\"\";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-right:8px;vertical-align:1px}\n.today{font-family:var(--mono);font-size:12px;color:var(--ink-60);letter-spacing:.02em}\n\n.card{\n  background:var(--card);\n  border:1px solid var(--line);\n  border-radius:var(--r);\n  padding:18px;\n  margin:14px 0;\n  box-shadow:0 1px 2px rgba(15,23,32,.04);\n}\n.card > h2{\n  font:600 11px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;\n  color:var(--ink-60);margin:0 0 14px;\n}\n.hint{font-size:12.5px;color:var(--ink-60);margin:8px 0 0}\n:host([compact=\"true\"]) .card{padding:13px;margin:10px 0}\n\nlabel.f{display:block;font:550 11px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-60);margin:0 0 6px}\ninput,select,textarea,button{font-family:inherit;font-size:16px;color:var(--ink)}\ninput,select,textarea{\n  width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:var(--ri);\n  background:var(--field);appearance:none;\n}\ninput[type=number]{font-family:var(--mono);font-variant-numeric:tabular-nums}\ninput:focus,select:focus,textarea:focus{\n  outline:none;border-color:var(--accent);\n  box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent);\n}\nbutton:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.row{display:flex;gap:10px}\n.row > *{flex:1;min-width:0}\n\nbutton{cursor:pointer;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);\n  padding:11px 16px;border-radius:var(--ri);font-weight:600;letter-spacing:.01em}\nbutton.ghost{background:transparent;color:var(--ink);border-color:var(--line)}\nbutton.tiny{padding:7px 10px;font-size:13px}\nbutton.link{background:none;border:0;padding:4px 0;font-size:13px;color:var(--ink-60);font-weight:500}\nbutton.link.warn{color:var(--signal)}\nbutton:active{transform:translateY(1px)}\n\n.block{\n  border:1px solid var(--line);border-radius:var(--r);background:var(--card);\n  padding:14px;margin-bottom:12px;box-shadow:0 1px 2px rgba(15,23,32,.04);\n}\n.block.swapped{box-shadow:inset 3px 0 0 var(--ochre),0 1px 2px rgba(15,23,32,.04)}\n.block-head{display:flex;gap:8px;align-items:center;margin-bottom:10px}\n.block-head select{flex:1;font-weight:600}\n.block-head .rm{flex:none;width:38px;padding:8px 0;text-align:center;border:0;\n  background:transparent;color:var(--ink-30);font-weight:400;border-radius:var(--ri)}\n.swap-tag{font:600 9px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ochre);margin:-4px 0 8px}\n.ref{font-family:var(--mono);font-size:11.5px;color:var(--ink-60);margin:0 0 12px;word-break:break-word}\n\n.setrow{display:flex;gap:8px;align-items:center;margin-bottom:8px}\n.setno{font-family:var(--mono);font-size:12px;color:var(--ink-30);width:20px;flex:none;text-align:right}\n.setrow input{flex:1}\n.setrow .del{flex:none;width:38px;padding:9px 0;text-align:center;border:0;\n  background:transparent;color:var(--ink-30);font-weight:400;border-radius:var(--ri)}\n.block input.note{margin-top:4px;font-size:14px}\n\n.readout{\n  background:var(--card);border:1px solid var(--line);border-radius:var(--r);\n  padding:18px;margin:14px 0;box-shadow:0 1px 2px rgba(15,23,32,.04);\n  display:flex;align-items:flex-end;justify-content:space-between;gap:14px;\n}\n.readout .big{font-family:var(--mono);font-size:38px;line-height:.95;font-variant-numeric:tabular-nums;letter-spacing:-.03em;color:var(--ink)}\n.readout .big span{font-size:14px;color:var(--ink-30);letter-spacing:.04em}\n.readout .lab{font:550 10px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-30);margin-bottom:8px}\n.readout .side{text-align:right}\n.readout .side div{font-family:var(--mono);font-size:12.5px;color:var(--ink-60);font-variant-numeric:tabular-nums;margin-top:2px}\n.up{color:var(--teal)!important}.down{color:var(--signal)!important}\n\n.stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden}\n.stat{background:var(--card);padding:12px 13px}\n.stat .k{font:550 10px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-60)}\n.stat .v{font-family:var(--mono);font-size:19px;font-variant-numeric:tabular-nums;margin-top:6px}\n.stat .s{font-size:11.5px;color:var(--ink-30);font-family:var(--mono)}\n\n.legend{display:flex;gap:14px;flex-wrap:wrap;margin:10px 0 0;font-size:11.5px;color:var(--ink-60)}\n.legend i{display:inline-block;width:14px;height:2px;vertical-align:middle;margin-right:5px;border-radius:1px}\n\nul.list{list-style:none;margin:0;padding:0}\nul.list li{border-top:1px solid var(--grid);padding:11px 0;display:flex;justify-content:space-between;gap:10px;align-items:flex-start}\nul.list li:first-child{border-top:0}\n.li-main{min-width:0;flex:1}\n.li-t{font-weight:600;font-size:14px}\n.li-s{font-family:var(--mono);font-size:12px;color:var(--ink-60);margin-top:3px;word-break:break-word}\n.li-d{font-family:var(--mono);font-size:11px;color:var(--ink-30);flex:none;text-align:right}\n.pr{color:var(--signal);font-weight:700;font-size:10px;letter-spacing:.14em;text-transform:uppercase}\n.daytag{display:inline-block;font:600 9px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;\n  color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 40%,transparent);border-radius:99px;padding:3px 7px;margin-left:6px;vertical-align:1px}\n\n.split{border:1px solid var(--line);border-radius:var(--r);background:var(--card);margin-bottom:12px;overflow:hidden}\n.split-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;border-bottom:1px solid var(--line);background:var(--field)}\n.split-head .t{font-weight:650;font-size:14px}\n.day{border-top:1px solid var(--grid);padding:11px 14px}\n.day:first-of-type{border-top:0}\n.day-head{display:flex;align-items:center;justify-content:space-between;gap:8px}\n.day-head .t{font-weight:600;font-size:14px}\n.day-ex{font-family:var(--mono);font-size:12px;color:var(--ink-60);margin-top:3px}\n.day-edit{margin-top:10px;border-top:1px dashed var(--line);padding-top:10px}\n.day-edit .exline{display:flex;align-items:center;gap:8px;padding:5px 0}\n.day-edit .exline .n{flex:1;font-size:14px}\n.day-edit .exline button{flex:none}\n\n.cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}\n.cal-head .t{font:600 13px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase}\n.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}\n.cal-dow{font:550 9px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-30);text-align:center;padding:4px 0 6px}\n.cal-day{\n  position:relative;aspect-ratio:1;border:1px solid transparent;border-radius:9px;\n  background:var(--field);padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;\n  font-family:var(--mono);font-size:13px;font-weight:400;color:var(--ink);letter-spacing:0;\n}\n.cal-day.today{border-color:var(--accent)}\n.cal-day.sel{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}\n.cal-dots{display:flex;gap:3px;height:4px}\n.cal-dots i{width:4px;height:4px;border-radius:50%;display:block}\n.cal-sec{border-top:1px solid var(--grid);padding:10px 0}\n.cal-sec:first-child{border-top:0;padding-top:0}\n.cal-sec:last-child{padding-bottom:0}\n.cal-sec-t{font-weight:600;font-size:14px;margin-bottom:4px}\n.cal-sec .li-s{margin-top:3px}\n\nnav{\n  position:fixed;left:0;right:0;bottom:0;z-index:30;\n  background:color-mix(in srgb,var(--bg) 88%,transparent);\n  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\n  border-top:1px solid var(--line);\n  padding-bottom:env(safe-area-inset-bottom);\n}\nnav .inner{max-width:580px;margin:0 auto;display:flex}\nnav button{\n  flex:1;background:none;border:0;color:var(--ink-30);\n  padding:14px 0 15px;font:600 10px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;\n  border-radius:0;\n}\nnav button[aria-current=page]{color:var(--accent);font-weight:700}\nnav button:active{transform:none}\n\n.view{display:none}.view.on{display:block}\nsvg.chart{display:block;width:100%;height:auto;overflow:visible}\n.empty{color:var(--ink-30);font-size:13px;text-align:center;padding:24px 0;font-family:var(--mono)}\n.toast{\n  position:fixed;left:50%;transform:translateX(-50%);bottom:calc(92px + env(safe-area-inset-bottom));\n  background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:10px;\n  font-size:13px;z-index:50;opacity:0;pointer-events:none;transition:opacity .2s;font-family:var(--mono);\n  max-width:86vw;text-align:center;box-shadow:0 6px 24px rgba(15,23,32,.25);\n}\n.toast.on{opacity:1}\n@media (prefers-reduced-motion:reduce){*{transition:none!important}}\n\n/* 1b Bottom-Nav mit Icons */\nnav{position:fixed;left:0;right:0;bottom:0;z-index:30;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line)}\nnav .inner{display:flex;max-width:580px;margin:0 auto;padding:8px 6px calc(8px + env(safe-area-inset-bottom))}\nnav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:0;cursor:pointer;padding:6px 2px;min-height:46px;color:var(--ink-30);font:600 10.5px/1 var(--sans);letter-spacing:.01em}\nnav button svg{width:22px;height:22px;display:block}\nnav button[aria-current=\"page\"]{color:var(--accent)}\n.hicon{background:none;border:1px solid var(--line);border-radius:99px;padding:7px 10px;min-height:34px;font-size:14px;color:var(--ink-60);cursor:pointer}\nh1{cursor:pointer}\n.seclab{font:600 10px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-30);margin:22px 0 12px 2px}\n.mac-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}\n.mac-t{font:650 15px var(--sans)}\n.pill{display:inline-flex;background:var(--field);border:1px solid var(--line);border-radius:99px;padding:4px 11px;font:600 11.5px var(--sans);color:var(--ink-60);cursor:pointer}\n.more{width:100%;background:none;border:0;color:var(--ink-60);font:600 12px var(--sans);padding:8px;cursor:pointer}\n.meals-head{display:flex;align-items:center;justify-content:space-between}\n.meals-head .t{font:650 15px var(--sans)}\n.meals-head .k{font-family:var(--mono);font-size:13px;color:var(--ink-60)}\n";
const MARKUP = "<header><div class=\"inner\">\n  <h1 id=\"homeBtn\">Logbuch</h1>\n  <div class=\"head-right\"><button class=\"themetog\" id=\"themeTog\" aria-label=\"Design: hell / dunkel / automatisch\" title=\"Design wechseln\"></button><button class=\"today\" id=\"today\" aria-label=\"Kalender\"></button></div>\n</div></header>\n\n<main class=\"wrap\">\n\n<!-- ============ TRAINING ============ -->\n<section class=\"view\" id=\"v-log\">\n\n  <button class=\"startbtn js-start\" id=\"startTrain\"></button>\n\n  <div class=\"card compact\">\n    <div class=\"cardhead\"><h2>Wochenziele</h2><button class=\"link\" id=\"goalEdit\">anpassen</button></div>\n    <div id=\"goals\"></div>\n  </div>\n\n  <div class=\"card\" id=\"unitCard\">\n    <div class=\"cardhead\"><h2>Einheit <span class=\"dirty\" id=\"unitDirty\"></span></h2><button class=\"pill\" id=\"unitPill\">Freies Training</button></div>\n    <div id=\"unitSetup\" style=\"display:none\">\n      <div class=\"row\" style=\"margin-bottom:10px\">\n        <div style=\"flex:2\"><label class=\"f\" for=\"daySel\">Trainingstag</label><select id=\"daySel\"></select></div>\n        <div style=\"flex:1\"><label class=\"f\" for=\"wdate\">Datum</label><input type=\"date\" id=\"wdate\"></div>\n      </div>\n    </div>\n    <p class=\"hint\" id=\"dayHint\" style=\"margin:0 0 12px\"></p>\n    <div id=\"unitProgress\" style=\"display:none;margin-bottom:14px\"></div>\n    <div id=\"blocks\"></div>\n    <button class=\"ghost\" id=\"addBlock\" style=\"width:100%\">\uff0b \u00dcbung hinzuf\u00fcgen</button>\n    <button id=\"saveW\" style=\"width:100%;margin-top:10px\">Einheit speichern</button>\n  </div>\n\n  <div class=\"card\">\n    <h2>Letzte Einheiten</h2>\n    <ul class=\"list\" id=\"wlist\"></ul>\n    <button class=\"ghost tiny\" id=\"wlistMore\" style=\"width:100%;margin-top:10px;display:none\">Mehr anzeigen</button>\n  </div>\n</section>\n\n<!-- ============ PLAN ============ -->\n<section class=\"view\" id=\"v-plan\">\n  <div class=\"card\">\n    <h2>Splits &amp; Trainingstage</h2>\n    <p class=\"hint\" style=\"margin:0 0 12px\">Lege einen Split an (z. B. Push / Pull / Legs), darin die Trainingstage mit ihren \u00dcbungen. Beim Loggen wird der Tag vorausgef\u00fcllt.</p>\n    <div id=\"splits\"></div>\n    <button class=\"ghost\" id=\"addSplit\" style=\"width:100%\">\uff0b Split anlegen</button>\n  </div>\n\n  <div class=\"card\">\n    <h2>\u00dcbungskatalog</h2>\n    <ul class=\"list\" id=\"exlist\"></ul>\n    <button class=\"ghost tiny\" id=\"addExCat\" style=\"width:100%;margin-top:10px\">\uff0b \u00dcbung anlegen</button>\n  </div>\n</section>\n\n<!-- ============ K\u00d6RPER & ZIEL ============ -->\n<section class=\"view on\" id=\"v-body\">\n\n  <div class=\"grid2\">\n    <div class=\"card wcard\" id=\"weightCard\"></div>\n    <div class=\"card ringcard\" id=\"ringCard\"></div>\n  </div>\n\n  <div class=\"card\" id=\"macroCard\">\n    <div class=\"mac-head\"><span class=\"mac-t\">Makros</span><button class=\"pill\" id=\"phasePill\"></button></div>\n    <div id=\"macroBars\"></div>\n    <button class=\"more\" id=\"macroMore\"></button>\n    <div id=\"macroExtra\"></div>\n    <div class=\"tmeta\" id=\"targetMeta\"></div>\n  </div>\n\n  <div class=\"card meals\">\n    <div class=\"meals-head\"><span class=\"t\">Mahlzeiten heute</span><span class=\"k\" id=\"mealTotal\"></span></div>\n    <ul class=\"list\" id=\"mealList\"></ul>\n    <div class=\"row\" style=\"margin-top:12px\"><button class=\"ghost tiny\" id=\"addMealType\">\uff0b Weitere Mahlzeit</button><button class=\"ghost tiny\" id=\"copyDayBtn\">\u21bb Tag kopieren</button></div>\n  </div>\n\n  <div class=\"card\" id=\"waterCard\"></div>\n\n  <div class=\"card\" id=\"noteCard\">\n    <div class=\"meals-head\" style=\"margin-bottom:10px\"><span class=\"t\">Notiz zum Tag</span><span class=\"k\" id=\"noteMeta\"></span></div>\n    <textarea id=\"dayNote\" rows=\"2\" placeholder=\"Schlaf, Stress, Krankheit, Reisetag \u2026 \u2014 erkl\u00e4rt sp\u00e4ter die Ausrei\u00dfer\"></textarea>\n  </div>\n\n  <div class=\"quickin\">\n    <input type=\"date\" id=\"bdate\" aria-label=\"Datum\">\n    <input type=\"number\" id=\"bw\" step=\"0.1\" inputmode=\"decimal\" placeholder=\"kg\" aria-label=\"Gewicht in kg\">\n    <input type=\"number\" id=\"steps\" step=\"100\" inputmode=\"numeric\" placeholder=\"Schritte\" aria-label=\"Schritte\">\n    <button class=\"qsave\" id=\"saveB\">Sichern</button>\n  </div>\n\n  <div class=\"card\" id=\"measCard\"></div>\n\n</section>\n\n<!-- ============ ANALYSE ============ -->\n<section class=\"view\" id=\"v-an\">\n  <div class=\"seg ansub-seg\" id=\"anSub\"><button data-s=\"koerper\" aria-pressed=\"true\">K\u00f6rper</button><button data-s=\"kraft\" aria-pressed=\"false\">Kraft</button><button data-s=\"ernaehrung\" aria-pressed=\"false\">Ern\u00e4hrung</button></div>\n\n  <div class=\"ansub\" data-sub=\"koerper\">\n    <div class=\"card\">\n      <h2>Gewicht</h2>\n      <div class=\"pickchips anperiod\" style=\"margin:0 0 12px\"></div>\n      <div class=\"wsel\" id=\"weightSel\"></div>\n      <div id=\"c-weight\"></div>\n      <div class=\"legend\"><span><i style=\"background:var(--blue)\"></i>Gewicht pro Tag \u00b7 Linie ziehen</span></div>\n      <div class=\"aninsight\" id=\"i-weight\"></div>\n      <div class=\"stats\" style=\"margin-top:14px\" id=\"bodyStats\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Umf\u00e4nge</h2>\n      <p class=\"hint\" style=\"margin:0 0 12px\">Im Cut oft aussagekr\u00e4ftiger als die Waage \u2014 die Waage misst auch Wasser und Darminhalt.</p>\n      <div id=\"c-meas\"></div>\n      <div class=\"legend\" id=\"measLegend\"></div>\n      <div class=\"stats\" style=\"margin-top:14px\" id=\"measStats\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Wasser</h2>\n      <div id=\"c-water\"></div>\n      <div class=\"stats\" style=\"margin-top:14px\" id=\"waterStats\"></div>\n    </div>\n  </div>\n\n  <div class=\"ansub\" data-sub=\"kraft\" style=\"display:none\">\n    <div class=\"card\">\n      <h2>Kraftverlauf</h2>\n      <div class=\"pickchips anperiod\" style=\"margin:8px 0 12px\"></div>\n      <label class=\"f\">\u00dcbung</label>\n      <button class=\"ghost expick\" id=\"anExBtn\" style=\"width:100%;margin-bottom:14px\"></button>\n      <div id=\"c-str\"></div>\n      <div class=\"legend\"><span><i style=\"background:var(--ink)\"></i>e1RM (kg)</span><span><i style=\"background:var(--mc)\"></i>Volumen pro Einheit (kg)</span></div>\n      <div class=\"aninsight\" id=\"i-str\"></div>\n      <div class=\"stats\" style=\"margin-top:14px\" id=\"exStats\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Kraft vs. K\u00f6rpergewicht</h2>\n      <p class=\"hint\" style=\"margin:0 0 12px\">Beides auf den ersten Wert normiert (= 100). Divergieren die Linien, verlierst du Gewicht ohne Kraft \u2014 oder umgekehrt.</p>\n      <div id=\"c-rel\"></div>\n      <div class=\"legend\"><span><i style=\"background:var(--blue)\"></i>K\u00f6rpergewicht</span><span><i style=\"background:var(--ink)\"></i>e1RM</span><span><i style=\"background:var(--signal)\"></i>Relative Kraft</span></div>\n      <div class=\"stats\" style=\"margin-top:14px\" id=\"relStats\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Muskelgruppen-Balance</h2>\n      <p class=\"hint\" style=\"margin:0 0 12px\">S\u00e4tze pro Muskelgruppe im Zeitraum.</p>\n      <div id=\"muscleBal\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Wochenvolumen gesamt</h2>\n      <div id=\"c-vol\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Konsistenz</h2>\n      <div class=\"stats\" id=\"consist\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Rekorde im Zeitraum</h2>\n      <ul class=\"list\" id=\"prlog\"></ul>\n    </div>\n  </div>\n\n  <div class=\"ansub\" data-sub=\"ernaehrung\" style=\"display:none\">\n    <div class=\"card\">\n      <h2>Kalorien vs. Ziel</h2>\n      <div class=\"pickchips anperiod\" style=\"margin:8px 0 12px\"></div>\n      <div id=\"c-kcaltarget\"></div>\n      <p class=\"hint\" id=\"kcalCoverage\" style=\"margin:8px 0 0\"></p>\n      <div class=\"aninsight\" id=\"i-kcal\"></div>\n      <div class=\"stats\" style=\"margin-top:14px\" id=\"kcalStats\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Makro-Verteilung</h2>\n      <div id=\"macroSplit\"></div>\n    </div>\n    <div class=\"card\">\n      <h2>Schritte</h2>\n      <div id=\"c-steps\"></div>\n      <div class=\"stats\" style=\"margin-top:14px\" id=\"stepStats\"></div>\n    </div>\n  </div>\n</section>\n\n<!-- ============ DATEN ============ -->\n<section class=\"view\" id=\"v-data\">\n  <div class=\"card\">\n    <h2>Darstellung</h2>\n    <div class=\"profrow\" style=\"margin-top:10px\">\n      <span class=\"proflab\" style=\"flex:1\">Design</span>\n      <div class=\"phaseseg\" id=\"themeSeg\" role=\"group\" aria-label=\"Design\"><button data-t=\"auto\">Auto</button><button data-t=\"light\">Hell</button><button data-t=\"dark\">Dunkel</button></div>\n    </div>\n    <p class=\"hint\" id=\"themeHint\" style=\"margin:10px 0 0\"></p>\n  </div>\n\n  <div class=\"card profcard\" id=\"profileCard\">\n    <h2>Profil</h2>\n    <div class=\"profrow\">\n      <span class=\"proflab\">Geschlecht</span>\n      <div class=\"phaseseg\" id=\"sexSeg\" role=\"group\" aria-label=\"Geschlecht\"><button data-sex=\"m\" aria-pressed=\"true\">M\u00e4nnlich</button><button data-sex=\"w\">Weiblich</button></div>\n    </div>\n    <div class=\"profrow\">\n      <span class=\"proflab\">Alter</span>\n      <input type=\"number\" id=\"pAge\" class=\"profnum\" inputmode=\"numeric\" min=\"10\" max=\"100\" step=\"1\" placeholder=\"\u2014\">\n      <span class=\"profunit\">Jahre</span>\n      <span class=\"proflab\" style=\"margin-left:14px\">Gr\u00f6\u00dfe</span>\n      <input type=\"number\" id=\"pHeight\" class=\"profnum\" inputmode=\"numeric\" min=\"120\" max=\"230\" step=\"1\" placeholder=\"\u2014\">\n      <span class=\"profunit\">cm</span>\n    </div>\n    <p class=\"hint\" id=\"profHint\" style=\"margin:8px 0 0\"></p>\n  </div>\n\n  <div class=\"card\">\n    <h2>Training</h2>\n    <div class=\"profrow\" style=\"margin-top:10px\">\n      <span class=\"proflab\" style=\"flex:1\">Pause zwischen S\u00e4tzen</span>\n      <input type=\"number\" id=\"restSec\" class=\"profnum\" inputmode=\"numeric\" min=\"20\" max=\"600\" step=\"10\">\n      <span class=\"profunit\">Sek.</span>\n    </div>\n    <p class=\"hint\" style=\"margin:10px 0 0\">Gilt als Vorgabe. Im aktiven Training l\u00e4sst sich die laufende Pause jederzeit anpassen.</p>\n  </div>\n\n  <div class=\"card\">\n    <h2>Ern\u00e4hrungsziel</h2>\n    <p class=\"hint\" style=\"margin:0 0 12px\">Phase, Kalorien- und Proteinziel \u2014 dieselbe Ansicht wie \u00fcber die Makro-Karte.</p>\n    <button class=\"ghost\" id=\"openGoalSet\" style=\"width:100%\">Ziele anpassen</button>\n  </div>\n\n  <div class=\"card\">\n    <div class=\"cardhead\"><h2>\u00dcbersicht</h2><span class=\"cardmeta\" id=\"dataSince\"></span></div>\n    <div class=\"tiles\" id=\"dataTiles\"></div>\n  </div>\n\n  <div class=\"card\">\n    <h2>Sicherung</h2>\n    <p class=\"hint\" style=\"margin:0 0 12px\">Vollst\u00e4ndiges JSON-Backup aller Daten. Regelm\u00e4\u00dfig exportieren \u2014 es liegt sonst nur lokal im Browser.</p>\n    <div class=\"row\">\n      <button id=\"expJson\">Backup exportieren</button>\n      <button class=\"ghost\" id=\"impJsonBtn\">Backup einspielen</button>\n    </div>\n    <input type=\"file\" id=\"impJson\" accept=\".json\" style=\"display:none\">\n    <button class=\"ghost tiny\" id=\"expCsv\" style=\"width:100%;margin-top:10px\">Als CSV exportieren</button>\n    <p class=\"hint\" id=\"backupWarn\" style=\"margin:10px 0 0;display:none\"></p>\n  </div>\n\n  <div class=\"card\">\n    <h2>Import</h2>\n    <div class=\"improw\">\n      <span class=\"impic\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v10M8 9l4 4 4-4M5 17v3h14v-3\"></path></svg></span>\n      <div class=\"impmain\"><div class=\"impt\">Gewicht / CSV</div><div class=\"imps\">Renpho- oder eigener CSV-Export</div></div>\n      <button class=\"ghost tiny\" data-pick=\"csvFile\">Datei</button>\n    </div>\n    <div class=\"improw\">\n      <span class=\"impic\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3v8a2 2 0 004 0V3M8 11v10M17 3c-1.5 2-2 4-2 6h4c0-2-.5-4-2-6zM17 9v12\"></path></svg></span>\n      <div class=\"impmain\"><div class=\"impt\">Food-Diary</div><div class=\"imps\">kcal &amp; Protein pro Mahlzeit</div></div>\n      <button class=\"ghost tiny\" data-pick=\"csvFile\">Datei</button>\n    </div>\n    <div class=\"improw\">\n      <span class=\"impic\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5\"></path></svg></span>\n      <div class=\"impmain\"><div class=\"impt\">Trainings-Notizen</div><div class=\"imps\">Apple-Notes-HTML mit S\u00e4tzen</div></div>\n      <button class=\"ghost tiny\" data-pick=\"noteFiles\">Datei</button>\n    </div>\n    <input type=\"file\" id=\"csvFile\" accept=\".csv,.xlsx,.xls,text/csv,text/plain\" style=\"display:none\">\n    <input type=\"file\" id=\"noteFiles\" accept=\".html,.htm,text/html\" multiple style=\"display:none\">\n    <div id=\"csvMap\" style=\"display:none;margin-top:12px\">\n      <div class=\"row\" style=\"margin-bottom:8px\">\n        <div><label class=\"f\">Datum</label><select id=\"mapDate\"></select></div>\n        <div><label class=\"f\">Gewicht</label><select id=\"mapW\"></select></div>\n      </div>\n      <div class=\"row\">\n        <div><label class=\"f\">Kalorien</label><select id=\"mapK\"></select></div>\n        <div><label class=\"f\">Protein</label><select id=\"mapP\"></select></div>\n      </div>\n      <button id=\"csvGo\" style=\"width:100%;margin-top:12px\">Importieren</button>\n    </div>\n    <div id=\"csvInfo\" class=\"hint\"></div>\n    <div id=\"notePreview\" style=\"display:none;margin-top:12px\"></div>\n    <button id=\"noteImport\" style=\"width:100%;margin-top:10px;display:none\">Importieren</button>\n  </div>\n\n\n\n  <div class=\"card\">\n    <h2>Als App installieren</h2>\n    <p class=\"hint\" style=\"margin:0\">Safari \u00f6ffnen \u2192 Teilen-Symbol \u2192 \u201eZum Home-Bildschirm\". Danach startet das Logbuch im Vollbild mit eigenem Icon und funktioniert offline.</p>\n  </div>\n\n  <div class=\"card\">\n    <h2>Zur\u00fccksetzen</h2>\n    <button class=\"ghost\" id=\"wipe\" style=\"width:100%;color:var(--signal);border-color:var(--signal)\">Alle Daten l\u00f6schen</button>\n  </div>\n</section>\n\n</main>\n\n<nav><div class=\"inner\"><button data-v=\"log\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 8h2v8H4zM18 8h2v8h-2zM6 11h12v2H6z\"></path></svg><span>Training</span></button><button data-v=\"plan\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 4h14v16H5zM8 2v4M16 2v4M5 9h14\"></path></svg><span>Plan</span></button><button data-v=\"body\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3a2.4 2.4 0 100 4.8A2.4 2.4 0 0012 3zM7 21v-5l-2-1 1-5h4l3 0l1 5-2 1v5\"></path></svg><span>K\u00f6rper</span></button><button data-v=\"an\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7\"></path></svg><span>Analyse</span></button><button data-v=\"data\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2v.2a2 2 0 11-4 0v-.1a1.7 1.7 0 00-3-1.2l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.7 1.7 0 003.4 14h-.2a2 2 0 110-4h.1A1.7 1.7 0 004.6 7l-.1-.1a2 2 0 112.8-2.8l.1.1A1.7 1.7 0 0010 3.4v-.2a2 2 0 114 0v.1a1.7 1.7 0 003 1.2l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V10a1.7 1.7 0 001.5 1h.2a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z\"></path></svg><span>Einstellungen</span></button></div></nav>\n\n\n<div class=\"pickov\" id=\"goalOv\" style=\"display:none\">\n  <div class=\"picksheet\">\n    <div class=\"foodtitle\">Kalorienziel</div>\n    <div class=\"phaserow\">\n      <span class=\"phaselab\">Phase</span>\n      <div class=\"phaseseg\" id=\"phaseSeg\" role=\"group\" aria-label=\"Phase\"><button data-phase=\"maintain\" aria-pressed=\"true\">Maintain</button><button data-phase=\"cut\">Cut</button><button data-phase=\"bulk\">Bulk</button></div>\n    </div>\n    <div id=\"nutriBars\"></div>\n    <div class=\"goalmeta\" id=\"goalMeta\"></div>\n    <button class=\"ghost tiny\" id=\"nutriEdit\" style=\"width:100%;margin-top:10px\">Protein-Ziel \u00e4ndern</button>\n    <button class=\"ghost pickclose\" id=\"goalClose\">Schlie\u00dfen</button>\n  </div>\n</div>\n\n<div class=\"pickov\" id=\"measOv\" style=\"display:none\">\n  <div class=\"picksheet\">\n    <div class=\"foodtitle\" id=\"measTitle\">Umf\u00e4nge</div>\n    <p class=\"hint\" style=\"margin:0 0 12px\">In Zentimetern, leer lassen was du nicht misst. Immer zur gleichen Tageszeit und ohne anzuspannen messen.</p>\n    <div id=\"measForm\"></div>\n    <button id=\"measSave\" style=\"width:100%;margin-top:12px\">Speichern</button>\n    <button class=\"link measClose\" style=\"margin-top:6px;text-align:center;width:100%\">Schlie\u00dfen</button>\n  </div>\n</div>\n\n<div class=\"pickov\" id=\"copyOv\" style=\"display:none\">\n  <div class=\"picksheet\">\n    <div class=\"foodtitle\">Tag kopieren</div>\n    <p class=\"hint\" style=\"margin:0 0 10px\">\u00dcbernimmt alle Mahlzeiten des gew\u00e4hlten Tages zus\u00e4tzlich in den aktuellen Tag.</p>\n    <div class=\"picklist\" id=\"copyList\"></div>\n    <button class=\"link copyClose\" style=\"margin-top:6px;text-align:center;width:100%\">Schlie\u00dfen</button>\n  </div>\n</div>\n\n<div class=\"pickov\" id=\"startOv\" style=\"display:none\">\n  <div class=\"picksheet\">\n    <div class=\"foodtitle\">Training starten</div>\n    <p class=\"hint\" style=\"margin:0 0 12px\">Trainingstag w\u00e4hlen \u2014 die \u00dcbungen werden vorausgef\u00fcllt.</p>\n    <div class=\"picklist\" id=\"startList\"></div>\n    <button class=\"link startClose\" style=\"margin-top:6px;text-align:center;width:100%\">Abbrechen</button>\n  </div>\n</div>\n\n<div class=\"resumebar\" id=\"resumeBar\" style=\"display:none\">\n  <span class=\"rb-dot\"></span>\n  <span class=\"rb-t\"></span>\n  <span class=\"rb-r\"></span>\n  <button class=\"rb-go\">Fortsetzen</button>\n</div>\n\n<div class=\"toast\" id=\"toast\"></div>\n\n";
const EXTRA_CSS = `
/* Auf iOS schrumpft bei offener Tastatur nur der visuelle Viewport — position:fixed
   bleibt am Layout-Viewport haengen, das Sheet landet also hinter der Tastatur.
   --vvh/--vvt werden per visualViewport-API gesetzt (siehe syncViewport). */
.pickov{position:fixed;left:0;right:0;top:var(--vvt,0px);height:var(--vvh,100%);z-index:60;background:rgba(15,23,32,.45);display:flex;align-items:flex-end;justify-content:center}
.picksheet{background:var(--card);border:1px solid var(--line);border-radius:16px 16px 0 0;width:100%;max-width:580px;max-height:94%;display:flex;flex-direction:column;padding:14px 16px calc(14px + env(safe-area-inset-bottom))}
.picksearch{margin-bottom:10px}
.pickchips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.chip{padding:6px 11px;font-size:12px;border-radius:99px;background:var(--field);color:var(--ink);border:1px solid var(--line);font-weight:600}
.chip.on{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.picklist{overflow-y:auto;flex:1 1 auto;min-height:64px}
/* Titel, Suchfeld und Aktionen bleiben ausserhalb des Scrollbereichs sichtbar */
#foodOv .picksheet{min-height:min(62%,420px)}
#foodOv .foodtitle,#foodOv .foodhead,#foodOv .foodacts{flex:0 0 auto}
.pickgrp{font:600 10px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60);padding:10px 0 4px}
.pickitem{display:block;width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--grid);color:var(--ink);padding:10px 2px;font-size:15px;font-weight:500;border-radius:0}
.picknew{width:100%;margin-top:10px}
.pickclose{width:100%;margin-top:6px;text-align:center}
.block-head .expick{flex:1;text-align:left;font-weight:600;background:var(--field);color:var(--ink);border-color:var(--line)}
.goal{margin-bottom:14px}
.goal:last-child{margin-bottom:0}
.goal-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
.goal-t{font-weight:600;font-size:14px}
.goal-v{font-family:var(--mono);font-size:12.5px;color:var(--ink-60)}
.goal-v b{color:var(--ink);font-weight:700}
.goal-bar{height:8px;border-radius:5px;background:var(--grid);overflow:hidden}
.goal-bar i{display:block;height:100%;border-radius:5px;background:var(--accent);transition:width .3s}
.goal-bar i.done{background:var(--teal)}
.goal-sub{font-family:var(--mono);font-size:11px;color:var(--ink-30);margin-top:5px}
.foodhead{display:flex;gap:8px;margin-bottom:10px}
.foodhead .picksearch{margin-bottom:0;flex:1}
.foodhead .prodgo{flex:0 0 auto}
.prod{border-top:1px solid var(--grid)}
.prod .li-t{font-weight:600;font-size:15px}
.prod .li-s{margin-top:2px}
.scanwrap{position:relative;width:100%;aspect-ratio:4/3;background:#000;border-radius:12px;overflow:hidden}
.scanvid{width:100%;height:100%;object-fit:cover}
.prodcalc{font-family:var(--mono);font-size:15px}
.prodcalc b{font-size:20px}
.head-right{display:flex;align-items:center;gap:8px}
.phasesel{width:auto;padding:6px 8px;font:600 12px/1 var(--sans);border-radius:99px;background:var(--field);border:1px solid var(--line);color:var(--ink);min-height:34px}
button.today{background:none;border:1px solid var(--line);border-radius:99px;padding:7px 11px;min-height:34px;font-family:var(--mono);font-size:12px;color:var(--ink-60);letter-spacing:.02em;font-weight:600;cursor:pointer}
button.today::before{content:"📅 "}
button.today:active{transform:none}
.calov .picksheet{max-height:94%;overflow-y:auto}
.targetline{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}
.targetline .big{font-family:var(--mono);font-size:30px;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.targetline .big span{font-size:13px;color:var(--ink-30)}
.targetline .lab{font:550 10px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-30);margin-bottom:7px}
.targetmeta{font-family:var(--mono);font-size:11.5px;color:var(--ink-60);text-align:right;max-width:52%}
.seg{display:flex;border:1px solid var(--line);border-radius:99px;overflow:hidden;margin-bottom:10px}
.seg button{flex:1;background:var(--field);border:0;border-radius:0;color:var(--ink-60);padding:9px 0;font:600 12px/1 var(--sans);min-height:40px;cursor:pointer}
.seg button[aria-pressed="true"]{background:var(--accent);color:var(--on-accent)}
.lvlrow{margin-bottom:10px}
.manualrow{display:flex;gap:8px;align-items:flex-end;margin-bottom:6px}
nav button{min-height:46px}
.block-head .rm,.setrow .del{min-width:44px}
.phaseseg{display:flex;background:var(--field);border:1px solid var(--line);border-radius:99px;padding:2px}
.phaseseg button{border:0;background:none;border-radius:99px;padding:5px 9px;font:600 11.5px/1 var(--sans);color:var(--ink-60);cursor:pointer;min-height:0}
.phaseseg button[aria-pressed="true"]{background:var(--accent);color:var(--on-accent)}
h1{white-space:nowrap}
button.today{white-space:nowrap}
.phaserow{display:flex;align-items:center;gap:10px;margin:0 0 14px}
.phaselab{font:600 10px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-30);flex:none}
.phaserow .phaseseg{flex:1}
.phaserow .phaseseg button{flex:1;padding:8px 6px;font-size:12.5px}
.tmeta{font-family:var(--mono);font-size:11px;color:var(--ink-30);text-align:left;margin:10px 0 2px}
.ringrow{display:flex;align-items:center;gap:16px;margin:2px 0}
.ring{flex:none}
.ring-big{font-family:var(--mono);font-size:26px;font-weight:500;fill:var(--ink)}
.ring-lab{font:500 10px/1 var(--sans);letter-spacing:.08em;fill:var(--ink-30)}
.mcol{flex:1;min-width:0}
.kcline{font-family:var(--mono);font-size:13px;color:var(--ink-60);margin-bottom:11px}
.kcline b{color:var(--ink);font-weight:500}
.mrow{margin-bottom:10px}
.mrow:last-child{margin-bottom:0}
.mtop{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px}
.mlab{font-weight:600}
.mval{font-family:var(--mono);color:var(--ink-60)}
.mval b{font-weight:500}
.mtrack{height:7px;border-radius:5px;background:var(--grid);overflow:hidden}
.mtrack i{display:block;height:100%;border-radius:5px}
.sfwrap{display:flex;gap:14px;margin-top:14px}
.sf{flex:1;min-width:0}
.sf-top{display:flex;justify-content:space-between;align-items:center;font-size:11.5px;margin-bottom:4px;gap:6px}
.sf-lab{font-weight:600;color:var(--ink-60);display:flex;align-items:center}
.sf-val{font-family:var(--mono);color:var(--ink-60);flex:none}
.sf-val b{color:var(--ink);font-weight:500}
.sf-track{height:5px;border-radius:4px;background:var(--grid);overflow:hidden}
.sf-track i{display:block;height:100%;border-radius:4px}
.sf-heat{background:none;border:1px solid var(--line);border-radius:99px;padding:1px 6px;font-size:10px;color:var(--ink-60);margin-left:5px;cursor:pointer;min-height:0}
.card.input{background:var(--field);box-shadow:none}
.card.input > h2{color:var(--ink-30)}
.daytotals{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-bottom:14px}
.daytotals > div{background:var(--card);padding:9px 4px;text-align:center}
.daytotals span{display:block;font:600 9.5px/1 var(--sans);letter-spacing:.05em;text-transform:uppercase;color:var(--ink-60);margin-bottom:6px}
.daytotals b{font-family:var(--mono);font-size:16px;font-weight:500;font-variant-numeric:tabular-nums;color:var(--ink)}
.mealgrp{border-top:1px solid var(--line);padding-top:12px;margin-top:12px}
.mealgrp:first-child{border-top:0;margin-top:2px;padding-top:0}
.mealgrp-total{border-top-width:2px}
.mealgrp-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.mealgrp-t{font-weight:650;font-size:15px}
.mealgrp-k{font-family:var(--mono);font-size:13px;color:var(--ink);font-weight:500;flex:none}
.mealgrp-sub{font-family:var(--mono);font-size:11.5px;color:var(--ink-60);margin-top:3px}
.mi{display:flex;justify-content:space-between;gap:12px;border-top:1px solid var(--grid);padding:9px 0}
.mi-main{min-width:0;flex:1}
.mi-t{font-weight:600;font-size:14px}
.mi-amt{color:var(--teal);font-family:var(--mono);font-size:12px;margin-top:2px}
.mi-macros{font-family:var(--mono);font-size:11.5px;color:var(--ink-30);margin-top:3px}
.mi-side{flex:none;text-align:right}
.mi-k{font-family:var(--mono);font-size:14px;font-weight:500}
.mi-side .link{display:block;margin-top:2px;padding:2px 0}
.mealgrp-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
.mealgrp-toggle{background:none;border:0;padding:0;font:650 15px/1.2 var(--sans);color:var(--ink);display:flex;align-items:center;gap:7px;cursor:pointer;min-height:0}
.mealgrp-toggle .chev{color:var(--ink-30);font-size:11px;width:10px;display:inline-block;text-align:center}
.mealgrp-right{display:flex;align-items:center;gap:12px;flex:none}
.mealgrp-add{background:var(--accent);color:var(--on-accent);border:0;border-radius:50%;width:28px;height:28px;font-size:17px;line-height:1;padding:0;cursor:pointer}
.mi-empty{font-size:12.5px;color:var(--ink-30);padding:9px 0}
.foodtitle{font-weight:650;font-size:15px;margin-bottom:10px}
.askinput{font-size:16px}
.exmenu{background:none;border:1px solid var(--line);border-radius:9px;color:var(--ink-60);font-size:18px;line-height:1;padding:0;width:44px;height:38px;cursor:pointer}
.exmenu:active{background:var(--field)}
.exed-groups{margin-top:2px}
.exed-info{margin-top:10px}
.scanreticle{position:absolute;top:14%;bottom:14%;left:10%;right:10%;border:2px solid rgba(255,255,255,.5);border-radius:12px;pointer-events:none}
.scanline{position:absolute;left:-2px;right:-2px;top:50%;height:2px;background:var(--signal);box-shadow:0 0 10px var(--signal)}
/* Hinweis, wenn zu lange kein Backup gezogen wurde */
.warnbox{color:var(--signal)!important;border-left:3px solid var(--signal);padding-left:10px}
.tbasis{color:var(--ink-30);font-size:11px}
/* Hinweis, dass eine begonnene Einheit noch nicht gespeichert ist */
.dirty{font:600 11px/1 var(--sans);color:var(--signal);letter-spacing:0;margin-left:6px;text-transform:none}
/* Einheitliche Leerzustaende: sagen was fehlt UND was zu tun ist */
.emptybox{text-align:center;padding:22px 14px;border:1px dashed var(--line);border-radius:12px;background:var(--field)}
.eb-t{font:650 13.5px/1.3 var(--sans);color:var(--ink-60)}
.eb-s{font-size:12px;line-height:1.45;color:var(--ink-30);margin-top:6px;max-width:34ch;margin-left:auto;margin-right:auto}
.card.compact .emptybox{padding:14px 12px}

/* ---- Scanner: dreht sich NICHT mit dem Geraet ----
   Kippt man das Handy, um an einen schlecht erreichbaren Barcode zu kommen,
   dreht der Browser die Oberflaeche mit. Hier drehen wir das Sheet um denselben
   Winkel zurueck, damit es am Geraet klebt. Nebeneffekt und eigentlicher Zweck:
   der Barcode bleibt waagerecht im Kamerabild, der Decoder tut sich leichter. */
#scanOv .picksheet{transition:none}
#scanOv.scan-rot .picksheet{
  position:absolute;top:50%;left:50%;
  width:min(var(--vvh,100%),580px);
  max-height:92vw;
  border-radius:16px;
  transform-origin:50% 50%;
}
#scanOv.scan-rot .scanwrap{aspect-ratio:3/4}
.missbox{background:var(--field);border:1px solid var(--line);border-radius:12px;padding:16px;text-align:center}
.miss-t{font-weight:650;font-size:15px;margin-bottom:4px}
.miss-s{font-size:12.5px;color:var(--ink-60);line-height:1.5}
.miss-code{font-family:var(--mono);font-size:14px;color:var(--ink);margin-top:8px;letter-spacing:.04em}
.missbanner{background:color-mix(in srgb,var(--accent) 12%,var(--field));border:1px solid color-mix(in srgb,var(--accent) 35%,var(--line));border-radius:9px;padding:8px 10px;font-size:12px;color:var(--ink-60);margin:8px 0}
.wsel{display:flex;align-items:baseline;gap:10px;margin-bottom:8px;min-height:24px}
.wsel-w{font-family:var(--mono);font-size:23px;font-weight:600;color:var(--blue)}
.wsel-d{font-family:var(--mono);font-size:12px;color:var(--ink-60)}
.wsel-hint{font-size:12px;color:var(--ink-30)}
.wchart .wgrab{cursor:ew-resize}
.foodacts{display:flex;gap:8px;margin:0 0 10px}
.foodacts button{flex:1}
.foodcart{border-top:1px solid var(--line);margin-top:10px;padding-top:10px}
.cart-h{font:600 10px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-60);margin-bottom:8px}
.cart-i{display:flex;align-items:center;gap:10px;padding:5px 0}
.cart-t{flex:1;min-width:0;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cart-k{font-family:var(--mono);font-size:12px;color:var(--ink-60);flex:none}
.cart-x{flex:none;padding:2px 4px}
.cart-sum{font-family:var(--mono);font-size:12.5px;color:var(--ink);font-weight:500;margin-top:8px;text-align:right}
.card.compact{padding:13px}
.card.compact > h2{margin-bottom:10px}
.card.compact .goal{margin-bottom:9px}
.card.compact .goal:last-child{margin-bottom:0}
.card.compact .goal-bar{height:6px}
.card.compact .goal-sub{display:none}
.card.compact .pickgrp{padding:9px 0 5px}
.card.compact .empty{padding:10px 0}
.pnote{margin-top:8px;font-size:13.5px;padding:9px 12px;border-radius:9px}
.block input.pnote{background:color-mix(in srgb,var(--ochre) 10%,var(--card));border:1px solid color-mix(in srgb,var(--ochre) 28%,var(--line));border-left:3px solid var(--ochre)}
.block input.pnote::placeholder{color:color-mix(in srgb,var(--ochre) 62%,var(--ink-30))}
.block input.pnote:focus{border-left-color:var(--ochre);box-shadow:0 0 0 3px color-mix(in srgb,var(--ochre) 15%,transparent)}
.ff-hint{font-size:11.5px;color:var(--ink-60);margin-top:14px}
.ff-calc{font-family:var(--mono);font-size:14px;margin-top:10px;color:var(--ink-60)}
.ff-calc b{color:var(--ink);font-weight:500}
.ff-sizes{margin-top:6px}
.ff-unit{margin-bottom:4px}
.ff-gml>label.f,.ff-piece>label.f{margin-top:8px}
.exgrp-head{display:block;border-top:1px solid var(--grid);padding:11px 0 11px}
.exgrp-toggle{background:none;border:0;padding:0;width:100%;text-align:left;font:650 14px/1.2 var(--sans);color:var(--ink);display:flex;align-items:center;gap:8px;cursor:pointer;min-height:0}
.exgrp-toggle .chev{color:var(--ink-30);font-size:11px;width:10px;text-align:center;display:inline-block}
.exgrp-n{color:var(--ink-30);font-family:var(--mono);font-size:12px;margin-left:auto}
.exsub .li-t{padding-left:18px}
.exsub .li-s{padding-left:18px}
.ansub-seg{margin:16px 0 16px}
.wchart{touch-action:pan-y;-webkit-user-select:none;user-select:none;cursor:ew-resize}
.wsel{flex-wrap:wrap}
.wsel .wsel-hint{margin-left:auto}
.profcard{padding:14px}
.profcard > h2{margin:0 0 11px}
.profcard.flash{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent);transition:box-shadow .3s,border-color .3s}
.tmeta .tofix{padding:0;font-size:inherit;text-align:left;color:var(--accent);font-weight:600;text-decoration:underline;text-underline-offset:2px}
.profrow{display:flex;align-items:center;gap:8px;margin-bottom:9px;flex-wrap:wrap}
.profrow:last-of-type{margin-bottom:0}
.proflab{font:550 10px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-30);flex:none}
.profrow .phaseseg{margin-left:auto}
.profnum{width:62px;min-height:32px;padding:5px 8px;text-align:center;font-family:var(--mono);font-size:14px}
.profunit{font-family:var(--mono);font-size:11.5px;color:var(--ink-30);flex:none}
#profHint{font-size:11.5px;color:var(--ink-30)}
.aninsight{font-size:12.5px;line-height:1.5;color:var(--ink-60);background:var(--field);border:1px solid var(--line);border-radius:9px;padding:9px 11px;margin-top:12px}
.aninsight b{color:var(--ink);font-weight:600}
.mbar{margin-bottom:11px}.mbar:last-child{margin-bottom:0}
.mbar-top{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px}
.mbar-top span:first-child{font-weight:600}
.mbar-v{font-family:var(--mono);color:var(--ink-60)}
.mbar-track{height:8px;border-radius:5px;background:var(--grid);overflow:hidden}
.mbar-track i{display:block;height:100%;border-radius:5px;background:var(--accent)}
.macrolegend .ml{display:flex;align-items:center;gap:8px;margin-bottom:9px;font-size:13px}
.macrolegend .ml:last-child{margin-bottom:0}
.macrolegend .ml i{width:11px;height:11px;border-radius:3px;flex:none}
.macrolegend .ml b{font-family:var(--mono);font-weight:500}
.macrolegend .ml span{color:var(--ink-30);font-family:var(--mono);font-size:12px;margin-left:auto}
.imp-summary{font-size:13px;margin-bottom:12px}
.imp-sess{border:1px solid var(--line);border-radius:var(--r);padding:12px;margin-bottom:12px;background:var(--card)}
.imp-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.imp-day{flex:1;font-weight:600}
.imp-date{font-family:var(--mono);font-size:12px;color:var(--ink-60);flex:none}
.imp-ex{border-top:1px solid var(--grid);padding:10px 0 6px}
.imp-exhead{display:flex;gap:8px;align-items:center;margin-bottom:7px}
.imp-exname{flex:1;font-weight:600}
.imp-set{display:flex;align-items:center;gap:6px;margin-bottom:5px}
.imp-set .setno{width:14px;flex:none}
.imp-set input{flex:1;min-width:0;text-align:center}
.imp-x{font-size:11.5px;color:var(--ink-60);flex:none}
.imp-note{font-size:12px;color:var(--ink-30);margin:3px 0 5px}
.imp-raw{font-size:11px;color:var(--ink-30);font-family:var(--mono);margin-bottom:4px}
.imp-exsel{flex:1;min-width:0;font-weight:600}
.imp-delset,.imp-delex,.imp-delsess{flex:none}

/* ---- Körper-Dashboard (Prototyp-Layout) ---- */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0 0}
.grid2 .card{margin:0;padding:16px}
.wcard .lab{font:600 10px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-30);margin-bottom:10px}
.w-big{font-family:var(--mono);font-size:26px;font-weight:600;line-height:1}
.w-big span{font-size:12px;color:var(--ink-30)}
.w-delta{font-family:var(--mono);font-size:12px;font-weight:600;margin-top:5px;color:var(--ink-60)}
.w-delta.down{color:var(--teal)}
.w-delta.up{color:var(--ochre)}
.w-sub{font-family:var(--mono);font-size:11px;color:var(--ink-30);margin-top:4px}
.w-spark{margin-top:10px;display:block}
.ringcard{display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring-big{font-family:var(--mono);font-size:27px;font-weight:600;fill:var(--ink)}
.ring-lab{font:600 8.5px var(--sans);letter-spacing:.1em;fill:var(--ink-30)}
.ring-sub{font-family:var(--mono);font-size:12px;color:var(--ink-60);margin-top:6px}
.ring-sub b{color:var(--ink);font-weight:600}
.mac-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.mac-t{font:650 14px var(--sans)}
.pill{display:inline-flex;align-items:center;background:var(--field);border:1px solid var(--line);border-radius:99px;padding:4px 11px;font:600 11px var(--sans);color:var(--ink-60);min-height:0;cursor:pointer}
.pill:active{transform:none}
.bar{margin-bottom:11px}
.bar:last-child{margin-bottom:0}
.bar-top{display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px}
.bar-top .k{font-weight:600}
.bar-top .v{font-family:var(--mono);color:var(--ink-60)}
.bar-top .v b{color:var(--ink);font-weight:600}
.track{height:7px;border-radius:5px;background:var(--grid);overflow:hidden}
.track i{display:block;height:100%;border-radius:inherit}
.track.sm{height:6px}
.more{width:100%;margin-top:8px;background:none;border:0;color:var(--ink-60);font:600 12px var(--sans);padding:6px;min-height:0;cursor:pointer}
.more:active{transform:none}
.extra{padding-top:8px;border-top:1px solid var(--grid);margin-top:2px}
.extra .bar{margin:11px 0}
.tmeta{font-family:var(--mono);font-size:11px;color:var(--ink-30);margin-top:10px;text-align:right}
.card.meals{padding:6px 16px 14px}
.meals-head{display:flex;align-items:center;justify-content:space-between;padding:12px 0 2px}
.meals-head .t{font:650 15px var(--sans)}
.meals-head .k{font-family:var(--mono);font-size:13px;color:var(--ink-60)}
.card.meals .list{margin:0;padding:0;list-style:none}
.mealgrp-add{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;min-height:26px;border:0;border-radius:99px;background:var(--accent);color:var(--on-accent);font-size:15px;line-height:1;padding:0;flex:none}
.seclab{font:600 10px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-30);margin:24px 0 12px;padding:0 2px}

button.themetog{background:none;border:1px solid var(--line);border-radius:99px;width:34px;height:34px;min-height:34px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:14px;line-height:1;color:var(--ink-60);cursor:pointer}
button.themetog:active{transform:none}

/* ==== Redesign 07/26 ==== */
/* Bottom-Nav: safe-area nur einmal zaehlen */
:host{padding-bottom:calc(72px + env(safe-area-inset-bottom))}
nav{padding-bottom:0}
nav .inner{padding:6px 6px calc(6px + env(safe-area-inset-bottom))}
nav button{min-height:44px;padding:5px 2px;gap:3px}
.toast{bottom:calc(82px + env(safe-area-inset-bottom))}

/* Karten-Ueberschriften */
.card > h2{font:650 15px/1.25 var(--sans);letter-spacing:-.01em;text-transform:none;color:var(--ink);margin:0 0 12px}
.card.input > h2{color:var(--ink)}
.card.compact > h2{margin-bottom:10px}
.cardhead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 12px}
.cardhead > h2{margin:0}
.cardmeta{font-family:var(--mono);font-size:11.5px;color:var(--ink-30);flex:none}

/* Daten: Uebersicht + Import */
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.tiles > div{background:var(--card);padding:12px 3px;text-align:center}
.tiles b{display:block;font-family:var(--mono);font-size:20px;font-weight:600;font-variant-numeric:tabular-nums}
.tiles span{display:block;font:600 8.5px/1.2 var(--sans);letter-spacing:.09em;text-transform:uppercase;color:var(--ink-30);margin-top:6px}
.improw{display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid var(--grid)}
.improw:first-of-type{border-top:0;padding-top:2px}
.impic{flex:none;width:36px;height:36px;border-radius:10px;background:var(--field);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--ink-60)}
.impic svg{width:18px;height:18px}
.impmain{flex:1;min-width:0}
.impt{font-weight:600;font-size:14px}
.imps{font-size:12px;color:var(--ink-30);margin-top:2px}
.improw button{flex:none}

/* Koerper: kompakte Eingabezeile */
.quickin{display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:var(--field);border:1px solid var(--line);border-radius:14px;padding:10px;margin:14px 0 0}
.quickin input{flex:1 1 84px;min-width:0;width:auto;background:var(--card);padding:9px 10px;font-size:14px;min-height:40px}
.quickin input[type=date]{flex:1 1 124px;font-family:var(--mono);font-size:13px}
.quickin .qsave{flex:0 0 auto;padding:9px 16px;font-size:14px;min-height:40px}

/* Ziel-Sheet */
#goalOv .picksheet{max-height:94%;overflow-y:auto}
#goalOv .phaserow{margin:2px 0 14px}
.goalmeta{font-family:var(--mono);font-size:11.5px;color:var(--ink-30);margin-top:10px}

/* Plan: Tages-Badges */
.split-head .splitmeta{font-family:var(--mono);font-size:11.5px;color:var(--ink-30);flex:none}
.dayline{display:flex;align-items:center;gap:9px;min-width:0}
.daybadge{display:inline-flex;align-items:center;background:color-mix(in srgb,var(--accent) 16%,transparent);border:1px solid color-mix(in srgb,var(--accent) 34%,transparent);color:var(--accent);border-radius:99px;padding:3px 10px;font:650 11.5px/1 var(--sans);flex:none}
.daycount{font-family:var(--mono);font-size:12px;color:var(--ink-60)}
.day .day-ex{margin-top:7px}

/* Training: Einheit-Karte */
#unitCard .block{background:var(--field);box-shadow:none}
#unitPill{max-width:62%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block}
`;

const TAP_CSS = `
/* ===================================================================
   TOUCH-TARGETS
   Alles Anklickbare auf mindestens --tap (44 px, Apples Mindestmass
   fuer Trefferflaechen) und optisch etwas grosszuegiger. Bewusst als
   eigener Block ganz am Ende, damit sich die Groessen an einer Stelle
   nachjustieren oder komplett wieder entfernen lassen.
   Reihenfolge beachten: die Ausnahmen stehen absichtlich hinter der
   allgemeinen button-Regel und ueberschreiben sie.
   =================================================================== */

/* --- Buttons allgemein --- */
button{padding:13px 18px;min-height:var(--tap)}
button.tiny{padding:11px 14px;font-size:13.5px;min-height:var(--tap)}
button.link{padding:10px 4px;font-size:13.5px;min-height:40px}

/* --- Kopfzeile --- */
.hicon{padding:9px 14px;font-size:15px;min-height:40px}
button.today{padding:9px 13px;font-size:12.5px;min-height:40px}
button.themetog{width:40px;height:40px;min-height:40px;font-size:15px}

/* --- Bottom-Nav: das am haeufigsten getroffene Element der App --- */
nav button{min-height:54px;padding:8px 2px;gap:5px;font-size:11px}
nav button svg{width:25px;height:25px}

/* --- Pills, Chips, Segmente --- */
.pill{padding:8px 14px;font-size:12.5px;min-height:36px;align-items:center}
.chip{display:inline-flex;align-items:center;padding:10px 15px;font-size:13px;min-height:40px}
.pickchips{gap:8px}
.seg button{min-height:46px;padding:12px 0;font-size:12.5px}
.phaseseg{padding:3px}
.phaseseg button{padding:8px 14px;font-size:12px;min-height:34px}
.more{padding:13px 8px;font-size:12.5px;min-height:var(--tap)}

/* --- Listen und Auswahl --- */
.pickitem{padding:13px 4px;min-height:52px}
ul.list li{padding:13px 0}
.improw{padding:13px 0}

/* --- Mahlzeiten --- */
.mealgrp-toggle{min-height:var(--tap);padding:2px 0}
.mealgrp-toggle .chev{font-size:13px;width:13px}
.mealgrp-add{width:38px;height:38px;min-height:38px;font-size:21px}
.mi-side .link{display:block;margin-top:0;padding:9px 0;min-height:38px}

/* --- Trainingslog: Saetze loeschen, Bloecke entfernen --- */
.block-head .rm,.setrow .del{min-width:var(--tap);min-height:var(--tap);padding:10px 0;font-size:17px}

/* --- Eingabefelder: zaehlen als Trefferflaeche, oft einhaendig bedient --- */
input,select,textarea{padding:12px 13px;min-height:var(--tap)}
.quickin{padding:11px}
.quickin input{padding:11px;min-height:var(--tap)}
.quickin .qsave{padding:11px 18px;min-height:var(--tap)}

/* --- Warenkorb der Produktsuche --- */
button.link.cart-x{padding:10px 12px;min-height:var(--tap);font-size:15px}
`;

const GYM_CSS = `
/* ===================================================================
   TRAINING: Satzzeile mit RIR und Aufwärmen, Startknopf, aktiver Modus
   =================================================================== */

/* --- Satzzeile: vier Felder plus zwei Knöpfe, deshalb enger geführt --- */
.setrow input.rir{flex:0 0 66px}
.setrow .warmtog{
  flex:none;width:38px;min-width:38px;padding:9px 0;text-align:center;border:1px solid var(--line);
  background:transparent;color:var(--ink-30);font:700 12px/1 var(--sans);border-radius:var(--ri)
}
.setrow .warmtog[aria-pressed="true"]{background:var(--ochre);border-color:var(--ochre);color:var(--on-accent)}
.setrow[data-warm="1"] input{opacity:.72}
.setrow[data-done="1"]{position:relative}
.setrow[data-done="1"]::after{
  content:"✓";position:absolute;left:-2px;top:50%;transform:translateY(-50%);
  color:var(--teal);font-weight:700;font-size:13px;pointer-events:none
}
.setrow[data-done="1"] input{border-color:color-mix(in srgb,var(--teal) 45%,var(--line))}

/* --- Startknopf: der wichtigste Knopf der App --- */
.startbtn{
  width:100%;display:flex;align-items:center;justify-content:center;gap:9px;
  padding:16px 18px;font-size:16px;font-weight:700;letter-spacing:.01em;
  border-radius:14px;min-height:56px;
  box-shadow:0 2px 10px color-mix(in srgb,var(--accent) 28%,transparent)
}
.startbtn .sb-s{font:500 12px/1 var(--sans);opacity:.85;display:block;margin-top:3px}
.startbtn{flex-direction:column;gap:0}
/* Laeuft noch eine Einheit, wechselt der Knopf auf die Signalfarbe */
.startbtn.resume{background:var(--ochre);border-color:var(--ochre);color:var(--on-accent);box-shadow:0 2px 10px color-mix(in srgb,var(--ochre) 30%,transparent)}
#startCard{margin-top:14px}

/* --- Aktiver Trainingsmodus: eigener Vollbildmodus --- */
.atov{
  position:fixed;left:0;right:0;top:var(--vvt,0px);height:var(--vvh,100%);
  z-index:70;background:var(--bg);display:flex;flex-direction:column
}
.atwrap{
  width:100%;max-width:580px;margin:0 auto;flex:1;min-height:0;
  display:flex;flex-direction:column;
  padding:calc(12px + env(safe-area-inset-top)) 16px calc(12px + env(safe-area-inset-bottom))
}
.athead{display:flex;align-items:center;justify-content:space-between;gap:10px;flex:none}
.atcount{font:600 11px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-60)}
.atdur{font-family:var(--mono);font-size:12px;color:var(--ink-30);font-variant-numeric:tabular-nums;margin-left:auto;margin-right:12px}
.atbar{height:6px;border-radius:99px;background:var(--grid);overflow:hidden;margin:10px 0 6px;flex:none}
.atbar i{display:block;height:100%;background:var(--accent);border-radius:99px;transition:width .25s}
.atprog{font-family:var(--mono);font-size:11.5px;color:var(--ink-30);flex:none}
.atbody{flex:1;min-height:0;overflow-y:auto;padding:12px 0 4px}

.atex{font:700 24px/1.15 var(--sans);letter-spacing:-.01em;margin-bottom:6px}
.atref{font-family:var(--mono);font-size:11.5px;color:var(--ink-60);line-height:1.5}
.atsug{
  margin-top:10px;padding:10px 12px;border-radius:11px;background:var(--field);
  border:1px solid var(--line);font-family:var(--mono);font-size:12px;color:var(--ink);
  display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap
}
.atsug .link{color:var(--accent);font-weight:600;white-space:nowrap}

.atsets{margin:14px 0 0}
.atset{
  display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:11px;
  background:var(--field);border:1px solid var(--line);margin-bottom:7px;min-height:var(--tap);cursor:pointer
}
.atset.done{background:color-mix(in srgb,var(--teal) 12%,var(--card));border-color:color-mix(in srgb,var(--teal) 35%,var(--line))}
.atset.warm{border-style:dashed}
.ats-n{font-family:var(--mono);font-size:12px;color:var(--ink-30);width:22px;flex:none}
.ats-v{font-family:var(--mono);font-size:14px;flex:1}
.ats-c{color:var(--teal);font-weight:700;flex:none}

.atnow{margin-top:16px;padding:14px;border-radius:14px;background:var(--card);border:1px solid var(--line)}
.atnow-l{font:600 10px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60);margin-bottom:10px}
.atnow-in{display:flex;gap:9px}
.atnow-in label{flex:1;display:block}
.atnow-in span{display:block;font:550 10px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-30);margin-bottom:5px}
.atnow-in input{font-family:var(--mono);font-size:22px;text-align:center;padding:12px 6px;min-height:56px}
.atnow-a{display:flex;gap:9px;margin-top:12px}
.atnow-a .at-warm{flex:0 0 auto;font-size:13px}
.atnow-a .at-warm[aria-pressed="true"]{background:var(--ochre);border-color:var(--ochre);color:var(--on-accent)}
.atnow-a .at-ok{flex:1;font-size:16px;min-height:54px}

.atrest{flex:none;margin-top:10px;padding:12px 14px;border-radius:13px;background:var(--field);border:1px solid var(--line);text-align:center}
.atrest.over{background:color-mix(in srgb,var(--signal) 16%,var(--card));border-color:var(--signal)}
.atrest-l{font:600 10px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60)}
.atrest-v{font-family:var(--mono);font-size:32px;font-variant-numeric:tabular-nums;margin:5px 0 9px}
.atrest.over .atrest-v{color:var(--signal)}
.atrest-a{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}

.atnav{display:flex;gap:9px;margin-top:10px;flex:none}
.atnav button{flex:1}
.atsave{width:100%;margin-top:9px;flex:none;min-height:52px;font-size:15px}

/* --- Fortsetzen-Leiste ueber der Navigation --- */
.resumebar{
  position:fixed;left:10px;right:10px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:45;
  display:flex;align-items:center;gap:10px;
  background:var(--ochre);color:var(--on-accent);
  border-radius:14px;padding:11px 12px 11px 14px;
  box-shadow:0 8px 24px color-mix(in srgb,var(--ochre) 40%,transparent);
  max-width:560px;margin:0 auto
}
.resumebar.over{background:var(--signal);box-shadow:0 8px 24px color-mix(in srgb,var(--signal) 40%,transparent)}
.rb-dot{width:8px;height:8px;border-radius:50%;background:var(--on-accent);flex:none;opacity:.9}
.rb-t{flex:1;font:600 13px/1.2 var(--sans);min-width:0}
.rb-r{font-family:var(--mono);font-size:15px;font-variant-numeric:tabular-nums;flex:none}
.rb-go{flex:none;background:var(--on-accent);color:var(--ochre);border:0;padding:9px 14px;font-size:13px;font-weight:700;min-height:38px;border-radius:10px}
.resumebar.over .rb-go{color:var(--signal)}

/* --- Uebungsbloecke: zugeklappt als Uebersicht, aufgeklappt zum Korrigieren --- */
.block .blockbody{display:none}
.block[data-open="1"] .blockbody{display:block}
.block[data-open="1"] .blocksum{display:none}
.blocksum{
  display:flex;align-items:baseline;justify-content:space-between;gap:10px;width:100%;
  background:none;border:0;padding:2px 0 2px;text-align:left;min-height:34px;color:var(--ink)
}
.bs-v{font-family:var(--mono);font-size:12.5px;color:var(--ink-60);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bs-v.bs-leer{color:var(--ink-30)}
.bs-n{font-family:var(--mono);font-size:11px;color:var(--ink-30);flex:none}
.blocktog{
  flex:none;width:38px;min-width:38px;padding:9px 0;text-align:center;border:0;
  background:transparent;color:var(--ink-30);font-size:13px;border-radius:var(--ri)
}
.block-fertig{box-shadow:inset 3px 0 0 var(--teal),0 1px 2px rgba(15,23,32,.04)}
.block-fertig .bs-n{color:var(--teal)}

/* Waehrend getippt wird, ist Speichern gesperrt — sichtbar, damit der
   ausgegraute Knopf nicht wie ein Fehler wirkt. */
:host([typing="1"]) #saveW,
:host([typing="1"]) .atsave{opacity:.4;filter:grayscale(.5)}
.refsug{color:var(--accent);font-weight:600;margin-top:4px}
`;
class LogbuchApp extends HTMLElement{
  connectedCallback(){
    if(this._i) return; this._i = 1;
    const root = this.attachShadow({mode:'open'});
    root.innerHTML = '<style>' + PALETTE_CSS + CSS + EXTRA_CSS + TAP_CSS + GYM_CSS + '</style>' + MARKUP;
    run(root);
  }
  static get observedAttributes(){ return ['accent']; }
  attributeChangedCallback(name, o, v){
    if(name==='accent'){ if(v) this.style.setProperty('--accent-base', v); else this.style.removeProperty('--accent-base'); }
  }
}
function run(root){

/* ---------------- Speicher ---------------- */
const KEY = 'logbuch.v1';
const Store = {
  async load(){
    try{
      if(window.storage){
        const r = await window.storage.get(KEY);
        if(r && r.value) return JSON.parse(r.value);
      }
    }catch(e){}
    try{
      const l = localStorage.getItem(KEY);
      if(l) return JSON.parse(l);
    }catch(e){}
    return null;
  },
  // Gibt zurueck, ob wirklich geschrieben wurde. Frueher wurde ein volles
  // Speicherkontingent stillschweigend verschluckt — die App meldete "gespeichert",
  // obwohl nichts ankam. In einer Tracking-App ist das der teuerste Fehlertyp.
  async save(d){
    const s = JSON.stringify(d);
    let ok = false;
    try{ localStorage.setItem(KEY,s); ok = true; }catch(e){}
    try{ if(window.storage){ await window.storage.set(KEY,s); ok = true; } }catch(e){}
    if(!ok){ try{ toast('Speichern fehlgeschlagen — bitte Backup exportieren'); }catch(e){} }
    return ok;
  }
};

const DEFAULT_EX = ['Bankdrücken','Schrägbankdrücken KH','Kniebeuge','Kreuzheben','Rudern vorgebeugt','Latzug','Schulterdrücken KH','Beinpresse','Bizepscurls KH','Trizepsdrücken Kabel'];
const DEFAULT_MEALS = ['Frühstück','Mittagessen','Abendessen','Snack'];
const DEFAULT_GOALS = {sessions:3, setsPerMuscle:10, kcalTarget:2200, proteinTarget:150, restSec:120};
// RIR = Wiederholungen in Reserve. Bewusst RIR statt RPE: leichter zu schaetzen
// und ohne Umrechnung im Kopf. 0 = nichts mehr gegangen.
const RIR_MAX = 5;
// Zielpause pro Uebung, sonst der globale Wert aus den Zielen.
function restTargetFor(ex){
  const per = (db.exRest||{})[ex];
  if(per>0) return per;
  return (db.goals && db.goals.restSec) || 120;
}
// Umfaenge: Schluessel in db.body[].meas, Reihenfolge = Anzeigereihenfolge.
const MEAS_SITES = [
  {k:'waist',  label:'Bauch',    color:'var(--signal)'},
  {k:'chest',  label:'Brust',    color:'var(--blue)'},
  {k:'arm',    label:'Oberarm',  color:'var(--teal)'},
  {k:'thigh',  label:'Oberschenkel', color:'var(--ochre)'},
  {k:'hip',    label:'Hüfte',    color:'var(--mc)'},
];
// Trainingspause: ab hier gilt eine Luecke als Pause und nicht als Rhythmus.
const PAUSE_MIN_D = 14;

/* Phasen-Modell: Nutzer wählt Phase + Intensität in der App.
   delta = kcal/Tag ggü. dem geschätzten Erhaltungsbedarf. */
const CUT_LEVELS = [
  {id:'sanft',     delta:-300, label:'Sanft',     prog:'~0,27 kg/Woche', fx:'kaum Muskelverlust, Training bleibt stark, gut durchzuhalten. Langsam.'},
  {id:'moderat',   delta:-450, label:'Moderat',   prog:'~0,41 kg/Woche', fx:'geringes Muskelverlust-Risiko bei genug Protein, leichter Hunger.'},
  {id:'zuegig',    delta:-650, label:'Zügig',     prog:'~0,59 kg/Woche', fx:'spürbarer Hunger, Leistung kann sinken, mehr Muskelverlust-Risiko.'},
  {id:'aggressiv', delta:-800, label:'Aggressiv', prog:'~0,73 kg/Woche', fx:'hoher Hunger, deutliches Muskel-/Leistungsrisiko. Nur kurzfristig.'},
];
const BULK_LEVELS = [
  {id:'lean',      delta:200,  label:'Lean',      prog:'~0,18 kg/Woche', fx:'minimaler Fettaufbau, recomp-nah. Langsamer Aufbau.'},
  {id:'standard',  delta:300,  label:'Standard',  prog:'~0,27 kg/Woche', fx:'solider Aufbau bei vertretbarem Fettanteil.'},
  {id:'aggressiv', delta:450,  label:'Aggressiv', prog:'~0,41 kg/Woche', fx:'schneller Aufbau, mehr Fett, längerer Cut danach nötig.'},
];
const DEFAULT_NUTRITION = { phase:'maintain', cutLevel:'moderat', bulkLevel:'standard', mode:'auto', manualKcal:null };

// Vollstaendiger Startzustand. Eine Quelle fuer Init UND Zuruecksetzen — vorher
// setzte "Alle Daten loeschen" nur vier Felder und die App stuerzte danach ab.
function freshDb(){
  return {exercises:[...DEFAULT_EX], workouts:[], body:[], splits:[], exGroups:{}, exNotes:{},
          customBarcodes:{}, heat:{}, exRest:{}, savedMeals:[], sex:'m', age:null, height:null,
          mealTypes:[...DEFAULT_MEALS], goals:{...DEFAULT_GOALS}, foodFav:[],
          nutrition:{...DEFAULT_NUTRITION}, ui:{theme:'auto'}, lastExport:null};
}
let db = freshDb();

/* ---------------- Helfer ---------------- */
let macroMore = false;   // "Mehr anzeigen" in der Makro-Karte (Ballaststoffe/Salz)
const de = n => Number(n).toLocaleString('de-DE');
const dec1 = n => Number(n).toLocaleString('de-DE',{minimumFractionDigits:1,maximumFractionDigits:1});

const $ = s => root.querySelector(s);
const $$ = s => [...root.querySelectorAll(s)];
const iso = d => new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const TODAY = iso(new Date());
const fmtDate = s => { const [y,m,d]=s.split('-'); return `${d}.${m}.${y.slice(2)}`; };
const num = v => { const n = parseFloat(String(v).replace(',','.')); return isFinite(n)?n:null; };
// Epley. Zwei Korrekturen gegenueber der reinen Formel:
// bei einer Wiederholung IST das Gewicht das 1RM (Epley wuerde +3,3 % draufgeben),
// und oberhalb von 12 Wiederholungen driftet die Formel stark nach oben — dort
// wird gedeckelt, sonst ergibt ein 20er-Satz einen Fantasiewert.
const E1RM_MAX_REPS = 12;
const e1rm = (w,r) => {
  if(!(r>0)) return 0;
  if(r<=1) return w;
  return w*(1+Math.min(r,E1RM_MAX_REPS)/30);
};
const round = (n,d=1) => Math.round(n*10**d)/10**d;
const uid = () => Math.random().toString(36).slice(2,9);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(t._x); t._x=setTimeout(()=>t.classList.remove('on'),2200); }

// Aufwaermsaetze zaehlen nicht als Trainingsreiz: nicht ins Volumen, nicht in
// den e1RM und nicht gegen das Wochenziel pro Muskelgruppe. Altbestand ohne
// das Feld gilt als Arbeitssatz.
const isWork = s => !s.warm;
function workSets(w){ return (w && w.sets ? w.sets : []).filter(isWork); }
function sessionStats(w){
  const sets = workSets(w).filter(s=>s.w!=null && s.r!=null);
  const vol = sets.reduce((a,s)=>a+s.w*s.r,0);
  const best = sets.reduce((a,s)=>Math.max(a,e1rm(s.w,s.r)),0);
  return {vol, best, n:sets.length};
}
function sma(arr, key, win){
  return arr.map((_,i)=>{
    const from = Math.max(0,i-win+1);
    const slice = arr.slice(from,i+1).map(x=>x[key]).filter(v=>v!=null);
    if(!slice.length) return null;
    return slice.reduce((a,b)=>a+b,0)/slice.length;
  });
}
function linSlope(pts){
  const n = pts.length; if(n<2) return null;
  const mx = pts.reduce((a,p)=>a+p.x,0)/n, my = pts.reduce((a,p)=>a+p.y,0)/n;
  let nu=0, de=0;
  for(const p of pts){ nu += (p.x-mx)*(p.y-my); de += (p.x-mx)**2; }
  return de===0 ? null : nu/de;
}

/* ---------------- Ernährung: Phase → Kalorienziel ---------------- */
// Geschätzter Erhaltungsbedarf aus Gewichtstrend + Ø-kcal (7700 kcal ≈ 1 kg).
// Gibt null zurück, wenn zu wenig Daten (kein Fantasiewert).
// Mindestdatenlage, ab der der empirische Wert belastbar ist. Darunter ist der
// Gewichtstrend reines Rauschen (Wasser/Darminhalt schwanken um ±1 kg am Tag).
const EMP_MIN_WEIGHTS = 10, EMP_MIN_SPAN_D = 14, EMP_MIN_KCAL_DAYS = 7;
// Auswertungsfenster. Gewichtstrend und kcal-Schnitt MUESSEN aus demselben
// Zeitraum stammen, sonst wird eine alte Phase gegen eine neue gerechnet.
// Frueher lief beides ueber die gesamte Historie: bei langer importierter
// Gewichtsreihe und kurzer kcal-Reihe lag der Erhaltungsbedarf um mehrere
// hundert kcal daneben. 28 Tage sind der Kompromiss aus Rauschunterdrueckung
// (Wasser, Darminhalt) und Aktualitaet.
const EMP_WINDOW_D = 28;
function empWindow(){
  const T = s => new Date(s+'T12:00:00').getTime();
  const from = T(TODAY) - (EMP_WINDOW_D-1)*864e5;
  const rows = bodySorted().filter(x=>T(x.date)>=from && T(x.date)<=T(TODAY));
  const ws = rows.filter(x=>x.weight!=null);
  const kd = rows.filter(x=>x.kcal!=null);
  const span = ws.length>1 ? Math.round((T(ws[ws.length-1].date)-T(ws[0].date))/864e5) : 0;
  return { ws, kd, weights:ws.length, kcalDays:kd.length, spanDays:span };
}
function empiricalCoverage(){
  const w = empWindow();
  return { weights:w.weights, spanDays:w.spanDays, kcalDays:w.kcalDays, windowDays:EMP_WINDOW_D,
           enough: w.weights>=EMP_MIN_WEIGHTS && w.spanDays>=EMP_MIN_SPAN_D && w.kcalDays>=EMP_MIN_KCAL_DAYS };
}
function estimateMaintenance(){
  const w = empWindow();
  if(!empiricalCoverage().enough) return null;
  const slope = linSlope(w.ws.map(x=>({x:new Date(x.date+'T12:00:00').getTime()/864e5, y:x.weight})));
  if(slope==null) return null;
  const kcAvg = w.kd.reduce((a,c)=>a+c.kcal,0)/w.kd.length;
  const bal = slope*7700;   // kcal/Tag Ueber- bzw. Unterschuss (7700 kcal ~ 1 kg)
  return kcAvg - bal;
}
// Fallback, solange die Messdaten nicht reichen: Mifflin-St-Jeor (BMR) mal
// einem Aktivitätsfaktor aus den Schritten. Reine Schätzung — sobald genug
// gemessen ist, gewinnt immer estimateMaintenance().
function latestWeight(){
  const ws = bodySorted().filter(x=>x.weight!=null);
  return ws.length ? ws[ws.length-1].weight : null;
}
function bmrMifflin(){
  const w = latestWeight(), h = db.height, a = db.age;
  if(!w || !h || !a) return null;
  return 10*w + 6.25*h - 5*a + (db.sex==='w' ? -161 : 5);
}
function activityFactor(){
  const st = bodySorted().map(x=>x.steps).filter(v=>v!=null).slice(-30);
  if(!st.length) return 1.5;
  const avg = st.reduce((a,c)=>a+c,0)/st.length;
  if(avg<5000) return 1.4;
  if(avg<7500) return 1.5;
  if(avg<10000) return 1.6;
  if(avg<12500) return 1.7;
  return 1.8;
}
function estimateFormula(){
  const bmr = bmrMifflin();
  return bmr==null ? null : bmr*activityFactor();
}
function missingProfileFields(){
  const m = [];
  if(!db.age) m.push('Alter');
  if(!db.height) m.push('Größe');
  if(latestWeight()==null) m.push('Gewicht');
  return m;
}
// Aktuelles Phasen-Delta (kcal/Tag) je nach gewählter Phase + Intensität.
function phaseDelta(){
  const n = db.nutrition || DEFAULT_NUTRITION;
  if(n.phase==='cut')  return (CUT_LEVELS.find(l=>l.id===n.cutLevel)   || CUT_LEVELS[1]).delta;
  if(n.phase==='bulk') return (BULK_LEVELS.find(l=>l.id===n.bulkLevel) || BULK_LEVELS[1]).delta;
  return 0; // maintain / recomp
}
// Das eine Kalorienziel, das die ganze App abfragt (Header, Dashboard, Ziele).
function calorieTarget(){
  const n = db.nutrition || DEFAULT_NUTRITION;
  if(n.mode==='manual') return { kcal: n.manualKcal!=null ? n.manualKcal : (db.goals.kcalTarget||null), source:'manual' };
  const maint = estimateMaintenance();
  if(maint!=null){ const cov=empiricalCoverage();
    return { kcal: Math.round(maint + phaseDelta()), source:'auto', phase:n.phase, maint:Math.round(maint), cov }; }
  // Noch zu wenig gemessen → Formel-Schätzung aus dem Profil
  const est = estimateFormula();
  if(est!=null) return { kcal: Math.round(est + phaseDelta()), source:'formel', phase:n.phase, maint:Math.round(est) };
  const miss = missingProfileFields();
  return { kcal:null, source:'auto', reason: miss.length
    ? 'zu wenig Daten — im Profil ' + miss.join(' & ') + ' eintragen'
    : 'zu wenig Daten (Gewicht + kcal über ~2 Wochen loggen)' };
}
const MUSCLE_RULES = [
  ['Bauch', ['bauch','crunch','plank','situp','sit-up','abs','core','rumpf','beinheben','russian twist','klappmesser']],
  ['Beine', ['kniebeuge','squat','beinpresse','bein','leg','ausfall','lunge','wade','calf','glute','hip','rdl','adduktor','abduktor']],
  ['Trizeps', ['trizep','tricep','pushdown','dip','french','skull','überkopfstreck']],
  ['Bizeps', ['bizep','bicep','curl','hammer']],
  ['Schultern', ['schulter','shoulder','seitheben','lateral','delt','military','overhead','arnold','face pull','reverse fly','frontheben']],
  ['Brust', ['bank','brust','chest','fliegende','butterfly','fly','pec','liegestütz','push-up','pushup']],
  ['Rücken', ['ruder','row','lat','klimm','pull','kreuzheb','deadlift','überzüge','zug','shrug','hyperextension']],
];
function muscleGuess(ex){
  const n = String(ex).toLowerCase();
  for(const [g, words] of MUSCLE_RULES) if(words.some(w=>n.includes(w))) return g;
  return 'Sonstige';
}
function muscleOf(ex){
  if(db.exGroups && db.exGroups[ex]) return db.exGroups[ex];
  return muscleGuess(ex);
}
function lastSession(ex){
  return db.workouts.filter(w=>w.exercise===ex).sort((a,b)=>a.date<b.date?1:-1)[0]||null;
}
function ensureEx(name){
  if(name && !db.exercises.includes(name)){
    db.exercises.push(name);
    db.exercises.sort((a,b)=>a.localeCompare(b,'de'));
  }
}
function allDays(){
  const out=[];
  for(const s of db.splits) for(const d of s.days) out.push({split:s, day:d});
  return out;
}
function findDay(id){
  for(const s of db.splits){ const d=s.days.find(x=>x.id===id); if(d) return {split:s, day:d}; }
  return null;
}

/* ---------------- Diagramme ---------------- */
// Catmull-Rom-Spline als kubische Beziers. Die Kontrollpunkte werden auf den
// y-Bereich des jeweiligen Segments geklemmt: eine geglaettete Linie darf
// nirgends ueber den tatsaechlich gemessenen Wert hinausschiessen, sonst zeigt
// der Graph Gewichte an, die es nie gegeben hat.
function smoothPath(cs, t){
  const f = n => n.toFixed(1);
  if(!cs.length) return '';
  if(cs.length===1) return 'M'+f(cs[0][0])+','+f(cs[0][1]);
  if(cs.length===2) return 'M'+f(cs[0][0])+','+f(cs[0][1])+' L'+f(cs[1][0])+','+f(cs[1][1]);
  t = (t==null) ? 0.5 : t;
  let d = 'M'+f(cs[0][0])+','+f(cs[0][1]);
  for(let i=0;i<cs.length-1;i++){
    const p0=cs[i-1]||cs[i], p1=cs[i], p2=cs[i+1], p3=cs[i+2]||cs[i+1];
    const lo=Math.min(p1[1],p2[1]), hi=Math.max(p1[1],p2[1]);
    const c1x=p1[0]+(p2[0]-p0[0])/6*t, c2x=p2[0]-(p3[0]-p1[0])/6*t;
    let c1y=p1[1]+(p2[1]-p0[1])/6*t, c2y=p2[1]-(p3[1]-p1[1])/6*t;
    c1y=Math.max(lo,Math.min(hi,c1y)); c2y=Math.max(lo,Math.min(hi,c2y));
    d += ' C'+f(c1x)+','+f(c1y)+' '+f(c2x)+','+f(c2y)+' '+f(p2[0])+','+f(p2[1]);
  }
  return d;
}

function chart(series, opts={}){
  const W=520, H=opts.h||190, PL=38, PR=opts.pr||8, PT=10, PB=24;
  const all = series.flatMap(s=>s.pts);
  if(all.length<1) return `<div class="emptybox"><div class="eb-t">Noch keine Daten</div><div class="eb-s">Sobald Eintraege im gewaehlten Zeitraum liegen, erscheint hier ein Verlauf.</div></div>`;
  const xs = all.map(p=>p.x), x0=Math.min(...xs), x1=Math.max(...xs);
  const spanX = (x1-x0)||1;
  const X = x => PL + (x-x0)/spanX*(W-PL-PR);
  const axes = {};
  for(const ax of ['l','r']){
    const v = series.filter(s=>(s.axis||'l')===ax).flatMap(s=>s.pts.map(p=>p.y)).filter(y=>y!=null);
    if(!v.length) continue;
    let lo=Math.min(...v), hi=Math.max(...v);
    if(opts.zero && ax==='l') lo=0;
    const pad=(hi-lo)*0.12 || (Math.abs(hi)*0.05+1);
    axes[ax]={lo:lo-pad, hi:hi+pad};
  }
  const Y = (y,ax='l') => { const a=axes[ax]; const sp=(a.hi-a.lo)||1; return PT+(1-(y-a.lo)/sp)*(H-PT-PB); };
  let g='';
  const A = axes.l || axes.r;
  if(!A) return `<div class="emptybox"><div class="eb-t">Noch keine Daten</div><div class="eb-s">Sobald Eintraege im gewaehlten Zeitraum liegen, erscheint hier ein Verlauf.</div></div>`;
  for(let i=0;i<=3;i++){
    const val = A.lo + (A.hi-A.lo)*i/3;
    const y = PT + (1-(val-A.lo)/((A.hi-A.lo)||1))*(H-PT-PB);
    g += `<line x1="${PL}" y1="${y.toFixed(1)}" x2="${W-PR}" y2="${y.toFixed(1)}" stroke="var(--grid)" stroke-width="1"/>`;
    g += `<text x="${PL-6}" y="${(y+3.5).toFixed(1)}" text-anchor="end" font-family="var(--mono)" font-size="9" fill="var(--ink-30)">${round(val, Math.abs(A.hi)<20?1:0)}</text>`;
  }
  for(const x of [x0,x1]){
    g += `<text x="${X(x).toFixed(1)}" y="${H-8}" text-anchor="${x===x0?'start':'end'}" font-family="var(--mono)" font-size="9" fill="var(--ink-30)">${fmtDate(iso(new Date(x)))}</text>`;
  }
  for(const s of series){
    const ax = s.axis||'l';
    const pts = s.pts.filter(p=>p.y!=null);
    if(!pts.length) continue;
    if(s.type==='bar'){
      const bw = Math.max(2, (W-PL-PR)/Math.max(pts.length,1)*0.55);
      for(const p of pts){
        const y=Y(p.y,ax), yb=Y(axes[ax].lo,ax);
        g += `<rect x="${(X(p.x)-bw/2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1,yb-y).toFixed(1)}" fill="${s.color}" opacity="${s.op||.5}"/>`;
      }
      continue;
    }
    const co = pts.map(p=>[X(p.x), Y(p.y,ax)]);
    const d = s.smooth ? smoothPath(co) : co.map((c,i)=>`${i?'L':'M'}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(' ');
    g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.w||1.8}" stroke-linejoin="round" stroke-linecap="round" ${s.dash?`stroke-dasharray="3 3"`:''} opacity="${s.op||1}"/>`;
    if(s.dots) for(const p of pts) g += `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y,ax).toFixed(1)}" r="${s.dots}" fill="${s.color}"/>`;
    if(s.prs) for(const p of pts.filter(p=>p.pr)) g += `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y,ax).toFixed(1)}" r="3.4" fill="var(--signal)" stroke="var(--card)" stroke-width="1.5"/>`;
  }
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${g}</svg>`;
}

/* ---------------- Übungs-Picker (Suche + Muskelgruppen-Filter) ---------------- */
const GROUP_ORDER = ['Brust','Rücken','Schultern','Beine','Bizeps','Trizeps','Bauch','Sonstige'];
const pickOv = document.createElement('div');
pickOv.className = 'pickov';
pickOv.style.display = 'none';
pickOv.innerHTML = `
  <div class="picksheet">
    <input class="picksearch" type="text" placeholder="Übung suchen…">
    <div class="pickchips"></div>
    <div class="picklist"></div>
    <button class="ghost tiny picknew">＋ Neue Übung anlegen</button>
    <button class="link pickclose">Abbrechen</button>
  </div>`;
root.appendChild(pickOv);
let pickRes = null;
function closePick(val){
  pickOv.style.display = 'none';
  const r = pickRes; pickRes = null;
  if(r) r(val||null);
}
function renderPickChips(){
  const grp = pickOv.dataset.grp || 'Alle';
  const groups = ['Alle', ...GROUP_ORDER.filter(g=>db.exercises.some(e=>muscleOf(e)===g))];
  pickOv.querySelector('.pickchips').innerHTML = groups.map(g=>`<button class="chip${g===grp?' on':''}" data-g="${g}">${g}</button>`).join('');
  pickOv.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ pickOv.dataset.grp = b.dataset.g; renderPickChips(); renderPickList(); });
}
function renderPickList(){
  const q = pickOv.querySelector('.picksearch').value.trim().toLowerCase();
  const grp = pickOv.dataset.grp || 'Alle';
  const items = db.exercises.filter(e=>(!q || e.toLowerCase().includes(q)) && (grp==='Alle' || muscleOf(e)===grp));
  const byG = {};
  for(const e of items) (byG[muscleOf(e)] = byG[muscleOf(e)]||[]).push(e);
  pickOv.querySelector('.picklist').innerHTML = items.length
    ? GROUP_ORDER.filter(g=>byG[g]).map(g=>
        `<div class="pickgrp">${g}</div>` + byG[g].map(e=>`<button class="pickitem" data-ex="${esc(e)}">${esc(e)}</button>`).join('')
      ).join('')
    : '<div class="emptybox"><div class="eb-t">Keine Uebung gefunden</div><div class="eb-s">Andere Schreibweise probieren oder unten eine neue Uebung anlegen.</div></div>';
  pickOv.querySelectorAll('.pickitem').forEach(b=>b.onclick=()=>closePick(b.dataset.ex));
}
pickOv.querySelector('.picksearch').oninput = ()=>renderPickList();
pickOv.querySelector('.pickclose').onclick = ()=>closePick(null);
pickOv.querySelector('.picknew').onclick = async ()=>{
  const n = prompt('Name der neuen Übung');
  if(!n || !n.trim()) return;
  const name = n.trim();
  const g = await chooseGroup(name, muscleGuess(name));
  ensureEx(name);
  if(g) db.exGroups[name] = g;
  await Store.save(db);
  closePick(name);
};
pickOv.addEventListener('click', e=>{ if(e.target===pickOv) closePick(null); });

const grpOv = document.createElement('div');
grpOv.className = 'pickov';
grpOv.style.display = 'none';
grpOv.innerHTML = `
  <div class="picksheet" style="max-height:none">
    <div class="pickgrp grptitle" style="padding-top:0"></div>
    <div class="pickchips grpchips" style="margin-bottom:4px"></div>
    <button class="link grpcancel" style="width:100%;margin-top:10px;text-align:center">Abbrechen</button>
  </div>`;
root.appendChild(grpOv);
let grpRes = null;
function chooseGroup(exName, preselect){
  return new Promise(res=>{
    grpRes = res;
    grpOv.querySelector('.grptitle').textContent = `Muskelgruppe für „${exName}"`;
    grpOv.querySelector('.grpchips').innerHTML = GROUP_ORDER.map(g=>
      `<button class="chip${g===preselect?' on':''}" data-g="${g}">${g}</button>`).join('');
    grpOv.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{
      grpOv.style.display='none'; const r=grpRes; grpRes=null; if(r) r(b.dataset.g);
    });
    grpOv.style.display = 'flex';
  });
}
grpOv.querySelector('.grpcancel').onclick = ()=>{ grpOv.style.display='none'; const r=grpRes; grpRes=null; if(r) r(null); };
grpOv.addEventListener('click', e=>{ if(e.target===grpOv){ grpOv.style.display='none'; const r=grpRes; grpRes=null; if(r) r(null); } });
function pickExercise(){
  return new Promise(res=>{
    pickRes = res;
    pickOv.dataset.grp = 'Alle';
    pickOv.querySelector('.picksearch').value = '';
    renderPickChips(); renderPickList();
    pickOv.style.display = 'flex';
  });
}

/* ---------------- Training: Übungsblöcke ---------------- */
function exOptions(sel){
  return db.exercises.map(e=>`<option ${e===sel?'selected':''}>${esc(e)}</option>`).join('')
       + `<option value="__new__">＋ Neue Übung…</option>`;
}
function addBlock(exName, prefill=true, data=null){
  const b = document.createElement('div');
  b.className='block';
  b.dataset.planned = exName||'';
  // Der Block ist standardmaessig zugeklappt: geloggt wird im aktiven Training,
  // hier geht es um Vorbereitung und Korrektur. Der Kopf zeigt trotzdem, was
  // drinsteht, damit man nicht aufklappen muss, um sich zu orientieren.
  b.innerHTML = `
    <div class="block-head">
      <button class="ghost expick"></button>
      <select class="exsel" style="display:none">${exOptions(exName||db.exercises[0])}</select>
      <button class="blocktog" aria-expanded="false" aria-label="Übung aufklappen">▾</button>
      <button class="rm" aria-label="Übung entfernen">✕</button>
    </div>
    <button class="blocksum" aria-label="Übung aufklappen"></button>
    <div class="blockbody">
      <div class="swap-tag" style="display:none">Getauscht — nur diese Einheit</div>
      <div class="ref"></div>
      <button class="link repeatlast" style="display:none">↻ Letzte Einheit komplett übernehmen</button>
      <input class="pnote" placeholder="📌 Fester Hinweis zu dieser Übung (z. B. Kabelhöhe 4)">
      <div class="sets"></div>
      <button class="ghost tiny addset" style="width:100%;margin:2px 0 8px">＋ Satz</button>
      <input class="note" placeholder="Notiz für nächstes Mal (optional)">
    </div>
  `;
  const sel = b.querySelector('.exsel');
  const setsEl = b.querySelector('.sets');
  const pk = b.querySelector('.expick');
  pk.textContent = sel.value;
  pk.onclick = async ()=>{
    const n = await pickExercise();
    if(!n) return;
    ensureEx(n);
    sel.innerHTML = exOptions(n);
    pk.textContent = n;
    fill();
  };

  function addSetRow(w='',r='',rir='',warm=false){
    const d = document.createElement('div');
    d.className='setrow';
    if(warm) d.dataset.warm='1';
    d.innerHTML = `<div class="setno"></div>
      <input type="number" step="0.5" inputmode="decimal" placeholder="kg" value="${w}">
      <input type="number" step="1" inputmode="numeric" placeholder="Wdh." value="${r}">
      <input type="number" step="1" inputmode="numeric" class="rir" placeholder="RIR" min="0" max="${RIR_MAX}" value="${rir}">
      <button class="warmtog" title="Aufwärmsatz — zählt nicht ins Volumen" aria-label="Aufwärmsatz">W</button>
      <button class="del" aria-label="Satz entfernen">✕</button>`;
    const wt=d.querySelector('.warmtog');
    const syncWarm=()=>{ wt.setAttribute('aria-pressed', d.dataset.warm==='1'?'true':'false'); };
    wt.onclick=()=>{ if(d.dataset.warm==='1') delete d.dataset.warm; else d.dataset.warm='1'; syncWarm(); markUnsaved(); };
    syncWarm();
    d.querySelector('.del').onclick = ()=>{ d.remove(); renum(); markUnsaved(); };
    const _ins=d.querySelectorAll('input');
    _ins.forEach(inp=>inp.addEventListener('input', markUnsaved));
    _ins.forEach(inp=>inp.addEventListener('change',()=>{ markUnsaved(); if(num(_ins[0].value)!=null && num(_ins[1].value)!=null && num(_ins[1].value)>0) markSet(); }));
    setsEl.appendChild(d); renum();
  }
  function renum(){ [...setsEl.querySelectorAll('.setno')].forEach((n,i)=>n.textContent=i+1); }
  function fill(){
    const ex = sel.value;
    const _pn=b.querySelector('.pnote'); if(_pn) _pn.value=db.exNotes[ex]||'';
    const l = lastSession(ex);
    setsEl.innerHTML='';
    if(l && prefill){
      for(const s of l.sets) addSetRow(s.w, '', '', !!s.warm);
      const st = sessionStats(l);
      b.querySelector('.ref').innerHTML = `Letztes Mal (${fmtDate(l.date)}): ${l.sets.map(x=>`${x.w}×${x.r}`).join(' · ')} — Vol ${round(st.vol,0)} kg · e1RM ${round(st.best,1)}${l.note?`<br>„${esc(l.note)}"`:''}`;
    } else {
      addSetRow(); addSetRow();
      b.querySelector('.ref').textContent = l ? '' : 'Erste Einheit für diese Übung.';
      if(l){
        const st = sessionStats(l);
        b.querySelector('.ref').innerHTML = `Letztes Mal (${fmtDate(l.date)}): ${l.sets.map(x=>`${x.w}×${x.r}`).join(' · ')} — Vol ${round(st.vol,0)} kg · e1RM ${round(st.best,1)}`;
      }
    }
    // Bisher wurden nur die Gewichte vorbelegt, die Wiederholungen blieben leer.
    // Der Knopf uebernimmt beides — der haeufigste Handgriff beim Loggen.
    // Vorschlag direkt unter der Referenz — dieselbe Regel wie im aktiven Modus
    const _ph = (typeof progressHint==='function') ? progressHint(ex) : null;
    if(_ph && l){
      const rf = b.querySelector('.ref');
      if(rf) rf.insertAdjacentHTML('beforeend', '<div class="refsug">'+esc(_ph.text)+'</div>');
    }
    updateBlockSummaries();
    const rep = b.querySelector('.repeatlast');
    if(rep){
      rep.style.display = l ? 'block' : 'none';
      rep.onclick = ()=>{
        const cur = lastSession(sel.value);
        if(!cur) return;
        setsEl.innerHTML='';
        for(const st of cur.sets) addSetRow(st.w, st.r, st.rir!=null?st.rir:'', !!st.warm);
        toast('Letzte Einheit übernommen');
      };
    }
    const planned = b.dataset.planned;
    const swapped = planned && planned!==ex;
    b.classList.toggle('swapped', !!swapped);
    b.querySelector('.swap-tag').style.display = swapped ? 'block' : 'none';
  }
  sel.onchange = ()=>{
    if(sel.value==='__new__'){
      const n = prompt('Name der neuen Übung');
      if(n && n.trim()){ ensureEx(n.trim()); sel.innerHTML = exOptions(n.trim()); Store.save(db); }
      else { sel.innerHTML = exOptions(b.dataset.planned||db.exercises[0]); }
    }
    fill();
  };
  {
    const tog = ()=>{
      const auf = b.dataset.open === '1';
      if(auf) delete b.dataset.open; else b.dataset.open = '1';
      const t = b.querySelector('.blocktog');
      t.textContent = auf ? '▾' : '▴';
      t.setAttribute('aria-expanded', String(!auf));
      t.setAttribute('aria-label', auf ? 'Übung aufklappen' : 'Übung zuklappen');
    };
    b.querySelector('.blocktog').onclick = tog;
    b.querySelector('.blocksum').onclick = tog;
  }
  b.querySelector('.rm').onclick = ()=>{ b.remove(); markUnsaved(); };
  const _pnoteEl=b.querySelector('.pnote');
  _pnoteEl.addEventListener('change', async()=>{ const ex=sel.value; const v=_pnoteEl.value.trim(); if(v) db.exNotes[ex]=v; else delete db.exNotes[ex]; await Store.save(db); toast('Hinweis gespeichert'); });
  b.querySelector('.addset').onclick = ()=>{
    const rows = setsEl.querySelectorAll('.setrow');
    const last = rows[rows.length-1];
    addSetRow(last?last.querySelectorAll('input')[0].value:'', '', '', false);
  };
  fill();
  if(data){
    setsEl.innerHTML='';
    for(const s of (data.sets&&data.sets.length?data.sets:[{w:'',r:''}])) addSetRow(s.w??'', s.r??'', s.rir!=null?s.rir:'', !!s.warm);
    if(data.note) b.querySelector('.note').value = data.note;
  }
  $('#blocks').appendChild(b);
  markUnsaved();
}

function fillDaySel(keep){
  const sel = $('#daySel');
  const cur = keep ?? sel.value;
  let html = `<option value="">Freies Training</option>`;
  for(const s of db.splits){
    if(!s.days.length) continue;
    html += `<optgroup label="${esc(s.name)}">` + s.days.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('') + `</optgroup>`;
  }
  sel.innerHTML = html;
  if(cur && findDay(cur)) sel.value = cur;
}
function loadDay(){
  const id = $('#daySel').value;
  $('#blocks').innerHTML='';
  markUnsaved();
  if(!id){
    $('#dayHint').textContent = 'Ohne Vorlage — Übungen unten einzeln hinzufügen.';
    return;
  }
  const f = findDay(id);
  if(!f) return;
  $('#dayHint').textContent = f.day.ex.length
    ? `${f.split.name} · ${f.day.ex.length} Übungen vorausgefüllt. Tauschen oder entfernen gilt nur für heute.`
    : 'Dieser Tag hat noch keine Übungen — im Plan-Tab hinterlegen.';
  for(const ex of f.day.ex) addBlock(ex);
  updateUnitPill();
  if(typeof renderTrainProgress==='function') renderTrainProgress();
}

function updateUnitPill(){
  const pill=$('#unitPill'); if(!pill) return;
  const sel=$('#daySel'); const o=sel&&sel.selectedIndex>=0?sel.options[sel.selectedIndex]:null;
  const name=(o&&o.text)||'Freies Training';
  const d=($('#wdate')&&$('#wdate').value)||TODAY;
  pill.textContent=name+' · '+fmtDate(d).slice(0,6);
}
{ const up=$('#unitPill'); if(up) up.onclick=()=>{ const box=$('#unitSetup'); if(!box) return; box.style.display = box.style.display==='none' ? 'block' : 'none'; }; }
{ const wd=$('#wdate'); if(wd) wd.addEventListener('change', updateUnitPill); }
let _daySelPrev = $('#daySel').value;
$('#daySel').addEventListener('focus', e=>{ _daySelPrev = e.target.value; });
$('#daySel').addEventListener('change', e=>{
  if(!confirmDiscard('Ein anderer Trainingstag lädt neue Übungen und ersetzt sie.')){
    e.target.value = _daySelPrev;
    return;
  }
  _daySelPrev = e.target.value;
  loadDay(); updateUnitPill(); markUnsaved();
});
$('#addBlock').onclick = async ()=>{
  const n = await pickExercise();
  if(!n) return;
  addBlock(n,false);
  const blk = $('#blocks').lastElementChild;
  if(blk) blk.dataset.planned='';
};

let editingSession = null;
let editingDayName = null;
// Wird gesetzt, sobald das Overlay des aktiven Trainings existiert. Alles, was
// weiter oben im Code laeuft, aber auf trainOv zugreift, muss darauf warten —
// sonst gibt es beim Start einen ReferenceError, weil const erst spaeter
// initialisiert wird (Temporal Dead Zone).
let atReady = false;
let trainState = (()=>{ try{ return JSON.parse(localStorage.getItem('logbuch.train'))||{startAt:null,lastSetAt:null}; }catch(e){ return {startAt:null,lastSetAt:null}; } })();
function saveTrainState(){ try{ localStorage.setItem('logbuch.train', JSON.stringify(trainState)); }catch(e){} }
function fmtDur(ms){ const s=Math.max(0,Math.floor(ms/1000)), m=Math.floor(s/60), h=Math.floor(m/60); return h>0 ? h+':'+String(m%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0') : String(m).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
function markSet(){ const now=Date.now(); if(!trainState.startAt) trainState.startAt=now; trainState.lastSetAt=now; saveTrainState(); updateTimer(); }
function endSession(){ trainState={startAt:null,lastSetAt:null}; saveTrainState(); updateTimer(); }
// Der frueher schwebende Timer-Kasten ist weg: Pause zeigt der aktive Modus,
// die Einheitsdauer steht dort im Kopf. Die Funktion haelt nur noch die Dauer
// aktuell und beendet ueberlange Einheiten.
function updateTimer(){
  if(!trainState.startAt) return;
  const now = Date.now();
  if(now - trainState.startAt > 144e5){ endSession(); return; }
  if(!atReady) return;
  const el = trainOv.querySelector('.atdur');
  if(el) el.textContent = fmtDur(now - trainState.startAt);
}
{ $$('.js-start').forEach(b=>b.onclick=startTraining);
  const so=$('#startOv');
  if(so){
    so.querySelector('.startClose').onclick=()=>{ so.style.display='none'; };
    so.addEventListener('click', e=>{ if(e.target===so) so.style.display='none'; });
  }
  const rb=$('#resumeBar');
  if(rb) rb.querySelector('.rb-go').onclick=()=>{ openAT(); renderResumeBar(); };
  setInterval(renderResumeBar, 1000);
  const rs=$('#restSec');
  if(rs){
    rs.value = (db.goals&&db.goals.restSec)||120;
    rs.addEventListener('change', async()=>{
      const v=num(rs.value);
      if(v!=null && v>=20 && v<=600){ db.goals.restSec=Math.round(v); await Store.save(db); toast('Pause: '+Math.round(v)+' s'); }
      else { rs.value=(db.goals&&db.goals.restSec)||120; }
    });
  }
}
/* Beim Tippen schiebt die Tastatur den Speichern-Knopf nach oben, teils genau
   unter den Daumen. Deshalb ist er blockiert, solange ein Satzfeld den Fokus
   hat — und noch kurz danach, weil der Finger beim Schliessen der Tastatur
   schon unterwegs sein kann. */
let lastFieldFocus = 0;
function inSetField(el){
  return !!(el && el.tagName === 'INPUT' && (el.closest('#blocks') || el.closest('.atnow') || el.closest('.picksheet')));
}
function saveBlocked(){
  const ae = root.activeElement;
  if(inSetField(ae)) return true;
  return (Date.now() - lastFieldFocus) < 700;
}
{
  const mark = e => { if(inSetField(e.target)){ lastFieldFocus = Date.now(); root.host.setAttribute('typing','1'); } };
  const unmark = e => {
    if(!inSetField(e.target)) return;
    lastFieldFocus = Date.now();
    setTimeout(()=>{ if(!inSetField(root.activeElement)) root.host.removeAttribute('typing'); }, 250);
  };
  root.addEventListener('focusin', mark, true);
  root.addEventListener('focusout', unmark, true);
}

// Eine begonnene Einheit steht nur im DOM, nicht in der Datenbank. Alles, was
// die Bloecke ersetzt, wuerde sie ersatzlos loeschen — deshalb vorher fragen.
function unsavedSets(){
  let n=0;
  for(const r of $$('#blocks .setrow')){
    const ins=r.querySelectorAll('input');
    if(num(ins[0].value)!=null && num(ins[1].value)!=null && num(ins[1].value)>0) n++;
  }
  return n;
}
// Kurzfassung je Block: was steht drin, ohne aufzuklappen.
function updateBlockSummaries(){
  for(const b of $$('#blocks .block')){
    const el = b.querySelector('.blocksum'); if(!el) continue;
    const rows = [...b.querySelectorAll('.setrow')];
    const fertig = rows.filter(r=>r.dataset.done==='1').length;
    const gefuellt = rows.filter(r=>{ const i=r.querySelectorAll('input'); return num(i[0].value)!=null && num(i[1].value)!=null && num(i[1].value)>0; });
    const txt = gefuellt.map(r=>{
      const i=r.querySelectorAll('input');
      return (r.dataset.warm==='1'?'W ':'') + i[0].value + '×' + i[1].value;
    }).join(' · ');
    el.innerHTML = gefuellt.length
      ? '<span class="bs-v">'+esc(txt)+'</span>'
        + '<span class="bs-n">'+fertig+'/'+rows.length+' Sätze</span>'
      : '<span class="bs-v bs-leer">Noch nichts eingetragen</span>'
        + '<span class="bs-n">'+rows.length+' Sätze geplant</span>';
    b.classList.toggle('block-fertig', rows.length>0 && fertig===rows.length);
  }
}
function markUnsaved(){
  updateBlockSummaries();
  if(typeof renderTrainProgress==='function') renderTrainProgress();
  const el=$('#unitDirty');
  if(el){ const n=unsavedSets(); el.textContent = n ? '· '+n+' ungespeichert' : ''; }
}
function confirmDiscard(grund){
  const n=unsavedSets();
  if(!n) return true;
  return confirm('Nicht gespeicherte Einheit\n\n'
    + n + (n===1?' Satz ist':' Sätze sind') + ' eingetragen, aber noch nicht gespeichert.\n'
    + grund + '\n\nTrotzdem fortfahren? Die Eingaben gehen dabei verloren.');
}
// Auch beim Schliessen der App warnen — das ist der zweite Weg, auf dem
// eine halbfertige Einheit verlorengeht.
window.addEventListener('beforeunload', e=>{
  if(unsavedSets()){ e.preventDefault(); e.returnValue=''; return ''; }
});
$('#saveW').onclick = async ()=>{
  if(saveBlocked()){ toast('Erst die Eingabe abschließen'); return; }
  const date = $('#wdate').value||TODAY;
  const dayId = $('#daySel').value;
  const f = dayId ? findDay(dayId) : null;
  const sid = uid();
  const entries = [];
  for(const b of $$('#blocks .block')){
    const ex = b.querySelector('.exsel').value;
    if(ex==='__new__') continue;
    const sets = [...b.querySelectorAll('.setrow')].map(r=>{
      const ins = r.querySelectorAll('input');
      const o = {w:num(ins[0].value), r:num(ins[1].value)};
      const ri = num(ins[2] ? ins[2].value : '');
      if(ri!=null && ri>=0 && ri<=RIR_MAX) o.rir = Math.round(ri);
      if(r.dataset.warm==='1') o.warm = true;
      return o;
    }).filter(s=>s.w!=null && s.r!=null && s.r>0);
    if(!sets.length) continue;
    const note = b.querySelector('.note').value.trim()||null;
    entries.push({id:uid(), sessionId:sid, date, exercise:ex, sets, note,
                  day: f ? f.day.name : (editingSession ? editingDayName : null),
                  swapped: b.dataset.planned && b.dataset.planned!==ex ? b.dataset.planned : null});
  }
  if(!entries.length) return toast('Keine vollständigen Sätze eingetragen');
  if(editingSession){
    db.workouts = db.workouts.filter(w=>(w.sessionId||w.id)!==editingSession);
  }
  const prs = [];
  for(const e of entries){
    const prior = db.workouts.filter(x=>x.exercise===e.exercise && !(x.sessionId===sid));
    const bestBefore = prior.reduce((a,x)=>Math.max(a,sessionStats(x).best),0);
    const s = sessionStats(e);
    if(prior.length && s.best>bestBefore) prs.push(e.exercise);
    db.workouts.push(e);
  }
  await Store.save(db);
  const wasEdit = !!editingSession;
  editingSession = null; editingDayName = null;
  $('#saveW').textContent = 'Einheit speichern';
  $('#daySel').value = '';
  _daySelPrev = '';
  $('#wdate').value = TODAY;
  $('#blocks').innerHTML='';
  endSession();
  loadDay();
  renderAll();
  renderTrainProgress();
  const vol = entries.reduce((a,e)=>a+sessionStats(e).vol,0);
  toast(wasEdit ? `Einheit aktualisiert — ${fmtDate(date)}` : prs.length ? `PR: ${prs.join(', ')}! — ${round(vol,0)} kg gesamt` : `Gespeichert — ${entries.length} Übungen · ${round(vol,0)} kg`);
};

function editSession(key){
  const entries = db.workouts.filter(w=>(w.sessionId||w.id)===key);
  if(!entries.length) return;
  if(!confirmDiscard('Die Bearbeitung einer alten Einheit ersetzt die aktuelle Eingabe.')) return;
  editingSession = key;
  editingDayName = entries[0].day||null;
  fillDaySel();
  $('#daySel').value = '';
  $('#wdate').value = entries[0].date;
  $('#blocks').innerHTML='';
  markUnsaved();
  for(const e of entries) addBlock(e.exercise, false, {sets:e.sets, note:e.note});
  $$('#blocks .block').forEach(b=>{ b.dataset.open='1'; const t=b.querySelector('.blocktog'); if(t){ t.textContent='▴'; t.setAttribute('aria-expanded','true'); } });
  $('#dayHint').textContent = `Bearbeitung: ${entries[0].day||'Freies Training'} vom ${fmtDate(entries[0].date)} — Speichern überschreibt die Einheit.`;
  $('#saveW').textContent = 'Änderungen speichern';
  const navBtn = $$('nav button').find(b=>b.dataset.v==='log');
  if(navBtn) navBtn.click();
  window.scrollTo(0,0);
}

async function moveSession(key){
  const entries = db.workouts.filter(w=>(w.sessionId||w.id)===key);
  if(!entries.length) return;
  const cur = entries[0].date;
  const inp = prompt('Neues Datum (TT.MM.JJJJ)', cur.split('-').reverse().join('.'));
  if(inp==null) return;
  const nd = parseDate(inp);
  if(!nd) return toast('Datum nicht erkannt — Format TT.MM.JJJJ');
  for(const e of entries) e.date = nd;
  await Store.save(db);
  calSel = nd;
  const d = new Date(nd+'T12:00:00');
  calYM = {y:d.getFullYear(), m:d.getMonth()};
  renderAll();
  toast('Verschoben auf '+fmtDate(nd));
}

async function renameSession(key){
  const entries = db.workouts.filter(w=>(w.sessionId||w.id)===key);
  if(!entries.length) return;
  const n = await askText('Einheit umbenennen', entries[0].day||'', 'leer = Freies Training');
  if(n===null) return;
  const name = n.trim() || null;
  for(const e of entries) e.day = name;
  await Store.save(db); renderAll(); toast('Umbenannt');
}
async function assignDay(key){
  const days=[...new Set(allDays().map(x=>x.day.name))];
  if(!days.length) return toast('Keine Trainingstage im Plan angelegt');
  const inp=prompt('Freies Training übernehmen als Trainingstag:\n'+days.map((n,i)=>(i+1)+'. '+n).join('\n')+'\n\nNummer eingeben (leer = Freies Training):');
  if(inp===null) return;
  const t=inp.trim(); let name=null;
  if(t){ const idx=parseInt(t,10)-1; if(!(idx>=0&&idx<days.length)) return toast('Ungültige Nummer'); name=days[idx]; }
  const entries=db.workouts.filter(w=>(w.sessionId||w.id)===key);
  for(const w of entries) w.day=name;
  await Store.save(db); renderAll(); toast(name?('Übernommen: '+name):'Als Freies Training gesetzt');
}
let wlistLimit=5;
function renderWList(){
  const groups = {};
  for(const w of db.workouts){
    const k = w.sessionId || w.id;
    (groups[k] = groups[k]||[]).push(w);
  }
  const gs = Object.values(groups).sort((a,b)=>a[0].date<b[0].date?1:-1).slice(0,wlistLimit);
  $('#wlist').innerHTML = gs.length ? gs.map(g=>{
    const d = g[0].date;
    const byGroup = {};
    for(const w of g){ const grp = muscleOf(w.exercise); byGroup[grp] = (byGroup[grp]||0) + w.sets.length; }
    const grpStr = Object.entries(byGroup).map(([k,v])=>`${k} ${v}`).join(' · ');
    const lines = g.map(w=>{
      const s = sessionStats(w);
      const prior = db.workouts.filter(x=>x.exercise===w.exercise && x.date<w.date);
      const bestBefore = prior.reduce((a,x)=>Math.max(a,sessionStats(x).best),0);
      const isPR = prior.length && s.best>bestBefore;
      const prevW = prior.sort((a,b)=>a.date<b.date?1:-1)[0];
      let arrow = '';
      if(prevW){
        const pb = sessionStats(prevW).best;
        if(s.best > pb + 1e-9) arrow = ' <span class="up" style="font-weight:700">↑</span>';
        else if(s.best < pb - 1e-9) arrow = ' <span class="down" style="font-weight:700">↓</span>';
      }
      return `${esc(w.exercise)}${w.swapped?` <span style="color:var(--ochre)">(statt ${esc(w.swapped)})</span>`:''}: ${w.sets.map(x=>`${x.w}×${x.r}`).join(' ')}${arrow}${isPR?' <span class="pr">PR</span>':''}${w.note?` — „${esc(w.note)}"`:''}`;
    }).join('<br>');
    return `<li>
      <div class="li-main">
        <div class="li-t">${g[0].day ? esc(g[0].day) : 'Freies Training'}</div>
        <div class="li-s" style="color:var(--ink-60)">${grpStr} ${Object.values(byGroup).reduce((a,b)=>a+b,0)===1?'Satz':'Sätze'}</div>
        <div class="li-s">${lines}</div>
      </div>
      <div class="li-d">${fmtDate(d)}<br><button class="link" data-edit="${g[0].sessionId||g[0].id}">bearbeiten</button><br><button class="link" data-rename="${g[0].sessionId||g[0].id}">umbenennen</button><br><button class="link" data-assign="${g[0].sessionId||g[0].id}">Trainingstag</button><br><button class="link warn" data-del="${g[0].sessionId||g[0].id}">löschen</button></div>
    </li>`;
  }).join('') : '<div class="emptybox"><div class="eb-t">Noch keine Einheit</div><div class="eb-s">Tippe oben auf Training starten.</div></div>';
  $$('#wlist [data-edit]').forEach(b=>b.onclick=()=>editSession(b.dataset.edit));
  $$('#wlist [data-rename]').forEach(b=>b.onclick=()=>renameSession(b.dataset.rename));
  $$('#wlist [data-assign]').forEach(b=>b.onclick=()=>assignDay(b.dataset.assign));
  $$('#wlist [data-del]').forEach(b=>b.onclick=async()=>{
    if(!confirm('Diese Einheit löschen?')) return;
    db.workouts = db.workouts.filter(w=>(w.sessionId||w.id)!==b.dataset.del);
    await Store.save(db); renderAll(); toast('Gelöscht');
  });
  const _wm=$('#wlistMore'); const _wtot=Object.keys(groups).length;
  if(_wm){ if(_wtot>5){ _wm.style.display=''; _wm.textContent = wlistLimit>=10 ? 'Weniger anzeigen' : 'Mehr anzeigen'; } else _wm.style.display='none'; }
}

/* ---------------- Plan ---------------- */
let openDay = null;
function renderPlan(){
  const host = $('#splits');
  host.innerHTML = db.splits.length ? '' : '<div class="emptybox"><div class="eb-t">Kein Split angelegt</div><div class="eb-s">Mit einem Split wird der Trainingstag beim Loggen vorausgefuellt.</div></div>';
  for(const s of db.splits){
    const el = document.createElement('div');
    el.className='split';
    el.innerHTML = `
      <div class="split-head">
        <div class="t">${esc(s.name)}</div>
        <div class="splitmeta">${s.days.length} Tag${s.days.length===1?'':'e'}</div>
      </div>
      <div class="daysHost"></div>
      <div style="padding:10px 12px;border-top:1px solid var(--grid);display:flex;gap:10px;align-items:center">
        <button class="ghost tiny" data-a="addD" style="flex:1">＋ Trainingstag</button>
        <button class="link" data-a="renS">umbenennen</button>
        <button class="link warn" data-a="delS">löschen</button>
      </div>`;
    el.querySelector('[data-a=renS]').onclick = async()=>{
      const n = prompt('Neuer Name für den Split', s.name);
      if(n && n.trim()){ s.name=n.trim(); await Store.save(db); renderAll(); }
    };
    el.querySelector('[data-a=delS]').onclick = async()=>{
      if(!confirm(`Split „${s.name}" samt Trainingstagen löschen? Geloggte Einheiten bleiben erhalten.`)) return;
      db.splits = db.splits.filter(x=>x!==s);
      await Store.save(db); renderAll();
    };
    el.querySelector('[data-a=addD]').onclick = async()=>{
      const n = prompt('Name des Trainingstags (z. B. Push A)');
      if(!n || !n.trim()) return;
      const d = {id:uid(), name:n.trim(), ex:[]};
      s.days.push(d); openDay = d.id;
      await Store.save(db); renderAll();
    };
    const dh = el.querySelector('.daysHost');
    for(const d of s.days){
      if(!d.ex) d.ex = d.exercises || [];
      const de = document.createElement('div');
      de.className='day';
      const isOpen = openDay===d.id;
      de.innerHTML = `
        <div class="day-head">
          <div class="dayline"><span class="daybadge">${esc(d.name)}</span><span class="daycount">${d.ex.length} Übung${d.ex.length===1?'':'en'}</span></div>
          <button class="link" data-a="tog">${isOpen?'schließen':'bearbeiten'}</button>
        </div>
        <div class="day-ex">${d.ex.length ? d.ex.map(esc).join(' · ') : '— keine Übungen —'}</div>
        <div class="day-edit" style="display:${isOpen?'block':'none'}">
          <div class="exHost"></div>
          <button class="ghost tiny" data-a="addEx" style="width:100%;margin-top:8px">＋ Übung hinzufügen</button>
          <div class="row" style="margin-top:10px">
            <button class="link" data-a="renD">Tag umbenennen</button>
            <button class="link warn" data-a="delD">Tag löschen</button>
          </div>
        </div>`;
      de.querySelector('[data-a=tog]').onclick = ()=>{ openDay = isOpen?null:d.id; renderPlan(); };
      const exHost = de.querySelector('.exHost');
      d.ex.forEach((ex,i)=>{
        const line = document.createElement('div');
        line.className='exline';
        line.innerHTML = `<div class="n">${esc(ex)}</div>
          <button class="link" data-a="up" ${i===0?'disabled style="opacity:.3"':''}>↑</button>
          <button class="link" data-a="dn" ${i===d.ex.length-1?'disabled style="opacity:.3"':''}>↓</button>
          <button class="link warn" data-a="rm">✕</button>`;
        line.querySelector('[data-a=rm]').onclick = async()=>{ d.ex.splice(i,1); await Store.save(db); renderAll(); };
        line.querySelector('[data-a=up]').onclick = async()=>{ if(i>0){ [d.ex[i-1],d.ex[i]]=[d.ex[i],d.ex[i-1]]; await Store.save(db); renderAll(); } };
        line.querySelector('[data-a=dn]').onclick = async()=>{ if(i<d.ex.length-1){ [d.ex[i+1],d.ex[i]]=[d.ex[i],d.ex[i+1]]; await Store.save(db); renderAll(); } };
        exHost.appendChild(line);
      });
      de.querySelector('[data-a=addEx]').onclick = async()=>{
        const name = await pickExercise();
        if(!name) return;
        ensureEx(name);
        if(!d.ex.includes(name)) d.ex.push(name);
        openDay = d.id;
        await Store.save(db); renderAll();
      };
      de.querySelector('[data-a=renD]').onclick = async()=>{
        const n = prompt('Neuer Name', d.name);
        if(n && n.trim()){ d.name=n.trim(); await Store.save(db); renderAll(); }
      };
      de.querySelector('[data-a=delD]').onclick = async()=>{
        if(!confirm(`Trainingstag „${d.name}" löschen?`)) return;
        s.days = s.days.filter(x=>x!==d);
        await Store.save(db); renderAll();
      };
      dh.appendChild(de);
    }
    host.appendChild(el);
  }
}
$('#addSplit').onclick = async()=>{
  const n = prompt('Name des Splits (z. B. Push Pull Legs)');
  if(!n || !n.trim()) return;
  db.splits.push({id:uid(), name:n.trim(), days:[]});
  await Store.save(db); renderAll();
};
$('#addExCat').onclick = async()=>{
  const n = prompt('Name der Übung');
  if(!n || !n.trim()) return;
  const name = n.trim();
  const g = await chooseGroup(name, muscleGuess(name));
  ensureEx(name);
  if(g) db.exGroups[name] = g;
  await Store.save(db); renderAll();
};

/* ---------------- Körper ---------------- */
function bodySorted(){ return [...db.body].sort((a,b)=>a.date<b.date?-1:1); }
function renderBody(){
  renderProfile();
  const b = bodySorted();
  const ws = b.filter(x=>x.weight!=null);
  const last = ws[ws.length-1];
  const m = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
  const cur = m(ws.slice(-7).map(x=>x.weight));
  const prev = m(ws.slice(-14,-7).map(x=>x.weight));
  const kc = b.slice(-7).map(x=>x.kcal).filter(v=>v!=null);

  const delta = (cur!=null && prev!=null) ? cur-prev : null;
  const spark = ws.slice(-14).map(x=>x.weight);
  $('#weightCard').innerHTML = last ? `
    <div class="lab">Gewicht</div>
    <div class="w-big">${cur!=null?round(cur,1).toFixed(1).replace('.',','):'—'}<span> kg</span></div>
    <div class="w-delta ${delta!=null?(delta<0?'down':delta>0?'up':''):''}">${delta!=null?(delta>=0?'+':'−')+round(Math.abs(delta),2).toFixed(2).replace('.',',')+' kg / Woche':'ø 7 Tage'}</div>
    <div class="w-sub">zuletzt ${last.weight!=null?round(last.weight,1).toFixed(1).replace('.',',')+' kg':'—'} · ${fmtDate(last.date)}</div>
    ${sparkSVG(spark)}`
  : `<div class="lab">Gewicht</div><div class="w-big">—<span> kg</span></div>
     <div class="w-sub">Trag dein erstes Gewicht ein</div>`;
}
// Mini-Verlauf für die Gewichtskarte
function sparkSVG(vals){
  if(!vals || vals.length<2) return '';
  const w=120, h=30, pad=3;
  const min=Math.min(...vals), max=Math.max(...vals), span=(max-min)||1;
  const pts=vals.map((v,i)=>{
    const x=pad+i*(w-2*pad)/(vals.length-1);
    const y=pad+(1-(v-min)/span)*(h-2*pad);
    return x.toFixed(1)+','+y.toFixed(1);
  }).join(' ');
  return '<svg width="100%" height="30" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" class="w-spark" aria-hidden="true">'
    +'<polyline points="'+pts+'" fill="none" stroke="var(--teal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
$('#saveB').onclick = async ()=>{
  const d = $('#bdate').value||TODAY;
  const patch = {weight:num($('#bw').value), steps:num($('#steps').value)};
  if(Object.values(patch).every(v=>v==null)) return toast('Nichts eingetragen');
  let e = db.body.find(x=>x.date===d);
  if(!e){ e={date:d}; db.body.push(e); }
  for(const k in patch) if(patch[k]!=null) e[k]=patch[k];
  await Store.save(db);
  ['#bw','#steps'].forEach(s=>$(s).value='');
  renderAll(); toast('Gespeichert — '+fmtDate(d));
};

let curMeal = null;
function renderMealChips(){
  const types = db.mealTypes||[];
  if(!curMeal || !types.includes(curMeal)) curMeal = types[0]||'Mahlzeit';
  $('#mealChips').innerHTML = types.map(t=>`<button class="chip${t===curMeal?' on':''}" data-m="${esc(t)}">${esc(t)}</button>`).join('')
    + `<button class="chip" data-m="__new__" title="Weitere Mahlzeit anlegen">＋</button>`;
  $$('#mealChips .chip').forEach(b=>b.onclick=async()=>{
    if(b.dataset.m==='__new__'){
      const n = prompt('Name der neuen Mahlzeit (z. B. Pre-Workout)');
      if(!n || !n.trim()) return;
      const name = n.trim();
      if(!db.mealTypes.includes(name)) db.mealTypes.push(name);
      curMeal = name;
      await Store.save(db);
    } else {
      curMeal = b.dataset.m;
    }
    renderMealChips();
  });
}
function renderMeals(){
  const d = $('#bdate').value||TODAY;
  const e = db.body.find(x=>x.date===d);
  const meals = (e&&e.meals)||[];
  const sum = meals.reduce((a,m)=>({k:a.k+(m.kcal||0), p:a.p+(m.protein||0), f:a.f+(m.fat||0), c:a.c+(m.carbs||0)}), {k:0,p:0,f:0,c:0});
  const kt = (calorieTarget().kcal)||null;
  const macroStr=(f,c,p,pct)=>{
    const seg=[];
    seg.push('<span style="color:var(--mf)">'+(f!=null?Math.round(f):'–')+'</span> F');
    seg.push('<span style="color:var(--mc)">'+(c!=null?Math.round(c):'–')+'</span> KH');
    seg.push('<span style="color:var(--mp)">'+(p!=null?Math.round(p):'–')+'</span> Eiw');
    if(pct!=null) seg.push(pct+'%');
    return seg.join(' · ');
  };
  const order = db.mealTypes||[];
  const byType = {};
  for(const m of meals){ const t=m.name||'Mahlzeit'; (byType[t]=byType[t]||[]).push(m); }
  const typeOrder = [...order, ...Object.keys(byType).filter(t=>!order.includes(t))];
  const groups = typeOrder.map(t=>{
    const items=byType[t]||[];
    const gk=items.reduce((a,m)=>a+(m.kcal||0),0), gp=items.reduce((a,m)=>a+(m.protein||0),0);
    const gf=items.reduce((a,m)=>a+(m.fat||0),0), gc=items.reduce((a,m)=>a+(m.carbs||0),0);
    const getb=kt?Math.round(gk/kt*100):null;
    const collapsed=!openMeals.has(t);
    const rows=items.map(m=>{
      const nm=m.pname||m.text||'Eintrag';
      const amt=m.g?Math.round(m.g)+' g':'';
      const etb=kt?Math.round((m.kcal||0)/kt*100):null;
      return '<div class="mi"><div class="mi-main"><div class="mi-t">'+esc(nm)+'</div>'
        +(amt?'<div class="mi-amt">'+amt+'</div>':'')
        +'<div class="mi-macros">'+macroStr(m.fat,m.carbs,m.protein,etb)+(m.salt!=null?' · '+m.salt+' Salz':'')+(m.fiber!=null?' · '+m.fiber+' Ballast':'')+'</div></div>'
        +'<div class="mi-side"><div class="mi-k">'+Math.round(m.kcal||0)+'</div>'
        +(m.k100!=null?'<button class="link" data-medit="'+m.id+'">Menge</button>':'')
        +'<button class="link warn" data-mdel="'+m.id+'">löschen</button></div></div>';
    }).join('');
    return '<div class="mealgrp">'
      +'<div class="mealgrp-head">'
        +'<button class="mealgrp-toggle" data-collapse="'+esc(t)+'"><span class="chev">'+(collapsed?'▸':'▾')+'</span>'+esc(t)+'</button>'
        +'<span class="mealgrp-right"><span class="mealgrp-k">'+Math.round(gk)+' kcal</span><button class="mealgrp-add" data-add="'+esc(t)+'" aria-label="hinzufügen">＋</button></span>'
      +'</div>'
      +(collapsed?'':('<div class="mealgrp-sub">'+macroStr(gf,gc,gp,getb)+'</div>'+(items.length?rows:'<div class="mi-empty">Noch nichts eingetragen</div>')))
      +'</div>';
  }).join('');
  const total = meals.length ? '<div class="mealgrp mealgrp-total"><div class="mealgrp-head"><span class="mealgrp-t" style="font-size:13px">Summe '+fmtDate(d)+'</span><span class="mealgrp-k">'+Math.round(sum.k)+' kcal</span></div><div class="mealgrp-sub">'+macroStr(sum.f,sum.c,sum.p, kt?Math.round(sum.k/kt*100):null)+'</div></div>' : '';
  const _mt=$('#mealTotal'); if(_mt) _mt.textContent = meals.length ? de(Math.round(sum.k))+' kcal' : '—';
  $('#mealList').innerHTML = groups + total;
  $$('#mealList [data-add]').forEach(b=>b.onclick=()=>{ curMeal=b.dataset.add; openFood(); });
  $$('#mealList [data-collapse]').forEach(b=>b.onclick=()=>{ const t=b.dataset.collapse; if(openMeals.has(t)) openMeals.delete(t); else openMeals.add(t); renderMeals(); });
  $$('#mealList [data-mdel]').forEach(b=>b.onclick=async()=>{
    const m = meals.find(x=>x.id===b.dataset.mdel);
    if(!m) return;
    e.kcal = Math.max(0, Math.round((e.kcal||0) - (m.kcal||0)));
    e.protein = Math.max(0, Math.round((e.protein||0) - (m.protein||0)));
    if(m.fat!=null) e.fat = Math.max(0, Math.round((e.fat||0) - m.fat));
    if(m.carbs!=null) e.carbs = Math.max(0, Math.round((e.carbs||0) - m.carbs));
    e.meals = e.meals.filter(x=>x.id!==m.id);
    await Store.save(db); renderAll(); toast('Mahlzeit entfernt');
  });
  $$('#mealList [data-medit]').forEach(b=>b.onclick=async()=>{
    const m = meals.find(x=>x.id===b.dataset.medit);
    if(!m) return;
    const inp = prompt('Neue Menge (g / ml)', m.g||'');
    if(inp===null) return;
    const g = num(inp); if(g==null || g<0) return;
    const nk = Math.round((m.k100||0)*g/100), np = Math.round((m.p100||0)*g/100);
    const nf = m.f100!=null?Math.round((m.f100||0)*g/100):null, nc = m.c100!=null?Math.round((m.c100||0)*g/100):null;
    const nsa = m.s100!=null?Math.round((m.s100||0)*g/100*10)/10:null, nfi = m.fib100!=null?Math.round((m.fib100||0)*g/100*10)/10:null;
    e.kcal = Math.max(0, Math.round((e.kcal||0) - (m.kcal||0) + nk));
    e.protein = Math.max(0, Math.round((e.protein||0) - (m.protein||0) + np));
    if(m.fat!=null && nf!=null) e.fat = Math.max(0, Math.round((e.fat||0) - m.fat + nf));
    if(m.carbs!=null && nc!=null) e.carbs = Math.max(0, Math.round((e.carbs||0) - m.carbs + nc));
    m.kcal = nk; m.protein = np; if(nf!=null) m.fat = nf; if(nc!=null) m.carbs = nc; if(nsa!=null) m.salt = nsa; if(nfi!=null) m.fiber = nfi; m.g = g;
    if(m.pname) m.text = `${m.pname} — ${g} g`;
    else if(m.text) m.text = m.text.replace(/—\s*[\d.,]+\s*g/, '— '+g+' g');
    await Store.save(db); renderAll(); toast('Menge geändert');
  });
}
$('#bdate').addEventListener('change', ()=>{ renderMeals(); renderNutri(); renderWater(); renderMeas(); renderDayNote(); });


/* ---------------- Suche: Normalisierung, Fuzzy-Scoring, lokale Quellen ---------------- */
// Ziel: Tippfehler- und umlauttolerante Suche, eigene Historie zuerst, Rohware findbar
// ohne exakten Markennamen. Alles hier ist synchron/offline — kein API-Call nötig.
const _FOLD = {'ä':'ae','ö':'oe','ü':'ue','ß':'ss','â':'a','à':'a','á':'a','ã':'a','å':'a','æ':'ae','ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ø':'o','ù':'u','ú':'u','û':'u','ý':'y'};
function fold(s){
  const t = String(s==null?'':s).toLowerCase();
  let out = '';
  for(const ch of t) out += (_FOLD[ch]!==undefined ? _FOLD[ch] : ch);
  return out.replace(/[^a-z0-9]+/g,' ').trim();
}
function toks(s){ const f=fold(s); return f?f.split(' '):[]; }

// Levenshtein mit früher Abbruchgrenze — nur für kurze Wörter, daher billig.
function lev(a,b,max){
  if(a===b) return 0;
  const la=a.length, lb=b.length;
  if(Math.abs(la-lb)>max) return max+1;
  let prev=new Array(lb+1), cur=new Array(lb+1);
  for(let j=0;j<=lb;j++) prev[j]=j;
  for(let i=1;i<=la;i++){
    cur[0]=i; let best=cur[0];
    for(let j=1;j<=lb;j++){
      const c = a.charCodeAt(i-1)===b.charCodeAt(j-1) ? 0 : 1;
      cur[j]=Math.min(prev[j]+1, cur[j-1]+1, prev[j-1]+c);
      if(cur[j]<best) best=cur[j];
    }
    if(best>max) return max+1;
    const t=prev; prev=cur; cur=t;
  }
  return prev[lb];
}
// Wie gut passt ein Such-Token auf irgendeines der Namens-Token?
function tokScore(qt, nts){
  let best=0;
  for(const nt of nts){
    let s=0;
    if(nt===qt) s=100;
    else if(nt.startsWith(qt)) s=82-Math.min(22, nt.length-qt.length);
    else if(qt.length>=5 && qt.startsWith(nt)) s=60;              // "haehnchenbrust" vs. "haehnchen"
    else if(qt.length>=4 && nt.indexOf(qt)>=0) s=48;              // Wortmitte
    else if(qt.length>=4){
      const max = qt.length>=7 ? 2 : 1;                            // Tippfehlertoleranz
      const d = lev(qt, nt, max);
      if(d<=max) s=58-12*d;
      else if(qt.length>=5 && nt.length>qt.length){
        // abgebrochenes Wort MIT Tippfehler: "susskart" → "suesskartoffel"
        const m2 = qt.length>=8 ? 2 : 1;
        let bd = m2+1;
        for(let k=-1;k<=1;k++){
          const L=qt.length+k;
          if(L<3 || L>nt.length) continue;
          const d2=lev(qt, nt.slice(0,L), m2);
          if(d2<bd) bd=d2;
        }
        if(bd<=m2) s=52-10*bd;
      }
    }
    if(s>best) best=s;
  }
  return best;
}
// Gesamtscore eines Produktnamens gegen die Suchanfrage. 0 = passt nicht.
function scoreName(name, brand, extra, q){
  const qts=toks(q); if(!qts.length) return 0;
  const nts=toks(name); if(!nts.length) return 0;
  const bts=toks(brand);
  const xts=toks(extra);
  let sum=0;
  for(const qt of qts){
    const s=Math.max(tokScore(qt,nts), tokScore(qt,xts)*0.95, tokScore(qt,bts)*0.6);
    if(s<=0) return 0;                       // jedes Such-Token muss irgendwo matchen
    sum+=s;
  }
  let sc=sum/qts.length;
  const nf=nts.join(' '), qf=qts.join(' ');
  if(nf===qf) sc+=140;                       // exakter Treffer ganz nach oben
  else if(nf.startsWith(qf)) sc+=70;         // "Süßkartoffel …" vor "Bio-Pommes aus Süßkartoffel"
  sc-=Math.max(0, nts.length-qts.length)*7;  // je mehr Zusatzwörter, desto unspezifischer
  sc-=Math.min(25, nf.length/8);             // lange Namen = eher Fertigprodukt
  return Math.max(1, sc);
}

// ---- Grundnahrungsmittel: Rohware, die in Open Food Facts kaum sauber existiert ----
// [Name, kcal, Protein, Fett, KH, Salz, Ballaststoffe, Portion in g, Synonyme]
// Werte pro 100 g, roh/trocken sofern nicht anders angegeben.
const BASE_FOODS_RAW=[
["Süßkartoffel, roh",86,1.6,0.1,20,0.02,3,200,"sweet potato batate"],
["Kartoffel, roh",77,2,0.1,17,0.01,2.2,200,"potato erdapfel"],
["Karotte",41,0.9,0.2,9.6,0.17,2.8,80,"mohrrübe möhre carrot"],
["Brokkoli",34,2.8,0.4,7,0.08,2.6,200,"broccoli"],
["Blumenkohl",25,1.9,0.3,5,0.08,2,200,"karfiol cauliflower"],
["Zucchini",17,1.2,0.3,3.1,0.02,1,200,"courgette"],
["Paprika, rot",31,1,0.3,6,0.01,2.1,150,"peperoni bell pepper"],
["Tomate",18,0.9,0.2,3.9,0.01,1.2,120,"tomato"],
["Gurke",15,0.7,0.1,3.6,0.01,0.5,150,"cucumber salatgurke"],
["Zwiebel",40,1.1,0.1,9.3,0.01,1.7,80,"onion"],
["Knoblauch",149,6.4,0.5,33,0.04,2.1,5,"garlic"],
["Spinat",23,2.9,0.4,3.6,0.2,2.2,150,"spinach"],
["Champignons",22,3.1,0.3,3.3,0.01,1,150,"pilze mushrooms"],
["Aubergine",25,1,0.2,5.9,0.01,3,200,"eggplant melanzani"],
["Grüne Bohnen",31,1.8,0.1,7,0.02,2.7,150,"buschbohnen green beans"],
["Erbsen",81,5.4,0.4,14,0.01,5.1,150,"peas"],
["Mais",86,3.3,1.4,19,0.04,2,100,"corn"],
["Rosenkohl",43,3.4,0.3,9,0.06,3.8,200,"brussels sprouts"],
["Weißkohl",25,1.3,0.1,5.8,0.04,2.5,200,"weisskraut cabbage"],
["Rotkohl",31,1.4,0.2,7.4,0.07,2.1,200,"blaukraut red cabbage"],
["Kürbis (Hokkaido)",26,1,0.1,6.5,0.01,0.5,200,"pumpkin"],
["Rote Bete",43,1.6,0.2,10,0.19,2.8,150,"beete beetroot randen"],
["Sellerie",16,0.7,0.2,3,0.2,1.6,100,"celery"],
["Lauch",61,1.5,0.3,14,0.05,1.8,150,"porree leek"],
["Kopfsalat",14,1.4,0.2,1.1,0.02,1.3,80,"salat lettuce"],
["Feldsalat",14,1.8,0.4,0.7,0.03,1.5,50,"rapunzel"],
["Avocado",160,2,15,8.5,0.02,6.7,150,"avocado"],
["Spargel",20,2.2,0.1,3.9,0.01,2.1,250,"asparagus"],
["Banane",89,1.1,0.3,23,0.01,2.6,120,"banana"],
["Apfel",52,0.3,0.2,14,0.01,2.4,150,"apple"],
["Birne",57,0.4,0.1,15,0.01,3.1,150,"pear"],
["Orange",47,0.9,0.1,12,0.01,2.4,180,"apfelsine"],
["Mandarine",53,0.8,0.3,13,0.01,1.8,80,"clementine"],
["Erdbeeren",32,0.7,0.3,7.7,0.01,2,150,"strawberries"],
["Heidelbeeren",57,0.7,0.3,14,0.01,2.4,125,"blaubeeren blueberries"],
["Himbeeren",52,1.2,0.7,12,0.01,6.5,125,"raspberries"],
["Weintrauben",69,0.7,0.2,18,0.01,0.9,150,"trauben grapes"],
["Ananas",50,0.5,0.1,13,0.01,1.4,150,"pineapple"],
["Mango",60,0.8,0.4,15,0.01,1.6,150,"mango"],
["Wassermelone",30,0.6,0.2,7.6,0.01,0.4,250,"melone watermelon"],
["Kiwi",61,1.1,0.5,15,0.01,3,80,"kiwi"],
["Pfirsich",39,0.9,0.3,10,0.01,1.5,150,"peach nektarine"],
["Zitrone",29,1.1,0.3,9,0.01,2.8,60,"lemon"],
["Datteln, getrocknet",282,2.5,0.4,75,0.01,8,25,"dates medjool"],
["Rosinen",299,3.1,0.5,79,0.03,3.7,30,"raisins sultaninen"],
["Hähnchenbrustfilet, roh",106,23,1.2,0,0.15,0,150,"huhn hühnchen chicken poulet haehnchenbrust"],
["Hähnchenschenkel",172,18,11,0,0.2,0,150,"keule chicken thigh"],
["Putenbrustfilet",105,24,1,0,0.15,0,150,"pute truthahn turkey"],
["Rinderhackfleisch, mager (5%)",137,21,5,0,0.15,0,150,"hack hackfleisch rind beef mince"],
["Gemischtes Hackfleisch",232,18,18,0,0.2,0,150,"hack hackfleisch mett"],
["Schweineschnitzel",108,22,2,0,0.15,0,150,"schwein pork"],
["Rumpsteak",130,22,4.5,0,0.15,0,200,"steak rind beef"],
["Lachs, roh",208,20,13,0,0.1,0,150,"salmon"],
["Lachs, geräuchert",180,22,10,0,3.5,0,50,"raeucherlachs smoked salmon"],
["Thunfisch, Dose im eigenen Saft",116,26,1,0,0.9,0,120,"tuna"],
["Kabeljau",82,18,0.7,0,0.2,0,150,"dorsch cod"],
["Forelle",119,20,3.5,0,0.1,0,150,"trout"],
["Garnelen",99,24,0.3,0,0.4,0,150,"shrimps scampi prawns"],
["Ei (Hühnerei)",143,12.6,9.5,0.7,0.35,0,58,"eier egg huehnerei"],
["Eiklar",52,11,0.2,0.7,0.4,0,33,"eiweiss egg white"],
["Eigelb",322,16,27,3.6,0.1,0,17,"dotter egg yolk"],
["Magerquark",67,12,0.2,4,0.1,0,250,"quark curd"],
["Speisequark 20%",109,12,5.1,3.2,0.1,0,250,"quark"],
["Skyr",63,11,0.2,4,0.1,0,150,"skyr"],
["Naturjoghurt 3,5%",63,3.5,3.5,4.7,0.13,0,150,"joghurt yogurt"],
["Griechischer Joghurt 10%",133,5.5,10,3.5,0.1,0,150,"joghurt greek yogurt"],
["Milch 3,5%",64,3.4,3.5,4.8,0.13,0,200,"vollmilch milk"],
["Milch 1,5%",47,3.4,1.5,4.9,0.13,0,200,"milk fettarme"],
["Hüttenkäse",98,12,4.3,3,0.5,0,200,"koerniger frischkaese cottage cheese"],
["Gouda",356,25,28,0,2,0,30,"kaese cheese"],
["Mozzarella",254,18,20,1,1.2,0,125,"kaese cheese"],
["Feta",264,14,21,4.1,3,0,50,"schafskaese kaese"],
["Parmesan",392,36,27,0,1.6,0,15,"kaese parmigiano"],
["Frischkäse",253,6,24,3,0.8,0,30,"cream cheese philadelphia"],
["Butter",741,0.7,82,0.6,1.2,0,10,"butter"],
["Harzer Käse",125,30,0.7,0,3,0,125,"harzer roller kaese"],
["Reis, weiß (roh)",351,7,0.6,77,0.01,1.3,75,"rice basmati langkorn"],
["Reis, Vollkorn (roh)",350,7.8,2.7,70,0.01,3.5,75,"naturreis brown rice"],
["Nudeln, Hartweizen (roh)",358,12.5,1.5,71,0.01,3,100,"pasta spaghetti penne"],
["Vollkornnudeln (roh)",337,14,2.5,60,0.01,9,100,"pasta vollkorn"],
["Haferflocken",372,13.5,7,59,0.01,10,60,"hafer oats porridge"],
["Couscous (trocken)",358,12,0.6,72,0.01,5,80,"couscous"],
["Quinoa (trocken)",368,14,6.1,58,0.01,7,75,"quinoa"],
["Linsen (trocken)",353,25,1.1,60,0.01,11,80,"lentils"],
["Kichererbsen (trocken)",364,19,6,61,0.02,17,80,"chickpeas"],
["Kidneybohnen, Dose",100,7,0.5,13,0.5,6,120,"bohnen beans"],
["Vollkornbrot",210,7,1.5,38,1.1,6.5,45,"brot bread"],
["Toastbrot",265,8,3.5,48,1.1,3,25,"toast brot"],
["Weizenbrötchen",275,9,1.5,55,1.2,3,60,"broetchen semmel roll"],
["Knäckebrot",350,10,1.5,66,1.1,16,10,"knaeckebrot"],
["Weizenmehl Type 405",348,10,1,72,0.01,3,100,"mehl flour"],
["Mandeln",589,21,51,5.4,0.01,12,30,"almonds nuesse"],
["Walnüsse",654,15,65,7,0.01,6.7,30,"walnuts nuesse"],
["Haselnüsse",644,15,62,7,0.01,8,30,"hazelnuts nuesse"],
["Cashewkerne",553,18,44,27,0.02,3.3,30,"cashews nuesse"],
["Erdnüsse",567,26,49,8,0.02,8.5,30,"peanuts nuesse"],
["Erdnussbutter",588,25,50,12,0.5,6,20,"peanut butter erdnussmus"],
["Sonnenblumenkerne",584,21,51,11,0.01,8.6,20,"kerne seeds"],
["Leinsamen",534,18,42,1.6,0.03,27,15,"flaxseed"],
["Chiasamen",486,17,31,6,0.02,34,15,"chia"],
["Olivenöl",884,0,100,0,0,0,10,"oel oil olive"],
["Rapsöl",884,0,100,0,0,0,10,"oel oil canola"],
["Kokosöl",892,0,99,0,0,0,10,"oel oil coconut"],
["Tofu, natur",127,13,7.5,1,0.02,1,200,"tofu soja"],
["Räuchertofu",160,17,9.5,1,1,1.5,200,"tofu smoked"],
["Sojamilch, ungesüßt",33,3.3,1.8,0.6,0.09,0.6,200,"soja drink soy milk"],
["Hafermilch",45,0.5,1.5,6.6,0.09,0.8,200,"hafer drink oat milk"],
["Whey Protein (Pulver)",375,78,4,6,0.5,0,30,"eiweisspulver proteinpulver shake"],
["Honig",304,0.3,0,82,0.01,0.2,20,"honey"],
["Zucker",400,0,0,100,0,0,5,"sugar haushaltszucker"],
["Zartbitterschokolade 85%",592,10,46,22,0.02,12,25,"schokolade dark chocolate"],
["Vollmilchschokolade",535,7.3,30,59,0.08,3.4,25,"schokolade chocolate"],
["Ketchup",102,1.2,0.1,24,1.8,0.4,20,"tomatenketchup"],
["Mayonnaise",680,1.1,75,1.5,1.2,0,15,"mayo"],
["Senf",66,4.4,3.5,5,3,3,10,"mustard"]
];
// Häufig geloggte Basics gewinnen bei knappen Scores gegen exotischere Nachbarn
// ("chicken" soll Hähnchenbrust bringen, nicht Hähnchenschenkel).
const BASE_PRIO=new Set(['Süßkartoffel, roh','Kartoffel, roh','Karotte','Brokkoli','Tomate','Gurke','Zwiebel','Paprika, rot','Avocado','Banane','Apfel','Heidelbeeren','Hähnchenbrustfilet, roh','Putenbrustfilet','Rinderhackfleisch, mager (5%)','Lachs, roh','Thunfisch, Dose im eigenen Saft','Ei (Hühnerei)','Magerquark','Skyr','Naturjoghurt 3,5%','Milch 3,5%','Hüttenkäse','Gouda','Butter','Reis, weiß (roh)','Nudeln, Hartweizen (roh)','Haferflocken','Linsen (trocken)','Kichererbsen (trocken)','Vollkornbrot','Mandeln','Erdnussbutter','Olivenöl','Tofu, natur','Whey Protein (Pulver)']);
const BASE_FOODS=BASE_FOODS_RAW.map(r=>({code:'', name:r[0], brand:'', kc100:r[1], pr100:r[2], ft100:r[3], cb100:r[4], s100:r[5], fib100:r[6], qty:'', serving:r[7], _alias:r[8]||'', _prio:BASE_PRIO.has(r[0])?1:0, _base:true}));

// ---- Index über alles, was Robert schon mal gegessen hat ----
let _localIdx=null;
function invalidateFoodIdx(){ _localIdx=null; }
function localFoods(){
  if(_localIdx) return _localIdx;
  const map=new Map();
  const put=(p,date)=>{
    if(!p || p.kc100==null || !String(p.name||'').trim()) return;
    const key=fold(p.name)+'|'+fold(p.brand||'');
    if(key==='|') return;
    const e=map.get(key);
    if(e){ e.uses++; if(date && date>e.last) e.last=date; if(!e.p.code && p.code) e.p.code=p.code; }
    else map.set(key,{p:Object.assign({},p), uses:1, last:date||''});
  };
  for(const f of (db.foodFav||[])) put({code:f.code||'', name:f.name, brand:f.brand||'', kc100:f.kc100, pr100:f.pr100||0, ft100:f.ft100||0, cb100:f.cb100||0, s100:f.s100, fib100:f.fib100, qty:f.qty||'', serving:f.serving||0}, '');
  for(const d of (db.body||[])){
    for(const m of (d.meals||[])){
      if(m.k100==null) continue;
      const nm=String(m.pname||m.text||'').replace(/\s+[—-]\s+[\d.,]+\s*(g|ml|×|x).*$/i,'').trim();
      put({code:'', name:nm, brand:'', kc100:m.k100, pr100:m.p100||0, ft100:m.f100||0, cb100:m.c100||0, s100:(m.s100!=null?m.s100:null), fib100:(m.fib100!=null?m.fib100:null), qty:'', serving:m.g||0}, d.date||'');
    }
  }
  for(const code of Object.keys(db.customBarcodes||{})){ const p=customToProd(code); if(p) put(p,''); }
  _localIdx=[...map.values()];
  return _localIdx;
}
function daysAgo(d){ if(!d) return 9999; const a=new Date(d+'T00:00:00'), b=new Date(TODAY+'T00:00:00'); if(isNaN(a)) return 9999; return Math.round((b-a)/86400000); }
function searchLocal(q, limit){
  const out=[];
  for(const e of localFoods()){
    let s=scoreName(e.p.name, e.p.brand, '', q);
    if(!s) continue;
    s+=Math.min(20, (e.uses-1)*4);                        // oft gegessen = wahrscheinlicher
    const da=daysAgo(e.last);
    if(da<=7) s+=15; else if(da<=30) s+=8;                // kürzlich gegessen
    out.push({p:e.p, s});
  }
  out.sort((a,b)=>b.s-a.s);
  return out.slice(0, limit||8).map(x=>x.p);
}
function searchBase(q, limit){
  const out=[];
  for(const p of BASE_FOODS){
    let s=scoreName(p.name, '', p._alias, q);
    if(s>0){ if(p._prio) s+=10; out.push({p,s}); }
  }
  out.sort((a,b)=>b.s-a.s);
  return out.slice(0, limit||6).map(x=>x.p);
}
// OFF liefert unsortiert — deshalb hier nach Relevanz nachranken und Dubletten raus.
function rankOff(res, q, exclude){
  const seen=new Set((exclude||[]).map(p=>fold(p.name)+'|'+fold(p.brand||'')));
  const scored=[];
  for(const p of (res||[])){
    const key=fold(p.name)+'|'+fold(p.brand||'');
    if(seen.has(key)) continue;
    seen.add(key);
    let s=scoreName(p.name, p.brand, '', q);
    if(s>0){
      if(!p.brand) s+=12;            // ohne Marke = eher das generische Produkt
      if(p.serving>0) s+=2;
    }
    scored.push({p,s});
  }
  scored.sort((a,b)=>b.s-a.s);
  return scored.map(x=>x.p);
}

/* ---------------- Open Food Facts: Produktsuche & Barcode ---------------- */
const OFF='https://world.openfoodfacts.org';
function mapProd(p){
  const n=p.nutriments||{};
  const kc=num(n['energy-kcal_100g']);
  if(kc==null) return null;
  const pr=num(n['proteins_100g']);
  const ft=num(n['fat_100g']);
  const cb=num(n['carbohydrates_100g']);
  let sa=num(n['salt_100g']);
  if(sa==null){ const so=num(n['sodium_100g']); if(so!=null) sa=Math.round(so*2.5*100)/100; }
  let fb=num(n['fiber_100g']); if(fb==null) fb=num(n['fibers_100g']);
  return {code:p.code, name:(p.product_name||'Unbenannt').trim(), brand:(p.brands||'').split(',')[0].trim(), kc100:kc, pr100:pr!=null?pr:0, ft100:ft!=null?ft:0, cb100:cb!=null?cb:0, s100:sa, fib100:fb, qty:(p.quantity||'').trim(), serving:num(p.serving_quantity)||0};
}
// OFF-Server liefern pro Anfrage zufällig mal keinen CORS-Header → "Failed to fetch".
// Deshalb mehrfach wiederholen; ein neuer Versuch trifft meist einen funktionierenden Server.
async function fetchJSONRetry(u, {signal, tries=6, delay=300}={}){
  let last;
  for(let i=0;i<tries;i++){
    if(signal && signal.aborted) throw Object.assign(new Error('abort'),{name:'AbortError'});
    try{
      const r=await fetch(u,{signal});
      if(!r.ok) throw new Error('HTTP '+r.status);
      return await r.json();
    }catch(e){
      if(e.name==='AbortError') throw e;
      last=e;
      await new Promise(res=>setTimeout(res, delay));
    }
  }
  throw last||new Error('fetch fehlgeschlagen');
}
async function offSearch(q, signal){
  const u=OFF+'/cgi/search.pl?search_terms='+encodeURIComponent(q)+'&search_simple=1&action=process&json=1&page_size=60&fields=code,product_name,brands,nutriments,quantity,serving_quantity';
  const d=await fetchJSONRetry(u,{signal});
  return (d.products||[]).map(mapProd).filter(Boolean);
}
async function offBarcode(code){
  const u=OFF+'/api/v2/product/'+encodeURIComponent(code)+'.json?fields=code,product_name,brands,nutriments,quantity,serving_quantity';
  const d=await fetchJSONRetry(u,{tries:4});
  if(d.status!==1 || !d.product) return null;
  return mapProd(d.product);
}

/* ---------------- Gespeicherte Mahlzeiten & Tag kopieren ----------------
   Wer jeden Morgen dasselbe isst, soll das mit einem Tipp eintragen koennen
   statt vier Produkte einzeln zu suchen. Eine gespeicherte Mahlzeit ist ein
   Buendel fertiger Eintraege — genau das, was sonst im Warenkorb liegt. */
function saveMealSet(name, items){
  db.savedMeals = db.savedMeals || [];
  const clean = items.map(i=>Object.assign({}, i));
  const idx = db.savedMeals.findIndex(m=>m.name.toLowerCase()===name.toLowerCase());
  if(idx>=0) db.savedMeals[idx] = {id:db.savedMeals[idx].id, name, items:clean};
  else db.savedMeals.unshift({id:uid(), name, items:clean});
  db.savedMeals = db.savedMeals.slice(0,40);
  return Store.save(db);
}
function mealSetKcal(m){ return Math.round((m.items||[]).reduce((a,i)=>a+(i.kc||0),0)); }
function applyMealSet(m){
  for(const it of (m.items||[])) foodCart.push(Object.assign({}, it));
  renderCart();
  toast(m.name+' hinzugefügt — noch eintragen');
}
// Alle Mahlzeiten eines frueheren Tages zusaetzlich in den aktuellen Tag legen.
async function copyDayMeals(vonDatum){
  const von = db.body.find(x=>x.date===vonDatum);
  if(!von || !(von.meals||[]).length){ toast('Dieser Tag hat keine Mahlzeiten'); return; }
  const d = $('#bdate').value||TODAY;
  if(d===vonDatum){ toast('Das ist der aktuelle Tag'); return; }
  const e = dayEntry(d,true);
  e.meals = e.meals||[];
  for(const m of von.meals){
    const k = Object.assign({}, m, {id:uid()});
    e.meals.push(k);
    e.kcal=Math.round((e.kcal||0)+(k.kcal||0));
    if(k.protein!=null) e.protein=Math.round((e.protein||0)+k.protein);
    if(k.fat!=null) e.fat=Math.round((e.fat||0)+k.fat);
    if(k.carbs!=null) e.carbs=Math.round((e.carbs||0)+k.carbs);
  }
  invalidateFoodIdx();
  await Store.save(db);
  renderAll();
  toast(von.meals.length+' Mahlzeiten von '+fmtDate(vonDatum)+' übernommen');
}
function openCopyDay(){
  const ov=$('#copyOv'); if(!ov) return;
  const heute=$('#bdate').value||TODAY;
  const tage=bodySorted().filter(x=>x.date!==heute && (x.meals||[]).length).slice(-14).reverse();
  const list=$('#copyList');
  list.innerHTML = tage.length
    ? tage.map(x=>'<button class="pickitem" data-d="'+x.date+'"><div class="li-t">'+fmtDate(x.date)+'</div>'
        + '<div class="li-s">'+(x.meals.length)+' Einträge · '+Math.round(x.kcal||0)+' kcal</div></button>').join('')
    : '<div class="emptybox"><div class="eb-t">Keine Tage mit Mahlzeiten</div><div class="eb-s">Sobald an anderen Tagen Mahlzeiten stehen, kannst du sie hier uebernehmen.</div></div>';
  list.querySelectorAll('[data-d]').forEach(b=>b.onclick=async()=>{ ov.style.display='none'; await copyDayMeals(b.dataset.d); });
  ov.style.display='flex';
}
function pushFav(p){
  db.foodFav=(db.foodFav||[]).filter(f=>!(f.name===p.name && f.brand===p.brand));
  db.foodFav.unshift({code:p.code,name:p.name,brand:p.brand,kc100:p.kc100,pr100:p.pr100,ft100:p.ft100||0,cb100:p.cb100||0,s100:p.s100,fib100:p.fib100,qty:p.qty||'',serving:p.serving||0});
  db.foodFav=db.foodFav.slice(0,24);
}
function showFavs(){
  const list=foodOv.querySelector('.prodlist');
  const favs=db.foodFav||[];
  const sets=db.savedMeals||[];
  if(!favs.length && !sets.length){
    list.innerHTML='<div class="emptybox"><div class="eb-t">Noch nichts gespeichert</div>'
      + '<div class="eb-s">Tippen, scannen oder aus den Grundnahrungsmitteln waehlen. Was du im Warenkorb sammelst, kannst du als eigene Mahlzeit sichern.</div></div>';
    return;
  }
  // Gespeicherte Mahlzeiten stehen oben: sie sind der schnellste Weg.
  const setHtml = sets.length
    ? '<div class="pickgrp">Meine Mahlzeiten</div>' + sets.map((m,i)=>
        '<button class="pickitem mealset" data-ms="'+i+'"><div class="li-t">'+esc(m.name)+'</div>'
        + '<div class="li-s">'+((m.items||[]).length)+' Einträge · '+mealSetKcal(m)+' kcal</div></button>').join('')
    : '';
  if(favs.length) renderGroups([{title:'Zuletzt genutzt', items:favs}], list, '');
  else list.innerHTML='';
  if(setHtml) list.insertAdjacentHTML('afterbegin', setHtml);
  list.querySelectorAll('.mealset').forEach(b=>{
    const m = sets[+b.dataset.ms];
    b.onclick = ()=>applyMealSet(m);
    b.oncontextmenu = async e=>{
      e.preventDefault();
      if(confirm('Mahlzeit „'+m.name+'" löschen?')){
        db.savedMeals = db.savedMeals.filter(x=>x.id!==m.id);
        await Store.save(db); showFavs();
      }
    };
  });
}

const foodOv=document.createElement('div'); foodOv.id='foodOv'; foodOv.className='pickov'; foodOv.style.display='none';
foodOv.innerHTML=`<div class="picksheet">
  <div class="foodtitle" id="foodTitle">Hinzufügen</div>
  <div class="foodhead"><input class="picksearch prodq" type="text" placeholder="Produkt suchen …"><button class="ghost tiny prodgo">Suchen</button></div>
  <div class="foodacts"><button class="ghost tiny scanbtn">▣ Barcode</button><button class="ghost tiny freebtn">✎ Frei eintragen</button></div>
  <div class="picklist prodlist"></div>
  <div class="proddetail" style="display:none"></div>
  <div class="freeform" style="display:none"></div>
  <div class="foodcart" style="display:none"></div>
  <button class="cartgo" style="display:none;width:100%;margin-top:8px">Eintragen</button>
  <button class="link foodclose" style="margin-top:6px;text-align:center;width:100%">Schließen</button>
</div>`;
root.appendChild(foodOv);
let foodCart=[];
const openMeals=new Set(); const openExGroups=new Set();
function closeFood(){ foodOv.style.display='none'; foodCart=[]; releaseCam(); }
// Genau eine Ansicht im Produkt-Sheet sichtbar machen.
// Vorher setzte jede Funktion nur die Felder, an die sie gerade dachte —
// deshalb blieb die "Kein Produkt gefunden"-Box unter einem danach doch
// gefundenen Produkt stehen. Hier wird jedes Mal alles gesetzt.
function showPane(name){
  const on = (sel, sichtbar, wie) => {
    const el = foodOv.querySelector(sel);
    if(el) el.style.display = sichtbar ? (wie||'block') : 'none';
  };
  on('.foodhead',   name==='list', 'flex');
  on('.foodacts',   name==='list', 'flex');
  on('.prodlist',   name==='list');
  on('.proddetail', name==='detail');
  on('.freeform',   name==='free');
  // Inhalt der verlassenen Ansicht wegwerfen, damit nichts Altes durchblitzt
  if(name!=='free'){ const ff=foodOv.querySelector('.freeform'); if(ff) ff.innerHTML=''; }
  if(name!=='detail'){ const dt=foodOv.querySelector('.proddetail'); if(dt) dt.innerHTML=''; }
}
function showList(){
  showPane('list');
  showFavs();
}
function renderCart(){
  const cart=foodOv.querySelector('.foodcart'), go=foodOv.querySelector('.cartgo');
  if(!foodCart.length){ cart.style.display='none'; go.style.display='none'; return; }
  const tot=foodCart.reduce((a,i)=>a+(i.kc||0),0);
  cart.style.display='block';
  cart.innerHTML='<div class="cart-h">Auswahl</div>'+foodCart.map((i,ix)=>'<div class="cart-i"><span class="cart-t">'+esc(i.pname||i.text||'Eintrag')+'</span><span class="cart-k">'+Math.round(i.kc||0)+' kcal</span><button class="link warn cart-x" data-ci="'+ix+'">✕</button></div>').join('')+'<div class="cart-sum">Summe: '+Math.round(tot)+' kcal</div>';
  cart.insertAdjacentHTML('beforeend','<button class="link cart-save" style="width:100%;text-align:center;margin-top:4px">＋ Als Mahlzeit speichern</button>');
  cart.querySelector('.cart-save').onclick=async()=>{
    const nm=prompt('Name der Mahlzeit (z. B. Frühstück Standard)','');
    if(nm===null) return;
    const name=String(nm).trim();
    if(!name){ toast('Name angeben'); return; }
    await saveMealSet(name, foodCart);
    toast('Mahlzeit gespeichert');
  };
  cart.querySelectorAll('.cart-x').forEach(b=>b.onclick=()=>{ foodCart.splice(+b.dataset.ci,1); renderCart(); });
  go.style.display='block'; go.textContent='Eintragen ('+foodCart.length+')';
}
function addToCart(it){ foodCart.push(it); renderCart(); }
async function commitCart(){
  if(!foodCart.length){ closeFood(); return; }
  const date=$('#bdate').value||TODAY;
  let e=db.body.find(x=>x.date===date); if(!e){ e={date}; db.body.push(e); }
  e.meals=e.meals||[];
  for(const it of foodCart){
    e.kcal=Math.round((e.kcal||0)+(it.kc||0));
    if(it.pr!=null) e.protein=Math.round((e.protein||0)+it.pr);
    if(it.ft!=null) e.fat=Math.round((e.fat||0)+it.ft);
    if(it.cb!=null) e.carbs=Math.round((e.carbs||0)+it.cb);
    e.meals.push({id:uid(), name:curMeal||'Mahlzeit', text:it.text||'', kcal:Math.round(it.kc||0), protein:it.pr!=null?Math.round(it.pr):0, fat:it.ft!=null?Math.round(it.ft):null, carbs:it.cb!=null?Math.round(it.cb):null, k100:it.k100, p100:it.p100, f100:it.f100, c100:it.c100, salt:it.salt!=null?it.salt:null, fiber:it.fib!=null?it.fib:null, s100:it.s100, fib100:it.fib100, g:it.g, pname:it.pname});
  }
  const n=foodCart.length; foodCart=[];
  invalidateFoodIdx();
  await Store.save(db); renderAll(); closeFood(); toast(n+' Artikel eingetragen');
}
function showFree(barcode){
  showPane('free');
  const ff=foodOv.querySelector('.freeform');
  ff.innerHTML=`<button class="link freeback">← zurück</button>${barcode?'<div class="missbanner">Barcode '+esc(barcode)+' — wird für künftige Scans gemerkt</div>':''}
    <label class="f" style="margin-top:8px">Bezeichnung</label>
    <input class="ff-name" placeholder="z. B. Eier (M)">
    <div class="seg ff-unit" style="margin-top:10px"><button data-u="gml" aria-pressed="true">g / ml</button><button data-u="piece" aria-pressed="false">Stück</button></div>
    <div class="ff-gml"><label class="f">Menge (g / ml)</label><input type="text" class="ff-g" inputmode="decimal" placeholder="z. B. 150"></div>
    <div class="ff-piece" style="display:none">
      <label class="f">Größe wählen (z. B. Ei) — oder Gramm selbst eintragen</label>
      <div class="pickchips ff-sizes"><button class="chip" data-gp="48">S · 48 g</button><button class="chip" data-gp="58">M · 58 g</button><button class="chip" data-gp="68">L · 68 g</button><button class="chip" data-gp="73">XL · 73 g</button></div>
      <div class="row" style="margin-top:8px"><div><label class="f">Gramm pro Stück</label><input type="text" class="ff-gp" inputmode="decimal" placeholder="g"></div><div><label class="f">Anzahl</label><input type="text" class="ff-count" inputmode="decimal" value="1"></div></div>
    </div>
    <div class="ff-hint">Nährwerte pro 100 g / 100 ml eingeben (Komma erlaubt):</div>
    <div class="row" style="margin-top:8px"><div><label class="f">Kalorien /100</label><input type="text" class="ff-kc" inputmode="decimal" placeholder="kcal"></div><div><label class="f">Protein /100</label><input type="text" class="ff-pr" inputmode="decimal" placeholder="g"></div></div>
    <div class="row" style="margin-top:10px"><div><label class="f">Fett /100</label><input type="text" class="ff-ft" inputmode="decimal" placeholder="g"></div><div><label class="f">Kohlenhydrate /100</label><input type="text" class="ff-cb" inputmode="decimal" placeholder="g"></div></div>
    <div class="row" style="margin-top:10px"><div><label class="f">Salz /100</label><input type="text" class="ff-salt" inputmode="decimal" placeholder="g"></div><div><label class="f">Ballaststoffe /100</label><input type="text" class="ff-fib" inputmode="decimal" placeholder="g"></div></div>
    <div class="ff-calc"></div>
    <button class="ff-add" style="width:100%;margin-top:12px">Zur Auswahl hinzufügen</button>`;
  const qf=s=>ff.querySelector(s);
  const calc=qf('.ff-calc');
  let unit='gml';
  function grams(){ if(unit==='piece'){ return (num(qf('.ff-gp').value)||0)*(num(qf('.ff-count').value)||1); } return num(qf('.ff-g').value)||100; }
  const per=()=>({kc:num(qf('.ff-kc').value), pr:num(qf('.ff-pr').value), ft:num(qf('.ff-ft').value), cb:num(qf('.ff-cb').value), salt:num(qf('.ff-salt').value), fib:num(qf('.ff-fib').value)});
  function upd(){
    const g=grams(); const p=per();
    const sc=x=>x!=null?Math.round(x*g/100*10)/10:null;
    const kc=p.kc!=null?Math.round(p.kc*g/100):null;
    calc.innerHTML = p.kc!=null ? '<b>'+kc+' kcal</b> für '+(Math.round(g*10)/10)+' g' : '';
    return {g, p, kc, pr:sc(p.pr), ft:sc(p.ft), cb:sc(p.cb), salt:sc(p.salt), fib:sc(p.fib)};
  }
  ff.querySelectorAll('input').forEach(i=>i.addEventListener('input',upd));
  ff.querySelectorAll('.ff-unit button').forEach(b=>b.onclick=()=>{ unit=b.dataset.u; ff.querySelectorAll('.ff-unit button').forEach(x=>x.setAttribute('aria-pressed', String(x.dataset.u===unit))); qf('.ff-gml').style.display= unit==='gml'?'block':'none'; qf('.ff-piece').style.display= unit==='piece'?'block':'none'; upd(); });
  ff.querySelectorAll('.ff-sizes .chip').forEach(c=>c.onclick=()=>{ qf('.ff-gp').value=c.dataset.gp; ff.querySelectorAll('.ff-sizes .chip').forEach(x=>x.classList.toggle('on',x===c)); upd(); });
  qf('.freeback').onclick=showList;
  qf('.ff-add').onclick=()=>{
    const name=qf('.ff-name').value.trim();
    const {g,p,kc,pr,ft,cb,salt,fib}=upd();
    if(p.kc==null){ toast('Bitte Kalorien pro 100 angeben'); return; }
    if(!(g>0)){ toast(unit==='piece'?'Gramm pro Stück + Anzahl angeben':'Menge angeben'); return; }
    let text;
    if(unit==='piece'){ const cnt=num(qf('.ff-count').value)||1, gp=num(qf('.ff-gp').value)||0; text=(name||'Freier Eintrag')+' — '+cnt+' × '+gp+' g'; }
    else { text=(name||'Freier Eintrag')+' — '+Math.round(g)+' g'; }
    if(barcode){ db.customBarcodes=db.customBarcodes||{}; db.customBarcodes[barcode]={name:name||'Produkt', kc100:p.kc, pr100:p.pr, ft100:p.ft, cb100:p.cb, s100:p.salt, fib100:p.fib}; Store.save(db); }
    addToCart({pname:name||'Freier Eintrag', text, kc, pr, ft, cb, salt, fib, g:Math.round(g), k100:p.kc, p100:p.pr, f100:p.ft, c100:p.cb, s100:p.salt, fib100:p.fib});
    showList(); toast(barcode?'Hinzugefügt & Barcode gemerkt':'Hinzugefügt');
  };
  setTimeout(()=>{ const el=qf('.ff-name'); if(el) el.focus(); },60);
}
foodOv.querySelector('.foodclose').onclick=closeFood;
foodOv.addEventListener('click', e=>{ if(e.target===foodOv) closeFood(); });
foodOv.querySelector('.cartgo').onclick=commitCart;
foodOv.querySelector('.freebtn').onclick=showFree;
foodOv.querySelector('.scanbtn').onclick=openScan;
{ const _amt=$('#addMealType'); if(_amt) _amt.onclick=async()=>{ const nm=prompt('Name der neuen Mahlzeit (z. B. Pre-Workout)'); if(!nm||!nm.trim()) return; const name=nm.trim(); if(!db.mealTypes.includes(name)) db.mealTypes.push(name); await Store.save(db); renderMeals(); }; }
function openFood(){
  foodCart=[];
  invalidateFoodIdx(); lastLocal=null; curQuery='';
  foodOv.querySelector('.prodq').value='';
  const tt=foodOv.querySelector('#foodTitle'); if(tt) tt.textContent=(curMeal||'Mahlzeit')+' · hinzufügen';
  showList();
  renderCart();
  foodOv.style.display='flex';
  setTimeout(()=>{ const q=foodOv.querySelector('.prodq'); if(q) q.focus(); },60);
}
let searchTimer=null, searchAbort=null, curQuery='', lastLocal=null;
function prodRow(p, i){
  const sub=(p.brand?esc(p.brand)+' · ':'')+Math.round(p.kc100)+' kcal · '+round(p.pr100||0,1)+' g P / 100 g'+(p.qty?' · '+esc(p.qty):'');
  return `<button class="pickitem prod" data-i="${i}"><div class="li-t">${esc(p.name)}</div><div class="li-s">${sub}</div></button>`;
}
// Rendert mehrere Ergebnisgruppen (eigene Historie, Grundnahrungsmittel, Datenbank)
// in eine gemeinsame Liste und verdrahtet die Klicks über einen flachen Index.
function renderGroups(groups, list, foot){
  const flat=[];
  let html='';
  for(const g of groups){
    if(!g || !g.items || !g.items.length) continue;
    html+='<div class="pickgrp">'+esc(g.title)+'</div>';
    html+=g.items.map(p=>prodRow(p, flat.push(p)-1)).join('');
  }
  if(!html && !foot) html='<div class="emptybox"><div class="eb-t">Nichts gefunden</div><div class="eb-s">Anderen Begriff probieren, Barcode scannen oder frei eintragen.</div></div>';
  // Fussnote unter den Treffern (Suchstatus), bewusst kein Leerzustand
  if(foot) html+='<div class="empty searchfoot">'+foot+'</div>';
  list.innerHTML=html;
  list.querySelectorAll('.prod').forEach(b=>b.onclick=()=>showProdDetail(flat[+b.dataset.i]));
}
function localGroups(q){
  if(!lastLocal || lastLocal.q!==q) lastLocal={q, mine:searchLocal(q), base:searchBase(q)};
  return [{title:'Deine Produkte', items:lastLocal.mine},{title:'Grundnahrungsmittel', items:lastLocal.base}];
}
async function runSearch(q){
  const list=foodOv.querySelector('.prodlist');
  if(searchAbort) searchAbort.abort();
  searchAbort=new AbortController();
  curQuery=q;
  const gs=localGroups(q);
  renderGroups(gs, list, 'Datenbank wird durchsucht …');
  try{
    const res=await offSearch(q, searchAbort.signal);
    if(curQuery!==q) return; // veraltet
    const known=gs[0].items.concat(gs[1].items);
    const ranked=rankOff(res, q, known);
    renderGroups(gs.concat([{title:'Datenbank (Open Food Facts)', items:ranked}]), list, ranked.length?'':'In der Datenbank nichts Passendes gefunden');
  }catch(e){
    if(e.name==='AbortError' || curQuery!==q) return;
    renderGroups(gs, list, 'Keine Verbindung zur Datenbank ('+esc(e.message||'')+') — nochmal versuchen');
  }
}
function onQueryInput(){
  const q=foodOv.querySelector('.prodq').value.trim();
  clearTimeout(searchTimer);
  const list=foodOv.querySelector('.prodlist');
  if(q.length<2){ if(searchAbort) searchAbort.abort(); curQuery=''; showFavs(); return; }
  // Lokale Treffer sofort zeigen, der Netz-Call kommt gedrosselt hinterher.
  curQuery=q;
  renderGroups(localGroups(q), list, 'Datenbank wird durchsucht …');
  searchTimer=setTimeout(()=>runSearch(q), 350);
}
foodOv.querySelector('.prodq').addEventListener('input', onQueryInput);
// iOS meldet die neue Viewport-Hoehe teils erst nach der Tastatur-Animation
foodOv.querySelector('.prodq').addEventListener('focus', ()=>{ setTimeout(syncViewport,120); setTimeout(syncViewport,400); });
foodOv.querySelector('.prodgo').onclick=()=>{ const q=foodOv.querySelector('.prodq').value.trim(); if(q.length>=2){ clearTimeout(searchTimer); runSearch(q); } };
foodOv.querySelector('.prodq').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const q=e.target.value.trim(); if(q.length>=2){ clearTimeout(searchTimer); runSearch(q); } } });
function showProdDetail(p){
  showPane('detail');
  const det=foodOv.querySelector('.proddetail');
  const presets=[];
  if(p.serving>0) presets.push([Math.round(p.serving),'1 Portion ('+Math.round(p.serving)+' g)']);
  [50,100,150,200].forEach(g=>presets.push([g, g+' g']));
  det.innerHTML=`
    <button class="link prodback">← zurück</button>
    <div class="li-t" style="font-size:16px;margin:6px 0 2px">${esc(p.name)}</div>
    <div class="li-s">${p.brand?esc(p.brand)+' · ':''}${Math.round(p.kc100)} kcal · ${round(p.pr100,1)} g P · ${round(p.ft100||0,1)} g F · ${round(p.cb100||0,1)} g KH${p.s100!=null?' · '+round(p.s100,2)+' g Salz':''}${p.fib100!=null?' · '+round(p.fib100,1)+' g Ballast':''} / 100 g</div>
    <label class="f" style="margin-top:16px">Menge (g / ml)</label>
    <input type="number" class="prodg" inputmode="numeric" value="${p.serving>0?Math.round(p.serving):100}">
    <div class="pickchips prodport" style="margin-top:8px">${presets.map(([g,l])=>`<button class="chip" data-g="${g}">${l}</button>`).join('')}</div>
    <div class="prodcalc" style="margin:14px 0"></div>
    <button class="prodadd" style="width:100%">Zur Auswahl hinzufügen</button>`;
  const g=det.querySelector('.prodg'), calc=det.querySelector('.prodcalc');
  function upd(){ const grams=num(g.value)||0; const kc=p.kc100*grams/100, pr=p.pr100*grams/100, ft=(p.ft100||0)*grams/100, cb=(p.cb100||0)*grams/100, sa=(p.s100||0)*grams/100, fb=(p.fib100||0)*grams/100; calc.innerHTML=`<b>${Math.round(kc)} kcal</b> · ${round(pr,1)} g P · ${round(ft,1)} g F · ${round(cb,1)} g KH`+(p.s100!=null?` · ${round(sa,2)} g Salz`:'')+(p.fib100!=null?` · ${round(fb,1)} g Ballast`:''); return {kc,pr,ft,cb,sa,fb,grams}; }
  g.oninput=upd; upd();
  det.querySelectorAll('.prodport .chip').forEach(b=>b.onclick=()=>{ g.value=b.dataset.g; upd(); });
  det.querySelector('.prodback').onclick=()=>{ showList(); };
  det.querySelector('.prodadd').onclick=()=>{ const {kc,pr,ft,cb,sa,fb,grams}=upd(); const text=`${p.name}${p.brand?' ('+p.brand+')':''} — ${Math.round(grams)} g`; pushFav(p); addToCart({pname:p.name+(p.brand?' ('+p.brand+')':''), text, kc, pr, ft, cb, salt:(p.s100!=null?Math.round(sa*100)/100:null), fib:(p.fib100!=null?Math.round(fb*10)/10:null), g:Math.round(grams), k100:p.kc100, p100:p.pr100, f100:p.ft100||0, c100:p.cb100||0, s100:p.s100, fib100:p.fib100}); showList(); toast('Hinzugefügt'); };
}

/* ---- Barcode-Scanner ---- */
let _zxP=null;
function loadZX(){ if(window.ZXing) return Promise.resolve(window.ZXing); if(_zxP) return _zxP; _zxP=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js'; s.onload=()=>res(window.ZXing); s.onerror=()=>rej(new Error('ZXing load failed')); document.head.appendChild(s); }); return _zxP; }
const scanOv=document.createElement('div'); scanOv.id='scanOv'; scanOv.className='pickov'; scanOv.style.display='none';
scanOv.innerHTML=`<div class="picksheet">
  <div class="li-t" style="margin-bottom:8px">Barcode scannen</div>
  <div class="scanwrap"><video class="scanvid" playsinline muted></video><div class="scanreticle"><span class="scanline"></span></div></div>
  <div class="scaninfo li-s" style="margin-top:8px">Kamera wird gestartet…</div>
  <label class="f" style="margin-top:12px">oder Barcode-Nummer eingeben</label>
  <div class="row"><input class="scancode" inputmode="numeric" placeholder="z. B. 4056489095736"><button class="ghost tiny scango" style="flex:0 0 auto">OK</button></div>
  <button class="link scanclose" style="margin-top:12px;text-align:center;width:100%">Schließen</button>
</div>`;
root.appendChild(scanOv);
let scanStream=null, scanRAF=null, scanZX=null, scanActive=false;
// Winkel, um den der Browser den Inhalt beim Kippen bereits gedreht hat.
// screen.orientation.angle ist der Standard; window.orientation ist das alte
// iOS-Pendant mit umgekehrtem Vorzeichen und dient nur als Rueckfalloption.
function _screenAngle(){
  const so = window.screen && window.screen.orientation;
  let a = (so && typeof so.angle === 'number') ? so.angle : (360 - (window.orientation||0));
  return ((a % 360) + 360) % 360;
}
function syncScanRotation(){
  if(!scanOv || scanOv.style.display === 'none') return;
  const sheet = scanOv.querySelector('.picksheet');
  if(!sheet) return;
  const a = _screenAngle();
  const quer = (a === 90 || a === 270);
  scanOv.classList.toggle('scan-rot', quer);
  // Gegen den Winkel drehen, den der Browser bereits aufgelegt hat.
  const g = (360 - a) % 360;
  sheet.style.transform = g ? (quer ? 'translate(-50%,-50%) rotate('+g+'deg)' : 'rotate('+g+'deg)') : (quer ? 'translate(-50%,-50%)' : '');
}
// iOS merkt sich die Kamera-Erlaubnis bei Homescreen-Web-Apps nicht (bekannte
// WebKit-Einschraenkung) — jedes getUserMedia fragt erneut. Deshalb laeuft der
// Stream nach dem Schliessen noch kurz weiter: Wer im Laden mehrere Produkte
// hintereinander scannt, wird nur einmal gefragt und der Scanner oeffnet sofort.
// Freigegeben wird er nach CAM_WARM_MS oder sobald die App in den Hintergrund geht.
const CAM_WARM_MS = 90000;
let camWarmTimer = null;
function releaseCam(){
  if(camWarmTimer){ clearTimeout(camWarmTimer); camWarmTimer=null; }
  if(scanStream){ try{ scanStream.getTracks().forEach(t=>t.stop()); }catch(e){} scanStream=null; }
}
function camWarmStart(){
  if(camWarmTimer){ clearTimeout(camWarmTimer); camWarmTimer=null; }
  if(camLive()) camWarmTimer = setTimeout(releaseCam, CAM_WARM_MS);
  else scanStream = null;
}
function camLive(){
  return !!(scanStream && scanStream.getTracks && scanStream.getTracks().some(t=>t.readyState==='live'));
}
async function getCam(){
  if(camLive()){                                  // noch warm — keine neue Nachfrage
    if(camWarmTimer){ clearTimeout(camWarmTimer); camWarmTimer=null; }
    return scanStream;
  }
  releaseCam();
  scanStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}});
  return scanStream;
}
try{ document.addEventListener('visibilitychange', ()=>{ if(document.hidden) releaseCam(); }); }catch(e){}

// hart=true gibt die Kamera sofort frei, sonst laeuft sie noch warm weiter.
function stopScan(hart){
  scanActive=false;
  if(scanRAF){ cancelAnimationFrame(scanRAF); scanRAF=null; }
  if(scanZX){
    // ZXing wuerde beim reset() die Tracks unseres Streams mitstoppen — die
    // Referenz vorher kappen, damit uns der warme Stream erhalten bleibt.
    try{ if(!hart) scanZX.stream = undefined; }catch(e){}
    try{ scanZX.reset(); }catch(e){}
    scanZX=null;
  }
  const _v=scanOv.querySelector('.scanvid'); if(_v) _v.srcObject=null;
  if(hart) releaseCam(); else camWarmStart();
}
function closeScan(){
  stopScan();
  scanOv.style.display='none';
  scanOv.classList.remove('scan-rot');
  const _sh=scanOv.querySelector('.picksheet'); if(_sh) _sh.style.transform='';
}
scanOv.querySelector('.scanclose').onclick=closeScan;
scanOv.addEventListener('click', e=>{ if(e.target===scanOv) closeScan(); });
scanOv.querySelector('.scango').onclick=()=>{ const c=scanOv.querySelector('.scancode').value.trim(); if(c) handleCode(c); };
scanOv.querySelector('.scancode').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const c=e.target.value.trim(); if(c) handleCode(c); } });
function customToProd(code){ const c=db.customBarcodes&&db.customBarcodes[code]; if(!c) return null; return {code, name:c.name||'Produkt', brand:'', kc100:c.kc100||0, pr100:c.pr100||0, ft100:c.ft100||0, cb100:c.cb100||0, s100:(c.s100!=null?c.s100:null), fib100:(c.fib100!=null?c.fib100:null), qty:'', serving:0}; }
function showBarcodeMiss(code){
  showPane('free');
  const ff=foodOv.querySelector('.freeform');
  ff.innerHTML='<div class="missbox"><div class="miss-t">Kein Produkt gefunden</div><div class="miss-s">Zu diesem Barcode gibt es keinen Eintrag in der Datenbank (auch nicht bei Open Food Facts).</div><div class="miss-code">'+esc(code)+'</div></div>'
    +'<button class="missnew" style="width:100%;margin-top:14px">Produkt manuell anlegen &amp; merken</button>'
    +'<button class="link missback" style="width:100%;margin-top:10px;text-align:center">Stattdessen suchen</button>'
    +'<button class="link missscan" style="width:100%;text-align:center">Erneut scannen</button>';
  ff.querySelector('.missnew').onclick=()=>showFree(code);
  ff.querySelector('.missback').onclick=showList;
  ff.querySelector('.missscan').onclick=openScan;
}
async function handleCode(code){
  stopScan(); scanOv.style.display='none';
  let p = customToProd(code);
  if(!p){ toast('Suche Produkt…'); try{ p=await offBarcode(code); }catch(e){} }
  foodOv.style.display='flex';
  if(!p){ showBarcodeMiss(code); return; }
  showProdDetail(p);
}
async function openScan(){
  scanOv.querySelector('.scancode').value='';
  const vid=scanOv.querySelector('.scanvid'), info=scanOv.querySelector('.scaninfo');
  info.textContent='Kamera wird gestartet…';
  scanOv.style.display='flex';
  syncScanRotation();
  scanActive=true;
  // Weg 1: nativer BarcodeDetector (Android/Chrome)
  if('BarcodeDetector' in window){
    try{
      scanStream=await getCam();
      vid.srcObject=scanStream; await vid.play();
      info.textContent='Kamera auf den Barcode richten.';
      const det=new window.BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','code_128','code_39','itf']});
      const loop=async()=>{ if(!scanActive) return; try{ const cs=await det.detect(vid); if(cs&&cs.length){ handleCode(cs[0].rawValue); return; } }catch(e){} scanRAF=requestAnimationFrame(loop); };
      loop();
    }catch(e){ info.textContent='Kamera nicht verfügbar — bitte Nummer eingeben.'; scanActive=false; releaseCam(); }
    return;
  }
  // Weg 2: ZXing steuert die Kamera selbst (iOS Safari)
  try{
    const ZX=await loadZX();
    scanZX=new ZX.BrowserMultiFormatReader();
    const cb=(result)=>{ if(result && scanActive){ scanActive=false; handleCode(result.getText()); } };
    info.textContent='Kamera auf den Barcode richten.';
    // Erst den Stream selbst holen, dann ZXing darauf ansetzen — nur so bleibt
    // die Kamera in unserer Hand und kann warm gehalten werden.
    try{
      const st = await getCam();
      vid.srcObject = st;
      try{ await vid.play(); }catch(e0){}
      if(typeof scanZX.decodeFromStream === 'function') await scanZX.decodeFromStream(st, vid, cb);
      else await scanZX.decodeFromConstraints({video:{facingMode:{ideal:'environment'}}}, vid, cb);
    }catch(e1){
      try{
        await scanZX.decodeFromConstraints({video:{facingMode:{ideal:'environment'}}}, vid, cb);
      }catch(e2){
        await scanZX.decodeFromVideoDevice(undefined, vid, cb);
      }
    }
  }catch(e){ info.textContent='Kamera nicht verfügbar — bitte Nummer eingeben.'; scanActive=false; releaseCam(); }
}
const _psb=$('#prodSearchBtn'); if(_psb) _psb.onclick=openFood;
const _bcb=$('#barcodeBtn'); if(_bcb) _bcb.onclick=openScan;


/* ---------------- Aktives Training ----------------
   Der Modus ist eine Ansicht AUF die Blöcke im Training-Tab, keine zweite
   Datenhaltung: er liest und schreibt dieselben Eingabefelder. Dadurch bleibt
   "Einheit speichern" unverändert, und die beiden Ansichten können nicht
   auseinanderlaufen. Ein erledigter Satz wird über data-done markiert.
   ------------------------------------------------------------------------ */
let atEx = 0;                       // Index der aktuellen Übung
let restEndAt = null, restTickTimer = null;
let audioCtx = null, beepDone = true;

function atBlocks(){ return $$('#blocks .block'); }
function atRows(b){ return b ? [...b.querySelectorAll('.setrow')] : []; }
function atName(b){ const s=b&&b.querySelector('.exsel'); return s?s.value:''; }
function atAllRows(){ return $$('#blocks .setrow'); }
function atDoneCount(){ return atAllRows().filter(r=>r.dataset.done==='1').length; }
function rowFilled(r){ const i=r.querySelectorAll('input'); return num(i[0].value)!=null && num(i[1].value)!=null && num(i[1].value)>0; }

/* --- Signal am Ende der Pause. iOS Safari kennt keine Vibration-API, also Ton.
       Der AudioContext wird beim Abhaken erzeugt — das ist die Nutzergeste,
       ohne die iOS keinen Ton zulässt. --- */
function beepArm(){
  try{
    if(!audioCtx){ const C = window.AudioContext || window.webkitAudioContext; if(C) audioCtx = new C(); }
    if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }catch(e){}
  beepDone = false;
}
function beep(){
  if(beepDone) return;
  beepDone = true;
  try{
    if(!audioCtx) return;
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type='sine'; o.frequency.setValueAtTime(880, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t+0.4);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t+0.42);
  }catch(e){}
}

/* --- Progressionsvorschlag ---
   Bewusst eine einfache, nachvollziehbare Regel statt einer Formel, die mehr
   Präzision vortäuscht als die Daten hergeben: Standen letztes Mal im schwersten
   Arbeitssatz mindestens 8 Wiederholungen und war (falls geloggt) noch Reserve
   übrig, dann Gewicht steigern. Sonst erst die Wiederholungen erhöhen. --- */
function progressHint(ex){
  const l = lastSession(ex);
  if(!l) return null;
  const ws = workSets(l).filter(s=>s.w!=null && s.r!=null && s.r>0);
  if(!ws.length) return null;
  const topW = Math.max(...ws.map(s=>s.w));
  const minR = Math.min(...ws.filter(s=>s.w===topW).map(s=>s.r));
  const rirs = ws.filter(s=>s.rir!=null).map(s=>s.rir);
  const avgRir = rirs.length ? rirs.reduce((a,c)=>a+c,0)/rirs.length : null;
  const step = topW >= 60 ? 2.5 : 1.25;
  if(minR >= 8 && (avgRir == null || avgRir >= 1)){
    return { w: topW+step, r: minR, text: 'Vorschlag: '+round(topW+step,2)+' kg × '+minR };
  }
  return { w: topW, r: minR+1, text: 'Vorschlag: '+round(topW,2)+' kg × '+(minR+1)+' — erst Wdh. steigern' };
}

/* --- Overlay --- */
const trainOv = document.createElement('div');
trainOv.id = 'trainOv';
trainOv.className = 'atov';
trainOv.style.display = 'none';
trainOv.innerHTML = `
  <div class="atwrap">
    <div class="athead">
      <button class="link atclose">✕ Schließen</button>
      <span class="atdur" title="Dauer der Einheit"></span>
      <span class="atcount"></span>
    </div>
    <div class="atbar"><i></i></div>
    <div class="atprog"></div>
    <div class="atbody"></div>
    <div class="atrest" style="display:none">
      <div class="atrest-l">Pause</div>
      <div class="atrest-v">0:00</div>
      <div class="atrest-a">
        <button class="ghost tiny atrest-minus">−30 s</button>
        <button class="ghost tiny atrest-plus">+30 s</button>
        <button class="ghost tiny atrest-skip">Überspringen</button>
      </div>
    </div>
    <div class="atnav">
      <button class="ghost atprev">← Übung</button>
      <button class="ghost atnext">Übung →</button>
    </div>
    <button class="atsave">Einheit speichern</button>
  </div>`;
root.appendChild(trainOv);

function openAT(){
  if(!atBlocks().length){ toast('Erst eine Übung hinzufügen'); return; }
  atEx = Math.max(0, Math.min(atEx, atBlocks().length-1));
  // Bei der ersten offenen Übung einsteigen
  const off = atBlocks().findIndex(b => atRows(b).some(r => r.dataset.done !== '1'));
  if(off >= 0) atEx = off;
  trainOv.style.display = 'flex';
  renderAT();
  renderResumeBar();
}
function closeAT(){ trainOv.style.display='none'; stopRest(); updateBlockSummaries(); renderResumeBar(); }

function renderAT(){
  const bs = atBlocks();
  if(!bs.length){ closeAT(); return; }
  atEx = Math.max(0, Math.min(atEx, bs.length-1));
  const b = bs[atEx];
  const ex = atName(b);
  const rows = atRows(b);
  const gesamt = atAllRows().length, fertig = atDoneCount();

  trainOv.querySelector('.atcount').textContent = 'Übung ' + (atEx+1) + ' von ' + bs.length;
  trainOv.querySelector('.atbar i').style.width = gesamt ? Math.round(fertig/gesamt*100)+'%' : '0%';
  trainOv.querySelector('.atprog').textContent = fertig + ' von ' + gesamt + ' Sätzen erledigt';

  const l = lastSession(ex);
  const ph = progressHint(ex);
  const refText = l
    ? 'Letztes Mal ('+fmtDate(l.date)+'): ' + l.sets.map(x=>(x.warm?'W ':'')+x.w+'×'+x.r).join(' · ')
    : 'Erste Einheit für diese Übung.';

  // Erledigte und offene Sätze der aktuellen Übung
  const liste = rows.map((r,i)=>{
    const v = r.querySelectorAll('input');
    const done = r.dataset.done === '1';
    const warm = r.dataset.warm === '1';
    return '<div class="atset'+(done?' done':'')+(warm?' warm':'')+'" data-i="'+i+'">'
      + '<span class="ats-n">'+(warm?'W':(i+1))+'</span>'
      + '<span class="ats-v">'+(v[0].value||'—')+' kg × '+(v[1].value||'—')
      + (v[2] && v[2].value!=='' ? ' · RIR '+v[2].value : '')+'</span>'
      + '<span class="ats-c">'+(done?'✓':'')+'</span></div>';
  }).join('');

  const offen = rows.findIndex(r => r.dataset.done !== '1');
  const akt = offen >= 0 ? rows[offen] : null;
  const av = akt ? akt.querySelectorAll('input') : null;

  trainOv.querySelector('.atbody').innerHTML =
      '<div class="atex">'+esc(ex)+'</div>'
    + '<div class="atref">'+esc(refText)+'</div>'
    + (ph ? '<div class="atsug">'+esc(ph.text)+'<button class="link atsug-use">übernehmen</button></div>' : '')
    + '<div class="atsets">'+liste+'</div>'
    + (akt
        ? '<div class="atnow">'
          + '<div class="atnow-l">Satz '+(offen+1)+(akt.dataset.warm==='1'?' · Aufwärmen':'')+'</div>'
          + '<div class="atnow-in">'
          +   '<label><span>kg</span><input class="at-w" type="number" step="0.5" inputmode="decimal" value="'+(av[0].value||'')+'"></label>'
          +   '<label><span>Wdh.</span><input class="at-r" type="number" step="1" inputmode="numeric" value="'+(av[1].value||'')+'"></label>'
          +   '<label><span>RIR</span><input class="at-rir" type="number" step="1" min="0" max="'+RIR_MAX+'" inputmode="numeric" value="'+((av[2]&&av[2].value)||'')+'"></label>'
          + '</div>'
          + '<div class="atnow-a">'
          +   '<button class="ghost at-warm" aria-pressed="'+(akt.dataset.warm==='1')+'">Aufwärmsatz</button>'
          +   '<button class="at-ok">✓ Satz fertig</button>'
          + '</div></div>'
        : '<div class="emptybox"><div class="eb-t">Übung abgeschlossen</div><div class="eb-s">Weiter zur nächsten Übung oder Einheit speichern.</div></div>')
    + '<button class="ghost tiny at-add" style="width:100%;margin-top:10px">＋ Satz</button>';

  // Verdrahtung
  const q = sel => trainOv.querySelector(sel);
  if(ph) q('.atsug-use').onclick = ()=>{
    const w=q('.at-w'), r=q('.at-r');
    if(w) w.value = ph.w;
    if(r) r.value = ph.r;
  };
  if(akt){
    q('.at-warm').onclick = ()=>{
      if(akt.dataset.warm==='1') delete akt.dataset.warm; else akt.dataset.warm='1';
      renderAT();
    };
    q('.at-ok').onclick = ()=>{
      const w=num(q('.at-w').value), r=num(q('.at-r').value), ri=num(q('.at-rir').value);
      if(w==null || r==null || !(r>0)){ toast('Gewicht und Wiederholungen eintragen'); return; }
      av[0].value = q('.at-w').value;
      av[1].value = q('.at-r').value;
      if(av[2]) av[2].value = (ri!=null && ri>=0 && ri<=RIR_MAX) ? String(Math.round(ri)) : '';
      akt.dataset.done = '1';
      markSet(); markUnsaved();
      if(akt.dataset.warm !== '1') startRest(ex);   // nach Aufwärmsätzen keine volle Pause
      // Ist die Übung fertig, automatisch zur nächsten offenen springen
      const restOffen = atRows(atBlocks()[atEx]).some(x=>x.dataset.done!=='1');
      if(!restOffen){
        const nx = atBlocks().findIndex((bb,ix)=> ix>atEx && atRows(bb).some(x=>x.dataset.done!=='1'));
        if(nx>=0) atEx = nx;
      }
      renderAT();
    };
  }
  q('.at-add').onclick = ()=>{
    const addBtn = b.querySelector('.addset');
    if(addBtn) addBtn.click();
    renderAT();
  };
  trainOv.querySelectorAll('.atset').forEach(el=>el.onclick = ()=>{
    // Auf einen erledigten Satz tippen macht ihn wieder offen
    const r = rows[+el.dataset.i];
    if(r && r.dataset.done==='1'){ delete r.dataset.done; renderAT(); }
  });
}

trainOv.querySelector('.atclose').onclick = closeAT;
trainOv.querySelector('.atprev').onclick = ()=>{ if(atEx>0){ atEx--; renderAT(); } };
trainOv.querySelector('.atnext').onclick = ()=>{ if(atEx < atBlocks().length-1){ atEx++; renderAT(); } };
trainOv.querySelector('.atsave').onclick = ()=>{
  if(saveBlocked()){ toast('Erst die Eingabe abschließen'); return; }
  closeAT(); const sb=$('#saveW'); if(sb) sb.click();
};
trainOv.querySelector('.atrest-skip').onclick = stopRest;
trainOv.querySelector('.atrest-plus').onclick = ()=>{ if(restEndAt){ restEndAt += 30000; beepDone=false; tickRest(); } };
trainOv.querySelector('.atrest-minus').onclick = ()=>{ if(restEndAt){ restEndAt -= 30000; tickRest(); } };

// Ab hier existiert trainOv — erst jetzt duerfen Timer und Leiste darauf zugreifen.
atReady = true;
setInterval(updateTimer, 1000); updateTimer();

function startRest(ex){
  beepArm();
  restEndAt = Date.now() + restTargetFor(ex)*1000;
  trainOv.querySelector('.atrest').style.display='block';
  tickRest();
  if(!restTickTimer) restTickTimer = setInterval(tickRest, 250);
}
function stopRest(){
  restEndAt = null; beepDone = true;
  if(restTickTimer){ clearInterval(restTickTimer); restTickTimer = null; }
  const el = trainOv.querySelector('.atrest'); if(el){ el.style.display='none'; el.classList.remove('over'); }
}
function tickRest(){
  const el = trainOv.querySelector('.atrest'); if(!el || !restEndAt) return;
  const ms = restEndAt - Date.now();
  const v = el.querySelector('.atrest-v');
  const s = Math.ceil(Math.abs(ms)/1000);
  v.textContent = (ms<0?'+':'') + Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
  if(ms <= 0){ el.classList.add('over'); beep(); }
  else el.classList.remove('over');
}

/* --- Einstieg --- */
// Beim Start zuerst den Trainingstag waehlen lassen — vorher landete man bei
// "Freies Training" sofort im Uebungspicker, ohne die Wahl gehabt zu haben.
function openStartPicker(){
  const ov=$('#startOv'); if(!ov) return;
  const tage=allDays();
  const list=$('#startList');
  list.innerHTML = tage.map((t,i)=>
      '<button class="pickitem" data-day="'+esc(t.day.id)+'"><div class="li-t">'+esc(t.day.name)+'</div>'
      + '<div class="li-s">'+esc(t.split.name)+' · '+((t.day.ex||[]).length)+' Übungen</div></button>').join('')
    + '<button class="pickitem" data-day="__free__"><div class="li-t">Freies Training</div>'
    + '<div class="li-s">Übungen einzeln hinzufügen</div></button>';
  list.querySelectorAll('[data-day]').forEach(b=>b.onclick=async()=>{
    ov.style.display='none';
    if(b.dataset.day==='__free__') await startFree();
    else await startWithDay(b.dataset.day);
  });
  ov.style.display='flex';
}
async function startWithDay(dayId){
  $('#daySel').value = dayId;
  if(typeof _daySelPrev!=='undefined') _daySelPrev = dayId;
  loadDay(); updateUnitPill();
  if(!atBlocks().length){ toast('Dieser Trainingstag hat noch keine Übungen'); return; }
  openAT();
}
async function startFree(){
  $('#daySel').value = '';
  if(typeof _daySelPrev!=='undefined') _daySelPrev = '';
  loadDay(); updateUnitPill();
  const n = await pickExercise();
  if(!n) return;
  ensureEx(n); addBlock(n, true); await Store.save(db);
  openAT();
}
async function startTraining(){
  const nb = $$('nav button').find(b=>b.dataset.v==='log');
  if(nb) nb.click();
  // Laeuft schon etwas, wird nicht gefragt, sondern fortgesetzt.
  if(atBlocks().length){ openAT(); return; }
  if(!allDays().length){ await startFree(); return; }
  openStartPicker();
}

/* --- Fortsetzen-Leiste: zeigt in allen anderen Reitern, dass noch eine
       Einheit offen ist, und bringt mit einem Tipp zurueck. Im Training-Tab
       ausgeblendet, weil dort schon der grosse Knopf steht. --- */
function sessionOpen(){
  return atAllRows().length > 0 && (atDoneCount() > 0 || unsavedSets() > 0);
}
function renderResumeBar(){
  if(!atReady) return;
  const bar=$('#resumeBar'); if(!bar) return;
  const imTraining = $('#v-log') && $('#v-log').classList.contains('on');
  const overlayOffen = trainOv && trainOv.style.display !== 'none';
  const zeigen = sessionOpen() && !imTraining && !overlayOffen;
  bar.style.display = zeigen ? 'flex' : 'none';
  if(!zeigen) return;
  bar.querySelector('.rb-t').textContent = 'Training läuft · ' + atDoneCount() + '/' + atAllRows().length + ' Sätze';
  const rb=bar.querySelector('.rb-r');
  if(restEndAt){
    const ms = restEndAt - Date.now();
    const sec = Math.ceil(Math.abs(ms)/1000);
    rb.textContent = (ms<0?'+':'') + Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');
    rb.style.display='inline';
    bar.classList.toggle('over', ms<=0);
  } else { rb.style.display='none'; bar.classList.remove('over'); }
}
function renderTrainProgress(){
  const gesamt = atAllRows().length, fertig = atDoneCount();
  const offen = unsavedSets() > 0 || fertig > 0;

  // Ein Knopf, eine Beschriftung, an beiden Stellen identisch. Der Zustand
  // steht drin, damit man nicht raten muss, ob noch eine Einheit offen ist.
  $$('.js-start').forEach(b=>{
    b.innerHTML = offen
      ? '▶ Training fortsetzen<span class="sb-s">' + fertig + ' von ' + gesamt + ' Sätzen</span>'
      : '▶ Training starten';
    b.classList.toggle('resume', offen);
  });

  renderResumeBar();
  const host = $('#unitProgress');
  if(!host) return;
  if(!gesamt){ host.style.display='none'; return; }
  host.style.display='block';
  host.innerHTML = '<div class="goal-bar"><i style="width:'+Math.round(fertig/gesamt*100)+'%"></i></div>'
    + '<div class="goal-sub" style="margin-top:6px">'+fertig+' von '+gesamt+' Sätzen erledigt</div>';
}

/* ---------------- Ziele ---------------- */
function goalBar(title, cur, target, subFn){
  const pct = target>0 ? Math.min(100, Math.round(cur/target*100)) : 0;
  const done = cur>=target && target>0;
  return `<div class="goal">
    <div class="goal-top"><div class="goal-t">${title}</div>
      <div class="goal-v"><b>${cur}</b> / ${target}${done?' ✓':''}</div></div>
    <div class="goal-bar"><i class="${done?'done':''}" style="width:${pct}%"></i></div>
    ${subFn?`<div class="goal-sub">${subFn}</div>`:''}
  </div>`;
}
function renderGoals(){
  const host = $('#goals');
  if(!host) return;
  const g = db.goals || DEFAULT_GOALS;
  const T = s => new Date(s+'T12:00:00').getTime();
  const _nd=new Date(); const _dow=(_nd.getDay()+6)%7;
  const _mon=new Date(_nd.getFullYear(),_nd.getMonth(),_nd.getDate()-_dow,0,0,0,0).getTime();
  const _sun=_mon+7*864e5;
  const inWeek = d => { const t=T(d); return t>=_mon && t<_sun; };
  // Einheiten (eindeutige Session-IDs mit Datum in den letzten 7 Tagen)
  const sessDates = {};
  for(const w of db.workouts){ if(inWeek(w.date)){ sessDates[w.sessionId||w.id] = true; } }
  const sessions = Object.keys(sessDates).length;
  // Sätze pro Muskelgruppe in den letzten 7 Tagen
  const byG = {};
  for(const w of db.workouts){ if(inWeek(w.date)){ const grp = muscleOf(w.exercise); byG[grp] = (byG[grp]||0) + workSets(w).length; } }
  let html = goalBar('Gym-Einheiten', sessions, g.sessions, sessions>=g.sessions?'Ziel erreicht — stark!':`Noch ${g.sessions-sessions} Einheit${g.sessions-sessions===1?'':'en'} diese Woche`);
  html += `<div class="pickgrp" style="padding:14px 0 8px">Sätze pro Muskelgruppe (Ziel ${g.setsPerMuscle})</div>`;
  const groups = GROUP_ORDER.filter(x=>byG[x]!=null || db.exercises.some(e=>muscleOf(e)===x));
  const shown = groups.filter(x=>byG[x]); // nur Gruppen mit Aktivität
  if(shown.length){
    for(const grp of GROUP_ORDER){ if(byG[grp]) html += goalBar(grp, byG[grp], g.setsPerMuscle); }
  } else {
    html += `<div class="emptybox"><div class="eb-t">Diese Woche noch nichts trainiert</div><div class="eb-s">Starte eine Einheit, dann fuellen sich die Balken hier.</div></div>`;
  }
  host.innerHTML = html;
}
const _goalEdit = $('#goalEdit');
if(_goalEdit) _goalEdit.onclick = async ()=>{
  const s = prompt('Ziel: Gym-Einheiten pro Woche', db.goals.sessions);
  if(s===null) return;
  const sn = parseInt(s,10);
  const m = prompt('Ziel: Sätze pro Muskelgruppe (7 Tage)', db.goals.setsPerMuscle);
  if(m===null) return;
  const mn = parseInt(m,10);
  if(isFinite(sn) && sn>0) db.goals.sessions = sn;
  if(isFinite(mn) && mn>0) db.goals.setsPerMuscle = mn;
  await Store.save(db); renderGoals(); toast('Ziele aktualisiert');
};

/* ---------------- Analyse ---------------- */
const W_MAXDOTS = 12;   // max. gezeichnete Punkte im Gewichts-Chart
function weightChart(pts, sel){
  pts = pts.filter(p=>p.y!=null).sort((a,b)=>a.x-b.x);
  if(!pts.length) return {svg:'<div class="emptybox"><div class="eb-t">Kein Gewicht im Zeitraum</div><div class="eb-s">Wiegen und unten auf der Koerper-Seite eintragen.</div></div>', pts:[], px:[], py:[]};
  const W=520, H=250, PL=8, PR=42, PT=48, PB=22;
  const xs=pts.map(p=>p.x), x0=Math.min(...xs), x1=Math.max(...xs), spanX=(x1-x0)||1;
  const ys=pts.map(p=>p.y); let lo=Math.min(...ys), hi=Math.max(...ys); const pad=(hi-lo)*0.25||0.5; lo-=pad; hi+=pad; const spanY=(hi-lo)||1;
  const X=x=> PL + (x-x0)/spanX*(W-PL-PR);
  const Y=y=> PT + (1-(y-lo)/spanY)*(H-PT-PB);
  let g='';
  for(let i=0;i<=3;i++){ const val=lo+spanY*i/3; const y=PT+(1-i/3)*(H-PT-PB); g+='<line x1="'+PL+'" y1="'+y.toFixed(1)+'" x2="'+(W-PR)+'" y2="'+y.toFixed(1)+'" stroke="var(--grid)" stroke-width="1"/>'; g+='<text x="'+(W-PR+6)+'" y="'+(y+3.5).toFixed(1)+'" font-family="var(--mono)" font-size="10" fill="var(--ink-30)">'+val.toFixed(1)+'</text>'; }
  const co=pts.map(p=>[X(p.x), Y(p.y)]);
  const line=smoothPath(co);
  const area=line+' L'+X(pts[pts.length-1].x).toFixed(1)+','+(H-PB).toFixed(1)+' L'+X(pts[0].x).toFixed(1)+','+(H-PB).toFixed(1)+' Z';
  g+='<path d="'+area+'" fill="var(--blue)" opacity="0.08"/>';
  g+='<path d="'+line+'" fill="none" stroke="var(--blue)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
  const iMin=ys.indexOf(Math.min(...ys)), iMax=ys.indexOf(Math.max(...ys));
  // Punkte ausdünnen: die Linie bleibt in voller Auflösung, aber es werden
  // höchstens W_MAXDOTS Kreise gezeichnet. Erster/letzter/Min/Max immer dabei.
  const dense = pts.length > W_MAXDOTS;
  let dotSet;
  if(!dense){ dotSet = null; }
  else {
    dotSet = new Set();
    const step = (pts.length-1)/(W_MAXDOTS-1);
    for(let k=0;k<W_MAXDOTS;k++) dotSet.add(Math.round(k*step));
    dotSet.add(0); dotSet.add(pts.length-1); dotSet.add(iMin); dotSet.add(iMax);
  }
  const rDot = dense ? 2.8 : 3.6;
  const labelSet=new Set(pts.length<=8?pts.map((_,i)=>i):[0,iMin,iMax,pts.length-1]);
  pts.forEach((p,i)=>{
    if(dotSet && !dotSet.has(i)) return;
    const cx=X(p.x).toFixed(1), cy=Y(p.y).toFixed(1);
    g+='<circle class="wpt" data-i="'+i+'" cx="'+cx+'" cy="'+cy+'" r="'+rDot+'" fill="var(--card)" stroke="var(--blue)" stroke-width="2"/>';
    if(labelSet.has(i)) g+='<text class="wlab" data-i="'+i+'" x="'+cx+'" y="'+(Y(p.y)-9).toFixed(1)+'" text-anchor="middle" font-family="var(--mono)" font-size="10.5" font-weight="600" fill="var(--blue)">'+p.y.toFixed(1)+'</text>';
  });
  g+='<g class="wcur"></g>';
  g+='<rect class="wgrab" x="0" y="0" width="'+W+'" height="'+H+'" fill="transparent"/>';
  g+='<text x="'+PL+'" y="'+(H-5)+'" font-family="var(--mono)" font-size="10" fill="var(--ink-30)">'+fmtDate(pts[0].date)+'</text>';
  if(pts.length>1) g+='<text x="'+(W-PR)+'" y="'+(H-5)+'" text-anchor="end" font-family="var(--mono)" font-size="10" fill="var(--ink-30)">'+fmtDate(pts[pts.length-1].date)+'</text>';
  return {
    svg:'<svg class="chart wchart" viewBox="0 0 '+W+' '+H+'" role="img">'+g+'</svg>',
    pts, W, H, PL, PR, PT, PB,
    px: pts.map(p=>X(p.x)),
    py: pts.map(p=>Y(p.y))
  };
}
// Cursor (Fadenkreuz + Blase) als eigenes Markup — wird beim Ziehen in-place
// ausgetauscht, statt das ganze SVG neu zu bauen.
function weightCursor(r, i){
  const p=r.pts[i]; if(!p) return '';
  const cx=r.px[i], cy=r.py[i];
  let s='<line x1="'+cx.toFixed(1)+'" y1="'+r.PT+'" x2="'+cx.toFixed(1)+'" y2="'+(r.H-r.PB).toFixed(1)+'" stroke="var(--ink-30)" stroke-width="1.5"/>';
  s+='<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="5.5" fill="var(--blue)" stroke="var(--card)" stroke-width="2.5"/>';
  const bw=124,bh=38; let bx=cx-bw/2; bx=Math.max(r.PL,Math.min(r.W-r.PR-bw,bx)); const by=4;
  s+='<rect x="'+bx.toFixed(1)+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="9" fill="var(--ink)"/>';
  s+='<text x="'+(bx+11).toFixed(1)+'" y="'+(by+17)+'" font-family="var(--mono)" font-size="14" font-weight="600" fill="var(--bg)">'+p.y.toFixed(1)+' kg</text>';
  s+='<text x="'+(bx+11).toFixed(1)+'" y="'+(by+31)+'" font-family="var(--mono)" font-size="10" fill="var(--ink-30)">'+fmtDate(p.date)+'</text>';
  return s;
}
function renderAnalysis(){
  renderGoals();
  renderAnPeriod();
  const T = s => new Date(s+'T12:00:00').getTime();
  const win = anWindow();
  const inWin = date => { const t=T(date); return (win.from==null||t>=win.from) && (win.to==null||t<=win.to); };
  const b = bodySorted().filter(x=>inWin(x.date));
  const donut=(segs)=>{ const R=46, C=2*Math.PI*R; let off=0, arcs=''; for(const sg of segs){ const len=C*(sg.v||0); arcs+='<circle cx="60" cy="60" r="'+R+'" fill="none" stroke="'+sg.color+'" stroke-width="16" stroke-dasharray="'+len+' '+(C-len)+'" stroke-dashoffset="'+(-off)+'" transform="rotate(-90 60 60)"/>'; off+=len; } return '<svg width="120" height="120" viewBox="0 0 120 120" style="flex:none"><circle cx="60" cy="60" r="'+R+'" fill="none" stroke="var(--grid)" stroke-width="16"/>'+arcs+'</svg>'; };

  const wpts = b.map(x=>({x:T(x.date),y:x.weight,date:x.date})).filter(p=>p.y!=null).sort((a,c)=>a.x-c.x);
  let _wsel = wpts.length-1;
  const _wselEl=$('#weightSel');
  const _drawW=()=>{
    const r = weightChart(wpts, _wsel);
    const host = $('#c-weight');
    host.innerHTML = r.svg;
    if(!r.pts.length){
      if(_wselEl) _wselEl.innerHTML = '<span class="wsel-hint">Noch kein Gewicht im Zeitraum</span>';
      return;
    }
    if(_wsel==null || _wsel<0 || _wsel>=r.pts.length) _wsel = r.pts.length-1;
    const svg = host.querySelector('svg');
    const curG = svg.querySelector('.wcur');
    const labs = svg.querySelectorAll('.wlab');
    const paint = ()=>{
      curG.innerHTML = weightCursor(r, _wsel);
      // Wert-Label am selektierten Punkt ausblenden, damit es nicht mit dem Cursor kollidiert
      labs.forEach(t=>{ t.style.display = (+t.dataset.i===_wsel) ? 'none' : ''; });
      if(_wselEl){
        const p = r.pts[_wsel];
        _wselEl.innerHTML = '<span class="wsel-w">'+p.y.toFixed(1)+' kg</span><span class="wsel-d">'+fmtDate(p.date)+'</span><span class="wsel-hint">ziehen</span>';
      }
    };
    // Ziehen: nächstgelegener Datenpunkt zur Finger-/Mausposition
    const nearest = clientX => {
      const bb = svg.getBoundingClientRect();
      if(!bb.width) return _wsel;
      const vx = (clientX - bb.left) / bb.width * r.W;
      let bi=0, bd=Infinity;
      for(let i=0;i<r.px.length;i++){ const d=Math.abs(r.px[i]-vx); if(d<bd){ bd=d; bi=i; } }
      return bi;
    };
    let dragging = false, captured = false;
    const seek = clientX => { const i = nearest(clientX); if(i!==_wsel){ _wsel = i; paint(); } };
    svg.addEventListener('pointerdown', e=>{
      dragging = true; captured = false;
      try{ svg.setPointerCapture(e.pointerId); captured = true; }catch(_){}
      seek(e.clientX);
    });
    svg.addEventListener('pointermove', e=>{
      if(!dragging) return;
      e.preventDefault();
      seek(e.clientX);
    });
    const end = e=>{
      if(!dragging) return;
      dragging = false;
      try{ svg.releasePointerCapture(e.pointerId); }catch(_){}
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    // Fallback nur ohne Pointer-Capture: sonst würde das Verlassen des Charts
    // den Drag abbrechen, obwohl der Finger noch unten ist.
    svg.addEventListener('pointerleave', e=>{ if(!captured) end(e); });
    paint();
  };
  _drawW();

  const recent = b.filter(x=>x.weight!=null);
  const slope = linSlope(recent.map(x=>({x:T(x.date)/864e5, y:x.weight})));
  const perWk = slope!=null ? slope*7 : null;
  const kcAll = b.map(x=>x.kcal).filter(v=>v!=null);
  const kcAvg = kcAll.length ? kcAll.reduce((a,c)=>a+c,0)/kcAll.length : null;
  const bal = perWk!=null ? perWk*7700/7 : null;
  const maint = (bal!=null && kcAvg!=null) ? kcAvg - bal : null;
  const prAll = b.map(x=>x.protein).filter(v=>v!=null);
  const lastW = b.filter(x=>x.weight!=null).slice(-1)[0];

  $('#bodyStats').innerHTML = `
    <div class="stat"><div class="k">Trend / Woche</div><div class="v">${perWk!=null?(perWk>0?'+':'')+round(perWk,2)+' kg':'—'}</div><div class="s">${recent.length} Messungen im Zeitraum</div></div>
    <div class="stat"><div class="k">ø Kalorien</div><div class="v">${kcAvg!=null?round(kcAvg,0):'—'}</div><div class="s">im Zeitraum</div></div>
    <div class="stat"><div class="k">Bilanz geschätzt</div><div class="v">${bal!=null?(bal>0?'+':'')+round(bal,0):'—'}</div><div class="s">kcal / Tag</div></div>
    <div class="stat"><div class="k">Erhaltungsbedarf</div><div class="v">${maint!=null?round(maint,0):'—'}</div><div class="s">aus Trend + kcal</div></div>`;

  // Insight Gewicht
  let iw='Zu wenig Gewichtsdaten im Zeitraum für einen Trend.';
  if(perWk!=null){
    const ph=(db.nutrition||{}).phase;
    let judge='';
    if(ph==='cut') judge = perWk<-0.1?' Passt zum Cut.':(perWk>0.05?' Im Cut solltest du eher abnehmen — Defizit prüfen.':' Im Cut kaum Bewegung, ggf. Defizit erhöhen.');
    else if(ph==='bulk') judge = perWk>0.1?' Sauberer Aufbau.':(perWk<-0.05?' Im Bulk nimmst du ab — iss mehr.':' Im Bulk kaum Zuwachs, ggf. Kalorien hoch.');
    else judge = Math.abs(perWk)<0.1?' Stabil — passt zu Maintain/Recomp.':'';
    iw='<b>'+(perWk>0?'+':'')+round(perWk,2)+' kg/Woche</b>.'+judge+(maint!=null?' Erhaltungsbedarf ~<b>'+round(maint,0)+' kcal</b>.':'');
  }
  $('#i-weight').innerHTML=iw;

  const ex = anExSel;
  const ws = db.workouts.filter(w=>w.exercise===ex && inWin(w.date)).sort((a,b)=>a.date<b.date?-1:1);
  const pts = ws.map(w=>({date:w.date, ...sessionStats(w)}));
  let best=0; const e1 = pts.map(p=>{ const pr = p.best>best; best=Math.max(best,p.best); return {x:T(p.date), y:p.best, pr}; });
  $('#c-str').innerHTML = chart([
    {pts:pts.map(p=>({x:T(p.date),y:p.vol})), color:'var(--mc)', axis:'r', type:'bar', op:.35},
    {pts:e1, color:'var(--ink)', w:2.2, dots:2, prs:true},
  ], {pr:34});

  const first = pts[0], lastP = pts[pts.length-1];
  const gain = (first&&lastP&&first.best) ? (lastP.best/first.best-1)*100 : null;
  const volFirst = pts.slice(0,3).reduce((a,p)=>a+p.vol,0)/Math.max(1,Math.min(3,pts.length));
  const volLast = pts.slice(-3).reduce((a,p)=>a+p.vol,0)/Math.max(1,Math.min(3,pts.length));
  $('#exStats').innerHTML = `
    <div class="stat"><div class="k">Bestes e1RM</div><div class="v">${pts.length?round(Math.max(...pts.map(p=>p.best)),1):'—'}</div><div class="s">kg (Epley)</div></div>
    <div class="stat"><div class="k">e1RM-Änderung</div><div class="v">${gain!=null?(gain>0?'+':'')+round(gain,1)+'%':'—'}</div><div class="s">seit Beginn</div></div>
    <div class="stat"><div class="k">Volumen ø</div><div class="v">${pts.length?round(volLast,0):'—'}</div><div class="s">${pts.length?'zuvor '+round(volFirst,0)+' kg':'kg / Einheit'}</div></div>
    <div class="stat"><div class="k">Einheiten</div><div class="v">${pts.length}</div><div class="s">${lastP?'zuletzt '+fmtDate(lastP.date):'—'}</div></div>`;
  $('#i-str').innerHTML = (gain!=null) ? '<b>'+esc(ex)+'</b>: e1RM '+(gain>0?'+':'')+round(gain,1)+'% seit Beginn über '+pts.length+' Einheiten.'+(gain>1?' Kraft steigt sauber.':gain<-1?' Rückläufig — Regeneration/Volumen prüfen.':' Weitgehend gehalten.') : 'Für diese Übung noch zu wenig Daten im Zeitraum.';

  const bwAt = d => {
    const cands = b.filter(x=>x.weight!=null).map(x=>({d:Math.abs(T(x.date)-T(d)), w:x.weight})).sort((p,q)=>p.d-q.d);
    return (cands[0] && cands[0].d<=5*864e5) ? cands[0].w : null;
  };
  const rel = pts.map(p=>({date:p.date, e:p.best, w:bwAt(p.date)})).filter(p=>p.w!=null);
  if(rel.length>=2){
    const e0=rel[0].e, w0=rel[0].w, r0=rel[0].e/rel[0].w;
    $('#c-rel').innerHTML = chart([
      {pts:rel.map(p=>({x:T(p.date),y:p.w/w0*100})), color:'var(--blue)', w:2},
      {pts:rel.map(p=>({x:T(p.date),y:p.e/e0*100})), color:'var(--ink)', w:2},
      {pts:rel.map(p=>({x:T(p.date),y:(p.e/p.w)/r0*100})), color:'var(--signal)', w:2.2, dash:true},
    ]);
    const L=rel[rel.length-1];
    const dW=(L.w/w0-1)*100, dE=(L.e/e0-1)*100, dR=((L.e/L.w)/r0-1)*100;
    $('#relStats').innerHTML = `
      <div class="stat"><div class="k">Körpergewicht</div><div class="v">${(dW>0?'+':'')+round(dW,1)}%</div><div class="s">${round(w0,1)} → ${round(L.w,1)} kg</div></div>
      <div class="stat"><div class="k">e1RM</div><div class="v">${(dE>0?'+':'')+round(dE,1)}%</div><div class="s">${round(e0,1)} → ${round(L.e,1)} kg</div></div>
      <div class="stat"><div class="k">Relative Kraft</div><div class="v" style="color:var(--signal)">${(dR>0?'+':'')+round(dR,1)}%</div><div class="s">e1RM / kg KG</div></div>
      <div class="stat"><div class="k">Lesart</div><div class="v" style="font-size:13px;font-family:var(--sans);font-weight:600">${dW<-0.5&&dE>=-1?'Recomp':dW<-0.5?'Diät, Kraft fällt':dW>0.5&&dE>1?'Aufbau läuft':dW>0.5?'Masse ohne Kraft':'Stabil'}</div><div class="s">${round((Date.now()-T(rel[0].date))/864e5,0)} Tage</div></div>`;
  } else {
    $('#c-rel').innerHTML = '<div class="emptybox"><div class="eb-t">Zu wenig Ueberschneidung</div><div class="eb-s">Fuer diesen Vergleich braucht es Gewicht und Training im selben Zeitraum.</div></div>';
    $('#relStats').innerHTML = '';
  }

  // Muskelgruppen-Balance
  const setsByG={};
  for(const w of db.workouts){ if(!inWin(w.date)) continue; const g=muscleOf(w.exercise); setsByG[g]=(setsByG[g]||0)+w.sets.length; }
  const gOrder=GROUP_ORDER.filter(g=>setsByG[g]);
  const maxSets=Math.max(1,...Object.values(setsByG));
  $('#muscleBal').innerHTML = gOrder.length ? gOrder.map(g=>{
    const v=setsByG[g], pct=Math.round(v/maxSets*100);
    return '<div class="mbar"><div class="mbar-top"><span>'+g+'</span><span class="mbar-v">'+v+' Sätze</span></div><div class="mbar-track"><i style="width:'+pct+'%"></i></div></div>';
  }).join('') : '<div class="emptybox"><div class="eb-t">Keine Saetze im Zeitraum</div><div class="eb-s">Waehle oben einen groesseren Zeitraum oder logge eine Einheit.</div></div>';

  // Wochenvolumen
  const byWeek = {};
  for(const w of db.workouts){
    if(!inWin(w.date)) continue;
    const d = new Date(T(w.date)); const day=(d.getDay()+6)%7;
    const mon = new Date(d.getTime()-day*864e5); const k = iso(mon);
    byWeek[k] = (byWeek[k]||0) + sessionStats(w).vol;
  }
  const wk = Object.keys(byWeek).sort();
  $('#c-vol').innerHTML = wk.length ? chart([{pts:wk.map(k=>({x:T(k),y:byWeek[k]})), color:'var(--mc)', type:'bar', op:.6}],{zero:true,h:150}) : '<div class="emptybox"><div class="eb-t">Noch keine Daten</div><div class="eb-s">Sobald Eintraege im gewaehlten Zeitraum liegen, erscheint hier ein Verlauf.</div></div>';

  // Konsistenz
  const sessDays={}; for(const w of db.workouts){ if(!inWin(w.date)) continue; sessDays[(w.sessionId||w.id)]=w.date; }
  const nSess=Object.keys(sessDays).length;
  const sessDates=[...new Set(Object.values(sessDays))].sort();
  const spanDays = sessDates.length? (T(sessDates[sessDates.length-1])-T(sessDates[0]))/864e5+1 : 0;
  const perWeek = spanDays>0? nSess/(spanDays/7) : (nSess?nSess:0);
  let maxGap=0; for(let i2=1;i2<sessDates.length;i2++){ const g=(T(sessDates[i2])-T(sessDates[i2-1]))/864e5; if(g>maxGap)maxGap=g; }
  const lastSess = sessDates.length? Math.round((Date.now()-T(sessDates[sessDates.length-1]))/864e5) : null;
  $('#consist').innerHTML = nSess ? `
    <div class="stat"><div class="k">Einheiten</div><div class="v">${nSess}</div><div class="s">im Zeitraum</div></div>
    <div class="stat"><div class="k">ø pro Woche</div><div class="v">${round(perWeek,1)}</div><div class="s">Einheiten</div></div>
    <div class="stat"><div class="k">Längste Pause</div><div class="v">${Math.round(maxGap)}</div><div class="s">Tage ohne Training</div></div>
    <div class="stat"><div class="k">Letzte Einheit</div><div class="v">${lastSess!=null?lastSess:'—'}</div><div class="s">Tage her</div></div>` : '<div class="emptybox"><div class="eb-t">Keine Einheiten im Zeitraum</div><div class="eb-s">Waehle oben einen groesseren Zeitraum.</div></div>';
  // Pausen ausweisen statt still in die Durchschnitte einrechnen
  {
    const ps=trainingPauses(win.from, win.to);
    const el=$('#consist');
    if(el && ps.length){
      const gesamt=ps.reduce((a,c)=>a+c.days,0);
      el.insertAdjacentHTML('beforeend',
        '<div class="aninsight" style="grid-column:1/-1;margin-top:12px">'
        + '<b>'+ps.length+' '+(ps.length===1?'Pause':'Pausen')+'</b> im Zeitraum, zusammen '+gesamt+' Tage. '
        + 'Der Wochenschnitt oben rechnet sie mit — ohne die Pausen liegt er höher.<br>'
        + ps.slice(-3).map(x=>'· '+fmtDate(x.from)+' → '+fmtDate(x.to)+' ('+x.days+' Tage'+(x.laufend?', läuft noch':'')+')').join('<br>')
        + '</div>');
    }
  }

  // ---- Umfänge ----
  {
    const rows=measSorted().filter(x=>inWin(x.date));
    const aktiv=MEAS_SITES.filter(m=>rows.some(r=>r.meas[m.k]!=null));
    const host=$('#c-meas'), leg=$('#measLegend'), st=$('#measStats');
    if(host){
      if(!rows.length){ host.innerHTML='<div class="emptybox"><div class="eb-t">Keine Umfaenge erfasst</div><div class="eb-s">Ganz unten auf der Koerper-Seite eintragen — der Bauchumfang allein reicht schon.</div></div>'; if(leg) leg.innerHTML=''; if(st) st.innerHTML=''; }
      else {
        host.innerHTML=chart(aktiv.map(m=>({
          pts: rows.filter(r=>r.meas[m.k]!=null).map(r=>({x:T(r.date), y:r.meas[m.k]})),
          color:m.color, w:2, smooth:true, dots:2.6
        })), {h:190});
        if(leg) leg.innerHTML=aktiv.map(m=>'<span><i style="background:'+m.color+'"></i>'+m.label+'</span>').join('');
        if(st) st.innerHTML=aktiv.map(m=>{
          const v=rows.filter(r=>r.meas[m.k]!=null);
          const a=v[0].meas[m.k], b=v[v.length-1].meas[m.k], dlt=b-a;
          return '<div class="stat"><div class="k">'+m.label+'</div><div class="v">'+dec1(b)+'</div>'
               + '<div class="s">'+(v.length>1?((dlt>0?'+':'')+round(dlt,1)+' cm im Zeitraum'):'ein Messpunkt')+'</div></div>';
        }).join('');
      }
    }
  }

  // ---- Wasser ----
  {
    const rows=b.filter(x=>x.water!=null);
    const host=$('#c-water'), st=$('#waterStats');
    if(host){
      if(!rows.length){ host.innerHTML='<div class="emptybox"><div class="eb-t">Kein Wasser erfasst</div><div class="eb-s">Auf der Koerper-Seite mit den Schnelltasten eintragen.</div></div>'; if(st) st.innerHTML=''; }
      else {
        host.innerHTML=chart([
          {pts:rows.map(x=>({x:T(x.date), y:x.water/1000})), color:'var(--blue)', type:'bar', op:.55},
          {pts:rows.map(x=>({x:T(x.date), y:waterTarget(x.date)/1000})), color:'var(--ink-30)', w:1.4, dash:true}
        ], {h:170, zero:true});
        const avg=rows.reduce((a,c)=>a+c.water,0)/rows.length;
        const erreicht=rows.filter(x=>x.water>=waterTarget(x.date)).length;
        if(st) st.innerHTML=
            '<div class="stat"><div class="k">ø pro Tag</div><div class="v">'+dec1(avg/1000)+'</div><div class="s">Liter</div></div>'
          + '<div class="stat"><div class="k">Ziel erreicht</div><div class="v">'+erreicht+'</div><div class="s">von '+rows.length+' Tagen</div></div>';
      }
    }
  }

  // PR-Log
  const wsorted=[...db.workouts].sort((a,b)=>a.date<b.date?-1:1);
  const bestBy={}; const prLog=[];
  for(const w of wsorted){ const sc=sessionStats(w).best; const prev=bestBy[w.exercise]||0; if(sc>prev+1e-9){ if(inWin(w.date)) prLog.push({date:w.date,ex:w.exercise,e:sc}); bestBy[w.exercise]=sc; } }
  prLog.sort((a,b)=>a.date<b.date?1:-1);
  $('#prlog').innerHTML = prLog.length ? prLog.slice(0,12).map(p=>`<li><div class="li-main"><div class="li-t">${esc(p.ex)}</div><div class="li-s">e1RM ${round(p.e,1)} kg</div></div><div class="li-d">${fmtDate(p.date)}</div></li>`).join('') : '<div class="emptybox"><div class="eb-t">Keine neuen Rekorde</div><div class="eb-s">Ein Rekord entsteht, wenn der e1RM einer Uebung den bisherigen Bestwert uebertrifft.</div></div>';

  // ---- Ernährung ----
  const kt = (calorieTarget().kcal) || db.goals.kcalTarget || null;
  const daysK = b.filter(x=>x.kcal!=null);
  // Abdeckungs-Check: macht sichtbar, ob der Chart kurz ist, weil der Zeitraum
  // kurz ist — oder weil vorher schlicht keine kcal erfasst wurden.
  {
    const el = $('#kcalCoverage');
    if(el){
      const allK = bodySorted().filter(x=>x.kcal!=null);
      if(!allK.length) el.textContent = 'Noch keine kcal erfasst.';
      else {
        const winDays = win.from!=null
          ? Math.round((( win.to!=null?win.to:Date.now()) - win.from)/864e5)
          : Math.round((T(b[b.length-1].date)-T(b[0].date))/864e5)+1;
        const covered = daysK.length;
        const first = allK[0].date, last = allK[allK.length-1].date;
        el.textContent = 'kcal erfasst seit ' + fmtDate(first) + ' (bis ' + fmtDate(last) + ') · '
          + covered + ' von ' + Math.max(covered, winDays) + ' Tagen im gewählten Zeitraum'
          + (covered < winDays ? ' — davor liegen keine Daten vor.' : '.');
      }
    }
  }
  $('#c-kcaltarget').innerHTML = daysK.length ? chart([
    {pts:daysK.map(x=>({x:T(x.date),y:x.kcal})), color:'var(--mf)', type:'bar', op:.5},
  ].concat(kt?[{pts:daysK.map(x=>({x:T(x.date),y:kt})), color:'var(--ink-30)', w:1.4, dash:true}]:[]), {zero:true}) : '<div class="emptybox"><div class="eb-t">Keine Kalorien erfasst</div><div class="eb-s">Trage Mahlzeiten ein oder importiere ein Food-Diary unter Einstellungen.</div></div>';
  let within=0, over=0, under=0, devSum=0;
  if(kt) for(const x of daysK){ const d=x.kcal-kt; devSum+=d; if(Math.abs(d)<=kt*0.07) within++; else if(d>0) over++; else under++; }
  const adh = (daysK.length&&kt) ? Math.round(within/daysK.length*100) : null;
  $('#i-kcal').innerHTML = (kt&&daysK.length) ? 'Du triffst dein Ziel (~<b>'+kt+' kcal</b>) an <b>'+adh+'%</b> der '+daysK.length+' erfassten Tage. ø <b>'+(devSum/daysK.length>=0?'+':'')+Math.round(devSum/daysK.length)+' kcal</b> '+(devSum>=0?'über':'unter')+' Ziel.' : 'Setz ein Kalorienziel (Phase/Manuell) und trag ein paar Tage ein.';
  $('#kcalStats').innerHTML = daysK.length ? `
    <div class="stat"><div class="k">Kalorienziel</div><div class="v">${kt||'—'}</div><div class="s">kcal/Tag</div></div>
    <div class="stat"><div class="k">Treffer ±7%</div><div class="v">${adh!=null?adh+'%':'—'}</div><div class="s">${within}/${daysK.length} Tage</div></div>
    <div class="stat"><div class="k">ø Abweichung</div><div class="v">${kt?((devSum/daysK.length>=0?'+':'')+Math.round(devSum/daysK.length)):'—'}</div><div class="s">kcal/Tag</div></div>
    <div class="stat"><div class="k">Über / Unter</div><div class="v" style="font-size:17px">${over} / ${under}</div><div class="s">Tage</div></div>` : '<div class="emptybox"><div class="eb-t">Keine Kalorien erfasst</div><div class="eb-s">Trage Mahlzeiten ein oder importiere ein Food-Diary unter Einstellungen.</div></div>';

  const avg=k=>{ const a=b.map(x=>x[k]).filter(v=>v!=null); return a.length?a.reduce((s,c)=>s+c,0)/a.length:0; };
  const ap=avg('protein'), af=avg('fat'), ac=avg('carbs');
  const kp=ap*4, kf=af*9, kc2=ac*4, ktot=(kp+kf+kc2)||1;
  if(ap||af||ac){
    $('#macroSplit').innerHTML='<div style="display:flex;align-items:center;gap:18px">'+donut([{v:kp/ktot,color:'var(--mp)'},{v:kf/ktot,color:'var(--mf)'},{v:kc2/ktot,color:'var(--mc)'}])
      +'<div class="macrolegend">'
      +'<div class="ml"><i style="background:var(--mp)"></i><b>'+round(ap,0)+' g</b> Protein<span>'+Math.round(kp/ktot*100)+'%</span></div>'
      +'<div class="ml"><i style="background:var(--mf)"></i><b>'+round(af,0)+' g</b> Fett<span>'+Math.round(kf/ktot*100)+'%</span></div>'
      +'<div class="ml"><i style="background:var(--mc)"></i><b>'+round(ac,0)+' g</b> KH<span>'+Math.round(kc2/ktot*100)+'%</span></div>'
      +'</div></div><p class="hint" style="margin:12px 0 0">ø pro erfasstem Tag · ~'+round(ktot,0)+' kcal aus Makros</p>';
  } else $('#macroSplit').innerHTML='<div class="emptybox"><div class="eb-t">Keine Makros erfasst</div><div class="eb-s">Makros entstehen automatisch, sobald du Produkte statt nur Kalorien eintraegst.</div></div>';

  const st7 = sma(b,'steps',anAvg);
  const stepsArr=b.map(x=>x.steps).filter(v=>v!=null);
  const stepAvg=stepsArr.length?stepsArr.reduce((a,c)=>a+c,0)/stepsArr.length:null;
  $('#c-steps').innerHTML = stepsArr.length ? chart([
    {pts:b.map(x=>({x:T(x.date),y:x.steps!=null?x.steps:null})).filter(p=>p.y!=null), color:'var(--fiber)', type:'bar', op:.4},
    {pts:b.map((x,i)=>({x:T(x.date),y:st7[i]})).filter(p=>p.y!=null), color:'var(--fiber)', w:2},
  ], {zero:true}) : '<div class="emptybox"><div class="eb-t">Keine Schritte erfasst</div><div class="eb-s">Schritte werden unten auf der Koerper-Seite eingetragen.</div></div>';
  const pPerKg = (ap&&lastW)? ap/lastW.weight : null;
  $('#stepStats').innerHTML = `
    <div class="stat"><div class="k">ø Schritte</div><div class="v">${stepAvg!=null?round(stepAvg,0):'—'}</div><div class="s">${stepsArr.length} Tage</div></div>
    <div class="stat"><div class="k">Protein / kg</div><div class="v">${pPerKg!=null?round(pPerKg,2):'—'}</div><div class="s">g/kg Körpergewicht</div></div>`;
}
let anPeriod='all', anAvg=7;
const AN_PERIODS=[['7','7 Tage'],['30','30 Tage'],['90','3 Monate'],['365','1 Jahr'],['all','Alles']];
function anWindow(){
  const now=Date.now();
  if(anPeriod==='custom'){
    const f=$('#anFrom').value, t=$('#anTo').value;
    return {from: f?new Date(f+'T00:00:00').getTime():null, to: t?new Date(t+'T23:59:59').getTime():null};
  }
  if(anPeriod==='all') return {from:null, to:null};
  return {from: now-parseInt(anPeriod,10)*864e5, to:null};
}
function renderAnPeriod(){
  const hosts=$$('.anperiod'); if(!hosts.length) return;
  hosts.forEach(host=>{
    host.innerHTML=AN_PERIODS.map(([v,l])=>`<button class="chip${v===anPeriod?' on':''}" data-p="${v}">${l}</button>`).join('');
    host.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ anPeriod=b.dataset.p; renderAnPeriod(); renderAnalysis(); });
  });
}
const _anAvg=$('#anAvg');
if(_anAvg) _anAvg.oninput=()=>{ const v=parseInt(_anAvg.value,10); if(isFinite(v)&&v>=1&&v<=90){ anAvg=v; renderAnalysis(); } };
['#anFrom','#anTo'].forEach(s=>{ const el=$(s); if(el) el.onchange=()=>{ if(anPeriod==='custom') renderAnalysis(); }; });

/* ---------------- Übungskatalog ---------------- */
function renderExList(){
  const byG = {};
  for(const e of db.exercises) (byG[muscleOf(e)] = byG[muscleOf(e)]||[]).push(e);
  let html = '';
  for(const g of GROUP_ORDER){
    if(!byG[g]) continue;
    const open=openExGroups.has(g);
    html += '<li class="exgrp-head"><button class="exgrp-toggle" data-exg="'+esc(g)+'"><span class="chev">'+(open?'▾':'▸')+'</span>'+g+'<span class="exgrp-n">'+byG[g].length+'</span></button></li>';
    if(open){
      html += byG[g].map(e=>{
        const n = db.workouts.filter(w=>w.exercise===e).length;
        return '<li class="exsub"><div class="li-main"><div class="li-t">'+esc(e)+'</div><div class="li-s">'+n+' Einheiten</div></div>'
          +'<div class="li-d"><button class="exmenu" data-exmenu="'+esc(e)+'" aria-label="Übung bearbeiten">⋯</button></div></li>';
      }).join('');
    }
  }
  $('#exlist').innerHTML = html;
  $$('#exlist [data-exg]').forEach(b=>b.onclick=()=>{ const g=b.dataset.exg; if(openExGroups.has(g)) openExGroups.delete(g); else openExGroups.add(g); renderExList(); });
  $$('#exlist [data-exmenu]').forEach(b=>b.onclick=()=>openExEdit(b.dataset.exmenu));
}

function renderDataStats(){
  const host=$('#dataTiles'); if(!host) return;
  const ss={}; for(const w of db.workouts) ss[w.sessionId||w.id]=1;
  const sessions=Object.keys(ss).length;
  const measures=db.body.filter(x=>x.weight!=null).length;
  const entries=db.body.reduce((a,x)=>a+((x.meals&&x.meals.length)||0),0);
  const tile=(v,l)=>'<div><b>'+de(v)+'</b><span>'+l+'</span></div>';
  const umf=db.body.filter(x=>x.meas && Object.keys(x.meas).length).length;
  host.innerHTML=tile(sessions,'Einheiten')+tile(measures,'Messungen')+tile(db.exercises.length,'Übungen')+tile(entries,'Einträge')+tile(umf,'Umfänge');
  const dates=[...db.workouts.map(w=>w.date), ...db.body.map(b=>b.date)].filter(Boolean).sort();
  const since=$('#dataSince');
  if(since) since.textContent = dates.length ? 'seit '+dates[0].slice(5,7)+'/'+dates[0].slice(2,4) : '';
  // Alles liegt nur lokal auf diesem Geraet. Wer nie exportiert, verliert bei
  // Cache-Leerung oder Geraetewechsel alles — deshalb hier sichtbar erinnern.
  const warn=$('#backupWarn');
  if(warn){
    const hatDaten = (db.workouts.length + db.body.length) > 0;
    const tage = db.lastExport ? Math.round((new Date(TODAY+'T12:00:00') - new Date(db.lastExport+'T12:00:00'))/864e5) : null;
    if(!hatDaten){ warn.style.display='none'; }
    else if(tage==null){ warn.style.display='block'; warn.className='hint warnbox'; warn.textContent='Noch nie ein Backup exportiert. Alle Daten liegen nur in diesem Browser.'; }
    else if(tage>=30){ warn.style.display='block'; warn.className='hint warnbox'; warn.textContent='Letztes Backup vor '+tage+' Tagen. Zeit für ein neues.'; }
    else { warn.style.display='block'; warn.className='hint'; warn.textContent='Letztes Backup: '+fmtDate(db.lastExport)+' (vor '+tage+' '+(tage===1?'Tag':'Tagen')+')'; }
  }
}
{ $$('#v-data [data-pick]').forEach(b=>b.onclick=()=>{ const f=$('#'+b.dataset.pick); if(f) f.click(); }); }

/* ---------------- CSV / Sicherung ---------------- */
let csv = null;
function parseCSV(text){
  const sep = (text.split('\n')[0].match(/;/g)||[]).length > (text.split('\n')[0].match(/,/g)||[]).length ? ';' : ',';
  const rows = text.trim().split(/\r?\n/).map(line=>{
    const out=[]; let cur='', q=false;
    for(let i=0;i<line.length;i++){
      const c=line[i];
      if(c==='"'){ if(q && line[i+1]==='"'){cur+='"';i++;} else q=!q; }
      else if(c===sep && !q){ out.push(cur); cur=''; }
      else cur+=c;
    }
    out.push(cur);
    return out.map(s=>s.trim());
  }).filter(r=>r.some(c=>c!==''));
  return {head:rows[0], body:rows.slice(1)};
}
function guess(head, words, exclude=[]){
  return head.findIndex(h=>{
    const l = h.toLowerCase();
    return words.some(w=>l.includes(w)) && !exclude.some(w=>l.includes(w));
  });
}
function parseDate(s){
  s = s.trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})/); if(m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  m = s.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{2})(?!\d)/); if(m) return `20${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  const d = new Date(s); return isNaN(d) ? null : iso(d);
}
let _xlsxP = null;
function loadXLSX(){
  if(window.XLSX) return Promise.resolve(window.XLSX);
  if(_xlsxP) return _xlsxP;
  _xlsxP = new Promise((res,rej)=>{
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = ()=>res(window.XLSX); s.onerror = ()=>rej(new Error('SheetJS konnte nicht geladen werden'));
    document.head.appendChild(s);
  });
  return _xlsxP;
}
async function fileLines(f){
  if(/\.xlsx?$/i.test(f.name)){
    const XLSX = await loadXLSX();
    const wb = XLSX.read(await f.arrayBuffer(), {type:'array'});
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, {header:1, blankrows:true});
    return rows.map(r=> (r && r.length) ? r.map(c=>c==null?'':String(c)).join(',') : '');
  }
  const buf = await f.arrayBuffer();
  let text = new TextDecoder('utf-8').decode(buf);
  if(text.indexOf('�')>=0){ try{ text = new TextDecoder('windows-1252').decode(buf); }catch(e){} }
  if(text.charCodeAt(0)===0xFEFF) text = text.slice(1);
  return text.split(/\r?\n/);
}
function csvSplit(line){
  const out=[]; let cur='', q=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(c==='"'){ if(q && line[i+1]==='"'){cur+='"';i++;} else q=!q; }
    else if(c===',' && !q){ out.push(cur); cur=''; }
    else cur+=c;
  }
  out.push(cur); return out;
}
const _WD = ['montag','dienstag','mittwoch','donnerstag','freitag','samstag','sonntag',
            'monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const _MON = {januar:1,februar:2,'märz':3,'maerz':3,april:4,mai:5,juni:6,juli:7,august:8,september:9,oktober:10,november:11,dezember:12,
              january:1,february:2,march:3,may:5,june:6,july:7,october:10,december:12};
const _MON_RE = /(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})\s*,?\s*(\d{4})/i;
function _fold(s){ return s.toLowerCase().replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss').replace(/[^a-z]/g,''); }
const _MEAL_EXACT = {fruhstuck:'Frühstück',breakfast:'Frühstück',mittagessen:'Mittagessen',lunch:'Mittagessen',abendessen:'Abendessen',dinner:'Abendessen',supper:'Abendessen',snacks:'Snack',snackssonstiges:'Snack',snack:'Snack',snackssonstige:'Snack'};
function mealName(first){ return _MEAL_EXACT[_fold(first)] || null; }
function leadSpaces(raw){ const m=raw.match(/^[ \t]*/); return m?m[0].length:0; }
function parseFoodDiary(lines){
  let details=false, curDate=null, curMeal=null; const days={};
  for(const raw of lines){
    if(/^\s*Datum\s*,\s*Kal/i.test(raw)){ details=true; continue; }
    if(!details) continue;
    if(!raw.trim() || /^#/.test(raw.trim())) continue;
    const t = csvSplit(raw);
    const first = (t[0]||'').trim();
    const indent = leadSpaces(raw);
    const firstWord = _fold(first.split(/[,\s]/)[0]);
    const mname = mealName(first);
    // Tageszeile: Wochentag am Anfang + Jahr (Datum in einer Zelle oder über 3 Spalten)
    if(_WD.includes(firstWord) && !mname){
      const dateStr = /\d{4}/.test(first) ? first : [t[0],t[1],t[2]].join(',');
      const m = dateStr.match(_MON_RE);
      if(m){
        const mn=_MON[m[1].toLowerCase()], day=parseInt(m[2],10), year=m[3];
        if(mn){ curDate=`${year}-${String(mn).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          days[curDate]=days[curDate]||{meals:[]}; curMeal=null; }
        else { curDate=null; curMeal=null; }
      } else { curDate=null; curMeal=null; }
      continue;
    }
    if(!curDate) continue;
    // Mahlzeit: erkannter Name ODER genau 1 Ebene eingerückt (Einrückung sprach-/kodierungsunabhängig)
    if(mname || (indent===1 && t.length>1)){
      curMeal={name:mname||first, kcal:num(t[1])||0, protein:num(t[7])||0, items:[]};
      days[curDate].meals.push(curMeal);
      continue;
    }
    // Lebensmittel-Zeile (mehrere Spalten) → als Item; Mengenzeile (1 Spalte) überspringen
    if(curMeal && t.length>1 && first) curMeal.items.push(first);
  }
  return days;
}
function importFoodDiary(days){
  let dn=0, mn=0;
  for(const date in days){
    const meals=days[date].meals; if(!meals.length) continue;
    let e=db.body.find(x=>x.date===date); if(!e){ e={date}; db.body.push(e); }
    e.meals=e.meals||[];
    let added=false;
    for(const m of meals){
      const text=m.items.slice(0,8).join(', ');
      if(e.meals.some(x=>x.name===m.name && Math.round(x.kcal)===Math.round(m.kcal) && (x.text||'')===text)) continue;
      e.kcal=Math.round((e.kcal||0)+m.kcal);
      if(m.protein) e.protein=Math.round((e.protein||0)+m.protein);
      e.meals.push({id:uid(), name:m.name, text, kcal:Math.round(m.kcal), protein:Math.round(m.protein||0)});
      mn++; added=true;
    }
    if(added) dn++;
  }
  return {days:dn, meals:mn};
}
let foodDiary=null;
$('#csvFile').onchange = async e=>{
  const f = e.target.files[0]; if(!f) return;
  $('#csvInfo').textContent='Lese Datei…';
  let lines;
  try{ lines = await fileLines(f); }
  catch(err){ $('#csvInfo').textContent='Datei nicht lesbar: '+err.message; return; }
  if(/Food Diary Report/i.test(lines.slice(0,60).join('\n')) || lines.some(l=>/^\s*Datum\s*,\s*Kal/i.test(l))){
    foodDiary = parseFoodDiary(lines);
    const nd=Object.keys(foodDiary).length;
    const nm=Object.values(foodDiary).reduce((a,d)=>a+d.meals.length,0);
    $('#csvMap').style.display='none';
    if(!nm){ $('#csvInfo').textContent='Food-Diary erkannt, aber keine Mahlzeiten gefunden.'; return; }
    $('#csvInfo').innerHTML=`Food-Diary-Export erkannt: <b>${nd} Tage</b>, <b>${nm} Mahlzeiten</b>. Kalorien &amp; Protein werden pro Mahlzeit in den Körper-Tab übernommen.<button class="ghost tiny" id="fdGo" style="width:100%;margin-top:10px">Mahlzeiten importieren</button>`;
    $('#fdGo').onclick=async()=>{
      const r=importFoodDiary(foodDiary);
      await Store.save(db); renderAll();
      $('#csvInfo').textContent=`${r.days} Tage · ${r.meals} Mahlzeiten importiert.`;
      toast(r.meals+' Mahlzeiten importiert');
    };
    return;
  }
  csv = parseCSV(lines.join('\n'));
  const opts = ['<option value="-1">— keine —</option>', ...csv.head.map((h,i)=>`<option value="${i}">${esc(h)||'Spalte '+(i+1)}</option>`)].join('');
  ['#mapDate','#mapW','#mapK','#mapP'].forEach(s=>$(s).innerHTML=opts);
  $('#mapDate').value = guess(csv.head,['time','date','datum','zeit','messung'],['zeitraum']);
  $('#mapW').value    = guess(csv.head,['weight','gewicht','kg','masse'],['fettfrei','optimal','knochen','muskel','ziel','bmi']);
  $('#mapK').value    = guess(csv.head,['calorie','kcal','kalorien','energy'],['grundumsatz','umsatz','bmr']);
  $('#mapP').value    = guess(csv.head,['protein','eiweiß','eiweiss'],['%']);
  $('#csvMap').style.display='block';
  const isRenpho = csv.head.join(' ').toLowerCase().includes('grundumsatz');
  $('#csvInfo').textContent = `${csv.body.length} Zeilen gelesen.` + (isRenpho ? ' Renpho-Export erkannt — Datum und Gewicht sind vorausgewählt (Grundumsatz/Eiweiß % werden bewusst nicht als kcal/Protein importiert).' : ' Spalten prüfen und importieren.');
};
$('#csvGo').onclick = async ()=>{
  const di=+$('#mapDate').value, wi=+$('#mapW').value, ki=+$('#mapK').value, pi=+$('#mapP').value;
  if(di<0) return toast('Datumsspalte wählen');
  let n=0;
  for(const r of csv.body){
    const d = parseDate(r[di]||''); if(!d) continue;
    const patch = {};
    if(wi>=0 && num(r[wi])!=null) patch.weight = num(r[wi]);
    if(ki>=0 && num(r[ki])!=null) patch.kcal = num(r[ki]);
    if(pi>=0 && num(r[pi])!=null) patch.protein = num(r[pi]);
    if(!Object.keys(patch).length) continue;
    let e = db.body.find(x=>x.date===d);
    if(!e){ e={date:d}; db.body.push(e); }
    Object.assign(e, patch); n++;
  }
  await Store.save(db); renderAll();
  $('#csvInfo').textContent = `${n} Tage importiert.`;
  toast(n+' Tage importiert');
};

function dl(name, text, type='application/json'){
  const b = new Blob([text],{type}); const u = URL.createObjectURL(b);
  const a = document.createElement('a'); a.href=u; a.download=name; a.click(); URL.revokeObjectURL(u);
}
$('#expJson').onclick = async ()=>{
  dl(`logbuch-${TODAY}.json`, JSON.stringify(db,null,1));
  db.lastExport = TODAY;                 // fuer die Erinnerung auf der Daten-Seite
  await Store.save(db); renderDataStats();
};
$('#impJsonBtn').onclick = ()=>$('#impJson').click();
$('#impJson').onchange = async e=>{
  const f=e.target.files[0]; if(!f) return;
  try{
    const d = JSON.parse(await f.text());
    if(!Array.isArray(d.workouts) || !Array.isArray(d.body)) throw 0;
    // Ueberschreiben ist nicht rueckgaengig zu machen: erst zeigen, was drin ist
    // und was ersetzt wird, dann den aktuellen Stand sicherheitshalber exportieren.
    const hab = db.workouts.length + db.body.length;
    if(hab > 0){
      const txt = 'Backup einspielen?\n\n'
        + 'Datei enthaelt: ' + d.workouts.length + ' Trainings-, ' + d.body.length + ' Koerpereintraege\n'
        + 'Wird ersetzt: ' + db.workouts.length + ' Trainings-, ' + db.body.length + ' Koerpereintraege\n\n'
        + 'Der aktuelle Stand wird vorher als Datei gesichert.';
      if(!confirm(txt)){ e.target.value=''; return; }
      dl(`logbuch-vor-import-${TODAY}.json`, JSON.stringify(db,null,1));
    }
    db = {exercises:d.exercises?.length?d.exercises:[...DEFAULT_EX], workouts:d.workouts, body:d.body, splits:d.splits||[], exGroups:d.exGroups||{}, exNotes:d.exNotes||{}, customBarcodes:d.customBarcodes||{}, sex:d.sex||'m', age:d.age||null, height:d.height||null, heat:d.heat||{}, exRest:d.exRest||{}, savedMeals:d.savedMeals||[], lastExport:d.lastExport||db.lastExport||null, mealTypes:d.mealTypes?.length?d.mealTypes:[...DEFAULT_MEALS], goals:{...DEFAULT_GOALS, ...(d.goals||{})}, foodFav:d.foodFav||[], nutrition:{...DEFAULT_NUTRITION, ...(d.nutrition||{})}, ui:{theme:'auto', ...(d.ui||{})}};
    await Store.save(db); renderAll(); toast('Backup eingespielt'); e.target.value='';
  }catch(err){ toast('Datei nicht lesbar'); }
};
$('#expCsv').onclick = ()=>{
  // Enthaelt jetzt auch Fett, Kohlenhydrate, Salz, Ballaststoffe, Schritte und
  // die einzelnen Mahlzeiten — vorher fehlte gut die Haelfte der erfassten Daten.
  const c = v => v==null ? '' : String(v).replace(/;/g,',').replace(/[\r\n]+/g,' ');
  const MS = MEAS_SITES.map(m=>m.k);
  const a = ['datum;typ;tag;bezeichnung;saetze;volumen_kg;e1rm_kg;gewicht_kg;schritte;kcal;protein_g;fett_g;kh_g;salz_g;ballast_g;menge_g;wasser_ml;rir;aufwaermsaetze;'
           + MS.map(k=>'umfang_'+k+'_cm').join(';') + ';notiz'];
  for(const w of [...db.workouts].sort((x,y)=>x.date<y.date?-1:1)){
    const st = sessionStats(w);
    const rirs = w.sets.filter(x=>x.rir!=null).map(x=>x.rir);
    a.push([w.date,'training',w.day||'',c(w.exercise),
            w.sets.map(x=>(x.warm?'W':'')+x.w+'x'+x.r+(x.rir!=null?'@'+x.rir:'')).join(' '),
            round(st.vol,0),round(st.best,1),'','','','','','','','','','',
            rirs.length?round(rirs.reduce((p,q)=>p+q,0)/rirs.length,1):'',
            w.sets.filter(x=>x.warm).length,
            ...MS.map(()=>''), c(w.note)].join(';'));
  }
  for(const b of bodySorted()){
    a.push([b.date,'koerper','','','','','',b.weight??'',b.steps??'',b.kcal??'',b.protein??'',
            b.fat??'',b.carbs??'','','','',b.water??'','','',
            ...MS.map(k=>(b.meas&&b.meas[k]!=null)?b.meas[k]:''), c(b.note)].join(';'));
    for(const m of (b.meals||[])){
      a.push([b.date,'mahlzeit',c(m.name),c(m.pname||m.text),'','','','','',m.kcal??'',m.protein??'',
              m.fat??'',m.carbs??'',m.salt??'',m.fiber??'',m.g??'','','','',
              ...MS.map(()=>''), ''].join(';'));
    }
  }
  dl(`logbuch-${TODAY}.csv`, a.join('\n'), 'text/csv');
};
$('#wipe').onclick = async ()=>{
  if(!confirm('Alle Trainings-, Plan- und Körperdaten unwiderruflich löschen?')) return;
  db = freshDb();
  await Store.save(db); renderAll(); toast('Zurückgesetzt');
};

/* ---------------- Kalender ---------------- */
let calYM = (()=>{ const d=new Date(); return {y:d.getFullYear(), m:d.getMonth()}; })();
let calSel = TODAY;
let blistLimit = 5;

/* ---- Kalender-Overlay (öffnet über das Datum oben rechts) ---- */
const calOv=document.createElement('div'); calOv.className='pickov calov'; calOv.style.display='none';
calOv.innerHTML=`<div class="picksheet">
  <div class="cal-head">
    <button class="ghost tiny" id="calPrev" aria-label="Voriger Monat">←</button>
    <div class="t" id="calTitle"></div>
    <button class="ghost tiny" id="calNext" aria-label="Nächster Monat">→</button>
  </div>
  <div class="cal-grid" id="calGrid"></div>
  <div class="legend">
    <span><i style="background:var(--blue);width:6px;height:6px;border-radius:50%"></i>Training</span>
    <span><i style="background:var(--signal);width:6px;height:6px;border-radius:50%"></i>Gewicht</span>
    <span><i style="background:var(--teal);width:6px;height:6px;border-radius:50%"></i>Essen</span>
  </div>
  <div style="border-top:1px solid var(--grid);margin-top:12px;padding-top:12px">
    <div class="cal-sec-t" id="calDayTitle"></div>
    <div id="calDayBody"></div>
  </div>
  <button class="link calclose" style="margin-top:12px;text-align:center;width:100%">Schließen</button>
</div>`;
root.appendChild(calOv);
calOv.querySelector('.calclose').onclick=()=>{ calOv.style.display='none'; };
calOv.addEventListener('click',e=>{ if(e.target===calOv) calOv.style.display='none'; });
function openCal(){ const d=new Date(calSel+'T12:00:00'); calYM={y:d.getFullYear(),m:d.getMonth()}; calOv.style.display='flex'; renderCal(); }

/* ---- Header-Controls & Verlauf-Toggle ---- */
const _today=$('#today'); if(_today) _today.onclick=openCal;
const _phaseSeg=$('#phaseSeg');
function updatePhaseSeg(ph){ if(_phaseSeg) _phaseSeg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.phase===ph))); }
if(_phaseSeg) _phaseSeg.querySelectorAll('button').forEach(b=>b.onclick=async()=>{ db.nutrition.phase=b.dataset.phase; await Store.save(db); renderNutri(); renderGoals(); toast('Phase: '+b.textContent); });
function openGoalSheet(){ const ov=$('#goalOv'); if(!ov) return; renderNutri(); ov.style.display='flex'; }
function closeGoalSheet(){ const ov=$('#goalOv'); if(ov) ov.style.display='none'; }
{ const gc=$('#goalClose'); if(gc) gc.onclick=closeGoalSheet; }
{ const ov=$('#goalOv'); if(ov) ov.onclick=(e)=>{ if(e.target===ov) closeGoalSheet(); }; }
const _nutriEdit=$('#nutriEdit');
if(_nutriEdit) _nutriEdit.onclick=async()=>{
  const g=db.goals||{};
  const cur = g.proteinPerKg!=null ? (String(g.proteinPerKg).replace('.',',')+'/kg') : (g.proteinTarget||'');
  const p=prompt('Protein-Ziel\n\nEntweder feste Gramm pro Tag (z. B. 165)\noder pro Kilo Koerpergewicht (z. B. 2,0/kg) —\ndas wandert beim Ab- oder Zunehmen automatisch mit.', cur);
  if(p===null) return;
  const t=String(p).trim().toLowerCase().replace(',','.');
  if(/kg\s*$/.test(t)){
    const v=parseFloat(t);
    if(isFinite(v)&&v>0&&v<=5){ db.goals.proteinPerKg=v; }
    else { toast('Wert zwischen 0 und 5 g/kg angeben'); return; }
  } else {
    const pn=parseInt(t,10);
    if(!(isFinite(pn)&&pn>=0)){ toast('Zahl angeben'); return; }
    db.goals.proteinTarget=pn; db.goals.proteinPerKg=null;
  }
  await Store.save(db); renderAll(); toast('Protein-Ziel: '+proteinTargetG()+' g');
};
{ const _dn=$('#dayNote');
  if(_dn) _dn.addEventListener('change', async()=>{
    const d=$('#bdate').value||TODAY;
    const v=_dn.value.trim();
    if(v){ dayEntry(d,true).note=v; }
    else { const e=dayEntry(d); if(e) delete e.note; }
    await Store.save(db); renderDayNote();
    toast(v?'Notiz gespeichert':'Notiz gelöscht');
  });
}
{ const cb=$('#copyDayBtn'); if(cb) cb.onclick=openCopyDay;
  const co=$('#copyOv');
  if(co){
    co.querySelector('.copyClose').onclick=()=>{ co.style.display='none'; };
    co.addEventListener('click', e=>{ if(e.target===co) co.style.display='none'; });
  }
}
{ const _mo=$('#measOv');
  if(_mo){
    _mo.querySelector('.measClose').onclick=()=>{ _mo.style.display='none'; };
    _mo.addEventListener('click', e=>{ if(e.target===_mo) _mo.style.display='none'; });
  }
}
const _blistMore=$('#blistMore'); if(_blistMore) _blistMore.onclick=()=>{ blistLimit = blistLimit>=10 ? 5 : 10; renderBody(); };

function calData(){
  const map = {};
  for(const w of db.workouts){
    const e = map[w.date] = map[w.date]||{};
    e.t = true; (e.ws = e.ws||[]).push(w);
  }
  for(const b of db.body){
    const e = map[b.date] = map[b.date]||{};
    if(b.weight!=null) e.w = true;
    if(b.kcal!=null || b.protein!=null) e.k = true;
    e.body = b;
  }
  return map;
}
function renderCal(){
  const {y,m} = calYM;
  $('#calTitle').textContent = new Date(y,m,1).toLocaleDateString('de-DE',{month:'long',year:'numeric'});
  const map = calData();
  const start = (new Date(y,m,1).getDay()+6)%7;
  const dim = new Date(y,m+1,0).getDate();
  let html = ['Mo','Di','Mi','Do','Fr','Sa','So'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  for(let i=0;i<start;i++) html += '<div></div>';
  for(let d=1;d<=dim;d++){
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const e = map[ds]||{};
    html += `<button class="cal-day${ds===TODAY?' today':''}${ds===calSel?' sel':''}" data-d="${ds}">${d}<span class="cal-dots">${e.t?'<i style="background:var(--blue)"></i>':''}${e.w?'<i style="background:var(--signal)"></i>':''}${e.k?'<i style="background:var(--teal)"></i>':''}</span></button>`;
  }
  $('#calGrid').innerHTML = html;
  $$('#calGrid .cal-day').forEach(b=>b.onclick = ()=>{ calSel = b.dataset.d; renderCal(); });
  renderCalDay(map);
}
function renderCalDay(map){
  map = map || calData();
  const e = map[calSel]||{};
  $('#calDayTitle').textContent = new Date(calSel+'T12:00:00').toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'});
  let html = '';
  if(e.ws && e.ws.length){
    const groups = {};
    for(const w of e.ws){ const k = w.sessionId||w.id; (groups[k]=groups[k]||[]).push(w); }
    for(const g of Object.values(groups)){
      const key = g[0].sessionId||g[0].id;
      const byGroup = {};
      for(const w of g){ const grp = muscleOf(w.exercise); byGroup[grp] = (byGroup[grp]||0) + w.sets.length; }
      const grpStr = Object.entries(byGroup).map(([k,v])=>`${k} ${v}`).join(' · ');
      html += `<div class="cal-sec"><div class="cal-sec-t">Training — ${g[0].day?esc(g[0].day):'Freies Training'}</div>`
        + `<div class="li-s" style="color:var(--ink-60)">${grpStr} Sätze</div>`
        + g.map(w=>{
            const st = sessionStats(w);
            return `<div class="li-s">${esc(w.exercise)}${w.swapped?` <span style="color:var(--ochre)">(statt ${esc(w.swapped)})</span>`:''}: ${w.sets.map(x=>`${x.w}×${x.r}`).join(' ')} — e1RM ${round(st.best,1)}${w.note?` — „${esc(w.note)}“`:''}</div>`;
          }).join('')
        + `<div style="margin-top:6px"><button class="link" data-cedit="${key}">bearbeiten</button><button class="link" data-crename="${key}" style="margin-left:12px">umbenennen</button><button class="link" data-cmove="${key}" style="margin-left:12px">verschieben</button></div>`
        + `</div>`;
    }
  } else {
    html += `<div class="cal-sec"><div class="cal-sec-t">Training</div><div class="li-s" style="color:var(--ink-30)">Keine Einheit</div></div>`;
  }
  const b = e.body;
  html += `<div class="cal-sec"><div class="cal-sec-t">Körper &amp; Essen</div>`;
  if(b){
    html += `<div class="li-s">${[
      b.weight!=null ? round(b.weight,1).toFixed(1)+' kg' : null,
      b.kcal!=null ? b.kcal+' kcal' : null,
      b.protein!=null ? b.protein+' g Protein' : null,
      b.steps!=null ? b.steps+' Schritte' : null
    ].filter(Boolean).join(' · ')}</div>`;
    if(b.meals && b.meals.length){
      html += b.meals.map(m=>`<div class="li-s">${esc(m.name||'Mahlzeit')}: ${m.text?esc(m.text)+' — ':''}${Math.round(m.kcal||0)} kcal · ${Math.round(m.protein||0)} g P</div>`).join('');
    }
  } else {
    html += `<div class="li-s" style="color:var(--ink-30)">Kein Eintrag</div>`;
  }
  html += `</div>`;
  $('#calDayBody').innerHTML = html;
  $$('#calDayBody [data-cedit]').forEach(btn=>btn.onclick=()=>editSession(btn.dataset.cedit));
  $$('#calDayBody [data-crename]').forEach(btn=>btn.onclick=()=>renameSession(btn.dataset.crename));
  $$('#calDayBody [data-cmove]').forEach(btn=>btn.onclick=()=>moveSession(btn.dataset.cmove));
}
$('#calPrev').onclick = ()=>{ calYM.m--; if(calYM.m<0){ calYM.m=11; calYM.y--; } renderCal(); };
$('#calNext').onclick = ()=>{ calYM.m++; if(calYM.m>11){ calYM.m=0; calYM.y++; } renderCal(); };

/* ---------------- Navigation & Rendern ---------------- */
$$('nav button').forEach(b=>b.onclick=()=>{
  $$('nav button').forEach(x=>x.removeAttribute('aria-current'));
  b.setAttribute('aria-current','page');
  $$('.view').forEach(v=>v.classList.remove('on'));
  $('#v-'+b.dataset.v).classList.add('on');
  window.scrollTo(0,0);
  if(b.dataset.v==='an') renderAnalysis();
  if(b.dataset.v==='body') renderMeals();
  if(b.dataset.v==='data') renderDataStats();
  if(b.dataset.v==='goals') renderGoals();
  if(b.dataset.v==='cal') renderCal();
  if(typeof renderResumeBar==='function') renderResumeBar();
});

function showView(v){
  $$('.view').forEach(function(x){ x.classList.remove('on'); });
  var el=$('#v-'+v); if(el) el.classList.add('on');
  $$('nav button').forEach(function(x){ if(x.dataset.v===v) x.setAttribute('aria-current','page'); else x.removeAttribute('aria-current'); });
  window.scrollTo(0,0);
  if(v==='an') renderAnalysis();
  if(v==='body') renderBody();
  if(v==='body') renderMeals();
  if(v==='data') renderDataStats();
  if(typeof renderResumeBar==='function') renderResumeBar();
}
{ var _hb=$('#homeBtn'); if(_hb) _hb.onclick=function(){ showView('body'); }; }

let anExSel = null;
function fillAnEx(){
  if(!anExSel || !db.exercises.includes(anExSel)) anExSel = db.exercises[0]||null;
  const btn=$('#anExBtn'); if(btn) btn.textContent = anExSel || 'Keine Übung';
}
const _anExBtn = $('#anExBtn');
if(_anExBtn) _anExBtn.onclick = async ()=>{
  const n = await pickExercise();
  if(!n) return;
  ensureEx(n); anExSel = n; fillAnEx(); renderAnalysis();
};
let anSubActive='koerper';
{ const seg=$('#anSub'); if(seg) seg.querySelectorAll('button').forEach(b=>b.onclick=()=>{ anSubActive=b.dataset.s; seg.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed', String(x.dataset.s===anSubActive))); $$('#v-an .ansub').forEach(v=>v.style.display = v.dataset.sub===anSubActive?'block':'none'); window.scrollTo(0,0); }); }
/* ---- Trainingsnotizen-Import (Apple Notes HTML) ---- */
function htmlToLines(html){
  let s=html.replace(/<\s*(br|\/p|\/div|\/h[1-6]|\/li|\/tr)[^>]*>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/gi,' ');
  const ta=document.createElement('textarea'); ta.innerHTML=s; s=ta.value;
  return s.split('\n').map(l=>l.trim()).filter(l=>l.length);
}
const _DEMON={januar:1,februar:2,'märz':3,maerz:3,april:4,mai:5,juni:6,juli:7,august:8,september:9,oktober:10,november:11,dezember:12};
function parseGermanDate(lines){
  for(const l of lines){ const m=l.toLowerCase().match(/(\d{1,2})\.?\s+([a-zäö]+)\s+(20\d\d)/); if(m && _DEMON[m[2]]) return m[3]+'-'+String(_DEMON[m[2]]).padStart(2,'0')+'-'+String(+m[1]).padStart(2,'0'); }
  return null;
}
function _foldName(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function matchExercise(name){
  const n=_foldName(name); if(!n) return '';
  let e=db.exercises.find(x=>_foldName(x)===n); if(e) return e;
  e=db.exercises.find(x=>{ const f=_foldName(x); return f && n.startsWith(f+' '); }); if(e) return e;
  const fw=n.split(' ')[0];
  if(fw.length>=4){ e=db.exercises.find(x=>{ const xf=_foldName(x).split(' ')[0]; return xf.length>=4 && (xf.startsWith(fw)||fw.startsWith(xf)); }); if(e) return e; }
  return '';
}
function _splitCfg(name){
  const m=name.match(/^(.*?)[\s]+([wW]\s?\d[\d.,]*\s?(?:kg)?|[wW])\s*$/);
  if(m && m[1].trim()) return {clean:m[1].trim(), cfg:m[2].trim()};
  return {clean:name.trim(), cfg:''};
}
function parseNote(filename, html){
  const lines=htmlToLines(html);
  let date=null; const mf=filename.match(/(20\d\d)[-_.](\d{2})[-_.](\d{2})/); if(mf) date=mf[1]+'-'+mf[2]+'-'+mf[3];
  if(!date) date=parseGermanDate(lines);
  let day=null, base=filename.replace(/\.html?$/i,''); base=base.replace(/^.*?(20\d\d[-_.]\d{2}[-_.]\d{2})[_\- ]*/,''); if(base.trim()) day=base.replace(/[_]+/g,'/').replace(/-/g,' ').trim();
  const dateWordRe=/(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)/i;
  const content=lines.filter(l=>!(dateWordRe.test(l) && /20\d\d/.test(l)));
  if(content.length){ if(!day) day=content[0]; content.shift(); } // erste Zeile = Split-Titel
  const setRe=/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/g;
  const exercises=[]; let cur=null;
  for(const raw of content){
    const line=raw.trim(); if(!line) continue;
    const toks=[...line.matchAll(setRe)];
    const startsDigit=/^\s*\d/.test(line);
    if(startsDigit && toks.length){
      if(!cur){ cur={name:'Übung',sets:[],note:''}; exercises.push(cur); }
      for(const t of toks) cur.sets.push({r:num(t[1]), w:num(t[2])});
      const noteText=line.replace(setRe,' ').replace(/\s+/g,' ').trim();
      if(noteText) cur.note=(cur.note?cur.note+' · ':'')+noteText;
    } else {
      let namePart = toks.length ? line.slice(0, toks[0].index).trim() : line;
      const sc=_splitCfg(namePart);
      cur={name:sc.clean||'Übung', sets:[], note:sc.cfg||''};
      exercises.push(cur);
      for(const t of toks) cur.sets.push({r:num(t[1]), w:num(t[2])});
      if(toks.length){ const last=toks[toks.length-1]; const after=line.slice(last.index+last[0].length).trim(); if(after) cur.note=(cur.note?cur.note+' · ':'')+after; }
    }
  }
  const withSets=exercises.filter(e=>e.sets.length);
  withSets.forEach(e=>{ e.match=matchExercise(e.name); });
  return {date, day, exercises:withSets, dropped:exercises.length-withSets.length};
}
let _pendingNotes=[]; let _pendingBad=[];
async function handleNoteFiles(files){
  const sessions=[]; const bad=[];
  for(const f of files){
    let html=''; try{ html=await f.text(); }catch(e){ bad.push(f.name); continue; }
    const p=parseNote(f.name, html);
    if(!p.date || !p.exercises.length){ bad.push(f.name); continue; }
    sessions.push(p);
  }
  _pendingNotes=sessions; _pendingBad=bad;
  renderImportEditor();
}
function renderImportEditor(){
  const host=$('#notePreview'), btn=$('#noteImport');
  if(!_pendingNotes.length){ host.style.display='block'; host.innerHTML='<div class="emptybox"><div class="eb-t">Keine Einheiten erkannt</div><div class="eb-s">'+((_pendingBad&&_pendingBad.length)? _pendingBad.length+' Datei(en) uebersprungen. ':'')+'Erwartet wird ein Apple-Notes-HTML-Export mit Saetzen im Format 80x8.</div></div>'; btn.style.display='none'; return; }
  let totEx=0, totSets=0, dup=0;
  for(const s of _pendingNotes){ for(const ex of s.exercises){ totEx++; const sets=ex.sets.filter(st=>st.w!=null&&st.r!=null&&st.r>0); totSets+=sets.length; if(db.workouts.some(w=>w.date===s.date && w.exercise===(ex.name||'').trim() && JSON.stringify(w.sets)===JSON.stringify(sets))) dup++; } }
  const summary='<div class="imp-summary"><b>'+_pendingNotes.length+'</b> Einheiten · '+totEx+' Übungen · '+totSets+' Sätze'+(dup?' · '+dup+' bereits vorhanden':'')+((_pendingBad&&_pendingBad.length)?' · '+_pendingBad.length+' Datei(en) ohne Sätze':'')+'<br><span class="hint">Alles editierbar — Format: kg × Wdh. Korrigiere und lösche vor dem Import.</span></div>';
  host.innerHTML = summary + _pendingNotes.map((s,si)=>
    '<div class="imp-sess">'
    +'<div class="imp-head"><input class="imp-day" data-si="'+si+'" value="'+esc(s.day||'')+'" placeholder="Trainingstag"><span class="imp-date">'+fmtDate(s.date)+'</span><button class="link warn imp-delsess" data-si="'+si+'">Einheit ✕</button></div>'
    + s.exercises.map((ex,ei)=>
        '<div class="imp-ex">'
        +'<div class="imp-raw">aus Notiz: „'+esc(ex.name||'')+'"</div>'
        +'<div class="imp-exhead"><select class="imp-exsel" data-si="'+si+'" data-ei="'+ei+'"><option value="__new__"'+(ex.match?'':' selected')+'>＋ Neue Übung anlegen</option>'+db.exercises.map(x=>'<option value="'+esc(x)+'"'+(ex.match===x?' selected':'')+'>'+esc(x)+'</option>').join('')+'</select><button class="link warn imp-delex" data-si="'+si+'" data-ei="'+ei+'">✕</button></div>'
        +(ex.match?'':'<input class="imp-newname" data-si="'+si+'" data-ei="'+ei+'" value="'+esc(ex.name||'')+'" placeholder="Name der neuen Übung" style="margin-bottom:6px">')
        + ex.sets.map((st,ki)=>
            '<div class="imp-set"><span class="setno">'+(ki+1)+'</span><input class="imp-w" inputmode="decimal" data-si="'+si+'" data-ei="'+ei+'" data-ki="'+ki+'" value="'+(st.w!=null?st.w:'')+'"><span class="imp-x">kg ×</span><input class="imp-r" inputmode="decimal" data-si="'+si+'" data-ei="'+ei+'" data-ki="'+ki+'" value="'+(st.r!=null?st.r:'')+'"><span class="imp-x">Wdh</span><button class="link warn imp-delset" data-si="'+si+'" data-ei="'+ei+'" data-ki="'+ki+'">✕</button></div>'
          ).join('')
        +'<button class="link imp-addset" data-si="'+si+'" data-ei="'+ei+'">＋ Satz</button>'
        +(ex.note?'<div class="imp-note">Notiz: '+esc(ex.note)+'</div>':'')
        +'</div>'
      ).join('')
    +'<button class="link imp-addex" data-si="'+si+'">＋ Übung</button>'
    +'</div>'
  ).join('');
  host.style.display='block';
  const S=si=>_pendingNotes[+si], E=(si,ei)=>_pendingNotes[+si].exercises[+ei];
  host.querySelectorAll('.imp-day').forEach(el=>el.oninput=()=>{ S(el.dataset.si).day=el.value.trim()||null; });
  host.querySelectorAll('.imp-exsel').forEach(el=>el.onchange=()=>{ const ex=E(el.dataset.si,el.dataset.ei); ex.match = el.value==='__new__'?'':el.value; renderImportEditor(); });
  host.querySelectorAll('.imp-newname').forEach(el=>el.oninput=()=>{ E(el.dataset.si,el.dataset.ei).name=el.value; });
  host.querySelectorAll('.imp-w').forEach(el=>el.onchange=()=>{ E(el.dataset.si,el.dataset.ei).sets[+el.dataset.ki].w=num(el.value); });
  host.querySelectorAll('.imp-r').forEach(el=>el.onchange=()=>{ E(el.dataset.si,el.dataset.ei).sets[+el.dataset.ki].r=num(el.value); });
  host.querySelectorAll('.imp-delset').forEach(el=>el.onclick=()=>{ E(el.dataset.si,el.dataset.ei).sets.splice(+el.dataset.ki,1); renderImportEditor(); });
  host.querySelectorAll('.imp-addset').forEach(el=>el.onclick=()=>{ E(el.dataset.si,el.dataset.ei).sets.push({w:null,r:null}); renderImportEditor(); });
  host.querySelectorAll('.imp-delex').forEach(el=>el.onclick=()=>{ S(el.dataset.si).exercises.splice(+el.dataset.ei,1); renderImportEditor(); });
  host.querySelectorAll('.imp-addex').forEach(el=>el.onclick=()=>{ S(el.dataset.si).exercises.push({name:'Neue Übung',sets:[{w:null,r:null}],note:''}); renderImportEditor(); });
  host.querySelectorAll('.imp-delsess').forEach(el=>el.onclick=()=>{ _pendingNotes.splice(+el.dataset.si,1); renderImportEditor(); });
  btn.style.display='block'; btn.textContent='Importieren ('+_pendingNotes.length+' Einheiten)';
}
{ const nf=$('#noteFiles'); if(nf) nf.onchange=()=>{ if(nf.files&&nf.files.length) handleNoteFiles([...nf.files]); }; }
{ const nb=$('#noteImport'); if(nb) nb.onclick=async()=>{
    let added=0, sess=0;
    for(const s of _pendingNotes){ const sid=uid(); let any=false; for(const ex of s.exercises){ const nm=((ex.match||ex.name)||'').trim()||'Übung'; const sets=(ex.sets||[]).filter(st=>st.w!=null && st.r!=null && st.r>0); if(!sets.length) continue; if(db.workouts.some(w=>w.date===s.date && w.exercise===nm && JSON.stringify(w.sets)===JSON.stringify(sets))) continue; ensureEx(nm); db.workouts.push({id:uid(), sessionId:sid, date:s.date, exercise:nm, sets, note:ex.note||null, day:s.day||null, swapped:null}); added++; any=true; } if(any) sess++; }
    await Store.save(db); renderAll();
    _pendingNotes=[]; $('#notePreview').style.display='none'; $('#noteImport').style.display='none'; const nf=$('#noteFiles'); if(nf) nf.value='';
    toast(added+' Übungen aus '+sess+' Einheiten importiert');
  }; }

{ const _wm=$('#wlistMore'); if(_wm) _wm.onclick=()=>{ wlistLimit = wlistLimit>=10?5:10; renderWList(); }; }
/* ---- Eingabe-Dialog (statt prompt – zuverlässig in iOS-PWA) ---- */
const askOv=document.createElement('div'); askOv.className='pickov'; askOv.style.display='none';
askOv.innerHTML=`<div class="picksheet">
  <div class="foodtitle asktitle"></div>
  <input class="askinput" type="text">
  <div class="row" style="margin-top:14px"><button class="ghost askcancel">Abbrechen</button><button class="askok">Übernehmen</button></div>
</div>`;
root.appendChild(askOv);
let _askRes=null;
function _askClose(val){ askOv.style.display='none'; const r=_askRes; _askRes=null; if(r) r(val); }
function askText(title, value, placeholder){
  return new Promise(res=>{
    _askRes=res;
    askOv.querySelector('.asktitle').textContent=title||'';
    const inp=askOv.querySelector('.askinput');
    inp.value=value||''; inp.placeholder=placeholder||'';
    askOv.style.display='flex';
    setTimeout(()=>{ try{ inp.focus(); inp.select(); }catch(e){} },60);
  });
}
askOv.querySelector('.askcancel').onclick=()=>_askClose(null);
askOv.querySelector('.askok').onclick=()=>_askClose(askOv.querySelector('.askinput').value);
askOv.addEventListener('click',e=>{ if(e.target===askOv) _askClose(null); });
askOv.querySelector('.askinput').addEventListener('keydown',e=>{ if(e.key==='Enter') _askClose(askOv.querySelector('.askinput').value); });

/* ---- Übung umbenennen (überall konsistent) ---- */
function applyExerciseRename(oldName, name){
  if(!name || name===oldName) return false;
  const merged = db.exercises.some(e=>e!==oldName && e.toLowerCase()===name.toLowerCase());
  db.exercises = db.exercises.filter(e=>e!==oldName);
  if(!db.exercises.includes(name)) db.exercises.push(name);
  db.exercises.sort((a,b)=>a.localeCompare(b,'de'));
  for(const w of db.workouts){ if(w.exercise===oldName) w.exercise=name; if(w.swapped===oldName) w.swapped=name; }
  for(const s of db.splits) for(const d of s.days) d.ex = d.ex.map(x=>x===oldName?name:x);
  if(db.exGroups && db.exGroups[oldName]!=null){ if(db.exGroups[name]==null) db.exGroups[name]=db.exGroups[oldName]; delete db.exGroups[oldName]; }
  if(db.exNotes && db.exNotes[oldName]!=null){ if(db.exNotes[name]==null) db.exNotes[name]=db.exNotes[oldName]; delete db.exNotes[oldName]; }
  if(typeof anExSel!=='undefined' && anExSel===oldName) anExSel=name;
  return merged;
}

/* ---- Übung bearbeiten (Name + Muskelgruppe) ---- */
const exEdOv=document.createElement('div'); exEdOv.className='pickov'; exEdOv.style.display='none';
exEdOv.innerHTML=`<div class="picksheet">
  <div class="foodtitle">Übung bearbeiten</div>
  <label class="f">Name</label>
  <input class="exed-name" type="text">
  <label class="f" style="margin-top:12px">Muskelgruppe</label>
  <div class="pickchips exed-groups"></div>
  <p class="hint exed-info"></p>
  <button class="exed-save" style="width:100%;margin-top:14px">Speichern</button>
  <button class="link warn exed-del" style="width:100%;margin-top:10px;text-align:center">Übung löschen</button>
  <button class="link exed-close" style="width:100%;margin-top:2px;text-align:center">Abbrechen</button>
</div>`;
root.appendChild(exEdOv);
let _exEdName=null,_exEdGrp=null;
function _exEdRenderGroups(){
  exEdOv.querySelector('.exed-groups').innerHTML=GROUP_ORDER.map(g=>'<button class="chip'+(g===_exEdGrp?' on':'')+'" data-g="'+esc(g)+'">'+esc(g)+'</button>').join('');
  exEdOv.querySelectorAll('.exed-groups .chip').forEach(c=>c.onclick=()=>{ _exEdGrp=c.dataset.g; _exEdRenderGroups(); });
}
function _exEdClose(){ exEdOv.style.display='none'; _exEdName=null; }
function openExEdit(name){
  _exEdName=name; _exEdGrp=muscleOf(name);
  exEdOv.querySelector('.exed-name').value=name;
  _exEdRenderGroups();
  const used=db.workouts.filter(w=>w.exercise===name).length;
  exEdOv.querySelector('.exed-info').textContent = used? (used+' Einheit(en) nutzen diese Übung — Umbenennen ändert sie überall mit.') : 'Diese Übung wurde noch nicht benutzt.';
  exEdOv.querySelector('.exed-del').style.display = used? 'none':'block';
  exEdOv.style.display='flex';
  setTimeout(()=>{ try{ exEdOv.querySelector('.exed-name').focus(); }catch(e){} },60);
}
exEdOv.querySelector('.exed-close').onclick=_exEdClose;
exEdOv.addEventListener('click',e=>{ if(e.target===exEdOv) _exEdClose(); });
exEdOv.querySelector('.exed-save').onclick=async()=>{
  const old=_exEdName; if(!old) return;
  const nm=(exEdOv.querySelector('.exed-name').value||'').trim();
  let merged=false, final=old;
  if(nm && nm!==old){ merged=applyExerciseRename(old,nm); final=nm; }
  if(_exEdGrp) db.exGroups[final]=_exEdGrp;
  await Store.save(db); renderAll(); _exEdClose();
  toast(merged? ('Zusammengeführt mit '+final) : 'Gespeichert');
};
exEdOv.querySelector('.exed-del').onclick=async()=>{
  const name=_exEdName; if(!name) return;
  db.exercises=db.exercises.filter(e=>e!==name);
  delete db.exGroups[name]; if(db.exNotes) delete db.exNotes[name];
  for(const s of db.splits) for(const d of s.days) d.ex=d.ex.filter(x=>x!==name);
  await Store.save(db); renderAll(); _exEdClose(); toast('Übung gelöscht');
};
{ const ss=$('#sexSeg'); if(ss) ss.querySelectorAll('button').forEach(b=>b.onclick=async()=>{ db.sex=b.dataset.sex; ss.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed', String(x.dataset.sex===db.sex))); await Store.save(db); renderNutri(); renderProfile(); }); }
{ const bind=(sel,key,min,max)=>{ const el=$(sel); if(!el) return; el.onchange=async()=>{ const v=parseInt(el.value,10); db[key]=(isFinite(v)&&v>=min&&v<=max)?v:null; if(db[key]==null) el.value=''; await Store.save(db); renderNutri(); renderProfile(); }; };
  bind('#pAge','age',10,100); bind('#pHeight','height',120,230); }
function renderAll(){
  fillDaySel();
  fillAnEx();
  renderWList(); renderPlan(); renderBody(); renderAnalysis(); renderExList(); renderCal();
  renderMeals(); renderNutri(); renderGoals(); renderDataStats(); updateUnitPill();
  renderWater(); renderMeas(); renderDayNote();
  if(typeof renderTrainProgress==='function') renderTrainProgress();
}

/* ---------------- PWA & Tagesziele ---------------- */
const ICON180='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAABx0lEQVR42u3dywnCUBCG0ZuLZYglWIB7wYKyEcxOsCXBvYVYiQ2ILzD8MuesAzKTj2BQuMN6Ghs80q0AcSAOxIE4EAfiQByIA3EgDhAH4kAciANxIA7EgTgQB+IAcSAOxIE4EAfiQByIA3EgDhAH4kAciANxIA7EgTgQB+JAHCAOxIE4EAfiQByIA3EgDsQB4kAciANxIA7EgTgQB+JAHNAWM3/e7Xx5fsFqt618P6L206Mmf/OasmXMvJ8eNXnlPgL309Mmr9lH5n564OTV+ojdj7cVxIE4EAfiQByIA3EgDsSBOEAciIP2f/8E+8h1f6xwD5apvz97ciAOxIE4EAfiQByIA3EgDsQB4kAciANxIA7EgTho/ib4O5vTwR3y5EAciANxIA7EAeJAHIgDcSAOxIE4EMcr3508Vec8r9j99Mz5q530lrmfHjh/zTMAA/fT0+avfDpk2n6G9TT65oW3FcSBOBAH4kAciANxIA7EAeJAHIgDcSAOxIE4EAfiQBwgDsSBOBAH4kAciANxIA7EgThAHIgDcSAOxIE4EAfiQByIA8SBOBAH4kAciANxIA7EgThAHIgDcSAOxIE4EAfiQByIg+ruMY0+Opirr/oAAAAASUVORK5CYII=';
const ICON512='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAGX0lEQVR42u3aQanjQBSG0RmjMoxKUAHOBSpIicGTGdzSgHIXokqcOjTYaCTfcwrYfQz359NjNw9lTgDEc/IEAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAm+k8wZfWuvzqj+qn0XtiMiazmTyU2Ss0v2NnjcmYjABEv2M3jcmYjACEvmM3jcmYTPKPwMFPudVfCiYjAOziqhw0JmMyApDC3pODxmRMRgDiXpKDxmRMRgAAEIBgHxG+aDAZkxEAAAQg2OeDLxpMxmQEAAABCPbh4IsGl2kyAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAcT+cJjuh5vXsE9uZcF4/gNwAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAIA2Ok9wRJfHzSMAfgMAQAAAEAAABAAAAQBAAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAABAEAAABAAAAQAAAEAQAAAEIB/00+jHwxMRgAAEAAABMCvtH4kMBkBAEAAfNH4lsFk/DACgFMGkxEAZwQmgwA4aIvCZExGABy0U8ZkTKaVPJTZK3xurYs7BpMRADftlMFkBMBNu2MwGQFw044YTEYAAEj+FxAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgAgAJ4AQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEA4N0LdM2T+BRJFGcAAAAASUVORK5CYII=';
function setupPWA(){
  const head=document.head;
  const has=sel=>head.querySelector(sel);
  const meta=(n,c)=>{ if(!has('meta[name="'+n+'"]')){ const m=document.createElement('meta'); m.name=n; m.content=c; head.appendChild(m); } };
  const link=(rel,href)=>{ const l=document.createElement('link'); l.rel=rel; l.href=href; head.appendChild(l); };
  meta('theme-color', tok('--teal'));
  meta('apple-mobile-web-app-capable','yes');
  meta('apple-mobile-web-app-status-bar-style','black-translucent');
  meta('apple-mobile-web-app-title','Logbuch');
  if(!has('link[rel="apple-touch-icon"]')) link('apple-touch-icon', ICON180);
  if(!has('link[rel="icon"][href^="data:image/png"]')) link('icon', ICON512);
  try{
    const manifest={name:'Logbuch',short_name:'Logbuch',start_url:'.',scope:'.',display:'standalone',background_color:tok('--bg',true),theme_color:tok('--teal'),icons:[{src:ICON512,sizes:'512x512',type:'image/png',purpose:'any maskable'},{src:ICON180,sizes:'180x180',type:'image/png'}]};
    link('manifest', URL.createObjectURL(new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'})));
  }catch(e){}
  try{ if(navigator.storage&&navigator.storage.persist) navigator.storage.persist(); }catch(e){}
  try{ if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{}); }catch(e){}

}
// Macro-Ziele aus dem (phasenabhängigen) Kalorienziel ableiten.
// Lagen frueher unter eigenen localStorage-Schluesseln und fehlten deshalb im
// "vollstaendigen" Backup. Jetzt Teil von db; alte Schluessel werden beim Start
// einmalig uebernommen (siehe migrateHeat).
function _getHeat(d){ return (db.heat && db.heat[d]) || 0; }
function _setHeat(d,v){ db.heat = db.heat||{}; if(v) db.heat[d]=v; else delete db.heat[d]; Store.save(db); }
function migrateHeat(){
  try{
    let n=0;
    for(let i=localStorage.length-1;i>=0;i--){
      const k=localStorage.key(i);
      if(!k || k.indexOf('logbuch.heat.')!==0) continue;
      const d=k.slice(13), v=+localStorage.getItem(k)||0;
      db.heat=db.heat||{}; if(v && db.heat[d]==null){ db.heat[d]=v; n++; }
      localStorage.removeItem(k);
    }
    return n;
  }catch(e){ return 0; }
}
function saltTarget(d,heat){ let vol=0,tr=false; for(const w of db.workouts){ if(w.date===d){ tr=true; vol+=sessionStats(w).vol; } } let t=(db.sex==='w')?4.5:5; if(tr) t+=1.5+Math.min(2,vol/8000); t+=(heat||0)*1.25; return Math.round(t*2)/2; }
/* ---------------- Wasser ---------------- */
// Grundbedarf ~35 ml je kg, plus Zuschlag fuers Training (Schweissverlust
// steigt mit dem Volumen) und fuer Hitze — dieselbe Logik wie beim Salzziel,
// damit beide Ziele nicht auseinanderlaufen.
function waterTarget(d){
  const w = latestWeight() || 75;
  let ml = w*35;
  let vol=0, tr=false;
  for(const x of db.workouts) if(x.date===d){ tr=true; vol+=sessionStats(x).vol; }
  if(tr) ml += 500 + Math.min(700, vol/12);
  ml += (_getHeat(d)||0)*400;
  return Math.round(ml/50)*50;
}
function dayEntry(d, create){
  let e = db.body.find(x=>x.date===d);
  if(!e && create){ e={date:d}; db.body.push(e); }
  return e;
}
async function addWater(ml){
  const d=$('#bdate').value||TODAY;
  const e=dayEntry(d,true);
  e.water = Math.max(0, Math.round((e.water||0)+ml));
  if(!e.water) delete e.water;
  await Store.save(db);
  renderWater(); renderDataStats();
}
function renderWater(){
  const host=$('#waterCard'); if(!host) return;
  const d=$('#bdate').value||TODAY;
  const e=dayEntry(d)||{};
  const ml=e.water||0, t=waterTarget(d);
  const pct=t>0?Math.min(100,Math.round(ml/t*100)):0;
  const rest=Math.max(0,t-ml);
  host.innerHTML =
    '<div class="meals-head" style="margin-bottom:10px"><span class="t">Wasser</span>'
    + '<span class="k">'+dec1(ml/1000)+' / '+dec1(t/1000)+' l</span></div>'
    + '<div class="goal-bar"><i class="'+(ml>=t?'done':'')+'" style="width:'+pct+'%;background:var(--blue)"></i></div>'
    + '<div class="goal-sub" style="margin-top:6px">'+(ml>=t?'Ziel erreicht':'Noch '+de(rest)+' ml')+'</div>'
    + '<div class="pickchips" style="margin-top:12px">'
    +   [250,500,750].map(v=>'<button class="chip" data-w="'+v+'">+'+v+' ml</button>').join('')
    +   '<button class="chip" data-w="-250">−250</button>'
    +   '<button class="chip" data-w="0">zurücksetzen</button>'
    + '</div>';
  host.querySelectorAll('[data-w]').forEach(b=>b.onclick=async()=>{
    const v=+b.dataset.w;
    if(v===0){ const en=dayEntry(d); if(en) delete en.water; await Store.save(db); renderWater(); return; }
    addWater(v);
  });
}

/* ---------------- Umfänge ---------------- */
function measSorted(){
  return bodySorted().filter(x=>x.meas && MEAS_SITES.some(m=>x.meas[m.k]!=null));
}
function renderMeas(){
  const host=$('#measCard'); if(!host) return;
  const rows=measSorted();
  const last=rows[rows.length-1];
  const prev=rows.length>1?rows[rows.length-2]:null;
  let body;
  if(!last){
    body='<div class="mi-empty">Noch nichts gemessen. Bauchumfang allein reicht schon — im Cut sagt er mehr als die Waage.</div>';
  } else {
    body='<div class="stats">'+MEAS_SITES.filter(m=>last.meas[m.k]!=null).map(m=>{
      const v=last.meas[m.k];
      const p=prev && prev.meas && prev.meas[m.k]!=null ? prev.meas[m.k] : null;
      const dlt=p!=null ? (v-p) : null;
      const sub=dlt==null ? fmtDate(last.date)
        : (dlt>0?'+':'')+round(dlt,1)+' cm seit '+fmtDate(prev.date);
      return '<div class="stat"><div class="k">'+m.label+'</div><div class="v">'+dec1(v)+'</div><div class="s">'+sub+'</div></div>';
    }).join('')+'</div>';
  }
  host.innerHTML='<div class="meals-head" style="margin-bottom:10px"><span class="t">Umfänge</span>'
    + '<button class="link" id="measEdit">'+(last?'eintragen':'jetzt messen')+'</button></div>'+body;
  const b=host.querySelector('#measEdit'); if(b) b.onclick=openMeas;
}
function openMeas(){
  const ov=$('#measOv'); if(!ov) return;
  const d=$('#bdate').value||TODAY;
  const e=dayEntry(d)||{};
  const cur=e.meas||{};
  // Als Vorbelegung die zuletzt gemessenen Werte anbieten — man misst selten alles neu.
  const rows=measSorted(); const lastM=(rows[rows.length-1]||{}).meas||{};
  $('#measTitle').textContent='Umfänge · '+fmtDate(d);
  $('#measForm').innerHTML=MEAS_SITES.map(m=>
    '<div class="profrow"><span class="proflab" style="flex:1">'+m.label+'</span>'
    + '<input type="text" inputmode="decimal" class="profnum meas-in" data-k="'+m.k+'" '
    + 'value="'+(cur[m.k]!=null?String(cur[m.k]).replace('.',','):'')+'" '
    + 'placeholder="'+(lastM[m.k]!=null?String(lastM[m.k]).replace('.',','):'—')+'">'
    + '<span class="profunit">cm</span></div>').join('');
  ov.style.display='flex';
  $('#measSave').onclick=async()=>{
    const en=dayEntry(d,true);
    const meas={};
    ov.querySelectorAll('.meas-in').forEach(i=>{
      const v=num(i.value);
      if(v!=null && v>0 && v<300) meas[i.dataset.k]=Math.round(v*10)/10;
    });
    if(Object.keys(meas).length) en.meas=meas; else delete en.meas;
    await Store.save(db);
    ov.style.display='none';
    renderMeas(); renderAnalysis(); renderDataStats();
    toast(Object.keys(meas).length?'Umfänge gespeichert':'Umfänge gelöscht');
  };
}

/* ---------------- Tagesnotiz ---------------- */
function renderDayNote(){
  const ta=$('#dayNote'); if(!ta) return;
  const d=$('#bdate').value||TODAY;
  const e=dayEntry(d)||{};
  ta.value=e.note||'';
  const meta=$('#noteMeta');
  if(meta){
    const n=db.body.filter(x=>x.note).length;
    meta.textContent = n ? n+' Notizen' : '';
  }
}

/* ---------------- Trainingspausen ---------------- */
// Laengere Luecken sind fuer jede Statistik relevant: sie ziehen Durchschnitte
// und Steigungen still nach unten. Deshalb werden sie erkannt und ausgewiesen,
// statt sie als Rhythmus mitzurechnen.
function trainingPauses(fromDate, toDate){
  const T=s=>new Date(s+'T12:00:00').getTime();
  const days=[...new Set(db.workouts.map(w=>w.date))].sort();
  const out=[];
  for(let i=1;i<days.length;i++){
    const gap=Math.round((T(days[i])-T(days[i-1]))/864e5);
    if(gap>=PAUSE_MIN_D) out.push({from:days[i-1], to:days[i], days:gap});
  }
  const heute=Math.round((T(TODAY)-T(days[days.length-1]||TODAY))/864e5);
  if(days.length && heute>=PAUSE_MIN_D) out.push({from:days[days.length-1], to:TODAY, days:heute, laufend:true});
  if(fromDate!=null||toDate!=null){
    return out.filter(p=>(fromDate==null||T(p.to)>=fromDate) && (toDate==null||T(p.from)<=toDate));
  }
  return out;
}

/* ---------------- Theme: Auto / Hell / Dunkel ---------------- */
const THEMES = [
  {id:'auto',  icon:'◐', label:'Automatisch (folgt dem System)'},
  {id:'light', icon:'☀', label:'Immer hell'},
  {id:'dark',  icon:'☾', label:'Immer dunkel'},
];
function currentTheme(){ const t=(db.ui||{}).theme; return THEMES.some(x=>x.id===t) ? t : 'auto'; }
function resolvedDark(){
  const t=currentTheme();
  if(t==='dark') return true;
  if(t==='light') return false;
  try{ return matchMedia('(prefers-color-scheme:dark)').matches; }catch(e){ return false; }
}
function applyTheme(){
  const t=currentTheme();
  if(root.host) root.host.setAttribute('theme', t);
  // Seitenhintergrund hinter der Komponente mitziehen, sonst blitzt bei
  // erzwungenem Hell auf einem dunklen System der alte Ton durch.
  try{ document.documentElement.style.background = resolvedDark() ? tok('--bg',true) : tok('--bg'); }catch(e){}
  const btn=$('#themeTog');
  if(btn){ const m=THEMES.find(x=>x.id===t); btn.textContent=m.icon; btn.title=m.label; btn.setAttribute('aria-label','Design: '+m.label); }
  // Segment auf der Einstellungsseite mitziehen (zweiter Weg zum selben Schalter)
  const seg=$('#themeSeg');
  if(seg) seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.t===t)));
  const hint=$('#themeHint');
  if(hint) hint.textContent = t==='auto'
    ? 'Folgt der Systemeinstellung — aktuell '+(resolvedDark()?'dunkel':'hell')+'.'
    : (t==='dark' ? 'Immer dunkel, unabhängig vom System.' : 'Immer hell, unabhängig vom System.');
}
async function setTheme(t){
  if(!THEMES.some(x=>x.id===t)) return;
  db.ui={...(db.ui||{}), theme:t};
  await Store.save(db); applyTheme();
}
{
  const seg=$('#themeSeg');
  if(seg) seg.querySelectorAll('button').forEach(b=>b.onclick=()=>setTheme(b.dataset.t));
  const og=$('#openGoalSet');
  if(og) og.onclick=()=>{ if(typeof openGoalSheet==='function') openGoalSheet(); };
}
{
  const btn=$('#themeTog');
  if(btn) btn.onclick=async()=>{
    const i=THEMES.findIndex(x=>x.id===currentTheme());
    const next=THEMES[(i+1)%THEMES.length].id;
    db.ui={...(db.ui||{}), theme:next};
    await Store.save(db); applyTheme();
    toast(THEMES.find(x=>x.id===next).label);
  };
  try{ matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{ if(currentTheme()==='auto') applyTheme(); }); }catch(e){}
}

// Profil-Karte: Zustand spiegeln + erklären, wofür die Werte gerade gebraucht werden.
function renderProfile(){
  const ss=$('#sexSeg');
  if(ss) ss.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.sex===(db.sex||'m'))));
  const a=$('#pAge'), h=$('#pHeight');
  if(a && document.activeElement!==a) a.value = db.age!=null ? db.age : '';
  if(h && document.activeElement!==h) h.value = db.height!=null ? db.height : '';
  const hint=$('#profHint'); if(!hint) return;
  const cov = empiricalCoverage();
  if(cov.enough){
    hint.textContent = 'Kalorienziel wird aus deinen Messdaten berechnet ('+cov.weights+' Wiegungen, '+cov.kcalDays+' kcal-Tage). Alter & Größe dienen nur noch als Reserve.';
  } else {
    const miss = missingProfileFields();
    hint.textContent = miss.length
      ? 'Noch zu wenig Messdaten fürs Kalorienziel. Trag '+miss.join(' & ')+' ein, dann schätzt die App vorläufig per Formel.'
      : 'Kalorienziel ist aktuell eine Formel-Schätzung (Mifflin-St-Jeor + Schritte). Ab '+EMP_MIN_WEIGHTS+' Wiegungen über '+EMP_MIN_SPAN_D+' Tage und '+EMP_MIN_KCAL_DAYS+' kcal-Tagen rechnet die App mit deinen echten Daten.';
  }
}
// Proteinziel: entweder feste Gramm (db.goals.proteinTarget) oder g pro kg
// Koerpergewicht (db.goals.proteinPerKg). Letzteres wandert beim Abnehmen mit.
function proteinTargetG(){
  const g = db.goals||{};
  if(g.proteinPerKg!=null){
    const w = latestWeight();
    if(w!=null) return Math.round(g.proteinPerKg*w);
  }
  return g.proteinTarget||0;
}
function macroTargets(){
  const t=calorieTarget();
  const kcal=t.kcal;
  const pt=proteinTargetG();
  let fat=null, carb=null, conflict=null;
  if(kcal!=null){
    fat=Math.round(kcal*0.25/9);
    const rest = kcal - pt*4 - fat*9;
    if(rest < 0){
      // Protein- und Fettziel passen nicht in das Kalorienziel. Frueher wurden die
      // Kohlenhydrate einfach bei 0 abgeschnitten — dann summierten sich die drei
      // angezeigten Makros nicht mehr auf das Ziel, ohne Hinweis. Jetzt wird das
      // Fett zurueckgenommen und der Konflikt gemeldet.
      fat = Math.max(0, Math.round((kcal - pt*4)/9));
      carb = 0;
      conflict = (pt*4 > kcal) ? 'protein' : 'fett';
    } else {
      carb = Math.round(rest/4);
    }
  }
  return {kcal, protein:pt||null, fat, carb, conflict, info:t};
}
function renderNutri(){
  const ringHost=$('#ringCard'); const host=$('#nutriBars');
  if(!ringHost && !host) return;
  const n=db.nutrition||DEFAULT_NUTRITION;
  if(typeof updatePhaseSeg==='function') updatePhaseSeg(n.phase);
  const tg=macroTargets();
  const d=$('#bdate').value||TODAY;
  const e=db.body.find(x=>x.date===d)||{};
  const kc=Math.round(e.kcal||0), pr=Math.round(e.protein||0), ft=Math.round(e.fat||0), cb=Math.round(e.carbs||0);
  const _meals=e.meals||[];
  const saltC=Math.round(_meals.reduce((a,m)=>a+(m.salt||0),0)*10)/10;
  const fibC=Math.round(_meals.reduce((a,m)=>a+(m.fiber||0),0)*10)/10;
  const _heat=_getHeat(d), saltT=saltTarget(d,_heat), fibT=30;

  let kt=null, metaStr='';
  const phaseLabel={maintain:'Maintain (Recomp)',cut:'Cut',bulk:'Bulk'}[n.phase]||n.phase;
  if(n.mode==='manual'){ kt=(n.manualKcal!=null?n.manualKcal:(db.goals.kcalTarget||null)); metaStr='manuell'; }
  else if(tg.kcal==null){ kt=null; metaStr='<button class="link tofix" id="toProfile">'+(tg.info.reason||'zu wenig Daten')+' →</button>'; }
  else {
    const dl=phaseDelta(); kt=tg.kcal; const est=tg.info.source==='formel';
    metaStr=phaseLabel+(tg.info.maint?' · '+(est?'geschätzt':'Erhalt')+' ~'+tg.info.maint:'')+(dl?' · '+(dl>0?'+':'')+dl+' kcal':'')+(est?' · Schätzung':'');
    // Woraus die Zahl stammt — macht aus einem Wert, dem man glauben muss, einen,
    // den man einordnen kann.
    const cv=tg.info.cov;
    if(cv) metaStr += '<br><span class="tbasis">Basis: '+cv.weights+' Wiegungen · '+cv.kcalDays+' kcal-Tage aus '+cv.windowDays+' Tagen</span>';
    else if(est) metaStr += '<br><span class="tbasis">Aus Profil gerechnet — für die gemessene Schätzung fehlen noch Wiegungen oder kcal-Tage</span>';
  }

  if(ringHost){
    // --- Ring-Karte (Prototyp: 112px Ring, kcal übrig) ---
    const R=54, C=Math.round(2*Math.PI*R);
    const frac=(kt&&kt>0)?Math.min(1,kc/kt):0;
    const over=(kt&&kc>kt);
    const dash=Math.round(C*frac);
    const ringColor=over?'var(--signal)':'var(--accent)';
    const centerBig=(kt!=null)?(over?'+'+de(kc-kt):de(Math.max(0,kt-kc))):'—';
    const centerLab=(kt==null)?'KEIN ZIEL':(over?'KCAL ÜBER':'KCAL ÜBRIG');
    ringHost.innerHTML=
      '<svg width="112" height="112" viewBox="0 0 128 128" role="img" aria-label="'+kc+' von '+(kt||'—')+' kcal">'
      +'<circle cx="64" cy="64" r="'+R+'" fill="none" stroke="var(--grid)" stroke-width="13"/>'
      +(dash>0?'<circle cx="64" cy="64" r="'+R+'" fill="none" stroke="'+ringColor+'" stroke-width="13" stroke-linecap="round" stroke-dasharray="'+dash+' '+C+'" transform="rotate(-90 64 64)"/>':'')
      +'<text x="64" y="59" text-anchor="middle" class="ring-big">'+centerBig+'</text>'
      +'<text x="64" y="79" text-anchor="middle" class="ring-lab">'+centerLab+'</text></svg>'
      +'<div class="ring-sub"><b>'+de(kc)+'</b> / '+(kt!=null?de(kt):'—')+'</div>';

    // --- Makro-Karte ---
    const bar=(label,cur,target,varc,unit,small)=>{
      const pct=target>0?Math.min(100,Math.round(cur/target*100)):0;
      const ov=target>0&&cur>target;
      const fmt=v=>Number.isInteger(v)?de(v):dec1(v);
      return '<div class="bar"><div class="bar-top"><span class="k">'+label+'</span>'
        +'<span class="v"><b>'+fmt(cur)+'</b> / '+(target?fmt(target):'—')+' '+(unit||'g')+'</span></div>'
        +'<div class="track'+(small?' sm':'')+'"><i style="width:'+pct+'%;background:'+(ov?'var(--signal)':varc)+'"></i></div></div>';
    };
    const mb=$('#macroBars');
    if(mb) mb.innerHTML = bar('Protein',pr,tg.protein||0,'var(--mp)')
      + bar('Fett',ft,tg.fat||0,'var(--mf)')
      + bar('Kohlenhydrate',cb,tg.carb||0,'var(--mc)');

    const moreBtn=$('#macroMore'), extra=$('#macroExtra');
    if(moreBtn) moreBtn.textContent = macroMore ? 'Weniger anzeigen ▲' : 'Mehr anzeigen ▼';
    if(extra) extra.innerHTML = macroMore
      ? '<div class="extra">'
        + bar('Ballaststoffe',fibC,fibT,'var(--fiber)','g',true)
        + bar('Salz <button class="sf-heat">🌡 '+(['normal','warm','heiß'][_heat]||'normal')+'</button>',saltC,saltT,'var(--salt)','g',true)
        + '</div>'
      : '';
    if(moreBtn) moreBtn.onclick=()=>{ macroMore=!macroMore; renderNutri(); };
    const _hb=extra && extra.querySelector('.sf-heat');
    if(_hb) _hb.onclick=(ev)=>{ ev.stopPropagation(); _setHeat(d,(_getHeat(d)+1)%3); renderNutri(); };

    // --- Phase-Pill im Karten-Kopf: zeigt Phase + Stufe, springt zur Phase-Zeile ---
    const pill=$('#phasePill');
    if(pill){
      let lvlLab='';
      if(n.mode==='manual') lvlLab='manuell';
      else if(n.phase==='cut')  lvlLab=(CUT_LEVELS.find(l=>l.id===n.cutLevel)||CUT_LEVELS[1]).label;
      else if(n.phase==='bulk') lvlLab=(BULK_LEVELS.find(l=>l.id===n.bulkLevel)||BULK_LEVELS[1]).label;
      pill.textContent = phaseLabel + (lvlLab?' · '+lvlLab:'');
      pill.title='Kalorienziel & Phase';
      pill.onclick=openGoalSheet;
    }

    const gm=$('#goalMeta');
    if(gm) gm.textContent=(kt!=null?'Ziel '+de(kt)+' kcal · ':'')+metaStr.replace(/<[^>]*>/g,'').trim();
    const meta=$('#targetMeta');
    if(meta){
      const _mt=macroTargets();
      if(_mt.conflict==='protein') metaStr += '<br><span class="tbasis" style="color:var(--signal)">Protein-Ziel passt nicht in das Kalorienziel — Ziel oder Phase anpassen</span>';
      else if(_mt.conflict==='fett') metaStr += '<br><span class="tbasis">Fett wurde reduziert, damit Protein und Kalorienziel zusammenpassen</span>';
      meta.innerHTML=metaStr;
      const _tp=meta.querySelector('#toProfile'); if(_tp) _tp.onclick=()=>{
        const card=$('#profileCard'); if(!card) return;
        showView('data');
        card.scrollIntoView({behavior:'smooth', block:'center'});
        card.classList.add('flash'); setTimeout(()=>card.classList.remove('flash'), 1400);
        const first = [$('#pAge'), $('#pHeight')].find(el=>el && !el.value);
        if(first) setTimeout(()=>{ first.focus(); try{ first.select(); }catch(_){} }, 350);
      };
    }
  }

  if(host){
    let lvl='';
    if(n.mode==='auto' && n.phase==='cut'){
      lvl='<div class="lvlrow"><label class="f">Defizit-Stufe</label><select id="lvlSel">'+CUT_LEVELS.map(l=>'<option value="'+l.id+'"'+(l.id===n.cutLevel?' selected':'')+'>'+l.label+' ('+l.delta+' kcal · '+l.prog+')</option>').join('')+'</select></div>';
    } else if(n.mode==='auto' && n.phase==='bulk'){
      lvl='<div class="lvlrow"><label class="f">Überschuss-Stufe</label><select id="lvlSel">'+BULK_LEVELS.map(l=>'<option value="'+l.id+'"'+(l.id===n.bulkLevel?' selected':'')+'>'+l.label+' (+'+l.delta+' kcal · '+l.prog+')</option>').join('')+'</select></div>';
    }
    const manual = n.mode==='manual'
      ? '<div class="manualrow"><div style="flex:1"><label class="f" for="manKcal">Ziel kcal</label><input type="number" id="manKcal" inputmode="numeric" value="'+(n.manualKcal!=null?n.manualKcal:'')+'" placeholder="'+(db.goals.kcalTarget||2200)+'"></div><button class="ghost tiny" id="manSave" style="flex:0 0 auto">Setzen</button></div>'
      : '';
    host.innerHTML=
      '<div class="seg"><button data-mode="auto" aria-pressed="'+(n.mode!=='manual')+'">Automatische Analyse</button><button data-mode="manual" aria-pressed="'+(n.mode==='manual')+'">Manuell</button></div>'
      +lvl+manual;
    host.querySelectorAll('.seg button').forEach(bt=>bt.onclick=async()=>{ db.nutrition.mode=bt.dataset.mode; await Store.save(db); renderNutri(); renderGoals(); });
    const ls=host.querySelector('#lvlSel'); if(ls) ls.onchange=async()=>{ if(n.phase==='cut') db.nutrition.cutLevel=ls.value; else db.nutrition.bulkLevel=ls.value; await Store.save(db); renderNutri(); renderGoals(); };
    const ms=host.querySelector('#manSave'); if(ms) ms.onclick=async()=>{ const v=num(host.querySelector('#manKcal').value); db.nutrition.manualKcal=(v!=null?Math.round(v):null); await Store.save(db); renderNutri(); renderGoals(); toast('Manuelles Ziel gesetzt'); };
  }
}

/* ---------------- Viewport / Tastatur ---------------- */
// Haelt --vvh/--vvt auf dem tatsaechlich sichtbaren Bereich, damit Bottom-Sheets
// (Produktsuche, Kalender, Ziele) bei offener Tastatur nicht darunter verschwinden.
function syncViewport(){
  const de=document.documentElement, vv=window.visualViewport;
  if(!vv){ de.style.setProperty('--vvh','100%'); de.style.setProperty('--vvt','0px'); return; }
  de.style.setProperty('--vvh', vv.height+'px');
  de.style.setProperty('--vvt', Math.max(0, vv.offsetTop||0)+'px');
  syncScanRotation();
}
if(window.visualViewport){
  window.visualViewport.addEventListener('resize', syncViewport);
  window.visualViewport.addEventListener('scroll', syncViewport);
}
window.addEventListener('orientationchange', function(){ setTimeout(syncViewport,200); setTimeout(syncScanRotation,220); });
try{ window.screen.orientation.addEventListener('change', function(){ setTimeout(syncViewport,120); setTimeout(syncScanRotation,140); }); }catch(e){}
syncViewport();

/* ---------------- Start ---------------- */
(async function init(){
  const saved = await Store.load();
  if(saved) db = {
    exercises: saved.exercises?.length ? saved.exercises : [...DEFAULT_EX],
    workouts: saved.workouts||[],
    body: saved.body||[],
    splits: saved.splits||[],
    exGroups: saved.exGroups||{},
    exNotes: saved.exNotes||{},
    customBarcodes: saved.customBarcodes||{},
    heat: saved.heat||{},
    exRest: saved.exRest||{},
    savedMeals: saved.savedMeals||[],
    lastExport: saved.lastExport||null,
    sex: saved.sex||'m',
    age: saved.age||null,
    height: saved.height||null,
    mealTypes: saved.mealTypes?.length ? saved.mealTypes : [...DEFAULT_MEALS],
    goals: {...DEFAULT_GOALS, ...(saved.goals||{})},
    foodFav: saved.foodFav||[],
    nutrition: {...DEFAULT_NUTRITION, ...(saved.nutrition||{})},
    ui: {theme:'auto', ...(saved.ui||{})}
  };
  if(migrateHeat()) await Store.save(db);   // alte logbuch.heat.* Schluessel einsammeln
  applyTheme();
  setupPWA();
  $('#today').textContent = new Date().toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'});
  $('#wdate').value = TODAY; $('#bdate').value = TODAY;
  renderAll();
  loadDay();
  showView('body');
})();

}
customElements.define('logbuch-app', LogbuchApp);
})();
