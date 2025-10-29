import React from 'react'
import { Intro } from '@/components/page'
import { InlineEditProvider } from '@/lib/admin/InlineEditContext'
import { EditModeToggle, TemplateWrapper } from '@/components/admin/edit-mode'
import { AddedComponent } from '@/lib/admin/types'

interface TemplateProps {
  lang: string
}

// Template-specific content overrides
const contentOverrides = {
  "intro": {
    "heading-line2": "lielam uzņēmumam",
    "description": "Capitalia finansējums uzņēmumiem kalpo kā vienkāršs papildinājums vai alternatīva banku sniegtajiem aizdevumiem 123 123213 111111"
  }
}

// Dynamically added components
const addedComponents: AddedComponent[] = [
  {
    "id": "intro-1761728982229",
    "componentKey": "intro",
    "props": {
      "lang": "lv"
    }
  },
  {
    "id": "spacing-1761728984517",
    "componentKey": "spacing",
    "props": {
      "height": 40
    }
  },
  {
    "id": "intro-1761729620149",
    "componentKey": "intro",
    "props": {
      "lang": "lv"
    }
  },
  {
    "id": "spacing-1761730338315",
    "componentKey": "spacing",
    "props": {
      "height": 40
    }
  },
  {
    "id": "spacing-1761730339458",
    "componentKey": "spacing",
    "props": {
      "height": 40
    }
  },
  {
    "id": "intro-1761730340819",
    "componentKey": "intro",
    "props": {
      "lang": "lv"
    }
  },
  {
    "id": "spacing-1761730342851",
    "componentKey": "spacing",
    "props": {
      "height": 40
    }
  },
  {
    "id": "spacing-1761730343979",
    "componentKey": "spacing",
    "props": {
      "height": 40
    }
  },
  {
    "id": "spacing-1761730345507",
    "componentKey": "spacing",
    "props": {
      "height": 40
    }
  }
]

export default function FinansejumsUznemumamTemplate({ lang }: TemplateProps) {
  return (
    <InlineEditProvider 
      templatePath="lv/finansejums/finansejums-uznemumam.tsx"
      initialContent={contentOverrides}
      initialComponents={addedComponents}
    >
      <TemplateWrapper className="template-finansejums-uznemumam">
        {/* Intro komponente */}
        <Intro lang={lang} contentOverrides={contentOverrides} />
        
        {/* Edit mode toggle */}
        <EditModeToggle />
      </TemplateWrapper>
    </InlineEditProvider>
  )
}
