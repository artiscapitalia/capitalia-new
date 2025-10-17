'use client'

import { useState, useEffect } from 'react'
import { Language } from '../../../types/supabase'
import { LanguagesAPI } from '@/lib/api/languages'
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface LanguagesListProps {
  onEdit: (language: Language) => void
  onAdd: () => void
}

export const LanguagesList = ({ onEdit, onAdd }: LanguagesListProps) => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchLanguages = async () => {
    try {
      console.log('fetchLanguages called')
      setLoading(true)
      setError(null)
      const { data, error } = await LanguagesAPI.getAll()
      
      if (error) {
        setError(error.message || 'Failed to fetch languages')
        return
      }
      
      console.log('Languages fetched:', data?.length || 0, 'languages')
      setLanguages(data || [])
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this language?')) {
      return
    }

    try {
      setDeletingId(id)
      const { error } = await LanguagesAPI.delete(id)
      
      if (error) {
        setError(error.message || 'Failed to delete language')
        return
      }
      
      // Refresh the list
      await fetchLanguages()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      setTogglingId(id)
      const { error } = await LanguagesAPI.toggleActive(id)
      
      if (error) {
        setError(error.message || 'Failed to toggle language status')
        return
      }
      
      // Refresh the list
      await fetchLanguages()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-end">
        <button
          onClick={onAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Language
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Languages Table */}
      <div className="bg-white overflow-hidden sm:rounded-md">
        {languages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No languages found</p>
            <button
              onClick={onAdd}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Add your first language
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Native Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sort Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {languages.map((language) => (
                  <tr key={language.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {language.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {language.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {language.native_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(language.id)}
                        disabled={togglingId === language.id}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          language.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        } hover:opacity-75 disabled:opacity-50`}
                      >
                        {togglingId === language.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                        ) : language.is_active ? (
                          <EyeIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <EyeSlashIcon className="h-3 w-3 mr-1" />
                        )}
                        {language.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {language.sort_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEdit(language)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(language.id)}
                        disabled={deletingId === language.id}
                        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                      >
                        {deletingId === language.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
