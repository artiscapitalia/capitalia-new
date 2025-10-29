import { NextRequest, NextResponse } from 'next/server'
import { readTemplateContent } from '@/lib/admin/templateStorage'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * API endpoint to load template content
 * Returns template file content from Blob Storage (Vercel) or filesystem (local)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templatePath = searchParams.get('path')

    if (!templatePath) {
      return NextResponse.json(
        { error: 'Template path is required' },
        { status: 400 }
      )
    }

    // Try to read from storage/blob first
    let templateContent = await readTemplateContent(templatePath)

    // If not found, try source file as fallback
    if (!templateContent) {
      try {
        const templateFilePath = join(process.cwd(), 'src', 'templates', templatePath)
        templateContent = await readFile(templateFilePath, 'utf-8')
      } catch {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { content: templateContent },
      { status: 200 }
    )
  } catch (error) {
    console.error('Template load error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

