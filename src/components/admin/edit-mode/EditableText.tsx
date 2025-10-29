'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { EditableTextProps } from './types'
import { shouldUseMultilineInput } from './utils'

export const EditableText: React.FC<EditableTextProps> = ({
  componentId,
  elementId,
  defaultContent,
  className = '',
  tag = 'span',
  children
}) => {
  const { isEditMode, templateContent, updateContent } = useInlineEdit()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  // Get content from template or use default
  const currentContent = templateContent[componentId]?.[elementId] || defaultContent

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    if (!isEditMode) return
    setEditValue(currentContent)
    setIsEditing(true)
  }

  const handleSave = () => {
    updateContent(componentId, elementId, editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue('')
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const Tag = tag as keyof JSX.IntrinsicElements

  if (isEditing) {
    const isMultiline = shouldUseMultilineInput(currentContent)
    
    if (isMultiline) {
      return (
        <div className="relative inline-block w-full">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`${className} inline-edit-textarea border-2 border-blue-500 rounded px-2 py-1 resize-none`}
            rows={3}
          />
        </div>
      )
    } else {
      return (
        <div className="relative inline-block">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`${className} inline-edit-input border-2 border-blue-500 rounded px-2 py-1`}
          />
        </div>
      )
    }
  }

  return (
    <Tag
      className={`${className} ${isEditMode ? 'cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 transition-all duration-200' : ''}`}
      onClick={handleStartEdit}
      title={isEditMode ? 'Click to edit' : undefined}
    >
      {children || currentContent}
    </Tag>
  )
}

