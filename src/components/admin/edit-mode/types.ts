// Types for edit-mode components
import type React from 'react'

export interface EditableTextProps {
  componentId: string
  elementId: string
  defaultContent: string
  className?: string
  tag?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
  children?: React.ReactNode
}

// Type for dynamically imported module exports
export interface DynamicModule {
  default?: React.ComponentType<Record<string, unknown>>
  [key: string]: React.ComponentType<Record<string, unknown>> | unknown
}

