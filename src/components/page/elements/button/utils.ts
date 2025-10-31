// Utility functions for Button element

import { ButtonSize } from './types'

/**
 * Returns Tailwind CSS classes for button size
 */
export const getButtonSizeClasses = (size: ButtonSize = 'medium'): string => {
  switch (size) {
    case 'small':
      return 'px-3 py-1.5 text-sm'
    case 'medium':
      return 'px-[18px] py-3 text-lg'
    case 'large':
      return 'px-6 py-4 text-xl'
    default:
      return 'px-[18px] py-3 text-lg'
  }
}

