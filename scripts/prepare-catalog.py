"""Read the supplied workbook and prepare optimized, traceable website assets."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json, re, zipfile, xml.etree.ElementTree as ET, io

root=Path(__file__).resolve().parents[1]
public=root/'public'/'images'; public.mkdir(parents=True,exist_ok=True)
data_dir=root/'lib'; data_dir.mkdir(exist_ok=True)
source=json.loads((root/'.work/workbook-data.json').read_text(encoding='utf-8'))[0]['rows']
groups=[]
for raw in source[1:]:
    row={re.sub(r'\d','',k):v.strip() for k,v in raw.items()}
    row['row']=int(re.search(r'\d+',next(iter(raw))).group())
    if 'A' in row: groups.append({'id':int(float(row['A'])),'rows':[]})
    groups[-1]['rows'].append(row)

def save(im,name,size=1000):
    im=ImageOps.exif_transpose(im).convert('RGB'); im.thumbnail((size,size))
    im.save(public/f'{name}.webp','WEBP',quality=83,method=6)
    return f'/images/{name}.webp'

# Separate the two marks supplied together; preserve the original artwork.
logo=Image.open(root/'ASSETS/LOGO.jpeg')
save(logo.crop((992,229,1517,787)),'logo-round',256)
save(logo.crop((20,238,973,787)),'brand-banner',1100)
icon=logo.crop((992,229,1517,787)).resize((256,256),Image.Resampling.LANCZOS).convert('RGBA')
mask=Image.new('L',(256,256),0); ImageDraw.Draw(mask).ellipse((2,2,253,253),fill=255); icon.putalpha(mask)
icon.save(root/'public/favicon.ico',sizes=[(16,16),(32,32),(48,48),(64,64)])
icon.save(root/'public/icon.png'); icon.resize((180,180)).save(root/'public/apple-touch-icon.png')
for name,file in [('warehouse','Gudang/7739.jpg'),('warehouse-rolls','Gudang/IMG_7750.JPG'),('warehouse-aisle','Gudang/IMG_7744.jpg'),('production','Gudang/IMG_7742.JPG')]:
    save(Image.open(root/'ASSETS'/file),name,1800 if name=='warehouse' else 1200)

ns={'d':'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
embedded={}
with zipfile.ZipFile(root/'Product List Boss Bahan PVC.xlsx') as z:
    rels={e.get('Id'):e.get('Target').replace('../','xl/') for e in ET.fromstring(z.read('xl/drawings/_rels/drawing1.xml.rels'))}
    for anchor in ET.fromstring(z.read('xl/drawings/drawing1.xml')):
        row=int(anchor.find('d:from/d:row',ns).text)+1
        rid=anchor.find('.//a:blip',ns).get('{'+ns['r']+'}embed')
        embedded[row]=Image.open(io.BytesIO(z.read(rels[rid]))).copy()

names=[
('Mio Standard 0.55 mm','Mio Standard 0.55 mm'),('Mio Pro 0.9 mm','Mio Pro 0.9 mm'),('Nafa Pro 0.9 mm','Nafa Pro 0.9 mm'),('Cherokee Pro 0.9 mm','Cherokee Pro 0.9 mm'),('Tusuk Jarum Pro 0.9 mm','Needle Pattern Pro 0.9 mm'),('Kotak Catur 0.7 mm','Checkerboard 0.7 mm'),('Vario Biji Kopi 0.8 mm','Vario Coffee Bean 0.8 mm'),('Big Dot Pro 0.9 mm','Big Dot Pro 0.9 mm'),('Amplas Standard 0.7 mm','Amplas Standard 0.7 mm'),('Spon Kilat Polos','Plain Gloss PVC'),('Spon Kilat Kembang','Floral Gloss PVC'),('Terpal PE A2','PE Tarpaulin A2'),('Terpal PE A5','PE Tarpaulin A5'),('Terpal PE A12','PE Tarpaulin A12'),('Terpal PE A3','PE Tarpaulin A3'),('Terpal PVC','PVC Tarpaulin'),('Terpal PVC Premium CP','Premium CP PVC Tarpaulin'),('Spunbond & Kain Furing','Spunbond & Lining Fabric'),('Tafeta Cover Otomotif','Automotive Cover Taffeta'),('Mika Rigid','Rigid Clear Sheet'),('Mika Bening Lemas','Flexible Clear PVC'),('Karpet Lantai Premium','Premium Floor Covering'),('Karpet Lantai Ekonomis','Economy Floor Covering'),('Nafa Bahan Sampul','Nafa Cover Material'),('Terpal PE Lembaran','Ready-made PE Tarpaulin'),('Karpet Peredam 1.3 mm','Automotive Floor Liner 1.3 mm'),('CK Metalik','CK Metallic')]
image_paths={1:'Otomotif/Mio tipis.jpg',2:'Otomotif/Mio 0.9/Mio tebal.jpg',3:'Otomotif/Nafa.jpg',4:'Otomotif/Cherokee.jpg',5:'Otomotif/Jarum.jpg',6:'Otomotif/Kotak/Kotak.jpg',7:'Otomotif/Vario.jpg',8:'Otomotif/Big Dot.jpg',9:'Otomotif/Amplas.jpg',10:'Others/Sp Kilat/Spon Kilat.jpg',11:'Others/Sp Kembang/Spon Kembang.jpg',12:'Terpal/PE Tarpaulin/PE Tarpaulin A2.jpg',13:'Terpal/PE Tarpaulin/PE Tarpaulin A5.jpg',17:'Terpal/PVC Tarpaulin/CP.jpg',18:'Others/Spunbound/Spunbound.jpg',20:'Gudang/Rigid/IMG_7756.JPG',21:'Gudang/Mika/IMG_7754.JPG',24:'Others/Nafa/Nafa.jpg',25:'Terpal/PE Tarpaulin/PE Tarpaulin.jpg',26:'Otomotif/Peredam/Peredam.jpg',27:'Others/CK Metallic/CK Metallic.jpg'}
descs={
'automotive':('Material pelapis untuk kebutuhan jok dan interior otomotif. Pilih tekstur, warna, dan ketebalan sesuai aplikasi Anda.','Upholstery materials for automotive seating and interiors. Select the texture, colour and thickness to suit your application.'),
'interior':('Material pelapis untuk interior, permukaan meja, dan kebutuhan usaha. Tersedia dalam pilihan motif untuk berbagai aplikasi.','Covering materials for interiors, table surfaces and commercial use, with pattern options for different applications.'),
'tarpaulin':('Material terpal untuk penutup, transportasi, dan kebutuhan luar ruang. Konsultasikan spesifikasi sesuai penggunaan dan volume pengadaan.','Tarpaulin materials for covers, transport and outdoor applications. Discuss the appropriate specification for your use and order volume.'),
'fabric':('Material untuk produksi tas, pelapis, dan kebutuhan konveksi. Pilihan bahan untuk mendukung pengadaan usaha Anda.','Materials for bags, linings and textile production. Explore material options for your business procurement.'),
'sheet':('Material lembaran untuk kemasan, sampul, dan kebutuhan produksi. Pilih varian ketebalan sesuai kebutuhan proses Anda.','Sheet materials for packaging, covers and production. Choose the thickness appropriate to your process.')}
catalog=[]
for g in groups:
    n=g['id']; r=g['rows'][0]
    cat='automotive' if n in [*range(1,10),19,26] else 'interior' if n in [10,11,22,23] else 'tarpaulin' if n in [12,13,14,15,16,17,25] else 'fabric' if n in [18,27] else 'sheet'
    images=[]
    if n in image_paths:
        asset_path=image_paths[n].replace('Gudang/Rigid/','Rigid/').replace('Gudang/Mika/','Mika/')
        p=root/'ASSETS'/asset_path; images.append(save(Image.open(p),f'product-{n}'))
        if n in [2,6,10,11,17,18,20,21,24,26,27]:
            for j,v in enumerate(sorted(p.parent.glob('*'))):
                if v!=p and v.suffix.lower() in ['.jpg','.jpeg']:
                    images.append(save(Image.open(v),f'product-{n}-alt-{j}'))
    elif r['row'] in embedded:
        images.append(save(embedded[r['row']],f'product-{n}'))
    variants=[]
    for v in g['rows']:
        if not any(k in v for k in ['P','N','S','R']): continue
        label=v.get('P','')
        if label:
            label=re.sub(r'(?<=\d)\.0\b','',label)
            if n==18: label += ' GSM'
            elif not re.search(r'[a-z]',label): label+=' mm'
        if n==24: label=v.get('C',r['C'])+' · '+label
        if n==25: label=v.get('N','').replace('x',' × ')+' m'
        if n==23: label=v.get('N','').replace('.0','')+' m × '+v.get('O','').replace('.0','')+' cm'
        if n==21 and v.get('O')=='210.0': label+=' · 210 cm / 70 yd'
        label=label or r.get('C','Standard')
        variants.append({'id':str(v['row']),'label':label,'price':float(v['S']) if v.get('S') else None,'length':v.get('N',r.get('N','')),'width':v.get('O',r.get('O','')),'weight':v.get('R',''),'status':'preorder' if 'PO >' in v.get('T','') else 'listed' if 'Ready' in v.get('T','') else 'confirm'})
    if not variants: variants=[{'id':str(r['row']),'label':r.get('C','Standard'),'price':None,'length':'','width':'','weight':'','status':'confirm'}]
    # Source columns for these groups contain ambiguous dimensions and pricing units.
    needs_confirmation=n in [12,13,14,15,16,17,22,25]
    prices=[v['price'] for v in variants if v['price'] is not None]
    colors=[c.strip() for c in re.split(r'\n|,',r.get('K','')) if c.strip()]
    colors=[c.replace('Hitam only','Black').replace('Abu Tua','Dark Grey').replace('Banyak warna','Multiple colours').replace('Bening','Clear').replace('(Main)','').strip() for c in colors]
    dims= '' if needs_confirmation else ((variants[0]['length'].replace('.0','')+(' m' if re.fullmatch(r'[\d.]+',variants[0]['length']) else '')+' × '+variants[0]['width'].replace('.0','')+' cm') if variants[0]['length'] and variants[0]['width'] else '')
    if n==25 and (public/'product-25-generated.webp').exists(): images.insert(0,'/images/product-25-generated.webp')
    # A quotation catalog does not publish the workbook's pricing column.
    for v in variants: v.pop('price',None)
    overrides={
      10:('PVC berpermukaan mengilap untuk pelapis meja dan lapisan dalam tas. Pilihan warna untuk kebutuhan produksi dan rumah tangga.','Gloss-finish PVC for table coverings and bag linings, with colour options for production and household use.'),
      11:('PVC motif bunga untuk pelapis meja dan lapisan dalam tas. Ketebalan katalog 0.5 mm dengan pilihan warna.','Floral-pattern PVC for table coverings and bag linings. Listed at 0.5 mm with colour options.'),
      18:('Kain spunbond untuk goodie bag, lapisan tas, dan pelapis sofa. Pilihan gramasi 20, 30, 50, dan 65 GSM.','Spunbond fabric for goodie bags, bag linings and sofa linings. Available specifications: 20, 30, 50 and 65 GSM.'),
      19:('Bahan tafeta untuk penutup kendaraan. Konsultasikan pilihan warna dan kebutuhan pengadaan Anda.','Taffeta material for vehicle covers. Discuss colour options and your procurement requirements.'),
      20:('Lembaran rigid untuk kemasan, pencetakan, vacuum forming, dan sampul. Tersedia pilihan ketebalan 0.08–0.7 mm.','Rigid sheets for packaging, printing, vacuum forming and covers, with thickness options from 0.08–0.7 mm.'),
      21:('Mika bening fleksibel untuk kemasan, tas transparan, dan pelapis. Pilihan ketebalan 0.05–0.8 mm, dengan ketersediaan sesuai varian.','Flexible clear material for packaging, transparent bags and coverings. Thicknesses from 0.05–0.8 mm; availability depends on the variant.'),
      22:('Bahan pelapis lantai dengan ketebalan katalog 0.4 mm. Konsultasikan pilihan motif dan ukuran untuk kebutuhan ruang Anda.','Floor covering material listed at 0.4 mm. Discuss patterns and dimensions to suit your space.'),
      23:('Bahan pelapis lantai ekonomis dalam pilihan panjang roll. Tanyakan motif dan ketersediaan untuk pengadaan usaha Anda.','Economy floor covering material in several roll lengths. Inquire about patterns and availability for your business.'),
      24:('Bahan Nafa untuk sampul rapor, map, dan kebutuhan alat tulis. Pilihan spesifikasi 0.10A dan 0.15A.','Nafa material for report covers, folders and stationery, with 0.10A and 0.15A specification options.'),
      25:('Terpal PE lembaran untuk kebutuhan penutup. Pilihan ukuran 2 × 3, 3 × 4, 4 × 6, dan 6 × 8 m. Konfirmasikan grade A2, A5, atau A3 saat konsultasi.','Ready-made PE tarpaulin for covering applications. Size options: 2 × 3, 3 × 4, 4 × 6 and 6 × 8 m. Confirm A2, A5 or A3 grade during your inquiry.'),
      26:('Material pelapis dasar lantai mobil dengan ketebalan katalog 1.3 mm. Untuk kebutuhan pemasangan dan pelapisan interior kendaraan.','Automotive floor lining material listed at 1.3 mm, for vehicle interior installation and covering applications.'),
      27:('Bahan CK Metalik untuk produksi tas dan aksesori. Tersedia dalam pilihan warna untuk kebutuhan konveksi Anda.','CK Metallic material for bags and accessories, with colour options for your textile production needs.'),
    }
    desc=overrides.get(n,descs[cat])
    catalog.append({'id':str(n),'name':{'id':names[n-1][0],'en':names[n-1][1]},'category':cat,'code':r.get('C',''),'description':{'id':desc[0],'en':desc[1]},'images':images,'colors':colors,'variants':variants,'dimensions':dims,'needsConfirmation':needs_confirmation,'unit':'piece' if n==25 else 'roll','sourceRow':r['row']})
featured=[2,4,12,20,17,18,21,27]
catalog.sort(key=lambda p: (featured.index(int(p['id'])) if int(p['id']) in featured else 100+int(p['id'])))
(data_dir/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
thumbs=[(n,embedded[row]) for n,row in [(14,15),(15,16),(16,17),(19,23),(22,91),(23,92)]]
contact=Image.new('RGB',(len(thumbs)*200,250),'white'); d=ImageDraw.Draw(contact)
for i,(n,im) in enumerate(thumbs):
    im.thumbnail((190,220)); contact.paste(im,(i*200,0)); d.text((i*200,225),f'Product {n}',fill='black')
contact.save(root/'.work/embedded.jpg')
print(f'Prepared {len(catalog)} product groups, {sum(len(p["variants"]) for p in catalog)} variants, and {len(list(public.glob("*")))} optimized assets.')
