import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log("✅ Production Webhook - MatchVita")
  
  return NextResponse.json({
    success: true,
    service: "MatchVita",
    endpoint: "/api/webhooks/stripe",
    environment: "production",
    timestamp: new Date().toISOString(),
    message: "Stripe webhook endpoint is ready"
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
