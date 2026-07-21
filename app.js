(function(){
const CSS = "\n:host{\n  --bg:#F4F6F8; --card:#FFFFFF; --field:#F7F8FA; --line:#E3E8EE; --grid:#EDF1F5;\n  --ink:#1B2530; --ink-60:#5F6C7B; --ink-30:#9AA6B3;\n  --accent-base:#33639C;\n  --accent:var(--accent-base);\n  --accent:oklch(from var(--accent-base) 0.48 c h);\n  --on-accent:#fff;\n  --blue:var(--accent);\n  --teal:#2E7D74; --ochre:#A67926; --signal:#C4553F;\n  --r:14px; --ri:9px;\n  --mono:ui-monospace,\"SF Mono\",SFMono-Regular,Menlo,monospace;\n  --sans:\"Instrument Sans\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;\n  display:block; min-height:100vh;\n  background:var(--bg); color:var(--ink);\n  font-family:var(--sans); font-size:15px; line-height:1.5;\n  padding-bottom:calc(86px + env(safe-area-inset-bottom));\n  -webkit-font-smoothing:antialiased;\n}\n@media (prefers-color-scheme:dark){\n  :host{\n    --bg:#10151A; --card:#171D24; --field:#10151A; --line:#242C35; --grid:#1C232B;\n    --ink:#E7EBEF; --ink-60:#96A2AF; --ink-30:#5A6673;\n    --accent:var(--accent-base);\n    --accent:oklch(from var(--accent-base) 0.74 c h);\n    --on-accent:#10151A;\n    --teal:#5FB3A8; --ochre:#C79A4B; --signal:#DB7A63;\n  }\n}\n:host([paper=\"true\"]){\n  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);\n  background-size:22px 22px;\n}\n*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\n.wrap{max-width:580px;margin:0 auto;padding:0 16px}\n\nheader{\n  padding:calc(16px + env(safe-area-inset-top)) 16px 13px;\n  border-bottom:1px solid var(--line);\n  background:color-mix(in srgb,var(--bg) 86%,transparent);\n  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);\n  position:sticky;top:0;z-index:20;\n}\nheader .inner{max-width:580px;margin:0 auto;display:flex;align-items:baseline;justify-content:space-between}\nh1{font:650 17px/1 var(--sans);letter-spacing:-.01em;margin:0}\nh1::before{content:\"\";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-right:8px;vertical-align:1px}\n.today{font-family:var(--mono);font-size:12px;color:var(--ink-60);letter-spacing:.02em}\n\n.card{\n  background:var(--card);\n  border:1px solid var(--line);\n  border-radius:var(--r);\n  padding:18px;\n  margin:14px 0;\n  box-shadow:0 1px 2px rgba(15,23,32,.04);\n}\n.card > h2{\n  font:600 11px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;\n  color:var(--ink-60);margin:0 0 14px;\n}\n.hint{font-size:12.5px;color:var(--ink-60);margin:8px 0 0}\n:host([compact=\"true\"]) .card{padding:13px;margin:10px 0}\n\nlabel.f{display:block;font:550 11px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-60);margin:0 0 6px}\ninput,select,textarea,button{font-family:inherit;font-size:16px;color:var(--ink)}\ninput,select,textarea{\n  width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:var(--ri);\n  background:var(--field);appearance:none;\n}\ninput[type=number]{font-family:var(--mono);font-variant-numeric:tabular-nums}\ninput:focus,select:focus,textarea:focus{\n  outline:none;border-color:var(--accent);\n  box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent);\n}\nbutton:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.row{display:flex;gap:10px}\n.row > *{flex:1;min-width:0}\n\nbutton{cursor:pointer;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);\n  padding:11px 16px;border-radius:var(--ri);font-weight:600;letter-spacing:.01em}\nbutton.ghost{background:transparent;color:var(--ink);border-color:var(--line)}\nbutton.tiny{padding:7px 10px;font-size:13px}\nbutton.link{background:none;border:0;padding:4px 0;font-size:13px;color:var(--ink-60);font-weight:500}\nbutton.link.warn{color:var(--signal)}\nbutton:active{transform:translateY(1px)}\n\n.block{\n  border:1px solid var(--line);border-radius:var(--r);background:var(--card);\n  padding:14px;margin-bottom:12px;box-shadow:0 1px 2px rgba(15,23,32,.04);\n}\n.block.swapped{box-shadow:inset 3px 0 0 var(--ochre),0 1px 2px rgba(15,23,32,.04)}\n.block-head{display:flex;gap:8px;align-items:center;margin-bottom:10px}\n.block-head select{flex:1;font-weight:600}\n.block-head .rm{flex:none;width:38px;padding:8px 0;text-align:center;border:0;\n  background:transparent;color:var(--ink-30);font-weight:400;border-radius:var(--ri)}\n.swap-tag{font:600 9px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ochre);margin:-4px 0 8px}\n.ref{font-family:var(--mono);font-size:11.5px;color:var(--ink-60);margin:0 0 12px;word-break:break-word}\n\n.setrow{display:flex;gap:8px;align-items:center;margin-bottom:8px}\n.setno{font-family:var(--mono);font-size:12px;color:var(--ink-30);width:20px;flex:none;text-align:right}\n.setrow input{flex:1}\n.setrow .del{flex:none;width:38px;padding:9px 0;text-align:center;border:0;\n  background:transparent;color:var(--ink-30);font-weight:400;border-radius:var(--ri)}\n.block input.note{margin-top:4px;font-size:14px}\n\n.readout{\n  background:var(--card);border:1px solid var(--line);border-radius:var(--r);\n  padding:18px;margin:14px 0;box-shadow:0 1px 2px rgba(15,23,32,.04);\n  display:flex;align-items:flex-end;justify-content:space-between;gap:14px;\n}\n.readout .big{font-family:var(--mono);font-size:38px;line-height:.95;font-variant-numeric:tabular-nums;letter-spacing:-.03em;color:var(--ink)}\n.readout .big span{font-size:14px;color:var(--ink-30);letter-spacing:.04em}\n.readout .lab{font:550 10px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-30);margin-bottom:8px}\n.readout .side{text-align:right}\n.readout .side div{font-family:var(--mono);font-size:12.5px;color:var(--ink-60);font-variant-numeric:tabular-nums;margin-top:2px}\n.up{color:var(--teal)!important}.down{color:var(--signal)!important}\n\n.stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden}\n.stat{background:var(--card);padding:12px 13px}\n.stat .k{font:550 10px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-60)}\n.stat .v{font-family:var(--mono);font-size:19px;font-variant-numeric:tabular-nums;margin-top:6px}\n.stat .s{font-size:11.5px;color:var(--ink-30);font-family:var(--mono)}\n\n.legend{display:flex;gap:14px;flex-wrap:wrap;margin:10px 0 0;font-size:11.5px;color:var(--ink-60)}\n.legend i{display:inline-block;width:14px;height:2px;vertical-align:middle;margin-right:5px;border-radius:1px}\n\nul.list{list-style:none;margin:0;padding:0}\nul.list li{border-top:1px solid var(--grid);padding:11px 0;display:flex;justify-content:space-between;gap:10px;align-items:flex-start}\nul.list li:first-child{border-top:0}\n.li-main{min-width:0;flex:1}\n.li-t{font-weight:600;font-size:14px}\n.li-s{font-family:var(--mono);font-size:12px;color:var(--ink-60);margin-top:3px;word-break:break-word}\n.li-d{font-family:var(--mono);font-size:11px;color:var(--ink-30);flex:none;text-align:right}\n.pr{color:var(--signal);font-weight:700;font-size:10px;letter-spacing:.14em;text-transform:uppercase}\n.daytag{display:inline-block;font:600 9px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;\n  color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 40%,transparent);border-radius:99px;padding:3px 7px;margin-left:6px;vertical-align:1px}\n\n.split{border:1px solid var(--line);border-radius:var(--r);background:var(--card);margin-bottom:12px;overflow:hidden}\n.split-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;border-bottom:1px solid var(--line);background:var(--field)}\n.split-head .t{font-weight:650;font-size:14px}\n.day{border-top:1px solid var(--grid);padding:11px 14px}\n.day:first-of-type{border-top:0}\n.day-head{display:flex;align-items:center;justify-content:space-between;gap:8px}\n.day-head .t{font-weight:600;font-size:14px}\n.day-ex{font-family:var(--mono);font-size:12px;color:var(--ink-60);margin-top:3px}\n.day-edit{margin-top:10px;border-top:1px dashed var(--line);padding-top:10px}\n.day-edit .exline{display:flex;align-items:center;gap:8px;padding:5px 0}\n.day-edit .exline .n{flex:1;font-size:14px}\n.day-edit .exline button{flex:none}\n\n.cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}\n.cal-head .t{font:600 13px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase}\n.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}\n.cal-dow{font:550 9px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-30);text-align:center;padding:4px 0 6px}\n.cal-day{\n  position:relative;aspect-ratio:1;border:1px solid transparent;border-radius:9px;\n  background:var(--field);padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;\n  font-family:var(--mono);font-size:13px;font-weight:400;color:var(--ink);letter-spacing:0;\n}\n.cal-day.today{border-color:var(--accent)}\n.cal-day.sel{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}\n.cal-dots{display:flex;gap:3px;height:4px}\n.cal-dots i{width:4px;height:4px;border-radius:50%;display:block}\n.cal-sec{border-top:1px solid var(--grid);padding:10px 0}\n.cal-sec:first-child{border-top:0;padding-top:0}\n.cal-sec:last-child{padding-bottom:0}\n.cal-sec-t{font-weight:600;font-size:14px;margin-bottom:4px}\n.cal-sec .li-s{margin-top:3px}\n\nnav{\n  position:fixed;left:0;right:0;bottom:0;z-index:30;\n  background:color-mix(in srgb,var(--bg) 88%,transparent);\n  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\n  border-top:1px solid var(--line);\n  padding-bottom:env(safe-area-inset-bottom);\n}\nnav .inner{max-width:580px;margin:0 auto;display:flex}\nnav button{\n  flex:1;background:none;border:0;color:var(--ink-30);\n  padding:14px 0 15px;font:600 10px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;\n  border-radius:0;\n}\nnav button[aria-current=page]{color:var(--accent);font-weight:700}\nnav button:active{transform:none}\n\n.view{display:none}.view.on{display:block}\nsvg.chart{display:block;width:100%;height:auto;overflow:visible}\n.empty{color:var(--ink-30);font-size:13px;text-align:center;padding:24px 0;font-family:var(--mono)}\n.toast{\n  position:fixed;left:50%;transform:translateX(-50%);bottom:calc(92px + env(safe-area-inset-bottom));\n  background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:10px;\n  font-size:13px;z-index:50;opacity:0;pointer-events:none;transition:opacity .2s;font-family:var(--mono);\n  max-width:86vw;text-align:center;box-shadow:0 6px 24px rgba(15,23,32,.25);\n}\n.toast.on{opacity:1}\n@media (prefers-reduced-motion:reduce){*{transition:none!important}}\n";
const MARKUP = "<header><div class=\"inner\">\n  <h1>Logbuch</h1>\n  <div class=\"head-right\"><div class=\"phaseseg\" id=\"phaseSeg\" role=\"group\" aria-label=\"Phase\"><button data-phase=\"maintain\" aria-pressed=\"true\">Maintain</button><button data-phase=\"cut\">Cut</button><button data-phase=\"bulk\">Bulk</button></div><button class=\"today\" id=\"today\" aria-label=\"Kalender\"></button></div>\n</div></header>\n\n<main class=\"wrap\">\n\n<!-- ============ TRAINING ============ -->\n<section class=\"view on\" id=\"v-log\">\n  <div class=\"card\">\n    <h2>Einheit starten</h2>\n    <div class=\"row\" style=\"margin-bottom:12px\">\n      <div style=\"flex:2\"><label class=\"f\" for=\"daySel\">Trainingstag</label><select id=\"daySel\"></select></div>\n      <div style=\"flex:1\"><label class=\"f\" for=\"wdate\">Datum</label><input type=\"date\" id=\"wdate\"></div>\n    </div>\n    <p class=\"hint\" id=\"dayHint\" style=\"margin:0\"></p>\n  </div>\n\n  <div id=\"blocks\"></div>\n\n  <div class=\"row\">\n    <button class=\"ghost\" id=\"addBlock\">＋ Übung hinzufügen</button>\n  </div>\n  <button id=\"saveW\" style=\"width:100%;margin-top:12px\">Einheit speichern</button>\n\n  <div class=\"card\">\n    <h2>Letzte Einheiten</h2>\n    <ul class=\"list\" id=\"wlist\"></ul>\n  </div>\n</section>\n\n<!-- ============ PLAN ============ -->\n<section class=\"view\" id=\"v-plan\">\n  <div class=\"card\">\n    <h2>Splits &amp; Trainingstage</h2>\n    <p class=\"hint\" style=\"margin:0 0 12px\">Lege einen Split an (z. B. Push / Pull / Legs), darin die Trainingstage mit ihren Übungen. Beim Loggen wird der Tag vorausgefüllt — Änderungen dort gelten nur für die eine Einheit, der Plan bleibt unberührt.</p>\n    <div id=\"splits\"></div>\n    <button class=\"ghost\" id=\"addSplit\" style=\"width:100%\">＋ Split anlegen</button>\n  </div>\n\n  <div class=\"card\">\n    <h2>Übungskatalog</h2>\n    <ul class=\"list\" id=\"exlist\"></ul>\n    <button class=\"ghost tiny\" id=\"addExCat\" style=\"width:100%;margin-top:10px\">＋ Übung anlegen</button>\n  </div>\n</section>\n\n<!-- ============ KÖRPER & ZIEL ============ -->\n<section class=\"view\" id=\"v-body\">\n\n  <div class=\"readout\" id=\"bodyReadout\"></div>\n\n  <div class=\"card\" id=\"nutriCard\">\n    <h2 style=\"display:flex;justify-content:space-between;align-items:center\">Tagesübersicht <button class=\"link\" id=\"nutriEdit\">Protein-Ziel</button></h2>\n    <div id=\"targetBox\"></div>\n    <div id=\"nutriBars\"></div>\n  </div>\n\n  <div class=\"card input\">\n    <h2>Gewicht &amp; Kalorien</h2>\n    <div class=\"row\" style=\"margin-bottom:12px\">\n      <div><label class=\"f\" for=\"bdate\">Datum</label><input type=\"date\" id=\"bdate\"></div>\n    </div>\n    <div class=\"row\">\n      <div><label class=\"f\" for=\"bw\">Gewicht (kg)</label><input type=\"number\" id=\"bw\" step=\"0.1\" inputmode=\"decimal\" placeholder=\"78.4\"></div>\n      <div><label class=\"f\" for=\"kcal\">Kalorien</label><input type=\"number\" id=\"kcal\" step=\"10\" inputmode=\"numeric\" placeholder=\"2400\"></div>\n    </div>\n    <div class=\"row\" style=\"margin-top:12px\">\n      <div><label class=\"f\" for=\"prot\">Protein (g)</label><input type=\"number\" id=\"prot\" step=\"1\" inputmode=\"numeric\" placeholder=\"160\"></div>\n      <div><label class=\"f\" for=\"steps\">Schritte</label><input type=\"number\" id=\"steps\" step=\"100\" inputmode=\"numeric\" placeholder=\"9000\"></div>\n    </div>\n    <button id=\"saveB\" style=\"width:100%;margin-top:12px\">Eintrag speichern</button>\n    <p class=\"hint\">Nur ausgefüllte Felder werden überschrieben. Ein Tag = ein Eintrag.</p>\n  </div>\n\n  <div class=\"card input\">\n    <h2>Mahlzeiten</h2>\n    <div class=\"pickchips\" id=\"mealChips\" style=\"margin-bottom:10px\"></div>\n    <div class=\"row\" style=\"margin-bottom:12px\">\n      <button class=\"ghost\" id=\"prodSearchBtn\">🔍 Produkt suchen</button>\n      <button class=\"ghost\" id=\"barcodeBtn\" style=\"flex:0 0 auto\">▣ Barcode</button>\n    </div>\n    <label class=\"f\" for=\"foodTxt\">oder frei eintragen</label>\n    <input id=\"foodTxt\" placeholder=\"z. B. 200 g Reis, 150 g Hähnchenbrust\">\n    <div class=\"row\" style=\"margin-top:10px\">\n      <div><label class=\"f\" for=\"mealKcal\">kcal</label><input type=\"number\" id=\"mealKcal\" inputmode=\"numeric\" placeholder=\"auto\"></div>\n      <div><label class=\"f\" for=\"mealProt\">Protein g</label><input type=\"number\" id=\"mealProt\" inputmode=\"numeric\" placeholder=\"auto\"></div>\n    </div>\n    <div class=\"row\" style=\"margin-top:10px\">\n      <div><label class=\"f\" for=\"mealFat\">Fett g</label><input type=\"number\" id=\"mealFat\" inputmode=\"numeric\" placeholder=\"optional\"></div>\n      <div><label class=\"f\" for=\"mealCarb\">Kohlenhydrate g</label><input type=\"number\" id=\"mealCarb\" inputmode=\"numeric\" placeholder=\"optional\"></div>\n    </div>\n    <button class=\"ghost\" id=\"foodGo\" style=\"width:100%;margin-top:10px\">Mahlzeit eintragen</button>\n    <p class=\"hint\" id=\"foodInfo\">Am einfachsten „Produkt suchen“ oder „Barcode“ nutzen (Open Food Facts) — Fett &amp; Kohlenhydrate kommen dann automatisch mit. Frei eintragen: Werte selbst angeben — ohne kcal fragt die App deinen n8n-Webhook (falls im Daten-Tab hinterlegt).</p>\n    <ul class=\"list\" id=\"mealList\" style=\"margin-top:10px\"></ul>\n  </div>\n\n  <div class=\"card\">\n    <h2>Verlauf</h2>\n    <ul class=\"list\" id=\"blist\"></ul>\n    <button class=\"ghost tiny\" id=\"blistMore\" style=\"width:100%;margin-top:10px;display:none\">Mehr anzeigen</button>\n  </div>\n\n  <div class=\"card\">\n    <h2 style=\"display:flex;justify-content:space-between;align-items:center\">Wochenziele <button class=\"link\" id=\"goalEdit\">anpassen</button></h2>\n    <p class=\"hint\" style=\"margin:0 0 12px\">Rollierend über die letzten 7 Tage.</p>\n    <div id=\"goals\"></div>\n  </div>\n\n</section>\n\n<!-- ============ ANALYSE ============ -->\n<section class=\"view\" id=\"v-an\">\n  <div class=\"card\">\n    <h2>Zeitraum</h2>\n    <div class=\"pickchips\" id=\"anPeriod\"></div>\n    <div class=\"row\" id=\"anCustom\" style=\"display:none;margin:6px 0 0\">\n      <div><label class=\"f\">Von</label><input type=\"date\" id=\"anFrom\"></div>\n      <div><label class=\"f\">Bis</label><input type=\"date\" id=\"anTo\"></div>\n    </div>\n    <div style=\"margin-top:12px\"><label class=\"f\" for=\"anAvg\">Ø-Fenster (Tage) — Glättung &amp; Vergleich</label><input type=\"number\" id=\"anAvg\" min=\"1\" max=\"90\" step=\"1\" inputmode=\"numeric\"></div>\n  </div>\n\n  <div class=\"card\">\n    <h2>Gewicht &amp; Energie</h2>\n    <div id=\"c-weight\"></div>\n    <div class=\"legend\">\n      <span><i style=\"background:var(--ink-30)\"></i>Rohwert</span>\n      <span><i style=\"background:var(--blue)\"></i>7-Tage-Schnitt</span>\n      <span><i style=\"background:var(--teal)\"></i>kcal (7-Tage-Schnitt)</span>\n    </div>\n    <div class=\"stats\" style=\"margin-top:14px\" id=\"bodyStats\"></div>\n  </div>\n\n  <div class=\"card\">\n    <h2>Kraftverlauf</h2>\n    <label class=\"f\">Übung</label>\n    <button class=\"ghost expick\" id=\"anExBtn\" style=\"width:100%;margin-bottom:14px\"></button>\n    <div id=\"c-str\"></div>\n    <div class=\"legend\">\n      <span><i style=\"background:var(--ink)\"></i>e1RM (kg)</span>\n      <span><i style=\"background:var(--ochre)\"></i>Volumen pro Einheit (kg)</span>\n    </div>\n    <div class=\"stats\" style=\"margin-top:14px\" id=\"exStats\"></div>\n  </div>\n\n  <div class=\"card\">\n    <h2>Kraft vs. Körpergewicht</h2>\n    <p class=\"hint\" style=\"margin:0 0 12px\">Beides auf den ersten Wert normiert (= 100). Divergieren die Linien, verlierst du Gewicht ohne Kraft — oder umgekehrt.</p>\n    <div id=\"c-rel\"></div>\n    <div class=\"legend\">\n      <span><i style=\"background:var(--blue)\"></i>Körpergewicht</span>\n      <span><i style=\"background:var(--ink)\"></i>e1RM</span>\n      <span><i style=\"background:var(--signal)\"></i>Relative Kraft</span>\n    </div>\n    <div class=\"stats\" style=\"margin-top:14px\" id=\"relStats\"></div>\n  </div>\n\n  <div class=\"card\">\n    <h2>Wochenvolumen gesamt</h2>\n    <div id=\"c-vol\"></div>\n  </div>\n</section>\n\n<!-- ============ DATEN ============ -->\n<section class=\"view\" id=\"v-data\">\n  <div class=\"card\">\n    <h2>Import (CSV / Excel)</h2>\n    <p class=\"hint\" style=\"margin:0 0 12px\">Renpho-Export (Gewicht), ein Food-Diary-Report (.xlsx — importiert Mahlzeiten) oder ein beliebiges CSV mit Datums- und Wert-Spalte. Wird automatisch erkannt.</p>\n    <input type=\"file\" id=\"csvFile\" accept=\".csv,.xlsx,.xls,text/csv,text/plain\">\n    <div id=\"csvMap\" style=\"display:none;margin-top:12px\">\n      <div class=\"row\" style=\"margin-bottom:8px\">\n        <div><label class=\"f\">Datum</label><select id=\"mapDate\"></select></div>\n        <div><label class=\"f\">Gewicht</label><select id=\"mapW\"></select></div>\n      </div>\n      <div class=\"row\">\n        <div><label class=\"f\">Kalorien</label><select id=\"mapK\"></select></div>\n        <div><label class=\"f\">Protein</label><select id=\"mapP\"></select></div>\n      </div>\n      <button id=\"csvGo\" style=\"width:100%;margin-top:12px\">Importieren</button>\n    </div>\n    <div id=\"csvInfo\" class=\"hint\"></div>\n  </div>\n\n  <div class=\"card\">\n    <h2>Sicherung</h2>\n    <div class=\"row\">\n      <button class=\"ghost\" id=\"expJson\">Backup laden</button>\n      <button class=\"ghost\" id=\"impJsonBtn\">Backup einspielen</button>\n    </div>\n    <input type=\"file\" id=\"impJson\" accept=\".json\" style=\"display:none\">\n    <button class=\"ghost\" id=\"expCsv\" style=\"width:100%;margin-top:8px\">Als CSV exportieren</button>\n    <p class=\"hint\">Alle Daten liegen ausschließlich auf diesem Gerät. Backup regelmäßig in die Dateien-App legen.</p>\n  </div>\n\n  <div class=\"card\">\n    <h2>n8n API</h2>\n    <label class=\"f\" for=\"n8nUrl\">Webhook-URL</label>\n    <input id=\"n8nUrl\" placeholder=\"https://dein-n8n.de/webhook/kalorien\">\n    <button class=\"ghost tiny\" id=\"n8nSave\" style=\"width:100%;margin-top:10px\">URL speichern</button>\n    <p class=\"hint\">Die App sendet POST {text, date} und erwartet als Antwort JSON {kcal, protein}. Im n8n-Webhook-Node unter CORS die Domain deiner App erlauben.</p>\n  </div>\n\n  <div class=\"card\">\n    <h2>Als App installieren</h2>\n    <p class=\"hint\" style=\"margin:0\">Safari öffnen → Teilen-Symbol → „Zum Home-Bildschirm\". Danach startet das Logbuch im Vollbild mit eigenem Icon und funktioniert offline.</p>\n  </div>\n\n  <div class=\"card\">\n    <h2>Zurücksetzen</h2>\n    <button class=\"ghost\" id=\"wipe\" style=\"width:100%;color:var(--signal);border-color:var(--signal)\">Alle Daten löschen</button>\n  </div>\n</section>\n\n</main>\n\n<nav><div class=\"inner\">\n  <button data-v=\"log\" aria-current=\"page\">Training</button>\n  <button data-v=\"plan\">Plan</button>\n  <button data-v=\"body\">Körper</button>\n  <button data-v=\"an\">Analyse</button>\n  <button data-v=\"data\">Daten</button>\n</div></nav>\n\n<div class=\"toast\" id=\"toast\"></div>\n\n";
const EXTRA_CSS = `
.pickov{position:fixed;inset:0;z-index:60;background:rgba(15,23,32,.45);display:flex;align-items:flex-end;justify-content:center}
.picksheet{background:var(--card);border:1px solid var(--line);border-radius:16px 16px 0 0;width:100%;max-width:580px;max-height:78vh;display:flex;flex-direction:column;padding:14px 16px calc(14px + env(safe-area-inset-bottom))}
.picksearch{margin-bottom:10px}
.pickchips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.chip{padding:6px 11px;font-size:12px;border-radius:99px;background:var(--field);color:var(--ink);border:1px solid var(--line);font-weight:600}
.chip.on{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.picklist{overflow-y:auto;flex:1;min-height:120px}
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
.calov .picksheet{max-height:88vh;overflow-y:auto}
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
.card.input{background:var(--field);box-shadow:none}
.card.input > h2{color:var(--ink-30)}
.daytotals{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-bottom:14px}
.daytotals > div{background:var(--card);padding:9px 4px;text-align:center}
.daytotals span{display:block;font:600 9.5px/1 var(--sans);letter-spacing:.05em;text-transform:uppercase;color:var(--ink-60);margin-bottom:6px}
.daytotals b{font-family:var(--mono);font-size:16px;font-weight:500;font-variant-numeric:tabular-nums;color:var(--ink)}
`;
class LogbuchApp extends HTMLElement{
  connectedCallback(){
    if(this._i) return; this._i = 1;
    const root = this.attachShadow({mode:'open'});
    root.innerHTML = '<style>' + CSS + EXTRA_CSS + '</style>' + MARKUP;
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
  async save(d){
    const s = JSON.stringify(d);
    try{ localStorage.setItem(KEY,s); }catch(e){}
    try{ if(window.storage) await window.storage.set(KEY,s); }catch(e){}
  }
};

const DEFAULT_EX = ['Bankdrücken','Schrägbankdrücken KH','Kniebeuge','Kreuzheben','Rudern vorgebeugt','Latzug','Schulterdrücken KH','Beinpresse','Bizepscurls KH','Trizepsdrücken Kabel'];
const DEFAULT_MEALS = ['Frühstück','Mittagessen','Abendessen','Snack'];
const DEFAULT_GOALS = {sessions:3, setsPerMuscle:10, kcalTarget:2200, proteinTarget:150};

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

let db = {exercises:[...DEFAULT_EX], workouts:[], body:[], splits:[], exGroups:{}, n8nUrl:'', mealTypes:[...DEFAULT_MEALS], goals:{...DEFAULT_GOALS}, foodFav:[], nutrition:{...DEFAULT_NUTRITION}};

/* ---------------- Helfer ---------------- */
const $ = s => root.querySelector(s);
const $$ = s => [...root.querySelectorAll(s)];
const iso = d => new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const TODAY = iso(new Date());
const fmtDate = s => { const [y,m,d]=s.split('-'); return `${d}.${m}.${y.slice(2)}`; };
const num = v => { const n = parseFloat(String(v).replace(',','.')); return isFinite(n)?n:null; };
const e1rm = (w,r) => r>0 ? w*(1+r/30) : 0;
const round = (n,d=1) => Math.round(n*10**d)/10**d;
const uid = () => Math.random().toString(36).slice(2,9);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(t._x); t._x=setTimeout(()=>t.classList.remove('on'),2200); }

function sessionStats(w){
  const sets = w.sets.filter(s=>s.w!=null && s.r!=null);
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
function estimateMaintenance(){
  const b = bodySorted();
  const recent = b.filter(x=>x.weight!=null);
  const slope = linSlope(recent.map(x=>({x:new Date(x.date+'T12:00:00').getTime()/864e5, y:x.weight})));
  const perWk = slope!=null ? slope*7 : null;
  const kc = b.map(x=>x.kcal).filter(v=>v!=null);
  const kcAvg = kc.length ? kc.reduce((a,c)=>a+c,0)/kc.length : null;
  const bal = perWk!=null ? perWk*7700/7 : null;
  return (bal!=null && kcAvg!=null) ? kcAvg - bal : null;
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
  if(maint==null) return { kcal:null, source:'auto', reason:'zu wenig Daten (Gewicht + kcal über ~2 Wochen loggen)' };
  return { kcal: Math.round(maint + phaseDelta()), source:'auto', phase:n.phase, maint:Math.round(maint) };
}
const MUSCLE_RULES = [
  ['Bauch', ['bauch','crunch','plank','situp','sit-up','abs','core','rumpf','beinheben','russian twist','klappmesser']],
  ['Beine', ['kniebeuge','squat','beinpresse','bein','leg','ausfall','lunge','wade','calf','glute','hip','rdl','adduktor','abduktor']],
  ['Trizeps', ['trizep','tricep','pushdown','dip','french','skull','überkopfstreck']],
  ['Bizeps', ['bizep','bicep','curl','hammer']],
  ['Schultern', ['schulter','shoulder','seitheben','lateral','delt','military','overhead','arnold','face pull','reverse fly','frontheben']],
  ['Brust', ['bank','brust','chest','fliegende','butterfly','pec','liegestütz','push-up','pushup']],
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
function chart(series, opts={}){
  const W=520, H=opts.h||190, PL=38, PR=opts.pr||8, PT=10, PB=24;
  const all = series.flatMap(s=>s.pts);
  if(all.length<1) return `<div class="empty">Noch keine Daten</div>`;
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
  if(!A) return `<div class="empty">Noch keine Daten</div>`;
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
    const d = pts.map((p,i)=>`${i?'L':'M'}${X(p.x).toFixed(1)},${Y(p.y,ax).toFixed(1)}`).join(' ');
    g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.w||1.8}" stroke-linejoin="round" stroke-linecap="round" ${s.dash?`stroke-dasharray="3 3"`:''} opacity="${s.op||1}"/>`;
    if(s.dots) for(const p of pts) g += `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y,ax).toFixed(1)}" r="${s.dots}" fill="${s.color}"/>`;
    if(s.prs) for(const p of pts.filter(p=>p.pr)) g += `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y,ax).toFixed(1)}" r="3.4" fill="var(--signal)" stroke="var(--paper-2)" stroke-width="1.5"/>`;
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
    : '<div class="empty">Keine Übung gefunden</div>';
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
  b.innerHTML = `
    <div class="block-head">
      <button class="ghost expick"></button>
      <select class="exsel" style="display:none">${exOptions(exName||db.exercises[0])}</select>
      <button class="rm" aria-label="Übung entfernen">✕</button>
    </div>
    <div class="swap-tag" style="display:none">Getauscht — nur diese Einheit</div>
    <div class="ref"></div>
    <div class="sets"></div>
    <button class="ghost tiny addset" style="width:100%;margin:2px 0 8px">＋ Satz</button>
    <input class="note" placeholder="Notiz / Variation (optional)">
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

  function addSetRow(w='',r=''){
    const d = document.createElement('div');
    d.className='setrow';
    d.innerHTML = `<div class="setno"></div>
      <input type="number" step="0.5" inputmode="decimal" placeholder="kg" value="${w}">
      <input type="number" step="1" inputmode="numeric" placeholder="Wdh." value="${r}">
      <button class="del" aria-label="Satz entfernen">✕</button>`;
    d.querySelector('.del').onclick = ()=>{ d.remove(); renum(); };
    setsEl.appendChild(d); renum();
  }
  function renum(){ [...setsEl.querySelectorAll('.setno')].forEach((n,i)=>n.textContent=i+1); }
  function fill(){
    const ex = sel.value;
    const l = lastSession(ex);
    setsEl.innerHTML='';
    if(l && prefill){
      for(const s of l.sets) addSetRow(s.w,'');
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
  b.querySelector('.rm').onclick = ()=>b.remove();
  b.querySelector('.addset').onclick = ()=>{
    const rows = setsEl.querySelectorAll('.setrow');
    const last = rows[rows.length-1];
    addSetRow(last?last.querySelectorAll('input')[0].value:'', '');
  };
  fill();
  if(data){
    setsEl.innerHTML='';
    for(const s of (data.sets&&data.sets.length?data.sets:[{w:'',r:''}])) addSetRow(s.w??'', s.r??'');
    if(data.note) b.querySelector('.note').value = data.note;
  }
  $('#blocks').appendChild(b);
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
}

$('#daySel').addEventListener('change', loadDay);
$('#addBlock').onclick = async ()=>{
  const n = await pickExercise();
  if(!n) return;
  addBlock(n,false);
  const blk = $('#blocks').lastElementChild;
  if(blk) blk.dataset.planned='';
};

let editingSession = null;
let editingDayName = null;
$('#saveW').onclick = async ()=>{
  const date = $('#wdate').value||TODAY;
  const dayId = $('#daySel').value;
  const f = dayId ? findDay(dayId) : null;
  const sid = uid();
  const entries = [];
  for(const b of $$('#blocks .block')){
    const ex = b.querySelector('.exsel').value;
    if(ex==='__new__') continue;
    const sets = [...b.querySelectorAll('.setrow')].map(r=>{
      const [w,rp] = r.querySelectorAll('input');
      return {w:num(w.value), r:num(rp.value)};
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
  $('#wdate').value = TODAY;
  $('#blocks').innerHTML='';
  loadDay();
  renderAll();
  const vol = entries.reduce((a,e)=>a+sessionStats(e).vol,0);
  toast(wasEdit ? `Einheit aktualisiert — ${fmtDate(date)}` : prs.length ? `PR: ${prs.join(', ')}! — ${round(vol,0)} kg gesamt` : `Gespeichert — ${entries.length} Übungen · ${round(vol,0)} kg`);
};

function editSession(key){
  const entries = db.workouts.filter(w=>(w.sessionId||w.id)===key);
  if(!entries.length) return;
  editingSession = key;
  editingDayName = entries[0].day||null;
  fillDaySel();
  $('#daySel').value = '';
  $('#wdate').value = entries[0].date;
  $('#blocks').innerHTML='';
  for(const e of entries) addBlock(e.exercise, false, {sets:e.sets, note:e.note});
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
  const n = prompt('Name der Einheit (leer = Freies Training)', entries[0].day||'');
  if(n===null) return;
  const name = n.trim() || null;
  for(const e of entries) e.day = name;
  await Store.save(db); renderAll(); toast('Umbenannt');
}
function renderWList(){
  const groups = {};
  for(const w of db.workouts){
    const k = w.sessionId || w.id;
    (groups[k] = groups[k]||[]).push(w);
  }
  const gs = Object.values(groups).sort((a,b)=>a[0].date<b[0].date?1:-1).slice(0,15);
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
      <div class="li-d">${fmtDate(d)}<br><button class="link" data-edit="${g[0].sessionId||g[0].id}">bearbeiten</button><br><button class="link" data-rename="${g[0].sessionId||g[0].id}">umbenennen</button><br><button class="link warn" data-del="${g[0].sessionId||g[0].id}">löschen</button></div>
    </li>`;
  }).join('') : '<div class="empty">Noch keine Einheit</div>';
  $$('#wlist [data-edit]').forEach(b=>b.onclick=()=>editSession(b.dataset.edit));
  $$('#wlist [data-rename]').forEach(b=>b.onclick=()=>renameSession(b.dataset.rename));
  $$('#wlist [data-del]').forEach(b=>b.onclick=async()=>{
    if(!confirm('Diese Einheit löschen?')) return;
    db.workouts = db.workouts.filter(w=>(w.sessionId||w.id)!==b.dataset.del);
    await Store.save(db); renderAll(); toast('Gelöscht');
  });
}

/* ---------------- Plan ---------------- */
let openDay = null;
function renderPlan(){
  const host = $('#splits');
  host.innerHTML = db.splits.length ? '' : '<div class="empty">Noch kein Split angelegt</div>';
  for(const s of db.splits){
    const el = document.createElement('div');
    el.className='split';
    el.innerHTML = `
      <div class="split-head">
        <div class="t">${esc(s.name)}</div>
        <div>
          <button class="link" data-a="renS">umbenennen</button>
          <button class="link warn" data-a="delS" style="margin-left:8px">löschen</button>
        </div>
      </div>
      <div class="daysHost"></div>
      <div style="padding:10px 12px;border-top:1px solid var(--grid)">
        <button class="ghost tiny" data-a="addD" style="width:100%">＋ Trainingstag</button>
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
      const de = document.createElement('div');
      de.className='day';
      const isOpen = openDay===d.id;
      de.innerHTML = `
        <div class="day-head">
          <div>
            <div class="t">${esc(d.name)}</div>
            <div class="day-ex">${d.ex.length ? d.ex.map(esc).join(' · ') : '— keine Übungen —'}</div>
          </div>
          <button class="link" data-a="tog">${isOpen?'schließen':'bearbeiten'}</button>
        </div>
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
  const b = bodySorted();
  const ws = b.filter(x=>x.weight!=null);
  const last = ws[ws.length-1];
  const m = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
  const cur = m(ws.slice(-7).map(x=>x.weight));
  const prev = m(ws.slice(-14,-7).map(x=>x.weight));
  const kc = b.slice(-7).map(x=>x.kcal).filter(v=>v!=null);

  $('#bodyReadout').innerHTML = last ? `
    <div>
      <div class="lab">7-Tage-Schnitt</div>
      <div class="big">${cur!=null?round(cur,1).toFixed(1):'—'}<span> kg</span></div>
    </div>
    <div class="side">
      <div>zuletzt ${last.weight!=null?round(last.weight,1).toFixed(1)+' kg':'—'} · ${fmtDate(last.date)}</div>
      <div class="${prev!=null&&cur<prev?'down':prev!=null?'up':''}">${prev!=null?(cur>=prev?'+':'')+round(cur-prev,2)+' kg vs. Vorwoche':'—'}</div>
      <div>ø ${kc.length?round(m(kc),0)+' kcal':'kcal fehlen'}</div>
    </div>` : `<div><div class="lab">7-Tage-Schnitt</div><div class="big">—<span> kg</span></div></div>
      <div class="side"><div>Trag dein erstes Gewicht ein</div></div>`;

  const _rev = b.slice().reverse();
  $('#blist').innerHTML = _rev.slice(0,blistLimit).map(x=>`<li>
    <div class="li-main">
      <div class="li-t">${x.weight!=null?round(x.weight,1).toFixed(1)+' kg':'— kg'}</div>
      <div class="li-s">${[x.kcal!=null?x.kcal+' kcal':null, x.protein!=null?x.protein+' g P':null, x.fat!=null?x.fat+' g F':null, x.carbs!=null?x.carbs+' g KH':null, x.steps!=null?x.steps+' Schritte':null].filter(Boolean).join(' · ')||'nur Gewicht'}</div>
    </div>
    <div class="li-d">${fmtDate(x.date)}<br><button class="link warn" data-bdel="${x.date}">löschen</button></div>
  </li>`).join('') || '<div class="empty">Noch keine Einträge</div>';
  const _more=$('#blistMore');
  if(_more){ if(_rev.length>5){ _more.style.display=''; _more.textContent = blistLimit>=10 ? 'Weniger anzeigen' : 'Mehr anzeigen'; } else { _more.style.display='none'; } }
  $$('#blist [data-bdel]').forEach(btn=>btn.onclick=async()=>{
    db.body = db.body.filter(x=>x.date!==btn.dataset.bdel);
    await Store.save(db); renderAll(); toast('Gelöscht');
  });
}
$('#saveB').onclick = async ()=>{
  const d = $('#bdate').value||TODAY;
  const patch = {weight:num($('#bw').value), kcal:num($('#kcal').value), protein:num($('#prot').value), steps:num($('#steps').value)};
  if(Object.values(patch).every(v=>v==null)) return toast('Nichts eingetragen');
  let e = db.body.find(x=>x.date===d);
  if(!e){ e={date:d}; db.body.push(e); }
  for(const k in patch) if(patch[k]!=null) e[k]=patch[k];
  await Store.save(db);
  ['#bw','#kcal','#prot','#steps'].forEach(s=>$(s).value='');
  renderAll(); toast('Gespeichert — '+fmtDate(d));
};

/* ---------------- n8n Kalorien-API ---------------- */
$('#n8nSave').onclick = async ()=>{
  db.n8nUrl = $('#n8nUrl').value.trim();
  await Store.save(db);
  toast(db.n8nUrl ? 'Webhook-URL gespeichert' : 'Webhook-URL entfernt');
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
  $('#mealList').innerHTML = meals.length ? meals.map(m=>`<li>
    <div class="li-main"><div class="li-t">${esc(m.name||'Mahlzeit')}</div>
    <div class="li-s">${m.text?esc(m.text)+' — ':''}${Math.round(m.kcal||0)} kcal · ${Math.round(m.protein||0)} g P${m.fat!=null?' · '+Math.round(m.fat)+' g F':''}${m.carbs!=null?' · '+Math.round(m.carbs)+' g KH':''}</div></div>
    <div class="li-d">${m.k100!=null?`<button class="link" data-medit="${m.id}">Menge</button><br>`:''}<button class="link warn" data-mdel="${m.id}">löschen</button></div></li>`).join('')
    + `<li><div class="li-main"><div class="li-t">Summe ${fmtDate(d)}</div></div><div class="li-d" style="font-size:12px">${Math.round(sum.k)} kcal · ${Math.round(sum.p)} g P · ${Math.round(sum.f)} g F · ${Math.round(sum.c)} g KH</div></li>` : '';
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
    e.kcal = Math.max(0, Math.round((e.kcal||0) - (m.kcal||0) + nk));
    e.protein = Math.max(0, Math.round((e.protein||0) - (m.protein||0) + np));
    if(m.fat!=null && nf!=null) e.fat = Math.max(0, Math.round((e.fat||0) - m.fat + nf));
    if(m.carbs!=null && nc!=null) e.carbs = Math.max(0, Math.round((e.carbs||0) - m.carbs + nc));
    m.kcal = nk; m.protein = np; if(nf!=null) m.fat = nf; if(nc!=null) m.carbs = nc; m.g = g;
    if(m.pname) m.text = `${m.pname} — ${g} g`;
    else if(m.text) m.text = m.text.replace(/—\s*[\d.,]+\s*g/, '— '+g+' g');
    await Store.save(db); renderAll(); toast('Menge geändert');
  });
}
$('#bdate').addEventListener('change', ()=>{ renderMeals(); renderNutri(); });
$('#foodGo').onclick = async ()=>{
  const date = $('#bdate').value||TODAY;
  const text = $('#foodTxt').value.trim();
  let kc = num($('#mealKcal').value), pr = num($('#mealProt').value), ft = num($('#mealFat').value), cb = num($('#mealCarb').value);
  if(!text && kc==null) return toast('Essen eingeben oder kcal angeben');
  const btn = $('#foodGo');
  if(kc==null){
    if(!db.n8nUrl) return toast('kcal angeben oder n8n-URL im Daten-Tab eintragen');
    btn.disabled = true; btn.textContent = 'Berechne…';
    try{
      const r = await fetch(db.n8nUrl, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({text, date, meal: curMeal})
      });
      if(!r.ok) throw new Error('HTTP '+r.status);
      const d = await r.json();
      kc = num(d.kcal);
      if(pr==null) pr = num(d.protein);
      if(ft==null) ft = num(d.fat);
      if(cb==null) cb = num(d.carbs);
      if(kc==null) throw new Error('Antwort enthält kein kcal');
    }catch(err){
      btn.disabled = false; btn.textContent = 'Mahlzeit eintragen';
      return toast('API-Fehler: '+err.message);
    }
    btn.disabled = false; btn.textContent = 'Mahlzeit eintragen';
  }
  let e = db.body.find(x=>x.date===date);
  if(!e){ e={date}; db.body.push(e); }
  e.kcal = Math.round((e.kcal||0) + (kc||0));
  if(pr!=null) e.protein = Math.round((e.protein||0) + pr);
  if(ft!=null) e.fat = Math.round((e.fat||0) + ft);
  if(cb!=null) e.carbs = Math.round((e.carbs||0) + cb);
  (e.meals = e.meals||[]).push({id:uid(), name:curMeal, text, kcal:Math.round(kc||0), protein:Math.round(pr||0), fat:ft!=null?Math.round(ft):null, carbs:cb!=null?Math.round(cb):null});
  $('#foodTxt').value=''; $('#mealKcal').value=''; $('#mealProt').value=''; $('#mealFat').value=''; $('#mealCarb').value='';
  await Store.save(db);
  renderAll();
  toast(`${curMeal}: ${Math.round(kc||0)} kcal${pr!=null?' · '+Math.round(pr)+' g Protein':''} — ${fmtDate(date)}`);
};

