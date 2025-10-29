'use client'

import React, { useState, useEffect } from 'react'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { PAGE_COMPONENTS } from '@/components/page'

// Dynamic component renderer
const DynamicComponent: React.FC<{ componentKey: string; props?: Record<string, unknown> }> = ({ componentKey, props }) => {
    const [Component, setComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null)

    useEffect(() => {
        const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
        if (componentDef) {
            componentDef.component().then(module => {
                // Handle default export or named export
                const moduleExports = module as any
                let ComponentToUse: React.ComponentType<Record<string, unknown>> | undefined

                if (moduleExports.default) {
                    ComponentToUse = moduleExports.default
                } else {
                    // Try to find the component by name in the module
                    ComponentToUse = moduleExports[componentDef.name] || moduleExports[componentKey]
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
    const componentDef = PAGE_COMPONENTS[componentKey as keyof typeof PAGE_COMPONENTS]
    const mergedProps = { ...componentDef?.defaultProps, ...props }

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
                <div key={addedComponent.id} className="my-4">
                    <DynamicComponent
                        componentKey={addedComponent.componentKey}
                        props={addedComponent.props}
                    />
                </div>
            ))}
        </div>
    )
}

