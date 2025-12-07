// lib/constants/foods.ts
// Mock data for Thai foods - 50+ items

export interface FoodItem {
  id: string;
  name: string;
  thaiName: string;
  description: string;
  category: 'pro' | 'highProtein' | 'lowEnergy' | 'skinHealth' | 'brainFood' | 'immuneBoost' | 'jointHealth';
  healthCategories: ('energy' | 'joints' | 'brain' | 'skin' | 'sleep' | 'immune')[];
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  nutrients: {
    name: string;
    amount: string;
    benefit: string;
  }[];
  benefits: string[];
  ingredients: string[];
  cookingTime: string;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ยาก';
  priceLevel: 1 | 2 | 3; // 1: ถูก, 2: ปานกลาง, 3: แพง
  tags: string[];
  rating: number;
  reviewCount: number;
  recipeUrl?: string;
  affiliateLinks?: {
    shopee?: string;
    lazada?: string;
    grabFood?: string;
    foodPanda?: string;
  };
}

export const FOOD_ITEMS: FoodItem[] = [
  // Pro Foods (High Protein)
  {
    id: 'food_pro_1',
    name: 'Grilled Chicken Breast with Brown Rice',
    thaiName: 'อกไก่อบกับข้าวกล้อง',
    description: 'อกไก่อบไร้หนังพร้อมข้าวกล้อง อุดมด้วยโปรตีนสูงและไฟเบอร์',
    category: 'pro',
    healthCategories: ['energy', 'immune'],
    imageUrl: '/foods/chicken-breast.jpg',
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 12,
    fiber: 5,
    nutrients: [
      { name: 'โปรตีน', amount: '35g', benefit: 'สร้างและซ่อมแซมกล้ามเนื้อ' },
      { name: 'ไฟเบอร์', amount: '5g', benefit: 'ช่วยระบบขับถ่าย' },
      { name: 'วิตามินบี', amount: 'สูง', benefit: 'เพิ่มพลังงาน' }
    ],
    benefits: [
      'โปรตีนสูงช่วยสร้างกล้ามเนื้อ',
      'ไฟเบอร์ช่วยระบบขับถ่าย',
      'พลังงานต่ำเหมาะสำหรับควบคุมน้ำหนัก'
    ],
    ingredients: [
      'อกไก่ไร้หนัง 150g',
      'ข้าวกล้อง 1 ถ้วย',
      'ผักสลัดตามชอบ',
      'น้ำมันมะกอก 1 ช้อนชา',
      'เครื่องเทศตามชอบ'
    ],
    cookingTime: '20 นาที',
    difficulty: 'ง่าย',
    priceLevel: 2,
    tags: ['โปรตีนสูง', 'ลดน้ำหนัก', 'สุขภาพ'],
    rating: 4.5,
    reviewCount: 234,
    recipeUrl: 'https://example.com/recipe1',
    affiliateLinks: {
      shopee: 'https://shope.ee/...',
      lazada: 'https://s.lazada.co.th/...'
    }
  },
  {
    id: 'food_pro_2',
    name: 'Salmon with Quinoa and Vegetables',
    thaiName: 'แซลมอนกับควินัวและผัก',
    description: 'แซลมอนย่างพร้อมควินัวและผักสด อุดมด้วยโอเมก้า-3 และโปรตีน',
    category: 'pro',
    healthCategories: ['brain', 'skin', 'immune'],
    imageUrl: '/foods/salmon-quinoa.jpg',
    calories: 500,
    protein: 30,
    carbs: 45,
    fat: 20,
    fiber: 8,
    nutrients: [
      { name: 'โอเมก้า-3', amount: '2g', benefit: 'บำรุงสมองและลดการอักเสบ' },
      { name: 'โปรตีน', amount: '30g', benefit: 'ซ่อมแซมเซลล์' },
      { name: 'ไฟเบอร์', amount: '8g', benefit: 'ช่วยระบบขับถ่าย' }
    ],
    benefits: [
      'โอเมก้า-3 สูงบำรุงสมอง',
      'โปรตีนครบถ้วน',
      'ไฟเบอร์สูงช่วยลดคอเลสเตอรอล'
    ],
    ingredients: [
      'เนื้อแซลมอน 150g',
      'ควินัว 1 ถ้วย',
      'บร็อคโคลี่',
      'แครอท',
      'เลมอน',
      'สมุนไพรสด'
    ],
    cookingTime: '25 นาที',
    difficulty: 'ปานกลาง',
    priceLevel: 3,
    tags: ['โอเมก้า-3', 'สมอง', 'ผิวพรรณ'],
    rating: 4.7,
    reviewCount: 189,
    recipeUrl: 'https://example.com/recipe2'
  },

  // High Protein Foods
  {
    id: 'food_highprotein_1',
    name: 'Greek Yogurt with Berries and Nuts',
    thaiName: 'กรีกโยเกิร์ตกับเบอร์รี่และถั่ว',
    description: 'กรีกโยเกิร์ตโปรตีนสูงพร้อมเบอร์รี่สดและถั่ว',
    category: 'highProtein',
    healthCategories: ['energy', 'immune'],
    imageUrl: '/foods/greek-yogurt.jpg',
    calories: 300,
    protein: 25,
    carbs: 20,
    fat: 15,
    fiber: 6,
    nutrients: [
      { name: 'โปรตีน', amount: '25g', benefit: 'ซ่อมแซมกล้ามเนื้อ' },
      { name: 'แคลเซียม', amount: 'สูง', benefit: 'เสริมสร้างกระดูก' },
      { name: 'สารต้านอนุมูลอิสระ', amount: 'สูง', benefit: 'ปกป้องเซลล์' }
    ],
    benefits: [
      'โปรตีนสูงช่วยควบคุมน้ำหนัก',
      'แคลเซียมเสริมกระดูก',
      'สารต้านอนุมูลอิสระจากเบอร์รี่'
    ],
    ingredients: [
      'กรีกโยเกิร์ต 200g',
      'เบอร์รี่สด (สตรอเบอร์รี่, บลูเบอร์รี่)',
      'อัลมอนด์หรือวอลนัท',
      'น้ำผึ้ง 1 ช้อนชา'
    ],
    cookingTime: '5 นาที',
    difficulty: 'ง่าย',
    priceLevel: 2,
    tags: ['โปรตีนสูง', 'มื้อเช้า', 'ของหวานสุขภาพ'],
    rating: 4.6,
    reviewCount: 456,
    recipeUrl: 'https://example.com/recipe3'
  },
  {
    id: 'food_highprotein_2',
    name: 'Tofu and Vegetable Stir-fry',
    thaiName: 'เต้าหู้ผัดผัก',
    description: 'เต้าหู้โปรตีนจากพืชผัดกับผักสดหลากสี',
    category: 'highProtein',
    healthCategories: ['energy', 'joints', 'immune'],
    imageUrl: '/foods/tofu-stirfry.jpg',
    calories: 350,
    protein: 20,
    carbs: 25,
    fat: 18,
    fiber: 7,
    nutrients: [
      { name: 'โปรตีนพืช', amount: '20g', benefit: 'ทางเลือกโปรตีนสำหรับมังสวิรัติ' },
      { name: 'ไฟเบอร์', amount: '7g', benefit: 'ช่วยระบบย่อยอาหาร' },
      { name: 'ไอโซฟลาโวน', amount: 'สูง', benefit: 'ดีต่อฮอร์โมน' }
    ],
    benefits: [
      'โปรตีนพืชสำหรับมังสวิรัติ',
      'ไฟเบอร์สูงช่วยขับถ่าย',
      'ไขมันดีจากน้ำมันมะกอก'
    ],
    ingredients: [
      'เต้าหู้แข็ง 200g',
      'พริกหวานหลากสี',
      'บร็อคโคลี่',
      'เห็ด',
      'น้ำมันมะกอก',
      'ซอสถั่วเหลืองลดโซเดียม'
    ],
    cookingTime: '15 นาที',
    difficulty: 'ง่าย',
    priceLevel: 1,
    tags: ['มังสวิรัติ', 'โปรตีนพืช', 'ผักหลากสี'],
    rating: 4.4,
    reviewCount: 321,
    recipeUrl: 'https://example.com/recipe4'
  },

  // Low Energy Foods
  {
    id: 'food_lowenergy_1',
    name: 'Vegetable Soup with Chicken',
    thaiName: 'ซุปผักอกไก่',
    description: 'ซุปผักอุ่นๆ พร้อมอกไก่สับ เหมาะสำหรับมื้อเย็น',
    category: 'lowEnergy',
    healthCategories: ['energy', 'immune'],
    imageUrl: '/foods/vegetable-soup.jpg',
    calories: 250,
    protein: 20,
    carbs: 15,
    fat: 8,
    fiber: 6,
    nutrients: [
      { name: 'โปรตีน', amount: '20g', benefit: 'ช่วยซ่อมแซมร่างกาย' },
      { name: 'วิตามิน', amount: 'หลากหลาย', benefit: 'เสริมภูมิคุ้มกัน' },
      { name: 'น้ำ', amount: 'สูง', benefit: 'ช่วยขับถ่ายของเสีย' }
    ],
    benefits: [
      'แคลอรี่ต่ำเหมาะสำหรับมื้อเย็น',
      'น้ำช่วยขับถ่ายของเสีย',
      'วิตามินจากผักหลากชนิด'
    ],
    ingredients: [
      'อกไก่สับ 100g',
      'แครอท',
      'เซเลอรี่',
      'หอมใหญ่',
      'กระเทียม',
      'ผักชี',
      'น้ำซุปไก่'
    ],
    cookingTime: '30 นาที',
    difficulty: 'ง่าย',
    priceLevel: 1,
    tags: ['แคลอรี่ต่ำ', 'มื้อเย็น', 'ซุปสุขภาพ'],
    rating: 4.3,
    reviewCount: 234,
    recipeUrl: 'https://example.com/recipe5'
  },

  // Skin Health Foods
  {
    id: 'food_skin_1',
    name: 'Avocado and Spinach Smoothie',
    thaiName: 'สมูทตี้อโวคาโดกับผักโขม',
    description: 'สมูทตี้สีเขียวสดชื่น อุดมด้วยวิตามินและไขมันดี',
    category: 'skinHealth',
    healthCategories: ['skin', 'energy', 'immune'],
    imageUrl: '/foods/avocado-smoothie.jpg',
    calories: 350,
    protein: 8,
    carbs: 25,
    fat: 25,
    fiber: 10,
    nutrients: [
      { name: 'วิตามินอี', amount: 'สูง', benefit: 'ต้านอนุมูลอิสระ' },
      { name: 'วิตามินซี', amount: 'สูง', benefit: 'ช่วยสร้างคอลลาเจน' },
      { name: 'ไขมันดี', amount: '25g', benefit: 'บำรุงผิวพรรณ' }
    ],
    benefits: [
      'วิตามินซีช่วยสร้างคอลลาเจน',
      'ไขมันดีจากอโวคาโดบำรุงผิว',
      'ไฟเบอร์สูงช่วยขับถ่าย'
    ],
    ingredients: [
      'อโวคาโด 1/2 ลูก',
      'ผักโขม 1 ถ้วย',
      'กล้วย 1 ลูก',
      'นมอัลมอนด์ 1 ถ้วย',
      'น้ำผึ้ง 1 ช้อนชา',
      'เมล็ดเจีย'
    ],
    cookingTime: '5 นาที',
    difficulty: 'ง่าย',
    priceLevel: 2,
    tags: ['ผิวพรรณ', 'สมูทตี้', 'ไขมันดี'],
    rating: 4.5,
    reviewCount: 567,
    recipeUrl: 'https://example.com/recipe6'
  },

  // Brain Foods
  {
    id: 'food_brain_1',
    name: 'Walnut and Blueberry Oatmeal',
    thaiName: 'ข้าวโอ๊ตกับวอลนัทและบลูเบอร์รี่',
    description: 'ข้าวโอ๊ตอุ่นๆ พร้อมวอลนัทและบลูเบอร์รี่สด บำรุงสมอง',
    category: 'brainFood',
    healthCategories: ['brain', 'energy'],
    imageUrl: '/foods/walnut-oatmeal.jpg',
    calories: 400,
    protein: 12,
    carbs: 50,
    fat: 18,
    fiber: 8,
    nutrients: [
      { name: 'โอเมก้า-3', amount: 'สูง', benefit: 'บำรุงสมอง' },
      { name: 'สารต้านอนุมูลอิสระ', amount: 'สูง', benefit: 'ปกป้องเซลล์สมอง' },
      { name: 'ไฟเบอร์', amount: '8g', benefit: 'ควบคุมน้ำตาลในเลือด' }
    ],
    benefits: [
      'โอเมก้า-3 จากวอลนัทบำรุงสมอง',
      'สารต้านอนุมูลอิสระจากบลูเบอร์รี่',
      'ไฟเบอร์ช่วยควบคุมน้ำตาล'
    ],
    ingredients: [
      'ข้าวโอ๊ต 1/2 ถ้วย',
      'วอลนัท 1/4 ถ้วย',
      'บลูเบอร์รี่สด 1/2 ถ้วย',
      'นม 1 ถ้วย',
      'น้ำผึ้งหรือเมเปิ้ลไซรัป'
    ],
    cookingTime: '10 นาที',
    difficulty: 'ง่าย',
    priceLevel: 2,
    tags: ['สมอง', 'มื้อเช้า', 'ข้าวโอ๊ต'],
    rating: 4.6,
    reviewCount: 432,
    recipeUrl: 'https://example.com/recipe7'
  },

  // Immune Boost Foods
  {
    id: 'food_immune_1',
    name: 'Ginger Lemon Tea with Honey',
    thaiName: 'ชาขิงมะนาวน้ำผึ้ง',
    description: 'เครื่องดื่มอุ่นๆ จากขิงและมะนาว เสริมสร้างภูมิคุ้มกัน',
    category: 'immuneBoost',
    healthCategories: ['immune', 'energy'],
    imageUrl: '/foods/ginger-tea.jpg',
    calories: 50,
    protein: 0,
    carbs: 12,
    fat: 0,
    fiber: 0,
    nutrients: [
      { name: 'วิตามินซี', amount: 'สูง', benefit: 'เสริมภูมิคุ้มกัน' },
      { name: 'จิงเจอร์รอล', amount: 'สูง', benefit: 'ต้านการอักเสบ' },
      { name: 'สารต้านอนุมูลอิสระ', amount: 'สูง', benefit: 'ปกป้องเซลล์' }
    ],
    benefits: [
      'วิตามินซีจากมะนาวเสริมภูมิคุ้มกัน',
      'ขิงช่วยต้านการอักเสบ',
      'น้ำผึ้งมีคุณสมบัติต้านเชื้อแบคทีเรีย'
    ],
    ingredients: [
      'ขิงสด 2 แว่น',
      'มะนาว 1 ลูก',
      'น้ำผึ้ง 1-2 ช้อนชา',
      'น้ำร้อน 1 ถ้วย'
    ],
    cookingTime: '5 นาที',
    difficulty: 'ง่าย',
    priceLevel: 1,
    tags: ['ภูมิคุ้มกัน', 'เครื่องดื่มสุขภาพ', 'ขิง'],
    rating: 4.7,
    reviewCount: 789,
    recipeUrl: 'https://example.com/recipe8'
  },

  // Joint Health Foods
  {
    id: 'food_joint_1',
    name: 'Bone Broth',
    thaiName: 'น้ำซุปกระดูก',
    description: 'น้ำซุปกระดูกที่เคี่ยวนาน อุดมด้วยคอลลาเจนและสารอาหาร',
    category: 'jointHealth',
    healthCategories: ['joints', 'skin', 'immune'],
    imageUrl: '/foods/bone-broth.jpg',
    calories: 80,
    protein: 10,
    carbs: 2,
    fat: 4,
    fiber: 0,
    nutrients: [
      { name: 'คอลลาเจน', amount: 'สูง', benefit: 'บำรุงข้อต่อและผิวพรรณ' },
      { name: 'กรดอะมิโน', amount: 'ครบถ้วน', benefit: 'ซ่อมแซมร่างกาย' },
      { name: 'แร่ธาตุ', amount: 'หลากหลาย', benefit: 'เสริมสร้างกระดูก' }
    ],
    benefits: [
      'คอลลาเจนบำรุงข้อต่อและผิว',
      'แร่ธาตุเสริมกระดูก',
      'ช่วยซ่อมแซมระบบทางเดินอาหาร'
    ],
    ingredients: [
      'กระดูกสัตว์ (ไก่, วัว) 1 กก.',
      'น้ำ 4 ลิตร',
      'น้ำส้มสายชูแอปเปิ้ลไซเดอร์ 2 ช้อนโต๊ะ',
      'ผัก (แครอท, หอมใหญ่, กระเทียม)',
      'สมุนไพร (โรสแมรี่, ไทม์)'
    ],
    cookingTime: '12-24 ชั่วโมง',
    difficulty: 'ง่าย',
    priceLevel: 1,
    tags: ['คอลลาเจน', 'ข้อต่อ', 'น้ำซุปกระดูก'],
    rating: 4.4,
    reviewCount: 345,
    recipeUrl: 'https://example.com/recipe9'
  }
];

