'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
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
  initialComponents = [],
  autoEnableEditMode = false
}) => {
  const [isEditMode, setIsEditMode] = useState(autoEnableEditMode)
  const [templateContent, setTemplateContent] = useState<TemplateContent>(initialContent)
  const [addedComponents, setAddedComponents] = useState<AddedComponent[]>(initialComponents)
  
  // Use refs to track previous values for comparison and whether we've initialized
  const prevInitialContentRef = useRef<string>(JSON.stringify(initialContent))
  const prevInitialComponentsRef = useRef<string>(JSON.stringify(initialComponents))
  const hasUserEditedRef = useRef<boolean>(false)

  // Update state when initialContent or initialComponents change (e.g., after page refresh with new data)
  // BUT only if user hasn't edited yet (to preserve user changes)
  useEffect(() => {
    const newContentStr = JSON.stringify(initialContent)
    const newComponentsStr = JSON.stringify(initialComponents)
    const currentContentStr = JSON.stringify(templateContent)
    
    // Only update from initialContent if:
    // 1. It actually changed AND
    // 2. Current content is empty or same as previous initialContent (not user-edited)
    const contentChanged = newContentStr !== prevInitialContentRef.current
    const contentIsEmpty = Object.keys(templateContent).length === 0
    const contentMatchesPrevious = currentContentStr === prevInitialContentRef.current
    
    if (contentChanged && (contentIsEmpty || contentMatchesPrevious || !hasUserEditedRef.current)) {
      console.log('[InlineEditProvider] InitialContent changed, updating templateContent', {
        old: prevInitialContentRef.current.substring(0, 100),
        new: newContentStr.substring(0, 100),
        currentContentKeys: Object.keys(templateContent)
      })
      prevInitialContentRef.current = newContentStr
      setTemplateContent(initialContent)
      hasUserEditedRef.current = false // Reset flag when loading new data
    }
    
    if (newComponentsStr !== prevInitialComponentsRef.current) {
      console.log('[InlineEditProvider] InitialComponents changed, updating addedComponents')
      prevInitialComponentsRef.current = newComponentsStr
      setAddedComponents(initialComponents)
    }
  }, [initialContent, initialComponents, templateContent])

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const updateContent = (componentId: string, elementId: string, content: string) => {
    hasUserEditedRef.current = true // Mark that user has edited
    console.log('[updateContent] User edited content:', { componentId, elementId, content })
    setTemplateContent(prev => {
      const updated = {
        ...prev,
        [componentId]: {
          ...prev[componentId],
          [elementId]: content
        }
      }
      console.log('[updateContent] Updated templateContent:', updated)
      return updated
    })
  }

  const addComponent = (componentKey: string, props?: Record<string, unknown>) => {
    const newComponent: AddedComponent = {
      id: `${componentKey}-${Date.now()}`,
      componentKey,
      props
    }
    setAddedComponents(prev => [...prev, newComponent])
  }

  const insertComponentBefore = (targetComponentId: string, componentKey: string, props?: Record<string, unknown>) => {
    const newComponent: AddedComponent = {
      id: `${componentKey}-${Date.now()}`,
      componentKey,
      props
    }
    setAddedComponents(prev => {
      const index = prev.findIndex(comp => comp.id === targetComponentId)
      if (index === -1) {
        // If target not found, add to end
        return [...prev, newComponent]
      }
      const newArray = [...prev]
      newArray.splice(index, 0, newComponent)
      return newArray
    })
  }

  const insertComponentAfter = (targetComponentId: string, componentKey: string, props?: Record<string, unknown>) => {
    const newComponent: AddedComponent = {
      id: `${componentKey}-${Date.now()}`,
      componentKey,
      props
    }
    setAddedComponents(prev => {
      const index = prev.findIndex(comp => comp.id === targetComponentId)
      if (index === -1) {
        // If target not found, add to end
        return [...prev, newComponent]
      }
      const newArray = [...prev]
      newArray.splice(index + 1, 0, newComponent)
      return newArray
    })
  }

  const removeComponent = (componentId: string) => {
    setAddedComponents(prev => prev.filter(comp => comp.id !== componentId))
  }

  const toggleComponentVisibility = (componentId: string) => {
    setAddedComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? { ...comp, isHidden: !comp.isHidden }
        : comp
    ))
  }

  const saveTemplate = async () => {
    if (!templatePath) {
      console.error('No template path provided')
      return
    }

    // Debug logging before save
    console.log('[saveTemplate] Saving template with data:', {
      templatePath,
      templateContent,
      templateContentKeys: Object.keys(templateContent),
      addedComponents,
      templateContentString: JSON.stringify(templateContent)
    })

    try {
      const requestBody = {
        templatePath,
        content: templateContent,
        addedComponents: addedComponents
      }
      
      console.log('[saveTemplate] Request body:', JSON.stringify(requestBody, null, 2))
      
      const response = await fetch('/api/admin/templates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
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
        insertComponentBefore,
        insertComponentAfter,
        removeComponent,
        toggleComponentVisibility,
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

