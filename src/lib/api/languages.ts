import { supabase } from '@/lib/supabase/client'
import { Language, LanguageInsert, LanguageUpdate } from '../../types/supabase'

export class LanguagesAPI {
  // Get all languages
  static async getAll(): Promise<{ data: Language[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

      console.log('LanguagesAPI.getAll result:', { dataLength: data?.length, error })
      return { data, error }
    } catch (error) {
      console.log('LanguagesAPI.getAll error:', error)
      return { data: null, error }
    }
  }

  // Get active languages only
  static async getActive(): Promise<{ data: Language[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get language by ID
  static async getById(id: string): Promise<{ data: Language | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get language by code
  static async getByCode(code: string): Promise<{ data: Language | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('code', code)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Create new language
  static async create(language: LanguageInsert): Promise<{ data: Language | null; error: Error | null }> {
    try {
      console.log('Creating language:', language)
      
      // Check if code already exists
      const { data: existing } = await supabase
        .from('languages')
        .select('id')
        .eq('code', language.code)
        .single()

      if (existing) {
        console.log('Language code already exists:', language.code)
        return { 
          data: null, 
          error: { message: 'Language code already exists' } 
        }
      }

      const { data, error } = await supabase
        .from('languages')
        .insert([language])
        .select()
        .single()

      console.log('Language created result:', { data, error })
      return { data, error }
    } catch (error) {
      console.log('Language create error:', error)
      return { data: null, error }
    }
  }

  // Update language
  static async update(id: string, updates: LanguageUpdate): Promise<{ data: Language | null; error: Error | null }> {
    try {
      // If updating code, check if it already exists
      if (updates.code) {
        const { data: existing } = await supabase
          .from('languages')
          .select('id')
          .eq('code', updates.code)
          .neq('id', id)
          .single()

        if (existing) {
          return { 
            data: null, 
            error: { message: 'Language code already exists' } 
          }
        }
      }

      const { data, error } = await supabase
        .from('languages')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete language
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Toggle language active status
  static async toggleActive(id: string): Promise<{ data: Language | null; error: Error | null }> {
    try {
      // First get the current status
      const { data: current } = await supabase
        .from('languages')
        .select('is_active')
        .eq('id', id)
        .single()

      if (!current) {
        return { data: null, error: { message: 'Language not found' } }
      }

      // Toggle the status
      const { data, error } = await supabase
        .from('languages')
        .update({ is_active: !current.is_active })
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update sort order
  static async updateSortOrder(id: string, sortOrder: number): Promise<{ data: Language | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .update({ sort_order: sortOrder })
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}
