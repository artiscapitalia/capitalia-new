import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

interface SaveTemplateRequest {
  templatePath: string
  content: {
    [componentId: string]: {
      [elementId: string]: string
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { templatePath, content }: SaveTemplateRequest = await request.json()

    if (!templatePath || !content) {
      return NextResponse.json(
        { error: 'Template path and content are required' },
        { status: 400 }
      )
    }

    // Construct the full path to the template file
    const templateFilePath = join(process.cwd(), 'src', 'templates', templatePath)

    try {
      // Read the existing template file
      const existingContent = await readFile(templateFilePath, 'utf-8')
      
      // Update the contentOverrides in the template
      const updatedContent = updateTemplateContent(existingContent, content)
      
      // Write the updated content back to the file
      await writeFile(templateFilePath, updatedContent, 'utf-8')

      return NextResponse.json(
        { message: 'Template saved successfully' },
        { status: 200 }
      )
    } catch (fileError) {
      console.error('File operation error:', fileError)
      return NextResponse.json(
        { error: 'Failed to read or write template file' },
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

function updateTemplateContent(
  existingContent: string,
  newContent: { [componentId: string]: { [elementId: string]: string } }
): string {
  // Find the contentOverrides declaration with its full structure
  const contentOverridesRegex = /const contentOverrides = {[\s\S]*?^}/m
  const match = existingContent.match(contentOverridesRegex)
  
  if (!match) {
    // If no contentOverrides found, we need to add it
    // Find the line after the imports and before the component
    const importEnd = existingContent.lastIndexOf('import')
    const nextLineAfterImports = existingContent.indexOf('\n', importEnd)
    
    const beforeImportEnd = existingContent.substring(0, nextLineAfterImports + 1)
    const afterImportEnd = existingContent.substring(nextLineAfterImports + 1)
    
    const contentOverridesString = `\n// Template-specific content overrides\nconst contentOverrides = ${JSON.stringify(newContent, null, 2)}\n`
    
    return beforeImportEnd + contentOverridesString + afterImportEnd
  } else {
    // Replace the existing contentOverrides with the new content
    const newContentOverridesString = `const contentOverrides = ${JSON.stringify(newContent, null, 2)}`
    return existingContent.replace(contentOverridesRegex, newContentOverridesString)
  }
}
