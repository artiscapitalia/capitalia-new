'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'

export default function AuthTestPage() {
  const { user, session, loading, isAdmin } = useAuth()
  const [apiTest, setApiTest] = useState<any>(null)
  const [loadingApi, setLoadingApi] = useState(false)

  const testApi = async () => {
    setLoadingApi(true)
    try {
      const response = await fetch('/api/admin/pages')
      const data = await response.json()
      setApiTest({ status: response.status, data })
    } catch (error) {
      setApiTest({ error: error.message })
    } finally {
      setLoadingApi(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Auth Context</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({
              user: user ? {
                id: user.id,
                email: user.email,
                created_at: user.created_at
              } : null,
              session: session ? {
                access_token: session.access_token ? 'present' : 'missing',
                refresh_token: session.refresh_token ? 'present' : 'missing',
                expires_at: session.expires_at
              } : null,
              isAdmin,
              loading
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Environment Variables</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({
              NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
              hasAdminEmail: !!process.env.NEXT_PUBLIC_ADMIN_EMAIL
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">API Test</h2>
          <button
            onClick={testApi}
            disabled={loadingApi}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingApi ? 'Testing...' : 'Test /api/admin/pages'}
          </button>
          
          {apiTest && (
            <pre className="bg-gray-100 p-4 rounded mt-2">
              {JSON.stringify(apiTest, null, 2)}
            </pre>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Debugging Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Check if user is logged in (user should not be null)</li>
            <li>Check if user email matches ADMIN_EMAIL</li>
            <li>Check if session is valid (access_token should be present)</li>
            <li>Check if API call returns 401 or 200</li>
            <li>Check server logs for authentication details</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
