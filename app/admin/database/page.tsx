'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function DatabaseAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const runSQL = async (sql: string) => {
    setLoading(true)
    try {
      // หมายเหตุ: ใน Supabase เราต้องใช้ REST API หรือ Edge Functions
      // สำหรับการ run SQL ตรงๆ ควรใช้ dashboard
      setMessage('Please run SQL directly in Supabase SQL Editor')
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  const seedData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST'
      })
      
      if (response.ok) {
        setMessage('Database seeded successfully!')
      } else {
        setMessage('Error seeding database')
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  const checkTables = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .single()
      
      if (error) {
        setMessage(`Database not ready: ${error.message}`)
      } else {
        setMessage('Database is connected and ready!')
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Database Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Database Status</h2>
          <p className="text-sm text-gray-600 mb-4">Check if database is connected</p>
          <button
            onClick={checkTables}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Check Connection
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Seed Data</h2>
          <p className="text-sm text-gray-600 mb-4">Insert initial data</p>
          <button
            onClick={seedData}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Seed Database
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Reset Database</h2>
          <p className="text-sm text-gray-600 mb-4">Warning: This will delete all data</p>
          <button
            onClick={() => runSQL('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            Reset Database
          </button>
        </div>
      </div>
      
      {message && (
        <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">SQL Query</h2>
        <textarea
          className="w-full h-40 p-3 border rounded mb-4 font-mono text-sm"
          placeholder="Enter SQL query here..."
          defaultValue="SELECT * FROM users LIMIT 10;"
        />
        <button
          onClick={() => setMessage('Use Supabase SQL Editor for running queries')}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Execute Query
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Tables Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'users', 'assessments', 'assessment_answers', 'assessment_results',
            'questions', 'options', 'recommendations', 'recommendation_items',
            'food_items', 'food_nutrients', 'food_mappings', 'user_food_history',
            'user_plan_items', 'logs_daily_health', 'ai_logs', 'subscriptions'
          ].map(table => (
            <div key={table} className="p-3 bg-gray-50 rounded">
              <div className="font-medium">{table}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}