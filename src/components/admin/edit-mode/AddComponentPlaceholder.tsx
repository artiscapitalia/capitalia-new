'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { PAGE_COMPONENTS } from '@/components/page'

// Dynamic component renderer
const DynamicComponent: React.FC<{ componentKey: string; props?: Record<string, unknown> }> = ({ componentKey, props }) => {
  const [Component, setComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null)

  useEffect(() => {
    const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
    if (componentDef) {
      componentDef.component().then(module => {
        // Handle default export or named export
        // For Intro, it's a named export, for Header it's default
        const moduleExports = module as { default?: React.ComponentType<Record<string, unknown>>; [key: string]: React.ComponentType<Record<string, unknown>> | undefined }
        let ComponentToUse: React.ComponentType<Record<string, unknown>> | undefined
        
        if (moduleExports.default) {
          ComponentToUse = moduleExports.default
        } else {
          // Try to find the component by name in the module
          ComponentToUse = moduleExports[componentDef.name] || moduleExports[componentKey]
        }
        
        if (ComponentToUse) {
          setComponent(() => ComponentToUse)
        } else {
          console.error(`Component ${componentKey} not found in module`)
        }
      }).catch(error => {
        console.error(`Failed to load component ${componentKey}:`, error)
      })
    }
  }, [componentKey])

  if (!Component) {
    return <div className="p-4 text-gray-500">Loading component...</div>
  }

  // Merge default props with provided props
  const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
  const mergedProps = { ...componentDef?.defaultProps, ...props }

  return <Component {...mergedProps} />
}

export const AddComponentPlaceholder: React.FC = () => {
  const { isEditMode, addedComponents, addComponent } = useInlineEdit()
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

  if (!isEditMode) {
    return null
  }

  const handleComponentClick = (componentKey: string) => {
    const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
    const props = componentDef?.defaultProps || {}
    addComponent(componentKey, props)
    setIsDropdownOpen(false)
  }

  // Render added components first
  const hasAddedComponents = addedComponents.length > 0

  return (
    <div className="mx-auto px-4 max-w-screen-xl" ref={dropdownRef}>
      {/* Render added components */}
      {hasAddedComponents && (
        <div className="my-4">
          {addedComponents.map((addedComponent) => (
            <div key={addedComponent.id} className="my-4">
              <DynamicComponent 
                componentKey={addedComponent.componentKey} 
                props={addedComponent.props}
              />
            </div>
          ))}
        </div>
      )}

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

