'use client'

import React, { useState, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { InlineEditContext } from '@/lib/admin/InlineEditContext'
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAlert } from '@/contexts/AlertContext'

interface CreatePageButtonProps {
    templatePath: string
}

export const CreatePageButton: React.FC<CreatePageButtonProps> = ({ templatePath }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const isCreateMode = searchParams.get('create') === 'true'

    // Get inline edit context if we're in create mode (within InlineEditProvider)
    // Use useContext directly to avoid conditional hook call
    const inlineEditContext = useContext(InlineEditContext)

    const { showAlert } = useAlert()
    const [isSaving, setIsSaving] = useState(false)

    const handleCreatePage = () => {
        // Navigate to create mode
        router.push(`?create=true`)
    }

    const handleCancel = () => {
        // Exit create mode - remove create query param
        const url = new URL(window.location.href)
        url.searchParams.delete('create')
        router.push(url.pathname)
    }

    const handleSave = async () => {
        if (!inlineEditContext) {
            return
        }

        setIsSaving(true)
        
        try {
            // Create the template file
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

            // Remove create query param and reload page to show the newly created template
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

    // If in create mode and within InlineEditProvider, show Save/Cancel buttons
    if (isCreateMode && inlineEditContext) {
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

    // If in create mode but without context, don't render (CreatePageView will render it with context)
    if (isCreateMode && !inlineEditContext) {
        return null
    }

    // Show Create page button
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

