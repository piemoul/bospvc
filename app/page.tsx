import type { Viewport } from 'next';
import Storefront from './storefront';
import PageInteractions from './page-interactions';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Page() {
  return <><PageInteractions/><Storefront/></>;
}
