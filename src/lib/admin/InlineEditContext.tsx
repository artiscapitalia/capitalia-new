'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { 
  TemplateContent, 
  ElementProps,
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
  initialElementProps = {},
  autoEnableEditMode = false
}) => {
  const [isEditMode, setIsEditMode] = useState(autoEnableEditMode)
  const [templateContent, setTemplateContent] = useState<TemplateContent>(initialContent)
  const [addedComponents, setAddedComponents] = useState<AddedComponent[]>(initialComponents)
  const [elementProps, setElementProps] = useState<ElementProps>(initialElementProps)
  
  // Use refs to track previous values for comparison and whether we've initialized
  const prevInitialContentRef = useRef<string>(JSON.stringify(initialContent))
  const prevInitialComponentsRef = useRef<string>(JSON.stringify(initialComponents))
  const prevInitialElementPropsRef = useRef<string>(JSON.stringify(initialElementProps))
  const hasUserEditedRef = useRef<boolean>(false)

  // Update state when initialContent, initialComponents, or initialElementProps change (e.g., after page refresh with new data)
  // BUT only if user hasn't edited yet (to preserve user changes)
  useEffect(() => {
    const newContentStr = JSON.stringify(initialContent)
    const newComponentsStr = JSON.stringify(initialComponents)
    const newElementPropsStr = JSON.stringify(initialElementProps)
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

    if (newElementPropsStr !== prevInitialElementPropsRef.current) {
      console.log('[InlineEditProvider] InitialElementProps changed, updating elementProps')
      prevInitialElementPropsRef.current = newElementPropsStr
      setElementProps(initialElementProps)
    }
  }, [initialContent, initialComponents, initialElementProps, templateContent])

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

  const updateProps = (componentId: string, propName: string, propValue: string | number | boolean) => {
    hasUserEditedRef.current = true // Mark that user has edited
    console.log('[updateProps] User edited props:', { componentId, propName, propValue })
    setAddedComponents(prev => prev.map(comp => {
      if (comp.id === componentId) {
        return {
          ...comp,
          props: {
            ...comp.props,
            [propName]: propValue
          }
        }
      }
      return comp
    }))
  }

  const updateElementProps = (componentId: string, elementId: string, propName: string, propValue: string | number | boolean) => {
    hasUserEditedRef.current = true // Mark that user has edited
    console.log('[updateElementProps] User edited element props:', { componentId, elementId, propName, propValue })
    setElementProps(prev => {
      const updated = {
        ...prev,
        [componentId]: {
          ...prev[componentId],
          [elementId]: {
            ...prev[componentId]?.[elementId],
            [propName]: propValue
          }
        }
      }
      console.log('[updateElementProps] Updated elementProps:', updated)
      return updated
    })
  }

  const getElementProps = (componentId: string, elementId: string): Record<string, string | number | boolean> => {
    return elementProps[componentId]?.[elementId] || {}
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
      elementProps,
      elementPropsKeys: Object.keys(elementProps),
      templateContentString: JSON.stringify(templateContent)
    })

    try {
      const requestBody = {
        templatePath,
        content: templateContent,
        addedComponents: addedComponents,
        elementProps: elementProps
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
        elementProps,
        toggleEditMode,
        updateContent,
        updateProps,
        updateElementProps,
        getElementProps,
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

