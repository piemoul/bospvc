import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
export const metadata: Metadata = {
  title: 'Bos Bahan PVC | Anda Bosnya. Kami siapkan bahannya.',
  description: 'Mitra pengadaan bahan PVC untuk usaha Anda. Jelajahi kulit sintetis otomotif, mika, rigid, terpal, karpet, dan bahan tas. Ajukan penawaran sesuai kebutuhan.',
  icons: { icon: [{ url:'/favicon.ico', sizes:'any' },{url:'/icon.png',type:'image/png',sizes:'256x256'}], apple:'/apple-touch-icon.png' },
  robots: { index: false, follow: false },
};
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const lang=(await cookies()).get('boss-language')?.value==='en'?'en':'id';
  return <html lang={lang}><body>{children}</body></html>;
}
