// Types for Button element

export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps {
  /**
   * Button text content
   */
  text?: string
  /**
   * Button size variant
   * @default 'medium'
   */
  size?: ButtonSize
  /**
   * Link href (if provided, button renders as Link)
   */
  href?: string
  /**
   * Component ID for inline editing
   */
  componentId?: string
  /**
   * Element ID for inline editing
   */
  elementId?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to wrap button in container (mx-auto px-4 max-w-screen-xl)
   * Set to false when button is inside a component
   * @default true
   */
  withContainer?: boolean
  /**
   * Element key for identification (used for props editing)
   * @default 'button'
   */
  elementKey?: string
}

