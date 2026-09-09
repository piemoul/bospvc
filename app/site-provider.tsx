'use client';

import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { products, validQuoteItem, type Lang, type QuoteItem } from '@/lib/catalog';

type SiteState = {
  lang: Lang; setLang: (lang: Lang) => void; t: (id: string, en: string) => string;
  whatsapp: string; salesEmail: string; items: QuoteItem[];
  setItems: Dispatch<SetStateAction<QuoteItem[]>>; addItem: (item: QuoteItem) => void;
};
const SiteContext = createContext<SiteState | null>(null);
const storageKey = 'boss-material-inquiry-v1';

export function SiteProvider({ children, initialLang, whatsapp, salesEmail }: { children: React.ReactNode; initialLang: Lang; whatsapp: string; salesEmail: string }) {
  const [lang, updateLang] = useState(initialLang);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [restored, setRestored] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = (id: string, en: string) => lang === 'id' ? id : en;
  const setLang = (next: Lang) => {
    document.cookie = `boss-language=${next};path=/;max-age=31536000;SameSite=Lax`;
    updateLang(next);
    router.refresh();
  };

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? '[]');
      if (Array.isArray(saved)) setItems(saved.filter(validQuoteItem).slice(0, 100));
    } catch { /* A disabled browser store does not prevent consultation. */ }
    setRestored(true);
  }, []);
  useEffect(() => {
    if (!restored) return;
    try { sessionStorage.setItem(storageKey, JSON.stringify(items)); } catch {}
  }, [items, restored]);
  useEffect(() => {
    document.documentElement.lang = lang;
    const product = products.find(p => pathname === `/products/${p.slug}`);
    const heading = product?.name[lang] ?? (pathname === '/store' ? t('Katalog Bahan', 'Material Catalog') : pathname === '/contact' ? t('Minta Harga & Cek Stok', 'Ask for Pricing & Availability') : t('Cari bahan? Kami siapkan.', 'Your materials. Ready to source.'));
    document.title = `${heading} | BOSS BAHAN PVC`;
  }, [lang, pathname]);

  const addItem = (item: QuoteItem) => {
    if (!validQuoteItem(item)) return;
    setItems(current => {
      const index = current.findIndex(i => i.productId === item.productId && i.variantId === item.variantId && i.color === item.color && i.unit === item.unit && i.photo === item.photo);
      return index < 0 ? [...current, item].slice(0, 100) : current.map((i, n) => n === index ? { ...i, quantity: Math.min(99999, i.quantity + item.quantity) } : i);
    });
  };
  return <SiteContext.Provider value={{ lang, setLang, t, whatsapp, salesEmail, items, setItems, addItem }}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error('SiteProvider is required');
  return context;
}
