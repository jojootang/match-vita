// lib/services/daily-content.service.ts - เพิ่มฟังก์ชันสำหรับ widget
export class DailyContentService {
  // ... existing code ...

  async getDailyWidgetContent(userId: string) {
    // ดึงข้อมูลย่อสำหรับ widget
    const [challenge, tip, nextVitamin] = await Promise.all([
      this.getTodaysChallenge(userId),
      this.getDailyHealthTip(),
      this.getNextVitaminReminder(userId)
    ]);

    return {
      challenge,
      tip,
      nextVitamin,
      timestamp: new Date().toISOString()
    };
  }

  private async getTodaysChallenge(userId: string) {
    // ดึง challenge ประจำวันจาก database
    const { data } = await this.supabase
      .from('daily_challenges')
      .select('*')
      .eq('date', getFormattedDate())
      .single();

    // ถ้าไม่มี challenge สำหรับวันนี้ สร้างใหม่
    if (!data) {
      const challenges = [
        { id: 'water', title: 'ดื่มน้ำ 8 แก้ววันนี้', points: 5 },
        { id: 'steps', title: 'เดินให้ได้ 5,000 ก้าว', points: 10 },
        { id: 'fruit', title: 'กินผลไม้ 1 จาน', points: 5 },
        { id: 'meditate', title: 'นั่งสมาธิ 5 นาที', points: 7 },
        { id: 'stretch', title: 'ยืดเส้นยืดสาย 10 นาที', points: 5 }
      ];
      
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      
      // บันทึก challenge ใหม่
      await this.supabase
        .from('daily_challenges')
        .insert({
          user_id: userId,
          challenge_id: randomChallenge.id,
          title: randomChallenge.title,
          points: randomChallenge.points,
          date: getFormattedDate(),
          completed: false
        });
      
      return randomChallenge;
    }

    return data;
  }

  private async getDailyHealthTip() {
    const tips = [
      'ดื่มน้ำอุ่น 1 แก้วตอนเช้าช่วยกระตุ้นระบบย่อยอาหาร',
      'นอนให้ได้ 7-8 ชั่วโมง ช่วยให้สมองทำงานดีขึ้น',
      'กินอาหารเช้าภายใน 1 ชั่วโมงหลังตื่นนอน',
      'พักสายตาจากหน้าจอทุกๆ 20 นาที',
      'เดินหลังอาหารช่วยลดน้ำตาลในเลือด',
      'หายใจลึกๆ ช่วยลดความเครียด',
      'กินผลไม้สดแทนขนมหวาน',
      'ยืดเส้นยืดสายทุกๆ 1 ชั่วโมง'
    ];
    
    const today = new Date().getDate();
    return tips[today % tips.length];
  }

  private async getNextVitaminReminder(userId: string) {
    // ดึงวิตามินที่ต้องทานต่อไป
    const { data } = await this.supabase
      .from('user_vitamins')
      .select(`
        *,
        vitamins (name, best_time)
      `)
      .eq('user_id', userId)
      .eq('active', true)
      .order('next_dose_time', { ascending: true })
      .limit(1);

    if (data && data.length > 0) {
      const vitamin = data[0];
      return {
        id: vitamin.id,
        name: vitamin.vitamins?.name || 'วิตามิน',
        time: this.formatNextDoseTime(vitamin.next_dose_time),
        status: 'รอทาน'
      };
    }

    // Fallback default
    return {
      name: 'วิตามินซี',
      time: '13:00',
      status: 'รอทาน'
    };
  }

  private formatNextDoseTime(time: string) {
    const now = new Date();
    const doseTime = new Date(time);
    
    if (doseTime > now) {
      const hours = doseTime.getHours().toString().padStart(2, '0');
      const minutes = doseTime.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    return 'เลยเวลาแล้ว';
  }

  async logEngagement(userId: string, action: string, data: any) {
    await this.supabase.from('user_engagement').insert({
      user_id: userId,
      action,
      data,
      timestamp: new Date()
    });

    // Update streak
    await this.updateUserStreak(userId);
  }

  private async updateUserStreak(userId: string) {
    const today = getFormattedDate();
    const yesterday = getFormattedDate(new Date(Date.now() - 86400000));
    
    // ตรวจสอบว่าเคยทำ engagement วันนี้หรือยัง
    const { data: todayEngagement } = await this.supabase
      .from('user_engagement')
      .select('id')
      .eq('user_id', userId)
      .gte('timestamp', `${today}T00:00:00`)
      .lt('timestamp', `${today}T23:59:59`)
      .limit(1);

    if (todayEngagement && todayEngagement.length === 0) {
      // เพิ่ม streak
      await this.supabase.rpc('increment_user_streak', {
        user_id: userId,
        date: today
      });
    }
  }
}