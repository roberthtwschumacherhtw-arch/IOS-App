import urllib.request, json
def get(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent':'LogbuchApp/1.0'})))
u='https://world.openfoodfacts.org/cgi/search.pl?search_terms=reis&search_simple=1&action=process&json=1&page_size=5&fields=code,product_name,brands,nutriments,quantity'
r=get(u)
print('count', r.get('count'))
for p in r['products'][:5]:
    n=p.get('nutriments',{})
    print(p.get('code'),'|',p.get('product_name'),'|',p.get('brands'),'|kcal',n.get('energy-kcal_100g'),'|prot',n.get('proteins_100g'))
print('--- barcode ---')
b=get('https://world.openfoodfacts.org/api/v2/product/4061458096289.json?fields=code,product_name,brands,nutriments')
print(b.get('status'), b.get('product',{}).get('product_name'))
