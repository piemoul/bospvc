'use client';
import { Check, ArrowUpRight } from 'lucide-react';
import { chatLink } from '@/lib/inquiry';
import { useSite } from './site-provider';
import WhatsAppIcon from './whatsapp-icon';

export default function ContactIntro({ compact = false }: { compact?: boolean }) {
  const { t, whatsapp } = useSite();
  const Heading = compact ? 'h2' : 'h1';
  return <div className={compact ? 'contact-intro compact' : 'contact-intro'}><div className="eyebrow text-gold">{t('KONSULTASI BAHAN & PENGADAAN', 'MATERIAL ADVICE & SOURCING')}</div><Heading className="section-heading mt-5 text-white">{t('Butuh bahan apa, Bos?', 'What materials do you need, Boss?')}</Heading><p className="contact-intro-description">{t('Sebutkan bahan yang dicari, ukuran, ketebalan, dan jumlahnya. Kami bantu carikan pilihan dan harga terbaik untuk kebutuhan Anda.', 'Tell us the material, dimensions, thickness and quantity. We will help find suitable options and the best pricing for your requirements.')}</p><ul className="contact-benefits">{[t('Bisa disesuaikan dengan kebutuhan', 'Matched to your requirements'), t('Bisa konsultasi bahan dulu', 'Material advice before you order'), t('Harga langsung dari sumber / pabrik', 'Pricing directly from the source / factory')].map(text => <li key={text}><Check size={17}/>{text}</li>)}</ul>{whatsapp && <a className="contact-direct" href={chatLink(whatsapp, t('Halo BOSS BAHAN PVC, saya ingin konsultasi bahan dan meminta penawaran.', 'Hello BOSS BAHAN PVC, I would like material advice and a quotation.'))} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>{t('Chat kami via WhatsApp', 'Chat with us on WhatsApp')}<ArrowUpRight size={17}/></a>}</div>;
}
