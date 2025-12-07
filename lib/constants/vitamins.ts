// lib/constants/vitamins.ts - ส่วนเพิ่มเติม

export interface HealthLevels {
  energy: number; // 1-4
  joints: number; // 1-4
  brain: number; // 1-4
  skin: number; // 1-4
  sleep: number; // 1-4
  immune: number; // 1-4
}

// Rule-based matching rules
const MATCHING_RULES: Record<string, Record<number, string[]>> = {
  energy: {
    3: ['B-Complex', 'Vitamin C'], // ควรใส่ใจ
    4: ['B-Complex', 'CoQ10', 'Iron'] // ต้องปรับปรุง
  },
  joints: {
    3: ['Fish Oil', 'Omega-3', 'Glucosamine'],
    4: ['Glucosamine', 'Chondroitin', 'Calcium', 'Vitamin D3']
  },
  brain: {
    3: ['Omega-3', 'B12', 'Ginkgo Biloba'],
    4: ['Phosphatidylserine', 'Lions Mane', 'L-Tyrosine']
  },
  skin: {
    3: ['Vitamin C', 'Collagen', 'Hyaluronic Acid'],
    4: ['Vitamin E', 'Astaxanthin', 'Zinc']
  },
  sleep: {
    3: ['Magnesium', 'L-Theanine'],
    4: ['Melatonin', 'Ashwagandha']
  },
  immune: {
    3: ['Vitamin C', 'Zinc', 'Quercetin'],
    4: ['Vitamin D3', 'Elderberry', 'Beta-Glucan']
  }
};

// ฟังก์ชันดึงวิตามินแนะนำส่วนตัวตาม Rule-Based Logic
export function getPersonalizedRecommendations(healthLevels: HealthLevels): Vitamin[] {
  const recommendedVitamins: Vitamin[] = [];
  const addedIds = new Set<string>();

  // ดึงวิตามินตามกฎการจับคู่
  Object.entries(healthLevels).forEach(([category, level]) => {
    if (level >= 3) { // ระดับ 3 และ 4 เท่านั้น
      const rules = MATCHING_RULES[category];
      if (rules && rules[level]) {
        const vitaminNames = rules[level];
        
        vitaminNames.forEach(name => {
          // ค้นหาวิตามินที่ตรงกับชื่อ
          const matchedVitamins = ALL_VITAMINS.filter(v => 
            v.name.toLowerCase().includes(name.toLowerCase()) ||
            v.tags.some(tag => tag.toLowerCase().includes(name.toLowerCase()))
          );
          
          matchedVitamins.forEach(vitamin => {
            if (!addedIds.has(vitamin.id)) {
              addedIds.add(vitamin.id);
              recommendedVitamins.push(vitamin);
            }
          });
        });
      }
    }
  });

  // ถ้าไม่มีคำแนะนำให้ระดับ 3-4 ให้แนะนำวิตามินทั่วไป
  if (recommendedVitamins.length === 0) {
    return getTopRatedVitamins(12);
  }

  // จัดเรียงตามระดับความสำคัญ (ระดับ 4 ก่อน 3)
  recommendedVitamins.sort((a, b) => {
    const aPriority = healthLevels[a.category as keyof HealthLevels] || 0;
    const bPriority = healthLevels[b.category as keyof HealthLevels] || 0;
    return bPriority - aPriority;
  });

  return recommendedVitamins;
}