import React from 'react'
import { InlineEditProvider } from './InlineEditContext'
import { EditModeToggle, TemplateWrapper } from '@/components/admin/edit-mode'
import { AddedComponent } from './types'
import { ParsedTemplateData } from './templateParser'

interface DynamicTemplateProps {
  lang: string
  templateData: ParsedTemplateData
}

/**
 * Dynamic template component that renders templates from parsed blob storage content
 * Used when templates are loaded from Vercel Blob Storage instead of filesystem
 */
export function DynamicTemplate({ lang, templateData }: DynamicTemplateProps) {
  const {
    contentOverrides,
    addedComponents,
    templatePath,
    className
  } = templateData

  // Use parsed className or generate default
  const templateClassName = className || `template-dynamic-${templatePath?.replace(/\//g, '-') || 'unknown'}`

  return (
    <InlineEditProvider
      templatePath={templatePath || undefined}
      initialContent={contentOverrides}
      initialComponents={addedComponents as AddedComponent[]}
    >
      <TemplateWrapper className={templateClassName} templatePath={templatePath || undefined}>
        <EditModeToggle />
      </TemplateWrapper>
    </InlineEditProvider>
  )
}

