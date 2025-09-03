### Supabase usage

- Use the provided clients under `src/lib/supabase`:
  - `serverClient.ts` in Server Actions and route handlers
  - `adminClient.ts` for elevated admin tasks only on the server
  - `supabaseClient.ts` for client-side needs when unavoidable
- In Middleware, rely on `@supabase/ssr` and cookie bridging as implemented in `src/middleware.ts`. Do not add DB queries there.
- Keep auth state via `supabase.auth.getUser()` in Server Actions when needed.
- Never expose non-`NEXT_PUBLIC_` keys to the client.
- Favor selecting minimal columns (`select('id, title')`) and `single()` when expecting one row.
- Use typed shapes and map raw rows to UI DTOs in `src/app/actions/helpers` when necessary.

