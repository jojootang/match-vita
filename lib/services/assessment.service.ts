import { supabase } from '@/lib/supabase/client'
import { questions } from '@/lib/constants/questions'
import { ALL_VITAMINS, getVitaminsByCategoryAndLevel } from '@/lib/constants/vitamins'

export interface AssessmentData {
  userId: string
  answers: Array<{
    questionId: string
    answerValue: number
    category: string
  }>
}

export interface AssessmentResult {
  totalScore: number
  categoryScores: Record<string, {
    score: number
    level: number
    recommendations: any[]
  }>
}

export class AssessmentService {
  // บันทึก assessment และคำนวณผล
  static async saveAssessment(data: AssessmentData) {
    try {
      // 1. คำนวณคะแนนรวม
      const totalScore = this.calculateTotalScore(data.answers)
      const categoryScores = this.calculateCategoryScores(data.answers)
      
      // 2. บันทึก assessment หลัก
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert([
          {
            user_id: data.userId,
            total_score: totalScore,
            result_level: this.calculateOverallLevel(totalScore)
          }
        ])
        .select()
        .single()

      if (assessmentError) throw assessmentError

      // 3. บันทึกคำตอบแต่ละข้อ
      const answerRecords = data.answers.map(answer => ({
        assessment_id: assessment.id,
        question_id: answer.questionId,
        answer_value: answer.answerValue,
        category: answer.category
      }))

      const { error: answersError } = await supabase
        .from('assessment_answers')
        .insert(answerRecords)

      if (answersError) throw answersError

      // 4. บันทึกผลรายหมวด
      const resultRecords = Object.entries(categoryScores).map(([category, scores]) => ({
        assessment_id: assessment.id,
        category,
        score: scores.score,
        level: scores.level
      }))

      const { error: resultsError } = await supabase
        .from('assessment_results')
        .insert(resultRecords)

      if (resultsError) throw resultsError

      // 5. บันทึก user_scores สำหรับประวัติ
      const scoreRecords = Object.entries(categoryScores).map(([category, scores]) => ({
        user_id: data.userId,
        category,
        score: scores.score,
        level: scores.level
      }))

      await supabase
        .from('user_scores')
        .insert(scoreRecords)
        .onConflict('(user_id, category, created_at)')
        .ignore()

      // 6. Generate และบันทึกคำแนะนำ
      const recommendations = this.generateRecommendations(categoryScores)
      await this.saveUserRecommendations(data.userId, recommendations)

      return {
        success: true,
        assessmentId: assessment.id,
        totalScore,
        categoryScores,
        recommendations
      }

    } catch (error) {
      console.error('Assessment save error:', error)
      throw error
    }
  }

  // คำนวณคะแนนรวม
  private static calculateTotalScore(answers: Array<{ answerValue: number }>): number {
    const total = answers.reduce((sum, answer) => sum + answer.answerValue, 0)
    const maxPossible = answers.length * 5
    return Math.round((total / maxPossible) * 100)
  }

  // คำนวณคะแนนรายหมวด
  private static calculateCategoryScores(answers: Array<{ category: string; answerValue: number }>) {
    const categories = ['energy', 'joint', 'brain', 'skin', 'sleep', 'immune']
    const scores: Record<string, { score: number; level: number }> = {}

    categories.forEach(category => {
      const categoryAnswers = answers.filter(a => a.category === category)
      if (categoryAnswers.length > 0) {
        const total = categoryAnswers.reduce((sum, a) => sum + a.answerValue, 0)
        const maxPossible = categoryAnswers.length * 5
        const score = Math.round((total / maxPossible) * 100)
        const level = this.scoreToLevel(score)
        scores[category] = { score, level }
      }
    })

    return scores
  }

  // แปลงคะแนนเป็นระดับ (1-4)
  private static scoreToLevel(score: number): number {
    if (score >= 76) return 1 // ดีมาก
    if (score >= 51) return 2 // ดี
    if (score >= 26) return 3 // ปานกลาง
    return 4 // ต้องปรับปรุง
  }

  // คำนวณระดับรวม
  private static calculateOverallLevel(totalScore: number): number {
    return this.scoreToLevel(totalScore)
  }

  // สร้างคำแนะนำจากคะแนน
  private static generateRecommendations(categoryScores: Record<string, { score: number; level: number }>) {
    const recommendations: Array<{
      category: string
      level: number
      vitamins: any[]
      advice: string
    }> = []

    Object.entries(categoryScores).forEach(([category, scores]) => {
      const vitamins = getVitaminsByCategoryAndLevel(category, scores.level)
      const advice = this.getAdviceForLevel(category, scores.level)
      
      recommendations.push({
        category,
        level: scores.level,
        vitamins: vitamins.slice(0, 3), // แนะนำ 3 อันดับแรก
        advice
      })
    })

    return recommendations
  }

  // คำแนะนำตามระดับ
  private static getAdviceForLevel(category: string, level: number): string {
    const adviceMap: Record<string, Record<number, string>> = {
      energy: {
        1: 'พลังงานดีเยี่ยม! รักษาสุขภาพด้วยการออกกำลังกายสม่ำเสมอ',
        2: 'พลังงานอยู่ในระดับดี พยายามนอนหลับให้เพียงพอ',
        3: 'พลังงานเริ่มลดลง ลองเพิ่มโปรตีนและวิตามินบี',
        4: 'เหนื่อยง่าย ควรปรึกษาแพทย์และเสริมวิตามินเร่งด่วน'
      },
      // ... advice สำหรับ categories อื่นๆ
    }

    return adviceMap[category]?.[level] || 'ดูแลสุขภาพอย่างต่อเนื่อง'
  }

  // บันทึกคำแนะนำให้ผู้ใช้
  private static async saveUserRecommendations(userId: string, recommendations: any[]) {
    const recommendationRecords = recommendations.flatMap(rec => 
      rec.vitamins.map((vitamin: any) => ({
        user_id: userId,
        recommendation_id: vitamin.recommendationId,
        category: rec.category,
        level: rec.level
      }))
    )

    await supabase
      .from('user_recommendations')
      .insert(recommendationRecords)
      .onConflict('(user_id, recommendation_id)')
      .ignore()
  }

  // ดึงประวัติ assessment ของผู้ใช้
  static async getUserAssessmentHistory(userId: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_results (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // ดึงคะแนนล่าสุดของผู้ใช้
  static async getUserLatestScores(userId: string) {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(6) // 6 หมวด

    if (error) throw error
    
    // จัดกลุ่มเป็นหมวด
    const scores: Record<string, any> = {}
    data?.forEach(score => {
      scores[score.category] = score
    })

    return scores
  }
}