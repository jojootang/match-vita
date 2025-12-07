import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const userProfile = await request.json()
    
    console.log('Creating profile via API:', userProfile)

    // ใช้ service role key (bypass RLS)
    const { data, error } = await supabaseServer
      .from('users')
      .insert([userProfile])
      .select()
      .single()

    if (error) {
      console.error('API Profile creation error:', error)
      
      // ถ้า user มีอยู่แล้ว (จาก auth) ให้ update แทน
      if (error.code === '23505') { // duplicate key
        const { data: updated, error: updateError } = await supabaseServer
          .from('users')
          .update(userProfile)
          .eq('id', userProfile.id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json({ 
            success: false, 
            error: updateError.message 
          }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Profile updated',
          data: updated 
        })
      }

      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile created',
      data 
    })
    
  } catch (error: any) {
    console.error('API Exception:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}