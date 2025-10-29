'use client'

import React from 'react'
import { AddedComponentsRenderer } from './AddedComponentsRenderer'
import { AddComponentPlaceholder } from './AddComponentPlaceholder'
// Import helper functions from template generator to ensure structure consistency
import { getTemplateClassName, generateTemplateCode } from '@/lib/admin/templateGenerator'
import { AddedComponent } from '@/lib/admin/types'

interface TemplateWrapperProps {
  className: string
  templatePath?: string
  children?: React.ReactNode
}

/**
 * TemplateWrapper component that provides consistent structure for templates
 * Uses template generator utilities to ensure className matches template path
 */
export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ className, templatePath, children }) => {
  // Validate className matches template path if provided
  const validatedClassName = templatePath ? getTemplateClassName(templatePath) : className

  return (
    <div className={validatedClassName}>
      {/* Render dynamically added components */}
      <AddedComponentsRenderer />
    
      {/* Add component placeholder (only visible in edit mode) */}
      <AddComponentPlaceholder />
      
      {/* Original template content */}
      {children}
    </div>
  )
}

/**
 * Generate template code using TemplateWrapper structure
 * Single-line function that delegates to templateGenerator
 */
export function createTemplateWithWrapper(
  templatePath: string,
  content: { [componentId: string]: { [elementId: string]: string } },
  addedComponents: AddedComponent[]
): string {
  return generateTemplateCode(templatePath, content, addedComponents)
}

