'use client'

import { useState, useEffect } from 'react'
import { Language, LanguageInsert, LanguageUpdate } from '../../../types/supabase'
import { LanguagesAPI } from '@/lib/api/languages'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface LanguageFormProps {
  language?: Language | null
  onClose: () => void
  onSuccess: () => void
}

export const LanguageForm = ({ language, onClose, onSuccess }: LanguageFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    native_name: '',
    is_active: true,
    sort_order: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (language) {
      setFormData({
        name: language.name,
        code: language.code,
        native_name: language.native_name || '',
        is_active: language.is_active,
        sort_order: language.sort_order
      })
    }
  }, [language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result
      
      if (language) {
        // Update existing language
        const updates: LanguageUpdate = {
          name: formData.name,
          code: formData.code,
          native_name: formData.native_name || null,
          is_active: formData.is_active,
          sort_order: formData.sort_order
        }
        result = await LanguagesAPI.update(language.id, updates)
      } else {
        // Create new language
        const newLanguage: LanguageInsert = {
          name: formData.name,
          code: formData.code,
          native_name: formData.native_name || null,
          is_active: formData.is_active,
          sort_order: formData.sort_order
        }
        result = await LanguagesAPI.create(newLanguage)
      }

      if (result.error) {
        setError(result.error.message || 'Failed to save language')
        return
      }

      console.log('Language saved successfully, calling onSuccess...')
      onSuccess()
      console.log('onSuccess called, closing form...')
      onClose()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {language ? 'Edit Language' : 'Add New Language'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Language Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Language Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., English, Spanish, French"
            />
          </div>

          {/* Language Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Language Code *
            </label>
            <input
              type="text"
              id="code"
              required
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toLowerCase())}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., en, es, fr"
              maxLength={10}
            />
            <p className="mt-1 text-xs text-gray-500">
              ISO language code (2-10 characters, lowercase)
            </p>
          </div>

          {/* Native Name */}
          <div>
            <label htmlFor="native_name" className="block text-sm font-medium text-gray-700">
              Native Name
            </label>
            <input
              type="text"
              id="native_name"
              value={formData.native_name}
              onChange={(e) => handleChange('native_name', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Español, Français, Deutsch"
            />
            <p className="mt-1 text-xs text-gray-500">
              How the language is written in its native script
            </p>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <input
              type="number"
              id="sort_order"
              value={formData.sort_order}
              onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first in lists
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active (language is available for selection)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md  text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md  text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (language ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
