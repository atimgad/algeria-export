// utils/supabase/server.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  try {
    const cookieStore = await cookies()

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          async get(name) {
            const cookie = await cookieStore.get(name)
            return cookie?.value
          },
          async set(name, value, options) {
            try {
              (await cookieStore).set({ name, value, ...options })
            } catch (error) {
              // Ignorer si appelé depuis Server Component
            }
          },
          async remove(name, options) {
            try {
              (await cookieStore).set({ name, value: '', ...options })
            } catch (error) {
              // Ignorer si appelé depuis Server Component
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('❌ Erreur création client Supabase serveur:', error)
    return null
  }
}

// Garder createClient pour compatibilité
export const createClient = createServerSupabaseClient