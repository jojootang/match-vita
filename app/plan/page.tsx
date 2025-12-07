// app/plan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  Trash2,
  Sun,
  Cloud,
  Moon,
  TrendingUp,
  Bell,
  Settings,
  Download,
  Share2
} from 'lucide-react';
import Link from 'next/link';

export default function PlanPage() {
  const [planItems, setPlanItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load plan items from localStorage
    const loadPlanItems = () => {
      const savedItems = localStorage.getItem('plan_items');
      if (savedItems) {
        setPlanItems(JSON.parse(savedItems));
      } else {
        // Mock data for demonstration
        const mockItems = [
          {
            id: 'item_1',
            type: 'vitamin',
            name: 'วิตามินบีรวม',
            category: 'energy',
            timeSlot: 'morning',
            dosage: '1 เม็ด',
            taken: false,
            time: '08:00'
          },
          {
            id: 'item_2',
            type: 'vitamin',
            name: 'วิตามินซี',
            category: 'immune',
            timeSlot: 'morning',
            dosage: '1000mg',
            taken: true,
            time: '08:00'
          },
          {
            id: 'item_3',
            type: 'vitamin',
            name: 'โอเมก้า-3',
            category: 'brain',
            timeSlot: 'afternoon',
            dosage: '1000mg',
            taken: false,
            time: '13:00'
          },
          {
            id: 'item_4',
            type: 'vitamin',
            name: 'แมกนีเซียม',
            category: 'sleep',
            timeSlot: 'evening',
            dosage: '200mg',
            taken: false,
            time: '20:00'
          },
          {
            id: 'item_5',
            type: 'food',
            name: 'อกไก่อบกับข้าวกล้อง',
            category: 'pro',
            timeSlot: 'morning',
            calories: 450,
            protein: 35,
            taken: false,
            time: '09:00'
          },
          {
            id: 'item_6',
            type: 'food',
            name: 'แซลมอนกับควินัว',
            category: 'pro',
            timeSlot: 'afternoon',
            calories: 500,
            protein: 30,
            taken: false,
            time: '12:30'
          },
          {
            id: 'item_7',
            type: 'food',
            name: 'สลัดแซลมอน',
            category: 'lowEnergy',
            timeSlot: 'evening',
            calories: 350,
            protein: 25,
            taken: false,
            time: '19:00'
          }
        ];
        setPlanItems(mockItems);
        localStorage.setItem('plan_items', JSON.stringify(mockItems));
      }
      setLoading(false);
    };

    loadPlanItems();
  }, []);

  const toggleItemTaken = (itemId: string) => {
    const updatedItems = planItems.map(item => 
      item.id === itemId ? { ...item, taken: !item.taken } : item
    );
    setPlanItems(updatedItems);
    localStorage.setItem('plan_items', JSON.stringify(updatedItems));
  };

  const removeItem = (itemId: string) => {
    const updatedItems = planItems.filter(item => item.id !== itemId);
    setPlanItems(updatedItems);
    localStorage.setItem('plan_items', JSON.stringify(updatedItems));
  };

  const getItemsByTimeSlot = (timeSlot: string) => {
    return planItems.filter(item => item.timeSlot === timeSlot);
  };

  const getTimeSlotIcon = (timeSlot: string) => {
    switch(timeSlot) {
      case 'morning': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'afternoon': return <Cloud className="h-5 w-5 text-orange-500" />;
      case 'evening': return <Moon className="h-5 w-5 text-purple-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTimeSlotName = (timeSlot: string) => {
    switch(timeSlot) {
      case 'morning': return 'เช้า (06:00 - 12:00)';
      case 'afternoon': return 'บ่าย (12:00 - 18:00)';
      case 'evening': return 'เย็น (18:00 - 22:00)';
      default: return timeSlot;
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'energy': '#4CAF50',
      'joints': '#2196F3',
      'brain': '#9C27B0',
      'skin': '#E91E63',
      'sleep': '#673AB7',
      'immune': '#3F51B5',
      'pro': '#FF9800',
      'lowEnergy': '#795548'
    };
    return colors[category] || '#666';
  };

  const calculateDailyStats = () => {
    const totalItems = planItems.length;
    const takenItems = planItems.filter(item => item.taken).length;
    const completionRate = totalItems > 0 ? Math.round((takenItems / totalItems) * 100) : 0;
    
    const totalCalories = planItems
      .filter(item => item.type === 'food')
      .reduce((sum, item) => sum + (item.calories || 0), 0);
    
    const totalProtein = planItems
      .filter(item => item.type === 'food')
      .reduce((sum, item) => sum + (item.protein || 0), 0);
    
    return { totalItems, takenItems, completionRate, totalCalories, totalProtein };
  };

  const stats = calculateDailyStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดแผนสุขภาพ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                แผนสุขภาพรายวัน 📅
              </h1>
              <p className="text-gray-600">
                จัดการวิตามินและมื้ออาหารของคุณ
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Date Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Calendar className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedDate.toLocaleDateString('th-TH', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <p className="text-sm text-gray-500">วันนี้</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              <Download className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.completionRate}%</div>
                <div className="text-sm text-gray-600">ความสำเร็จ</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalItems}</div>
                <div className="text-sm text-gray-600">รายการทั้งหมด</div>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalCalories}</div>
                <div className="text-sm text-gray-600">แคลอรี่</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white">🔥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalProtein}g</div>
                <div className="text-sm text-gray-600">โปรตีน</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-white">💪</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-8">
          {['morning', 'afternoon', 'evening'].map((timeSlot) => {
            const items = getItemsByTimeSlot(timeSlot);
            
            return (
              <div key={timeSlot} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Time Slot Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getTimeSlotIcon(timeSlot)}
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {getTimeSlotName(timeSlot)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {items.length} รายการ
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">เวลาเริ่ม</div>
                      <div className="font-medium text-gray-800">
                        {items.length > 0 ? items[0].time : '--:--'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6">
                  {items.length > 0 ? (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                            item.taken
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center flex-1">
                            <button
                              onClick={() => toggleItemTaken(item.id)}
                              className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                                item.taken
                                  ? 'bg-green-500 text-white'
                                  : 'border-2 border-gray-300 hover:border-green-500'
                              }`}
                            >
                              {item.taken && <CheckCircle className="h-4 w-4" />}
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <div 
                                  className="h-3 w-3 rounded-full mr-2"
                                  style={{ backgroundColor: getCategoryColor(item.category) }}
                                />
                                <h4 className="font-medium text-gray-800">
                                  {item.name}
                                </h4>
                                {item.type === 'vitamin' && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    วิตามิน
                                  </span>
                                )}
                                {item.type === 'food' && (
                                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                                    อาหาร
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                {item.type === 'vitamin' ? (
                                  <span>ปริมาณ: {item.dosage}</span>
                                ) : (
                                  <span>
                                    {item.calories} kcal • {item.protein}g โปรตีน
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-800">{item.time}</div>
                              <div className="text-xs text-gray-500">เวลา</div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-4">ยังไม่มีรายการในช่วงนี้</p>
                      <Link
                        href={timeSlot === 'morning' ? '/vitamins' : '/food'}
                        className="inline-block px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        เพิ่มรายการ
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⚡ เพิ่มรายการด่วน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/vitamins"
              className="bg-white rounded-xl p-5 text-center border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                💊
              </div>
              <h3 className="font-medium text-gray-800 mb-2">เพิ่มวิตามิน</h3>
              <p className="text-sm text-gray-600">เลือกจากวิตามินแนะนำ</p>
            </Link>
            
            <Link
              href="/food"
              className="bg-white rounded-xl p-5 text-center border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                🍽️
              </div>
              <h3 className="font-medium text-gray-800 mb-2">เพิ่มมื้ออาหาร</h3>
              <p className="text-sm text-gray-600">เลือกจากเมนูแนะนำ</p>
            </Link>
            
            <button
              onClick={() => {
                // Add custom item
                const newItem = {
                  id: `custom_${Date.now()}`,
                  type: 'custom',
                  name: 'กิจกรรมออกกำลังกาย',
                  category: 'energy',
                  timeSlot: 'afternoon',
                  taken: false,
                  time: '17:00'
                };
                setPlanItems([...planItems, newItem]);
                localStorage.setItem('plan_items', JSON.stringify([...planItems, newItem]));
              }}
              className="bg-white rounded-xl p-5 text-center border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
                🏃
              </div>
              <h3 className="font-medium text-gray-800 mb-2">เพิ่มกิจกรรม</h3>
              <p className="text-sm text-gray-600">ออกกำลังกาย พักผ่อน ฯลฯ</p>
            </button>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            📊 ความคืบหน้าสัปดาห์นี้
          </h2>
          <div className="space-y-4">
            {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
              const date = new Date();
              date.setDate(date.getDate() - dayOffset);
              const completionRate = Math.floor(Math.random() * 100);
              
              return (
                <div key={dayOffset} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">
                    {date.toLocaleDateString('th-TH', { weekday: 'short' })}
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-800">
                    {completionRate}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export & Share */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center">
            <Download className="h-5 w-5 mr-2" />
            ส่งออกเป็น PDF
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            แชร์แผนสุขภาพ
          </button>
          <Link
            href="/assessment/results"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
          >
            ดูผลวิเคราะห์สุขภาพ
          </Link>
        </div>
      </div>
    </div>
  );
}