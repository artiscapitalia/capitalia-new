// Page components exports
export { default as Header } from './header';
export type { HeaderProps, NavigationItem } from './header';
export { Intro } from './intro';

// Types exports
export type {
    BasePageComponentProps,
    StyleProps,
    ComponentMeta,
    PageComponentDefinition,
    PageStructure,
    ComponentEditEvent,
} from './types';

// Component registry for the page builder
export const PAGE_COMPONENTS = {
    header: {
        name: 'Header',
        description: 'A comprehensive header with logo, navigation, login buttons, and language switcher',
        component: () => import('./header'),
        category: 'navigation',
        editable: false,
        defaultProps: {
            currentLanguage: 'lv',
        },
    },
    intro: {
        name: 'Intro',
        description: 'Introduction section with heading, description, image and call-to-action button',
        component: () => import('./intro'),
        category: 'content',
        editable: true,
        defaultProps: {
            lang: 'lv',
        },
    },
} as const;
