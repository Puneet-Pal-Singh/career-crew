### Next.js App Router rules

- Default to Server Components. Add "use client" only if using state, refs, effects, or event handlers.
- Use Server Actions in `src/app/actions/**` with "use server" for mutations and authenticated operations.
- Route structure under `src/app/**` must match URLs. Use dynamic segments like `[id]` folders.
- Avoid DB calls in Middleware. Current `src/middleware.ts` already reads auth via Supabase SSR and redirects; keep that pattern and do not add DB queries.
- When mutations affect UI lists, consider `revalidatePath('/dashboard/...')` from Server Actions.
- Keep route handlers in `route.ts` files for API endpoints where needed; otherwise prefer Server Actions.
- Fonts and theme use Next best practices already; do not introduce custom `_app` or `_document`.

