import { AddedComponent } from './types'

/**
 * Extracts contentOverrides from template code
 * Looks for: const contentOverrides = { ... }
 */
export function parseContentOverrides(templateCode: string): Record<string, Record<string, string>> {
  // Match const contentOverrides = { ... } with nested braces support
  const contentOverridesMatch = templateCode.match(/const\s+contentOverrides\s*=\s*(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/m)
  
  if (!contentOverridesMatch) {
    return {}
  }
  
  try {
    // Extract the JSON object
    const jsonStr = contentOverridesMatch[1]
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('Error parsing contentOverrides:', error)
    return {}
  }
}

/**
 * Extracts addedComponents from template code
 * Looks for: const addedComponents: AddedComponent[] = [ ... ]
 * Handles multi-line arrays with nested objects
 */
export function parseAddedComponents(templateCode: string): AddedComponent[] {
  // Find the start of the addedComponents array
  const arrayStartMatch = templateCode.match(/const\s+addedComponents[^=]*=\s*\[/m)
  
  if (!arrayStartMatch || arrayStartMatch.index === undefined) {
    return []
  }
  
  // Find the position of the opening bracket
  const startPos = arrayStartMatch.index + arrayStartMatch[0].length - 1
  
  // Find the matching closing bracket by counting brackets
  let bracketCount = 1 // Start at 1 since we've already found the opening bracket
  let inString = false
  let escapeNext = false
  
  for (let i = startPos + 1; i < templateCode.length; i++) {
    const char = templateCode[i]
    
    if (escapeNext) {
      escapeNext = false
      continue
    }
    
    if (char === '\\') {
      escapeNext = true
      continue
    }
    
    if (char === '"' || char === "'") {
      inString = !inString
      continue
    }
    
    if (!inString) {
      if (char === '[') {
        bracketCount++
      } else if (char === ']') {
        bracketCount--
        if (bracketCount === 0) {
          // Found the matching closing bracket
          const jsonStr = templateCode.substring(startPos, i + 1)
          try {
            return JSON.parse(jsonStr)
          } catch (error) {
            console.error('Error parsing addedComponents:', error)
            return []
          }
        }
      }
    }
  }
  
  return []
}

/**
 * Extracts template path from template code
 * Looks for: templatePath="${templatePath}" in InlineEditProvider
 */
export function parseTemplatePath(templateCode: string): string | null {
  const templatePathMatch = templateCode.match(/templatePath=["']([^"']+)["']/)
  
  if (!templatePathMatch) {
    return null
  }
  
  return templatePathMatch[1]
}

/**
 * Extracts className from template code
 * Looks for: className="${className}" in TemplateWrapper
 */
export function parseClassName(templateCode: string): string | null {
  // Look specifically for className in TemplateWrapper component
  const templateWrapperMatch = templateCode.match(/<TemplateWrapper[^>]*className=["']([^"']+)["']/)
  
  if (!templateWrapperMatch) {
    return null
  }
  
  return templateWrapperMatch[1]
}

/**
 * Parses all relevant data from template code
 */
export interface ParsedTemplateData {
  contentOverrides: Record<string, Record<string, string>>
  addedComponents: AddedComponent[]
  templatePath: string | null
  className: string | null
}

export function parseTemplate(templateCode: string): ParsedTemplateData {
  return {
    contentOverrides: parseContentOverrides(templateCode),
    addedComponents: parseAddedComponents(templateCode),
    templatePath: parseTemplatePath(templateCode),
    className: parseClassName(templateCode)
  }
}

