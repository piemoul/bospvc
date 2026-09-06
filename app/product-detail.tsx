'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, MessageCircle, ClipboardList, X } from 'lucide-react';
import { categoryName, type Lang, type Product, type QuoteItem } from '@/lib/catalog';
import { mailLink, chatLink, productInquiry } from '@/lib/inquiry';
import { colourLabel } from '@/lib/colours';

export default function ProductDetail({product:p,lang,onClose,onAdd,whatsapp,salesEmail}:{product:Product;lang:Lang;onClose:()=>void;onAdd:(item:QuoteItem)=>void;whatsapp:string;salesEmail:string}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [photo,setPhoto]=useState(0);
  const [variantId,setVariantId]=useState(p.variants[0].id);
  const [color,setColor]=useState('');
  const [quantity,setQuantity]=useState(1);
  const [unit,setUnit]=useState<QuoteItem['unit']>(p.unit==='piece'?'piece':'roll');
  const t=(id:string,en:string)=>lang==='id'?id:en;
  const variant=p.variants.find(v=>v.id===variantId)!;
  const dimensions=!p.needsConfirmation&&variant.length&&variant.width ? `${variant.length.replace(/\.0\b/g,'')}${/^[\d.]+$/.test(variant.length)?' m':''} × ${variant.width.replace(/\.0\b/g,'')} cm` : '';
  const [channelNote,setChannelNote]=useState('');
  const currentItem:QuoteItem={productId:p.id,variantId,color,quantity,unit};
  const send=(channel:'email'|'whatsapp')=>{
    if(!Number.isInteger(quantity)||quantity<1||quantity>99999)return;
    if(channel==='email'&&salesEmail)window.location.href=mailLink(salesEmail,productInquiry(currentItem,lang));
    else if(channel==='whatsapp'&&whatsapp)window.open(chatLink(whatsapp,productInquiry(currentItem,lang)),'_blank','noopener,noreferrer');
    else setChannelNote(channel);
  };
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null;
    const el=dialog.current!; el.showModal();
    const old=document.body.style.overflow;document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=old;previous?.focus()};
  },[]);
  return <dialog ref={dialog} aria-labelledby="detail-title" onCancel={onClose} onClick={e=>{if(e.target===dialog.current){const r=dialog.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}}>
    <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4"><span className="text-xs font-semibold text-[#7b826e] tracking-wider">{t('DETAIL MATERIAL','MATERIAL DETAILS')}</span><button className="icon-btn" onClick={onClose} aria-label={t('Tutup detail produk','Close product details')}><X size={20}/></button></div>
    <div className="grid md:grid-cols-2 gap-7 p-5 md:p-7"><div><div className="detail-photo"><img src={p.images[photo]} alt={`${p.name[lang]} — ${t('foto','photo')} ${photo+1}`} width="700" height="700"/></div>{p.images.length>1&&<div className="detail-thumbs" aria-label={t('Foto material','Material photos')}>{p.images.map((src,i)=><button key={src} aria-label={`${t('Foto','Photo')} ${i+1}`} aria-pressed={photo===i} onClick={()=>setPhoto(i)}><img src={src} alt="" width="60" height="60"/></button>)}</div>}<p className="text-[11px] text-[#899084] mt-3">{p.id==='25'?t('Gambar ilustrasi produk. Warna dan detail aktual dikonfirmasi saat pemesanan.','Illustrative product image. Actual colours and details are confirmed when ordering.'):t('Foto material sebagai referensi. Warna dapat berbeda bergantung pada layar dan pencahayaan.','Material photography for reference. Colours may vary with screen settings and lighting.')}</p></div>
    <form onSubmit={e=>{e.preventDefault();onAdd({productId:p.id,variantId,color,quantity,unit})}}>
      <p className="eyebrow text-[#927040]">{categoryName(p.category,lang)}</p><h2 id="detail-title" className="text-3xl font-bold tracking-tight mt-4">{p.name[lang]}</h2><p className="text-xs text-[#8a9186] mt-2">MP TECH · {p.code}</p><p className="text-sm text-[#6f796c] leading-6 mt-4">{p.description[lang]}</p>
      <div className="my-5 p-4 bg-[#f5f7f3] rounded-md"><p className="font-semibold text-sm">{t('Penawaran untuk kebutuhan Anda','A quotation for your requirements')}</p><p className="text-xs text-[#77816c] leading-5 mt-2">{t('Pilih spesifikasi, lalu konsultasikan harga, ketersediaan, dan pengiriman langsung dengan tim kami.','Select your specifications, then discuss pricing, availability and delivery directly with our team.')}</p></div>
      <div className="space-y-4"><label className="field">{t('Varian / Spesifikasi','Variant / Specification')}<select value={variantId} onChange={e=>setVariantId(e.target.value)}>{p.variants.map(v=><option key={v.id} value={v.id}>{v.label}</option>)}</select></label>
      {p.colors.length>0&&<label className="field">{t('Preferensi warna','Colour preference')}<select value={color} onChange={e=>setColor(e.target.value)}><option value="">{t('Konsultasikan pilihan warna','Discuss colour options')}</option>{p.colors.map((c,i)=><option key={i} value={c}>{colourLabel(c,lang)}</option>)}</select></label>}
      <div className="grid grid-cols-2 gap-4"><label className="field">{t('Jumlah kebutuhan','Required quantity')}<input type="number" min="1" max="99999" step="1" required value={quantity} onChange={e=>setQuantity(e.target.valueAsNumber||1)}/></label><label className="field">{t('Satuan permintaan','Requested unit')}<select value={unit} onChange={e=>setUnit(e.target.value as QuoteItem['unit'])}><option value="roll">Roll</option><option value="meter">{t('Meter','Metre')}</option><option value="piece">{t('Lembar','Sheet / Piece')}</option></select></label></div>
      <p className="text-xs leading-5 text-[#858d7b]">{p.needsConfirmation?t('Ukuran dan satuan penjualan produk ini akan dikonfirmasi dalam penawaran.','Dimensions and sales units for this product will be confirmed in the quotation.'):dimensions?`${t('Ukuran katalog','Catalog dimensions')}: ${dimensions}`:''}{variant.status==='preorder'&&<span className="block text-[#95602b] mt-1">{t('Varian prapesan. Estimasi lebih dari 1 bulan, perlu konfirmasi.','Preorder variant. Estimated over one month, subject to confirmation.')}</span>}</p>
      <div className="grid grid-cols-2 gap-2"><button type="button" className="btn btn-outline px-2" onClick={()=>send('whatsapp')}><MessageCircle size={17}/>WhatsApp</button><button type="button" className="btn btn-outline px-2" onClick={()=>send('email')}><Mail size={17}/>Email</button></div>
      {channelNote&&<p role="status" className="text-xs leading-5 text-[#806036]">{t('Layanan '+(channelNote==='email'?'email':'WhatsApp')+' sedang disiapkan. Anda dapat menyiapkan dan menyimpan ringkasan permintaan di bawah.','The '+(channelNote==='email'?'email':'WhatsApp')+' channel is being prepared. You can prepare and save your inquiry summary below.')}</p>}
      <button type="submit" className="btn btn-dark w-full">{t('Siapkan Permintaan Penawaran','Prepare a Quote Inquiry')}<ArrowRight size={17}/></button></div>
    </form></div>
  </dialog>;
}
