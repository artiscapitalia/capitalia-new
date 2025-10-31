import React from 'react'
import Link from 'next/link'
import { EditableText, ElementsWrapper } from '@/components/admin/edit-mode'
import { useInlineEdit } from '@/lib/admin/InlineEditContext'
import { ButtonProps } from './types'
import { getButtonSizeClasses } from './utils'

export const Button: React.FC<ButtonProps> = ({
  text = 'Button text here',
  size = 'medium',
  href,
  componentId = 'button',
  elementId = 'button-text',
  className = '',
  withContainer = true,
  elementKey = 'button'
}) => {
  const { getElementProps, addedComponents } = useInlineEdit()
  
  // Check if this is a standalone element (componentId corresponds to an element in addedComponents)
  // or if it's an element within a component (componentId corresponds to a component in addedComponents)
  const standaloneElement = addedComponents.find(comp => comp.id === componentId && comp.componentKey === elementKey)
  const isStandalone = !!standaloneElement
  
  // Get element props - either from addedComponents (for standalone elements) or from elementProps (for elements within components)
  let actualSize = size
  if (componentId && elementId) {
    if (isStandalone) {
      // For standalone elements, get props from addedComponents
      const props = standaloneElement?.props || {}
      if (props.size !== undefined) {
        actualSize = props.size as 'small' | 'medium' | 'large'
      }
    } else {
      // For elements within components, get props from elementProps
      const elementProps = getElementProps(componentId, elementId)
      if (elementProps.size !== undefined) {
        actualSize = elementProps.size as 'small' | 'medium' | 'large'
      }
    }
  }
  
  const sizeClasses = getButtonSizeClasses(actualSize)
  const baseClasses = 'inline-block font-semibold text-white bg-[#1375e0] border border-[#1375e0] rounded no-underline outline-none'

  const buttonContent = (
    <EditableText
      componentId={componentId}
      elementId={elementId}
      defaultContent={text}
      tag="span"
    />
  )

  const buttonClasses = `${baseClasses} ${sizeClasses} ${className}`.trim()

  const buttonElement = href ? (
    <Link href={href} className={buttonClasses}>
      {buttonContent}
    </Link>
  ) : (
    <button type="button" className={buttonClasses}>
      {buttonContent}
    </button>
  )

  // Wrap button with ElementsWrapper if componentId and elementId are provided
  const wrappedButton = componentId && elementId ? (
    <ElementsWrapper
      elementKey={elementKey}
      componentId={componentId}
      elementId={elementId}
    >
      {buttonElement}
    </ElementsWrapper>
  ) : buttonElement

  if (!withContainer) {
    return wrappedButton
  }

  return (
    <div className="mx-auto px-4 max-w-screen-xl">
      {wrappedButton}
    </div>
  )
}

