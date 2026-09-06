import source from './catalog.json';
export type Lang = 'id' | 'en';
export type Category = 'automotive' | 'sheet' | 'tarpaulin' | 'interior' | 'fabric';
export type Variant = { id: string; label: string; length: string; width: string; weight: string; status: string };
export type Product = { id: string; name: Record<Lang,string>; category: Category; code: string; description: Record<Lang,string>; images: string[]; colors: string[]; variants: Variant[]; dimensions: string; needsConfirmation: boolean; unit: string; sourceRow: number };
export type QuoteItem = { productId: string; variantId: string; color: string; quantity: number; unit: 'roll' | 'meter' | 'piece' };
export const products = source as Product[];
export const categories: {id: Category; idLabel: string; enLabel: string}[] = [
  {id:'automotive',idLabel:'Otomotif',enLabel:'Automotive'},
  {id:'sheet',idLabel:'Mika & Rigid',enLabel:'Clear & Rigid Sheets'},
  {id:'tarpaulin',idLabel:'Terpal',enLabel:'Tarpaulins'},
  {id:'interior',idLabel:'Interior & Rumah Tangga',enLabel:'Interior & Household'},
  {id:'fabric',idLabel:'Tas & Konveksi',enLabel:'Bags & Textiles'},
];
export const categoryName = (id: string, lang: Lang) => {const c=categories.find(c=>c.id===id); return c ? lang==='id' ? c.idLabel : c.enLabel : id;};
