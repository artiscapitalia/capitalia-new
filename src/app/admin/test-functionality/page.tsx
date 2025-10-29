'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/lib/auth/AuthContext'

export default function TestFunctionalityPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const { user, isAdmin } = useAuth()

  const runTests = async () => {
    setLoading(true)
    const results: Record<string, any> = {}

    try {
      // Test 1: Authentication status
      console.log('Testing authentication...')
      results.authentication = {
        success: !!user,
        data: user ? `User: ${user.email}` : 'No user',
        error: user ? null : 'Not authenticated'
      }

      // Test 2: Admin status
      console.log('Testing admin permissions...')
      results.adminPermissions = {
        success: isAdmin,
        data: isAdmin ? 'Admin access granted' : 'Regular user',
        error: isAdmin ? null : 'Not an admin user'
      }

      // Test 3: Auth API endpoint (if exists)
      console.log('Testing debug auth endpoint...')
      try {
        const response = await fetch('/api/debug-auth')
        const data = await response.json()
        results.authAPI = {
          success: response.ok,
          data: data.isAdmin ? 'Admin API access confirmed' : 'API accessible but not admin',
          error: response.ok ? null : 'API endpoint failed'
        }
      } catch (error) {
        results.authAPI = {
          success: false,
          data: null,
          error: 'Debug auth endpoint not available'
        }
      }

      // Test 4: Supabase client connection
      console.log('Testing Supabase connection...')
      try {
        const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs')
        const supabase = createClientComponentClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        results.supabaseConnection = {
          success: !error,
          data: session ? 'Supabase connected with session' : 'Supabase connected (no session)',
          error: error?.message || null
        }
      } catch (error) {
        results.supabaseConnection = {
          success: false,
          data: null,
          error: 'Supabase client connection failed'
        }
      }

    } catch (error) {
      results.generalError = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    setTestResults(results)
    setLoading(false)
  }

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌'
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout title="Test Functionality" subtitle="Test authentication and basic functionality">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Test</h3>
            <p className="text-sm text-gray-600 mb-4">
              This page tests authentication functionality and basic system components. 
              Database functionality has been removed.
            </p>
            
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Running Tests...' : 'Run Authentication Tests'}
            </button>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">User Status</h4>
                <p className="text-sm text-gray-600">
                  {user ? `Logged in as: ${user.email}` : 'Not logged in'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Admin Status</h4>
                <p className="text-sm text-gray-600">
                  {isAdmin ? 'Admin privileges active' : 'No admin privileges'}
                </p>
              </div>
            </div>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results</h3>
              <div className="space-y-3">
                {Object.entries(testResults).map(([testName, result]) => (
                  <div key={testName} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {getStatusIcon(result.success)}
                      </span>
                      <span className="font-medium capitalize">
                        {testName.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="text-right">
                      {result.success ? (
                        <span className="text-green-600 text-sm">
                          {result.data ? `${result.data}` : 'Success'}
                        </span>
                      ) : (
                        <span className="text-red-600 text-sm">
                          {result.error || 'Failed'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}