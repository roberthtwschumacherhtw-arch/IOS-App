import re, json, gzip, base64, os
WORK = r"C:\Users\Robert\Downloads\logbuch_work"
html = open(os.path.join(WORK, "index_orig.html"), encoding="utf-8").read()
js = open(os.path.join(WORK, "app.js"), "rb").read()
# syntax check would need node; do a basic sanity check on braces
src = js.decode("utf-8")
print("braces:", src.count("{") - src.count("}"), "parens:", src.count("(") - src.count(")"))
m = re.search(r'<script type="__bundler/manifest">\s*(\{.*?\})\s*</script>', html, re.S)
manifest = json.loads(m.group(1))
for u, e in manifest.items():
    if e["mime"] == "application/javascript":
        comp = gzip.compress(js, 9)
        e["data"] = base64.b64encode(comp).decode()
        e["compressed"] = True
        print("new js asset:", len(js), "->", len(e["data"]), "b64")
new_manifest = json.dumps(manifest, separators=(",", ":"))
html2 = html[:m.start(1)] + new_manifest + html[m.end(1):]
# suppress cross-origin 'Script error.' noise (iOS share sheet extensions)
needle = "window.addEventListener('error', function(e) {"
assert needle in html2
html2 = html2.replace(needle, needle + "\n    if (e.message === 'Script error.' && !e.error) return;", 1)
out = os.path.join(WORK, "index.html")
open(out, "w", encoding="utf-8").write(html2)
print("written:", out, len(html2))
