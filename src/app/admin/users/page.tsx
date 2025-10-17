'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { UserGroupIcon } from '@heroicons/react/24/outline'

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout title="Users" subtitle="Manage user accounts">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Users Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              This section will allow you to manage user accounts, roles, and permissions.
            </p>
            <div className="mt-6">
              <div className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
