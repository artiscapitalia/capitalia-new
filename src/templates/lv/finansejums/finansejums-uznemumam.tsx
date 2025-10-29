import React from 'react'
import { Intro } from '@/components/page'
import { InlineEditProvider } from '@/lib/admin/InlineEditContext'
import { EditModeToggle } from '@/components/admin/edit-mode'

interface TemplateProps {
  lang: string
}

// Template-specific content overrides
const contentOverrides = {
  "intro": {
    "heading-line2": "lielam uzņēmumam",
    "description": "Capitalia finansējums uzņēmumiem kalpo kā vienkāršs papildinājums vai alternatīva banku sniegtajiem aizdevumiem 123 123213"
  }
}

export default function FinansejumsUznemumamTemplate({ lang }: TemplateProps) {
  return (
    <InlineEditProvider 
      templatePath="lv/finansejums/finansejums-uznemumam.tsx"
      initialContent={contentOverrides}
    >
      <div className="template-finansejums-uznemumam">
        {/* Intro komponente */}
        <Intro lang={lang} contentOverrides={contentOverrides} />
        
        {/* Šeit varam pievienot vairāk komponentu */}
        {/* Piemēram: <Services lang={lang} /> */}
        {/* Piemēram: <ContactForm lang={lang} /> */}
        
        {/* Edit mode toggle */}
        <EditModeToggle />
      </div>
    </InlineEditProvider>
  )
}
