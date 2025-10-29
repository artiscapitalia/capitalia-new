'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { useAuth } from '@/lib/auth/AuthContext'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { AdminLayoutProps } from './types'

export const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top header */}
        <div className="sticky top-[-1px] z-10 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-[63px]">
              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Page title */}
              <div className="flex-1 lg:flex-none">
                <div>
                  <h1 className="text-gray-900">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                  )}
                </div>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                      Welcome, <span className="font-medium">{user?.email}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
