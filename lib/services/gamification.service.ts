// lib/services/gamification.service.ts
export class GamificationService {
  private badges = {
    'assessment_complete': { name: 'นักวิเคราะห์สุขภาพ', points: 50 },
    'vitamin_streak_7': { name: 'สายสุขภาพตัวจริง', points: 100 },
    'daily_login_30': { name: 'แฟนพันธุ์แท้', points: 200 },
    'premium_upgrade': { name: 'วีไอพี', points: 150 },
    'referral_5': { name: 'ผู้มีน้ำใจ', points: 175 }
  };
  
  async awardBadge(userId: string, badgeType: string) {
    await this.supabase.from('user_badges').insert({
      user_id: userId,
      badge_type: badgeType,
      awarded_at: new Date()
    });
    
    // Update user points
    await this.supabase.rpc('increment_user_points', {
      user_id: userId,
      points: this.badges[badgeType].points
    });
    
    // Send notification
    await NotificationService.sendPushNotification(userId, {
      title: 'ได้รับเหรียญรางวัล!',
      body: `คุณได้รับเหรียญ "${this.badges[badgeType].name}"`
    });
  }
  
  async getLeaderboard() {
    const { data } = await this.supabase
      .from('users')
      .select('id, name, points, badges_count')
      .order('points', { ascending: false })
      .limit(20);
    
    return data;
  }
}