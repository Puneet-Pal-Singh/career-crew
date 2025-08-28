### Architecture rules

- **Framework**: Next.js 15 (App Router) with React 19, TypeScript strict, Tailwind CSS, shadcn/ui, Radix UI, Framer Motion.
- **Data layer**: Supabase (Auth, Database, Storage). SSR helpers from `@supabase/ssr`.
- **Directory layout**:
  - `src/app/**`: Routes, layouts, server components, server actions under `src/app/actions/**` grouped by domain.
  - `src/components/**`: Reusable UI including `ui/` (shadcn/ui), dashboard, landing and layout components.
  - `src/contexts/**`: Client contexts like `AuthContext`, `UserProfileContext`.
  - `src/lib/**`: Utilities (`utils.ts`, `constants.ts`, `formSchemas.ts`), Supabase clients under `lib/supabase/**`.
  - `src/types/**`: Shared TypeScript types.
- **Import aliases**: Use `@/*` for `src/*` per `tsconfig.json`.
- **Server vs client**:
  - Default to Server Components. Add `"use client"` only when required (state, effects, event handlers, browser APIs).
  - Server Actions live in `src/app/actions/**` and must start with `"use server"`.
  - Browser-only Supabase client in `src/lib/supabaseClient.ts`; server-side via `getSupabaseServerClient()`.
  - Admin-only operations use `adminSupabase` server-side only.
- **State management**:
  - Global auth state via `AuthContext` (client). Profile via `UserProfileContext` (client) and fetched with browser client.
  - Providers are composed in `AppProviders` used from `src/app/layout.tsx`.
- **Routing & middleware**:
  - Route protection and redirects enforced in `src/middleware.ts` using Supabase SSR client. No DB queries in middleware; rely on JWT `app_metadata` when possible.
  - Root layout sets `export const dynamic = 'force-dynamic'` because it reads cookies/session at request time.
- **Forms & validation**: Use React Hook Form + Zod schemas from `src/lib/formSchemas.ts`. Display errors using `src/components/ui/form.tsx` primitives.

Do not introduce competing architectures (e.g., Redux, SWR for auth/session) without discussion. Follow the existing patterns and extend them.