/* ---------------- Open Food Facts: Produktsuche & Barcode ---------------- */
const OFF='https://world.openfoodfacts.org';
function mapProd(p){
  const n=p.nutriments||{};
  const kc=num(n['energy-kcal_100g']);
  if(kc==null) return null;
  const pr=num(n['proteins_100g']);
  const ft=num(n['fat_100g']);
  const cb=num(n['carbohydrates_100g']);
  return {code:p.code, name:(p.product_name||'Unbenannt').trim(), brand:(p.brands||'').split(',')[0].trim(), kc100:kc, pr100:pr!=null?pr:0, ft100:ft!=null?ft:0, cb100:cb!=null?cb:0, qty:(p.quantity||'').trim(), serving:num(p.serving_quantity)||0};
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
  const u=OFF+'/cgi/search.pl?search_terms='+encodeURIComponent(q)+'&search_simple=1&action=process&json=1&page_size=30&fields=code,product_name,brands,nutriments,quantity,serving_quantity';
  const d=await fetchJSONRetry(u,{signal});
  return (d.products||[]).map(mapProd).filter(Boolean);
}
async function offBarcode(code){
  const u=OFF+'/api/v2/product/'+encodeURIComponent(code)+'.json?fields=code,product_name,brands,nutriments,quantity,serving_quantity';
  const d=await fetchJSONRetry(u,{tries:4});
  if(d.status!==1 || !d.product) return null;
  return mapProd(d.product);
}

