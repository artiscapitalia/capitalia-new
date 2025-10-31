// Types for OurAdvantages component

export interface TemplateContent {
  [componentId: string]: {
    [elementId: string]: string
  }
}

export interface AdvantageItem {
  id: string
  title: string
  description: string
  svgPath: string
}

export interface OurAdvantagesProps {
  lang?: string
  contentOverrides?: TemplateContent
}
