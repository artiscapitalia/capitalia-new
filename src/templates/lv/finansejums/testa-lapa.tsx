import React from 'react'
import { InlineEditProvider } from '@/lib/admin/InlineEditContext'
import { EditModeToggle, TemplateWrapper } from '@/components/admin/edit-mode'
import { AddedComponent } from '@/lib/admin/types'

interface TemplateProps {
  lang: string
}

// Template-specific content overrides
const contentOverrides = {}

// Dynamically added components
const addedComponents: AddedComponent[] = [
  {
    "id": "intro-1761730213707",
    "componentKey": "intro",
    "props": {
      "lang": "lv"
    }
  },
  {
    "id": "spacing-1761730216547",
    "componentKey": "spacing",
    "props": {
      "height": 40
    }
  },
  {
    "id": "intro-1761730221684",
    "componentKey": "intro",
    "props": {
      "lang": "lv"
    }
  }
]

export default function TestaLapaTemplate({ lang: _lang }: TemplateProps) {
  return (
    <InlineEditProvider 
      templatePath="lv/finansejums/testa-lapa.tsx"
      initialContent={contentOverrides}
      initialComponents={addedComponents}
    >
      <TemplateWrapper className="template-testa-lapa">
        {/* Edit mode toggle */}
        <EditModeToggle />
      </TemplateWrapper>
    </InlineEditProvider>
  )
}