async function addFoodMeal(text, kc, pr, meta){
  meta = meta||{};
  const ft = meta.fat, cb = meta.carbs;
  const date=$('#bdate').value||TODAY;
  let e=db.body.find(x=>x.date===date); if(!e){ e={date}; db.body.push(e); }
  e.meals=e.meals||[];
  e.kcal=Math.round((e.kcal||0)+(kc||0));
  if(pr!=null) e.protein=Math.round((e.protein||0)+pr);
  if(ft!=null) e.fat=Math.round((e.fat||0)+ft);
  if(cb!=null) e.carbs=Math.round((e.carbs||0)+cb);
  const m={id:uid(), name:curMeal, text, kcal:Math.round(kc||0), protein:Math.round(pr||0), fat:ft!=null?Math.round(ft):null, carbs:cb!=null?Math.round(cb):null};
  m.k100=meta.k100; m.p100=meta.p100; m.f100=meta.f100; m.c100=meta.c100; m.g=meta.g; m.pname=meta.pname;
  e.meals.push(m);
  await Store.save(db); renderAll();
  toast(`${curMeal}: ${Math.round(kc||0)} kcal · ${Math.round(pr||0)} g P`);
}
function pushFav(p){
  db.foodFav=(db.foodFav||[]).filter(f=>!(f.name===p.name && f.brand===p.brand));
  db.foodFav.unshift({code:p.code,name:p.name,brand:p.brand,kc100:p.kc100,pr100:p.pr100,ft100:p.ft100||0,cb100:p.cb100||0,qty:p.qty||'',serving:p.serving||0});
  db.foodFav=db.foodFav.slice(0,24);
}
function showFavs(){
  const list=foodOv.querySelector('.prodlist');
  const favs=db.foodFav||[];
  if(!favs.length){ list.innerHTML='<div class="empty">Tippe mind. 2 Buchstaben — oder scanne einen Barcode</div>'; return; }
  list.innerHTML='<div class="pickgrp">Zuletzt genutzt</div>'+favs.map((p,i)=>`<button class="pickitem prod" data-f="${i}"><div class="li-t">${esc(p.name)}</div><div class="li-s">${p.brand?esc(p.brand)+' · ':''}${Math.round(p.kc100)} kcal · ${round(p.pr100,1)} g P / 100 g</div></button>`).join('');
  list.querySelectorAll('.prod').forEach(b=>b.onclick=()=>showProdDetail(favs[+b.dataset.f]));
}

