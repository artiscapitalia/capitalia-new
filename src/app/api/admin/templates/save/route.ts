import { NextRequest, NextResponse } from 'next/server'
import { readTemplateContent, saveTemplateContent } from '@/lib/admin/templateStorage'
import { generateTemplateCode } from '@/lib/admin/templateGenerator'
import { readFile } from 'fs/promises'
import { join } from 'path'

interface AddedComponent {
  id: string
  componentKey: string
  props?: Record<string, unknown>
}

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
    const { templatePath, content, addedComponents = [] }: SaveTemplateRequest = await request.json()

    if (!templatePath || !content) {
      return NextResponse.json(
        { error: 'Template path and content are required' },
        { status: 400 }
      )
    }

    try {
      // Read existing template content (from blob storage on Vercel, file system locally)
      let existingContent = await readTemplateContent(templatePath)
      
      // If not found in storage/blob, try to read from source file as fallback
      if (!existingContent) {
        const isVercel = !!process.env.VERCEL && process.env.VERCEL === '1'
        
        // Locally, try to read from filesystem first
        if (!isVercel) {
          try {
            // Ensure templatePath has .tsx extension
            const templateFilePath = templatePath.endsWith('.tsx') 
              ? join(process.cwd(), 'src', 'templates', templatePath)
              : join(process.cwd(), 'src', 'templates', `${templatePath}.tsx`)
            console.log('Reading template from file:', templateFilePath)
            existingContent = await readFile(templateFilePath, 'utf-8')
            console.log('Successfully read template file')
          } catch (fileError: unknown) {
            // Template doesn't exist in filesystem either
            // Create from scratch (works both locally and on Vercel)
            console.log('Template not found in filesystem, creating from scratch')
            existingContent = createTemplateFromScratch(templatePath, content, addedComponents)
          }
        } else {
          // On Vercel, if blob doesn't exist, create a new template structure from scratch
          console.log('Creating new template on Vercel from scratch')
          existingContent = createTemplateFromScratch(templatePath, content, addedComponents)
        }
      }
      
      // Update the contentOverrides and addedComponents in the template
      const updatedContent = updateTemplateContent(existingContent, content, addedComponents)
      
      // Save using hybrid storage (local filesystem or Vercel Blob)
      console.log('Saving template to storage, path:', templatePath)
      console.log('Is Vercel:', !!process.env.VERCEL)
      await saveTemplateContent(templatePath, updatedContent)
      console.log('Template saved successfully')

      return NextResponse.json(
        { message: 'Template saved successfully' },
        { status: 200 }
      )
    } catch (storageError) {
      console.error('Storage operation error:', storageError)
      const errorMessage = storageError instanceof Error ? storageError.message : String(storageError)
      const errorStack = storageError instanceof Error ? storageError.stack : undefined
      console.error('Error details:', {
        message: errorMessage,
        stack: errorStack,
        templatePath,
        cwd: process.cwd()
      })
      return NextResponse.json(
        { 
          error: 'Failed to read or write template',
          details: errorMessage,
          stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
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

/**
 * Create a template from scratch when blob doesn't exist on Vercel
 * Uses TemplateWrapper structure for minimal boilerplate
 * Uses generateTemplateCode directly (server-side compatible)
 */
function createTemplateFromScratch(
  templatePath: string,
  content: { [componentId: string]: { [elementId: string]: string } },
  addedComponents: AddedComponent[]
): string {
  return generateTemplateCode(templatePath, content, addedComponents)
}

function updateTemplateContent(
  existingContent: string,
  newContent: { [componentId: string]: { [elementId: string]: string } },
  addedComponents: AddedComponent[]
): string {
  let updatedContent = existingContent
  
  // Update contentOverrides - find the declaration and replace the entire object
  const contentOverridesStartRegex = /const contentOverrides\s*=\s*\{/
  const match = existingContent.match(contentOverridesStartRegex)
  
  if (!match) {
    // If no contentOverrides found, we need to add it
    // Find the line after the imports and before the component function
    const importEnd = existingContent.lastIndexOf('import')
    let insertPosition = existingContent.indexOf('\n', importEnd)
    
    // Find the component function declaration
    const componentMatch = existingContent.match(/export\s+default\s+function/)
    if (componentMatch && componentMatch.index) {
      insertPosition = existingContent.lastIndexOf('\n', componentMatch.index)
    }
    
    if (insertPosition !== -1) {
      const beforeContent = existingContent.substring(0, insertPosition + 1)
      const afterContent = existingContent.substring(insertPosition + 1)
      
      const contentOverridesString = `// Template-specific content overrides\nconst contentOverrides = ${JSON.stringify(newContent, null, 2)}\n\n`
      
      updatedContent = beforeContent + contentOverridesString + afterContent
    }
  } else {
    // Find the start position
    const startIndex = match.index! + match[0].length - 1 // Position of {
    
    // Find the matching closing brace by counting braces
    let braceCount = 0
    let endIndex = startIndex
    let foundEnd = false
    
    for (let i = startIndex; i < existingContent.length; i++) {
      if (existingContent[i] === '{') {
        braceCount++
      } else if (existingContent[i] === '}') {
        braceCount--
        if (braceCount === 0) {
          endIndex = i
          foundEnd = true
          break
        }
      }
    }
    
    if (foundEnd) {
      // Replace from the start of const to the closing brace
      const beforeContent = existingContent.substring(0, match.index!)
      const afterContent = existingContent.substring(endIndex + 1)
      const newContentOverridesString = `const contentOverrides = ${JSON.stringify(newContent, null, 2)}`
      updatedContent = beforeContent + newContentOverridesString + afterContent
    } else {
      // Fallback to regex if brace matching fails
      const contentOverridesRegex = /const contentOverrides\s*=\s*\{[\s\S]*?\n\}/m
      const fallbackMatch = existingContent.match(contentOverridesRegex)
      if (fallbackMatch) {
        const newContentOverridesString = `const contentOverrides = ${JSON.stringify(newContent, null, 2)}`
        updatedContent = existingContent.replace(contentOverridesRegex, newContentOverridesString)
      }
    }
  }
  
  // Update addedComponents
  const addedComponentsRegex = /const addedComponents\s*:\s*AddedComponent\[\]\s*=\s*\[[\s\S]*?\]/m
  const addedComponentsMatch = updatedContent.match(addedComponentsRegex)
  
  const addedComponentsString = `const addedComponents: AddedComponent[] = ${JSON.stringify(addedComponents, null, 2)}`
  
  // Add import for AddedComponent type if not present
  if (!updatedContent.includes('AddedComponent') && addedComponents.length > 0) {
    const lastImportIndex = updatedContent.lastIndexOf('import')
    if (lastImportIndex !== -1) {
      const nextLineAfterLastImport = updatedContent.indexOf('\n', lastImportIndex)
      if (nextLineAfterLastImport !== -1) {
        const beforeLastImport = updatedContent.substring(0, nextLineAfterLastImport + 1)
        const afterLastImport = updatedContent.substring(nextLineAfterLastImport + 1)
        
        // Check if import already exists
        if (!updatedContent.includes("from '@/lib/admin/types'")) {
          updatedContent = beforeLastImport + "import { AddedComponent } from '@/lib/admin/types'\n" + afterLastImport
        }
      }
    }
  }
  
  if (!addedComponentsMatch) {
    // Add addedComponents after contentOverrides
    const contentOverridesEnd = updatedContent.indexOf('const contentOverrides')
    if (contentOverridesEnd !== -1) {
      // Find the end of contentOverrides (the closing brace)
      const closingBraceIndex = updatedContent.indexOf('}', contentOverridesEnd)
      const nextLineAfterContentOverrides = updatedContent.indexOf('\n', closingBraceIndex + 1)
      
      if (nextLineAfterContentOverrides !== -1) {
        const beforeAddedComponents = updatedContent.substring(0, nextLineAfterContentOverrides + 1)
        const afterAddedComponents = updatedContent.substring(nextLineAfterContentOverrides + 1)
        
        updatedContent = beforeAddedComponents + `\n// Dynamically added components\n${addedComponentsString}\n` + afterAddedComponents
      }
    }
  } else {
    // Replace existing addedComponents
    updatedContent = updatedContent.replace(addedComponentsRegex, addedComponentsString)
  }
  
  return updatedContent
}
