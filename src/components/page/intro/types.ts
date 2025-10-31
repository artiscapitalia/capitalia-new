// Types for Intro component

export interface TemplateContent {
  [componentId: string]: {
    [elementId: string]: string
  }
}

export interface IntroProps {
  lang?: string
  contentOverrides?: TemplateContent
  componentId?: string
}

