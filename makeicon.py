from PIL import Image, ImageDraw
import base64, io

def rr(d, box, r, fill):
    d.rounded_rectangle(box, radius=r, fill=fill)

def icon(sz, maskable=False):
    img = Image.new('RGB', (sz, sz), '#2E7D74')
    d = ImageDraw.Draw(img)
    s = sz/120.0
    # Bar
    rr(d, [30*s,54*s,90*s,66*s], 4*s, '#F4F6F8')
    # Plates
    rr(d, [22*s,42*s,34*s,78*s], 4*s, '#10352F')
    rr(d, [86*s,42*s,98*s,78*s], 4*s, '#10352F')
    return img

def b64(img):
    buf = io.BytesIO(); img.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

out = {}
for s in (180, 512):
    out[s] = b64(icon(s))
open(r'C:\Users\Robert\Downloads\logbuch_work\icon180.txt','w').write(out[180])
open(r'C:\Users\Robert\Downloads\logbuch_work\icon512.txt','w').write(out[512])
print('180 len', len(out[180]), '| 512 len', len(out[512]))
