import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature") || ""
    
    console.log("🔔 Webhook received")
    
    if (!webhookSecret) {
      console.warn("⚠️ STRIPE_WEBHOOK_SECRET not configured")
      return NextResponse.json(
        { error: "Webhook not configured", configured: false },
        { status: 500 }
      )
    }
    
    let event
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message)
      return NextResponse.json(
        { error: "Invalid signature", message: err.message },
        { status: 400 }
      )
    }
    
    // Handle the event
    console.log(`✅ Webhook verified: ${event.type}`)
    
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as any
        console.log(`💰 Payment successful: ${session.id}`)
        // TODO: Update your database, send email, etc.
        break
        
      case "payment_intent.succeeded":
        console.log("💳 Payment intent succeeded")
        break
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({
      received: true,
      type: event.type,
      livemode: event.livemode,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error("❌ Webhook processing error:", error.message)
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    )
  }
}