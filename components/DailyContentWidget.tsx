// components/DailyContentWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Flame, 
  CheckCircle, 
  ChevronRight,
  X,
  Award,
  Clock,
  Bell,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { DailyContentService } from '@/lib/services/daily-content.service';

interface DailyContentWidgetProps {
  position?: 'top-right' | 'bottom-right' | 'floating';
  collapsed?: boolean;
}

export default function DailyContentWidget({ 
  position = 'top-right',
  collapsed = false 
}: DailyContentWidgetProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(!collapsed);
  const [dailyContent, setDailyContent] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (user) {
      loadDailyContent();
      loadUserStreak();
    }
  }, [user]);

  const loadDailyContent = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const content = await DailyContentService.getDailyWidgetContent(user.id);
      setDailyContent(content);
    } catch (error) {
      console.error('Error loading daily content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStreak = async () => {
    // โหลด streak จาก localStorage หรือ API
    const savedStreak = localStorage.getItem('user_streak');
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak));
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    if (!user) return;
    
    await DailyContentService.logEngagement(user.id, 'widget_challenge_completed', { challengeId });
    
    // Update streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('user_streak', JSON.stringify(newStreak));
    
    // Show success message
    alert('ยินดีด้วย! คุณได้รับ 5 คะแนน 🎉');
    
    // Reload content
    loadDailyContent();
  };

  const getDayOfWeek = () => {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return days[new Date().getDay()];
  };

  const getDateString = () => {
    const today = new Date();
    return `${today.getDate()} ${getDayOfWeek()}`;
  };

  // ถ้าไม่ได้ล็อกอิน หรือผู้ใช้ปิด widget
  if (!user || isHidden) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'floating': 'bottom-20 right-4'
  };

  // Quick Challenge Component
  const QuickChallenge = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-800 flex items-center">
          <Target className="h-4 w-4 mr-2 text-green-500" />
          ภารกิจเร็วๆ นี้
        </h4>
        <span className="text-xs text-gray-500">+5 คะแนน</span>
      </div>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-gray-700 mb-2">
          {dailyContent?.challenge?.title || 'ดื่มน้ำ 8 แก้ววันนี้'}
        </p>
        <button
          onClick={() => handleCompleteChallenge('daily_challenge')}
          className="w-full py-2 bg-green-500 text-white text-sm rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          เสร็จสิ้นภารกิจ
        </button>
      </div>
    </div>
  );

  // Streak Counter
  const StreakCounter = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Flame className="h-5 w-5 text-orange-500 mr-2" />
          <span className="font-bold text-gray-800">{streak} วัน</span>
        </div>
        <span className="text-xs text-gray-500">🔥 สตีคปัจจุบัน</span>
      </div>
      <div className="mt-2 flex gap-1">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i}
            className={`h-2 flex-1 rounded-full ${i < streak ? 'bg-orange-500' : 'bg-gray-200'}`}
          ></div>
        ))}
      </div>
    </div>
  );

  // Daily Tip
  const DailyTip = () => (
    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
      <div className="flex items-center mb-1">
        <Award className="h-4 w-4 text-blue-500 mr-2" />
        <span className="text-sm font-medium text-gray-800">เคล็ดลับวันนี้</span>
      </div>
      <p className="text-xs text-gray-600">
        {dailyContent?.tip || 'นอนให้ได้ 7-8 ชั่วโมง ช่วยให้สมองทำงานดีขึ้น'}
      </p>
    </div>
  );

  // Next Vitamin Reminder
  const NextVitaminReminder = () => {
    const nextVitamin = dailyContent?.nextVitamin || {
      name: 'วิตามินซี',
      time: '13:00',
      status: 'รอทาน'
    };

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-800 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-purple-500" />
            วิตามินต่อไป
          </h4>
          <span className="text-xs text-purple-600">{nextVitamin.time}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">VC</span>
            </div>
            <div>
              <div className="font-medium text-sm">{nextVitamin.name}</div>
              <div className="text-xs text-gray-500">{nextVitamin.status}</div>
            </div>
          </div>
          <button className="px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600">
            แจ้งเตือน
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button (เมื่อ Collapsed) */}
      {collapsed && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClasses[position]} z-50 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center`}
          style={{ animation: 'pulse 2s infinite' }}
        >
          <Calendar className="h-5 w-5" />
          {streak > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {streak}
            </div>
          )}
        </button>
      )}

      {/* Main Widget */}
      {isOpen && (
        <div className={`fixed ${positionClasses[position]} z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <h3 className="font-bold">📅 ของวันนี้</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{getDateString()}</div>
                <div className="text-sm opacity-90">อยู่ต่อเนื่อง {streak} วันแล้ว!</div>
              </div>
              <button 
                onClick={() => setIsHidden(true)}
                className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
              >
                ซ่อน 24 ชม.
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">กำลังโหลด...</p>
              </div>
            ) : (
              <>
                <StreakCounter />
                <QuickChallenge />
                <DailyTip />
                <NextVitaminReminder />

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">ความคืบหน้าวันนี้</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-500">น.น้ำ</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">5k</div>
                    <div className="text-xs text-gray-500">ก้าว</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">2</div>
                    <div className="text-xs text-gray-500">วิตามิน</div>
                  </div>
                </div>

                {/* Daily Quote */}
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 mb-4">
                  <p className="text-sm text-gray-700 italic text-center">
                    "สุขภาพดีเริ่มต้นที่การดูแลตัวเองวันนี้"
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Link 
                    href="/assessment" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200">
                        <Target className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm">อัปเดตสุขภาพ</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                  
                  <Link 
                    href="/vitamins" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200">
                        <Bell className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm">จัดการวิตามิน</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3">
            <Link 
              href="/dashboard" 
              className="block text-center py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              ดูแดชบอร์ดเต็ม
            </Link>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fixed {
          animation: ${isOpen ? 'slideIn 0.3s ease-out' : 'fadeIn 0.3s ease-out'};
        }
      `}</style>
    </>
  );
}