'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/admin/login' 
}: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push(redirectTo)
      return
    }

    if (requireAdmin && !isAdmin) {
      router.push('/unauthorized')
      return
    }
  }, [user, isAdmin, loading, router, redirectTo, requireAdmin])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Don't render children if not authenticated or not admin (when required)
  if (!user || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
