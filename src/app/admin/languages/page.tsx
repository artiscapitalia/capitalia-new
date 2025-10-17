'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { LanguagesList } from '@/components/admin/LanguagesList'
import { LanguageForm } from '@/components/admin/LanguageForm'
import { Language } from '../../../../types/supabase'

export default function AdminLanguagesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEdit = (language: Language) => {
    setEditingLanguage(language)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingLanguage(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingLanguage(null)
  }

  const handleFormSuccess = () => {
    // Refresh the languages list after successful add/edit
    console.log('Form success called, refreshing list...')
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout title="Languages" subtitle="Manage application languages">
        <LanguagesList 
          key={refreshTrigger}
          onEdit={handleEdit}
          onAdd={handleAdd}
        />

        {/* Language Form Modal */}
        {showForm && (
          <LanguageForm
            language={editingLanguage}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}
