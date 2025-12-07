// app/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [healthHistory, setHealthHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Load health history from localStorage
    const loadHistory = () => {
      const savedAnswers = localStorage.getItem('assessment_answers');
      const completedAt = localStorage.getItem('assessment_completed_at');

      if (savedAnswers && completedAt) {
        // Mock history data for demonstration
        const mockHistory = [
          {
            id: 'history_1',
            date: new Date(Date.now() - 86400000 * 6).toISOString(),
            type: 'assessment',
            title: 'การประเมินสุขภาพ',
            score: 3.2,
            change: '+0.3',
            items: [
              { label: 'พลังงาน', score: 3.5 },
              { label: 'ข้อต่อ', score: 2.8 },
              { label: 'สมอง', score: 3.0 },
              { label: 'ผิวพรรณ', score: 3.2 },
              { label: 'การนอน', score: 3.8 },
              { label: 'ภูมิคุ้มกัน', score: 2.5 },
            ]
          },
          {
            id: 'history_2',
            date: new Date(Date.now() - 86400000 * 3).toISOString(),
            type: 'vitamin',
            title: 'กินวิตามินบีรวม',
            status: 'completed',
            items: ['วิตามินบีรวม', 'วิตามินซี']
          },
          {
            id: 'history_3',
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            type: 'food',
            title: 'บันทึกมื้ออาหาร',
            calories: 1850,
            protein: 95,
            items: ['อกไก่อบ', 'แซลมอน', 'สลัดผัก']
          },
          {
            id: 'history_4',
            date: new Date(Date.now() - 86400000).toISOString(),
            type: 'assessment',
            title: 'การประเมินสุขภาพ',
            score: 2.9,
            change: '-0.3',
            items: [
              { label: 'พลังงาน', score: 3.2 },
              { label: 'ข้อต่อ', score: 2.5 },
              { label: 'สมอง', score: 2.8 },
              { label: 'ผิวพรรณ', score: 3.0 },
              { label: 'การนอน', score: 3.5 },
              { label: 'ภูมิคุ้มกัน', score: 2.3 },
            ]
          },
          {
            id: 'history_5',
            date: new Date().toISOString(),
            type: 'vitamin',
            title: 'กินวิตามินวันนี้',
            status: 'pending',
            items: ['โอเมก้า-3', 'แมกนีเซียม']
          }
        ];
        
        setHealthHistory(mockHistory);
      }
      setLoading(false);
    };

    loadHistory();
  }, []);

  const filteredHistory = selectedFilter === 'all' 
    ? healthHistory 
    : healthHistory.filter(item => item.type === selectedFilter);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'assessment': return <TrendingUp className="h-5 w-5" />;
      case 'vitamin': return <CheckCircle className="h-5 w-5" />;
      case 'food': return <Clock className="h-5 w-5" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string): string => {
    switch(type) {
      case 'assessment': return 'bg-gradient-to-r from-green-500 to-blue-500';
      case 'vitamin': return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'food': return 'bg-gradient-to-r from-orange-500 to-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status?: string): string => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'skipped': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status?: string): string => {
    switch(status) {
      case 'completed': return 'เสร็จสิ้น';
      case 'pending': return 'รอดำเนินการ';
      case 'skipped': return 'ข้าม';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดประวัติ...</p>
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
                📊 ประวัติสุขภาพ
              </h1>
              <p className="text-gray-600">
                ติดตามความคืบหน้าและผลลัพธ์ของคุณ
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              กรองตามประเภท
            </h2>
            <div className="text-sm text-gray-500">
              {filteredHistory.length} รายการ
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setSelectedFilter('assessment')}
              className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                selectedFilter === 'assessment'
                  ? 'bg-white border-2 text-green-600'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                borderColor: selectedFilter === 'assessment' ? '#4CAF50' : ''
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              การประเมิน
            </button>
            <button
              onClick={() => setSelectedFilter('vitamin')}
              className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                selectedFilter === 'vitamin'
                  ? 'bg-white border-2 text-blue-600'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                borderColor: selectedFilter === 'vitamin' ? '#2196F3' : ''
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              วิตามิน
            </button>
            <button
              onClick={() => setSelectedFilter('food')}
              className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                selectedFilter === 'food'
                  ? 'bg-white border-2 text-orange-600'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                borderColor: selectedFilter === 'food' ? '#FF9800' : ''
              }}
            >
              <Clock className="h-4 w-4 mr-2" />
              อาหาร
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                ไม่พบประวัติ
              </h3>
              <p className="text-gray-600 mb-6">
                เริ่มต้นด้วยการทำแบบประเมินสุขภาพครั้งแรก
              </p>
              <Link
                href="/assessment"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                ทำแบบประเมินสุขภาพ
              </Link>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white mr-3 ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('th-TH', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {item.type === 'assessment' && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{item.score.toFixed(1)}</div>
                      <div className={`text-sm font-medium flex items-center justify-end ${
                        item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change.startsWith('+') ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {item.change}
                      </div>
                    </div>
                  )}
                  
                  {item.type === 'vitamin' && item.status && (
                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </div>
                  )}
                </div>

                {/* Item Details */}
                {item.type === 'assessment' && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">คะแนนรายหมวด:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                      {item.items.map((cat: any, index: number) => (
                        <div key={index} className="text-center">
                          <div className="text-lg font-bold text-gray-800">{cat.score.toFixed(1)}</div>
                          <div className="text-xs text-gray-500">{cat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.type === 'vitamin' && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">วิตามินที่กิน:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.items.map((vitamin: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {vitamin}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.type === 'food' && (
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{item.calories}</div>
                        <div className="text-xs text-gray-500">แคลอรี่</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{item.protein}g</div>
                        <div className="text-xs text-gray-500">โปรตีน</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{item.items.length}</div>
                        <div className="text-xs text-gray-500">เมนู</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">เมนูที่กิน:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.items.map((food: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                          >
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end">
                  <Link
                    href={
                      item.type === 'assessment' ? '/assessment/results' :
                      item.type === 'vitamin' ? '/vitamins' :
                      '/food'
                    }
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    ดูรายละเอียด
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress Charts */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            📈 แนวโน้มสุขภาพ 7 วัน
          </h2>
          <div className="h-64 flex items-end space-x-2">
            {[6, 5, 4, 3, 2, 1, 0].map((dayOffset) => {
              const date = new Date();
              date.setDate(date.getDate() - dayOffset);
              const score = 2.5 + Math.sin(dayOffset) * 0.5 + Math.random() * 0.3;
              const height = (score / 4) * 100;
              
              return (
                <div key={dayOffset} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">
                    {date.toLocaleDateString('th-TH', { weekday: 'short' })}
                  </div>
                  <div className="w-full flex justify-center">
                    <div 
                      className="w-8 bg-gradient-to-t from-green-400 to-blue-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                      title={`${score.toFixed(1)} คะแนน`}
                    />
                  </div>
                  <div className="text-xs text-gray-700 mt-2">{score.toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Data */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 ส่งออกข้อมูลสุขภาพ
          </h2>
          <p className="text-gray-600 mb-6">
            ดาวน์โหลดข้อมูลสุขภาพของคุณเพื่อวิเคราะห์เพิ่มเติมหรือแบ่งปันกับแพทย์
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center">
              <Download className="h-5 w-5 mr-2" />
              ส่งออกเป็น CSV
            </button>
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center">
              <Download className="h-5 w-5 mr-2" />
              ส่งออกเป็น PDF รายงาน
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              สร้างรายงานสุขภาพ
            </button>
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h4 className="font-medium text-yellow-800 mb-2">หมายเหตุสำคัญ</h4>
          <p className="text-sm text-yellow-700">
            • ข้อมูลนี้เป็นข้อมูลเบื้องต้นเท่านั้น<br />
            • ประวัติจะถูกเก็บไว้เฉพาะในอุปกรณ์ของคุณ<br />
            • คุณสามารถล้างประวัติได้ที่หน้าตั้งค่า<br />
            • ข้อมูลจะไม่ถูกส่งไปยังเซิร์ฟเวอร์ภายนอก
          </p>
        </div>
      </div>
    </div>
  );
}