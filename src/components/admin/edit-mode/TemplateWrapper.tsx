'use client'

import React from 'react'
import { AddedComponentsRenderer } from './AddedComponentsRenderer'
import { AddComponentPlaceholder } from './AddComponentPlaceholder'

interface TemplateWrapperProps {
  className: string
  children?: React.ReactNode
}

export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ className, children }) => {
  return (
    <div className={className}>
      {/* Render dynamically added components */}
      <AddedComponentsRenderer />
      
      {/* Add component placeholder (only visible in edit mode) */}
      <AddComponentPlaceholder />
      
      {/* Original template content */}
      {children}
    </div>
  )
}

