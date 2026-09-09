'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { categoryName, type Product } from '@/lib/catalog';
import { colourLabel, colourSwatch } from '@/lib/colours';
import { productPreviews, previewHref } from '@/lib/product-preview';
import { useSite } from './site-provider';

export default function ProductCard({ product: p }: { product: Product }) {
  const { lang, t } = useSite();
  const [selectedKey, setSelectedKey] = useState('');
  const [expanded, setExpanded] = useState(false);
  const previews = productPreviews(p);
  const selected = previews.find(option => option.key === selectedKey);
  const href = previewHref(p, selected);
  const label = (option: typeof previews[number]) => option.color ? colourLabel(option.color, lang) : `${t('Foto','Photo')} ${(option.photo ?? 0) + 1}`;
  const image = selected?.src ?? p.images[0];
  const hasPhotos = previews.some(option => option.photo !== undefined);
  const visible = hasPhotos && !expanded ? previews.slice(0, 4) : previews;
  return <article className="product-card" aria-label={p.name[lang]}>
    <Link className="product-image" href={href} aria-label={`${t('Lihat detail', 'View details')}: ${p.name[lang]}`}><img src={image} alt={`${p.name[lang]}${selected?' — '+label(selected):''}`} loading="lazy" width="600" height="500"/>{p.label && <span className="image-label">{p.label}</span>}<span className="image-arrow"><ArrowUpRight size={16}/></span></Link>
    <div className="product-body"><span className="category-label">{categoryName(p.category,lang)}</span><h3><Link href={href}>{p.name[lang]}</Link></h3><p className="product-spec">{p.dimensions || t('Spesifikasi sesuai kebutuhan','Specifications on request')}</p>
      {previews.length>0 ? <div className="card-preview-options">
        <div className="card-preview-controls" role="group" aria-label={t('Pratinjau warna dan foto','Preview colours and photos')}>
          {visible.map(option=><button type="button" key={option.key} className={option.color?'card-swatch':'card-photo-option'} title={label(option)} aria-label={`${t('Pratinjau','Preview')} ${label(option)}: ${p.name[lang]}`} aria-pressed={selectedKey===option.key} onClick={()=>setSelectedKey(option.key)}>{option.color?<span className="color-dot" style={{background:colourSwatch(option.color)}}/>:<img src={option.thumb} alt="" width="40" height="40" loading="lazy"/>}</button>)}
          {hasPhotos&&previews.length>4&&<button type="button" className="card-more-previews" aria-expanded={expanded} aria-label={expanded?t('Ringkas pilihan foto','Show fewer photos'):t('Lihat semua foto','Show all photos')} onClick={()=>setExpanded(!expanded)}>{expanded?'−':`+${previews.length-4}`}</button>}
        </div><p className="card-preview-label" role="status">{selected?label(selected):hasPhotos?t('Klik foto untuk pratinjau','Click a photo to preview'):t('Klik warna untuk pratinjau','Click a colour to preview')}</p>
      </div> : <p className="card-preview-label card-no-options">{t('Detail bahan pada halaman produk','View material details on the product page')}</p>}
      {p.variants.length>1&&<p className="card-variant-count">{p.variants.length} {t('spesifikasi','specifications')}</p>}
      <div className="product-footer"><Link className="flex items-center justify-between w-full min-h-9 text-xs font-semibold text-[#384638]" href={href}>{t('Detail & Tanya Harga','Details & Pricing')}<ArrowUpRight size={18}/></Link></div>
    </div>
  </article>;
}
