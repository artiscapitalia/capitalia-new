'use client'

import React, { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ComponentPreviewModalProps } from './types'
import { getEditableComponents } from './utils'
import { ComponentPreview } from './ComponentPreview'

type TabType = 'components' | 'elements'

/**
 * Modal that displays component and element previews with tabs
 * Components tab shows available components, Elements tab is empty for now
 */
export const ComponentPreviewModal: React.FC<ComponentPreviewModalProps> = ({
  isOpen,
  onClose,
  onSelectComponent,
}) => {
  const editableComponents = getEditableComponents()
  const [activeTab, setActiveTab] = useState<TabType>('components')

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      // Reset to components tab when modal opens
      setActiveTab('components')
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleComponentSelect = (componentKey: string) => {
    onSelectComponent(componentKey)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/20 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* Tabs - Button Group */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setActiveTab('components')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'components'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-400 hover:text-gray-600'
                }`}
              >
                Components
              </button>
              <button
                onClick={() => setActiveTab('elements')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${
                  activeTab === 'elements'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-400 hover:text-gray-600'
                }`}
              >
                Elements
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'components' && (
            <div className="flex flex-col gap-6">
              {editableComponents.map(([key, component]) => (
                <ComponentPreview
                  key={key}
                  componentKey={key}
                  component={component}
                  onClick={() => handleComponentSelect(key)}
                />
              ))}

              {editableComponents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No editable components available
                </div>
              )}
            </div>
          )}

          {activeTab === 'elements' && (
            <div className="text-center py-12 text-gray-500">
              Elements section coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
