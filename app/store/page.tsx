import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import StoreCatalog from './store-catalog';

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getSiteConfig();
  return { title: lang === 'id' ? 'Katalog Bahan | BOSS BAHAN PVC' : 'Material Catalog | BOSS BAHAN PVC', description: lang === 'id' ? 'Jelajahi pilihan material untuk usaha Anda. Pilih spesifikasi dan konsultasikan pengadaan bersama BOSS BAHAN PVC.' : 'Browse materials for your business. Select specifications and discuss sourcing with BOSS BAHAN PVC.' };
}
export default function StorePage() {
  return <Suspense fallback={<div className="container route-loading" aria-busy="true">BOSS BAHAN PVC</div>}><StoreCatalog/></Suspense>;
}
