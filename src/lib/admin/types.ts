// Types for admin library

export interface TemplateContent {
  [componentId: string]: {
    [elementId: string]: string
  }
}

export interface ElementProps {
  [componentId: string]: {
    [elementId: string]: {
      [propName: string]: string | number | boolean
    }
  }
}

export interface AddedComponent {
  id: string
  componentKey: string
  props?: Record<string, unknown>
  isHidden?: boolean
}

export interface InlineEditContextType {
  isEditMode: boolean
  templateContent: TemplateContent
  addedComponents: AddedComponent[]
  elementProps: ElementProps
  toggleEditMode: () => void
  updateContent: (componentId: string, elementId: string, content: string) => void
  updateProps: (componentId: string, propName: string, propValue: string | number | boolean) => void
  updateElementProps: (componentId: string, elementId: string, propName: string, propValue: string | number | boolean) => void
  getElementProps: (componentId: string, elementId: string) => Record<string, string | number | boolean>
  addComponent: (componentKey: string, props?: Record<string, unknown>) => void
  insertComponentBefore: (targetComponentId: string, componentKey: string, props?: Record<string, unknown>) => void
  insertComponentAfter: (targetComponentId: string, componentKey: string, props?: Record<string, unknown>) => void
  removeComponent: (componentId: string) => void
  toggleComponentVisibility: (componentId: string) => void
  saveTemplate: () => Promise<void>
  templatePath?: string
}

export interface InlineEditProviderProps {
  children: React.ReactNode
  templatePath?: string
  initialContent?: TemplateContent
  initialComponents?: AddedComponent[]
  initialElementProps?: ElementProps
  autoEnableEditMode?: boolean
}

/**
 * Prop definition for components and elements
 * Defines a configurable parameter with possible values
 */
export interface PropDefinition {
  /**
   * Prop name/key
   */
  name: string
  /**
   * Prop label for UI
   */
  label: string
  /**
   * Prop type (e.g., 'select', 'text', 'number')
   */
  type: 'select' | 'text' | 'number' | 'boolean'
  /**
   * Available values for select type
   */
  values?: Array<{
    value: string | number | boolean
    label: string
  }>
  /**
   * Default value
   */
  defaultValue?: string | number | boolean
  /**
   * Description for UI
   */
  description?: string
}

/**
 * Template data structure stored as JSON in Vercel Blob Storage
 */
export interface TemplateData {
  templatePath: string
  className: string
  contentOverrides: TemplateContent
  addedComponents: AddedComponent[]
  elementProps?: ElementProps
}

