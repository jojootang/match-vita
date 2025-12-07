'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  age: number | null
  gender: string | null
  goals: string[] | null
  subscription_level: string
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
    fetchProfile()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (!user) {
      router.push('/login')
    }
  }

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }
    
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.get('fullName'),
          age: formData.get('age') ? parseInt(formData.get('age') as string) : null,
          gender: formData.get('gender'),
          goals: formData.get('goals') ? [(formData.get('goals') as string)] : []
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage('บันทึกข้อมูลสำเร็จ!')
      fetchProfile() // Refresh profile data
      
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setMessage(`เกิดข้อผิดพลาด: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">โปรไฟล์ของฉัน</h1>
                <p className="text-green-100 mt-2">จัดการข้อมูลส่วนตัวและตั้งค่าบัญชี</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            {/* Left Column - Profile Info */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile?.full_name || 'ผู้ใช้ MatchVita'}
                  </h2>
                  <p className="text-gray-600 mt-1">{profile?.email}</p>
                  
                  <div className="mt-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {profile?.subscription_level === 'free' ? 'บัญชีฟรี' : 'บัญชีพรีเมียม'}
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">สมาชิกตั้งแต่</h3>
                    <p className="text-gray-900">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('th-TH') : '-'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">เป้าหมายสุขภาพ</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile?.goals?.map((goal, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {goal}
                        </span>
                      )) || <p className="text-gray-500">ยังไม่ได้ตั้งค่า</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Edit Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {message && (
                  <div className={`p-4 rounded-lg ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลส่วนตัว</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        defaultValue={profile?.full_name || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="สมชาย ใจดี"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        อีเมล
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        อายุ
                      </label>
                      <input
                        type="number"
                        name="age"
                        defaultValue={profile?.age || ''}
                        min="1"
                        max="120"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="25"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        เพศ
                      </label>
                      <select
                        name="gender"
                        defaultValue={profile?.gender || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">เลือกเพศ</option>
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เป้าหมายสุขภาพหลัก
                    </label>
                    <select
                      name="goals"
                      defaultValue={profile?.goals?.[0] || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">เลือกเป้าหมาย</option>
                      <option value="เพิ่มพลังงาน">เพิ่มพลังงาน</option>
                      <option value="บำรุงสมองและความจำ">บำรุงสมองและความจำ</option>
                      <option value="สุขภาพผิวดีขึ้น">สุขภาพผิวดีขึ้น</option>
                      <option value="นอนหลับดีขึ้น">นอนหลับดีขึ้น</option>
                      <option value="สุขภาพข้อและกระดูก">สุขภาพข้อและกระดูก</option>
                      <option value="เสริมภูมิคุ้มกัน">เสริมภูมิคุ้มกัน</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าบัญชี</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        เปลี่ยนรหัสผ่าน
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="รหัสผ่านใหม่"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        กำลังบันทึก...
                      </span>
                    ) : (
                      'บันทึกการเปลี่ยนแปลง'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}