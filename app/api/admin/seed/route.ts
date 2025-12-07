import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบว่าเป็น admin (ใน production ต้องมี authentication)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // เรียกใช้ seeding script
    // ใน production ควรแยกไฟล์ออกไป
    await seedDatabase()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully' 
    })
    
  } catch (error: any) {
    console.error('Error in seeding API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

async function seedDatabase() {
  // ใส่โค้ด seeding จากด้านบน
  console.log('Seeding database...')
  // ... seeding logic
}