// src/lib/middleware/middleware.types.ts
import type { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Defines the structure of a Supabase Authentication Method Reference (AMR) entry.
 * This is used to determine how a user's session was created (e.g., 'password', 'recovery').
 */
export interface AmrEntry {
  method: string;
  timestamp: number;
}

/**
 * Extends the default Supabase User type to include the 'amr' property,
 * which is present in the runtime user object but missing from the default types.
 * This provides full type safety for the middleware.
 */
export interface User extends SupabaseUser {
  amr?: AmrEntry[];
}