import React from 'react'
import { SpacingProps } from './types'

export const Spacing: React.FC<SpacingProps> = ({ 
  height = 40,
  className = ''
}) => {
  return (
    <div 
      className={className}
      style={{ height: `${height}px`, width: '100%' }}
      aria-hidden="true"
    />
  )
}

