'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, Mail, Layers3 } from 'lucide-react';
import { categoryName, productHref, validQuantity, type Product, type QuoteItem, type RequestUnit } from '@/lib/catalog';
import { mailLink, chatLink, productInquiry } from '@/lib/inquiry';
import { colourLabel, colourSwatch } from '@/lib/colours';
import { useSite } from './site-provider';
import WhatsAppIcon from './whatsapp-icon';

export default function ProductDetail({product:p,initialSelection={}}:{product:Product;initialSelection?:Record<string,string>}) {
  const {lang,t,whatsapp,salesEmail,addItem}=useSite();
  const router=useRouter();
  const [variantId,setVariantId]=useState(p.variants.some(v=>v.id===initialSelection.variant)?initialSelection.variant:p.variants[0].id);
  const [color,setColor]=useState(p.colors.includes(initialSelection.color)?initialSelection.color:'');
  const [unit,setUnit]=useState<RequestUnit>(p.allowedUnits.includes(initialSelection.unit as RequestUnit)?initialSelection.unit as RequestUnit:p.allowedUnits[0]);
  const [quantity,setQuantity]=useState(1);
  const [photo,setPhoto]=useState<number|null>(null);
  const [origin,setOrigin]=useState('');
  useEffect(()=>setOrigin(window.location.origin),[]);
  const variant=p.variants.find(v=>v.id===variantId)!;
  const colorImage=color?p.colorImages[color]:undefined;
  const image=photo!==null?p.images[photo]:colorImage?.src??p.images[0];
  const dimensions=!p.needsConfirmation&&variant.length&&variant.width?`${variant.length.replace(/\.0\b/g,'')}${/^[\d.]+$/.test(variant.length)?' m':''} × ${variant.width.replace(/\.0\b/g,'')} cm`:'';
  const item:QuoteItem={productId:p.id,variantId,color,quantity,unit};
  const selectionParams=new URLSearchParams({variant:variantId,unit});
  if(color)selectionParams.set('color',color);
  const inquiry=productInquiry(item,lang,`${origin}${productHref(p)}?${selectionParams}`);
  const valid=validQuantity(quantity,unit);
  const changeUnit=(next:RequestUnit)=>{setUnit(next);if(next!=='meter'&&!Number.isInteger(quantity))setQuantity(Math.max(1,Math.ceil(quantity)));};
  return <section className="product-page"><div className="container">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{t('Beranda','Home')}</Link><span>/</span><Link href="/store">{t('Katalog','Catalog')}</Link><span>/</span><span>{p.name[lang]}</span></nav>
    <div className="product-detail-layout">
      <div className="product-visual"><div className="product-main-photo"><img src={image} alt={`${p.name[lang]}${color&&photo===null?' — '+colourLabel(color,lang):''}`} width="900" height="900" fetchPriority="high"/></div>
        {p.images.length>1&&<div className="detail-thumbs" aria-label={t('Foto material asli','Original material photos')}>{p.images.map((src,i)=><button type="button" key={src} aria-label={`${t('Foto','Photo')} ${i+1}`} aria-pressed={photo===i||(!color&&photo===null&&i===0)} onClick={()=>setPhoto(i)}><img src={src} alt="" width="66" height="66"/></button>)}</div>}
        <p className="photo-caption" role="status">{t('Konfirmasikan warna dan spesifikasi akhir bersama tim sesuai kebutuhan Anda.','Confirm the final colour and specifications with our team for your requirements.')}</p>
      </div>
      <div className="product-information"><div className="product-labels">{p.label&&<span className="brand-badge">{p.label}</span>}<Link href={`/store?category=${p.category}`} className="eyebrow">{categoryName(p.category,lang)}</Link></div><h1>{p.name[lang]}</h1><p className="product-code">{p.code}</p><p className="product-summary">{p.description[lang]}</p>
        {p.details[lang].length>1&&<details className="product-description"><summary>{t('Lihat selengkapnya','See more')}<ChevronDown size={16}/></summary>{p.details[lang].slice(1).map((text,i)=><p key={i}>{text}</p>)}</details>}
        <div className="sourcing-note"><Layers3 size={21}/><div><strong>{t('Bahan untuk kebutuhan Anda','Materials for your requirements')}</strong><p>{t('Pilih spesifikasi untuk ditanyakan. Tim kami mengonfirmasi harga, ketersediaan, dan rencana pengadaan.','Choose a specification to inquire about. Our team will confirm pricing, availability and sourcing arrangements.')}</p></div></div>
        <form onSubmit={e=>{e.preventDefault();if(valid){addItem(item);router.push('/contact');}}}>
          <label className="field">{t('Varian / Spesifikasi','Variant / Specification')}<select value={variantId} onChange={e=>setVariantId(e.target.value)}>{p.variants.map(v=><option key={v.id} value={v.id}>{v.label}</option>)}</select></label>
          {p.colors.length>0&&<label className="field mt-4">{t('Pilihan warna','Colour preference')}<select value={color} onChange={e=>{setColor(e.target.value);setPhoto(null);}}><option value="">{t('Konsultasikan pilihan warna','Discuss colour options')}</option>{p.colors.map(c=><option key={c} value={c}>{colourLabel(c,lang)}</option>)}</select></label>}
          {color&&<div className="selected-colour"><span className="color-dot" style={{background:colourSwatch(color)}}/>{colourLabel(color,lang)}{colorImage&&photo!==null&&<button type="button" onClick={()=>setPhoto(null)}>{t('Lihat warna pilihan','View selected colour')}</button>}</div>}
          <div className="grid grid-cols-2 gap-4 mt-4"><label className="field">{t('Jumlah kebutuhan','Required quantity')}<input type="number" min={unit==='meter'?0.1:1} max="99999" step={unit==='meter'?0.1:1} required value={Number.isFinite(quantity)?quantity:''} onChange={e=>setQuantity(e.target.valueAsNumber)}/></label><label className="field">{t('Satuan permintaan','Requested unit')}<select value={unit} onChange={e=>changeUnit(e.target.value as RequestUnit)}>{p.allowedUnits.map(u=><option key={u} value={u}>{u==='roll'?'Roll':u==='meter'?t('Meter','Metre'):t('Lembar','Sheet / Piece')}</option>)}</select></label></div>
          <p className="specification-note">{dimensions?`${t('Ukuran katalog','Catalog dimensions')}: ${dimensions}`:t('Ukuran dan satuan penawaran dikonfirmasi sesuai kebutuhan Anda.','Final dimensions and quotation units are confirmed for your requirements.')}</p>
          <div className="product-inquiry-actions">{whatsapp&&<a className="btn btn-whatsapp" href={valid?chatLink(whatsapp,inquiry):undefined} aria-disabled={!valid} tabIndex={valid?0:-1} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width="19" height="19"/>{t('Tanya via WhatsApp','Ask on WhatsApp')}</a>}{salesEmail&&<a className="btn btn-outline" href={valid?mailLink(salesEmail,inquiry):undefined} aria-disabled={!valid} tabIndex={valid?0:-1}><Mail size={18}/>{t('Tanya via Email','Ask by Email')}</a>}</div>
          <button type="submit" className="btn btn-dark w-full mt-3">{t('Lanjutkan ke Permintaan Harga','Continue to Quote Request')}<ArrowRight size={18}/></button><p className="inquiry-helper">{t('Gabungkan beberapa bahan dan sampaikan detail kebutuhan Anda.','Combine materials and share your requirements.')}</p>
        </form>
      </div>
    </div>
    <div className="product-bottom-note"><Link href={`/store?category=${p.category}`}>← {t('Lihat bahan lain dalam kategori ini','Explore more materials in this category')}</Link><p>{t('Harga pabrik · Pengadaan sesuai kebutuhan · Pengiriman seluruh Indonesia','Factory pricing · Sourcing to your requirements · Delivery across Indonesia')}</p></div>
  </div></section>;
}
