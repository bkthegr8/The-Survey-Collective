export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      surveys: {
        Row: {
          id: string
          title: string
          description: string | null
          category_id: number | null
          creator_id: string
          external_url: string
          estimated_time: number | null
          closing_date: string | null
          is_featured: boolean | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category_id?: number | null
          creator_id: string
          external_url: string
          estimated_time?: number | null
          closing_date?: string | null
          is_featured?: boolean | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category_id?: number | null
          creator_id?: string
          external_url?: string
          estimated_time?: number | null
          closing_date?: string | null
          is_featured?: boolean | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: number
          survey_id: string
          user_id: string | null
          anonymous_id: string | null
          created_at: string
        }
        Insert: {
          id?: number
          survey_id: string
          user_id?: string | null
          anonymous_id?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          survey_id?: string
          user_id?: string | null
          anonymous_id?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Survey = Database["public"]["Tables"]["surveys"]["Row"]
export type Participant = Database["public"]["Tables"]["participants"]["Row"]
