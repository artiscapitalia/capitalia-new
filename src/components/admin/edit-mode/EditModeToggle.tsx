'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PencilIcon, CheckIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useAlert } from '@/contexts/AlertContext'
import { PreviewModal } from './PreviewModal'
import { PAGE_COMPONENTS, PAGE_ELEMENTS } from '@/components/page'

interface EditModeToggleProps {
    templatePath?: string
}

export const EditModeToggle: React.FC<EditModeToggleProps> = ({ templatePath }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const isCreateMode = searchParams.get('create') === 'true'
    const { isEditMode, toggleEditMode, saveTemplate, addComponent, templatePath: contextTemplatePath, templateContent, addedComponents } = useInlineEdit()
    const { showAlert } = useAlert()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [hoveredButton, setHoveredButton] = useState<string | null>(null)
    
    // Use prop templatePath if provided, otherwise use from context
    const activeTemplatePath = templatePath || contextTemplatePath

    const handleCancel = () => {
        if (isCreateMode) {
            // Exit create mode - remove create query param
            const url = new URL(window.location.href)
            url.searchParams.delete('create')
            router.push(url.pathname)
        } else {
            // Exit edit mode
            toggleEditMode()
        }
    }

    const handleSave = async () => {
        if (isCreateMode) {
            // Create new template
            if (!activeTemplatePath) {
                showAlert({ type: 'error', message: 'Template path is required', position: 'top' })
                return
            }

            setIsSaving(true)
            
            try {
                const response = await fetch('/api/admin/templates/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        templatePath: activeTemplatePath,
                        content: templateContent,
                        addedComponents: addedComponents
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
        } else {
            // Save existing template
            try {
                await saveTemplate()
                showAlert({ type: 'success', message: 'Template saved successfully!', position: 'top' })
                
                // Exit edit mode after successful save
                toggleEditMode()
                
                // Refresh page to show updated content
                router.refresh()
            } catch (error) {
                showAlert({ 
                    type: 'error', 
                    message: error instanceof Error ? error.message : 'Failed to save template', 
                    position: 'top' 
                })
            }
        }
    }

    const handleComponentSelect = (componentKey: string) => {
        // Check if it's a component or element
        // CRITICAL: Always read defaultProps directly from registry - never modify them
        // Text changes will be stored in templateContent, not in props
        const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
        const elementDef = PAGE_ELEMENTS[componentKey as keyof typeof PAGE_ELEMENTS]
        const def = componentDef || elementDef
        // Create a shallow copy to avoid mutating the original defaultProps
        const props = def?.defaultProps ? { ...def.defaultProps } : {}
        addComponent(componentKey, props)
    }

    // Show toolbar when in edit mode or create mode
    const shouldShowToolbar = isEditMode || isCreateMode
    
    // Check if there are no components added
    const hasNoComponents = addedComponents.length === 0

    return (
        <>
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-sm">
                {shouldShowToolbar && (
                    <div className="bg-black hover:bg-gray-800 rounded-full px-2 py-2 flex items-center justify-center gap-2 relative">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={isSaving}
                            className="relative text-white px-4 py-2 rounded-full transition-colors hover:bg-gray-700 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                            onMouseEnter={() => setHoveredButton('add')}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Add</span>
                            <span 
                                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[20px] px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap transition-opacity pointer-events-none z-[60] ${hasNoComponents && hoveredButton === null ? 'opacity-100' : hoveredButton === 'add' ? 'opacity-100' : 'opacity-0'}`}
                            >
                                Add component or element
                                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                            </span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="relative text-white p-3 rounded-full transition-colors hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                            onMouseEnter={() => setHoveredButton('save')}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            <CheckIcon className="w-5 h-5" />
                            <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[16px] px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap transition-opacity pointer-events-none z-[60] ${hoveredButton === 'save' ? 'opacity-100' : 'opacity-0'}`}>
                                {isCreateMode ? 'Save page' : 'Save changes'}
                                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                            </span>
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="relative text-white p-3 rounded-full transition-colors hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                            onMouseEnter={() => setHoveredButton('cancel')}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            <XMarkIcon className="w-5 h-5" />
                            <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[16px] px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap transition-opacity pointer-events-none z-[60] ${hoveredButton === 'cancel' ? 'opacity-100' : 'opacity-0'}`}>
                                {isCreateMode ? 'Cancel' : 'Cancel editing'}
                                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                            </span>
                        </button>
                    </div>
                )}

                {!shouldShowToolbar && (
                    <button
                        onClick={toggleEditMode}
                        className="bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-full transition-colors flex items-center gap-3 cursor-pointer"
                        title="Enable edit mode"
                    >
                        <PencilIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Edit page</span>
                    </button>
                )}

                {shouldShowToolbar && (
                    <div className="bg-gray-100 rounded-full py-2 px-4 text-xs text-gray-700 text-center">
                        {isSaving 
                            ? (isCreateMode ? 'Creating page...' : 'Saving...')
                            : (isCreateMode 
                                ? 'Add components and click Save to create the page.' 
                                : 'Click on any text to edit it.')
                        }
                    </div>
                )}
            </div>

            {/* Component Preview Modal */}
            <PreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectComponent={handleComponentSelect}
            />
        </>
    )
}