const foodOv=document.createElement('div'); foodOv.className='pickov'; foodOv.style.display='none';
foodOv.innerHTML=`<div class="picksheet">
  <div class="foodhead"><input class="picksearch prodq" type="text" placeholder="Produkt tippen — Vorschläge erscheinen"><button class="ghost tiny prodgo">Suchen</button></div>
  <div class="picklist prodlist"></div>
  <div class="proddetail" style="display:none"></div>
  <button class="link foodclose" style="margin-top:6px;text-align:center;width:100%">Schließen</button>
</div>`;
root.appendChild(foodOv);
function closeFood(){ foodOv.style.display='none'; }
foodOv.querySelector('.foodclose').onclick=closeFood;
foodOv.addEventListener('click', e=>{ if(e.target===foodOv) closeFood(); });
function openFood(){
  foodOv.querySelector('.prodq').value='';
  foodOv.querySelector('.prodlist').style.display='block';
  foodOv.querySelector('.proddetail').style.display='none';
  foodOv.querySelector('.foodhead').style.display='flex';
  foodOv.style.display='flex';
  showFavs();
  setTimeout(()=>foodOv.querySelector('.prodq').focus(),60);
}
let searchTimer=null, searchAbort=null;
function renderResults(res, list){
  if(!res.length){ list.innerHTML='<div class="empty">Nichts gefunden</div>'; return; }
  list.innerHTML=res.map((p,i)=>`<button class="pickitem prod" data-i="${i}"><div class="li-t">${esc(p.name)}</div><div class="li-s">${p.brand?esc(p.brand)+' · ':''}${Math.round(p.kc100)} kcal · ${round(p.pr100,1)} g P / 100 g${p.qty?' · '+esc(p.qty):''}</div></button>`).join('');
  list.querySelectorAll('.prod').forEach(b=>b.onclick=()=>showProdDetail(res[+b.dataset.i]));
}
async function runSearch(q){
  const list=foodOv.querySelector('.prodlist');
  if(searchAbort) searchAbort.abort();
  searchAbort=new AbortController();
  list.innerHTML='<div class="empty">Suche…</div>';
  try{
    const res=await offSearch(q, searchAbort.signal);
    if(foodOv.querySelector('.prodq').value.trim()!==q) return; // veraltet
    renderResults(res, list);
  }catch(e){
    if(e.name==='AbortError') return;
    list.innerHTML='<div class="empty">Keine Verbindung zur Datenbank ('+esc(e.message||'')+') — nochmal versuchen</div>';
  }
}
function onQueryInput(){
  const q=foodOv.querySelector('.prodq').value.trim();
  clearTimeout(searchTimer);
  const list=foodOv.querySelector('.prodlist');
  if(q.length<2){ if(searchAbort) searchAbort.abort(); showFavs(); return; }
  searchTimer=setTimeout(()=>runSearch(q), 350);
}
foodOv.querySelector('.prodq').addEventListener('input', onQueryInput);
foodOv.querySelector('.prodgo').onclick=()=>{ const q=foodOv.querySelector('.prodq').value.trim(); if(q.length>=2) runSearch(q); };
foodOv.querySelector('.prodq').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const q=e.target.value.trim(); if(q.length>=2) runSearch(q); } });
function showProdDetail(p){
  const det=foodOv.querySelector('.proddetail');
  foodOv.querySelector('.prodlist').style.display='none';
  foodOv.querySelector('.foodhead').style.display='none';
  det.style.display='block';
  const presets=[];
  if(p.serving>0) presets.push([Math.round(p.serving),'1 Portion ('+Math.round(p.serving)+' g)']);
  [50,100,150,200].forEach(g=>presets.push([g, g+' g']));
  det.innerHTML=`
    <button class="link prodback">← zurück</button>
    <div class="li-t" style="font-size:16px;margin:6px 0 2px">${esc(p.name)}</div>
    <div class="li-s">${p.brand?esc(p.brand)+' · ':''}${Math.round(p.kc100)} kcal · ${round(p.pr100,1)} g P · ${round(p.ft100||0,1)} g F · ${round(p.cb100||0,1)} g KH / 100 g</div>
    <label class="f" style="margin-top:16px">Menge (g / ml)</label>
    <input type="number" class="prodg" inputmode="numeric" value="${p.serving>0?Math.round(p.serving):100}">
    <div class="pickchips prodport" style="margin-top:8px">${presets.map(([g,l])=>`<button class="chip" data-g="${g}">${l}</button>`).join('')}</div>
    <div class="prodcalc" style="margin:14px 0"></div>
    <button class="prodadd" style="width:100%">Zu ${esc(curMeal)} hinzufügen</button>`;
  const g=det.querySelector('.prodg'), calc=det.querySelector('.prodcalc');
  function upd(){ const grams=num(g.value)||0; const kc=p.kc100*grams/100, pr=p.pr100*grams/100, ft=(p.ft100||0)*grams/100, cb=(p.cb100||0)*grams/100; calc.innerHTML=`<b>${Math.round(kc)} kcal</b> · ${round(pr,1)} g P · ${round(ft,1)} g F · ${round(cb,1)} g KH`; return {kc,pr,ft,cb,grams}; }
  g.oninput=upd; upd();
  det.querySelectorAll('.prodport .chip').forEach(b=>b.onclick=()=>{ g.value=b.dataset.g; upd(); });
  det.querySelector('.prodback').onclick=()=>{ det.style.display='none'; foodOv.querySelector('.prodlist').style.display='block'; foodOv.querySelector('.foodhead').style.display='flex'; };
  det.querySelector('.prodadd').onclick=async()=>{ const {kc,pr,ft,cb,grams}=upd(); const text=`${p.name}${p.brand?' ('+p.brand+')':''} — ${Math.round(grams)} g`; pushFav(p); await addFoodMeal(text, kc, pr, {k100:p.kc100, p100:p.pr100, f100:p.ft100||0, c100:p.cb100||0, fat:ft, carbs:cb, g:Math.round(grams), pname:p.name+(p.brand?' ('+p.brand+')':'')}); closeFood(); };
}

