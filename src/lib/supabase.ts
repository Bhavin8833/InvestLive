import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qxuzgoadesqbvhhemvna.supabase.co";
const supabaseAnonKey = "sb_publishable_shqPPZUmUlpp7qHjFilcJg_Dj4IHBGI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
