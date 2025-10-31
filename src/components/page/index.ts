// Page components exports
export { default as Header } from './header';
export type { HeaderProps, NavigationItem } from './header';
export { Intro } from './intro';
export { OurAdvantages } from './our-advantages';
export type { OurAdvantagesProps, AdvantageItem } from './our-advantages';
export { Spacing } from './spacing';
export type { SpacingProps } from './spacing';

// Types exports
export type {
    BasePageComponentProps,
    StyleProps,
    ComponentMeta,
    PageComponentDefinition,
    PageStructure,
    ComponentEditEvent,
} from './types';

// Prop definition exports
export type { PropDefinition } from '@/lib/admin/types';

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
        props: [],
    },
    'our-advantages': {
        name: 'OurAdvantages',
        description: 'Section displaying company advantages with icons, titles, descriptions and call-to-action button',
        component: () => import('./our-advantages'),
        category: 'content',
        editable: true,
        defaultProps: {
            lang: 'lv',
        },
        props: [],
    },
    spacing: {
        name: 'Spacing',
        description: 'Add vertical spacing between components',
        component: () => import('./spacing'),
        category: 'layout',
        editable: true,
        defaultProps: {
            height: 40,
        },
        props: [],
    },
} as const;

// Element registry for the page builder
export const PAGE_ELEMENTS = {
    button: {
        name: 'Button',
        description: 'Reusable button element with customizable size and text',
        component: () => import('./elements/button'),
        category: 'interactive',
        editable: true,
        defaultProps: {
            text: 'Button text here',
            size: 'medium',
        },
        props: [
            {
                name: 'size',
                label: 'Size',
                type: 'select',
                values: [
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                ],
                defaultValue: 'medium',
                description: 'Button size variant',
            },
        ],
    },
} as const;
