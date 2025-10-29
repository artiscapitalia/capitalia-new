import { NextRequest, NextResponse } from 'next/server'
import { readTemplateData } from '@/lib/admin/templateStorage'

/**
 * API endpoint to render template data
 * Returns template data as JSON (from blob storage on Vercel or parsed from .tsx locally)
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

    // Read template data
    const templateData = await readTemplateData(templatePath)
    
    if (!templateData) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        ...templateData,
        source: process.env.VERCEL ? 'blob' : 'filesystem'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Template render error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

