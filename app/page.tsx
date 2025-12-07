import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mr-3"></div>
              <span className="text-xl font-bold text-green-700">MatchVita</span>
            </div>
            <div className="space-x-4">
              <Link href="/assessment" className="text-gray-600 hover:text-green-600">แบบประเมิน</Link>
              <Link href="/vitamins" className="text-gray-600 hover:text-green-600">วิตามิน</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-green-600">แดชบอร์ด</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            จับคู่วิตามินและเมนูอาหาร
            <span className="text-green-600">ที่เหมาะกับคุณ</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            วิเคราะห์สุขภาพ 6 ด้าน ให้คำแนะนำวิตามินและเมนูอาหารเฉพาะบุคคล
            เพื่อสุขภาพที่ดีขึ้นทุกวัน
          </p>
          
          <div className="space-x-6 mb-16">
            <Link 
              href="/assessment" 
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-green-700 transition shadow-lg"
            >
              เริ่มประเมินสุขภาพฟรี
            </Link>
            <Link 
              href="/vitamins" 
              className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition shadow-lg border border-green-200"
            >
              ดูวิตามินแนะนำ
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-green-500 text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">วิเคราะห์สุขภาพ 6 ด้าน</h3>
              <p className="text-gray-600">พลังงาน, การนอน, ข้อต่อ, สมอง, ผิวพรรณ, ภูมิคุ้มกัน</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-green-500 text-4xl mb-4">💊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">วิตามินเฉพาะบุคคล</h3>
              <p className="text-gray-600">แนะนำวิตามินที่เหมาะกับสุขภาพของคุณ</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-green-500 text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">เมนูอาหารแนะนำ</h3>
              <p className="text-gray-600">เมนูไทยที่ช่วยเสริมสุขภาพของคุณ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">MatchVita © 2024 - แอปดูแลสุขภาพสำหรับคนไทย</p>
        </div>
      </footer>
    </div>
  );
}
