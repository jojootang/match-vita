// app/food/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Fire, 
  Apple,
  ChefHat,
  TrendingUp,
  Zap,
  Brain,
  Heart,
  Shield,
  Moon,
  Bone
} from 'lucide-react';
import Link from 'next/link';
import { 
  ALL_FOODS, 
  getFoodsByCategory, 
  getFoodsByHealthCategory,
  getThaiFoods,
  getLowCalorieFoods,
  getHighProteinFoods,
  searchFoods 
} from '@/lib/constants/foods';
import { CATEGORIES } from '@/lib/constants/questions';

export default function FoodPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHealthCategory, setSelectedHealthCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorite_foods');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Initial load
    setFilteredFoods(ALL_FOODS.slice(0, 20));
  }, []);

  useEffect(() => {
    let filtered = ALL_FOODS;

    // Filter by food category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'thai') {
        filtered = getThaiFoods();
      } else if (selectedCategory === 'lowCalorie') {
        filtered = getLowCalorieFoods(300);
      } else if (selectedCategory === 'highProtein') {
        filtered = getHighProteinFoods(20);
      } else {
        filtered = getFoodsByCategory(selectedCategory);
      }
    }

    // Filter by health category
    if (selectedHealthCategory !== 'all') {
      filtered = filtered.filter(food => 
        food.healthCategories.includes(selectedHealthCategory)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchFoods(searchQuery);
    }

    setFilteredFoods(filtered);
  }, [selectedCategory, selectedHealthCategory, searchQuery]);

  const toggleFavorite = (foodId: string) => {
    const newFavorites = favorites.includes(foodId)
      ? favorites.filter(id => id !== foodId)
      : [...favorites, foodId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorite_foods', JSON.stringify(newFavorites));
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'pro': '#4CAF50',
      'highProtein': '#2196F3',
      'lowEnergy': '#FF9800',
      'skinHealth': '#E91E63',
      'brainFood': '#9C27B0',
      'immuneBoost': '#3F51B5',
      'jointHealth': '#795548',
      'thai': '#F44336'
    };
    return colors[category] || '#666';
  };

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      'pro': 'โปรตีนสูง',
      'highProtein': 'โปรตีนสูงมาก',
      'lowEnergy': 'พลังงานต่ำ',
      'skinHealth': 'ผิวพรรณ',
      'brainFood': 'สมอง',
      'immuneBoost': 'ภูมิคุ้มกัน',
      'jointHealth': 'ข้อต่อ',
      'thai': 'อาหารไทย'
    };
    return names[category] || category;
  };

  const getHealthCategoryIcon = (category: string) => {
    switch(category) {
      case 'energy': return <Zap className="h-3 w-3" />;
      case 'joints': return <Bone className="h-3 w-3" />;
      case 'brain': return <Brain className="h-3 w-3" />;
      case 'skin': return <Heart className="h-3 w-3" />;
      case 'sleep': return <Moon className="h-3 w-3" />;
      case 'immune': return <Shield className="h-3 w-3" />;
      default: return null;
    }
  };

  const getPriceLevelText = (level: number): string => {
    switch(level) {
      case 1: return '฿';
      case 2: return '฿฿';
      case 3: return '฿฿฿';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            กินไรดีวันนี้? 🍽️
          </h1>
          <p className="text-green-100 mb-6">
            ค้นหาเมนูอาหารที่เหมาะกับสุขภาพและเป้าหมายของคุณ
          </p>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ค้นหาเมนูอาหาร (เช่น ส้มตำ, แซลมอน, ผัดไทย...)"
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            หมวดหมู่เมนู
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
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
            <button
              onClick={() => setSelectedCategory('thai')}
              className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                selectedCategory === 'thai'
                  ? 'bg-white border-2'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                borderColor: selectedCategory === 'thai' ? '#F44336' : '',
                color: selectedCategory === 'thai' ? '#F44336' : ''
              }}
            >
              🇹🇭 อาหารไทย
            </button>
            <button
              onClick={() => setSelectedCategory('pro')}
              className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                selectedCategory === 'pro'
                  ? 'bg-white border-2'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                borderColor: selectedCategory === 'pro' ? getCategoryColor('pro') : '',
                color: selectedCategory === 'pro' ? getCategoryColor('pro') : ''
              }}
            >
              💪 โปรตีนสูง
            </button>
            <button
              onClick={() => setSelectedCategory('lowCalorie')}
              className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                selectedCategory === 'lowCalorie'
                  ? 'bg-white border-2'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                borderColor: selectedCategory === 'lowCalorie' ? getCategoryColor('lowEnergy') : '',
                color: selectedCategory === 'lowCalorie' ? getCategoryColor('lowEnergy') : ''
              }}
            >
              ⚖️ แคลอรี่ต่ำ
            </button>
            <button
              onClick={() => setSelectedCategory('highProtein')}
              className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                selectedCategory === 'highProtein'
                  ? 'bg-white border-2'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                borderColor: selectedCategory === 'highProtein' ? getCategoryColor('highProtein') : '',
                color: selectedCategory === 'highProtein' ? getCategoryColor('highProtein') : ''
              }}
            >
              🥩 โปรตีนสูงมาก
            </button>
          </div>

          {/* Health Category Filters */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            สุขภาพที่ต้องการดูแล
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedHealthCategory('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedHealthCategory === 'all'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              ทั้งหมด
            </button>
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedHealthCategory(key)}
                className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                  selectedHealthCategory === key
                    ? 'bg-white border-2'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  borderColor: selectedHealthCategory === key ? category.color : '',
                  color: selectedHealthCategory === key ? category.color : ''
                }}
              >
                <span className="mr-2">{getHealthCategoryIcon(key)}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            พบ {filteredFoods.length} เมนู
          </p>
          {(selectedCategory !== 'all' || selectedHealthCategory !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedHealthCategory('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>

        {/* Foods Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ไม่พบเมนูที่คุณค้นหา
            </h3>
            <p className="text-gray-600">
              ลองค้นหาด้วยคำอื่นหรือเลือกหมวดหมู่ที่แตกต่าง
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => {
              const isFavorite = favorites.includes(food.id);
              
              return (
                <div
                  key={food.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:scale-[1.01]"
                >
                  {/* Image Section */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <div className="text-4xl">
                        {food.category === 'thai' ? '🇹🇭' : '🍲'}
                      </div>
                    </div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(food.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {/* Category Badge */}
                    <div 
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getCategoryColor(food.category) }}
                    >
                      {getCategoryName(food.category)}
                    </div>

                    {/* Health Categories */}
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {food.healthCategories.slice(0, 3).map((healthCat: string) => {
                        const catInfo = CATEGORIES[healthCat as keyof typeof CATEGORIES];
                        return catInfo ? (
                          <div
                            key={healthCat}
                            className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: catInfo.color }}
                            title={catInfo.name}
                          >
                            {getHealthCategoryIcon(healthCat)}
                          </div>
                        ) : null;
                      })}
                    </div>

                    {/* Price Level */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/70 text-white text-xs">
                      {getPriceLevelText(food.priceLevel)}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {food.thaiName}
                        </h3>
                        <p className="text-sm text-gray-500">{food.name}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">{food.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {food.description}
                    </p>

                    {/* Nutrition Info */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{food.calories}</div>
                        <div className="text-xs text-gray-500">kcal</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{food.protein}g</div>
                        <div className="text-xs text-gray-500">โปรตีน</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{food.carbs}g</div>
                        <div className="text-xs text-gray-500">คาร์บ</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{food.fat}g</div>
                        <div className="text-xs text-gray-500">ไขมัน</div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">ประโยชน์:</h4>
                      <div className="flex flex-wrap gap-1">
                        {food.benefits.slice(0, 2).map((benefit: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Cooking Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {food.cookingTime}
                      </div>
                      <div className="flex items-center">
                        <ChefHat className="h-4 w-4 mr-1" />
                        {food.difficulty}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/food/${food.id}`}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg text-center font-medium hover:opacity-90 transition-opacity"
                      >
                        ดูสูตร
                      </Link>
                      <button
                        onClick={() => {
                          // Add to today's plan
                          alert(`เพิ่ม ${food.thaiName} เข้าสู่แผนมื้ออาหารแล้ว!`);
                        }}
                        className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <Apple className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Personalized Recommendation */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🎯 เมนูแนะนำจากผลประเมินสุขภาพ
          </h2>
          <p className="text-gray-600 mb-6">
            ทำแบบประเมินสุขภาพเพื่อรับคำแนะนำเมนูอาหารที่เหมาะกับสภาพร่างกายของคุณโดยเฉพาะ
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Daily Food Challenge */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🏆 ภารกิจอาหารวันนี้
          </h2>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
                🥗
              </div>
              <div>
                <h3 className="font-bold text-gray-800">กินผักให้ครบ 5 สี</h3>
                <p className="text-sm text-gray-600">รับสารอาหารครบถ้วนจากผักหลากสี</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {['🟢', '🔴', '🟡', '🟣', '🟠'].map((color, index) => (
                  <div
                    key={index}
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      index < 3 ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    {color}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                3/5 เสร็จแล้ว
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}