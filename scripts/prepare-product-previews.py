from pathlib import Path
from PIL import Image,ImageOps
import json
root=Path(__file__).resolve().parents[1]
products=json.loads((root/'lib/catalog.json').read_text(encoding='utf-8-sig'))
output=root/'public/images/product-previews';output.mkdir(exist_ok=True)
count=0
for p in products:
    colors=[c for c in p['colors'] if c!='Multiple colours']
    if len(colors)<=1 and len(p['images'])>1:
        for i,src in enumerate(p['images']):
            im=ImageOps.exif_transpose(Image.open(root/'public'/src.lstrip('/'))).convert('RGB')
            im=ImageOps.fit(im,(96,96),method=Image.Resampling.LANCZOS)
            im.save(output/f"{p['id']}-{i}.webp",'WEBP',quality=78,method=6);count+=1
print(f'Prepared {count} lightweight photo thumbnails.')
