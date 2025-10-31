import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'
import React from 'react'
import { InlineEditProvider } from '@/lib/admin/InlineEditContext'
import { EditModeToggle, TemplateWrapper } from '@/components/admin/edit-mode'
import { TemplateData, AddedComponent, TemplateContent } from '@/lib/admin/types'

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
        const { put, list, head, getDownloadUrl } = await import('@vercel/blob')
        return { put, list, head, getDownloadUrl }
    }
    return null
}

/**
 * Get blob URL directly from pathname
 */
async function getBlobUrlDirect(blobPath: string): Promise<string | null> {
    if (!isVercel()) {
        return null
    }

    const blobFunctions = await getBlobFunctions()
    if (!blobFunctions) {
        return null
    }

    try {
        const { blobs } = await blobFunctions.list({
            prefix: blobPath,
            limit: 1
        })

        const blob = blobs?.find(b => b.pathname === blobPath)

        if (!blob || !blob.url) {
            return null
        }

        return blob.url
    } catch {
        return null
    }
}

/**
 * Get storage path for a template (blob or filesystem)
 * Always uses .json extension
 */
function getBlobPath(templatePath: string): string {
    // Remove any extension if present and construct path with .json
    const path = templatePath.replace(/\.(tsx|json)$/, '')
    return `templates/${path}.json`
}

/**
 * Get local filesystem path for a template
 * Always uses .json extension
 */
function getLocalTemplatePath(templatePath: string): string {
    // Remove any extension if present and add .json
    const path = templatePath.replace(/\.(tsx|json)$/, '')
    return `${path}.json`
}

/**
 * Generate className from template path
 * Used for creating templates from JSON data
 */
function getTemplateClassName(templatePath: string): string {
    // Remove any extension (.tsx, .json) and get filename
    const pathParts = templatePath.replace(/\.(tsx|json)$/, '').split('/')
    const fileName = pathParts[pathParts.length - 1]
    return `template-${fileName.replace(/[^a-zA-Z0-9]/g, '-')}`
}

/**
 * Create React component from TemplateData JSON structure
 */
function createComponentFromTemplateData(
    templateData: TemplateData
): React.ComponentType {
    const contentHash = JSON.stringify(templateData.contentOverrides) + JSON.stringify(templateData.addedComponents)
    const componentKey = `${templateData.templatePath}-${contentHash.length}`

    return function TemplateFromJson() {
        const wrapperElement = React.createElement(
            TemplateWrapper,
            { className: templateData.className },
            React.createElement(EditModeToggle)
        )

        return React.createElement(
            InlineEditProvider,
            {
                key: componentKey,
                templatePath: templateData.templatePath,
                initialContent: templateData.contentOverrides,
                initialComponents: templateData.addedComponents
            } as any,
            wrapperElement
        )
    }
}

/**
 * Save template data - always saves as JSON (local filesystem or Vercel Blob Storage)
 */
export async function saveTemplateContent(
    templatePath: string,
    content: TemplateContent,
    addedComponents: AddedComponent[]
): Promise<void> {
    const templateData: TemplateData = {
        templatePath,
        className: getTemplateClassName(templatePath),
        contentOverrides: content,
        addedComponents
    }

    const jsonContent = JSON.stringify(templateData, null, 2)

    if (isVercel()) {
        const blobFunctions = await getBlobFunctions()
        if (!blobFunctions) {
            throw new Error('Blob functions not available')
        }

        const blobPath = getBlobPath(templatePath)

        await blobFunctions.put(blobPath, jsonContent, {
            access: 'public',
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: 'application/json',
            cacheControlMaxAge: 0,
        })
    } else {
        const normalizedPath = templatePath.endsWith('.json') ? templatePath : `${templatePath}.json`
        const templateFilePath = join(process.cwd(), 'src', 'templates', normalizedPath)
        const templateDir = dirname(templateFilePath)

        try {
            if (!existsSync(templateDir)) {
                await mkdir(templateDir, { recursive: true })
            }

            await writeFile(templateFilePath, jsonContent, 'utf-8')
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to write template file: ${errorMessage}`)
        }
    }
}

/**
 * Read template data - always reads JSON (local filesystem or Vercel Blob Storage)
 * Returns TemplateData or null
 */
export async function readTemplateData(templatePath: string): Promise<TemplateData | null> {
    if (isVercel()) {
        const blobFunctions = await getBlobFunctions()
        if (!blobFunctions) {
            return null
        }

        const blobPath = getBlobPath(templatePath)
        try {
            const blobUrl = await getBlobUrlDirect(blobPath)

            if (!blobUrl) {
                return null
            }

            let timestamp = Date.now()
            let random = Math.random().toString(36).substring(7)
            const separator = blobUrl.includes('?') ? '&' : '?'
            let urlWithCacheBust = `${blobUrl}${separator}_t=${timestamp}&_r=${random}&_nocache=1`

            let response: Response | null = null
            const retries = 3

            for (let i = 0; i < retries; i++) {
                response = await fetch(urlWithCacheBust, {
                    cache: 'no-store',
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                        'X-Request-ID': `template-read-${timestamp}-${i}`
                    }
                })

                if (response.status === 304) {
                    if (i < retries - 1) {
                        timestamp = Date.now()
                        random = Math.random().toString(36).substring(7)
                        urlWithCacheBust = `${blobUrl}${separator}_t=${timestamp}&_r=${random}&_nocache=1&_retry=${i + 1}`
                        continue
                    } else {
                        return null
                    }
                }

                break
            }

            if (!response || !response.ok) {
                return null
            }

            const jsonContent = await response.text()
            const templateData: TemplateData = JSON.parse(jsonContent)
            return templateData
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            const isBlobNotFound =
                errorMessage.includes('blob does not exist') ||
                errorMessage.includes('Blob: The requested blob does not exist') ||
                (error && typeof error === 'object' &&
                    ('name' in error && error.name === 'BlobNotFoundError' ||
                        'status' in error && (error.status === 404 || error.status === '404') ||
                        'code' in error && (error.code === 'ENOENT' || error.code === 'NOT_FOUND')))

            if (isBlobNotFound) {
                return null
            }
            return null
        }
    } else {
        const jsonPath = getLocalTemplatePath(templatePath)
        const templateFilePath = join(process.cwd(), 'src', 'templates', jsonPath)

        try {
            const jsonContent = await readFile(templateFilePath, 'utf-8')
            const templateData: TemplateData = JSON.parse(jsonContent)
            return templateData
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
                return null
            }
            return null
        }
    }
}

/**
 * Read template content and return as React component
 * Always reads from JSON (local filesystem or Vercel Blob Storage)
 */
export async function readTemplateContent(templatePath: string): Promise<React.ComponentType | null> {
    const templateData = await readTemplateData(templatePath)

    if (!templateData) {
        return null
    }

    return createComponentFromTemplateData(templateData)
}

/**
 * Check if template exists in storage
 * Always checks for JSON files
 */
export async function templateExists(templatePath: string): Promise<boolean> {
    if (isVercel()) {
        const blobFunctions = await getBlobFunctions()
        if (!blobFunctions) {
            return false
        }

        const blobPath = getBlobPath(templatePath)
        try {
            await blobFunctions.head(blobPath)
            return true
        } catch {
            return false
        }
    } else {
        const jsonPath = getLocalTemplatePath(templatePath)
        const templateFilePath = join(process.cwd(), 'src', 'templates', jsonPath)
        try {
            await readFile(templateFilePath, 'utf-8')
            return true
        } catch {
            return false
        }
    }
}

