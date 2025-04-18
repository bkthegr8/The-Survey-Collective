import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire client-side application
let supabaseClient: ReturnType<typeof supabaseCreateClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = supabaseCreateClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseClient
}

// Also export as createClient for consistency with server.ts
export const createClient = getSupabaseClient
