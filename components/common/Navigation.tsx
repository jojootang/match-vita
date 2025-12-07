'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Don't show navigation on auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null
  }

  if (loading) {
    return null
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">MatchVita</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/dashboard" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/dashboard' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                แดชบอร์ด
              </Link>
              <Link 
                href="/assessment" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/assessment' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                ประเมินสุขภาพ
              </Link>
              <Link 
                href="/vitamins" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/vitamins' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                วิตามิน
              </Link>
              <Link 
                href="/food" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/food' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                กินไรดี
              </Link>
              <Link 
                href="/plan" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/plan' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                แผนสุขภาพ
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600">👤</span>
                  </div>
                  <span>{user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link 
                  href="/signup" 
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}