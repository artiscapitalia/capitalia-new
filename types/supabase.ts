// Database types for Capitalia Web
export interface Database {
  public: {
    Tables: {
      languages: {
        Row: {
          id: string
          name: string
          code: string
          native_name: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          native_name?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          native_name?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      // Add your view types here when you generate them
    }
    Functions: {
      // Add your function types here when you generate them
    }
    Enums: {
      // Add your enum types here when you generate them
    }
  }
}

export type Language = Database['public']['Tables']['languages']['Row']
export type LanguageInsert = Database['public']['Tables']['languages']['Insert']
export type LanguageUpdate = Database['public']['Tables']['languages']['Update']
