'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, Film, ImageIcon, Play, X } from 'lucide-react';
import gallery from '@/lib/gallery.json';
import type { Lang } from '@/lib/catalog';

export default function CapabilityGallery({lang}:{lang:Lang}) {
  const [filter,setFilter]=useState('all');
  const [index,setIndex]=useState(0);
  const [expanded,setExpanded]=useState(false);
  const modal=useRef<HTMLDialogElement>(null);
  const t=(id:string,en:string)=>lang==='id'?id:en;
  const entries=gallery.filter(x=>filter==='all'||x.type===filter);
  const current=entries[index]??entries[0];
  const step=(offset:number)=>setIndex(i=>(i+offset+entries.length)%entries.length);
  useEffect(()=>{
    if(!expanded)return;
    const previous=document.activeElement as HTMLElement|null;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';modal.current?.showModal();
    return ()=>{document.body.style.overflow=overflow;previous?.focus()};
  },[expanded]);
  return <div className="facility-gallery">
    <div className="gallery-topline"><div><span className="gallery-live-dot"/><span>{t('DOKUMENTASI FASILITAS','FACILITY DOCUMENTATION')}</span></div><span>11 {t('foto','photos')} · 6 video</span></div>
    <div className="gallery-stage">
      {current.type==='video'?<video key={current.src+String(expanded)} controls playsInline muted preload="none" poster={current.poster} aria-label={current.title[lang]} src={expanded?undefined:current.src}/>:<button type="button" className="gallery-image-button" onClick={()=>setExpanded(true)} aria-label={t('Perbesar: ','Enlarge: ')+current.title[lang]}><img key={current.src} src={current.src} alt={current.title[lang]} width="1200" height="1000" loading="lazy"/><span className="gallery-expand"><Expand size={17}/>{t('Lihat Detail','View Details')}</span></button>}
      {current.type==='video'&&<button type="button" className="gallery-video-expand" onClick={()=>setExpanded(true)} aria-label={t('Perbesar video','Enlarge video')}><Expand size={17}/></button>}
    </div>
    <div className="gallery-bottomline"><div><span className="gallery-index">{String(index+1).padStart(2,'0')}<span> / {String(entries.length).padStart(2,'0')}</span></span><h3>{current.title[lang]}</h3></div><div className="flex gap-2"><button type="button" className="icon-btn" aria-label={t('Dokumentasi sebelumnya','Previous media')} onClick={()=>step(-1)}><ChevronLeft size={18}/></button><button type="button" className="icon-btn" aria-label={t('Dokumentasi berikutnya','Next media')} onClick={()=>step(1)}><ChevronRight size={18}/></button></div></div>
    <div className="gallery-filters" aria-label={t('Jenis dokumentasi','Media type')}>{[['all',t('Semua','All')],['image',t('Foto Gudang & Pabrik','Facility Photos')],['video',t('Video Fasilitas','Facility Videos')]].map(([id,label])=><button type="button" key={id} aria-pressed={filter===id} onClick={()=>{setFilter(id);setIndex(0)}}>{id==='video'?<Film size={13}/>:id==='image'?<ImageIcon size={13}/>:null}{label}</button>)}</div>
    <div className="gallery-thumbnails" aria-label={t('Pilih dokumentasi fasilitas','Choose facility media')}>{entries.map((entry,i)=><button type="button" key={entry.src} onClick={()=>setIndex(i)} aria-label={entry.title[lang]} aria-pressed={i===index}><img src={entry.thumb} alt="" width="90" height="70" loading="lazy"/>{entry.type==='video'&&<Play size={17} fill="white"/>}</button>)}</div>
    {expanded&&<dialog ref={modal} className="gallery-modal" aria-labelledby="gallery-modal-title" onCancel={()=>setExpanded(false)} onKeyDown={e=>{if(e.target instanceof HTMLVideoElement)return;if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)}}><div className="gallery-modal-heading"><h3 id="gallery-modal-title">{current.title[lang]}</h3><button className="icon-btn" aria-label={t('Tutup galeri','Close gallery')} onClick={()=>setExpanded(false)}><X size={20}/></button></div><div className="gallery-modal-media">{current.type==='video'?<video key={current.src} src={current.src} controls playsInline muted preload="metadata" poster={current.poster} aria-label={current.title[lang]}/>:<img src={current.src} alt={current.title[lang]} width="1200" height="1000"/>}</div><div className="gallery-modal-controls"><button className="icon-btn" aria-label={t('Dokumentasi sebelumnya','Previous media')} onClick={()=>step(-1)}><ChevronLeft size={20}/></button><span>{index+1} / {entries.length}</span><button className="icon-btn" aria-label={t('Dokumentasi berikutnya','Next media')} onClick={()=>step(1)}><ChevronRight size={20}/></button></div></dialog>}
  </div>;
}
