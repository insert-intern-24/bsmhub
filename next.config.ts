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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.devtool = 'hidden-source-map';
    }
    return config;
  },
};

export default nextConfig;