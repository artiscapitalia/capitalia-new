import React from 'react'
import { Intro } from '@/components/page'
import { InlineEditProvider } from '@/lib/admin/InlineEditContext'
import { EditModeToggle } from '@/components/admin/edit-mode'

interface TemplateProps {
  lang: string
}

// Template-specific content overrides
const contentOverrides = {}

export default function BusinessFinancingTemplate({ lang }: TemplateProps) {
  return (
    <InlineEditProvider 
      templatePath="en/business/business-financing.tsx"
      initialContent={contentOverrides}
    >
      <div className="template-business-financing">
        {/* Intro komponente */}
        <Intro lang={lang} contentOverrides={contentOverrides} />
        
        {/* Here we can add more components */}
        {/* Example: <Services lang={lang} /> */}
        {/* Example: <ContactForm lang={lang} /> */}
        
        {/* Edit mode toggle */}
        <EditModeToggle />
      </div>
    </InlineEditProvider>
  )
}
