// Types for admin library

export interface TemplateContent {
  [componentId: string]: {
    [elementId: string]: string
  }
}

export interface AddedComponent {
  id: string
  componentKey: string
  props?: Record<string, any>
}

export interface InlineEditContextType {
  isEditMode: boolean
  templateContent: TemplateContent
  addedComponents: AddedComponent[]
  toggleEditMode: () => void
  updateContent: (componentId: string, elementId: string, content: string) => void
  addComponent: (componentKey: string, props?: Record<string, any>) => void
  saveTemplate: () => Promise<void>
  templatePath?: string
}

export interface InlineEditProviderProps {
  children: React.ReactNode
  templatePath?: string
  initialContent?: TemplateContent
}

