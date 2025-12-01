import { createClient } from '@supabase/supabase-js'

// Ambil variabel lingkungan (Project URL dan Publishable Key)
// Next.js secara otomatis membaca .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Error handling
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variabel lingkungan NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY hilang."
  )
}

/**
 * Klien Supabase yang diekspor untuk digunakan di sisi klien (browser).
 */
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)