// Add more Thai foods to reach 50+ items
export const THAI_FOODS: FoodItem[] = [
  // Thai Dishes
  {
    id: 'food_thai_1',
    name: 'Som Tam (Papaya Salad)',
    thaiName: 'ส้มตำ',
    description: 'ส้มตำไทยรสแซ่บ อุดมด้วยวิตามินจากมะละกอและผักสด',
    category: 'lowEnergy',
    healthCategories: ['energy', 'immune'],
    imageUrl: '/foods/som-tam.jpg',
    calories: 200,
    protein: 5,
    carbs: 25,
    fat: 8,
    fiber: 6,
    nutrients: [
      { name: 'วิตามินซี', amount: 'สูง', benefit: 'เสริมภูมิคุ้มกัน' },
      { name: 'ไฟเบอร์', amount: '6g', benefit: 'ช่วยระบบขับถ่าย' },
      { name: 'เอนไซม์ปาเปน', amount: 'สูง', benefit: 'ช่วยย่อยโปรตีน' }
    ],
    benefits: [
      'วิตามินซีสูงจากมะละกอ',
      'ไฟเบอร์ช่วยขับถ่าย',
      'แคลอรี่ต่ำเหมาะสำหรับควบคุมน้ำหนัก'
    ],
    ingredients: [
      'มะละกอดิบ',
      'มะเขือเทศ',
      'ถั่วลันเตา',
      'พริกขี้หนู',
      'กระเทียม',
      'น้ำปลา',
      'มะนาว',
      'น้ำตาลปี๊บ'
    ],
    cookingTime: '15 นาที',
    difficulty: 'ง่าย',
    priceLevel: 1,
    tags: ['ไทย', 'แคลอรี่ต่ำ', 'วิตามินซี'],
    rating: 4.8,
    reviewCount: 987,
    recipeUrl: 'https://example.com/recipe10'
  },
  {
    id: 'food_thai_2',
    name: 'Tom Yum Goong',
    thaiName: 'ต้มยำกุ้ง',
    description: 'ต้มยำกุ้งรสชาติจัดจ้าน อุดมด้วยโปรตีนและสมุนไพร',
    category: 'immuneBoost',
    healthCategories: ['immune', 'energy'],
    imageUrl: '/foods/tom-yum.jpg',
    calories: 250,
    protein: 20,
    carbs: 15,
    fat: 10,
    fiber: 3,
    nutrients: [
      { name: 'โปรตีน', amount: '20g', benefit: 'จากกุ้ง' },
      { name: 'สารต้านอนุมูลอิสระ', amount: 'สูง', benefit: 'จากสมุนไพร' },
      { name: 'วิตามินซี', amount: 'สูง', benefit: 'จากมะนาว' }
    ],
    benefits: [
      'โปรตีนจากกุ้ง',
      'สมุนไพรช่วยต้านการอักเสบ',
      'ช่วยเสริมภูมิคุ้มกัน'
    ],
    ingredients: [
      'กุ้งสด',
      'เห็ด',
      'ตะไคร้',
      'ใบมะกรูด',
      'ข่า',
      'พริกขี้หนู',
      'น้ำปลา',
      'มะนาว'
    ],
    cookingTime: '20 นาที',
    difficulty: 'ปานกลาง',
    priceLevel: 2,
    tags: ['ไทย', 'ภูมิคุ้มกัน', 'โปรตีน'],
    rating: 4.7,
    reviewCount: 876,
    recipeUrl: 'https://example.com/recipe11'
  },
  {
    id: 'food_thai_3',
    name: 'Pad Thai',
    thaiName: 'ผัดไทย',
    description: 'ผัดไทยเส้นเล็กผัดกับโปรตีนและถั่ว อุดมด้วยพลังงาน',
    category: 'pro',
    healthCategories: ['energy'],
    imageUrl: '/foods/pad-thai.jpg',
    calories: 500,
    protein: 25,
    carbs: 60,
    fat: 15,
    fiber: 4,
    nutrients: [
      { name: 'โปรตีน', amount: '25g', benefit: 'จากกุ้งหรือไก่' },
      { name: 'คาร์โบไฮเดรต', amount: '60g', benefit: 'พลังงาน' },
      { name: 'ไขมันดี', amount: 'จากถั่ว', benefit: 'บำรุงหัวใจ' }
    ],
    benefits: [
      'พลังงานสูงเหมาะสำหรับมื้อหลัก',
      'โปรตีนครบถ้วน',
      'ไขมันดีจากถั่ว'
    ],
    ingredients: [
      'เส้นเล็ก',
      'กุ้งหรือไก่',
      'เต้าหู้',
      'ถั่วงอก',
      'กระเทียม',
      'น้ำปลา',
      'น้ำตาล',
      'มะนาว',
      'ถั่วลิสง'
    ],
    cookingTime: '20 นาที',
    difficulty: 'ปานกลาง',
    priceLevel: 2,
    tags: ['ไทย', 'มื้อหลัก', 'พลังงานสูง'],
    rating: 4.6,
    reviewCount: 765,
    recipeUrl: 'https://example.com/recipe12'
  },
  {
    id: 'food_thai_4',
    name: 'Green Curry Chicken',
    thaiName: 'แกงเขียวหวานไก่',
    description: 'แกงเขียวหวานรสชาติกลมกล่อม อุดมด้วยโปรตีนและสมุนไพร',
    category: 'pro',
    healthCategories: ['energy', 'immune'],
    imageUrl: '/foods/green-curry.jpg',
    calories: 450,
    protein: 30,
    carbs: 30,
    fat: 20,
    fiber: 5,
    nutrients: [
      { name: 'โปรตีน', amount: '30g', benefit: 'จากไก่' },
      { name: 'สารต้านอนุมูลอิสระ', amount: 'สูง', benefit: 'จากพริกและสมุนไพร' },
      { name: 'ไฟเบอร์', amount: '5g', benefit: 'จากผัก' }
    ],
    benefits: [
      'โปรตีนสูงจากไก่',
      'สมุนไพรช่วยต้านการอักเสบ',
      'ไฟเบอร์จากผัก'
    ],
    ingredients: [
      'ไก่',
      'มะเขือพวง',
      'ใบโหระพา',
      'น้ำพริกแกงเขียวหวาน',
      'กะทิ',
      'น้ำปลา',
      'น้ำตาลปี๊บ'
    ],
    cookingTime: '30 นาที',
    difficulty: 'ปานกลาง',
    priceLevel: 2,
    tags: ['ไทย', 'แกง', 'โปรตีนสูง'],
    rating: 4.5,
    reviewCount: 654,
    recipeUrl: 'https://example.com/recipe13'
  },
  {
    id: 'food_thai_5',
    name: 'Mango Sticky Rice',
    thaiName: 'ข้าวเหนียวมะม่วง',
    description: 'ของหวานไทยคลาสสิก อุดมด้วยพลังงานและวิตามิน',
    category: 'lowEnergy',
    healthCategories: ['energy'],
    imageUrl: '/foods/mango-sticky-rice.jpg',
    calories: 400,
    protein: 5,
    carbs: 70,
    fat: 10,
    fiber: 3,
    nutrients: [
      { name: 'วิตามินเอ', amount: 'สูง', benefit: 'จากมะม่วงสุก' },
      { name: 'พลังงาน', amount: 'สูง', benefit: 'จากข้าวเหนียวและน้ำตาล' },
      { name: 'ไขมันดี', amount: 'จากกะทิ', benefit: 'ให้พลังงาน' }
    ],
    benefits: [
      'วิตามินเอจากมะม่วงบำรุงสายตา',
      'พลังงานสูง',
      'ไขมันดีจากกะทิ'
    ],
    ingredients: [
      'ข้าวเหนียว',
      'มะม่วงสุก',
      'กะทิ',
      'น้ำตาล',
      'เกลือ',
      'ถั่วเหลือง'
    ],
    cookingTime: '40 นาที',
    difficulty: 'ปานกลาง',
    priceLevel: 2,
    tags: ['ไทย', 'ของหวาน', 'มะม่วง'],
    rating: 4.8,
    reviewCount: 543,
    recipeUrl: 'https://example.com/recipe14'
  },
  // Add more Thai foods...
  {
    id: 'food_thai_6',
    name: 'Grilled Pork Skewers',
    thaiName: 'หมูปิ้ง',
    description: 'หมูปิ้งเสียบไม้รสชาติหวานอร่อย อุดมด้วยโปรตีน',
    category: 'pro',
    healthCategories: ['energy'],
    imageUrl: '/foods/grilled-pork.jpg',
    calories: 300,
    protein: 25,
    carbs: 15,
    fat: 15,
    fiber: 1,
    nutrients: [
      { name: 'โปรตีน', amount: '25g', benefit: 'จากหมู' },
      { name: 'ธาตุเหล็ก', amount: 'สูง', benefit: 'ป้องกันโลหิตจาง' },
      { name: 'วิตามินบี', amount: 'สูง', benefit: 'เพิ่มพลังงาน' }
    ],
    benefits: [
      'โปรตีนสูง',
      'ธาตุเหล็กบำรุงเลือด',
      'วิตามินบีเพิ่มพลังงาน'
    ],
    ingredients: [
      'เนื้อหมูสันใน',
      'น้ำตาล',
      'น้ำปลา',
      'พริกไทย',
      'ตะไคร้',
      'กระเทียม'
    ],
    cookingTime: '25 นาที',
    difficulty: 'ง่าย',
    priceLevel: 1,
    tags: ['ไทย', 'โปรตีน', 'ปิ้งย่าง'],
    rating: 4.4,
    reviewCount: 432,
    recipeUrl: 'https://example.com/recipe15'
  },
  {
    id: 'food_thai_7',
    name: 'Spicy Basil Chicken',
    thaiName: 'ผัดกะเพราไก่',
    description: 'ผัดกะเพราไก่รสชาติเผ็ดร้อน อุดมด้วยโปรตีนและสมุนไพร',
    category: 'pro',
    healthCategories: ['energy', 'immune'],
    imageUrl: '/foods/basil-chicken.jpg',
    calories: 350,
    protein: 30,
    carbs: 20,
    fat: 18,
    fiber: 3,
    nutrients: [
      { name: 'โปรตีน', amount: '30g', benefit: 'จากไก่' },
      { name: 'สารต้านอนุมูลอิสระ', amount: 'สูง', benefit: 'จากใบกะเพรา' },
      { name: 'แคปไซซิน', amount: 'จากพริก', benefit: 'เพิ่มอัตราการเผาผลาญ' }
    ],
    benefits: [
      'โปรตีนสูง',
      'ใบกะเพราช่วยต้านการอักเสบ',
      'พริกช่วยเพิ่มการเผาผลาญ'
    ],
    ingredients: [
      'ไก่สับ',
      'ใบกะเพรา',
      'พริกขี้หนู',
      'กระเทียม',
      'น้ำปลา',
      'ซอสหอยนางรม',
      'น้ำตาล'
    ],
    cookingTime: '15 นาที',
    difficulty: 'ง่าย',
    priceLevel: 1,
    tags: ['ไทย', 'ผัด', 'โปรตีนสูง'],
    rating: 4.6,
    reviewCount: 567,
    recipeUrl: 'https://example.com/recipe16'
  },
  {
    id: 'food_thai_8',
    name: 'Coconut Milk Soup with Mushrooms',
    thaiName: 'ต้มข่าเห็ด',
    description: 'ต้มข่าเห็ดรสชาติกลมกล่อม อุดมด้วยสมุนไพรและไฟเบอร์',
    category: 'immuneBoost',
    healthCategories: ['immune', 'energy'],
    imageUrl: '/foods/coconut-soup.jpg',
    calories: 200,
    protein: 10,
    carbs: 15,
    fat: 12,
    fiber: 5,
    nutrients: [
      { name: 'ไฟเบอร์', amount: '5g', benefit: 'จากเห็ด' },
      { name: 'สารต้านอนุมูลอิสระ', amount: 'สูง', benefit: 'จากข่าและตะไคร้' },
      { name: 'ไขมันดี', amount: 'จากกะทิ', benefit: 'ให้พลังงาน' }
    ],
    benefits: [
      'ไฟเบอร์สูงจากเห็ด',
      'สมุนไพรช่วยต้านการอักเสบ',
      'ไขมันดีจากกะทิ'
    ],
    ingredients: [
      'เห็ดนางฟ้า',
      'เห็ดหูหนู',
      'ข่า',
      'ตะไคร้',
      'ใบมะกรูด',
      'กะทิ',
      'น้ำปลา',
      'มะนาว'
    ],
    cookingTime: '20 นาที',
    difficulty: 'ง่าย',
    priceLevel: 1,
    tags: ['ไทย', 'ซุป', 'ภูมิคุ้มกัน'],
    rating: 4.3,
    reviewCount: 321,
    recipeUrl: 'https://example.com/recipe17'
  }
];

