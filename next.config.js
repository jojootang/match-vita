/** @type {import('next').NextConfig} */
const nextConfig = {
  // ข้าม TypeScript errors ชั่วคราว
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ข้าม ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ปิด image optimization เพื่อลดความซับซ้อน
  images: {
    unoptimized: true,
  },
  
  // ปิดบางฟีเจอร์ที่ไม่จำเป็นสำหรับ build ครั้งแรก
  experimental: {
    // ปิดอะไรที่อาจทำให้ build ค้าง
  },
};

module.exports = nextConfig;