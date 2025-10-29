import { NextRequest, NextResponse } from 'next/server'
import { saveTemplateContent } from '@/lib/admin/templateStorage'
import { AddedComponent } from '@/lib/admin/types'

interface CreateTemplateRequest {
    templatePath: string
    content: {
        [componentId: string]: {
            [elementId: string]: string
        }
    }
    addedComponents?: AddedComponent[]
}

export async function POST(request: NextRequest) {
    try {
        const { templatePath, content, addedComponents = [] }: CreateTemplateRequest = await request.json()

        if (!templatePath) {
            return NextResponse.json(
                { error: 'Template path is required' },
                { status: 400 }
            )
        }

        // Save template using saveTemplateContent (saves as JSON on Vercel, .tsx locally)
        await saveTemplateContent(templatePath, content, addedComponents)

        return NextResponse.json(
            { message: 'Template created successfully', path: templatePath },
            { status: 200 }
        )
    } catch (error) {
        console.error('Template creation error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

