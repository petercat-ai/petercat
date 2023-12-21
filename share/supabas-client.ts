import { Database } from '@/types/database.types';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_API_KEY!;
export const supabase: SupabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
