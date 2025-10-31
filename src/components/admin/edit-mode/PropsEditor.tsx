'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PAGE_COMPONENTS, PAGE_ELEMENTS, PropDefinition } from '@/components/page'
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface PropsEditorProps {
  componentId: string
  componentKey: string
  isOpen: boolean
  onClose: () => void
  elementId?: string // Optional elementId for elements within components
}

interface CustomDropdownProps {
  value: string | number | boolean
  options: Array<{ value: string | number | boolean; label: string }>
  onChange: (value: string | number | boolean) => void
}

/**
 * Custom dropdown component with visual styling
 */
const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find(opt => String(opt.value) === String(value))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (selectedValue: string | number | boolean) => {
    onChange(selectedValue)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border bg-white text-left focus:outline-none hover:border-gray-400 transition-colors flex items-center justify-between ${
          isOpen
            ? 'border-blue-500 rounded-t-md border-b-0'
            : 'border-gray-300 rounded-md'
        }`}
      >
        <span className="text-gray-900">{selectedOption?.label || ''}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full bg-white border border-blue-500 rounded-b-md border-t-0 shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => {
              const isSelected = String(option.value) === String(value)
              const isLast = index === options.length - 1
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-900 hover:bg-gray-50'
                  } ${!isLast ? 'border-b border-gray-200' : ''}`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Props editor component that allows editing component/element props
 * Shows a modal with form fields for each defined prop
 */
export const PropsEditor: React.FC<PropsEditorProps> = ({
  componentId,
  componentKey,
  isOpen,
  onClose,
  elementId,
}) => {
  const { addedComponents, elementProps, updateProps, updateElementProps, getElementProps } = useInlineEdit()
  
  // Get component or element definition
  const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
  const elementDef = PAGE_ELEMENTS[componentKey as keyof typeof PAGE_ELEMENTS]
  const def = componentDef || elementDef
  
  // Check if this is an element within a component (elementId is provided)
  const isElementInComponent = !!elementId
  
  // Get props definitions
  const propsDefinitions: PropDefinition[] = (def && 'props' in def && Array.isArray(def.props)) ? def.props : []
  
  // Find component - this will update when addedComponents changes
  const component = useMemo(() => {
    return addedComponents.find(comp => comp.id === componentId)
  }, [addedComponents, componentId])
  
  // Get current props - either from addedComponents (for components) or from elementProps (for elements in components)
  // Use useMemo to recalculate when addedComponents or elementProps change
  const currentProps = useMemo(() => {
    if (isElementInComponent && elementId) {
      // For elements within components, get props from elementProps
      // Use elementProps directly to ensure updates are detected
      return elementProps[componentId]?.[elementId] || {}
    } else {
      // For added components, get props from addedComponents
      // Find component again directly from addedComponents to ensure we get latest props
      const currentComponent = addedComponents.find(comp => comp.id === componentId)
      const componentProps = currentComponent?.props || {}
      // Convert Record<string, unknown> to Record<string, string | number | boolean>
      return Object.fromEntries(
        Object.entries(componentProps).map(([key, value]) => [
          key,
          typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
            ? value
            : String(value)
        ])
      ) as Record<string, string | number | boolean>
    }
  }, [isElementInComponent, elementId, componentId, addedComponents, elementProps])

  if (!isOpen || !def || propsDefinitions.length === 0) {
    return null
  }

  const handlePropChange = (propName: string, propValue: string | number | boolean) => {
    if (isElementInComponent && elementId) {
      // Update element props for elements within components
      updateElementProps(componentId, elementId, propName, propValue)
    } else {
      // Update component props for added components
      updateProps(componentId, propName, propValue)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-900/20 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg max-w-md w-full my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Edit properties</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-x-visible p-6">
          <div className="space-y-4">
            {propsDefinitions.map((propDef) => {
              const currentValue = (currentProps[propDef.name] ?? propDef.defaultValue ?? '') as string | number | boolean
              
              if (propDef.type === 'select') {
                return (
                  <div key={propDef.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {propDef.label}
                      {propDef.description && (
                        <span className="block text-xs text-gray-500 mt-1 font-normal">
                          {propDef.description}
                        </span>
                      )}
                    </label>
                    <CustomDropdown
                      value={currentValue}
                      options={propDef.values || []}
                      onChange={(value) => handlePropChange(propDef.name, value)}
                    />
                  </div>
                )
              }

              if (propDef.type === 'text') {
                return (
                  <div key={propDef.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {propDef.label}
                      {propDef.description && (
                        <span className="block text-xs text-gray-500 mt-1 font-normal">
                          {propDef.description}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={String(currentValue)}
                      onChange={(e) => handlePropChange(propDef.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )
              }

              if (propDef.type === 'number') {
                return (
                  <div key={propDef.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {propDef.label}
                      {propDef.description && (
                        <span className="block text-xs text-gray-500 mt-1 font-normal">
                          {propDef.description}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      value={Number(currentValue)}
                      onChange={(e) => handlePropChange(propDef.name, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )
              }

              if (propDef.type === 'boolean') {
                return (
                  <div key={propDef.name}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentValue)}
                        onChange={(e) => handlePropChange(propDef.name, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {propDef.label}
                      </span>
                    </label>
                    {propDef.description && (
                      <span className="block text-xs text-gray-500 mt-1 ml-6">
                        {propDef.description}
                      </span>
                    )}
                  </div>
                )
              }

              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

