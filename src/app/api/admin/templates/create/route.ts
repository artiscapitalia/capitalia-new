import { NextRequest, NextResponse } from 'next/server'
import { generateTemplateCode } from '@/lib/admin/templateGenerator'
import { saveTemplateContent, templateExists } from '@/lib/admin/templateStorage'
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

    // Check if template already exists (both filesystem and blob storage)
    const exists = await templateExists(templatePath)
    if (exists) {
      return NextResponse.json(
        { error: 'Template already exists' },
        { status: 400 }
      )
    }

    // Generate template code
    const templateCode = generateTemplateCode(templatePath, content, addedComponents)

    // Save using hybrid storage (local filesystem or Vercel Blob)
    await saveTemplateContent(templatePath, templateCode)

    const isVercel = !!process.env.VERCEL && process.env.VERCEL === '1'
    
    return NextResponse.json(
      { 
        message: 'Template created successfully',
        location: isVercel ? 'Vercel Blob Storage' : `src/templates/${templatePath}.tsx`
      },
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

