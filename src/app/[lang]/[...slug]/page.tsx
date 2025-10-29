import React, { Suspense } from 'react'
import { CreatePageView } from '@/components/admin/edit-mode/CreatePageView'
import { NotFoundMessage } from './NotFoundMessage'
import { CreatePageButtonWrapper } from './CreatePageButtonWrapper'
import { readTemplateContent } from '@/lib/admin/templateStorage'
import { parseTemplate, ParsedTemplateData } from '@/lib/admin/templateParser'
import { DynamicTemplate } from '@/lib/admin/DynamicTemplate'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'

interface PageProps {
  params: Promise<{
    lang: string
    slug: string[]
  }>
}

// Template loading result can be either a component or parsed data for dynamic rendering
type TemplateLoadResult = 
  | React.ComponentType<{ lang: string }>
  | { type: 'dynamic'; data: ParsedTemplateData }
  | null

// Funkcija, kas pārvērš URL ceļu template ceļā
function getTemplatePath(slugPath: string[]): string {
  // /finansejums/finansejums-uznemumam/ -> finansejums/finansejums-uznemumam
  return slugPath.join('/')
}

/**
 * Checks if running on Vercel
 */
function isVercel(): boolean {
  return !!process.env.VERCEL && process.env.VERCEL === '1'
}

// Funkcija, kas ielādē template komponenti
async function loadTemplate(lang: string, templatePath: string): Promise<TemplateLoadResult> {
  const isVercelEnv = isVercel()
  const fullTemplatePath = `${lang}/${templatePath}`

  // On Vercel: Check blob storage FIRST before trying filesystem
  if (isVercelEnv) {
    try {
      const templateContent = await readTemplateContent(fullTemplatePath)
      
      if (templateContent) {
        // Template found in blob storage, parse it and return parsed data for dynamic rendering
        try {
          const parsedData = parseTemplate(templateContent)
          console.log('Template loaded from blob storage:', fullTemplatePath)
          return { type: 'dynamic', data: parsedData }
        } catch (parseError) {
          console.error('Error parsing template from blob storage:', parseError)
          // Fall through to try filesystem
        }
      }
    } catch (blobError) {
      // Error reading from blob, fall through to try filesystem
      console.log('Template not found in blob storage, trying filesystem:', blobError)
    }
  }

  // Try to load from filesystem (works both locally and on Vercel if synced during build)
  try {
    const templateModule = await import(`@/templates/${lang}/${templatePath}.tsx`)
    return templateModule.default
  } catch (error: unknown) {
    const errorObj = error as { code?: string; message?: string }
    if (errorObj?.code === 'MODULE_NOT_FOUND' || errorObj?.message?.includes('Cannot find module')) {
      // Template doesn't exist in filesystem
      
      if (!isVercelEnv) {
        // Local development: try to sync from blob storage to filesystem if it exists
        try {
          const templateContent = await readTemplateContent(fullTemplatePath)
          
          if (templateContent) {
            // Template exists in blob storage, sync to filesystem
            try {
              const templateFilePath = join(process.cwd(), 'src', 'templates', fullTemplatePath + '.tsx')
              const templateDir = dirname(templateFilePath)
              
              // Create directory if it doesn't exist
              if (!existsSync(templateDir)) {
                await mkdir(templateDir, { recursive: true })
              }
              
              // Write template to filesystem
              await writeFile(templateFilePath, templateContent, 'utf-8')
              
              // Now try to import it again
              const templateModule = await import(`@/templates/${lang}/${templatePath}.tsx`)
              return templateModule.default
            } catch (syncError) {
              console.error('Error syncing template from blob to filesystem:', syncError)
              // Continue to return null - template will show as not found
            }
          }
        } catch (blobError) {
          // Error reading blob, but that's ok - template just doesn't exist
          console.log('Template not found in blob storage:', blobError)
        }
      }
      // Template doesn't exist (neither in filesystem nor blob storage, or on Vercel filesystem is read-only)
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
  const templateResult = await loadTemplate(lang, templatePath)
  
  // Ja template nav atrasts, rādām 404 ar Create page pogu vai create mode
  if (!templateResult) {
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

  // Renderējam template: vai nu no filesystem vai dinamiskais no blob storage
  if ('type' in templateResult && templateResult.type === 'dynamic') {
    // Template loaded from blob storage, use dynamic renderer
    return (
      <main className="min-h-screen bg-white">
        <DynamicTemplate lang={lang} templateData={templateResult.data} />
      </main>
    )
  } else {
    // Template loaded from filesystem, use imported component
    const TemplateComponent = templateResult as React.ComponentType<{ lang: string }>
    return (
      <main className="min-h-screen bg-white">
        <TemplateComponent lang={lang} />
      </main>
    )
  }
}

