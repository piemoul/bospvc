from pathlib import Path
from PIL import Image,ImageOps
import json
root=Path(__file__).resolve().parents[1]
products=json.loads((root/'lib/catalog.json').read_text(encoding='utf-8-sig'))
editorial=json.loads((root/'lib/product-editorial.json').read_text(encoding='utf-8-sig'))
output=root/'public/images/product-previews';output.mkdir(exist_ok=True)
count=0
def thumbnail(src,filename):
    im=ImageOps.exif_transpose(Image.open(root/'public'/src.lstrip('/'))).convert('RGB')
    im=ImageOps.fit(im,(96,96),method=Image.Resampling.LANCZOS)
    im.save(output/filename,'WEBP',quality=78,method=6)

for p in products:
    for i,src in enumerate(p['images']):
        thumbnail(src,f"{p['id']}-{i}.webp");count+=1
    mappings=editorial[p['id']]['colorImages']
    colors=[c for c in p['colors'] if c!='Multiple colours' and c in mappings]
    for i,color in enumerate(colors):
        thumbnail(mappings[color]['src'],f"{p['id']}-color-{i}.webp");count+=1
print(f'Prepared {count} lightweight gallery and color thumbnails.')
