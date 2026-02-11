import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qxuzgoadesqbvhhemvna.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dXpnb2FkZXNxYnZoaGVtdm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDQwNTgsImV4cCI6MjA4NjM4MDA1OH0.ZMXUnfVBEEaNibozBJiFFSs8UGCXlEAXEhiK7hA8UR4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
