'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { CreatePageButton } from '@/components/admin/edit-mode'

interface CreatePageButtonWrapperProps {
  templatePath: string
  lang: string
}

export const CreatePageButtonWrapper: React.FC<CreatePageButtonWrapperProps> = ({ templatePath, lang }) => {
  const searchParams = useSearchParams()
  const isCreateMode = searchParams.get('create') === 'true'

  // Don't show button when in create mode (it's rendered inside CreatePageView)
  if (isCreateMode) {
    return null
  }

  return <CreatePageButton templatePath={templatePath} />
}

