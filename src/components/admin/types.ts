// Types for admin components

export interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

