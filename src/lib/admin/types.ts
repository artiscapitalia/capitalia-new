// Types for admin library

export interface TemplateContent {
  [componentId: string]: {
    [elementId: string]: string
  }
}

export interface AddedComponent {
  id: string
  componentKey: string
  props?: Record<string, unknown>
}

export interface InlineEditContextType {
  isEditMode: boolean
  templateContent: TemplateContent
  addedComponents: AddedComponent[]
  toggleEditMode: () => void
  updateContent: (componentId: string, elementId: string, content: string) => void
  addComponent: (componentKey: string, props?: Record<string, unknown>) => void
  saveTemplate: () => Promise<void>
  templatePath?: string
}

export interface InlineEditProviderProps {
  children: React.ReactNode
  templatePath?: string
  initialContent?: TemplateContent
  initialComponents?: AddedComponent[]
  autoEnableEditMode?: boolean
}

/**
 * Template data structure stored as JSON in Vercel Blob Storage
 */
export interface TemplateData {
  templatePath: string
  className: string
  contentOverrides: TemplateContent
  addedComponents: AddedComponent[]
}

