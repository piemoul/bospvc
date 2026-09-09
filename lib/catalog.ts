import source from './catalog.json';
import editorial from './product-editorial.json';
export type Lang = 'id' | 'en';
export type Category = 'automotive' | 'sheet' | 'tarpaulin' | 'interior' | 'fabric';
export type Variant = { id: string; label: string; length: string; width: string; weight: string; status: string };
export type RequestUnit = 'roll' | 'meter' | 'piece';
export type ColorImage = { src: string; kind: 'original' | 'illustration' };
export type ProductEditorial = { slug: string; label: string; allowedUnits: RequestUnit[]; details: Record<Lang,string[]>; colorImages: Record<string,ColorImage>; previewMode?: 'photos' };
export type Product = ProductEditorial & { id: string; name: Record<Lang,string>; category: Category; code: string; description: Record<Lang,string>; images: string[]; colors: string[]; variants: Variant[]; dimensions: string; needsConfirmation: boolean; unit: string; sourceRow: number };
export type QuoteItem = { productId: string; variantId: string; color: string; quantity: number; unit: 'roll' | 'meter' | 'piece'; photo?: number };
const overrides = editorial as Record<string,ProductEditorial>;
export const products: Product[] = source.map(p => ({ ...p, ...overrides[p.id] })) as Product[];
export const productHref = (p: Product) => `/products/${p.slug}`;
export function validQuantity(value: number, unit: RequestUnit) {
  return Number.isFinite(value) && value >= (unit === 'meter' ? 0.1 : 1) && value <= 99999 && (unit === 'meter' || Number.isInteger(value));
}
export function validQuoteItem(value: unknown): value is QuoteItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as QuoteItem;
  const product = products.find(p => p.id === item.productId);
  return !!product && product.variants.some(v => v.id === item.variantId)
    && product.allowedUnits.includes(item.unit) && validQuantity(item.quantity, item.unit)
    && typeof item.color === 'string' && (item.color === '' || product.colors.includes(item.color))
    && (item.photo === undefined || (Number.isSafeInteger(item.photo) && item.photo >= 0 && item.photo < product.images.length));
}
export const categories: {id: Category; idLabel: string; enLabel: string}[] = [
  {id:'automotive',idLabel:'Otomotif',enLabel:'Automotive'},
  {id:'sheet',idLabel:'Mika & Rigid',enLabel:'Clear & Rigid Sheets'},
  {id:'tarpaulin',idLabel:'Terpal',enLabel:'Tarpaulins'},
  {id:'interior',idLabel:'Interior & Rumah Tangga',enLabel:'Interior & Household'},
  {id:'fabric',idLabel:'Tas & Konveksi',enLabel:'Bags & Textiles'},
];
export const categoryName = (id: string, lang: Lang) => {const c=categories.find(c=>c.id===id); return c ? lang==='id' ? c.idLabel : c.enLabel : id;};
