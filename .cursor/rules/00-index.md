### Cursor Rules Index

These rules tailor AI edits to this codebase. Follow them when creating or modifying code.

- 01-project-architecture.md: Tech stack, folder layout, module boundaries
- 02-typescript-style.md: Types, naming, and safety rules
- 03-nextjs-app-router.md: App Router patterns, server vs client components
- 04-supabase.md: Clients, SSR cookies, auth, queries
- 05-ui-and-tailwind.md: shadcn/ui, Tailwind, design tokens, `cn`
- 06-server-actions-and-forms.md: Actions, zod, react-hook-form
- 07-security-and-auth.md: Middleware, redirects, secure patterns
- 08-performance.md: RSC-first, caching, avoid client bloat
- 09-file-and-naming-conventions.md: Structure and naming
- 10-linting-and-formatting.md: Lint/format and imports

When in doubt:
- Prefer Server Components; add "use client" only when necessary.
- Use `@/` absolute imports and existing helpers (`cn`, constants, schemas, mappers).
- Never introduce `any`; keep types explicit for exported APIs.

