import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: { formats: ['image/webp'] },
};
export default config;
