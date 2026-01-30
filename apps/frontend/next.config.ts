import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ensure build fails on type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ensure build fails on lint errors
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
