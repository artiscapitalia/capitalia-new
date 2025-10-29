// Database types for auth functionality only
// All database-related types have been removed

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    [key: string]: unknown
  }
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at?: number
  user: AuthUser
}