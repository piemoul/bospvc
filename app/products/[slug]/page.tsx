import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/lib/catalog';
import { getSiteConfig } from '@/lib/site-config';
import ProductDetail from '../../product-detail';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find(product => product.slug === slug);
  const { lang } = await getSiteConfig();
  if (!p) return {};
  return { title: `${p.name[lang]} | BOSS BAHAN PVC`, description: p.description[lang] };
}
export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const p = products.find(product => product.slug === slug);
  if (!p) notFound();
  const query = await searchParams;
  const selection = Object.fromEntries(['variant', 'color', 'unit'].map(key => [key, typeof query[key] === 'string' ? query[key] : ''])) as Record<string, string>;
  return <ProductDetail key={p.id + JSON.stringify(selection)} product={p} initialSelection={selection}/>;
}
