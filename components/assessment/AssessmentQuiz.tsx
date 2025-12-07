'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { questions } from '@/lib/constants/questions'
import { AssessmentService } from '@/lib/services/assessment.service'

interface Answer {
  questionId: string
  answerValue: number
  category: string
}

export default function AssessmentQuiz() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user?.id || null)
  }

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (value: number) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answerValue: value,
      category: currentQuestion.categoryId
    }

    // อัปเดตหรือเพิ่มคำตอบ
    const existingIndex = answers.findIndex(a => a.questionId === currentQuestion.id)
    const newAnswers = [...answers]
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = newAnswer
    } else {
      newAnswers.push(newAnswer)
    }

    setAnswers(newAnswers)

    // ไปข้อต่อไปถ้ายังไม่จบ
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // ถ้าจบแล้วให้ส่งคำตอบ
      handleSubmit(newAnswers)
    }
  }

  const handleSubmit = async (finalAnswers: Answer[]) => {
    if (!userId) {
      alert('กรุณาเข้าสู่ระบบก่อนทำแบบประเมิน')
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      const result = await AssessmentService.saveAssessment({
        userId,
        answers: finalAnswers
      })

      // Redirect ไปหน้า results
      router.push(`/assessment/results?assessmentId=${result.assessmentId}`)

    } catch (error) {
      console.error('Error saving assessment:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกผล กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>คำถามที่ {currentQuestionIndex + 1} จาก {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
            {currentQuestion.order}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentQuestion.text}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswerSelect(option.score)}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                answers.find(a => a.questionId === currentQuestion.id && a.answerValue === option.score)
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300'
              }`}>
                {answers.find(a => a.questionId === currentQuestion.id && a.answerValue === option.score) && '✓'}
              </div>
              <span className="text-gray-700">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ย้อนกลับ
        </button>

        <div className="text-sm text-gray-600">
          {answers.filter(a => a.questionId === currentQuestion.id).length > 0 ? '✓ ตอบแล้ว' : 'ยังไม่ได้ตอบ'}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p>กำลังบันทึกผล...</p>
          </div>
        </div>
      )}
    </div>
  )
}