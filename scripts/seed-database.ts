import { supabaseServer } from '@/lib/supabase/server'
import { questions, categories } from '@/lib/constants/questions'
import { vitamins } from '@/lib/constants/vitamins'
import { foods } from '@/lib/constants/foods'

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // 1. Seed categories
    console.log('📊 Seeding categories...')
    for (const category of categories) {
      const { error } = await supabaseServer
        .from('categories')
        .upsert({
          id: category.id,
          name_th: category.name,
          name_en: category.id,
          description: category.description,
          icon: category.icon
        })
      
      if (error) console.error(`Error seeding category ${category.id}:`, error)
    }
    
    // 2. Seed questions
    console.log('📝 Seeding questions...')
    for (const question of questions) {
      const { error } = await supabaseServer
        .from('questions')
        .upsert({
          id: question.id,
          category_id: question.categoryId,
          q_order: question.order,
          question_text: question.text
        })
      
      if (error) console.error(`Error seeding question ${question.id}:`, error)
      
      // Seed options for each question
      for (const option of question.options) {
        const { error: optionError } = await supabaseServer
          .from('options')
          .upsert({
            id: option.id,
            question_id: question.id,
            option_order: option.order,
            option_text: option.text,
            score: option.score
          })
        
        if (optionError) console.error(`Error seeding option ${option.id}:`, optionError)
      }
    }
    
    // 3. Seed vitamins and recommendations
    console.log('💊 Seeding vitamins...')
    for (const vitamin of vitamins) {
      // First, seed recommendation
      const { data: rec, error: recError } = await supabaseServer
        .from('recommendations')
        .upsert({
          id: vitamin.recommendationId,
          category: vitamin.category,
          level: vitamin.level,
          rec_order: vitamin.order,
          title: vitamin.name,
          short_text: vitamin.shortDesc,
          description: vitamin.description
        })
        .select()
        .single()
      
      if (recError) console.error(`Error seeding recommendation ${vitamin.recommendationId}:`, recError)
      
      if (rec) {
        // Then seed recommendation items
        const { error: itemError } = await supabaseServer
          .from('recommendation_items')
          .upsert({
            recommendation_id: rec.id,
            supplement_name: vitamin.name,
            benefit: vitamin.benefit,
            dosage: vitamin.dosage,
            aff_url: vitamin.affiliateLink,
            store: vitamin.store,
            price_range: vitamin.priceRange
          })
        
        if (itemError) console.error(`Error seeding vitamin item ${vitamin.name}:`, itemError)
      }
    }
    
    // 4. Seed foods
    console.log('🍽️ Seeding foods...')
    for (const food of foods) {
      // First, seed food item
      const { data: foodItem, error: foodError } = await supabaseServer
        .from('food_items')
        .upsert({
          name: food.name,
          image_url: food.imageUrl,
          category: food.category,
          bullet_1: food.bullets[0],
          bullet_2: food.bullets[1],
          bullet_3: food.bullets[2],
          description: food.description,
          cooking_time: food.cookingTime,
          difficulty: food.difficulty
        })
        .select()
        .single()
      
      if (foodError) console.error(`Error seeding food ${food.name}:`, foodError)
      
      if (foodItem) {
        // Seed nutrients
        if (food.nutrients) {
          const { error: nutrientError } = await supabaseServer
            .from('food_nutrients')
            .upsert({
              food_id: foodItem.id,
              calories: food.nutrients.calories,
              protein: food.nutrients.protein,
              fat: food.nutrients.fat,
              carbs: food.nutrients.carbs,
              fiber: food.nutrients.fiber
            })
          
          if (nutrientError) console.error(`Error seeding nutrients for ${food.name}:`, nutrientError)
        }
        
        // Seed food mappings
        for (const category of food.healthCategories) {
          const { error: mappingError } = await supabaseServer
            .from('food_mappings')
            .upsert({
              food_id: foodItem.id,
              category: category,
              priority: 1
            })
          
          if (mappingError) console.error(`Error seeding mapping for ${food.name}:`, mappingError)
        }
      }
    }
    
    console.log('✅ Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

// Run the seeding
seedDatabase()