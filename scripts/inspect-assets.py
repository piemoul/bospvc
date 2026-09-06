from pathlib import Path
import json, zipfile, xml.etree.ElementTree as ET
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[1]
out = root / '.work'
out.mkdir(exist_ok=True)
ns = {'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(root / 'Product List Boss Bahan PVC.xlsx') as z:
    strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        strings = [''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml'))]
    workbook = ET.fromstring(z.read('xl/workbook.xml'))
    sheets = list(workbook.find('s:sheets', ns))
    result=[]
    for i,sheet in enumerate(sheets, 1):
        rows=[]
        for row in ET.fromstring(z.read(f'xl/worksheets/sheet{i}.xml')).findall('.//s:row',ns):
            cells={}
            for cell in row:
                v=cell.find('s:v',ns)
                text = v.text if v is not None else ''.join(cell.find('s:is',ns).itertext()) if cell.find('s:is',ns) is not None else ''
                if cell.get('t')=='s': text=strings[int(text)]
                if text: cells[cell.get('r')]=text
            if cells: rows.append(cells)
        result.append({'sheet':sheet.get('name'),'rows':rows})
    (out/'workbook-data.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False))
files=[p for p in (root/'ASSETS'/'Gudang').rglob('*') if p.suffix.lower() in ['.jpg','.jpeg']]
files += [p for p in (root/'ASSETS').rglob('*') if p.suffix.lower() in ['.jpg','.jpeg'] and 'Gudang' not in str(p) and '(' not in p.name]
for offset in range(0,len(files),30):
    subset=files[offset:offset+30]
    sheet=Image.new('RGB',(1250,220*((len(subset)+4)//5)), '#eeeeee')
    draw=ImageDraw.Draw(sheet)
    for i,p in enumerate(subset):
        im=ImageOps.exif_transpose(Image.open(p)).convert('RGB')
        im.thumbnail((240,185))
        x=(i%5)*250; y=(i//5)*220
        sheet.paste(im,(x+(240-im.width)//2,y))
        draw.text((x+5,y+187),f'{offset+i}: {p.parent.name}/{p.name}'[:38],fill='black')
    sheet.save(out/f'assets-{offset//30}.jpg')
    print('Contact sheet:',out/f'assets-{offset//30}.jpg')
print('Logo dimensions:',Image.open(root/'ASSETS'/'LOGO.jpeg').size)
