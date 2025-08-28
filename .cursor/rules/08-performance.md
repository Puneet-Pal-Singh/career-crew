### Performance

- RSC-first: prefer Server Components for data fetching; keep Client Components small and focused.
- Do not make network calls in Client Components unless necessary; prefer Server Actions or route handlers.
- Use minimal select columns; paginate job lists and avoid N+1 queries.
- Debounce user-initiated search/filter inputs using `debounce` from `src/lib/utils.ts`.
- Avoid unnecessary `useEffect` that mirrors props or server data.
- Use `next: { revalidate }` or `revalidatePath` intentionally; do not globally disable caching.