/* ---- Barcode-Scanner ---- */
let _zxP=null;
function loadZX(){ if(window.ZXing) return Promise.resolve(window.ZXing); if(_zxP) return _zxP; _zxP=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js'; s.onload=()=>res(window.ZXing); s.onerror=()=>rej(new Error('ZXing load failed')); document.head.appendChild(s); }); return _zxP; }
const scanOv=document.createElement('div'); scanOv.className='pickov'; scanOv.style.display='none';
scanOv.innerHTML=`<div class="picksheet">
  <div class="li-t" style="margin-bottom:8px">Barcode scannen</div>
  <div class="scanwrap"><video class="scanvid" playsinline muted></video></div>
  <div class="scaninfo li-s" style="margin-top:8px">Kamera wird gestartet…</div>
  <label class="f" style="margin-top:12px">oder Barcode-Nummer eingeben</label>
  <div class="row"><input class="scancode" inputmode="numeric" placeholder="z. B. 4056489095736"><button class="ghost tiny scango" style="flex:0 0 auto">OK</button></div>
  <button class="link scanclose" style="margin-top:12px;text-align:center;width:100%">Schließen</button>
</div>`;
root.appendChild(scanOv);
let scanStream=null, scanRAF=null, scanZX=null, scanActive=false;
function stopScan(){ scanActive=false; if(scanRAF){ cancelAnimationFrame(scanRAF); scanRAF=null; } if(scanZX){ try{scanZX.reset();}catch(e){} scanZX=null; } if(scanStream){ scanStream.getTracks().forEach(t=>t.stop()); scanStream=null; } }
function closeScan(){ stopScan(); scanOv.style.display='none'; }
scanOv.querySelector('.scanclose').onclick=closeScan;
scanOv.addEventListener('click', e=>{ if(e.target===scanOv) closeScan(); });
scanOv.querySelector('.scango').onclick=()=>{ const c=scanOv.querySelector('.scancode').value.trim(); if(c) handleCode(c); };
scanOv.querySelector('.scancode').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const c=e.target.value.trim(); if(c) handleCode(c); } });
async function handleCode(code){
  stopScan(); scanOv.style.display='none';
  toast('Suche Produkt…');
  let p=null; try{ p=await offBarcode(code); }catch(e){}
  if(!p){ toast('Produkt nicht gefunden ('+esc(code)+')'); return; }
  foodOv.querySelector('.foodhead').style.display='none';
  foodOv.querySelector('.prodlist').style.display='none';
  foodOv.style.display='flex';
  showProdDetail(p);
}
async function openScan(){
  scanOv.querySelector('.scancode').value='';
  const vid=scanOv.querySelector('.scanvid'), info=scanOv.querySelector('.scaninfo');
  info.textContent='Kamera wird gestartet…';
  scanOv.style.display='flex';
  scanActive=true;
  // Weg 1: nativer BarcodeDetector (Android/Chrome)
  if('BarcodeDetector' in window){
    try{
      scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}});
      vid.srcObject=scanStream; await vid.play();
      info.textContent='Kamera auf den Barcode richten.';
      const det=new window.BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','code_128','code_39','itf']});
      const loop=async()=>{ if(!scanActive) return; try{ const cs=await det.detect(vid); if(cs&&cs.length){ handleCode(cs[0].rawValue); return; } }catch(e){} scanRAF=requestAnimationFrame(loop); };
      loop();
    }catch(e){ info.textContent='Kamera nicht verfügbar — bitte Nummer eingeben.'; scanActive=false; }
    return;
  }
  // Weg 2: ZXing steuert die Kamera selbst (iOS Safari)
  try{
    const ZX=await loadZX();
    scanZX=new ZX.BrowserMultiFormatReader();
    const cb=(result)=>{ if(result && scanActive){ scanActive=false; handleCode(result.getText()); } };
    info.textContent='Kamera auf den Barcode richten.';
    try{
      await scanZX.decodeFromConstraints({video:{facingMode:{ideal:'environment'}}}, vid, cb);
    }catch(e1){
      await scanZX.decodeFromVideoDevice(undefined, vid, cb);
    }
  }catch(e){ info.textContent='Kamera nicht verfügbar — bitte Nummer eingeben.'; scanActive=false; }
}
const _psb=$('#prodSearchBtn'); if(_psb) _psb.onclick=openFood;
const _bcb=$('#barcodeBtn'); if(_bcb) _bcb.onclick=openScan;

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
  const now = Date.now();
  const T = s => new Date(s+'T12:00:00').getTime();
  const inWeek = d => (now - T(d)) < 7*864e5 && T(d) <= now;
  // Einheiten (eindeutige Session-IDs mit Datum in den letzten 7 Tagen)
  const sessDates = {};
  for(const w of db.workouts){ if(inWeek(w.date)){ sessDates[w.sessionId||w.id] = true; } }
  const sessions = Object.keys(sessDates).length;
  // Sätze pro Muskelgruppe in den letzten 7 Tagen
  const byG = {};
  for(const w of db.workouts){ if(inWeek(w.date)){ const grp = muscleOf(w.exercise); byG[grp] = (byG[grp]||0) + w.sets.length; } }
  let html = goalBar('Gym-Einheiten', sessions, g.sessions, sessions>=g.sessions?'Ziel erreicht — stark!':`Noch ${g.sessions-sessions} Einheit${g.sessions-sessions===1?'':'en'} diese Woche`);
  html += `<div class="pickgrp" style="padding:14px 0 8px">Sätze pro Muskelgruppe (Ziel ${g.setsPerMuscle})</div>`;
  const groups = GROUP_ORDER.filter(x=>byG[x]!=null || db.exercises.some(e=>muscleOf(e)===x));
  const shown = groups.filter(x=>byG[x]); // nur Gruppen mit Aktivität
  if(shown.length){
    for(const grp of GROUP_ORDER){ if(byG[grp]) html += goalBar(grp, byG[grp], g.setsPerMuscle); }
  } else {
    html += `<div class="empty">Noch keine Sätze in den letzten 7 Tagen</div>`;
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
function renderAnalysis(){
  renderGoals();
  renderAnPeriod();
  const T = s => new Date(s+'T12:00:00').getTime();
  const win = anWindow();
  const inWin = date => { const t=T(date); return (win.from==null||t>=win.from) && (win.to==null||t<=win.to); };
  const b = bodySorted().filter(x=>inWin(x.date));

  const w7 = sma(b,'weight',anAvg), k7 = sma(b,'kcal',anAvg);
  $('#c-weight').innerHTML = chart([
    {pts:b.map(x=>({x:T(x.date),y:x.kcal!=null?x.kcal:null})).filter(p=>p.y!=null), color:'var(--teal)', axis:'r', type:'bar', op:.28},
    {pts:b.map((x,i)=>({x:T(x.date),y:k7[i]})).filter(p=>p.y!=null), color:'var(--teal)', axis:'r', w:1.4, dash:true},
    {pts:b.map(x=>({x:T(x.date),y:x.weight})).filter(p=>p.y!=null), color:'var(--ink-30)', w:1, dots:1.4},
    {pts:b.map((x,i)=>({x:T(x.date),y:w7[i]})).filter(p=>p.y!=null), color:'var(--blue)', w:2.4},
  ], {pr:34});

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
    <div class="stat"><div class="k">Erhaltungsbedarf</div><div class="v">${maint!=null?round(maint,0):'—'}</div><div class="s">${prAll.length&&lastW?'ø '+round(prAll.slice(-14).reduce((a,c)=>a+c,0)/Math.min(14,prAll.length),0)+' g P ≈ '+round((prAll.slice(-1)[0]||0)/lastW.weight,2)+' g/kg':'aus Trend + kcal'}</div></div>`;

  const ex = anExSel;
  const ws = db.workouts.filter(w=>w.exercise===ex && inWin(w.date)).sort((a,b)=>a.date<b.date?-1:1);
  const pts = ws.map(w=>({date:w.date, ...sessionStats(w)}));
  let best=0; const e1 = pts.map(p=>{ const pr = p.best>best; best=Math.max(best,p.best); return {x:T(p.date), y:p.best, pr}; });
  $('#c-str').innerHTML = chart([
    {pts:pts.map(p=>({x:T(p.date),y:p.vol})), color:'var(--ochre)', axis:'r', type:'bar', op:.35},
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
    $('#c-rel').innerHTML = '<div class="empty">Braucht Gewicht + Training am selben Zeitraum</div>';
    $('#relStats').innerHTML = '';
  }

  const byWeek = {};
  for(const w of db.workouts){
    if(!inWin(w.date)) continue;
    const d = new Date(T(w.date)); const day=(d.getDay()+6)%7;
    const mon = new Date(d.getTime()-day*864e5); const k = iso(mon);
    byWeek[k] = (byWeek[k]||0) + sessionStats(w).vol;
  }
  const wk = Object.keys(byWeek).sort();
  $('#c-vol').innerHTML = wk.length ? chart([{pts:wk.map(k=>({x:T(k),y:byWeek[k]})), color:'var(--ochre)', type:'bar', op:.6}],{zero:true,h:150}) : '<div class="empty">Noch keine Daten</div>';
}
let anPeriod='all', anAvg=7;
const AN_PERIODS=[['7','7 Tage'],['30','30 Tage'],['90','3 Monate'],['all','Alles'],['custom','Indiv.']];
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
  const host=$('#anPeriod'); if(!host) return;
  host.innerHTML=AN_PERIODS.map(([v,l])=>`<button class="chip${v===anPeriod?' on':''}" data-p="${v}">${l}</button>`).join('');
  host.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ anPeriod=b.dataset.p; renderAnPeriod(); renderAnalysis(); });
  const cust=$('#anCustom'); if(cust) cust.style.display = anPeriod==='custom'?'flex':'none';
  const av=$('#anAvg'); if(av && root.activeElement!==av) av.value=anAvg;
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
    html += `<li style="display:block;border-top:0;padding:12px 0 2px"><div class="pickgrp" style="padding:0">${g}</div></li>`;
    html += byG[g].map(e=>{
      const n = db.workouts.filter(w=>w.exercise===e).length;
      return `<li><div class="li-main"><div class="li-t">${esc(e)}</div><div class="li-s">${n} Einheiten</div></div>
        <div class="li-d"><button class="link" data-exgrp="${esc(e)}">Gruppe ändern</button>${n?'':`<br><button class="link warn" data-exdel="${esc(e)}">entfernen</button>`}</div></li>`;
    }).join('');
  }
  $('#exlist').innerHTML = html;
  $$('#exlist [data-exgrp]').forEach(b=>b.onclick=async()=>{
    const name = b.dataset.exgrp;
    const g = await chooseGroup(name, muscleOf(name));
    if(!g) return;
    db.exGroups[name] = g;
    await Store.save(db); renderAll(); toast(`${name} → ${g}`);
  });
  $$('#exlist [data-exdel]').forEach(b=>b.onclick=async()=>{
    const name = b.dataset.exdel;
    db.exercises = db.exercises.filter(e=>e!==name);
    delete db.exGroups[name];
    for(const s of db.splits) for(const d of s.days) d.ex = d.ex.filter(x=>x!==name);
    await Store.save(db); renderAll();
  });
}

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
$('#expJson').onclick = ()=>dl(`logbuch-${TODAY}.json`, JSON.stringify(db,null,1));
$('#impJsonBtn').onclick = ()=>$('#impJson').click();
$('#impJson').onchange = async e=>{
  const f=e.target.files[0]; if(!f) return;
  try{
    const d = JSON.parse(await f.text());
    if(!d.workouts||!d.body) throw 0;
    db = {exercises:d.exercises?.length?d.exercises:[...DEFAULT_EX], workouts:d.workouts, body:d.body, splits:d.splits||[], exGroups:d.exGroups||{}, n8nUrl:d.n8nUrl||db.n8nUrl||'', mealTypes:d.mealTypes?.length?d.mealTypes:[...DEFAULT_MEALS], goals:{...DEFAULT_GOALS, ...(d.goals||{})}, foodFav:d.foodFav||[], nutrition:{...DEFAULT_NUTRITION, ...(d.nutrition||{})}};
    await Store.save(db); renderAll(); toast('Backup eingespielt');
  }catch(err){ toast('Datei nicht lesbar'); }
};
$('#expCsv').onclick = ()=>{
  const a = ['datum;typ;tag;uebung;saetze;volumen_kg;e1rm_kg;gewicht_kg;kcal;protein_g;notiz'];
  for(const w of [...db.workouts].sort((x,y)=>x.date<y.date?-1:1)){
    const s = sessionStats(w);
    a.push([w.date,'training',w.day||'',w.exercise,w.sets.map(x=>`${x.w}x${x.r}`).join(' '),round(s.vol,0),round(s.best,1),'','','',(w.note||'').replace(/;/g,',')].join(';'));
  }
  for(const b of bodySorted()) a.push([b.date,'koerper','','','','','',b.weight??'',b.kcal??'',b.protein??'',''].join(';'));
  dl(`logbuch-${TODAY}.csv`, a.join('\n'), 'text/csv');
};
$('#wipe').onclick = async ()=>{
  if(!confirm('Alle Trainings-, Plan- und Körperdaten unwiderruflich löschen?')) return;
  db = {exercises:[...DEFAULT_EX], workouts:[], body:[], splits:[]};
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
const _nutriEdit=$('#nutriEdit');
if(_nutriEdit) _nutriEdit.onclick=async()=>{ const p=prompt('Protein-Ziel (g/Tag)', db.goals.proteinTarget||''); if(p===null) return; const pn=parseInt(p,10); if(isFinite(pn)&&pn>=0) db.goals.proteinTarget=pn; await Store.save(db); renderNutri(); toast('Protein-Ziel gesetzt'); };
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
  if(b.dataset.v==='goals') renderGoals();
  if(b.dataset.v==='cal') renderCal();
});

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
function renderAll(){
  fillDaySel();
  fillAnEx();
  renderWList(); renderPlan(); renderBody(); renderAnalysis(); renderExList(); renderCal();
  renderMealChips(); renderMeals(); renderNutri(); renderGoals();
}

/* ---------------- PWA & Tagesziele ---------------- */
const ICON180='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAABx0lEQVR42u3dywnCUBCG0ZuLZYglWIB7wYKyEcxOsCXBvYVYiQ2ILzD8MuesAzKTj2BQuMN6Ghs80q0AcSAOxIE4EAfiQByIA3EgDhAH4kAciANxIA7EgTgQB+IAcSAOxIE4EAfiQByIA3EgDhAH4kAciANxIA7EgTgQB+JAHCAOxIE4EAfiQByIA3EgDsQB4kAciANxIA7EgTgQB+JAHNAWM3/e7Xx5fsFqt618P6L206Mmf/OasmXMvJ8eNXnlPgL309Mmr9lH5n564OTV+ojdj7cVxIE4EAfiQByIA3EgDsSBOEAciIP2f/8E+8h1f6xwD5apvz97ciAOxIE4EAfiQByIA3EgDsQB4kAciANxIA7EgTho/ib4O5vTwR3y5EAciANxIA7EAeJAHIgDcSAOxIE4EMcr3508Vec8r9j99Mz5q530lrmfHjh/zTMAA/fT0+avfDpk2n6G9TT65oW3FcSBOBAH4kAciANxIA7EAeJAHIgDcSAOxIE4EAfiQBwgDsSBOBAH4kAciANxIA7EgThAHIgDcSAOxIE4EAfiQByIA8SBOBAH4kAciANxIA7EgThAHIgDcSAOxIE4EAfiQByIg+ruMY0+Opirr/oAAAAASUVORK5CYII=';
const ICON512='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAGX0lEQVR42u3aQanjQBSG0RmjMoxKUAHOBSpIicGTGdzSgHIXokqcOjTYaCTfcwrYfQz359NjNw9lTgDEc/IEAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAm+k8wZfWuvzqj+qn0XtiMiazmTyU2Ss0v2NnjcmYjABEv2M3jcmYjACEvmM3jcmYTPKPwMFPudVfCiYjAOziqhw0JmMyApDC3pODxmRMRgDiXpKDxmRMRgAAEIBgHxG+aDAZkxEAAAQg2OeDLxpMxmQEAAABCPbh4IsGl2kyAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAcT+cJjuh5vXsE9uZcF4/gNwAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAIA2Ok9wRJfHzSMAfgMAQAAAEAAABAAAAQBAAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAABAEAAABAAAAQAAAEAQAAAEIB/00+jHwxMRgAAEAAABMCvtH4kMBkBAEAAfNH4lsFk/DACgFMGkxEAZwQmgwA4aIvCZExGABy0U8ZkTKaVPJTZK3xurYs7BpMRADftlMFkBMBNu2MwGQFw044YTEYAAEj+FxAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgAgAJ4AQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEA4N0LdM2T+BRJFGcAAAAASUVORK5CYII=';
function setupPWA(){
  const head=document.head;
  const has=sel=>head.querySelector(sel);
  const meta=(n,c)=>{ if(!has('meta[name="'+n+'"]')){ const m=document.createElement('meta'); m.name=n; m.content=c; head.appendChild(m); } };
  const link=(rel,href)=>{ const l=document.createElement('link'); l.rel=rel; l.href=href; head.appendChild(l); };
  meta('theme-color','#2E7D74');
  meta('apple-mobile-web-app-capable','yes');
  meta('apple-mobile-web-app-status-bar-style','black-translucent');
  meta('apple-mobile-web-app-title','Logbuch');
  if(!has('link[rel="apple-touch-icon"]')) link('apple-touch-icon', ICON180);
  if(!has('link[rel="icon"][href^="data:image/png"]')) link('icon', ICON512);
  try{
    const manifest={name:'Logbuch',short_name:'Logbuch',start_url:'.',scope:'.',display:'standalone',background_color:'#10151A',theme_color:'#2E7D74',icons:[{src:ICON512,sizes:'512x512',type:'image/png',purpose:'any maskable'},{src:ICON180,sizes:'180x180',type:'image/png'}]};
    link('manifest', URL.createObjectURL(new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'})));
  }catch(e){}
  try{ if(navigator.storage&&navigator.storage.persist) navigator.storage.persist(); }catch(e){}
  try{ if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{}); }catch(e){}

}
// Macro-Ziele aus dem (phasenabhängigen) Kalorienziel ableiten.
function macroTargets(){
  const t=calorieTarget();
  const kcal=t.kcal;
  const pt=(db.goals&&db.goals.proteinTarget)||0;
  let fat=null, carb=null;
  if(kcal!=null){
    fat=Math.round(kcal*0.25/9);
    carb=Math.max(0, Math.round((kcal - pt*4 - fat*9)/4));
  }
  return {kcal, protein:pt||null, fat, carb, info:t};
}
function renderNutri(){
  const box=$('#targetBox'); const host=$('#nutriBars');
  if(!box && !host) return;
  const n=db.nutrition||DEFAULT_NUTRITION;
  if(typeof updatePhaseSeg==='function') updatePhaseSeg(n.phase);
  const tg=macroTargets();
  const d=$('#bdate').value||TODAY;
  const e=db.body.find(x=>x.date===d)||{};
  const kc=Math.round(e.kcal||0), pr=Math.round(e.protein||0), ft=Math.round(e.fat||0), cb=Math.round(e.carbs||0);

  let kt=null, metaStr='';
  const phaseLabel={maintain:'Maintain (Recomp)',cut:'Cut',bulk:'Bulk'}[n.phase]||n.phase;
  if(n.mode==='manual'){ kt=(n.manualKcal!=null?n.manualKcal:(db.goals.kcalTarget||null)); metaStr='manuell'; }
  else if(tg.kcal==null){ kt=null; metaStr=tg.info.reason||'zu wenig Daten'; }
  else { const dl=phaseDelta(); kt=tg.kcal; metaStr=phaseLabel+(tg.info.maint?' · Erhalt ~'+tg.info.maint:'')+(dl?' · '+(dl>0?'+':'')+dl+' kcal':''); }

  if(box){
    const R=52, C=Math.round(2*Math.PI*R);
    const frac=(kt&&kt>0)?Math.min(1,kc/kt):0;
    const over=(kt&&kc>kt);
    const dash=Math.round(C*frac);
    const ringColor=over?'var(--signal)':'var(--accent)';
    const centerBig=(kt!=null)?(over?'+'+(kc-kt):Math.max(0,kt-kc)):'—';
    const centerLab=(kt==null)?'KEIN ZIEL':(over?'KCAL ÜBER':'KCAL ÜBRIG');
    const ring='<svg class="ring" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="'+kc+' von '+(kt||'—')+' kcal">'
      +'<circle cx="64" cy="64" r="'+R+'" fill="none" stroke="var(--grid)" stroke-width="14"/>'
      +(dash>0?'<circle cx="64" cy="64" r="'+R+'" fill="none" stroke="'+ringColor+'" stroke-width="14" stroke-linecap="round" stroke-dasharray="'+dash+' '+C+'" transform="rotate(-90 64 64)"/>':'')
      +'<text x="64" y="60" text-anchor="middle" class="ring-big">'+centerBig+'</text>'
      +'<text x="64" y="78" text-anchor="middle" class="ring-lab">'+centerLab+'</text></svg>';
    const macro=(label,cur,target,varc)=>{
      const pct=target>0?Math.min(100,Math.round(cur/target*100)):0;
      const ov=target>0&&cur>target;
      return '<div class="mrow"><div class="mtop"><span class="mlab">'+label+'</span><span class="mval"><b style="color:'+varc+'">'+cur+'</b> / '+(target||'—')+' g</span></div><div class="mtrack"><i style="width:'+pct+'%;background:'+(ov?'var(--signal)':varc)+'"></i></div></div>';
    };
    box.innerHTML=
      '<div class="daytotals">'
        +'<div><span>Kalorien</span><b>'+kc+'</b></div>'
        +'<div><span>Eiweiß</span><b style="color:var(--teal)">'+pr+'</b></div>'
        +'<div><span>Fett</span><b style="color:var(--ochre)">'+ft+'</b></div>'
        +'<div><span>Kohlh</span><b style="color:var(--accent)">'+cb+'</b></div>'
      +'</div>'
      +'<div class="ringrow">'+ring
      +'<div class="mcol">'
        +'<div class="kcline"><b>'+kc+'</b> / '+(kt||'—')+' kcal</div>'
        +macro('Protein',pr,tg.protein||0,'var(--teal)')
        +macro('Fett',ft,tg.fat||0,'var(--ochre)')
        +macro('Kohlenhydrate',cb,tg.carb||0,'var(--accent)')
      +'</div></div>'
      +'<div class="tmeta">'+metaStr+'</div>';
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

/* ---------------- Start ---------------- */
(async function init(){
  const saved = await Store.load();
  if(saved) db = {
    exercises: saved.exercises?.length ? saved.exercises : [...DEFAULT_EX],
    workouts: saved.workouts||[],
    body: saved.body||[],
    splits: saved.splits||[],
    exGroups: saved.exGroups||{},
    n8nUrl: saved.n8nUrl||'',
    mealTypes: saved.mealTypes?.length ? saved.mealTypes : [...DEFAULT_MEALS],
    goals: {...DEFAULT_GOALS, ...(saved.goals||{})},
    foodFav: saved.foodFav||[],
    nutrition: {...DEFAULT_NUTRITION, ...(saved.nutrition||{})}
  };
  setupPWA();
  $('#n8nUrl').value = db.n8nUrl||'';
  $('#today').textContent = new Date().toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'});
  $('#wdate').value = TODAY; $('#bdate').value = TODAY;
  renderAll();
  loadDay();
})();

}
customElements.define('logbuch-app', LogbuchApp);
})();
