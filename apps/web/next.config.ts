import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '*.githubusercontent.com' },
      { protocol: 'https', hostname: 'userpic.codeforces.org' },
    ],
  },
  experimental: {
    // Enable PPR for streaming dashboard routes
    ppr: false,
  },
  // Transpile local workspace packages
  transpilePackages: ['@bamblu/types', '@bamblu/utils', '@bamblu/validations'],
};

export default nextConfig;
