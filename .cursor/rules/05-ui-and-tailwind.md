### UI, shadcn/ui, and Tailwind

- Prefer components in `src/components/ui` (shadcn/ui wrappers). Do not reimplement primitives.
- Use `cn` from `src/lib/utils.ts` for conditional class merging.
- Respect design tokens and CSS variables defined by Tailwind config; avoid hard-coded colors.
- Keep components presentational and stateless where possible. Business logic belongs in actions/hooks.
- Use `react-hook-form` with shadcn `Form`, `Input`, `Select`, etc. Integrate Zod via `zodResolver`.
- Keep accessibility: connect `Label` to form fields, use Radix props, set `aria-*` where appropriate.
- Co-locate feature-specific components near their usage under `src/components/**` or route folders; share-only pieces go under `src/components/ui` or `shared`.

