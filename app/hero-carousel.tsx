'use client';

import Link from 'next/link';
import { useRef, useState, type PointerEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { chatLink } from '@/lib/inquiry';
import { useSite } from './site-provider';
import WhatsAppIcon from './whatsapp-icon';

export default function HeroCarousel() {
  const { t, whatsapp } = useSite();
  const [active, setActive] = useState(0);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const slides = [
    {
      kicker: t('HARGA UNTUK USAHA ANDA', 'PRICING FOR YOUR BUSINESS'),
      first: t('Bos, cari bahan', 'Factory pricing'), middle: t('harga pabrik?', 'for your business.'), last: t('Kami siapkan!', 'Let’s talk value.'),
      description: t('Untuk produksi, jualan, atau proyek, dapatkan harga pabrik dengan penawaran sesuai volume. Dari kebutuhan eceran hingga grosir.', 'For production, resale or projects, get factory pricing tailored to your volume, from smaller quantities to wholesale.'),
      detail: t('Sampaikan jumlah kebutuhan Anda. Kami bantu hitungkan penawarannya.', 'Tell us the quantity you need. We will help prepare the pricing.'),
      primary: t('Minta Penawaran', 'Request a Quote'), href: '/contact', secondary: t('Diskusikan Harga', 'Discuss Pricing'),
      message: t('Halo BOSS BAHAN PVC, saya ingin meminta penawaran berdasarkan jenis bahan dan jumlah kebutuhan saya.', 'Hello BOSS BAHAN PVC, I would like a quotation based on my material type and required quantity.'),
      benefits: [t('MOQ fleksibel', 'Flexible MOQ'), t('Penawaran sesuai volume', 'Volume-based quotations')],
      photo: 'hero-business', photoAlt: t('Rak bahan dan area gudang BOSS BAHAN PVC', 'BOSS BAHAN PVC material racks and warehouse'), photoCaption: t('Bahan untuk skala usaha Anda.', 'Materials for your business scale.'),
    },
    {
      kicker: t('TEMUKAN MATERIAL YANG TEPAT', 'FIND THE RIGHT MATERIAL'),
      first: t('Bahan lengkap.', 'More materials.'), middle: t('Pilih spesifikasi.', 'Choose the details.'), last: t('Sesuai kebutuhan.', 'Made for your work.'),
      description: t('Kulit sintetis, mika, rigid, spunbond, hingga terpal. Kenali karakter setiap bahan dan pilih spesifikasi yang sesuai untuk hasil kerja Anda.', 'From synthetic leather and clear sheets to spunbond and tarpaulins, explore each material and choose the specifications your work needs.'),
      detail: t('Belum yakin memilih? Ceritakan aplikasinya, kami bantu arahkan.', 'Unsure what to choose? Describe the application and we will help guide you.'),
      primary: t('Jelajahi Produk', 'Explore Products'), href: '/store', secondary: t('Konsultasi Material', 'Material Advice'),
      message: t('Halo BOSS BAHAN PVC, saya ingin konsultasi pemilihan bahan, tekstur, warna, dan ketebalan untuk aplikasi saya.', 'Hello BOSS BAHAN PVC, I would like advice on material, texture, colour and thickness for my application.'),
      benefits: [t('Pilihan Produk Lengkap', 'A Complete Product Range'), t('Spesifikasi mudah dibandingkan', 'Compare specifications')],
      photo: 'hero-materials', photoAlt: t('Ragam material dalam roll di gudang BOSS BAHAN PVC', 'A range of rolled materials at BOSS BAHAN PVC'), photoCaption: t('Beragam bahan, satu tempat.', 'Different materials, one place.'),
    },
    {
      kicker: t('PENGADAAN & PENGIRIMAN', 'SOURCING & DELIVERY'),
      first: t('Bahan siap.', 'Materials ready.'), middle: t('Usaha makin', 'Keep your business'), last: t('lancar.', 'moving.'),
      description: t('Mulai dari kebutuhan produksi hingga tujuan kirim, kami bantu koordinasikan pengadaan bahan agar rencana kerja Anda lebih teratur.', 'From production requirements to the delivery destination, we help coordinate your material supply around your work plans.'),
      detail: t('Informasikan lokasi dan jadwal kebutuhan. Tim kami mengonfirmasi rencana pemenuhan bersama Anda.', 'Share your location and required schedule. Our team will confirm a fulfilment plan with you.'),
      primary: t('Rencanakan Pengadaan', 'Plan Your Supply'), href: '/contact', secondary: t('Tanya Pengiriman', 'Discuss Delivery'),
      message: t('Halo BOSS BAHAN PVC, saya ingin membahas rencana pengadaan, jadwal kebutuhan, dan pengiriman bahan.', 'Hello BOSS BAHAN PVC, I would like to discuss sourcing, required timing and material delivery.'),
      benefits: [t('Kirim seluruh Indonesia', 'Delivery across Indonesia'), t('Koordinasi hingga tujuan', 'Coordinated to your destination')],
      photo: 'hero-sourcing', photoAlt: t('Area penyimpanan roll terkemas BOSS BAHAN PVC', 'Wrapped material roll storage at BOSS BAHAN PVC'), photoCaption: t('Dari gudang kami ke tujuan Anda.', 'From our warehouse to your destination.'),
    },
  ];
  const go = (index: number) => setActive((index + slides.length) % slides.length);
  const startSwipe = (event: PointerEvent<HTMLElement>) => {
    if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('a, button')) return;
    gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const endSwipe = (event: PointerEvent<HTMLElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.3) go(active + (dx < 0 ? 1 : -1));
  };
  return <section className="hero hero-rev1" aria-roledescription="slideshow" aria-label={t('Pilihan pengadaan bahan', 'Material sourcing options')} onPointerDown={startSwipe} onPointerUp={endSwipe} onPointerCancel={() => { gesture.current = null; }}>
    {slides.map((slide, i) => <img key={slide.photo} src={`/images/${slide.photo}-1800.webp`} srcSet={`/images/${slide.photo}-720.webp 720w, /images/${slide.photo}-1800.webp 1800w`} sizes="100vw" alt={slide.photoAlt} className="hero-photo" data-active={i === active} aria-hidden={i !== active} width="1800" height={i===1?1350:2400} fetchPriority={i===0?'high':'low'} loading={i===0?'eager':'lazy'} draggable={false}/>)}
    <div className="hero-shade"/>
    <div className="container hero-content">
      <div className="hero-slide-stack" aria-live="polite" aria-atomic="true">{slides.map((slide, i) => <div className="hero-slide" id={`hero-slide-${i+1}`} key={i} data-active={i===active} aria-hidden={i!==active} inert={i!==active}>
        <div className="eyebrow text-gold hero-eyebrow">{slide.kicker}</div>
        <div className="hero-heading-row"><h1>{slide.first}<br/>{slide.middle}<br/><span>{slide.last}</span></h1><div className="hero-seal"><img src="/images/boss-approved-seal-v2.webp" width="600" height="600" alt="BOSS BAHAN PVC — BOSS APPROVED" draggable={false}/></div></div>
        <p className="hero-description">{slide.description}</p><p className="hero-materials">{slide.detail}</p>
        <div className="hero-actions"><Link className="btn btn-gold" href={slide.href}>{slide.primary}<ArrowRight size={17}/></Link><a className="btn btn-ghost" href={whatsapp?chatLink(whatsapp,slide.message):'/contact'} target={whatsapp?'_blank':undefined} rel="noopener noreferrer"><WhatsAppIcon width="18" height="18"/>{slide.secondary}</a></div>
        <div className="hero-footnotes">{slide.benefits.map(text=><span key={text}><Check/>{text}</span>)}</div>
      </div>)}</div>
      <div className="hero-controls"><div className="hero-pagination" aria-label={t('Pilih slide', 'Choose slide')}>{slides.map((slide,i)=><button key={i} onClick={()=>go(i)} aria-label={`${t('Slide','Slide')} ${i+1}: ${slide.kicker}`} aria-pressed={i===active} aria-controls={`hero-slide-${i+1}`}><span/></button>)}</div></div>
      <div className="hero-photo-label"><span>BOSS BAHAN PVC</span><p>{slides[active].photoCaption}</p></div>
    </div>
  </section>;
}
