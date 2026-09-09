import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import { SiteProvider } from './site-provider';
import SiteShell from './site-shell';
import './globals.css';
export const metadata: Metadata = {
  title: 'BOSS BAHAN PVC | Anda Bosnya. Kami siapkan bahannya.',
  description: 'Mitra pengadaan bahan PVC untuk usaha Anda. Jelajahi kulit sintetis otomotif, mika, rigid, terpal, karpet, dan bahan tas. Ajukan penawaran sesuai kebutuhan.',
  icons: { icon: [{ url:'/favicon.ico', sizes:'any' },{url:'/icon.png',type:'image/png',sizes:'256x256'}], apple:'/apple-touch-icon.png' },
  robots: { index: false, follow: false },
};
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const {lang,whatsapp,salesEmail}=await getSiteConfig();
  return <html lang={lang}><body><SiteProvider initialLang={lang} whatsapp={whatsapp} salesEmail={salesEmail}><SiteShell>{children}</SiteShell></SiteProvider></body></html>;
}
