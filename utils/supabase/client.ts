// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Pour compatibilité avec les imports existants
export const createServerSupabaseClient = createBrowserSupabaseClient

// Instance par défaut
const supabase = createBrowserSupabaseClient()
export default supabase