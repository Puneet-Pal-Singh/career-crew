### TypeScript style and safety

- **Strict** is enabled. Do not introduce `any`. Prefer precise unions and generics.
- Annotate all exported functions and component props. Avoid implicit `any` in callback params.
- Keep function names verb-phrases and variables noun-phrases; avoid 1–2 letter names.
- Extract shared types to `src/types` and import via `@/types`.
- Use discriminated unions for server action results: `{ success: true; ... } | { success: false; error: string }`.
- Derive UI enums/options from single sources of truth like `JOB_TYPE_OPTIONS`.
- Use helpers: `cn` from `src/lib/utils.ts` and `debounce` when needed.
- Never suppress ESLint/TS with blanket disables; fix types or scope the ignore.

