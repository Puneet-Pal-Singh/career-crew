### Linting and formatting

- Use Next.js ESLint config (already set). Run `npm run lint` and `npm run lint:fix` before committing.
- Formatting via Prettier: `npm run format`. Respect `.gitignore` for ignored paths.
- No large-scale reformatting of unrelated files in edits. Keep diffs minimal and focused.
- Fix lint errors rather than disabling rules. If a disable is necessary, scope to a single line.
- Ensure new files compile (`tsc --noEmit`) and type-check.

