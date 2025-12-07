export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-2xl">💊</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MatchVita</h1>
            <p className="text-gray-600 mt-2">สุขภาพที่ดีเริ่มต้นที่นี่</p>
          </div>
          {children}
        </div>
        
        {/* Footer links */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2024 MatchVita. All rights reserved.</p>
          <p className="mt-2">
            <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>
            {' • '}
            <a href="/terms" className="text-green-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  )
}