// lib/services/affiliate.service.ts
export class AffiliateService {
  private supabase = createClient();
  
  async trackClick(params: {
    userId?: string;
    vitaminId: string;
    platform: 'shopee' | 'lazada' | 'iherb';
    linkType: 'direct' | 'promo';
  }) {
    // บันทึกการคลิก
    await this.supabase.from('affiliate_clicks').insert({
      user_id: params.userId,
      vitamin_id: params.vitaminId,
      platform: params.platform,
      link_type: params.linkType,
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent
    });
    
    // Update click count
    await this.supabase.rpc('increment_vitamin_clicks', {
      vitamin_id: params.vitaminId
    });
  }
  
  async generateAffiliateLink(vitaminId: string, platform: string) {
    // Generate tracking link
    const trackingId = uuidv4();
    const baseUrl = this.getPlatformUrl(platform);
    
    return `${baseUrl}?ref=matchvita_${trackingId}&utm_source=matchvita&utm_medium=affiliate`;
  }
  
  async getDashboardStats(userId: string) {
    // ดึงสถิติสำหรับ affiliate dashboard
    const { data } = await this.supabase
      .from('affiliate_clicks')
      .select(`
        *,
        vitamins (name, category)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return this.calculateMetrics(data);
  }
}