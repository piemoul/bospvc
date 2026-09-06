import type { Viewport } from 'next';
import { cookies } from 'next/headers';
import Storefront from './storefront';
import PageInteractions from './page-interactions';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function Page() {
  const lang=(await cookies()).get('boss-language')?.value==='en'?'en':'id';
  const raw=process.env.WHATSAPP_NUMBER?.replace(/\D/g,'')??'';
  const whatsapp=/^[1-9]\d{7,14}$/.test(raw)?raw:'';
  const email=process.env.SALES_EMAIL?.trim()??'';
  const salesEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?email:'';
  return <><PageInteractions/><Storefront initialLang={lang} whatsapp={whatsapp} salesEmail={salesEmail}/></>;
}
