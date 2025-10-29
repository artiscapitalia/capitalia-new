// Base interface for all page components
export interface BasePageComponentProps {
  id?: string;
  className?: string;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
}

// Common styling props that many components might share
export interface StyleProps {
  backgroundColor?: string;
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
}

// Component metadata for the page builder system
export interface ComponentMeta {
  type: string;
  name: string;
  description?: string;
  category?: string;
  editable?: boolean;
  defaultProps?: Record<string, unknown>;
}

// Page component registration interface
export interface PageComponentDefinition {
  component: React.ComponentType<Record<string, unknown>>;
  meta: ComponentMeta;
  props?: Record<string, unknown>;
}

// Page structure for saving/loading
export interface PageStructure {
  id?: string;
  title?: string;
  slug?: string;
  components: Array<{
    id: string;
    type: string;
    props: Record<string, unknown>;
    order: number;
  }>;
  meta?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
  };
}

// Edit event for component changes
export interface ComponentEditEvent {
  componentId: string;
  field: string;
  value: string;
  componentType: string;
}
