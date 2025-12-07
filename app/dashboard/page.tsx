// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Utensils, 
  Pill, 
  Target, 
  Award,
  Bell,
  Share2,
  CheckCircle,
  Heart,
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { DailyContentService } from '@/lib/services/daily-content.service';
import { GamificationService } from '@/lib/services/gamification.service';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dailyContent, setDailyContent] = useState<any>(null);
  const [engagementScore, setEngagementScore] = useState(0);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [healthScores, setHealthScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // โหลด daily content
      const content = await DailyContentService.getDailyContent(user.id);
      setDailyContent(content);
      
      // โหลด engagement data
      const engagement = await GamificationService.getUserEngagement(user.id);
      setEngagementScore(engagement.score || 0);
      setUserBadges(engagement.badges || []);
      
      // โหลด health scores
      const savedAnswers = localStorage.getItem('assessment_answers');
      if (savedAnswers) {
        const answers = JSON.parse(savedAnswers);
        setHealthScores(answers);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    if (!user) return;
    
    await DailyContentService.logEngagement(user.id, 'challenge_completed', { challengeId });
    
    // Update engagement score
    const newScore = engagementScore + 10;
    setEngagementScore(newScore);
    
    // Award badge if threshold reached
    if (newScore >= 100) {
      await GamificationService.awardBadge(user.id, 'daily_engagement');
      setUserBadges(prev => [...prev, { type: 'daily_engagement', name: 'นักมีส่วนร่วม' }]);
    }
    
    // Reload data
    loadDashboardData();
  };

  const logEngagement = async (action: string) => {
    if (!user) return;
    await DailyContentService.logEngagement(user.id, action, {});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดแดชบอร์ด...</p>
        </div>
      </div>
    );
  }

  // Health Overview Card
  const HealthOverviewCard = ({ scores }: { scores: any }) => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">ภาพรวมสุขภาพ</h2>
        <Link href="/assessment" className="text-blue-100 hover:text-white text-sm">
          อัปเดตผลประเมิน →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <div className="text-sm opacity-90">คะแนนสุขภาพ</div>
          <div className="text-2xl font-bold">78/100</div>
        </div>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <div className="text-sm opacity-90">วันที่ติดตาม</div>
          <div className="text-2xl font-bold">24 วัน</div>
        </div>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <div className="text-sm opacity-90">ความคืบหน้า</div>
          <div className="text-2xl font-bold">+12%</div>
        </div>
      </div>
    </div>
  );

  // Daily Menu Card
  const DailyMenuCard = ({ menu, onLike, onAddToPlan }: any) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Utensils className="h-6 w-6 text-green-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">เมนูแนะนำวันนี้</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onLike}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <Heart className="h-5 w-5" />
          </button>
          <button 
            onClick={onAddToPlan}
            className="p-2 text-gray-400 hover:text-green-500"
          >
            <Calendar className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {menu ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">มื้อเช้า</div>
              <div className="font-medium">ข้าวต้มปลา + น้ำส้มคั้น</div>
              <div className="text-xs text-gray-400 mt-1">พลังงาน 350 kcal</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">มื้อกลางวัน</div>
              <div className="font-medium">สลัดอกไก่ + ข้าวกล้อง</div>
              <div className="text-xs text-gray-400 mt-1">พลังงาน 450 kcal</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">มื้อเย็น</div>
              <div className="font-medium">แกงจืดเต้าหู้ + ปลานึ่ง</div>
              <div className="text-xs text-gray-400 mt-1">พลังงาน 400 kcal</div>
            </div>
          </div>
          <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            ดูแผนอาหารรายสัปดาห์
          </button>
        </div>
      ) : (
        <p className="text-gray-500">ยังไม่มีเมนูแนะนำ</p>
      )}
    </div>
  );

  // Health Tip Card
  const HealthTipCard = ({ tip, onShare }: any) => (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target className="h-6 w-6 text-green-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">เคล็ดลับสุขภาพวันนี้</h3>
        </div>
        <button 
          onClick={onShare}
          className="p-2 text-gray-400 hover:text-green-600"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
      <p className="text-gray-700 mb-4">
        {tip || "ดื่มน้ำให้ได้ 8 แก้วต่อวัน ช่วยให้ระบบเผาผลาญทำงานดีขึ้นและผิวพรรณชุ่มชื้น"}
      </p>
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1" />
        <span>อ่านประมาณ 2 นาที</span>
      </div>
    </div>
  );

  // Vitamin Reminder Card
  const VitaminReminderCard = ({ reminders, onMarkTaken }: any) => (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center mb-4">
        <Pill className="h-6 w-6 text-blue-500 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">การแจ้งเตือนวิตามิน</h3>
      </div>
      
      <div className="space-y-3">
        {reminders?.slice(0, 3).map((reminder: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <div className="font-medium">{reminder.name || "วิตามินซี"}</div>
                <div className="text-sm text-gray-500">{reminder.time || "หลังอาหารเช้า"}</div>
              </div>
            </div>
            <button
              onClick={() => onMarkTaken(reminder.id || index)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              ทานแล้ว
            </button>
          </div>
        ))}
      </div>
      
      <Link href="/vitamins" className="block mt-4 text-center text-blue-600 hover:text-blue-800 font-medium">
        ดูวิตามินทั้งหมด →
      </Link>
    </div>
  );

  // Daily Challenge Card
  const DailyChallengeCard = ({ challenge, onComplete }: any) => (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center mb-4">
        <Award className="h-6 w-6 text-purple-500 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">ภารกิจประจำวัน</h3>
      </div>
      
      <div className="bg-white/50 p-4 rounded-xl mb-4">
        <h4 className="font-bold text-gray-800 mb-2">
          {challenge?.title || "เดินให้ได้ 10,000 ก้าว"}
        </h4>
        <p className="text-gray-600 text-sm mb-3">
          {challenge?.description || "การเดินช่วยเพิ่มการไหลเวียนเลือดและเผาผลาญพลังงาน"}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <span className="ml-2">60%</span>
        </div>
      </div>
      
      <button
        onClick={() => onComplete(challenge?.id || 'daily_challenge')}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
      >
        เสร็จสิ้นภารกิจ (+10 คะแนน)
      </button>
    </div>
  );

  // Progress Card
  const ProgressCard = ({ progress }: any) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">ความคืบหน้าสุขภาพ</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>ระดับพลังงาน</span>
            <span>+15%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>คุณภาพการนอน</span>
            <span>+20%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>การออกกำลังกาย</span>
            <span>+8%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Engagement Score Card
  const EngagementScoreCard = ({ score, badges }: any) => (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">คะแนนมีส่วนร่วม</h3>
          <p className="text-gray-600">สะสมคะแนนเพื่อรับรางวัล</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{score}</div>
          <div className="text-sm text-gray-500">คะแนน</div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">เหรียญรางวัลของคุณ</h4>
        <div className="flex gap-2">
          {badges.length > 0 ? (
            badges.slice(0, 5).map((badge: any, index: number) => (
              <div key={index} className="p-2 bg-white rounded-lg border">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
            ))
          ) : (
            <p className="text-gray-500">ยังไม่มีเหรียญรางวัล</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button className="py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
          แลกรางวัล
        </button>
        <Link href="/leaderboard" className="py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center">
          ดูอันดับ
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">แดชบอร์ดสุขภาพ</h1>
            <p className="text-gray-600">ยินดีต้อนรับกลับ, {user?.name || 'ผู้ใช้'}</p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <Link href="/profile" className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </Link>
          </div>
        </div>

        {/* Health Overview */}
        <HealthOverviewCard scores={healthScores} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Daily Content */}
          <div className="lg:col-span-2">
            {/* Today's Menu */}
            <DailyMenuCard 
              menu={dailyContent?.dailyMenu}
              onLike={() => logEngagement('menu_liked')}
              onAddToPlan={() => logEngagement('menu_saved')}
            />
            
            {/* Health Tip */}
            <HealthTipCard 
              tip={dailyContent?.healthTip}
              onShare={() => logEngagement('tip_shared')}
            />
            
            {/* Daily Challenge */}
            <DailyChallengeCard 
              challenge={dailyContent?.challenge}
              onComplete={handleCompleteChallenge}
            />
            
            {/* Progress Update */}
            <ProgressCard 
              progress={dailyContent?.progress}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Vitamin Reminders */}
            <VitaminReminderCard 
              reminders={dailyContent?.vitaminReminder}
              onMarkTaken={(vitaminId: string) => {
                logEngagement('vitamin_taken');
                handleCompleteChallenge('daily_vitamin');
              }}
            />
            
            {/* Engagement Score & Badges */}
            <EngagementScoreCard 
              score={engagementScore}
              badges={userBadges}
            />
            
            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">การดำเนินการเร็วๆ นี้</h3>
              <div className="space-y-3">
                <Link href="/assessment" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>อัปเดตผลประเมินสุขภาพ</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link href="/vitamins" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Pill className="h-5 w-5 text-blue-500 mr-3" />
                    <span>ดูวิตามินแนะนำ</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link href="/plan" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-500 mr-3" />
                    <span>สร้างแผนรายสัปดาห์</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}