'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Factory, Layers3, Package, Truck } from 'lucide-react';
import { products } from '@/lib/catalog';
import { useSite } from './site-provider';
import HeroCarousel from './hero-carousel';
import ProductCard from './product-card';
import CapabilityGallery from './capability-gallery';
import ContactIntro from './contact-intro';

export default function Storefront() {
  const { lang, t } = useSite();
  const router = useRouter();
  useEffect(() => {
    const redirect = () => {
      if (window.location.hash === '#products') router.replace('/store');
      if (window.location.hash === '#quote') router.replace('/contact');
    };
    redirect(); window.addEventListener('hashchange', redirect);
    return () => window.removeEventListener('hashchange', redirect);
  }, [router]);
  const services = [
    {icon:Layers3,title:t('Pilihan Produk Lengkap','A Complete Product Range'),text:t('Beragam kebutuhan usaha','For your business needs')},
    {icon:Factory,title:t('Harga Pabrik','Factory Pricing'),text:t('Penawaran yang kompetitif','Competitive quotations')},
    {icon:Package,title:t('MOQ Fleksibel','Flexible MOQ'),text:t('Lebih banyak, lebih hemat','Better value for larger quantities')},
    {icon:Truck,title:t('Kirim Seluruh Indonesia','Delivery Across Indonesia'),text:t('Koordinasi hingga tujuan','Coordinated to your destination')},
  ];
  const process = [
    [t('Sampaikan kebutuhan Anda','Share your requirements'),t('Informasikan jenis bahan, jumlah, dan lokasi pengiriman. Belum yakin memilih bahan? Konsultasikan dengan kami.','Tell us the material, quantity and delivery location. Unsure which material to choose? Talk to our team.')],
    [t('Pilih Bahan dan Cek Harga','Choose Materials & Check Pricing'),t('Kami membantu mencarikan bahan dan spesifikasi yang sesuai untuk kebutuhan usaha Anda.','We help find the materials and specifications that suit your business needs.')],
    [t('Dapatkan Penawaran','Receive a Quotation'),t('Dapatkan penawaran sesuai spesifikasi dan volume pembelian. Lebih banyak kebutuhan, lebih banyak peluang berhemat.','Receive a quotation based on your specifications and quantity, with better value for larger requirements.')],
  ];
  const capability = [
    {icon:Package,title:t('Penyimpanan Material Terorganisasi','Organised Material Storage'),text:t('Beragam bahan dalam bentuk roll untuk mendukung produksi Anda. Sampaikan kebutuhan, kami bantu cek ketersediaannya.','A range of roll materials for your production needs. Share your requirements and we will confirm availability.')},
    {icon:Factory,title:t('Harga Pabrik','Factory Pricing'),text:t('Penawaran yang kompetitif untuk kebutuhan usaha Anda. Konsultasikan spesifikasi dan volume untuk pilihan harga terbaik.','Competitive quotations for your business. Discuss your specifications and volume to find the best pricing option.')},
    {icon:Truck,title:t('Koordinasi Pengadaan & Pengiriman','Sourcing & Delivery Coordination'),text:t('Pesan sesuai kebutuhan, kami bantu siapkan. Mulai dari jumlah bahan hingga tujuan pengiriman di seluruh Indonesia.','We help coordinate your requirements, from material quantities to delivery destinations across Indonesia.')},
  ];
  return <div id="home">
    <HeroCarousel/>
    <section className="trust-strip" aria-label={t('Layanan pengadaan','Sourcing services')}><div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-5">{services.map(({icon:Icon,title,text})=><div className="trust-item" key={title}><Icon/><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></section>
    <section id="about" className="brand-section"><div className="container"><div className="grid md:grid-cols-[.85fr_1.15fr] gap-10 md:gap-16 items-center"><img className="brand-image" src="/images/brand-banner.webp" alt="BOSS BAHAN PVC" width="953" height="549" loading="lazy"/><div><div className="eyebrow text-[#927040]">{t('SIAPA BOSS BAHAN PVC?','MEET BOSS BAHAN PVC')}</div><h2 className="section-heading mt-4">{t('Cari bahan?','Looking for materials?')}<br/>{t('Kami siapkan.','We’ll source them.')}</h2><p className="about-lead">{t('Kebutuhan usaha beragam. Pemasoknya cukup satu.','Different business needs. One sourcing partner.')}</p><p className="mt-4 leading-7 text-[#717972]">{t('BOSS BAHAN PVC membantu memasok kebutuhan berbagai industri. Mulai dari kulit sintetis, mika, rigid, spunbond, dan terpal hingga bahan produksi lainnya. Kami membantu Anda menemukan bahan yang sesuai dengan penawaran yang kompetitif. Kepercayaan Anda selalu menjadi prioritas kami.','BOSS BAHAN PVC brings together materials for a range of industries, from synthetic leather, flexible and rigid sheets, spunbond and tarpaulins to other production materials. We help you find suitable options at competitive prices. Your trust is always our priority.')}</p></div></div><div className="process">{process.map(([title,desc],i)=><div key={title}><span>0{i+1} <ArrowRight size={13} className="inline ml-2"/></span><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>
    <section className="catalog-section home-products"><div className="container"><div className="section-topline"><div><div className="eyebrow text-[#927040]">{t('PILIHAN BAHAN','MATERIAL SELECTION')}</div><h2 className="section-heading mt-4">{t('Untuk usaha Anda,','For your business,')}<br/>{t('ada pilihan bahannya.','there’s a material for it.')}</h2></div><Link className="btn btn-outline" href="/store">{t('Lihat Seluruh Produk','Browse All Products')}<ArrowUpRight size={17}/></Link></div><div className="product-grid">{products.slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}</div></div></section>
    <section id="capabilities" className="capability"><div className="container grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"><CapabilityGallery lang={lang}/><div><div className="eyebrow text-[#927040]">{t('KAPABILITAS & PERGUDANGAN','CAPABILITIES & WAREHOUSING')}</div><h2 className="section-heading mt-4">{t('Bahan Siap. Harga Bersaing.','Materials Ready. Competitive Pricing.')}<br/>{t('Usaha Makin Lancar.','Keep Your Business Moving.')}</h2><p className="text-[#707972] leading-7 mt-5">{t('Kami siapkan bahan untuk kebutuhan usaha Anda, dengan pilihan lengkap, harga pabrik, dan pengadaan sesuai kebutuhan.','We source materials for your business with a broad selection, factory pricing and quantities matched to your requirements.')}</p><ul className="capability-list">{capability.map(({icon:Icon,title,text})=><li key={title}><Icon/><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul><Link className="mt-7 inline-flex items-center gap-3 text-sm font-bold" href="/contact">{t('Tanya Stok & Harga Pabrik','Ask About Availability & Factory Pricing')}<ArrowUpRight size={18}/></Link></div></div></section>
    <section className="quote-section home-contact"><div className="container"><ContactIntro compact/><Link className="btn btn-gold mt-7" href="/contact">{t('Minta Harga & Cek Stok','Ask for Pricing & Availability')}<ArrowUpRight size={18}/></Link></div></section>
  </div>;
}
