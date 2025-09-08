// src/lib/supabase/adminClient.ts
import { createClient } from '@supabase/supabase-js';

// This client uses the Service Role Key for admin-level access.
// It should only ever be used in server-side code.

// Ensure environment variables are loaded.
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
}

export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      // These options are required for server-side clients.
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);