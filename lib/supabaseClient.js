import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
let supabase;
export function getSupabase(){ if(!supabase){ supabase=createPagesBrowserClient(); } return supabase; }
