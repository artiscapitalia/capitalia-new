'use client'

import React, { createContext, useContext, useState } from 'react'
import { 
  TemplateContent, 
  InlineEditContextType, 
  InlineEditProviderProps,
  AddedComponent
} from './types'

export const InlineEditContext = createContext<InlineEditContextType | undefined>(undefined)

export const InlineEditProvider: React.FC<InlineEditProviderProps> = ({
  children,
  templatePath,
  initialContent = {},
  initialComponents = []
}) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [templateContent, setTemplateContent] = useState<TemplateContent>(initialContent)
  const [addedComponents, setAddedComponents] = useState<AddedComponent[]>(initialComponents)

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const updateContent = (componentId: string, elementId: string, content: string) => {
    setTemplateContent(prev => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        [elementId]: content
      }
    }))
  }

  const addComponent = (componentKey: string, props?: Record<string, unknown>) => {
    const newComponent: AddedComponent = {
      id: `${componentKey}-${Date.now()}`,
      componentKey,
      props
    }
    setAddedComponents(prev => [...prev, newComponent])
  }

  const saveTemplate = async () => {
    if (!templatePath) {
      console.error('No template path provided')
      return
    }

    try {
      const response = await fetch('/api/admin/templates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templatePath,
          content: templateContent,
          addedComponents: addedComponents
        })
      })

      if (!response.ok) {
        // Try to get error details from response
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || 'Failed to save template'
        throw new Error(errorMessage)
      }

      console.log('Template saved successfully')
    } catch (error) {
      console.error('Error saving template:', error)
      // Re-throw to allow caller to handle
      throw error
    }
  }

  return (
    <InlineEditContext.Provider
      value={{
        isEditMode,
        templateContent,
        addedComponents,
        toggleEditMode,
        updateContent,
        addComponent,
        saveTemplate,
        templatePath
      }}
    >
      {children}
    </InlineEditContext.Provider>
  )
}

export const useInlineEdit = () => {
  const context = useContext(InlineEditContext)
  if (context === undefined) {
    throw new Error('useInlineEdit must be used within an InlineEditProvider')
  }
  return context
}

