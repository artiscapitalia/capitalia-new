import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'
import { generateTemplateCode } from '@/lib/admin/templateGenerator'
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

    // Construct the full path to the template file
    // Ensure templatePath has .tsx extension
    const templateFilePath = templatePath.endsWith('.tsx')
      ? join(process.cwd(), 'src', 'templates', templatePath)
      : join(process.cwd(), 'src', 'templates', `${templatePath}.tsx`)
    const templateDir = dirname(templateFilePath)

    // Check if file already exists
    if (existsSync(templateFilePath)) {
      return NextResponse.json(
        { error: 'Template file already exists' },
        { status: 400 }
      )
    }

    // Create directory if it doesn't exist
    if (!existsSync(templateDir)) {
      await mkdir(templateDir, { recursive: true })
    }

    // Generate template code
    const templateCode = generateTemplateCode(templatePath, content, addedComponents)

    // Write the template file
    await writeFile(templateFilePath, templateCode, 'utf-8')

    return NextResponse.json(
      { message: 'Template created successfully', path: templateFilePath },
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

