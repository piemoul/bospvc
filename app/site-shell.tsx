'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Menu, Pause, Play, X } from 'lucide-react';
import { chatLink } from '@/lib/inquiry';
import { useSite } from './site-provider';
import WhatsAppIcon from './whatsapp-icon';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t, whatsapp, items } = useSite();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const pathname = usePathname();
  const links = [
    ['/store', t('Produk', 'Products')],
    ['/#capabilities', t('Kapabilitas', 'Capabilities')],
    ['/#about', t('Tentang Kami', 'About Us')],
    ['/contact', t('Hubungi Kami', 'Contact')],
  ];
  const chat = whatsapp ? chatLink(whatsapp, t('Halo BOSS BAHAN PVC, saya ingin berkonsultasi mengenai bahan untuk usaha saya.', 'Hello BOSS BAHAN PVC, I would like to discuss materials for my business.')) : '/contact';
  return <>
    <a className="skip-link" href="#main-content">{t('Langsung ke konten', 'Skip to content')}</a>
    <div className="topbar" data-paused={paused}>
      <div className="ticker-window"><div className="ticker-track">{[0, 1].map(copy => <div className="ticker-group" key={copy} aria-hidden={copy === 1 || undefined}><span>{t('SOLUSI MATERIAL UNTUK KEBUTUHAN USAHA · Pengadaan grosir & kebutuhan produksi', 'MATERIAL SOLUTIONS FOR YOUR BUSINESS · Wholesale supply & production materials')} &nbsp;|&nbsp; MP TECH</span></div>)}</div></div>
      <button className="ticker-toggle" aria-label={paused ? t('Lanjutkan teks berjalan', 'Resume scrolling text') : t('Jeda teks berjalan', 'Pause scrolling text')} onClick={() => setPaused(!paused)}>{paused ? <Play size={12}/> : <Pause size={12}/>}</button>
    </div>
    <header className="site-header"><div className="container header-inner">
      <Link href="/" className="wordmark" aria-label="BOSS BAHAN PVC" onClick={() => setMobileOpen(false)}><img src="/images/logo-round.webp" alt="" width="60" height="60"/><strong className="brand-name">BOSS <span>BAHAN PVC</span></strong></Link>
      <nav className="desktop-nav" aria-label={t('Navigasi utama', 'Main navigation')}>{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}</nav>
      <div className="flex items-center gap-3"><div className="language-switch" aria-label={t('Pilih bahasa', 'Choose language')}><button aria-label="Bahasa Indonesia" aria-pressed={lang === 'id'} onClick={() => setLang('id')}>ID</button><button aria-label="English" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button></div><Link className="btn btn-dark header-quote" href="/contact">{t('Minta Harga', 'Get a Quote')}{items.length ? <span className="inquiry-count">{items.length}</span> : <ArrowUpRight size={16}/>}</Link><button className="icon-btn mobile-menu-button" aria-label={mobileOpen ? t('Tutup navigasi', 'Close navigation') : t('Buka navigasi', 'Open navigation')} aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20}/> : <Menu size={20}/>}</button></div>
    </div>{mobileOpen && <nav id="mobile-nav" className="mobile-nav" aria-label={t('Navigasi seluler', 'Mobile navigation')}>{links.map(([href, label]) => <Link href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</Link>)}</nav>}</header>
    <main id="main-content">{children}</main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><Link href="/" className="wordmark"><img src="/images/logo-round.webp" alt="BOSS BAHAN PVC" width="45" height="45" loading="lazy"/><div><strong>BOSS</strong><small>BAHAN PVC</small></div></Link><div className="footer-links"><Link href="/store">{t('Katalog Produk', 'Product Catalog')}</Link><Link href="/#capabilities">{t('Kapabilitas', 'Capabilities')}</Link><Link href="/contact">{t('Minta Harga & Cek Stok', 'Pricing & Availability')}</Link></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} BOSS BAHAN PVC. {t('Hak cipta dilindungi.', 'All rights reserved.')}</p><p>{t('Anda Bosnya. Kami siapkan bahannya.', 'You’re the boss. We supply the materials.')}</p></div></div></footer>
    <a className="whatsapp-button" aria-label={t('Konsultasi Langsung via WhatsApp', 'Chat Directly on WhatsApp')} href={chat} target={whatsapp ? '_blank' : undefined} rel={whatsapp ? 'noopener noreferrer' : undefined}><WhatsAppIcon/><span>{t('Konsultasi Langsung', 'Chat Directly')}</span></a>
  </>;
}
