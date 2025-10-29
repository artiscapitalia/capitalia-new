// Utility functions for edit-mode components

/**
 * Determines if content should use multiline input based on length and content
 */
export const shouldUseMultilineInput = (content: string): boolean => {
  return content.length > 50 || content.includes('\n')
}

