import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

let supabase;

export function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    supabase = createPagesBrowserClient();
  }

  return supabase;
}
