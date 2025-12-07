/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript: ignore errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ลบ eslint config ออก (Next.js 16 ไม่รองรับใน config)
  // ให้ใช้ไฟล์ .eslintrc.json แทน
  
  // Images config
  images: {
    unoptimized: true,
  },
  
  // เพิ่มถ้าต้องการ disable Turbopack
  // (แต่อยู่ใน experimental ซึ่ง Next.js 16 อาจไม่รองรับ)
};

module.exports = nextConfig;