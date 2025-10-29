'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { InlineEditProvider } from '@/lib/admin/InlineEditContext'
import { TemplateWrapper } from './TemplateWrapper'
import { CreatePageButton } from './CreatePageButton'

interface CreatePageViewProps {
  templatePath: string
  lang: string
}

export const CreatePageView: React.FC<CreatePageViewProps> = ({ templatePath, lang }) => {
  const searchParams = useSearchParams()
  const isCreateMode = searchParams.get('create') === 'true'

  if (!isCreateMode) {
    return null
  }

  // Get template class name from template path
  const fileName = templatePath.split('/').pop() || 'new-page'
  const templateClassName = `template-${fileName.replace(/\//g, '-')}`

  return (
    <InlineEditProvider 
      templatePath={templatePath}
      initialContent={{}}
      initialComponents={[]}
      autoEnableEditMode={true}
    >
      <div className="min-h-screen">
        <TemplateWrapper className={templateClassName} templatePath={templatePath}>
          {/* Empty page for creating - components can be added here */}
        </TemplateWrapper>
      </div>
      <CreatePageButton templatePath={templatePath} />
    </InlineEditProvider>
  )
}

