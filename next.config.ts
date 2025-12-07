import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: false, // ปิด Turbopack
  },
};

export default nextConfig;