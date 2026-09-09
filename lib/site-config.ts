import 'server-only';
import { cookies } from 'next/headers';
import type { Lang } from './catalog';

export async function getSiteConfig() {
  const lang: Lang = (await cookies()).get('boss-language')?.value === 'en' ? 'en' : 'id';
  const phone = process.env.WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '';
  const email = process.env.SALES_EMAIL?.trim() ?? '';
  return {
    lang,
    whatsapp: /^[1-9]\d{7,14}$/.test(phone) ? phone : '',
    salesEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '',
  };
}
