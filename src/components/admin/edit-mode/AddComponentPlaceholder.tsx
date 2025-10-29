'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { PAGE_COMPONENTS } from '@/components/page'

export const AddComponentPlaceholder: React.FC = () => {
  const { isEditMode, addComponent } = useInlineEdit()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get only editable components
  const editableComponents = Object.entries(PAGE_COMPONENTS).filter(
    ([, component]) => component.editable === true
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleComponentClick = (componentKey: string) => {
    const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
    const props = componentDef?.defaultProps || {}
    addComponent(componentKey, props)
    setIsDropdownOpen(false)
  }

  // Only show placeholder in edit mode
  if (!isEditMode) {
    return null
  }

  return (
    <div className="mx-auto px-4 max-w-screen-xl" ref={dropdownRef}>
      {/* Placeholder for adding new component */}
      <div className="relative">
        <div className="border border-dashed border-gray-300 rounded-md p-8 my-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <button
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-full cursor-pointer py-2"
            onClick={(e) => {
              e.preventDefault()
              setIsDropdownOpen(!isDropdownOpen)
            }}
          >
            <PlusIcon className="w-6 h-6" />
            <span className="text-base font-medium">Add component</span>
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && editableComponents.length > 0 && (
            <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="py-1">
                {editableComponents.map(([key, component]) => (
                  <button
                    key={key}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                    onClick={() => handleComponentClick(key)}
                  >
                    <div className="font-medium text-sm text-gray-900">{component.name}</div>
                    {component.description && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{component.description}</div>
                    )}
                    {component.category && (
                      <div className="text-xs text-gray-400 mt-1 capitalize">{component.category}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isDropdownOpen && editableComponents.length === 0 && (
            <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
              <div className="text-sm text-gray-500 text-center">No editable components available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

