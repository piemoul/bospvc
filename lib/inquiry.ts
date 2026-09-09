import { products, type Lang, type QuoteItem } from './catalog';
import { colourLabel } from './colours';
export function itemText(item:QuoteItem,lang:Lang) {
  const p=products.find(p=>p.id===item.productId);
  const v=p?.variants.find(v=>v.id===item.variantId);
  if(!p||!v)return '';
  const unit=item.unit==='piece'?(lang==='id'?'lembar':'pieces'):item.unit==='meter'?(lang==='id'?'meter':'metres'):'roll';
  return [p.name[lang],v.label,`${item.quantity} ${unit}`,item.color?colourLabel(item.color,lang):''].filter(Boolean).join(' | ');
}
export function productInquiry(item:QuoteItem,lang:Lang,url?:string) {
  return (lang==='id'?'Halo BOSS BAHAN PVC, mohon penawaran untuk produk berikut:':'Hello BOSS BAHAN PVC, please provide a quotation for the following product:')+'\n\n'+itemText(item,lang)+(url?'\n'+url:'')+'\n\n'+(lang==='id'?'Mohon informasi harga, ketersediaan, dan pengiriman. Terima kasih.':'Please advise pricing, availability and delivery options. Thank you.');
}
export const mailLink=(email:string,body:string)=>`mailto:${email}?subject=${encodeURIComponent('Permintaan Penawaran / Quotation Inquiry — BOSS BAHAN PVC')}&body=${encodeURIComponent(body)}`;
export const chatLink=(phone:string,body:string)=>`https://wa.me/${phone}?text=${encodeURIComponent(body)}`;
