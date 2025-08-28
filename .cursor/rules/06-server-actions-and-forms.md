### Server Actions and forms

- Place actions in `src/app/actions/<domain>` with file names like `createThingAction.ts`; export verbs.
- Each action returns a discriminated union: `{ success: true, ... } | { success: false, error: string }`.
- Validate on client with Zod schemas from `src/lib/formSchemas.ts` and re-validate on server for critical paths.
- In actions, fetch authenticated user via Supabase and check roles/ownership as needed (`helpers/*Utils.ts`).
- Map app data via mappers in `src/app/actions/helpers` to keep UI decoupled from DB column names.
- After successful mutations, `revalidatePath` where necessary and redirect or return IDs for client navigation.
- Handle errors with user-friendly messages, but log full `insertError.code` and `message` on the server.

