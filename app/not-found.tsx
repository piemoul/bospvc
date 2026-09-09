'use client';
import Link from 'next/link';
import { useSite } from './site-provider';
export default function NotFound() {
  const { t } = useSite();
  return <div className="container not-found"><p className="eyebrow">404</p><h1 className="section-heading">{t('Halaman tidak ditemukan.', 'Page not found.')}</h1><p>{t('Cari bahan yang Anda butuhkan melalui katalog kami.', 'Find the materials you need in our catalog.')}</p><Link className="btn btn-dark" href="/store">{t('Jelajahi Produk', 'Explore Products')}</Link></div>;
}
