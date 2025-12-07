# สร้างไฟล์ในโฟลเดอร์ที่สร้างแล้ว
Set-Content -Path app\api\webhooks\stripe\route.ts -Value @'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log("🔔 Webhook received")
    
    // สำหรับตอนนี้แค่ return success
    return NextResponse.json({ 
      received: true,
      message: "Webhook endpoint is working"
    })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}

// Important for webhooks: disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}
'@