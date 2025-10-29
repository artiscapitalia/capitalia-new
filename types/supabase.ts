// Database types for Capitalia Web - Auth Only
// All database tables and functions have been removed

export interface Database {
  public: {
    Tables: {
      // No custom tables - only Supabase auth tables remain
    }
    Views: {
      // No custom views
    }
    Functions: {
      // No custom functions
    }
    Enums: {
      // No custom enums
    }
  }
}

// Basic auth types for admin functionality
export interface AuthUser {
  id: string
  email?: string
  created_at?: string
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at?: number
  user: AuthUser
}