'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PAGE_COMPONENTS } from '@/components/page'
import { applyGrayscalePreviewStyles, removeGrayscaleStyles } from './utils'

interface ComponentPreviewProps {
  componentKey: string
  component: (typeof PAGE_COMPONENTS)[keyof typeof PAGE_COMPONENTS]
  onClick: () => void
}

/**
 * Renders a single component preview showing the component in grayscale by default
 * On hover, shows the component in original colors
 * Full width display in the modal
 */
export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  componentKey,
  component,
  onClick,
}) => {
  const previewRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Load component dynamically
  useEffect(() => {
    let isMounted = true

    const loadComponent = async () => {
      try {
        const module = await component.component()
        
        // Try to get the component - could be default or named export
        let ComponentToRender: React.ComponentType<any> | null = null
        
        if ('default' in module && module.default) {
          ComponentToRender = module.default
        } else {
          // Look for named exports matching the component key
          const componentName = componentKey.charAt(0).toUpperCase() + componentKey.slice(1)
          if (componentName in module) {
            ComponentToRender = (module as any)[componentName]
          } else {
            // Get the first exported component
            const keys = Object.keys(module)
            for (const key of keys) {
              const exported = (module as any)[key]
              if (typeof exported === 'function' && exported.prototype && exported.prototype.isReactComponent) {
                ComponentToRender = exported
                break
              } else if (typeof exported === 'function') {
                ComponentToRender = exported
                break
              }
            }
          }
        }
        
        if (isMounted && ComponentToRender) {
          setComponent(() => ComponentToRender)
        }
      } catch (error) {
        console.error(`Failed to load component ${componentKey}:`, error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadComponent()

    return () => {
      isMounted = false
    }
  }, [componentKey, component])

  // Apply or remove grayscale filter based on hover state
  useEffect(() => {
    if (previewRef.current) {
      if (isHovered) {
        removeGrayscaleStyles(previewRef.current)
      } else {
        applyGrayscalePreviewStyles(previewRef.current)
      }
    }
  }, [isHovered])

  // Adjust wrapper height to compensate for scale
  useEffect(() => {
    if (!isLoading && Component && wrapperRef.current) {
      const timeoutId = setTimeout(() => {
        if (wrapperRef.current && previewRef.current) {
          // Get the actual content height from previewRef
          const originalHeight = previewRef.current.scrollHeight
          // Scale is 0.5, so actual displayed height is half
          // py-8 = 2rem top + 2rem bottom = 64px total
          const paddingY = 64
          // Add small padding to ensure bottom is visible
          const actualDisplayedHeight = originalHeight * 0.5 + paddingY + 10
          // Set wrapper height to match the scaled height including padding
          wrapperRef.current.style.height = `${actualDisplayedHeight}px`
        }
      }, 150)

      return () => clearTimeout(timeoutId)
    }
  }, [Component, isLoading])

  const defaultProps = component.defaultProps || {}

  return (
    <div
      className="flex flex-col w-full border border-gray-300 rounded-lg hover:border-gray-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Component header */}
      <div className="p-4 bg-gray-300 rounded-t-lg flex-shrink-0 h-auto border-b border-gray-300">
        <div className="font-medium text-sm text-black">{component.name}</div>
        {component.description && (
          <div className="text-xs text-gray-700 mt-1">{component.description}</div>
        )}
      </div>
      
      {/* Preview container */}
      <div className="rounded-b-lg overflow-hidden bg-white w-full">
        <div ref={wrapperRef} className="overflow-visible flex-shrink-0 py-8 px-4">
        <div
          className="bg-white w-full relative [&_[title*='Click']]:hover:!outline-none [&_[title*='Click']]:hover:!outline-offset-0 [&_[title*='Click']]:hover:!bg-transparent [&_.cursor-pointer]:hover:!outline-none [&_.cursor-pointer]:hover:!outline-offset-0 [&_.cursor-pointer]:hover:!bg-transparent"
          style={{
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
            width: '200%', // Compensate for scale(0.5): 100% / 0.5 = 200%
          }}
        >
          <div ref={previewRef}>
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="animate-pulse">Loading preview...</div>
              </div>
            ) : Component ? (
              <>
                <Component {...defaultProps} />
                {/* Visual indicator for spacing components */}
                {componentKey === 'spacing' && (
                  <div className="absolute inset-0 border-2 border-dashed border-gray-300 bg-gray-100/30 flex items-center justify-center pointer-events-none">
                    <span className="text-xs text-gray-500 font-medium">
                      Spacing: {('height' in defaultProps ? defaultProps.height : 40)}px
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                Failed to load component
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
