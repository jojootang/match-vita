/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ข้าม TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ข้าม ESLint errors
  },
  images: {
    unoptimized: true, // ปิด image optimization
  },
};

module.exports = nextConfig;