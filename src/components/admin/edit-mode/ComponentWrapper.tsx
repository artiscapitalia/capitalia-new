'use client'

import React, { useState } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PlusIcon, EyeSlashIcon, EyeIcon, TrashIcon, CogIcon } from '@heroicons/react/24/solid'
import { PreviewModal } from './PreviewModal'
import { PropsEditor } from './PropsEditor'
import { PAGE_COMPONENTS, PAGE_ELEMENTS } from '@/components/page'

interface ComponentWrapperProps {
  children: React.ReactNode
  componentId?: string
  isHidden?: boolean
}

/**
 * ComponentWrapper wraps components with separators (1px white lines) before and after
 * In edit mode, separators change from white to capitalia blue on hover
 * Clicking + buttons opens component selection modal to insert components above or below
 */
export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({ children, componentId, isHidden = false }) => {
  const { isEditMode, insertComponentBefore, insertComponentAfter, removeComponent, toggleComponentVisibility, addedComponents } = useInlineEdit()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPropsEditorOpen, setIsPropsEditorOpen] = useState(false)
  const [insertPosition, setInsertPosition] = useState<'before' | 'after' | null>(null)
  
  // Get component key from addedComponents
  const component = addedComponents.find(comp => comp.id === componentId)
  const componentKey = component?.componentKey || ''

  // In public mode, don't render hidden components
  if (!isEditMode && isHidden) {
    return null
  }

  // In non-edit mode, render children without wrapper
  if (!isEditMode) {
    return <>{children}</>
  }

  const handleButtonClick = (position: 'before' | 'after') => {
    setInsertPosition(position)
    setIsModalOpen(true)
  }

  const handleComponentSelect = (componentKey: string) => {
    if (!componentId) return
    
    // Check if it's a component or element
    // CRITICAL: Always read defaultProps directly from registry - never modify them
    // Text changes will be stored in templateContent, not in props
    const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
    const elementDef = PAGE_ELEMENTS[componentKey as keyof typeof PAGE_ELEMENTS]
    const def = componentDef || elementDef
    // Create a shallow copy to avoid mutating the original defaultProps
    const props = def?.defaultProps ? { ...def.defaultProps } : {}

    if (insertPosition === 'before') {
      insertComponentBefore(componentId, componentKey, props)
    } else if (insertPosition === 'after') {
      insertComponentAfter(componentId, componentKey, props)
    }

    setIsModalOpen(false)
    setInsertPosition(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setInsertPosition(null)
  }

  const handleRemove = () => {
    if (!componentId) return
    removeComponent(componentId)
  }

  const handleHide = () => {
    if (!componentId) return
    toggleComponentVisibility(componentId)
  }

  return (
    <>
      <div className="group">
        {/* Top separator - full screen width, changes from white to capitalia blue on hover */}
        <div className="relative h-[1px] w-screen bg-white group-hover:bg-[#0172E3] transition-colors duration-200 -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)]">
          {/* Container to constrain toolbar to component width */}
          <div className="absolute inset-0 mx-auto max-w-screen-xl relative">
            {/* Round button with + icon - visible only on hover, centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={() => handleButtonClick('before')}
                className="w-8 h-8 rounded-full bg-[#0172E3] flex items-center justify-center shadow-lg hover:bg-[#0158B3] transition-colors cursor-pointer"
              >
                <PlusIcon className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Toolbar with Properties, Hide and Remove buttons - visible only on hover, positioned on the right within component width, centered vertically */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center bg-[#0172E3] rounded-full shadow-md hover:bg-[#0158B3] transition-colors">
              {/* Check if component/element has props defined */}
              {(() => {
                if (!componentKey) {
                  return null
                }
                const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
                const elementDef = PAGE_ELEMENTS[componentKey as keyof typeof PAGE_ELEMENTS]
                const def = componentDef || elementDef
                const hasProps = def && 'props' in def && Array.isArray(def.props) && def.props.length > 0
                
                if (hasProps) {
                  return (
                    <button
                      onClick={() => setIsPropsEditorOpen(true)}
                      className="px-2.5 py-1.5 text-white cursor-pointer flex items-center gap-1 text-xs font-medium hover:bg-white/10 transition-colors rounded-l-full border-r border-white/20"
                      title="Edit properties"
                    >
                      <CogIcon className="w-3.5 h-3.5" />
                      <span>Properties</span>
                    </button>
                  )
                }
                return null
              })()}
              <button
                onClick={handleHide}
                className={`px-2.5 py-1.5 text-white cursor-pointer flex items-center gap-1 text-xs font-medium hover:bg-white/10 transition-colors ${
                  (() => {
                    if (!componentKey) {
                      return 'rounded-l-full'
                    }
                    const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
                    const elementDef = PAGE_ELEMENTS[componentKey as keyof typeof PAGE_ELEMENTS]
                    const def = componentDef || elementDef
                    const hasProps = def && 'props' in def && Array.isArray(def.props) && def.props.length > 0
                    return !hasProps ? 'rounded-l-full' : 'border-l border-white/20'
                  })()
                }`}
                title={isHidden ? "Unhide component" : "Hide component"}
              >
                {isHidden ? (
                  <EyeIcon className="w-3.5 h-3.5" />
                ) : (
                  <EyeSlashIcon className="w-3.5 h-3.5" />
                )}
                <span>{isHidden ? "Unhide" : "Hide"}</span>
              </button>
              <button
                onClick={handleRemove}
                className="px-2.5 py-1.5 text-white cursor-pointer flex items-center gap-1 text-xs font-medium hover:bg-white/10 transition-colors rounded-r-full border-l border-white/20"
                title="Remove component"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Component content - hover anywhere on children triggers group hover */}
        <div className="relative">
          {children}
          {/* Overlay for hidden components - visible in edit mode only */}
          {isHidden && (
            <div className="absolute inset-0 bg-white/70 pointer-events-none z-20" />
          )}
        </div>
        
        {/* Bottom separator - full screen width, changes from white to capitalia blue on hover */}
        <div className="relative h-[1px] w-screen bg-white group-hover:bg-[#0172E3] transition-colors duration-200 -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)]">
          {/* Round button with + icon - visible only on hover */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={() => handleButtonClick('after')}
              className="w-8 h-8 rounded-full bg-[#0172E3] flex items-center justify-center shadow-lg hover:bg-[#0158B3] transition-colors cursor-pointer"
            >
              <PlusIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Component Preview Modal */}
      <PreviewModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelectComponent={handleComponentSelect}
      />

      {/* Props Editor Modal */}
      {componentId && componentKey && (
        <PropsEditor
          componentId={componentId}
          componentKey={componentKey}
          isOpen={isPropsEditorOpen}
          onClose={() => setIsPropsEditorOpen(false)}
        />
      )}
    </>
  )
}

