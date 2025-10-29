import React, { Suspense } from 'react'
import { CreatePageView } from '@/components/admin/edit-mode/CreatePageView'
import { NotFoundMessage } from './NotFoundMessage'
import { CreatePageButton } from '@/components/admin/edit-mode/CreatePageButton'
import { readTemplateContent } from '@/lib/admin/templateStorage'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{
        slug: string[]
    }>
}

// Function that converts URL path to template path
function getTemplatePath(slugPath: string[]): string {
    return slugPath.join('/')
}

// Function that loads template component
async function loadTemplate(path: string) {
    // Validate that path is not empty and is valid
    if (!path || path.trim() === '') {
        return null
    }

    // Validate that path does not contain dangerous characters
    if (path.includes('..') || path.includes('~')) {
        return null
    }

    // Use readTemplateContent() which returns React component
    return await readTemplateContent(path)
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params

    // Create template path from URL path
    const templatePath = getTemplatePath(slug)

    // Try to load template component
    const TemplateComponent = await loadTemplate(templatePath)

    // If template is not found, show 404 with Create page button or create mode
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
                    <CreatePageView templatePath={templatePath} />
                </Suspense>

                <Suspense fallback={null}>
                    <NotFoundMessage
                        templatePath={templatePath}
                        slug={slug}
                    />
                    <CreatePageButton templatePath={templatePath} />
                </Suspense>
            </main>
        )
    }

    // Render the found template
    // Use key based on templatePath to force remount when template changes
    return (
        <main className="min-h-screen bg-white">
            <TemplateComponent key={templatePath} />
        </main>
    )
}
