import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'bsmhubsp.obtuse.kr',
      'bsmhubsp.insert.team',
    ],
  },
  output: 'standalone',
  productionBrowserSourceMaps: true,
};

export default nextConfig;
