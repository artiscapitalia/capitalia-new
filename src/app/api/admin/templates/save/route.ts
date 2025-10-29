import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { saveTemplateContent } from '@/lib/admin/templateStorage'
import { AddedComponent } from '@/lib/admin/types'

interface SaveTemplateRequest {
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
    const requestData: SaveTemplateRequest = await request.json()
    const { templatePath, content, addedComponents = [] } = requestData

    console.log('[save/route] Received request data:', {
      templatePath,
      contentKeys: content ? Object.keys(content) : [],
      content: content,
      addedComponentsCount: addedComponents?.length || 0,
      requestBodyPreview: JSON.stringify(requestData).substring(0, 200)
    })

    if (!templatePath || !content) {
      console.error('[save/route] Missing required fields:', { templatePath: !!templatePath, content: !!content })
      return NextResponse.json(
        { error: 'Template path and content are required' },
        { status: 400 }
      )
    }

    try {
      // Save using hybrid storage (saves as JSON)
      console.log('[save/route] Saving template to storage, path:', templatePath, 'content:', JSON.stringify(content).substring(0, 200))
      await saveTemplateContent(templatePath, content, addedComponents)
      console.log('[save/route] Template saved successfully')

      // Note: waitForBlobAvailable() is now called inside saveTemplateContent()
      // so we don't need additional delay here

      // Revalidate the page path to clear Next.js cache
      // Convert template path to URL path (e.g., "lv/test/vercel" -> "/lv/test/vercel")
      const pagePath = `/${templatePath}`
      revalidatePath(pagePath)
      console.log('[save/route] Revalidated path:', pagePath)

      return NextResponse.json(
        { message: 'Template saved successfully' },
        { status: 200 }
      )
    } catch (storageError) {
      console.error('Storage operation error:', storageError)
      const errorMessage = storageError instanceof Error ? storageError.message : String(storageError)
      return NextResponse.json(
        { 
          error: 'Failed to save template',
          details: errorMessage
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Template save error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
