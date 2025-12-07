// app/vitamins/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart, 
  Zap, 
  Brain, 
  Bone,
  Heart as SkinIcon,
  Moon,
  Shield,
  AlertCircle,
  Sparkles,
  Crown,
  TrendingUp,
  Gift,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { 
  ALL_VITAMINS, 
  getVitaminsByCategory, 
  getTopRatedVitamins,
  VITAMIN_CATEGORIES,
  getPersonalizedRecommendations,
  type Vitamin,
  type HealthLevels
} from '@/lib/constants/vitamins';
import { AffiliateService } from '@/lib/services/affiliate.service';
import { SubscriptionService } from '@/lib/services/subscription.service';
import { useAuth } from '@/lib/hooks/useAuth';

// ฟังก์ชันคำนวณระดับสุขภาพจากคะแนน
const calculateHealthLevel = (score: number): number => {
  if (score >= 4 && score <= 6) return 1; // ดีมาก
  if (score >= 7 && score <= 9) return 2; // ดี
  if (score >= 10 && score <= 12) return 3; // ควรใส่ใจ
  if (score >= 13 && score <= 16) return 4; // ต้องปรับปรุง
  return 2; // default
};

export default function VitaminsPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVitamins, setFilteredVitamins] = useState<Vitamin[]>([]);
  const [personalizedVitamins, setPersonalizedVitamins] = useState<Vitamin[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [healthScores, setHealthScores] = useState<HealthLevels | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPersonalized, setShowPersonalized] = useState(true);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [affiliateStats, setAffiliateStats] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Vitamin[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // โหลดรายการโปรด
    const savedFavorites = localStorage.getItem('favorite_vitamins');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // โหลดข้อมูล subscription
    if (user) {
      const subscription = await SubscriptionService.getUserSubscription(user.id);
      setUserSubscription(subscription);
      
      if (subscription?.isPremium) {
        const stats = await AffiliateService.getUserStats(user.id);
        setAffiliateStats(stats);
      }
    }

    // โหลดผลประเมินสุขภาพ
    await loadAssessmentResults();
    
    // โหลด featured products
    setFeaturedProducts(getTopRatedVitamins(5));
    
    setLoading(false);
  };

  const loadAssessmentResults = async () => {
    try {
      const savedAnswers = localStorage.getItem('assessment_answers');
      if (savedAnswers) {
        const answers = JSON.parse(savedAnswers);
        
        // คำนวณคะแนนสุขภาพแต่ละหมวด
        const scores: HealthLevels = {
          energy: calculateHealthLevel(answers.energy || 8),
          joints: calculateHealthLevel(answers.joints || 8),
          brain: calculateHealthLevel(answers.brain || 8),
          skin: calculateHealthLevel(answers.skin || 8),
          sleep: calculateHealthLevel(answers.sleep || 8),
          immune: calculateHealthLevel(answers.immune || 8)
        };
        
        setHealthScores(scores);
        
        // ดึงคำแนะนำส่วนตัว
        const recommendations = getPersonalizedRecommendations(scores);
        setPersonalizedVitamins(recommendations);
        setFilteredVitamins(recommendations.slice(0, 12));
        setShowPersonalized(true);
      } else {
        setFilteredVitamins(getTopRatedVitamins(20));
        setShowPersonalized(false);
      }
    } catch (error) {
      console.error('Error loading assessment results:', error);
      setFilteredVitamins(getTopRatedVitamins(20));
      setShowPersonalized(false);
    }
  };

  useEffect(() => {
    if (!showPersonalized) {
      let filtered = ALL_VITAMINS;

      if (selectedCategory !== 'all') {
        filtered = getVitaminsByCategory(selectedCategory);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(vitamin => 
          vitamin.name.toLowerCase().includes(query) ||
          vitamin.description.toLowerCase().includes(query) ||
          vitamin.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      setFilteredVitamins(filtered);
    } else if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = personalizedVitamins.filter(vitamin => 
        vitamin.name.toLowerCase().includes(query) ||
        vitamin.description.toLowerCase().includes(query) ||
        vitamin.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredVitamins(filtered);
    }
  }, [selectedCategory, searchQuery, showPersonalized, personalizedVitamins]);

  const toggleFavorite = (vitaminId: string) => {
    const newFavorites = favorites.includes(vitaminId)
      ? favorites.filter(id => id !== vitaminId)
      : [...favorites, vitaminId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorite_vitamins', JSON.stringify(newFavorites));
  };

  const toggleViewMode = () => {
    if (showPersonalized) {
      setFilteredVitamins(getTopRatedVitamins(20));
      setSelectedCategory('all');
      setSearchQuery('');
    } else {
      setFilteredVitamins(personalizedVitamins.slice(0, 12));
    }
    setShowPersonalized(!showPersonalized);
  };

  const handleAffiliateClick = async (vitaminId: string, platform: string = 'shopee') => {
    if (user) {
      await AffiliateService.trackClick({
        userId: user.id,
        vitaminId,
        platform,
        linkType: 'direct'
      });
    }
    
    // ค้นหา vitamin
    const vitamin = ALL_VITAMINS.find(v => v.id === vitaminId);
    if (vitamin) {
      window.open(vitamin.affiliateLinks[platform as keyof typeof vitamin.affiliateLinks], '_blank');
    }
  };

  const startFreeTrial = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login?redirect=/vitamins';
      return;
    }
    
    try {
      const session = await SubscriptionService.createCheckoutSession(user.id, 'monthly');
      window.location.href = session.url;
    } catch (error) {
      console.error('Error starting free trial:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'energy': return <Zap className="h-4 w-4" />;
      case 'joints': return <Bone className="h-4 w-4" />;
      case 'brain': return <Brain className="h-4 w-4" />;
      case 'skin': return <SkinIcon className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'immune': return <Shield className="h-4 w-4" />;
      default: return null;
    }
  };

  const getLevelColor = (level: number): string => {
    switch(level) {
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 4: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelName = (level: number): string => {
    switch(level) {
      case 1: return 'ดีมาก';
      case 2: return 'ดี';
      case 3: return 'ควรใส่ใจ';
      case 4: return 'ต้องปรับปรุง';
      default: return '';
    }
  };

  const getHealthRecommendationText = () => {
    if (!healthScores) return '';

    const categoriesWithHighLevel = Object.entries(healthScores)
      .filter(([_, level]) => level >= 3)
      .map(([category]) => VITAMIN_CATEGORIES[category as keyof typeof VITAMIN_CATEGORIES]?.name);

    if (categoriesWithHighLevel.length === 0) {
      return 'สุขภาพโดยรวมดีมาก! แนะนำวิตามินเพื่อป้องกัน';
    }

    return `เน้นดูแล: ${categoriesWithHighLevel.join(', ')}`;
  };

  // Premium Banner Component
  const PremiumUpgradeBanner = () => (
    <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center mb-2">
            <Crown className="h-6 w-6 mr-2" />
            <h3 className="text-xl font-bold">อัปเกรดเป็น Premium</h3>
          </div>
          <p className="text-purple-100">
            ปลดล็อกฟีเจอร์พิเศษและเพิ่มโอกาสหารายได้
          </p>
        </div>
        <button
          onClick={startFreeTrial}
          className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          ทดลองฟรี 7 วัน
        </button>
      </div>
    </div>
  );

  // Affiliate Dashboard สำหรับ Premium Users
  const AffiliateDashboard = ({ stats }: { stats: any }) => (
    <div className="mb-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">Dashboard รายได้ของคุณ</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-sm text-gray-500">คลิกทั้งหมด</div>
          <div className="text-2xl font-bold">{stats.totalClicks || 0}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-sm text-gray-500">Conversion</div>
          <div className="text-2xl font-bold">{stats.conversionRate || 0}%</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-sm text-gray-500">รายได้ประมาณการ</div>
          <div className="text-2xl font-bold">฿{stats.estimatedRevenue || 0}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-sm text-gray-500">Rank</div>
          <div className="text-2xl font-bold">#{stats.rank || '-'}</div>
        </div>
      </div>
      <Link 
        href="/affiliate/dashboard" 
        className="text-green-600 hover:text-green-800 font-medium"
      >
        ดูรายละเอียด →
      </Link>
    </div>
  );

  // Affiliate Promotion Section
  const AffiliatePromotionSection = () => (
    <div className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <Gift className="h-6 w-6 text-orange-500 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">🛒 ซื้อครบ 500 บาท รับฟรี Health E-Book!</h3>
      </div>
      <p className="text-gray-600 mb-4">เฉพาะสมาชิก MatchVita เท่านั้น</p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {featuredProducts.slice(0, 5).map(product => (
          <div key={product.id} className="bg-white rounded-lg p-3 border hover:shadow-md transition-shadow">
            <div className="text-lg mb-1">{getCategoryIcon(product.category)}</div>
            <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
            <div className="text-green-600 font-bold text-sm">฿{product.priceRange.min}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <BookOpen className="h-4 w-4 mr-1" />
        <span>รับ E-Book "สุขภาพดีเริ่มต้นที่อาหาร" ฟรี!</span>
      </div>
    </div>
  );

  // Subscription Upsell
  const SubscriptionUpsell = () => (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
        ✨ อัปเกรดเป็น Premium เพื่อ:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ul className="space-y-2">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>แผนสุขภาพรายสัปดาห์</span>
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>เมนูอาหารประจำวัน</span>
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>วิตามินรีวิวโดยแพทย์</span>
          </li>
        </ul>
        <ul className="space-y-2">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>Affiliate earnings dashboard</span>
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>Daily health challenges</span>
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>Priority support</span>
          </li>
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={startFreeTrial}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          ทดลองฟรี 7 วัน
        </button>
        <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          ดูแผนราคา
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลสุขภาพ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            วิตามินและอาหารเสริมแนะนำ
          </h1>
          <p className="text-green-100 mb-6">
            ค้นหาวิตามินที่เหมาะกับสุขภาพของคุณ จากฐานข้อมูล 50+ รายการ
          </p>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ค้นหาวิตามิน (เช่น Vitamin C, Omega-3, Collagen...)"
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Premium Banner */}
        {!userSubscription?.isPremium && <PremiumUpgradeBanner />}
        
        {/* Affiliate Dashboard สำหรับ Premium Users */}
        {userSubscription?.isPremium && affiliateStats && (
          <AffiliateDashboard stats={affiliateStats} />
        )}
        
        {/* Affiliate Promotion */}
        <AffiliatePromotionSection />
        
        {/* Personalized Recommendations Banner */}
        {showPersonalized && healthScores && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">
                    คำแนะนำส่วนตัวสำหรับคุณ
                  </h2>
                </div>
                <p className="text-gray-600 mb-4 md:mb-0">
                  {getHealthRecommendationText()}
                </p>
              </div>
              <button
                onClick={toggleViewMode}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                ดูวิตามินทั้งหมด
              </button>
            </div>

            {/* Health Levels Overview */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-3">
              {Object.entries(healthScores).map(([category, level]) => {
                const categoryInfo = VITAMIN_CATEGORIES[category as keyof typeof VITAMIN_CATEGORIES];
                if (!categoryInfo) return null;

                return (
                  <div 
                    key={category}
                    className={`p-3 rounded-xl border-2 ${getLevelColor(level)}`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="mr-2">{categoryInfo.icon}</span>
                      <span className="text-xs font-medium">{categoryInfo.name}</span>
                    </div>
                    <div className="text-sm font-bold">{getLevelName(level)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Filter - Show only when not in personalized mode */}
        {!showPersonalized && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                หมวดหมู่สุขภาพ
              </h2>
              {personalizedVitamins.length > 0 && (
                <button
                  onClick={toggleViewMode}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  ดูคำแนะนำส่วนตัว
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ทั้งหมด
              </button>
              {Object.entries(VITAMIN_CATEGORIES).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                    selectedCategory === key
                      ? 'bg-white border-2 text-gray-800'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    borderColor: selectedCategory === key ? category.color : '',
                    color: selectedCategory === key ? category.color : ''
                  }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {showPersonalized ? 'วิตามินแนะนำสำหรับคุณ' : 'วิตามินทั้งหมด'}
            </h2>
            <p className="text-gray-600">
              พบ {filteredVitamins.length} รายการ
              {showPersonalized && healthScores && (
                <span className="ml-2 text-sm text-green-600">
                  (เลือกให้เหมาะกับสุขภาพของคุณโดยเฉพาะ)
                </span>
              )}
            </p>
          </div>
          {!showPersonalized && selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* Vitamins Grid */}
        {filteredVitamins.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ไม่พบวิตามินที่คุณค้นหา
            </h3>
            <p className="text-gray-600">
              ลองค้นหาด้วยคำอื่นหรือเลือกหมวดหมู่ที่แตกต่าง
            </p>
            {personalizedVitamins.length > 0 && (
              <button
                onClick={toggleViewMode}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                กลับไปดูคำแนะนำส่วนตัว
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVitamins.map((vitamin) => {
              const isFavorite = favorites.includes(vitamin.id);
              const categoryInfo = VITAMIN_CATEGORIES[vitamin.category as keyof typeof VITAMIN_CATEGORIES];
              const isPersonalized = showPersonalized && personalizedVitamins.some(v => v.id === vitamin.id);

              return (
                <div
                  key={vitamin.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow ${
                    isPersonalized 
                      ? 'border-2 border-green-300 shadow-green-100' 
                      : 'border-gray-200'
                  }`}
                >
                  {isPersonalized && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        แนะนำสำหรับคุณ
                      </div>
                    </div>
                  )}

                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-gradient-to-br flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${categoryInfo?.color}20, ${categoryInfo?.color}40)`
                      }}
                    >
                      <div className="text-4xl">
                        {categoryInfo?.icon}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleFavorite(vitamin.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`}
                      />
                    </button>

                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(vitamin.level)}`}>
                      {getLevelName(vitamin.level)}
                    </div>

                    <div 
                      className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                      style={{ 
                        backgroundColor: `${categoryInfo?.color}20`,
                        color: categoryInfo?.color,
                        border: `1px solid ${categoryInfo?.color}30`
                      }}
                    >
                      {categoryInfo?.name}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                        {vitamin.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">{vitamin.rating.toFixed(1)}</span>
                        <span className="ml-1 text-sm text-gray-500">({vitamin.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {vitamin.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">ประโยชน์:</h4>
                      <p className="text-sm text-gray-600">
                        {vitamin.benefit.length > 80 
                          ? `${vitamin.benefit.substring(0, 80)}...` 
                          : vitamin.benefit
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">ปริมาณแนะนำ</div>
                        <div className="text-sm font-medium text-gray-800">{vitamin.dosage}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">เวลาที่แนะนำ</div>
                        <div className="text-sm font-medium text-gray-800 capitalize">
                          {vitamin.bestTime === 'anytime' ? 'เวลาใดก็ได้' : vitamin.bestTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-lg font-bold text-gray-800">
                          ฿{vitamin.priceRange.min} - ฿{vitamin.priceRange.max}
                        </div>
                        <div className="text-xs text-gray-500">ราคาโดยประมาณ</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">ต่อบรรจุภัณฑ์</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/vitamins/${vitamin.id}`}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg text-center font-medium hover:opacity-90 transition-opacity"
                      >
                        ดูรายละเอียด
                      </Link>
                      <button
                        onClick={() => handleAffiliateClick(vitamin.id, 'shopee')}
                        className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                        title="ซื้อผ่าน Shopee"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Subscription Upsell */}
        <SubscriptionUpsell />

        {/* Assessment Call to Action */}
        {!showPersonalized && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                  ต้องการคำแนะนำเฉพาะบุคคลไหม?
                </h2>
                <p className="text-gray-600 mb-4">
                  ระบบจะวิเคราะห์สุขภาพของคุณจาก 24 คำถาม และแนะนำวิตามินที่เหมาะกับคุณโดยเฉพาะ
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">วิเคราะห์ 6 ด้านสุขภาพ</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">คำแนะนำเฉพาะบุคคล</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">ฟรี! ใช้เวลาเพียง 5 นาที</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/assessment"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-center"
                >
                  ทำแบบประเมินสุขภาพฟรี
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  ดูแดชบอร์ดสุขภาพ
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Affiliate Disclosure */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">ข้อมูลสำคัญ</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• ลิงก์ซื้อสินค้าในหน้านี้เป็นลิงก์พันธมิตร (Affiliate Links)</li>
                <li>• MatchVita อาจได้รับค่าคอมมิชชั่นจากการซื้อผ่านลิงก์เหล่านี้</li>
                <li>• ราคาอาจเปลี่ยนแปลงตามร้านค้าและโปรโมชั่น</li>
                <li>• โปรดศึกษาข้อมูลผลิตภัณฑ์และปรึกษาแพทย์ก่อนใช้</li>
                <li>• คำแนะนำด้านสุขภาพเป็นเพียงข้อมูลทั่วไป ไม่ใช่คำแนะนำทางการแพทย์</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}