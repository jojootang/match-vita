// lib/services/subscription.service.ts
export class SubscriptionService {
  private stripe: Stripe;
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  
  async createCheckoutSession(userId: string, plan: 'monthly' | 'yearly') {
    const priceId = plan === 'monthly' 
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;
    
    const session = await this.stripe.checkout.sessions.create({
      customer_email: await this.getUserEmail(userId),
      payment_method_types: ['card', 'promptpay'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,
      metadata: {
        userId,
        plan
      }
    });
    
    return session;
  }
  
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleSubscriptionCreated(event.data.object);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancelled(event.data.object);
        break;
    }
  }
  
  async getPremiumFeatures(userId: string) {
    const subscription = await this.getUserSubscription(userId);
    
    return {
      hasPremium: subscription?.status === 'active',
      features: {
        unlimitedAssessments: true,
        detailedHealthPlans: true,
        dailyMenus: true,
        advancedAnalytics: true,
        prioritySupport: true,
        adFree: true
      }
    };
  }
}