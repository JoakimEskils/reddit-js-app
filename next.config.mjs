/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@chakra-ui/react']
  },
  images: {
    domains: ['i.redd.it', 'preview.redd.it'],
  },
};

export default nextConfig; 