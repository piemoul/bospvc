'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { chatLink } from '@/lib/inquiry';
import { useSite } from './site-provider';
import WhatsAppIcon from './whatsapp-icon';

export default function HeroCarousel() {
  const { t, whatsapp } = useSite();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!paused && !engaged && !motion.matches && !document.hidden) timer = setInterval(() => setActive(i => (i + 1) % 3), 9500);
    };
    sync(); motion.addEventListener('change', sync); document.addEventListener('visibilitychange', sync);
    return () => { clearInterval(timer); motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, [paused, engaged]);
  const slides = [
    { kicker: t('BAHAN UNTUK USAHA ANDA', 'MATERIALS FOR YOUR BUSINESS'), first: t('Bos, cari bahan', 'Factory pricing'), middle: t('harga pabrik?', 'for your materials?'), last: t('Kami siapkan!', 'We’ll source them!'), description: t('Butuh bahan untuk produksi, jualan, atau proyek? Temukan pilihan bahan dengan harga kompetitif di satu tempat.', 'Materials for production, resale or a project? Find a wide selection at competitive prices in one place.'), detail: t('Kulit sintetis, mika, rigid, spunbond, dan terpal. Dari kebutuhan eceran hingga grosir.', 'Synthetic leather, clear and rigid sheets, spunbond and tarpaulins. From smaller quantities to wholesale.'), cta: t('Konsultasi Langsung', 'Chat Directly') },
    { kicker: t('PILIHAN LENGKAP, PENGADAAN MUDAH', 'MORE CHOICE, EASIER SOURCING'), first: t('Bahan lengkap.', 'More materials.'), middle: t('Siap diadakan.', 'Ready to source.'), last: t('Harga pabrik.', 'Factory pricing.'), description: t('Satu tempat untuk berbagai kebutuhan bahan usaha Anda. Sampaikan jenis bahan dan jumlahnya, kami bantu siapkan penawaran.', 'One place for your business materials. Tell us the type and quantity, and we will help prepare a quotation.'), detail: t('Kirim kebutuhan Anda kapan saja. Tim kami membantu mengecek pilihan dan rencana pengadaan.', 'Send your requirements anytime. Our team will help check the options and plan your supply.'), cta: t('Konsultasi Langsung', 'Chat Directly') },
    { kicker: t('ANDA BOSNYA. KAMI SIAPKAN BAHANNYA.', 'YOU’RE THE BOSS. WE SUPPLY THE MATERIALS.'), first: t('Cari bahan', 'Your materials.'), middle: t('harga pabrik?', 'Your requirements.'), last: t('Kami siapkan, Bos.', 'Let us help.'), description: t('Dari bahan pelapis hingga kebutuhan produksi, kami membantu memilihkan material yang sesuai untuk usaha Anda.', 'From covering materials to production supplies, we help find the right materials for your business.'), detail: t('Cari bahannya. Cek harganya. Ajukan penawaran sesuai kebutuhan Anda.', 'Find your materials. Check the pricing. Request a quotation for your requirements.'), cta: t('Tanya Harga & Kebutuhan', 'Discuss Pricing & Requirements') },
  ];
  const chat = whatsapp ? chatLink(whatsapp, t('Halo BOSS BAHAN PVC, saya ingin tanya harga dan pengadaan bahan untuk usaha saya.', 'Hello BOSS BAHAN PVC, I would like to discuss material pricing and sourcing for my business.')) : '/contact';
  const go = (i: number) => { setActive((i + 3) % 3); setPaused(true); };
  return <section className="hero hero-rev1" aria-roledescription={t('slideshow', 'slideshow')} aria-label={t('Pilihan pengadaan bahan', 'Material sourcing options')} onMouseEnter={() => setEngaged(true)} onMouseLeave={() => setEngaged(false)} onFocusCapture={() => setEngaged(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setEngaged(false); }}>
    <img src="/images/warehouse.webp" alt={t('Gudang material BOSS BAHAN PVC', 'BOSS BAHAN PVC material warehouse')} className="hero-photo" width="1800" height="1350" fetchPriority="high"/>
    <div className="hero-shade"/>
    <div className="container hero-content">
      <div className="hero-slide-stack">{slides.map((slide, i) => <div className="hero-slide" key={i} data-active={i === active} aria-hidden={i !== active} inert={i !== active}>
        <div className="eyebrow text-gold hero-eyebrow">{slide.kicker}</div>
        <div className="hero-heading-row"><h1>{slide.first}<br/>{slide.middle}<br/><span>{slide.last}</span></h1><div className="hero-seal"><img src="/images/boss-approved-seal-v2.webp" width="600" height="600" alt="BOSS BAHAN PVC — BOSS APPROVED" fetchPriority={i === 0 ? 'high' : undefined}/></div></div>
        <p className="hero-description">{slide.description}</p><p className="hero-materials">{slide.detail}</p>
        <div className="hero-actions"><Link className="btn btn-gold" href="/store">{t('Jelajahi Produk', 'Explore Products')}<ArrowRight size={17}/></Link><a className="btn btn-ghost" href={chat} target={whatsapp ? '_blank' : undefined} rel="noopener noreferrer"><WhatsAppIcon width="18" height="18"/>{slide.cta}</a></div>
      </div>)}</div>
      <div className="hero-footnotes"><span><Check/>{t('Eceran hingga grosir', 'Small quantities to wholesale')}</span><span><Check/>{t('Konsultasi bahan sebelum pesan', 'Material advice before ordering')}</span></div>
      <div className="hero-controls"><div className="hero-pagination" aria-label={t('Pilih slide', 'Choose slide')}>{slides.map((_, i) => <button key={i} onClick={() => go(i)} aria-label={`${t('Slide', 'Slide')} ${i + 1}`} aria-pressed={i === active}><span/></button>)}</div><span className="hero-slide-number">0{active + 1} / 03</span><button aria-label={t('Slide sebelumnya', 'Previous slide')} onClick={() => go(active - 1)}><ChevronLeft size={17}/></button><button aria-label={t('Slide berikutnya', 'Next slide')} onClick={() => go(active + 1)}><ChevronRight size={17}/></button><button className="hero-pause" aria-label={paused ? t('Putar slide otomatis', 'Play slideshow') : t('Jeda slide', 'Pause slideshow')} onClick={() => setPaused(!paused)}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button></div>
      <div className="hero-photo-label"><span>BOSS BAHAN PVC</span><p>{t('Dari gudang kami, untuk bisnis Anda.', 'From our warehouse to your business.')}</p></div>
    </div>
  </section>;
}
