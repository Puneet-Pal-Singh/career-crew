### File and naming conventions

- Components: `PascalCase.tsx` in `src/components/**` or route folders.
- Hooks: `useThing.ts` in `src/hooks` or adjacent to feature; `use-client` required if used in Client Components only.
- Utilities: `camelCase.ts` exported functions in `src/lib`.
- Server Actions: `verbNounAction.ts` in `src/app/actions/<domain>`.
- Types: `PascalCase` types and interfaces under `src/types`.
- Import order: node built-ins -> third-party -> `@/` absolute paths. No relative `../../`.
- Keep index barrels minimal; prefer explicit imports to prevent tree-shaking issues.

