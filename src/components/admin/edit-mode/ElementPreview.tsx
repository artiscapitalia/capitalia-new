'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PAGE_ELEMENTS } from '@/components/page'
import { applyGrayscalePreviewStyles, removeGrayscaleStyles } from './utils'

interface ElementPreviewProps {
    elementKey: string
    element: (typeof PAGE_ELEMENTS)[keyof typeof PAGE_ELEMENTS]
    onClick: () => void
}

/**
 * Renders a single element preview showing the element in grayscale by default
 * On hover, shows the element in original colors
 * Full width display in the modal
 */
export const ElementPreview: React.FC<ElementPreviewProps> = ({
    elementKey,
    element,
    onClick,
}) => {
    const previewRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [Element, setElement] = useState<React.ComponentType<any> | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    // Load element dynamically
    useEffect(() => {
        let isMounted = true

        const loadElement = async () => {
            try {
                const module = await element.component()

                // Try to get the element - could be default or named export
                let ElementToRender: React.ComponentType<any> | null = null

                if ('default' in module && module.default && typeof module.default === 'function') {
                    ElementToRender = module.default as React.ComponentType<any>
                } else {
                    // Look for named exports matching the element key
                    const elementName = elementKey.charAt(0).toUpperCase() + elementKey.slice(1)
                    if (elementName in module) {
                        const exported = (module as any)[elementName]
                        if (typeof exported === 'function') {
                            ElementToRender = exported
                        }
                    } else {
                        // Get the first exported component
                        const keys = Object.keys(module)
                        for (const key of keys) {
                            const exported = (module as any)[key]
                            if (typeof exported === 'function' && exported.prototype && exported.prototype.isReactComponent) {
                                ElementToRender = exported
                                break
                            } else if (typeof exported === 'function') {
                                ElementToRender = exported
                                break
                            }
                        }
                    }
                }

                if (isMounted && ElementToRender) {
                    setElement(() => ElementToRender)
                }
            } catch (error) {
                console.error(`Failed to load element ${elementKey}:`, error)
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadElement()

        return () => {
            isMounted = false
        }
    }, [elementKey, element])

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
        if (!isLoading && Element && wrapperRef.current) {
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
    }, [Element, isLoading])

    const defaultProps = element.defaultProps || {}

    return (
        <div
            className="flex flex-col w-full border border-gray-300 rounded-lg hover:border-gray-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Element header */}
            <div className="p-4 bg-gray-300 rounded-t-lg flex-shrink-0 h-auto border-b border-gray-300">
                <div className="font-medium text-sm text-black">{element.name}</div>
                {element.description && (
                    <div className="text-xs text-gray-700 mt-1">{element.description}</div>
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
                            ) : Element ? (
                                <>
                                    {/* Override container width classes in preview modal */}
                                    <div className="[&_.mx-auto]:mx-0 [&_.px-4]:px-0 [&_.max-w-screen-xl]:max-w-none [&_>_*]:w-full">
                                        <Element {...defaultProps} />
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-32 text-gray-400">
                                    Failed to load element
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

