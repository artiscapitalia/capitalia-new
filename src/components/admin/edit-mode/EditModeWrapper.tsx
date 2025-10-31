'use client'

import React from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'

interface EditModeWrapperProps {
  children: React.ReactNode
}

/**
 * EditModeWrapper adds padding at the bottom of the page when edit mode is active
 * This ensures the fixed toolbar at the bottom doesn't cover the last component's separator
 */
export const EditModeWrapper: React.FC<EditModeWrapperProps> = ({ children }) => {
  const { isEditMode } = useInlineEdit()

  return (
    <div className={isEditMode ? 'pb-[150px]' : ''}>
      {children}
    </div>
  )
}

