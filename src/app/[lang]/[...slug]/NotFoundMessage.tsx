'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

interface NotFoundMessageProps {
  templatePath: string
  lang: string
  slug: string[]
}

export const NotFoundMessage: React.FC<NotFoundMessageProps> = ({ templatePath, lang, slug }) => {
  const searchParams = useSearchParams()
  const isCreateMode = searchParams.get('create') === 'true'

  // Don't show 404 message when in create mode
  if (isCreateMode) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-gray-900 mb-4">
          Template Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Looking for template: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{templatePath}.tsx</span>
        </p>
        <p className="text-lg text-gray-600 mb-2">
          Language: <span className="font-semibold">{lang}</span>
        </p>
        <p className="text-lg text-gray-600">
          Path: <span className="font-semibold">/{slug.join('/')}</span>
        </p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-yellow-800">
            Create template at: <br />
            <code className="text-xs">src/templates/{lang}/{templatePath}.tsx</code>
          </p>
        </div>
      </div>
    </div>
  )
}

