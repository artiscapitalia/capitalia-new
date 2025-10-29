import React from 'react'

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
  } catch (error) {
    console.error(`Template not found: @/templates/${lang}/${templatePath}.tsx`, error)
    return null
  }
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params
  
  // Izveido template ceļu no URL ceļa
  const templatePath = getTemplatePath(slug)
  
  // Mēģinām ielādēt template komponenti
  const TemplateComponent = await loadTemplate(lang, templatePath)
  
  // Ja template nav atrasts, rādām 404
  if (!TemplateComponent) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-900 mb-4">
            Template Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Looking for template: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{templatePath}.tsx</span>
          </p>
          <p className="text-lg text-gray-600 mb-2">
            Language: <span className="font-semibold">{lang}</span>
          </p>
          <p className="text-lg text-gray-600">
            Path: <span className="font-semibold">/{slug.join('/')}</span>
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-yellow-800">
              Create template at: <br />
              <code className="text-xs">src/templates/{lang}/{templatePath}.tsx</code>
            </p>
          </div>
        </div>
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
