# Career Crew Consulting - MVP Implementation Plan (Supabase Pivot)

**Project:** careerCrewConsulting.com
**Goal:** Rapidly develop and launch a Minimum Viable Product (MVP) for a modern job portal, leveraging Next.js, Tailwind CSS, and Supabase for backend services.
**Current Branch Focus:** `v1-dev-supabase-mvp`

---

## Phase 0: Initial Project Setup & Landing Page Foundations (Pre-Pivot)

*   [x] **Version Control:** Git repository established on GitHub.
*   [x] **Project Initialization:** Next.js (App Router, TypeScript), Tailwind CSS v3.
*   [x] **Code Quality:** ESLint, Prettier configured.
*   [x] **Original Design Direction (Dark Mode):** Initial Vercel/Linear-inspired dark mode concepts.
*   [x] **Docker & Prisma Setup (DEFERRED/PARKED):** Initial work on Docker, Prisma, PostgreSQL, and custom JWT auth was done but parked due to complexity slowing MVP.
*   [x] **Landing Page UI (Visuals & Animations - Pre-Data):**
    *   [x] `AnimatedHeroSection.tsx` (Full viewport, Aurora background, Framer Motion text).
        *   _Known Issue (Parked for MVP speed): Aurora background coverage at extreme aspect ratios._
    *   [x] `AnimatedHowItWorksSection.tsx` & `HowItWorksStep.tsx` (Steps, icons, text, animations).
    *   [x] `AnimatedFeaturesSection.tsx` (Alternating layout, Framer Motion, Lucide icons).
    *   [x] `AnimatedStatsSection.tsx` & `StatItem.tsx` (Gradient background, animated counters).
    *   [x] `AnimatedFeaturedCompanies.tsx` (Scrolling marquee for logos).
        *   _Known Issue (Parked for MVP speed): Seamless loop verification._
    *   [x] `AnimatedTestimonialsSection.tsx` & `TestimonialCard.tsx` (Enhanced cards, animations).
    *   [x] `AnimatedRecentJobsSection.tsx` & `JobCard.tsx` (Improved card design, placeholder for data).
    *   [x] `ForJobSeekersSection.tsx` (Two-column, benefits list).
    *   [x] `ForEmployersSection.tsx` (Alternating two-column, benefits list).
    *   [x] `AnimatedFinalCTASection.tsx` (Vibrant gradient, animated).
