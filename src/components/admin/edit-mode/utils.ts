import { PAGE_COMPONENTS, PAGE_ELEMENTS } from '@/components/page'

/**
 * Applies grayscale filter to a component preview container
 * Simple CSS filter approach - applies grayscale to the entire component
 */
export const applyGrayscalePreviewStyles = (
  element: HTMLElement | null
): void => {
  if (!element) return
  element.style.setProperty('filter', 'grayscale(100%)', 'important')
}

/**
 * Removes grayscale filter from a component preview container
 * Restores original colors
 */
export const removeGrayscaleStyles = (
  element: HTMLElement | null
): void => {
  if (!element) return
  element.style.removeProperty('filter')
}

/**
 * Determines whether to use a multiline textarea input based on content length
 * Uses multiline input for content longer than 50 characters or containing line breaks
 */
export const shouldUseMultilineInput = (content: string): boolean => {
  if (!content) return false
  return content.length > 50 || content.includes('\n')
}

/**
 * Gets all editable components from PAGE_COMPONENTS registry
 */
export const getEditableComponents = () => {
  return Object.entries(PAGE_COMPONENTS).filter(
    ([, component]) => component.editable === true
  )
}

/**
 * Gets all editable elements from PAGE_ELEMENTS registry
 */
export const getEditableElements = () => {
  return Object.entries(PAGE_ELEMENTS).filter(
    ([, element]) => element.editable === true
  )
}