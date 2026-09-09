'use client';
import Link from 'next/link';
import { useSite } from '../site-provider';
import ContactIntro from '../contact-intro';
import QuoteForm from '../quote-form';

export default function ContactPageContent() {
  const { lang, t, items, setItems, whatsapp, salesEmail } = useSite();
  return <section className="quote-section contact-page"><div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{t('Beranda', 'Home')}</Link><span>/</span><span>{t('Hubungi Kami', 'Contact')}</span></nav><div className="contact-layout"><ContactIntro/><QuoteForm lang={lang} items={items} setItems={setItems} whatsapp={whatsapp} salesEmail={salesEmail}/></div></div></section>;
}
