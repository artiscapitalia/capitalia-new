'use client'

import React, { useState, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { InlineEditContext } from '@/lib/admin/InlineEditContext'
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAlert } from '@/contexts/AlertContext'

interface CreatePageButtonProps {
  templatePath: string
}

// Internal component that uses hooks - only rendered when in InlineEditProvider
const CreatePageButtonWithContext: React.FC<{ templatePath: string }> = ({ templatePath }) => {
  const inlineEditContext = useContext(InlineEditContext)
  const router = useRouter()
  const { showAlert } = useAlert()
  const [isSaving, setIsSaving] = useState(false)

  if (!inlineEditContext) {
    return null
  }

  const handleCancel = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('create')
    router.push(url.pathname)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/templates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templatePath,
          content: inlineEditContext.templateContent,
          addedComponents: inlineEditContext.addedComponents
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to create template'
        throw new Error(errorMessage)
      }

      showAlert({ type: 'success', message: 'Page created successfully!', position: 'top' })
      
      const currentPath = window.location.pathname
      router.replace(currentPath)
      router.refresh()
    } catch (error) {
      showAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to create page', 
        position: 'top' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-sm">
      <div className="bg-black hover:bg-gray-800 rounded-full px-4 py-2 flex items-center justify-center gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-white p-3 rounded-full transition-colors hover:bg-gray-700 disabled:opacity-50"
          title="Save page"
        >
          <CheckIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="text-white p-3 rounded-full transition-colors hover:bg-gray-700 disabled:opacity-50"
          title="Cancel"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="bg-gray-100 rounded-full py-2 px-4 text-xs text-gray-700 text-center">
        {isSaving ? 'Creating page...' : 'Add components and click Save to create the page.'}
      </div>
    </div>
  )
}

// Wrapper that conditionally renders based on context availability
const CreatePageButtonWrapper: React.FC<{ templatePath: string; isCreateMode: boolean }> = ({ templatePath, isCreateMode }) => {
  if (!isCreateMode) {
    return null
  }

  return <CreatePageButtonWithContext templatePath={templatePath} />
}

export const CreatePageButton: React.FC<CreatePageButtonProps> = ({ templatePath }) => {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCreateMode = searchParams.get('create') === 'true'

  // Only show for admin users
  if (!isAdmin) {
    return null
  }

  // If in create mode, try to render with context
  if (isCreateMode) {
    return <CreatePageButtonWrapper templatePath={templatePath} isCreateMode={isCreateMode} />
  }

  // Show Create page button
  const handleCreatePage = () => {
    router.push(`?create=true`)
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-sm">
      <button
        onClick={handleCreatePage}
        className="bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-full transition-colors flex items-center gap-3"
        title="Create page"
      >
        <PlusIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Create page</span>
      </button>
    </div>
  )
}

