// Types for edit-mode components

export interface EditableTextProps {
  componentId: string
  elementId: string
  defaultContent: string
  className?: string
  tag?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
  children?: React.ReactNode
}

