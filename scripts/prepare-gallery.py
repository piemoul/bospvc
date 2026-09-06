from pathlib import Path
from PIL import Image, ImageOps
import subprocess, json

root=Path(__file__).resolve().parents[1]
photos=root/'public/images'; media=root/'public/media'; media.mkdir(exist_ok=True)
out=[]
entries=[
 ('7739.jpg','facility-overview','Area fasilitas & gudang','Facility & warehouse overview'),
 ('IMG_7740.jpg','warehouse-racks','Area penyimpanan roll','Roll storage area'),
 ('IMG_7742.JPG','production-floor','Area produksi','Production floor'),
 ('IMG_7743.jpg','warehouse-inventory','Persediaan material','Material inventory'),
 ('IMG_7744.jpg','warehouse-walkway','Jalur pergudangan','Warehouse walkway'),
 ('IMG_7745.JPG','material-racks','Rak material','Material racks'),
 ('IMG_7746.JPG','material-range','Pilihan material tersimpan','Stored material range'),
 ('IMG_7749.JPG','wrapped-rolls','Penyimpanan roll terkemas','Wrapped roll storage'),
 ('IMG_7750.JPG','warehouse-rolls-detail','Area bahan pelapis','Covering materials area'),
 ('IMG_7752.JPG','inventory-detail','Detail penyimpanan bahan','Material storage detail'),
 ('IMG_7753.JPG','roll-selection','Ragam bahan dalam roll','A selection of rolled materials'),
]
for src,name,id_title,en_title in entries:
    im=ImageOps.exif_transpose(Image.open(root/'ASSETS/Gudang'/src)).convert('RGB')
    im.thumbnail((1200,1200)); im.save(photos/f'{name}.webp','WEBP',quality=83,method=6)
    thumb=im.copy(); thumb.thumbnail((180,180)); thumb.save(photos/f'{name}-thumb.webp','WEBP',quality=75)
    out.append({'type':'image','src':f'/images/{name}.webp','poster':f'/images/{name}.webp','thumb':f'/images/{name}-thumb.webp','title':{'id':id_title,'en':en_title}})
# Videos load only after the visitor chooses a video. Preserve complete clips and mute audio.
videos=sorted((root/'ASSETS/Gudang').glob('*.mp4'))
for i,path in enumerate(videos,1):
    name=f'facility-video-{i}'
    video=media/f'{name}.mp4'; poster=photos/f'{name}.webp'
    if not video.exists():
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(path),'-vf','scale=\'min(960,iw)\':-2','-c:v','libx264','-preset','fast','-crf','27','-an','-movflags','+faststart',str(video)],check=True)
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','0.5','-i',str(video),'-frames:v','1',str(poster)],check=True)
    im=Image.open(poster).convert('RGB'); im.save(poster,'WEBP',quality=82)
    im.thumbnail((180,180)); im.save(photos/f'{name}-thumb.webp','WEBP',quality=75)
    out.append({'type':'video','src':f'/media/{name}.mp4','poster':f'/images/{name}.webp','thumb':f'/images/{name}-thumb.webp','title':{'id':f'Tur fasilitas {i:02}','en':f'Facility tour {i:02}'}})
(root/'lib/gallery.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Prepared {len(entries)} photos and {len(videos)} videos. Total video size {sum(p.stat().st_size for p in media.glob("*.mp4"))/1024/1024:.1f} MB.')
