/** @type {import('next').NextConfig} */
const nextConfig = {
  // ปิด Turbopack (แก้ปัญหา build ค้าง)
  experimental: {
    turbo: false,
  },
  
  // ลดขนาด bundle (optional)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // ตั้งค่า images ถ้ามี
  images: {
    domains: ['wndqahlimmhsptsucmia.supabase.co'],
    unoptimized: true, // ถ้าใช้ static export
  },
  
  // สำหรับ static export (ถ้าไม่ใช้ server features)
  // output: 'export',
  
  // เพิ่ม security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;