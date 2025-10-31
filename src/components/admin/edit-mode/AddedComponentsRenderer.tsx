'use client'

import React, { useState, useEffect } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PAGE_COMPONENTS, PAGE_ELEMENTS } from '@/components/page'
import { DynamicModule } from './types'
import { ComponentWrapper } from './ComponentWrapper'

// Dynamic component renderer
const DynamicComponent: React.FC<{ componentKey: string; componentId: string; props?: Record<string, unknown> }> = ({ componentKey, componentId, props }) => {
    const [Component, setComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null)

    useEffect(() => {
        // Check if it's a component or element
        const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
        const elementDef = PAGE_ELEMENTS[componentKey as keyof typeof PAGE_ELEMENTS]
        const def = componentDef || elementDef
        
        if (def) {
            def.component().then(module => {
                // Handle default export or named export
                const moduleExports = module as DynamicModule
                let ComponentToUse: React.ComponentType<Record<string, unknown>> | undefined

                if (moduleExports.default) {
                    ComponentToUse = moduleExports.default
                } else {
                    // Try to find the component by name in the module
                    const namedExport = moduleExports[def.name] || moduleExports[componentKey]
                    ComponentToUse = namedExport as React.ComponentType<Record<string, unknown>> | undefined
                }

                if (ComponentToUse) {
                    setComponent(() => ComponentToUse)
                } else {
                    console.error(`Component ${componentKey} not found in module`)
                }
            }).catch(error => {
                console.error(`Failed to load component ${componentKey}:`, error)
            })
        }
    }, [componentKey])

    if (!Component) {
        return <div></div>
    }

    // Merge default props with provided props
    // CRITICAL: Always read defaultProps directly from registry - never modify them
    // Text changes are stored in templateContent, not in defaultProps
    const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
    const elementDef = PAGE_ELEMENTS[componentKey as keyof typeof PAGE_ELEMENTS]
    const def = componentDef || elementDef
    
    // Create a shallow copy of defaultProps to avoid mutating the original
    // Props from addedComponents are merged on top, but text content is handled by EditableText via templateContent
    // CRITICAL: Pass unique componentId prop to each component instance
    // This ensures each component instance has its own unique text content in templateContent
    // Props from addedComponents override defaultProps and are used for prop editor values
    const defaultPropsCopy = def?.defaultProps ? { ...def.defaultProps } : {}
    // Merge props from addedComponents (includes prop editor changes)
    const mergedProps = { ...defaultPropsCopy, ...props, componentId }

    return <Component {...mergedProps} />
}

// Component that renders all added components (always visible)
export const AddedComponentsRenderer: React.FC = () => {
    const { addedComponents } = useInlineEdit()

    if (addedComponents.length === 0) {
        return null
    }

    return (
        <div className="mx-auto max-w-screen-xl">
            {addedComponents.map((addedComponent) => (
                <ComponentWrapper 
                    key={addedComponent.id} 
                    componentId={addedComponent.id}
                    isHidden={addedComponent.isHidden}
                >
                    <div className="my-4">
                        <DynamicComponent
                            componentKey={addedComponent.componentKey}
                            componentId={addedComponent.id}
                            props={addedComponent.props}
                        />
                    </div>
                </ComponentWrapper>
            ))}
        </div>
    )
}

