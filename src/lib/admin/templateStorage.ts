import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

/**
 * Check if we're running on Vercel
 * On Vercel, VERCEL env var is typically "1", not "false"
 */
function isVercel(): boolean {
  const vercelEnv = process.env.VERCEL
  const vercelEnvVar = process.env.VERCEL_ENV
  
  // Only return true if VERCEL is explicitly "1" or VERCEL_ENV is set
  // This ignores manual VERCEL=false entries in .env.local
  return vercelEnv === '1' || !!vercelEnvVar
}

// Lazy load Vercel Blob only when needed (on Vercel)
async function getBlobFunctions() {
  if (isVercel()) {
    const { put, head, getDownloadUrl } = await import('@vercel/blob')
    return { put, head, getDownloadUrl }
  }
  return null
}

/**
 * Get blob path for a template
 */
function getBlobPath(templatePath: string): string {
  // Remove .tsx extension if present and construct path
  const path = templatePath.replace(/\.tsx$/, '')
  return `templates/${path}.tsx`
}

/**
 * Save template content - hybrid: local filesystem or Vercel Blob Storage
 */
export async function saveTemplateContent(
  templatePath: string,
  updatedContent: string
): Promise<void> {
  if (isVercel()) {
    // Save to Vercel Blob Storage
    const blobFunctions = await getBlobFunctions()
    if (!blobFunctions) {
      throw new Error('Blob functions not available')
    }
    const blobPath = getBlobPath(templatePath)
    await blobFunctions.put(blobPath, updatedContent, {
      access: 'public',
      addRandomSuffix: false, // Keep original path
      contentType: 'text/typescript',
    })
  } else {
    // Save to local filesystem
    const templateFilePath = join(process.cwd(), 'src', 'templates', templatePath)
    try {
      console.log('Writing to local filesystem:', templateFilePath)
      await writeFile(templateFilePath, updatedContent, 'utf-8')
      console.log('Successfully wrote to local filesystem')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : undefined
      console.error('Error writing to local filesystem:', {
        error: errorMessage,
        code: errorCode,
        path: templateFilePath,
        cwd: process.cwd()
      })
      throw new Error(`Failed to write template file: ${errorMessage}`)
    }
  }
}

/**
 * Read template content - hybrid: local filesystem or Vercel Blob Storage
 */
export async function readTemplateContent(templatePath: string): Promise<string | null> {
  if (isVercel()) {
    // Read from Vercel Blob Storage
    const blobFunctions = await getBlobFunctions()
    if (!blobFunctions) {
      // Fallback to file if blob functions not available
      const templateFilePath = join(process.cwd(), 'src', 'templates', templatePath)
      try {
        return await readFile(templateFilePath, 'utf-8')
      } catch {
        return null
      }
    }
    
    const blobPath = getBlobPath(templatePath)
    try {
      // First check if blob exists
      const blobInfo = await blobFunctions.head(blobPath)
      
      if (!blobInfo) {
        return null
      }

      // Get download URL and fetch the content
      const downloadUrl = await blobFunctions.getDownloadUrl(blobPath)
      const response = await fetch(downloadUrl)
      
      if (!response.ok) {
        return null
      }
      
      return await response.text()
    } catch (error: unknown) {
      // If blob doesn't exist, return null (will fallback to file)
      const isBlobNotFound = error && 
        typeof error === 'object' && 
        ('name' in error && error.name === 'BlobNotFoundError' ||
         'status' in error && error.status === 404 ||
         'code' in error && error.code === 'ENOENT')
      
      if (isBlobNotFound) {
        return null
      }
      throw error
    }
  } else {
    // Read from local filesystem
    const templateFilePath = join(process.cwd(), 'src', 'templates', templatePath)
    try {
      return await readFile(templateFilePath, 'utf-8')
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return null
      }
      throw error
    }
  }
}

/**
 * Check if template exists in storage
 */
export async function templateExists(templatePath: string): Promise<boolean> {
  if (isVercel()) {
    const blobFunctions = await getBlobFunctions()
    if (!blobFunctions) {
      // Fallback to check file
      const templateFilePath = join(process.cwd(), 'src', 'templates', templatePath)
      try {
        await readFile(templateFilePath, 'utf-8')
        return true
      } catch {
        return false
      }
    }
    
    const blobPath = getBlobPath(templatePath)
    try {
      await blobFunctions.head(blobPath)
      return true
    } catch {
      return false
    }
  } else {
    const templateFilePath = join(process.cwd(), 'src', 'templates', templatePath)
    try {
      await readFile(templateFilePath, 'utf-8')
      return true
    } catch {
      return false
    }
  }
}

