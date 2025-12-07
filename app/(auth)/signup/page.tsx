'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

// Simple SignUp component for MVP
export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Basic validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }
    
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }
    
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    setLoading(true)

    try {
      // Sign up with Supabase Auth (simple version)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (signUpError) {
        throw signUpError
      }

      // Success
      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error: any) {
      console.error('Sign up error:', error)
      setError(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">สมัครสมาชิกสำเร็จ!</h2>
        <p className="text-gray-600 mb-4">คุณสามารถเข้าสู่ระบบได้ทันที</p>
        <p className="text-gray-500 text-sm">กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">สร้างบัญชีใหม่</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ-นามสกุล *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="สมชาย ใจดี"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รหัสผ่าน *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="อย่างน้อย 6 ตัวอักษร"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ยืนยันรหัสผ่าน *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          มีบัญชีอยู่แล้ว?{' '}
          <Link 
            href="/login" 
            className="text-green-600 font-semibold hover:text-green-700 hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  )
}