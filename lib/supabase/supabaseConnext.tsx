import { createClient, SupabaseClient, UserAttributes } from '@supabase/supabase-js';

const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Supabase API key not provided.');
}

// console.log('log supabase', createClient);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);