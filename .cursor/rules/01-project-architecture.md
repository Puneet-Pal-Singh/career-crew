### Project architecture

- **Framework**: Next.js 15 (App Router), React 19, TypeScript strict.
- **Styling**: TailwindCSS 3, shadcn/ui primitives in `src/components/ui`, Radix.
- **State/Forms**: `react-hook-form` + Zod (`@hookform/resolvers`).
- **Data**: Supabase via SSR/client helpers under `src/lib/supabase` and Server Actions under `src/app/actions`.
- **Paths**: Use `@/*` alias (configured in `tsconfig.json`).

Folder boundaries
- `src/app`: Routes, Server Components by default, route-specific `page.tsx`, `layout.tsx`, and server `actions/`.
- `src/components`: Reusable UI; keep side-effect free. `ui/` contains shadcn/ui wrappers; prefer them.
- `src/lib`: Utilities (`utils.ts` with `cn`, `debounce`, `isValidInternalPath`), constants, schemas, Supabase clients.
- `src/types`: Shared app types and enums.
- `public/`: Static assets only.

General rules
- Prefer Server Components. Mark files with event handlers or hooks as client via "use client".
- Keep server work in Server Actions or route handlers. Do not query in middleware beyond what already exists.
- Reuse constants from `src/lib/constants.ts` and schemas from `src/lib/formSchemas.ts`.
- Use absolute imports from `@/` and keep import groups ordered: node -> external -> `@/`.

