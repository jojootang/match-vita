// app/assessment/page.tsx - อัปเดต
'use client';

import AssessmentQuiz from '@/components/assessment/AssessmentQuiz';
import { Brain, Heart, TrendingUp, Shield, Zap, Bone } from 'lucide-react';

export default function AssessmentPage() {
  const handleAssessmentComplete = (answers: Record<string, number>) => {
    console.log('Assessment completed with answers:', answers);
    // Results handling is done in the results page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            ตรวจสุขภาพเบื้องต้นกับ MatchVita
          </h1>
          <p className="text-xl mb-8 text-green-100">
            ประเมิน 6 ด้านสุขภาพใน 5 นาที พร้อมรับคำแนะนำเฉพาะบุคคล
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <Zap className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">พลังงาน</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <Bone className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">กระดูก & ข้อ</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <Brain className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">สมอง & ความจำ</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <Heart className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">ผิวพรรณ</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">การนอนหลับ</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">ภูมิคุ้มกัน</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            คำแนะนำก่อนเริ่มทำแบบประเมิน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">ใช้เวลา 5 นาที</h3>
                <p className="text-sm text-gray-600">มีทั้งหมด 24 คำถาม ตอบตามความรู้สึกปัจจุบัน</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">ตอบตามความเป็นจริง</h3>
                <p className="text-sm text-gray-600">เพื่อให้ได้ผลวิเคราะห์ที่แม่นยำและเป็นประโยชน์</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">ไม่ใช่การวินิจฉัย</h3>
                <p className="text-sm text-gray-600">ผลลัพธ์เป็นข้อมูลเบื้องต้นเท่านั้น</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">เก็บเป็นความลับ</h3>
                <p className="text-sm text-gray-600">ข้อมูลของคุณจะถูกเก็บเป็นความลับและไม่เปิดเผย</p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            พร้อมเริ่มประเมินสุขภาพของคุณแล้วหรือยัง?
          </h3>
          <p className="text-gray-600 mb-6">
            เริ่มต้นด้วยการตอบคำถาม 24 ข้อเพื่อวิเคราะห์สุขภาพ 6 ด้าน
          </p>
        </div>
      </div>

      {/* Assessment Quiz Component */}
      <AssessmentQuiz onComplete={handleAssessmentComplete} />
    </div>
  );
}