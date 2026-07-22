import re, json, gzip, base64, urllib.request, os
WORK = r"C:\Users\Robert\Downloads\logbuch_work"
url = "https://raw.githubusercontent.com/roberthtwschumacherhtw-arch/IOS-App/main/index.html"
html = urllib.request.urlopen(url).read().decode("utf-8")
open(os.path.join(WORK, "index_orig.html"), "w", encoding="utf-8").write(html)
m = re.search(r'<script type="__bundler/manifest">\s*(\{.*?\})\s*</script>', html, re.S)
manifest = json.loads(m.group(1))
for u, e in manifest.items():
    print(u, e["mime"], e.get("compressed"), len(e["data"]))
    if e["mime"] == "application/javascript":
        raw = base64.b64decode(e["data"])
        if e.get("compressed"):
            raw = gzip.decompress(raw)
        open(os.path.join(WORK, "app.js"), "wb").write(raw)
        print("app.js written:", len(raw))
t = re.search(r'<script type="__bundler/template">(.*?)</script>', html, re.S)
template = json.loads(t.group(1))
open(os.path.join(WORK, "template.html"), "w", encoding="utf-8").write(template)
print("template written:", len(template))
er = re.search(r'<script type="__bundler/ext_resources">(.*?)</script>', html, re.S)
print("ext_resources:", er.group(1)[:500] if er else None)
