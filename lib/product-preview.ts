import { productHref, type Product } from './catalog';

export type ProductPreview = { key: string; src: string; color?: string; photo?: number; thumb?: string };

export function productPreviews(product: Product): ProductPreview[] {
  const colors = product.previewMode === 'photos' ? [] : product.colors.filter(color => color !== 'Multiple colours' && product.colorImages[color]);
  const options: ProductPreview[] = colors.map((color, index) => ({ key: `color:${color}`, color, src: product.colorImages[color].src, thumb: `/images/product-previews/${product.id}-color-${index}.webp` }));
  if (colors.length <= 1 && product.images.length > 1) {
    product.images.forEach((src, photo) => {
      if (options.some(option => option.src === src)) return;
      options.push({ key: `photo:${photo}`, photo, src, thumb: `/images/product-previews/${product.id}-${photo}.webp` });
    });
  }
  return options;
}

export function additionalPhotoPreviews(product: Product): ProductPreview[] {
  const pictured = new Set(productPreviews(product).filter(option => option.color).map(option => option.src));
  return product.images.flatMap((src, photo) => {
    if (pictured.has(src)) return [];
    pictured.add(src);
    return [{ key: `photo:${photo}`, photo, src, thumb: `/images/product-previews/${product.id}-${photo}.webp` }];
  });
}

export function previewHref(product: Product, preview?: ProductPreview) {
  if (!preview) return productHref(product);
  const params = new URLSearchParams();
  if (preview.color) params.set('color', preview.color);
  if (preview.photo !== undefined) params.set('photo', String(preview.photo));
  return `${productHref(product)}?${params}`;
}

export function validPhotoIndex(product: Product, value?: string): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const index = Number(value);
  return Number.isSafeInteger(index) && index < product.images.length ? index : null;
}
