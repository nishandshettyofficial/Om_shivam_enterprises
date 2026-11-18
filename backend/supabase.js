import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config(); // fallback to root .env if present

const supabaseUrl = process.env.SUPABASE_URL || 'https://wlswdmgagviuotuvzigo.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Helper to check if Supabase connection & tables are accessible
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('phone').limit(1);
    if (error) {
      return { connected: false, error: error.message };
    }
    return { connected: true, data };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

export default supabase;
