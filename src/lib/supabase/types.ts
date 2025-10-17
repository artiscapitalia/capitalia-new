// Database types will be generated from your Supabase schema
// For now, we'll use basic types

export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    role?: string
  }
}
