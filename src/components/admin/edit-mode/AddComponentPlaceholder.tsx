'use client'

import React, { useState } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PlusIcon } from '@heroicons/react/24/outline'
import { PAGE_COMPONENTS } from '@/components/page'
import { ComponentPreviewModal } from './ComponentPreviewModal'

export const AddComponentPlaceholder: React.FC = () => {
  const { isEditMode, addComponent } = useInlineEdit()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleComponentSelect = (componentKey: string) => {
    const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
    const props = componentDef?.defaultProps || {}
    addComponent(componentKey, props)
  }

  // Only show placeholder in edit mode
  if (!isEditMode) {
    return null
  }

  return (
    <>
      <div className="mx-auto px-4 max-w-screen-xl">
        {/* Placeholder for adding new component */}
        <div className="border border-dashed border-gray-300 rounded-md p-8 my-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <button
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-full cursor-pointer py-2"
            onClick={(e) => {
              e.preventDefault()
              setIsModalOpen(true)
            }}
          >
            <PlusIcon className="w-6 h-6" />
            <span className="text-base font-medium">Add component or element</span>
          </button>
        </div>
      </div>

      {/* Component Preview Modal */}
      <ComponentPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectComponent={handleComponentSelect}
      />
    </>
  )
}

