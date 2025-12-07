import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log("🔔 Webhook received - MatchVita")
  return NextResponse.json({ ok: true, service: "MatchVita" })
}

export const config = {
  api: {
    bodyParser: false,
  },
}