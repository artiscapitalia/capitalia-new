'use client'

import React from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAlert } from '@/contexts/AlertContext'

export const EditModeToggle: React.FC = () => {
    const { isEditMode, toggleEditMode, saveTemplate } = useInlineEdit()
    const { showAlert } = useAlert()

    const handleSave = async () => {
        try {
            await saveTemplate()
            showAlert({ type: 'success', message: 'Template saved successfully!', position: 'top' })    
        } catch {
            showAlert({ type: 'error', message: 'Failed to save template', position: 'top' })
        }
    }

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-sm">
            {isEditMode && (
                <div className="bg-black hover:bg-gray-800 rounded-full px-4 py-2 flex items-center justify-center gap-2">
                    <button
                        onClick={handleSave}
                        className="text-white p-3 rounded-full transition-colors hover:bg-gray-700"
                        title="Save changes"
                    >
                        <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleEditMode}
                        className="text-white p-3 rounded-full transition-colors hover:bg-gray-700"
                        title="Cancel editing"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {!isEditMode && (
                <button
                    onClick={toggleEditMode}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-full transition-colors flex items-center gap-3"
                    title="Enable edit mode"
                >
                    <PencilIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Edit page</span>
                </button>
            )}

            {isEditMode && (
                <div className="bg-gray-100 rounded-full py-2 px-4 text-xs text-gray-700 text-center">
                    Click on any text to edit it.
                </div>
            )}
        </div>
    )
}