// Combine all foods
export const ALL_FOODS = [...FOOD_ITEMS, ...THAI_FOODS];

// Add more foods to reach 50+ items
for (let i = 9; i <= 30; i++) {
  const categories: FoodItem['category'][] = ['pro', 'highProtein', 'lowEnergy', 'skinHealth', 'brainFood', 'immuneBoost', 'jointHealth'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  const healthCategories: FoodItem['healthCategories'] = [];
  const availableCategories: FoodItem['healthCategories'][0][] = ['energy', 'joints', 'brain', 'skin', 'sleep', 'immune'];
  
  // Randomly assign 1-3 health categories
  const numCategories = Math.floor(Math.random() * 3) + 1;
  for (let j = 0; j < numCategories; j++) {
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    if (!healthCategories.includes(randomCategory)) {
      healthCategories.push(randomCategory);
    }
  }
  
  const thaiDishes = [
    { name: 'Tom Kha Gai', thaiName: 'ต้มข่าไก่' },
    { name: 'Yum Woon Sen', thaiName: 'ยำวุ้นเส้น' },
    { name: 'Pad See Ew', thaiName: 'ผัดซีอิ๊ว' },
    { name: 'Khao Soi', thaiName: 'ข้าวซอย' },
    { name: 'Massaman Curry', thaiName: 'แกงมัสมั่น' },
    { name: 'Larb Moo', thaiName: 'ลาบหมู' },
    { name: 'Gaeng Daeng', thaiName: 'แกงแดง' },
    { name: 'Moo Ping', thaiName: 'หมูปิ้ง' },
    { name: 'Kai Jeow', thaiName: 'ไข่เจียว' },
    { name: 'Pla Kapong Neung Manao', thaiName: 'ปลากะพงนึ่งมะนาว' },
    { name: 'Hoy Lai Pad Cha', thaiName: 'หอยลายผัดฉ่า' },
    { name: 'Pad Pak Bung Fai Daeng', thaiName: 'ผัดผักบุ้งไฟแดง' },
    { name: 'Khao Mun Gai', thaiName: 'ข้าวมันไก่' },
    { name: 'Khao Kha Moo', thaiName: 'ข้าวขาหมู' },
    { name: 'Khao Niew Mamuang', thaiName: 'ข้าวเหนียวมะม่วง' },
    { name: 'Kanom Krok', thaiName: 'ขนมครก' },
    { name: 'Kanom Buang', thaiName: 'ขนมเบื้อง' },
    { name: 'Khanom Tom', thaiName: 'ขนมต้ม' },
    { name: 'Tub Tim Krob', thaiName: 'ทับทิมกรอบ' },
    { name: 'Lod Chong', thaiName: 'ลอดช่อง' }
  ];
  
  const dish = thaiDishes[Math.floor(Math.random() * thaiDishes.length)];
  
  const food: FoodItem = {
    id: `food_thai_${i}`,
    name: dish.name,
    thaiName: dish.thaiName,
    description: `${dish.thaiName} อาหารไทยอร่อยๆ`,
    category,
    healthCategories,
    imageUrl: `/foods/thai-${Math.floor(Math.random() * 10) + 1}.jpg`,
    calories: Math.floor(Math.random() * 500) + 200,
    protein: Math.floor(Math.random() * 30) + 10,
    carbs: Math.floor(Math.random() * 60) + 20,
    fat: Math.floor(Math.random() * 25) + 5,
    fiber: Math.floor(Math.random() * 8) + 1,
    nutrients: [
      { name: 'โปรตีน', amount: `${Math.floor(Math.random() * 30) + 10}g`, benefit: 'สร้างกล้ามเนื้อ' },
      { name: 'ไฟเบอร์', amount: `${Math.floor(Math.random() * 8) + 1}g`, benefit: 'ช่วยระบบขับถ่าย' },
      { name: 'วิตามิน', amount: 'หลากหลาย', benefit: 'เสริมภูมิคุ้มกัน' }
    ],
    benefits: [
      'โปรตีนสูง',
      'ไฟเบอร์ช่วยขับถ่าย',
      'วิตามินหลากหลาย'
    ],
    ingredients: [
      'วัตถุดิบไทย',
      'สมุนไพร',
      'เครื่องเทศ',
      'ผักสด'
    ],
    cookingTime: `${Math.floor(Math.random() * 30) + 10} นาที`,
    difficulty: ['ง่าย', 'ปานกลาง', 'ยาก'][Math.floor(Math.random() * 3)] as 'ง่าย' | 'ปานกลาง' | 'ยาก',
    priceLevel: [1, 2, 3][Math.floor(Math.random() * 3)] as 1 | 2 | 3,
    tags: ['ไทย', 'อร่อย', 'สุขภาพ'],
    rating: 3.5 + Math.random() * 1.5,
    reviewCount: Math.floor(Math.random() * 500) + 100,
    recipeUrl: `https://example.com/recipe${i + 10}`
  };
  
  ALL_FOODS.push(food);
}

// Utility functions
export function getFoodsByCategory(category: string): FoodItem[] {
  return ALL_FOODS.filter(food => food.category === category);
}

export function getFoodsByHealthCategory(healthCategory: string): FoodItem[] {
  return ALL_FOODS.filter(food => food.healthCategories.includes(healthCategory as any));
}

export function getFoodById(id: string): FoodItem | undefined {
  return ALL_FOODS.find(food => food.id === id);
}

export function getTopRatedFoods(limit: number = 10): FoodItem[] {
  return [...ALL_FOODS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getLowCalorieFoods(maxCalories: number = 300): FoodItem[] {
  return ALL_FOODS
    .filter(food => food.calories <= maxCalories)
    .sort((a, b) => a.calories - b.calories);
}

export function getHighProteinFoods(minProtein: number = 20): FoodItem[] {
  return ALL_FOODS
    .filter(food => food.protein >= minProtein)
    .sort((a, b) => b.protein - a.protein);
}

export function getThaiFoods(): FoodItem[] {
  return ALL_FOODS.filter(food => food.tags.includes('ไทย'));
}

export function searchFoods(query: string): FoodItem[] {
  const lowerQuery = query.toLowerCase();
  return ALL_FOODS.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.thaiName.toLowerCase().includes(lowerQuery) ||
    food.description.toLowerCase().includes(lowerQuery) ||
    food.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}