'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { 
  LanguageIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const dashboardItems = [
    {
      name: 'Languages',
      description: 'Manage application languages',
      href: '/admin/languages',
      icon: LanguageIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Users',
      description: 'Manage user accounts',
      href: '/admin/users',
      icon: UserGroupIcon,
      color: 'bg-indigo-500'
    },
    {
      name: 'Analytics',
      description: 'View system analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Settings',
      description: 'System configuration',
      href: '/admin/settings',
      icon: CogIcon,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout title="Dashboard" subtitle="Admin panel overview">
        <div className="space-y-6">
          {/* Welcome section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to the Admin Dashboard
            </h2>
            <p className="text-gray-600">
              Manage your application from the navigation sidebar or use the quick access cards below.
            </p>
          </div>

          {/* Quick access cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {dashboardItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <LanguageIcon className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Languages
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        -
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        -
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Sessions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        -
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CogIcon className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        System Status
                      </dt>
                      <dd className="text-lg font-medium text-green-600">
                        Online
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
