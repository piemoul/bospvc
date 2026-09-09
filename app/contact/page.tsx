import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import ContactPageContent from './contact-content';

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getSiteConfig();
  return { title: lang === 'id' ? 'Minta Harga & Cek Stok | BOSS BAHAN PVC' : 'Pricing & Availability | BOSS BAHAN PVC', description: lang === 'id' ? 'Sampaikan bahan, ukuran, jumlah dan tujuan pengiriman. Kami bantu siapkan penawaran.' : 'Tell us the material, dimensions, quantity and delivery location. We will help prepare a quotation.' };
}
export default function ContactPage() { return <ContactPageContent/>; }
