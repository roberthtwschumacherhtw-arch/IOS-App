import urllib.request, json
def get(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent':'LogbuchApp/1.0'})))
print('=== v2 search ===')
try:
    u='https://world.openfoodfacts.org/api/v2/search?search_terms=basmati%20reis&fields=code,product_name,brands,nutriments,quantity&page_size=5'
    r=get(u); print('count', r.get('count'))
    for p in r.get('products',[])[:5]:
        n=p.get('nutriments',{})
        print(p.get('product_name'),'|',p.get('brands'),'|kcal',n.get('energy-kcal_100g'),'|prot',n.get('proteins_100g'))
except Exception as e:
    print('v2 ERR', e)
print('=== search-a-licious ===')
try:
    r=get('https://search.openfoodfacts.org/search?q=basmati%20reis&page_size=3&fields=code,product_name,brands,nutriments')
    print('keys', list(r.keys()))
    hits=r.get('hits',[])
    print('hits', len(hits))
    if hits:
        h=hits[0]; print(h.get('product_name'),'|',h.get('brands'),'|', (h.get('nutriments') or {}).get('energy-kcal_100g'))
except Exception as e:
    print('SAL ERR', e)
