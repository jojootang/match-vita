// app/assessment/results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  Download, 
  Share2, 
  TrendingUp, 
  Brain, 
  Heart, 
  Moon, 
  Sun,
  Bone,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { 
  QUESTIONS, 
  CATEGORIES, 
  calculateCategoryScores, 
  determineHealthLevel 
} from '@/lib/constants/questions';

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load answers from localStorage
    const savedAnswers = localStorage.getItem('assessment_answers');
    const isCompleted = localStorage.getItem('assessment_completed');

    if (!savedAnswers || !isCompleted) {
      router.push('/assessment');
      return;
    }

    try {
      const answers = JSON.parse(savedAnswers);
      const categoryScores = calculateCategoryScores(answers);
      
      // Calculate results for each category
      const categoryResults = Object.entries(categoryScores).map(([category, data]) => {
        const level = determineHealthLevel(data.average);
        return {
          category,
          categoryName: CATEGORIES[category as keyof typeof CATEGORIES]?.name || category,
          icon: CATEGORIES[category as keyof typeof CATEGORIES]?.icon || '📊',
          color: CATEGORIES[category as keyof typeof CATEGORIES]?.color || '#666',
          score: data.average,
          level,
          levelName: getLevelName(level),
          description: getLevelDescription(category, level),
          recommendations: getRecommendations(category, level)
        };
      });

      // Calculate overall score
      const overallScore = Object.values(categoryScores).reduce((acc, data) => {
        return acc + data.average;
      }, 0) / Object.keys(categoryScores).length;

      const overallLevel = determineHealthLevel(overallScore);

      setResults({
        answers,
        categoryResults,
        overallScore,
        overallLevel,
        overallLevelName: getLevelName(overallLevel),
        totalQuestions: QUESTIONS.length,
        answeredQuestions: Object.keys(answers).length,
        completedAt: localStorage.getItem('assessment_completed_at') || new Date().toISOString()
      });
    } catch (error) {
      console.error('Error parsing results:', error);
      router.push('/assessment');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const getLevelName = (level: number): string => {
    switch(level) {
      case 1: return 'ดีเยี่ยม';
      case 2: return 'ดี';
      case 3: return 'ปานกลาง';
      case 4: return 'ควรดูแล';
      default: return 'ไม่ทราบ';
    }
  };

  const getLevelColor = (level: number): string => {
    switch(level) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 4: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelDescription = (category: string, level: number): string => {
    const descriptions: Record<string, string[]> = {
      energy: [
        'พลังงานของคุณอยู่ในระดับดีเยี่ยม! 💪',
        'พลังงานของคุณอยู่ในระดับดี 👍',
        'พลังงานของคุณอยู่ในระดับปานกลาง อาจต้องการการดูแลเพิ่มเติม',
        'พลังงานของคุณอยู่ในระดับต่ำ ควรดูแลเพิ่มเติม'
      ],
      joints: [
        'กระดูกและข้อต่อของคุณแข็งแรงดี 👌',
        'กระดูกและข้อต่อของคุณอยู่ในสภาพดี',
        'กระดูกและข้อต่อของคุณต้องการการดูแลเพิ่มเติม',
        'กระดูกและข้อต่อของคุณต้องการการดูแลอย่างใกล้ชิด'
      ],
      brain: [
        'สมองและความจำของคุณอยู่ในระดับดีเยี่ยม! 🧠',
        'สมองและความจำของคุณอยู่ในระดับดี',
        'สมองและความจำของคุณต้องการการกระตุ้นและการดูแล',
        'สมองและความจำของคุณต้องการการดูแลอย่างจริงจัง'
      ],
      skin: [
        'ผิวพรรณของคุณอยู่ในสภาพดีเยี่ยม! ✨',
        'ผิวพรรณของคุณอยู่ในสภาพดี',
        'ผิวพรรณของคุณต้องการการดูแลเพิ่มเติม',
        'ผิวพรรณของคุณต้องการการดูแลอย่างใกล้ชิด'
      ],
      sleep: [
        'การนอนหลับของคุณมีคุณภาพดีเยี่ยม! 😴',
        'การนอนหลับของคุณมีคุณภาพดี',
        'การนอนหลับของคุณต้องการการปรับปรุง',
        'การนอนหลับของคุณต้องการการดูแลอย่างจริงจัง'
      ],
      immune: [
        'ภูมิคุ้มกันของคุณแข็งแรงดี! 🛡️',
        'ภูมิคุ้มกันของคุณอยู่ในระดับดี',
        'ภูมิคุ้มกันของคุณต้องการการเสริมสร้าง',
        'ภูมิคุ้มกันของคุณต้องการการดูแลเพิ่มเติม'
      ]
    };

    return descriptions[category]?.[level - 1] || 'ผลการประเมิน';
  };

  const getRecommendations = (category: string, level: number): string[] => {
    const recommendations: Record<string, string[][]> = {
      energy: [
        ['รักษาพลังงานดีนี้ไว้ด้วยอาหารที่สมดุล'],
        ['เพิ่มการออกกำลังกายแบบแอโรบิก 30 นาที 3 ครั้ง/สัปดาห์'],
        ['เพิ่มอาหารที่มีธาตุเหล็กและวิตามินบี'],
        ['ปรึกษาแพทย์เกี่ยวกับอาการเหนื่อยล้าเรื้อรัง']
      ],
      joints: [
        ['รักษาการเคลื่อนไหวให้สม่ำเสมอ'],
        ['เพิ่มการยืดเหยียดกล้ามเนื้อเป็นประจำ'],
        ['เพิ่มอาหารที่มีแคลเซียมและวิตามินดี'],
        ['ปรึกษานักกายภาพบำบัดหรือแพทย์เฉพาะทาง']
      ],
      brain: [
        ['รักษาสุขภาพสมองด้วยกิจกรรมที่ท้าทาย'],
        ['เล่นเกมฝึกสมองเป็นประจำ'],
        ['เพิ่มอาหารที่มีโอเมก้า-3 และสารต้านอนุมูลอิสระ'],
        ['ปรึกษาแพทย์เกี่ยวกับปัญหาความจำ']
      ],
      skin: [
        ['รักษาความชุ่มชื้นของผิวด้วยครีมบำรุง'],
        ['เพิ่มอาหารที่มีวิตามินซีและอี'],
        ['เพิ่มการดื่มน้ำและลดแสงแดด'],
        ['ปรึกษาแพทย์ผิวหนังเพื่อการดูแลที่เหมาะสม']
      ],
      sleep: [
        ['รักษากิจวัตรการนอนให้สม่ำเสมอ'],
        ['สร้างสภาพแวดล้อมการนอนที่เหมาะสม'],
        ['ฝึกการผ่อนคลายก่อนนอน'],
        ['ปรึกษาแพทย์เกี่ยวกับปัญหาการนอนหลับ']
      ],
      immune: [
        ['รักษาสุขภาพด้วยอาหารที่มีประโยชน์'],
        ['เพิ่มอาหารที่มีวิตามินซีและสังกะสี'],
        ['พักผ่อนให้เพียงพอและลดความเครียด'],
        ['ปรึกษาแพทย์เพื่อเสริมสร้างภูมิคุ้มกัน']
      ]
    };

    return recommendations[category]?.[level - 1] || ['ไม่มีคำแนะนำในขณะนี้'];
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ผลประเมินสุขภาพของฉันจาก MatchVita',
        text: `ฉันได้ทำแบบประเมินสุขภาพบน MatchVita และได้ผลลัพธ์เป็น "${results?.overallLevelName}"!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกลิงก์ผลลัพธ์ไปยังคลิปบอร์ดแล้ว!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังวิเคราะห์ผลลัพธ์...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">ไม่พบผลลัพธ์</h2>
          <p className="text-gray-600 mb-6">กรุณาทำแบบประเมินสุขภาพก่อน</p>
          <Link
            href="/assessment"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            ทำแบบประเมินสุขภาพ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ผลประเมินสุขภาพของคุณ
          </h1>
          <p className="text-gray-600">
            ประเมินเมื่อ {new Date(results.completedAt).toLocaleDateString('th-TH')}
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">คะแนนสุขภาพโดยรวม</h2>
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${getLevelColor(results.overallLevel)}`}>
                <span className="font-bold">{results.overallLevelName}</span>
              </div>
              <p className="mt-2 text-green-100">
                คุณได้ตอบคำถามทั้งหมด {results.answeredQuestions} จาก {results.totalQuestions} คำถาม
              </p>
            </div>
            <div className="text-center mt-4 md:mt-0">
              <div className="text-5xl font-bold">{results.overallScore.toFixed(1)}</div>
              <div className="text-green-100">คะแนนเฉลี่ย</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            แชร์ผลลัพธ์
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            ดาวน์โหลด PDF
          </button>
          <Link
            href="/vitamins"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            ดูวิตามินแนะนำ
          </Link>
        </div>

        {/* Category Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {results.categoryResults.map((category: any, index: number) => (
            <div
              key={category.category}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-xl mr-3"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{category.categoryName}</h3>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getLevelColor(category.level)}`}>
                      {category.levelName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: category.color }}>
                    {category.score.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">คะแนน</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">คำแนะนำ:</h4>
                <ul className="space-y-1">
                  {category.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        ✓
                      </div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Health Score Wheel Visualization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            วงล้อสุขภาพ (Health Score Wheel)
          </h2>
          <div className="flex justify-center">
            <div className="relative h-64 w-64">
              {/* This is a simplified radar chart - in production, use a charting library */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{results.overallScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">คะแนนเฉลี่ย</div>
                </div>
              </div>
              
              {/* Radar chart points would go here */}
              <div className="absolute inset-0 border-2 border-gray-300 rounded-full"></div>
              
              {/* Category markers */}
              {results.categoryResults.map((category: any, index: number) => {
                const angle = (index * 60) * (Math.PI / 180);
                const radius = 80;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                return (
                  <div
                    key={category.category}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
            {results.categoryResults.map((category: any) => (
              <div key={category.category} className="text-center">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-xl mx-auto mb-2"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {category.icon}
                </div>
                <div className="text-sm font-medium text-gray-700">{category.categoryName}</div>
                <div className="text-lg font-bold" style={{ color: category.color }}>
                  {category.score.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ขั้นตอนถัดไป</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/vitamins"
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3">
                  💊
                </div>
                <h3 className="font-semibold text-gray-800">วิตามินแนะนำ</h3>
              </div>
              <p className="text-sm text-gray-600">
                ดูวิตามินและอาหารเสริมที่เหมาะกับสุขภาพของคุณ
              </p>
            </Link>
            
            <Link
              href="/dashboard"
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  📊
                </div>
                <h3 className="font-semibold text-gray-800">แดชบอร์ดสุขภาพ</h3>
              </div>
              <p className="text-sm text-gray-600">
                ติดตามความคืบหน้าและแผนสุขภาพรายวัน
              </p>
            </Link>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">ข้อควรระวัง</h4>
              <p className="text-sm text-yellow-700">
                ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ 
                หากคุณมีปัญหาสุขภาพที่รุนแรงหรือเรื้อรัง โปรดปรึกษาแพทย์หรือผู้เชี่ยวชาญด้านสุขภาพ 
                MatchVita ไม่รับผิดชอบต่อการตัดสินใจใดๆ จากการใช้ข้อมูลนี้
              </p>
            </div>
          </div>
        </div>

        {/* Retake Assessment */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              localStorage.removeItem('assessment_answers');
              localStorage.removeItem('assessment_current_index');
              localStorage.removeItem('assessment_completed');
              localStorage.removeItem('assessment_completed_at');
              router.push('/assessment');
            }}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            ทำแบบประเมินใหม่
          </button>
        </div>
      </div>
    </div>
  );
}