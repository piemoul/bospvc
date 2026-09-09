'use client';
import { useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardList, Download, Mail, X } from 'lucide-react';
import { products, productHref, validQuoteItem, type Lang, type QuoteItem, type RequestUnit } from '@/lib/catalog';
import { itemText, mailLink, chatLink } from '@/lib/inquiry';
import { colourLabel } from '@/lib/colours';
import WhatsAppIcon from './whatsapp-icon';

type Inquiry={name:string;company:string;email:string;phone:string;message:string;items:QuoteItem[]};
export default function QuoteForm({lang,items,setItems,whatsapp,salesEmail}:{lang:Lang;items:QuoteItem[];setItems:Dispatch<SetStateAction<QuoteItem[]>>;whatsapp:string;salesEmail:string}) {
  const [inquiry,setInquiry]=useState<Inquiry|null>(null);
  const [error,setError]=useState('');
  const [origin,setOrigin]=useState('');
  useEffect(()=>setOrigin(window.location.origin),[]);
  const t=(id:string,en:string)=>lang==='id'?id:en;
  const inquiryText=()=>inquiry?[
    t('Halo BOSS BAHAN PVC, mohon harga dan informasi pengadaan untuk kebutuhan berikut.','Hello BOSS BAHAN PVC, please provide pricing and sourcing information for the following requirements.'),'',
    t('Nama: ','Name: ')+inquiry.name,t('Usaha: ','Business: ')+inquiry.company,
    ...(inquiry.email?['Email: '+inquiry.email]:[]),...(inquiry.phone?[t('WhatsApp / Telepon: ','WhatsApp / Phone: ')+inquiry.phone]:[]),'',
    ...inquiry.items.flatMap(item=>{const p=products.find(p=>p.id===item.productId)!;const query=new URLSearchParams({variant:item.variantId,unit:item.unit});if(item.color)query.set('color',item.color);return [itemText(item,lang),`${origin}${productHref(p)}?${query}`,''];}),
    inquiry.message,'',t('Mohon konfirmasi harga, ketersediaan, dan pengiriman. Terima kasih.','Please confirm pricing, availability and delivery. Thank you.'),
  ].join('\n'):'';
  function prepare(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const text=(key:string)=>String(data.get(key)||'').trim();
    const next:Inquiry={name:text('name'),company:text('company'),email:text('email'),phone:text('phone'),message:text('message'),items:[...items]};
    if(next.name.length<2||next.company.length<2||next.message.length<10){setError(t('Lengkapi nama, usaha, dan detail kebutuhan dengan jelas.','Please enter your name, business and requirements.'));return;}
    if(!next.email&&!next.phone){setError(t('Isi email atau nomor WhatsApp agar tim kami dapat menghubungi Anda.','Enter an email or WhatsApp number so our team can reach you.'));return;}
    if(next.phone&&next.phone.replace(/\D/g,'').length<6){setError(t('Periksa kembali nomor WhatsApp / No. HP Anda.','Please check your WhatsApp / phone number.'));return;}
    if(items.some(item=>!validQuoteItem(item))){setError(t('Periksa spesifikasi, jumlah, dan satuan bahan yang dipilih.','Please check the selected specifications, quantities and units.'));return;}
    setError('');setInquiry(next);
  }
  const download=()=>{const url=URL.createObjectURL(new Blob([inquiryText()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='BOSS-BAHAN-PVC-Inquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const updateItem=(index:number,patch:Partial<QuoteItem>)=>setItems(current=>current.map((item,i)=>i===index?{...item,...patch}:item));
  return <div className="quote-form">
    {inquiry&&<div aria-live="polite"><Mail size={32} className="text-[#a27b42]"/><h2 className="text-2xl font-bold mt-4">{t('Permintaan siap dikirim.','Your inquiry is ready.')}</h2><p className="text-sm text-[#727e70] leading-6 mt-3">{t('Periksa ringkasan kebutuhan Anda, lalu buka WhatsApp atau draf email untuk menghubungi tim kami.','Review your requirements, then open WhatsApp or an email draft to contact our team.')}</p><pre className="inquiry-preview">{inquiryText()}</pre><div className="inquiry-send-actions">{whatsapp&&<a className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer" href={chatLink(whatsapp,inquiryText())}><WhatsAppIcon width="18" height="18"/>{t('Buka WhatsApp','Open WhatsApp')}</a>}{salesEmail&&<a className="btn btn-dark" href={mailLink(salesEmail,inquiryText())}><Mail size={17}/>{t('Buka Draf Email','Open Email Draft')}</a>}<button className="btn btn-outline" onClick={download}><Download size={17}/>{t('Simpan Ringkasan','Save Summary')}</button></div><p className="inquiry-destination">{salesEmail&&<>{t('Tujuan email: ','Email to: ')}{salesEmail}<br/></>}{t('Permintaan belum dikirim. Kirim dari aplikasi email atau WhatsApp Anda.','Your inquiry has not been sent. Send it from your email or WhatsApp application.')}</p><button className="text-sm underline mt-5" onClick={()=>setInquiry(null)}>{t('Ubah Permintaan','Edit Inquiry')}</button></div>}
    <form className={inquiry?'hidden':''} onSubmit={prepare}>
      <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold tracking-tight">{t('MINTA HARGA & CEK STOK','ASK FOR PRICING & AVAILABILITY')}</h2><ClipboardList size={23} className="text-[#9c8057] shrink-0"/></div><p className="quote-form-intro">{t('Isi kebutuhan bahan yang Bos cari, kami bantu cek pilihan, ketersediaan, dan harga terbaik.','Tell us the materials you need. We will help check the options, availability and best pricing.')}</p>
      {items.length>0&&<div className="quote-items">{items.map((item,index)=>{const p=products.find(p=>p.id===item.productId)!;const variant=p.variants.find(v=>v.id===item.variantId)!;const photo=p.colorImages[item.color]?.src??p.images[0];return <div className="quote-line" key={`${item.productId}-${item.variantId}-${index}`}><img src={photo} alt="" width="48" height="48"/><div className="min-w-0 flex-1"><Link className="text-xs font-bold" href={productHref(p)}>{p.name[lang]}</Link><p className="text-[11px] text-[#7e8777] mt-1">{variant.label}{item.color?' · '+colourLabel(item.color,lang):''}</p><div className="quote-item-controls"><label>{t('Jumlah','Quantity')}<input type="number" min={item.unit==='meter'?0.1:1} max="99999" step={item.unit==='meter'?0.1:1} required aria-label={t('Jumlah: ','Quantity: ')+p.name[lang]} value={Number.isFinite(item.quantity)?item.quantity:''} onChange={e=>updateItem(index,{quantity:e.target.valueAsNumber})}/></label><select aria-label={t('Satuan: ','Unit: ')+p.name[lang]} value={item.unit} onChange={e=>{const unit=e.target.value as RequestUnit;updateItem(index,{unit,quantity:unit!=='meter'?Math.max(1,Math.ceil(item.quantity)||1):item.quantity});}}>{p.allowedUnits.map(u=><option key={u} value={u}>{u==='roll'?'Roll':u==='meter'?t('Meter','Metre'):t('Lembar','Piece')}</option>)}</select></div></div><button type="button" className="remove-quote-item" aria-label={t('Hapus ','Remove ')+p.name[lang]} onClick={()=>setItems(current=>current.filter((_,i)=>i!==index))}><X size={17}/></button></div>;})}</div>}
      <label className="field mb-5">{t('Bahan yang dicari','Materials of interest')}<select value="" onChange={e=>{const p=products.find(p=>p.id===e.target.value);if(p)setItems(current=>[...current,{productId:p.id,variantId:p.variants[0].id,color:'',quantity:1,unit:p.allowedUnits[0]}]);}}><option value="">{t('+ Pilih bahan yang mau ditanyakan','+ Select a material to inquire about')}</option>{products.map(p=><option key={p.id} value={p.id} disabled={items.some(item=>item.productId===p.id)}>{p.name[lang]}</option>)}</select></label>
      <div className="grid sm:grid-cols-2 gap-4"><label className="field">{t('Nama Bos','Your name')} *<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder={t('Nama Anda','Your name')}/></label><label className="field">{t('Nama usaha','Business name')} *<input name="company" autoComplete="organization" required minLength={2} maxLength={150} placeholder={t('Nama toko / usaha Anda','Your store / business name')}/></label><label className="field">Email<input name="email" type="email" autoComplete="email" maxLength={200} placeholder="nama@email.com"/></label><label className="field">{t('WhatsApp / No. HP','WhatsApp / Phone')}<input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="+62 ..."/></label></div>
      <p className="contact-field-help">{t('Isi minimal email atau nomor WhatsApp.','Please provide an email or WhatsApp number.')}</p>
      <label className="field mt-4">{t('Kebutuhan bahan & tujuan kirim','Materials & delivery destination')} *<textarea name="message" required minLength={10} maxLength={3000} placeholder={t('Contoh: PVC 0.8 mm, 20 meter, kirim ke Jakarta','Example: 0.8 mm PVC, 20 metres, deliver to Jakarta')}/></label>
      {error&&<p role="alert" className="form-error">{error}</p>}
      <button type="submit" className="btn btn-gold w-full mt-5">{t('Siapkan Permintaan Harga','Prepare a Quote Request')}<ArrowRight size={17}/></button><p className="inquiry-helper">{t('Tinjau kebutuhan Anda sebelum mengirim lewat WhatsApp atau email.','Review your requirements before sending via WhatsApp or email.')}</p>
    </form>
  </div>;
}
