import { createClient } from '@supabase/supabase-js';

const isNode = typeof process !== 'undefined';

const supabaseUrl = (isNode ? process.env.VITE_SUPABASE_URL : null) || import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (isNode ? process.env.VITE_SUPABASE_ANON_KEY : null) || import.meta.env?.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = isNode ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

// Public client — used by both Vite frontend and Express backend
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey ?? '',
  {
    auth: {
      // Browser sessions should survive a refresh. Node never has localStorage,
      // so Supabase safely keeps this client stateless on the API side.
      autoRefreshToken: !isNode,
      persistSession: !isNode,
    },
  }
);

// Admin client — used for server-side storage operations and user management
// Never expose this to the client. Service role key bypasses RLS.
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
