import { supabase } from './client'

// User functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  
  if (error) throw error
  
  // สร้าง user profile
  if (data.user) {
    await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName
        }
      ])
  }
  
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Assessment functions
export async function saveAssessment(userId: string, answers: any[], totalScore: number) {
  // สร้าง assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .insert([
      {
        user_id: userId,
        total_score: totalScore,
        result_level: Math.ceil(totalScore / 6) // แปลงเป็นระดับ 1-4
      }
    ])
    .select()
    .single()
  
  if (assessmentError) throw assessmentError
  
  // บันทึกคำตอบแต่ละข้อ
  const answerRecords = answers.map(answer => ({
    assessment_id: assessment.id,
    question_id: answer.questionId,
    answer_value: answer.answerValue,
    category: answer.category
  }))
  
  const { error: answersError } = await supabase
    .from('assessment_answers')
    .insert(answerRecords)
  
  if (answersError) throw answersError
  
  // คำนวณคะแนนรายหมวด
  const categoryScores = calculateCategoryScores(answers)
  
  // บันทึกผลรายหมวด
  const resultRecords = Object.entries(categoryScores).map(([category, score]) => {
    const level = Math.ceil(score / 25) // แปลงเป็นระดับ 1-4
    return {
      assessment_id: assessment.id,
      category,
      score,
      level
    }
  })
  
  const { error: resultsError } = await supabase
    .from('assessment_results')
    .insert(resultRecords)
  
  if (resultsError) throw resultsError
  
  return assessment
}

function calculateCategoryScores(answers: any[]) {
  const categories = ['energy', 'joint', 'brain', 'skin', 'sleep', 'immune']
  const scores: Record<string, number> = {}
  
  categories.forEach(category => {
    const categoryAnswers = answers.filter(a => a.category === category)
    if (categoryAnswers.length > 0) {
      const total = categoryAnswers.reduce((sum, a) => sum + a.answerValue, 0)
      const maxPossible = categoryAnswers.length * 4
      scores[category] = Math.round((total / maxPossible) * 100)
    } else {
      scores[category] = 0
    }
  })
  
  return scores
}

// Vitamin functions
export async function getRecommendations(category: string, level: number) {
  const { data, error } = await supabase
    .from('recommendations')
    .select(`
      *,
      recommendation_items (*)
    `)
    .eq('category', category)
    .eq('level', level)
    .order('rec_order')
  
  if (error) throw error
  return data
}

// Food functions
export async function getRecommendedFoods(categories: string[], limit = 4) {
  const { data, error } = await supabase
    .from('food_mappings')
    .select(`
      *,
      food_items (
        *,
        food_nutrients (*)
      )
    `)
    .in('category', categories)
    .order('priority')
    .limit(limit)
  
  if (error) throw error
  return data?.map(item => item.food_items) || []
}

// Plan functions
export async function saveUserPlan(userId: string, planItems: any[]) {
  const { data, error } = await supabase
    .from('user_plan_items')
    .insert(
      planItems.map(item => ({
        user_id: userId,
        supplement_name: item.supplementName,
        category: item.category,
        time_slot: item.timeSlot
      }))
    )
  
  if (error) throw error
  return data
}

// History functions
export async function getHealthHistory(userId: string, days = 7) {
  const { data, error } = await supabase
    .from('assessment_results')
    .select(`
      *,
      assessments!inner (
        created_at
      )
    `)
    .eq('assessments.user_id', userId)
    .order('assessments.created_at', { ascending: false })
    .limit(days * 6) // 6 หมวดต่อวัน
  
  if (error) throw error
  return data
}