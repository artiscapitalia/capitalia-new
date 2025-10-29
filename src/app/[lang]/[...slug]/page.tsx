import React, { Suspense } from 'react'
import { CreatePageView } from '@/components/admin/edit-mode/CreatePageView'
import { NotFoundMessage } from './NotFoundMessage'
import { CreatePageButtonWrapper } from './CreatePageButtonWrapper'

interface PageProps {
  params: Promise<{
    lang: string
    slug: string[]
  }>
}

// Funkcija, kas pārvērš URL ceļu template ceļā
function getTemplatePath(slugPath: string[]): string {
  // /finansejums/finansejums-uznemumam/ -> finansejums/finansejums-uznemumam
  return slugPath.join('/')
}

// Funkcija, kas ielādē template komponenti
async function loadTemplate(lang: string, templatePath: string) {
  try {
    // Mēģinām ielādēt template failu ar .tsx paplašinājumu
    const templateModule = await import(`@/templates/${lang}/${templatePath}.tsx`)
    return templateModule.default
  } catch (error: unknown) {
    // Ignore module not found errors - these are expected for non-existent templates
    const errorObj = error as { code?: string; message?: string }
    if (errorObj?.code === 'MODULE_NOT_FOUND' || errorObj?.message?.includes('Cannot find module')) {
      // Template doesn't exist, return null
      return null
    }
    // Log other errors but still return null
    console.error(`Error loading template: @/templates/${lang}/${templatePath}.tsx`, error)
    return null
  }
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params
  
  // Izveido template ceļu no URL ceļa
  const templatePath = getTemplatePath(slug)
  
  // Mēģinām ielādēt template komponenti
  const TemplateComponent = await loadTemplate(lang, templatePath)
  
  // Ja template nav atrasts, rādām 404 ar Create page pogu vai create mode
  if (!TemplateComponent) {
    return (
      <main className="min-h-screen bg-white">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-gray-900 mb-4">Loading...</h1>
            </div>
          </div>
        }>
          <CreatePageView templatePath={`${lang}/${templatePath}`} lang={lang} />
        </Suspense>
        {/* Show 404 message only when not in create mode */}
        <Suspense fallback={null}>
          <NotFoundMessage 
            templatePath={templatePath} 
            lang={lang} 
            slug={slug}
          />
          <CreatePageButtonWrapper 
            templatePath={`${lang}/${templatePath}`} 
            lang={lang} 
          />
        </Suspense>
      </main>
    )
  }
  
  // Renderējam atrasto template
  return (
    <main className="min-h-screen bg-white">
      <TemplateComponent lang={lang} />
    </main>
  )
}
