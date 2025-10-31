'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PlusIcon } from '@heroicons/react/24/outline'

interface CreatePageButtonProps {
    templatePath: string
}

export const CreatePageButton: React.FC<CreatePageButtonProps> = ({ templatePath }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const isCreateMode = searchParams.get('create') === 'true'

    const handleCreatePage = () => {
        // Navigate to create mode
        router.push(`?create=true`)
    }

    // If in create mode, don't render button - EditModeToggle will handle the toolbar
    if (isCreateMode) {
        return null
    }

    // Show Create page button
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-sm">
            <button
                onClick={handleCreatePage}
                className="bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-full transition-colors flex items-center gap-3 cursor-pointer"
                title="Create page"
            >
                <PlusIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Create page</span>
            </button>
        </div>
    )
}

