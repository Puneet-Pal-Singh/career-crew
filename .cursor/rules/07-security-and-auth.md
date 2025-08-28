### Security and auth

- Middleware enforces redirects for auth, onboarding, and dashboard access; keep logic minimal and side-effect free.
- Use `isValidInternalPath` from `src/lib/utils.ts` for any internal redirects (protects against open redirects).
- Never trust client input. Validate fields and cast `undefined` to `null` for optional DB columns.
- Avoid exposing detailed error messages to users; return generic messages and log server details.
- Restrict admin-only actions to server-only contexts and use `adminClient.ts`.
- Ensure all secrets are server-side; only `NEXT_PUBLIC_*` may appear in client code.

