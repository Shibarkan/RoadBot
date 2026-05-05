import { createClient } from '@supabase/supabase-js';

// Memanggil variabel lingkungan (environment variables) dari file .env menggunakan sintaks Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Membuat instance Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);