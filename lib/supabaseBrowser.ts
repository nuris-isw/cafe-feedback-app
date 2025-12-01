// lib/supabaseBrowser.ts
'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

// Ambil variabel lingkungan (Publik) dari .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Pastikan variabel lingkungan tersedia
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

/**
 * Klien Supabase untuk Browser (Client Components).
 * Digunakan untuk signIn/signOut dan manajemen session client-side.
 */
export const supabaseBrowser = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)