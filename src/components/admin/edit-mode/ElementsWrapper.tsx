'use client'

import React, { useState } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PAGE_ELEMENTS, PAGE_COMPONENTS } from '@/components/page'
import { PropsEditor } from './PropsEditor'
import { CogIcon } from '@heroicons/react/24/outline'

interface ElementsWrapperProps {
  children: React.ReactNode
  elementKey: string
  componentId: string
  elementId: string
}

/**
 * Wrapper component for elements that adds Properties button on hover
 * Shows Properties button if element has props defined
 */
export const ElementsWrapper: React.FC<ElementsWrapperProps> = ({
  children,
  elementKey,
  componentId,
  elementId,
}) => {
  const { isEditMode, addedComponents } = useInlineEdit()
  const [isPropsEditorOpen, setIsPropsEditorOpen] = useState(false)

  // Get element definition to check if it has props
  const elementDef = PAGE_ELEMENTS[elementKey as keyof typeof PAGE_ELEMENTS]
  const hasProps = elementDef && 'props' in elementDef && Array.isArray(elementDef.props) && elementDef.props.length > 0

  // Check if element is within a component (not standalone)
  // If componentId corresponds to a component in addedComponents, then element is within a component
  // If componentId corresponds to an element in addedComponents, then element is standalone
  const isWithinComponent = addedComponents.some(comp => {
    if (comp.id === componentId) {
      // Check if this is a component (not an element)
      const componentDef = PAGE_COMPONENTS[comp.componentKey as keyof typeof PAGE_COMPONENTS]
      return !!componentDef // If componentDef exists, then element is within a component
    }
    return false
  })

  // Only show Properties button in edit mode, if element has props, and if element is within a component (not standalone)
  if (!isEditMode || !hasProps || !isWithinComponent) {
    return <>{children}</>
  }

  return (
    <>
      <div className="group relative inline-block">
        {children}
        {/* Properties button - shown on hover, centered above element */}
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex flex-col items-center properties-button-container"
        >
          <button
            onClick={() => setIsPropsEditorOpen(true)}
            className="px-2.5 py-1.5 bg-[#0172E3] text-white text-xs font-medium rounded-full flex items-center gap-1 hover:bg-[#0158B3] transition-colors shadow-md whitespace-nowrap"
            title="Edit properties"
          >
            <CogIcon className="w-3.5 h-3.5" />
            <span>Properties</span>
          </button>
          {/* Arrow pointing down - changes color on button hover */}
          <div 
            className="properties-button-arrow w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#0172E3] mt-[-1px] transition-colors"
          ></div>
        </div>
      </div>

      {/* Props Editor Modal */}
      {isPropsEditorOpen && (
        <PropsEditor
          componentId={componentId}
          componentKey={elementKey}
          elementId={elementId}
          isOpen={isPropsEditorOpen}
          onClose={() => setIsPropsEditorOpen(false)}
        />
      )}
    </>
  )
}

