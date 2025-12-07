# ไฟล์ปัจจุบันใช้ config แบบเก่า ต้องเปลี่ยนเป็น export ตัวแปรแยก
$fixedCode = @'
import { NextRequest, NextResponse } from "next/server"

// สำหรับ Next.js 16 ใช้แบบนี้แทน export const config
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  console.log("✅ Webhook received at:", new Date().toISOString())
  
  // Log environment status for debugging
  const envStatus = {
    hasStripeSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production"
  }
  
  console.log("Environment check:", envStatus)
  
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    endpoint: "/api/webhooks/stripe",
    environment: process.env.NODE_ENV || "development",
    stripe_configured: !!process.env.STRIPE_WEBHOOK_SECRET,
    message: "Webhook endpoint is ready!",
    buildId: process.env.VERCEL_GIT_COMMIT_SHA || "local"
  })
}

// วิธีใหม่สำหรับ Next.js 16: ไม่ใช้ export const config อีกต่อไป
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }
'@

# เขียนไฟล์ใหม่
[System.IO.File]::WriteAllText(
    "$PWD\app\api\webhooks\stripe\route.ts",
    $fixedCode,
    [System.Text.UTF8Encoding]::new($false)
)

# ตรวจสอบไฟล์
Get-Content app\api\webhooks\stripe\route.ts