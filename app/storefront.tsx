'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Factory, Layers3, Menu, MessageCircle, Package, Pause, Play, Plus, Ruler, Search, ShieldCheck, ClipboardList, Truck, X } from 'lucide-react';
import { categories, categoryName, products, type Lang, type Product, type QuoteItem } from '@/lib/catalog';
import ProductDetail from './product-detail';
import QuoteForm from './quote-form';
import CapabilityGallery from './capability-gallery';
import { colourLabel, colourSwatch } from '@/lib/colours';

export default function Storefront({initialLang,whatsapp,salesEmail}:{initialLang:Lang;whatsapp:string;salesEmail:string}) {
  const [lang,setLang]=useState<Lang>(initialLang);
  const [category,setCategory]=useState('all');
  const [query,setQuery]=useState('');
  const [sort,setSort]=useState('featured');
  const [visible,setVisible]=useState(8);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [tickerPaused,setTickerPaused]=useState(false);
  const [selected,setSelected]=useState<Product|null>(null);
  const [items,setItems]=useState<QuoteItem[]>([]);
  const [chatOpen,setChatOpen]=useState(false);
  const [toast,setToast]=useState('');
  const toastTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const t=(id:string,en:string)=>lang==='id'?id:en;

  useEffect(()=>{
    document.documentElement.lang=lang;
    document.title=lang==='id'?'BOSS BAHAN PVC | Anda Bosnya. Kami siapkan bahannya.':"BOSS BAHAN PVC | You’re the boss. We supply the materials.";
    document.cookie=`boss-language=${lang};path=/;max-age=31536000;SameSite=Lax`;
  },[lang]);
  useEffect(()=>()=>{if(toastTimer.current)clearTimeout(toastTimer.current)},[]);

  const results=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase();
    const list=products.filter(p=>(category==='all'||p.category===category)&&(!q||[p.name.id,p.name.en,p.code,p.category,categoryName(p.category,lang),...p.variants.map(v=>v.label)].join(' ').toLocaleLowerCase().includes(q)));
    if(sort==='name')list.sort((a,b)=>a.name[lang].localeCompare(b.name[lang]));

    return list;
  },[category,query,sort,lang]);
  const setFilter=(id:string)=>{setCategory(id);setVisible(8);};
  const addItem=(item:QuoteItem)=>{
    setItems(current=>{
      const index=current.findIndex(i=>i.productId===item.productId&&i.variantId===item.variantId&&i.color===item.color&&i.unit===item.unit);
      if(index>=0)return current.map((i,n)=>n===index?{...i,quantity:Math.min(99999,i.quantity+item.quantity)}:i);
      return [...current,item];
    });
    setSelected(null);
    setToast(t('Produk ditambahkan ke permintaan penawaran.','Product added to your quote request.'));
    if(toastTimer.current)clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(''),4200);
  };
  const openChat=()=>{
    if(whatsapp)window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(t('Halo BOSS BAHAN PVC, saya ingin berkonsultasi mengenai kebutuhan bahan untuk usaha saya.','Hello BOSS BAHAN PVC, I would like to discuss material requirements for my business.'))}`,'_blank','noopener,noreferrer');
    else setChatOpen(v=>!v);
  };

  useEffect(()=>{
    const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
    if(!context?.registerTool)return;
    const lifecycle=new AbortController();
    try { void Promise.resolve(context.registerTool({name:'search_material_catalog',title:'Search the BOSS BAHAN PVC catalog',description:'Read material groups and available variants. Does not submit a quote or contact the business.',inputSchema:{type:'object',properties:{query:{type:'string'},language:{enum:['id','en']}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true},execute:(input:unknown)=>{
      if(!input||typeof input!=='object'||!('query'in input)||typeof input.query!=='string'||input.query.length>200)throw new Error('query must be text of 200 characters or fewer');
      const l='language'in input?input.language:'id'; if(l!=='id'&&l!=='en')throw new Error('language must be id or en');
      const q=input.query.toLowerCase();
      return products.filter(p=>[p.name.id,p.name.en,p.code].join(' ').toLowerCase().includes(q)).map(p=>({id:p.id,name:p.name[l],category:categoryName(p.category,l),variants:p.variants.map(v=>({id:v.id,specification:v.label}))}));
    }},{signal:lifecycle.signal})).catch(()=>{}); } catch {}
    return ()=>lifecycle.abort();
  },[]);

  return <>
    <a className="skip-link" href="#products">{t('Langsung ke katalog','Skip to catalog')}</a>
    <div className="topbar" data-paused={tickerPaused}><div className="ticker-window"><div className="ticker-track">{[0,1].map(copy=><div className="ticker-group" key={copy} aria-hidden={copy===1?true:undefined}><span>{t('SOLUSI MATERIAL UNTUK KEBUTUHAN USAHA · Pengadaan grosir & kebutuhan produksi','MATERIAL SOLUTIONS FOR YOUR BUSINESS · Wholesale supply & production materials')} &nbsp;|&nbsp; MP TECH</span></div>)}</div></div><button className="ticker-toggle" aria-label={tickerPaused?t('Lanjutkan teks berjalan','Resume scrolling text'):t('Jeda teks berjalan','Pause scrolling text')} onClick={()=>setTickerPaused(value=>!value)}>{tickerPaused?<Play size={12}/>:<Pause size={12}/>}</button></div>
    <header className="site-header"><div className="container header-inner">
      <a href="#home" className="wordmark" aria-label="BOSS BAHAN PVC"><img src="/images/logo-round.webp" alt="" width="57" height="57"/><div><strong className="brand-name">BOSS <span>BAHAN PVC</span></strong></div></a>
      <nav className="desktop-nav" aria-label={t('Navigasi utama','Main navigation')}><a href="#products">{t('Produk','Products')}</a><a href="#capabilities">{t('Kapabilitas','Capabilities')}</a><a href="#about">{t('Tentang Kami','About Us')}</a><a href="#quote">{t('Hubungi Kami','Contact')}</a></nav>
      <div className="flex items-center gap-3"><div className="language-switch" aria-label={t('Pilih bahasa','Choose language')}><button aria-label="Bahasa Indonesia" aria-pressed={lang==='id'} onClick={()=>setLang('id')}>ID</button><button aria-label="English" aria-pressed={lang==='en'} onClick={()=>setLang('en')}>EN</button></div><a className="btn btn-dark header-quote" href="#quote">{t('Minta Penawaran','Request a Quote')}{items.length>0?<span className="rounded-full bg-gold px-2 text-ink">{items.length}</span>:<ArrowUpRight size={16}/>}</a><button className="icon-btn mobile-menu-button" aria-label={t('Buka navigasi','Open navigation')} aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?<X size={20}/>:<Menu size={20}/>}</button></div>
    </div>{mobileOpen&&<nav id="mobile-nav" className="border-t border-gray-200 px-6 py-4 flex flex-col gap-1 text-sm" aria-label={t('Navigasi seluler','Mobile navigation')}>{[['products',t('Produk','Products')],['capabilities',t('Kapabilitas','Capabilities')],['about',t('Tentang Kami','About Us')],['quote',t('Minta Penawaran','Request a Quote')]].map(([id,label])=><a key={id} className="py-3" href={`#${id}`} onClick={()=>setMobileOpen(false)}>{label}{id==='quote'&&items.length>0?` (${items.length})`:''}</a>)}</nav>}</header>

    <main id="home">
      <section className="hero" aria-labelledby="hero-title">
        <img src="/images/warehouse.webp" alt={t('Fasilitas dan gudang material BOSS BAHAN PVC','BOSS BAHAN PVC material facility and warehouse')} className="hero-photo" width="1800" height="1350" fetchPriority="high"/>
        <div className="hero-shade"/>
        <div className="container hero-content"><div className="eyebrow text-gold hero-eyebrow">{t('Mitra Terpercaya untuk Pengadaan Bahan PVC','Your Trusted Partner for PVC Material Procurement')}</div>
          <div className="hero-heading-row"><h1 id="hero-title">{t('Anda Bosnya.','You’re the boss.')}<br/>{t('Kami siapkan','We supply')}<br/><span>{t('bahannya.','the materials.')}</span></h1><div className="hero-seal"><img src="/images/boss-approved-seal-v2.webp" width="600" height="600" alt={t('Logo BOSS BAHAN PVC dengan lima bintang emas — BOSS APPROVED','BOSS BAHAN PVC logo with five gold stars — BOSS APPROVED')} fetchPriority="high"/></div></div>
          <p className="hero-description">{t('Kulit sintetis, mika, rigid, terpal, hingga bahan pelapis. Satu mitra pengadaan untuk beragam kebutuhan usaha Anda.','Synthetic leather, clear sheets, rigid sheets, tarpaulins and covering materials. One supply partner for your business needs.')}</p>
          <div className="mt-7 flex flex-wrap gap-3"><a className="btn btn-gold" href="#products">{t('Jelajahi Produk','Explore Products')}<ArrowRight size={17}/></a><a className="btn btn-ghost" href="#quote">{t('Konsultasi Kebutuhan','Discuss Your Requirements')}<ArrowUpRight size={17}/></a></div>
          <div className="hero-footnotes"><span><Check/>{t('Pilihan material lengkap','A wide material selection')}</span><span><Check/>{t('Pengadaan sesuai kebutuhan','Supply for your requirements')}</span><span><Check/>{t('Mitra bisnis Anda','Your business partner')}</span></div>
          <div className="hero-photo-label"><span>BOSS BAHAN PVC</span><p>{t('Dari gudang kami, untuk bisnis Anda.','From our warehouse to your business.')}</p></div>
        </div>
      </section>
      <section className="trust-strip" aria-label={t('Layanan pengadaan','Procurement services')}><div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-5">{[
        [Layers3,t('Pilihan Produk Lengkap','A Complete Product Range'),t('Beragam aplikasi usaha','For a range of applications')],
        [Ruler,t('Pilihan Spesifikasi','Specification Options'),t('Ketebalan, motif & warna','Thicknesses, patterns & colours')],
        [Package,t('Pengadaan Fleksibel','Flexible Procurement'),t('Sesuaikan kebutuhan volume','Discuss your order volume')],
        [MessageCircle,t('Konsultasi Material','Material Consultation'),t('Pilihan sesuai kebutuhan','Find the right material')],
      ].map(([Icon,title,sub],i)=>{const I=Icon as typeof Layers3;return <div className="trust-item" key={i}><I/><div><strong>{title as string}</strong><p>{sub as string}</p></div></div>})}</div></section>

      <section id="products" className="catalog-section"><div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5"><div><div className="eyebrow text-[#927040]">{t('KATALOG MATERIAL','MATERIAL CATALOG')}</div><h2 className="section-heading mt-4">{t('Bahan yang tepat.','The right materials.')}<br/>{t('Untuk setiap kebutuhan.','For every requirement.')}</h2></div><p className="max-w-sm text-sm leading-7 text-[#757b77]">{t('Temukan spesifikasi yang sesuai, pilih produk, dan ajukan penawaran untuk kebutuhan bisnis Anda.','Find the right specifications, select your materials and request a quotation for your business.')}</p></div>
        <div className="catalog-toolbar"><div className="category-tabs" aria-label={t('Kategori produk','Product categories')}><button onClick={()=>setFilter('all')} aria-pressed={category==='all'}>{t('Semua Produk','All Products')}<sup>27</sup></button>{categories.map(c=><button key={c.id} onClick={()=>setFilter(c.id)} aria-pressed={category===c.id}>{lang==='id'?c.idLabel:c.enLabel}</button>)}</div><div className="search-box w-full xl:w-[240px] xl:flex-shrink-0"><Search size={18} className="text-gray-400"/><input aria-label={t('Cari produk','Search products')} placeholder={t('Cari bahan atau spesifikasi...','Search materials or specs...')} value={query} onChange={e=>{setQuery(e.target.value);setVisible(8)}}/>{query&&<button aria-label={t('Hapus pencarian','Clear search')} onClick={()=>setQuery('')}><X size={15}/></button>}</div></div>
        <div className="flex items-center justify-between gap-3 mb-5 text-xs text-[#757b77]"><p role="status">{t('Menampilkan','Showing')} <strong className="text-[#333d35]">{Math.min(visible,results.length)}</strong> {t('dari','of')} <strong className="text-[#333d35]">{results.length}</strong> {t('produk','products')}</p><label className="flex items-center gap-2"><span className="hidden sm:block">{t('Urutkan:','Sort by:')}</span><select className="bg-white p-2 text-xs text-[#343d37] max-w-[190px]" aria-label={t('Urutkan produk','Sort products')} value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">{t('Pilihan Produk','Featured Selection')}</option><option value="name">{t('Nama A–Z','Name A–Z')}</option></select></label></div>
        <div className="product-grid">{results.slice(0,visible).map(p=><article className="product-card" key={p.id}>
          <button className="product-image" onClick={()=>setSelected(p)} aria-label={`${t('Lihat detail','View details')}: ${p.name[lang]}`}><img src={p.images[0]} alt={p.name[lang]} loading="lazy" width="600" height="500"/><span className="image-label">MP TECH</span><span className="image-arrow"><ArrowUpRight size={16}/></span></button>
          <div className="product-body"><span className="category-label">{categoryName(p.category,lang)}</span><h3><button className="text-left hover:text-[#946b32]" onClick={()=>setSelected(p)}>{p.name[lang]}</button></h3><p className="product-spec">{p.dimensions||t('Spesifikasi sesuai kebutuhan','Specifications on request')}</p><div className="flex items-center gap-1.5 mt-3 mb-4 min-h-4" aria-label={t('Pilihan warna','Colour options')}>{p.colors.slice(0,5).map((c,i)=><span key={i} className="color-dot" title={colourLabel(c,lang)} style={{background:colourSwatch(c)}}/>)}<span className="text-[10px] text-[#838983] ml-1">{p.variants.length>1?`${p.variants.length} ${t('varian','variants')}`:p.colors.length>5?`+${p.colors.length-5} ${t('warna','colours')}`:t('Pilihan material','Material selection')}</span></div>
          <div className="product-footer"><button className="flex items-center justify-between w-full min-h-9 text-xs font-semibold text-[#384638]" aria-label={`${t('Minta penawaran','Request a quote')}: ${p.name[lang]}`} onClick={()=>setSelected(p)}>{t('Detail & Penawaran','Details & Quotation')}<ArrowUpRight size={18}/></button></div></div>
        </article>)}</div>
        {results.length===0&&<div className="rounded-lg border border-dashed border-gray-300 py-14 text-center"><Search size={32} className="mx-auto text-gray-400"/><h3 className="font-bold text-lg mt-4">{t('Produk tidak ditemukan','No matching products')}</h3><p className="text-sm text-gray-500 mt-2">{t('Coba kata kunci lain atau lihat seluruh kategori.','Try a different search or browse all categories.')}</p><button className="btn btn-outline mt-5" onClick={()=>{setQuery('');setFilter('all')}}>{t('Tampilkan Semua Produk','Show All Products')}</button></div>}
        <div className="flex flex-col items-center gap-4 mt-9">{results.length>visible&&<button className="btn btn-outline" onClick={()=>setVisible(v=>v+8)}>{t('Lihat Lebih Banyak Produk','View More Products')}<ChevronDown size={16}/></button>}<p className="text-[11px] text-center text-[#8a908b] max-w-2xl">{t('Harga, ketersediaan, dan pengiriman dikonfirmasi melalui konsultasi dan penawaran langsung.','Pricing, availability and delivery are confirmed through a consultation and quotation.')}</p></div>
      </div></section>

      <section id="capabilities" className="capability"><div className="container grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"><CapabilityGallery lang={lang}/><div><div className="eyebrow text-[#927040]">{t('KAPABILITAS & PERGUDANGAN','CAPABILITIES & WAREHOUSING')}</div><h2 className="section-heading mt-4">{t('Di balik bahan Anda,','Behind your materials,')}<br/>{t('ada kesiapan kami.','we’re ready to help.')}</h2><p className="text-[#707972] leading-7 mt-5">{t('Dari pemilihan material hingga persiapan pengadaan, kami membantu Anda menyesuaikan bahan dengan kebutuhan operasional usaha.','From material selection to procurement planning, we help align your materials with your business requirements.')}</p><ul className="capability-list">{[
        [Package,t('Penyimpanan material terorganisasi','Organised material storage'),t('Pilihan bahan dalam bentuk roll untuk beragam kebutuhan produksi.','Roll materials for a wide range of production needs.')],
        [Ruler,t('Pilihan spesifikasi produk','A range of product specifications'),t('Konsultasikan jenis bahan, ketebalan, warna, dan volume pengadaan.','Discuss material type, thickness, colour and order volume.')],
        [Truck,t('Koordinasi pengadaan & pengiriman','Procurement & delivery coordination'),t('Rencana pemenuhan disesuaikan dengan produk dan tujuan pengiriman.','Fulfilment is discussed according to the product and delivery destination.')],
      ].map(([Icon,title,desc],i)=>{const I=Icon as typeof Package;return <li key={i}><I/><div><strong>{title as string}</strong><p>{desc as string}</p></div></li>})}</ul><a className="mt-7 inline-flex items-center gap-3 text-sm font-bold" href="#quote">{t('Diskusikan Kebutuhan Anda','Discuss Your Requirements')}<ArrowUpRight size={18}/></a></div></div></section>

      <section id="about" className="brand-section"><div className="container"><div className="grid md:grid-cols-[.85fr_1.15fr] gap-10 md:gap-16 items-center"><img className="brand-image" src="/images/brand-banner.webp" alt="BOSS BAHAN PVC — kulit jok motor mobil, mika, rigid, terpal, karpet" width="953" height="549" loading="lazy"/><div><div className="eyebrow text-[#927040]">{t('KENALI BOSS BAHAN PVC','MEET BOSS BAHAN PVC')}</div><h2 className="section-heading mt-4">{t('Anda menentukan arah.','You set the direction.')}<br/>{t('Kami siapkan pilihan.','We bring the options.')}</h2><p className="mt-5 leading-7 text-[#717972]">{t('Bagi kami, Anda adalah Bosnya. Kebutuhan bisnis Anda menjadi dasar setiap rekomendasi material. BOSS BAHAN PVC menghadirkan pilihan bahan untuk pelaku usaha otomotif, interior, kemasan, konveksi, dan perdagangan.','To us, you’re the boss. Your business requirements guide every material recommendation. BOSS BAHAN PVC brings together materials for automotive, interior, packaging, textile and trading businesses.')}</p></div></div><div className="process">{[
        [t('Pilih material Anda','Choose your material'),t('Jelajahi katalog dan tentukan produk beserta spesifikasinya.','Explore the catalog and select your products and specifications.')],
        [t('Sampaikan kebutuhan','Share your requirements'),t('Informasikan volume, aplikasi, dan tujuan pengiriman Anda.','Tell us your quantity, application and delivery destination.')],
        [t('Dapatkan penawaran','Receive a quotation'),t('Konfirmasikan harga, ketersediaan, dan rencana pengadaan.','Confirm pricing, availability and your procurement plan.')],
      ].map(([title,desc],i)=><div key={title}><span>0{i+1} <ArrowRight size={13} className="inline ml-2"/></span><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>

      <section id="quote" className="quote-section"><div className="container grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-20 items-start"><div className="lg:pt-8"><div className="eyebrow text-gold">{t('MULAI PENGADAAN ANDA','LET’S PLAN YOUR SUPPLY')}</div><h2 className="section-heading mt-5 text-white">{t('Apa kebutuhan','What does your')}<br/>{t('bisnis Anda, Bos?','business need, Boss?')}</h2><p className="mt-5 max-w-sm text-[#b1bdb5] leading-7">{t('Sampaikan kebutuhan material Anda. Sertakan spesifikasi dan jumlah agar penawaran dapat disesuaikan dengan rencana usaha Anda.','Tell us about your material requirements. Include specifications and quantities so the quotation can reflect your business plans.')}</p><div className="mt-7 space-y-4 text-sm text-[#d1d8d3]"><p className="flex items-center gap-3"><Check size={17} className="text-gold"/>{t('Penawaran sesuai kebutuhan Anda','A quotation for your requirements')}</p><p className="flex items-center gap-3"><Check size={17} className="text-gold"/>{t('Konsultasi pilihan material','Material selection consultation')}</p><p className="flex items-center gap-3"><Check size={17} className="text-gold"/>{t('Tanpa komitmen pembelian','No purchase commitment')}</p></div><div className="border-t border-[#465049] mt-9 pt-6"><p className="text-sm text-[#aebbb2] mb-4">{t('Ingin berdiskusi langsung?','Prefer a conversation?')}</p><button className="inline-flex items-center gap-3 text-gold font-semibold text-sm" onClick={openChat}><MessageCircle size={21}/>{t('Konsultasi via WhatsApp','Chat on WhatsApp')}<ArrowUpRight size={16}/></button></div></div><QuoteForm lang={lang} items={items} setItems={setItems} whatsapp={whatsapp} salesEmail={salesEmail}/></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="flex flex-col sm:flex-row justify-between gap-6 pb-8"><a href="#home" className="wordmark text-white"><img src="/images/logo-round.webp" alt="BOSS BAHAN PVC" width="45" height="45" loading="lazy"/><div><strong>BOSS</strong><small>BAHAN PVC</small></div></a><div className="flex flex-wrap items-center gap-x-7 gap-y-3"><a href="#products">{t('Katalog Produk','Product Catalog')}</a><a href="#capabilities">{t('Kapabilitas','Capabilities')}</a><a href="#quote">{t('Minta Penawaran','Request a Quote')}</a></div></div><div className="flex flex-col sm:flex-row justify-between gap-3 border-t border-[#333d35] pt-5 pb-10 sm:pb-0 text-xs"><p>© {new Date().getFullYear()} BOSS BAHAN PVC. {t('Hak cipta dilindungi.','All rights reserved.')}</p><p className="sm:pr-42">{t('Anda Bosnya. Kami siapkan bahannya.','You’re the boss. We supply the materials.')}</p></div></div></footer>
    <button className="whatsapp-button" aria-label={t('Chat WhatsApp','WhatsApp chat')} aria-expanded={whatsapp?undefined:chatOpen} onClick={openChat}><MessageCircle size={23}/><span>{t('Chat dengan Kami','Chat with Us')}</span></button>
    {chatOpen&&<aside className="whatsapp-panel" aria-label="WhatsApp"><div className="bg-[#237b4d] text-white p-5 flex justify-between items-center"><div><strong>BOSS BAHAN PVC</strong><p className="text-xs mt-1 opacity-80">{t('Anda Bosnya, kami siap membantu.','You’re the boss. We’re here to help.')}</p></div><button aria-label={t('Tutup chat','Close chat')} onClick={()=>setChatOpen(false)}><X size={20}/></button></div><div className="p-5"><p className="text-sm leading-6 text-[#626e65]">{t('Layanan WhatsApp segera tersedia. Sementara itu, silakan sampaikan kebutuhan Anda melalui formulir penawaran.','WhatsApp service will be available soon. In the meantime, share your requirements using the quote form.')}</p><a className="btn btn-dark w-full mt-5" href="#quote" onClick={()=>setChatOpen(false)}>{t('Minta Penawaran','Request a Quote')}<ArrowRight size={16}/></a></div></aside>}
    {selected&&<ProductDetail key={selected.id} product={selected} lang={lang} onClose={()=>setSelected(null)} onAdd={addItem} whatsapp={whatsapp} salesEmail={salesEmail}/>}
    {toast&&<div className="toast" role="status">{toast}<a className="ml-3 text-gold underline" href="#quote" onClick={()=>setToast('')}>{t('Lihat','View')}</a></div>}
  </>;
}