*   [x] **Shared UI Components (Initial Set):**
    *   [x] `AnimatedGradientBackground.tsx`
    *   [x] `Badge.tsx` (custom)
    *   [x] `shadcn/ui` components integrated: `button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `checkbox.tsx`, `select.tsx`.

## Phase 1: Strategic Pivot to Supabase & Core Auth Implementation (Largely DONE)

*   [x] **Decision:** Pivot to Supabase for BaaS (Auth, DB, Storage) to accelerate MVP. Defer custom backend.
*   [x] **New Design Direction:** Light-mode first, colorful, modern, engaging aesthetic.
    *   [x] Updated `tailwind.config.ts` with new color palettes.
    *   [x] Updated `globals.css` for light mode default and correct CSS variable theming for both light/dark modes.
*   [x] **Project Cleanup:**
    *   [x] Removed Docker configurations for local app development.
    *   [x] Removed Prisma ORM, schema, and client (`src/lib/prisma.ts`).
    *   [x] Removed old custom JWT auth utilities and API routes (`/api/auth/*`).
    *   [x] Removed old data-fetching API routes tied to Prisma (`/api/jobs/*`, `/api/employer/*`).
    *   [x] Cleaned up `src/app/page.tsx` to remove dependencies on old data fetching.
    *   [x] Deleted old dashboard files dependent on Prisma (`DashboardSidebar.tsx`, dashboard layout/page).
*   [x] **Supabase Project Setup:**
    *   [x] Supabase project created.
    *   [x] `.env.local` configured with Supabase URL & Anon Key.
    *   [x] `@supabase/supabase-js` and `@supabase/ssr` packages installed.
    *   [x] `src/lib/supabaseClient.ts` (browser client) created.
*   [x] **Client-Side Authentication Setup:**
    *   [x] `src/contexts/AuthContext.tsx` created and refined to manage user session state.
    *   [x] `src/components/providers/AppProviders.tsx` created to wrap `ThemeProvider` and `AuthProvider`.
    *   [x] `src/app/layout.tsx` updated to use `AppProviders`.
    *   [x] `src/components/auth/AuthForm.tsx` created for Login/Register, using `AuthContext`.
    *   [x] `src/app/login/page.tsx` and `src/app/register/page.tsx` created, using `AuthForm`.
    *   [x] Successfully tested Sign Up, Sign In flows (with email confirmation temporarily OFF in Supabase).
*   [x] **Core Layout Adjustments:**
    *   [x] `src/components/layout/Header.tsx`:
        *   [x] Scroll-triggered "island" style functional.
        *   [x] Mobile menu functional.
        *   [x] `ThemeToggleButton.tsx` updated to toggle switch style and functional.
        *   [x] Integrated with `AuthContext` for conditional display of Login/Sign Up vs. Dashboard/Post Job/Logout links.
        *   [x] Functional "Logout" button.
        *   [x] Navigation link order corrected (How It Works before Features).
    *   [x] `src/components/layout/Footer.tsx` (basic placeholder).
*   [x] **Basic Dashboard Stubs:**
    *   [x] `src/app/dashboard/layout.tsx` (placeholder).
    *   [x] `src/app/dashboard/page.tsx` (placeholder "Welcome" message).
*   [x] **Server-Side Route Protection (Middleware):**
    *   [x] `src/middleware.ts` implemented using `@supabase/ssr` (`createServerClient`).
    *   [x] Successfully protects `/dashboard` (redirects to `/login` if unauthenticated).
    *   [x] Successfully redirects authenticated users from `/login` or `/register` to `/dashboard`.
    *   [x] Login successfully redirects to `/dashboard` and stays there.

## Phase 2: Supabase Database & MVP Feature Implementation (IN PROGRESS / TO DO)

*   [ ] **Supabase Database Schema Setup (VIA SUPABASE DASHBOARD OR SQL):**
    *   [ ] **`profiles` table:**
        *   `id` (uuid, PK, references `auth.users.id`, ON DELETE CASCADE)
        *   `updated_at` (timestamptz, default `now()`)
        *   `email` (text, unique, from `auth.users.email`)
        *   `full_name` (text, nullable)
        *   `avatar_url` (text, nullable)
        *   `role` (enum: `JOB_SEEKER`, `EMPLOYER`, `ADMIN`; or text with check constraint)
        *   _Consider other profile fields: location, bio, company_name (for employers), etc._
    *   [ ] **`jobs` table:**
        *   `id` (uuid, PK, default `gen_random_uuid()`)
        *   `created_at` (timestamptz, default `now()`)
        *   `updated_at` (timestamptz, default `now()`)
        *   `employer_id` (uuid, FK to `profiles.id` or `auth.users.id`)
        *   `title` (text, not null)
        *   `company_name` (text, not null)
        *   `company_logo_url` (text, nullable)
        *   `location` (text, not null)
        *   `description` (text, not null)
        *   `requirements` (text, nullable)
        *   `job_type` (enum: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`; or text)
        *   `salary_min` (integer, nullable)
        *   `salary_max` (integer, nullable)
        *   `salary_currency` (text, nullable, default 'USD')
        *   `is_remote` (boolean, default false)
        *   `application_email` (text, nullable)
        *   `application_url` (text, nullable)
        *   `status` (enum: `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `ARCHIVED`, `FILLED`; default `PENDING_APPROVAL`)
    *   [ ] **`applications` table:**
        *   `id` (uuid, PK, default `gen_random_uuid()`)
        *   `created_at` (timestamptz, default `now()`)
        *   `job_id` (uuid, FK to `jobs.id`, not null)
        *   `seeker_id` (uuid, FK to `profiles.id` or `auth.users.id`, not null)
        *   `status` (enum: `SUBMITTED`, `VIEWED`, `INTERVIEWING`, `OFFERED`, `HIRED`, `REJECTED`; default `SUBMITTED`)
        *   `cover_letter_snippet` (text, nullable)
        *   `resume_url` (text, nullable) _(Supabase Storage integration later)_
    *   [ ] **Define Relationships:** Foreign Keys, Cascade options.
    *   [ ] **Create Database Triggers/Functions (if needed):**
        *   [ ] Trigger to create a `profile` row when a new user signs up in `auth.users`.
        *   [ ] Trigger to update `jobs.updated_at`.
    *   [ ] **Implement Row Level Security (RLS) Policies (CRITICAL):**
        *   `profiles`: Users can view their own profile, update their own. Public read for some fields?
        *   `jobs`: Employers can CRUD their own jobs. Public read for `APPROVED` jobs. Admins can CRUD all.
        *   `applications`: Seekers can CRUD their own. Employers can read applications for their jobs. Admins can read all.

*   [ ] **Landing Page Data Integration:**
    *   [ ] Create Server Action or Server Component data fetching logic to get N recent `APPROVED` jobs from Supabase `jobs` table.
    *   [ ] Update `src/app/page.tsx` and `AnimatedRecentJobsSection.tsx` to display these jobs.

*   [ ] **User Profile Creation & Role Handling:**
    *   [ ] Implement logic (Supabase Function/Trigger or Server Action post-signup) to create a corresponding entry in the `profiles` table when a new user signs up (linking `auth.users.id`).
    *   [ ] Allow users to select a role (`JOB_SEEKER` or `EMPLOYER`) during/after signup (e.g., on first dashboard visit).
    *   [ ] Update `AuthContext` or create a new `ProfileContext` to fetch and store user's profile data including their role.
    *   [ ] Refine `Header.tsx` to show role-specific dashboard links based on fetched profile role.

*   [ ] **Dashboard Core (`src/app/dashboard/...`):**
    *   [ ] `layout.tsx`: Implement a proper `DashboardSidebar.tsx` with navigation links based on user role.
    *   [ ] `page.tsx`: Fetch user role. Conditionally render `JobSeekerView.tsx`, `EmployerView.tsx`, or `AdminView.tsx`.

*   [ ] **Employer Dashboard & Functionality:**
    *   [ ] `EmployerView.tsx`: Overview, stats (e.g., total jobs posted, active applications).
    *   [ ] **Post New Job (`/dashboard/post-job`):**
        *   [ ] Create `PostJobForm.tsx` (using `shadcn/ui`).
        *   [ ] Implement Server Action to handle form submission and `insert` data into Supabase `jobs` table (linking `employer_id`, setting status to `PENDING_APPROVAL`).
    *   [ ] **My Jobs (`/dashboard/my-jobs` - new page for employers):**
        *   [ ] `EmployerJobTable.tsx`: Display jobs posted by the logged-in employer (fetched from Supabase).
        *   [ ] Columns: Title, Status, Applications Count, Actions (View, Edit - MVP+, Archive - MVP+).
    *   [ ] **View Applications for a Job (MVP+ or simple list for MVP):**
        *   [ ] Allow employer to see applicants for their specific jobs.

*   [ ] **Job Seeker Core Flow:**
    *   [ ] **Jobs Listing Page (`/jobs`):**
        *   [ ] Fetch and display all `APPROVED` jobs from Supabase.
        *   [ ] UI: Search bar (basic text search on title/company), Filters (location, job_type, remote - client-side for MVP or basic server-side). Job cards. Pagination.
    *   [ ] **Job Detail Page (`/jobs/[jobId]`):**
        *   [ ] Fetch and display full job details from Supabase for the given `jobId`.
        *   [ ] "Apply Now" button.
    *   [ ] **Application Process (Modal or Page):**
        *   [ ] Simple application form (e.g., confirm details, short cover letter snippet, placeholder for resume upload URL).
        *   [ ] Server Action to save application to Supabase `applications` table, linking `job_id` and `seeker_id`.

*   [ ] **Admin Dashboard (Basic for MVP):**
    *   [ ] `AdminView.tsx`: Table of `PENDING_APPROVAL` jobs from Supabase.
    *   [ ] Actions: "Approve" / "Reject" a job post (Server Action to update job status in Supabase).

*   [ ] **UI Polish & Component Consistency:**
    *   [ ] Continue using `shadcn/ui` for new dashboard components (forms, tables, modals, cards) for a consistent and polished look.
    *   [ ] Ensure responsiveness across all new pages and components.
    *   [ ] Add appropriate loading states and error handling to UI.

## Phase 3: Final Polish & MVP Deployment (TO DO)

*   [ ] **Thorough End-to-End Testing:**
    *   [ ] All auth flows (Sign Up, Sign In, Sign Out, Password Reset - if implemented for MVP).
    *   [ ] Job posting by employer.
    *   [ ] Job application by seeker.
    *   [ ] Admin job approval/rejection.
    *   [ ] All protected routes and public routes.
    *   [ ] Responsiveness on different devices.
*   [ ] **Row Level Security (RLS) Policy - Final Review & Testing:**
    *   [ ] Rigorously test RLS policies to ensure data security and correct access permissions.
*   [ ] **Accessibility (A11y) Check:**
    *   [ ] Basic keyboard navigation, ARIA attributes where needed, color contrast.
*   [ ] **Performance Review:**
    *   [ ] Check page load times, identify any major bottlenecks.
*   [ ] **Code Cleanup & Refinement:**
    *   [ ] Remove unused code, console logs (except intentional debug ones).
    *   [ ] Ensure consistent code style.
*   [ ] **Environment Variables for Production:**
    *   [ ] Ensure Supabase URL and Anon Key are set in Vercel deployment environment.
*   [ ] **Deployment to Vercel:**
    *   [ ] Connect GitHub repo to Vercel.
    *   [ ] Configure build settings if necessary.
    *   [ ] Deploy `v1-dev-supabase-mvp` branch (or a `main`/`production` branch merged from it).
*   [ ] **Custom Domain Configuration (if applicable).**
*   [ ] **Post-Deployment Smoke Testing.**

## Post-MVP / V1 Enhancements (Future Considerations)

*   [ ] Richer dashboard analytics.
*   [ ] Job bookmarks for seekers.
*   [ ] Resume uploads (Supabase Storage).
*   [ ] Company profiles.
*   [ ] Basic messaging between employers and seekers.
*   [ ] Email notifications (Supabase Auth built-in or custom).
*   [ ] Advanced search and filtering for jobs.
*   [ ] Password Reset Flow (if not in MVP).
*   [ ] OAuth Logins (Google, GitHub).
*   [ ] Re-enable Email Confirmation in Supabase.

---

This plan should provide a clear roadmap. We've made excellent progress on Phase 1!
The very next step is "Supabase Database Schema Setup." Let me know when you're ready to tackle that!