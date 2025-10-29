import { AddedComponent } from './types'

/**
 * Generate component name from template path
 * e.g., "lv/finansejums/finansejums-uznemumam.tsx" -> "FinansejumsUznemumamTemplate"
 */
export function getComponentName(templatePath: string): string {
  const pathParts = templatePath.replace(/\.tsx$/, '').split('/')
  const fileName = pathParts[pathParts.length - 1]
  return fileName
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Template'
}

/**
 * Generate className from template path
 * e.g., "lv/finansejums/finansejums-uznemumam.tsx" -> "template-finansejums-uznemumam"
 */
export function getTemplateClassName(templatePath: string): string {
  const pathParts = templatePath.replace(/\.tsx$/, '').split('/')
  const fileName = pathParts[pathParts.length - 1]
  return `template-${fileName.replace(/[^a-zA-Z0-9]/g, '-')}`
}

/**
 * Generate template imports section
 */
export function getTemplateImports(): string {
  return `import React from 'react'
import { InlineEditProvider } from '@/lib/admin/InlineEditContext'
import { EditModeToggle, TemplateWrapper } from '@/components/admin/edit-mode'
import { AddedComponent } from '@/lib/admin/types'
`
}

/**
 * Generate template interface section
 */
export function getTemplateInterface(): string {
  return `interface TemplateProps {
  lang: string
}
`
}

/**
 * Generate template structure using TemplateWrapper
 * Returns the component JSX structure with TemplateWrapper
 */
export function getTemplateStructure(
  templatePath: string,
  componentName: string,
  className: string
): string {
  return `export default function ${componentName}({ lang }: TemplateProps) {
  return (
    <InlineEditProvider
      templatePath="${templatePath}"
      initialContent={contentOverrides}
      initialComponents={addedComponents}
    >
      <TemplateWrapper className="${className}">
        <EditModeToggle />
      </TemplateWrapper>
    </InlineEditProvider>
  )
}
`
}

/**
 * Generate complete template code from scratch
 * Uses TemplateWrapper structure for minimal boilerplate
 */
export function generateTemplateCode(
  templatePath: string,
  content: { [componentId: string]: { [elementId: string]: string } },
  addedComponents: AddedComponent[]
): string {
  const componentName = getComponentName(templatePath)
  const className = getTemplateClassName(templatePath)
  const contentOverrides = JSON.stringify(content, null, 2)
  const addedComponentsString = JSON.stringify(addedComponents, null, 2)
  
  const imports = getTemplateImports()
  const templateProps = getTemplateInterface()
  const contentOverridesConst = `// Template-specific content overrides
const contentOverrides = ${contentOverrides}

`
  const addedComponentsConst = `// Dynamically added components
const addedComponents: AddedComponent[] = ${addedComponentsString}

`
  const structure = getTemplateStructure(
    templatePath,
    componentName,
    className
  )
  
  return imports + '\n' + templateProps + '\n' + contentOverridesConst + addedComponentsConst + structure
}

