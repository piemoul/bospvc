'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Search, X } from 'lucide-react';
import { categories, categoryName, products } from '@/lib/catalog';
import { useSite } from '../site-provider';
import ProductCard from '../product-card';

export default function StoreCatalog() {
  const { lang, t } = useSite();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const category = categories.some(c => c.id === params.get('category')) ? params.get('category')! : 'all';
  const sort = params.get('sort') === 'name' ? 'name' : 'featured';
  const [visible, setVisible] = useState(12);
  useEffect(() => { setQuery(params.get('q') ?? ''); setVisible(12); }, [params]);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== 'all' && value !== 'featured') next.set(key, value); else next.delete(key);
    window.history.replaceState(null, '', `/store${next.size ? '?' + next.toString() : ''}`);
    setVisible(12);
  };
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(p => (category === 'all' || p.category === category) && (!q || [p.name.id, p.name.en, p.code, categoryName(p.category, lang), ...p.variants.map(v => v.label)].join(' ').toLowerCase().includes(q)));
    return sort === 'name' ? list.sort((a, b) => a.name[lang].localeCompare(b.name[lang])) : list;
  }, [query, category, sort, lang]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try { void Promise.resolve(context.registerTool({ name: 'search_material_catalog', title: 'Search the BOSS BAHAN PVC catalog', description: 'Read material specifications. Does not check inventory or submit inquiries.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: (input: unknown) => {
      if (!input || typeof input !== 'object' || !('query' in input) || typeof input.query !== 'string' || input.query.length > 200) throw new Error('query must be text of 200 characters or fewer');
      const q = input.query.toLowerCase();
      return products.filter(p => [p.name.id, p.name.en, p.code].join(' ').toLowerCase().includes(q)).map(p => ({ name: p.name[lang], url: `/products/${p.slug}`, label: p.label, specifications: p.variants.map(v => v.label) }));
    } }, { signal: lifecycle.signal })).catch(() => {}); } catch {}
    return () => lifecycle.abort();
  }, [lang]);
  return <section className="catalog-section store-page"><div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{t('Beranda', 'Home')}</Link><span>/</span><span>{t('Katalog', 'Catalog')}</span></nav><div className="section-topline"><div><div className="eyebrow text-[#927040]">{t('KATALOG MATERIAL', 'MATERIAL CATALOG')}</div><h1 className="section-heading mt-4">{t('Cari bahan yang tepat.', 'Find the right materials.')}<br/>{t('Biar kami bantu siapkan.', 'Let us help source them.')}</h1></div><p className="section-intro">{t('Pilihan material untuk kebutuhan eceran hingga grosir. Pilih bahan dan spesifikasi, lalu tanyakan harga serta rencana pengadaannya.', 'Materials for smaller quantities through to wholesale. Choose your material and specification, then ask about pricing and sourcing.')}</p></div>
    <div className="catalog-toolbar"><div className="category-tabs" aria-label={t('Kategori produk', 'Product categories')}><button onClick={() => update('category', 'all')} aria-pressed={category === 'all'}>{t('Semua Produk', 'All Products')}<sup>{products.length}</sup></button>{categories.map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => update('category', c.id)}>{lang === 'id' ? c.idLabel : c.enLabel}</button>)}</div><div className="search-box"><Search size={18}/><input aria-label={t('Cari produk', 'Search products')} placeholder={t('Cari bahan atau spesifikasi...', 'Search materials or specs...')} value={query} maxLength={200} onChange={e => { setQuery(e.target.value); update('q', e.target.value); }}/>{query && <button aria-label={t('Hapus pencarian', 'Clear search')} onClick={() => { setQuery(''); update('q', ''); }}><X size={16}/></button>}</div></div>
    <div className="catalog-results-line"><p role="status">{t('Menampilkan', 'Showing')} <strong>{Math.min(visible, results.length)}</strong> {t('dari', 'of')} <strong>{results.length}</strong> {t('produk', 'products')}</p><select aria-label={t('Urutkan produk', 'Sort products')} value={sort} onChange={e => update('sort', e.target.value)}><option value="featured">{t('Pilihan Produk', 'Featured Selection')}</option><option value="name">{t('Nama A–Z', 'Name A–Z')}</option></select></div>
    <div className="product-grid">{results.slice(0, visible).map(p => <ProductCard key={p.id} product={p}/>)}</div>
    {results.length === 0 && <div className="catalog-empty"><Search size={30}/><h2>{t('Bahan belum ditemukan', 'No matching materials')}</h2><p>{t('Coba kata kunci lain atau sampaikan kebutuhan Anda kepada tim kami.', 'Try another search or share your requirements with our team.')}</p><Link className="btn btn-dark" href="/contact">{t('Konsultasikan Bahan', 'Discuss Your Requirements')}</Link></div>}
    {visible < results.length && <div className="text-center mt-9"><button className="btn btn-outline" onClick={() => setVisible(v => v + 12)}>{t('Lihat Lebih Banyak Produk', 'View More Products')}<ChevronDown size={17}/></button></div>}
    <p className="catalog-note">{t('Katalog material yang dapat diadakan. Harga, ketersediaan, dan pengiriman dikonfirmasi melalui konsultasi.', 'A portfolio of materials we can source. Pricing, availability and delivery are confirmed through consultation.')}</p>
    </div></section>;
}
