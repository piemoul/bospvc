'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categoryName, productHref, type Product } from '@/lib/catalog';
import { colourLabel, colourSwatch } from '@/lib/colours';
import { useSite } from './site-provider';

export default function ProductCard({ product: p }: { product: Product }) {
  const { lang, t } = useSite();
  return <article className="product-card"><Link className="product-image" href={productHref(p)} aria-label={`${t('Lihat detail', 'View details')}: ${p.name[lang]}`}><img src={p.images[0]} alt={p.name[lang]} loading="lazy" width="600" height="500"/>{p.label && <span className="image-label">{p.label}</span>}<span className="image-arrow"><ArrowUpRight size={16}/></span></Link><div className="product-body"><span className="category-label">{categoryName(p.category, lang)}</span><h3><Link href={productHref(p)}>{p.name[lang]}</Link></h3><p className="product-spec">{p.dimensions || t('Spesifikasi sesuai kebutuhan', 'Specifications on request')}</p><div className="flex items-center gap-1.5 mt-3 mb-4 min-h-4" aria-label={t('Pilihan warna', 'Colour options')}>{p.colors.slice(0, 5).map(c => <span key={c} className="color-dot" title={colourLabel(c, lang)} style={{ background: colourSwatch(c) }}/>) }<span className="text-[10px] text-[#838983] ml-1">{p.variants.length > 1 ? `${p.variants.length} ${t('spesifikasi', 'specifications')}` : p.colors.length > 5 ? `+${p.colors.length - 5} ${t('warna', 'colours')}` : t('Pilihan material', 'Material selection')}</span></div><div className="product-footer"><Link className="flex items-center justify-between w-full min-h-9 text-xs font-semibold text-[#384638]" href={productHref(p)}>{t('Detail & Tanya Harga', 'Details & Pricing')}<ArrowUpRight size={18}/></Link></div></div></article>;
}
