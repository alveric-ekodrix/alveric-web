import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Stateless Supabase client for public read queries that doesn't read request cookies.
// This allows Next.js to cache queries and statically pre-render pages.
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
