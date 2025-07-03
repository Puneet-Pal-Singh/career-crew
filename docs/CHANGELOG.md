# Changelog - CareerCrew Consulting

This document tracks the development progress, major decisions, and feature releases for the CareerCrew Consulting job portal.

---

## MVP Development Phase (Supabase Pivot) - [Start Date of Supabase Work] - Present (YYYY-MM-DD)

This phase marks a significant pivot to using Supabase for backend services to accelerate MVP development and focus on core user-facing features.

### Iteration: Job Seeker Application Flow (Option C Complete) - [Approx. Current Date, e.g., May 2025]

*   **Feature: Job Application System**
    *   Implemented modal-based job application process on the Job Detail page (`/jobs/[jobId]`).
    *   Created `ApplicationFormSchema` for client-side validation of application inputs (Full Name, Email, Cover Letter Note, Resume URL, Consent).
    *   Developed `applicationActions.ts` with `submitApplication` server action:
        *   Authenticates users before allowing application.
        *   Verifies that the target job exists and is 'APPROVED'.
        *   Prevents employers from applying to their own jobs.
        *   Prevents duplicate applications from the same user for the same job.
        *   Saves application data to the `applications` Supabase table, linking `job_id` and `seeker_id`.
    *   Created `ApplicationModal.tsx` client component:
        *   Uses `shadcn/ui Dialog` and `react-hook-form`.
        *   Pre-fills user's full name and email if logged in (from `UserProfileContext` and `AuthContext`).
        *   Provides UI feedback for submission (loading, success, error states).
    *   Integrated application modal into `JobDetailView.tsx`:
        *   "Apply Now" button triggers the modal.
        *   Logged-out users are redirected to `/login` with a redirect back to the job page.
*   **Refinement: Persistent User Role Selection**
    *   Added `has_made_role_choice` (boolean, default `false`) column to `public.profiles` table in Supabase.
    *   Updated `UserProfileContext.tsx` to fetch this field and modify `updateUserProfileRole` to set `has_made_role_choice = true` upon any role selection.
    *   Removed `sessionStorage` logic from `RoleSelection.tsx`; it now relies on the database flag for persistence.
    *   Updated `DashboardPage.tsx` to show `RoleSelection` only if `userProfile.has_made_role_choice` is `false`, ensuring a one-time persistent role choice.
*   **Fix: Next.js 15 Page `params` Handling**
    *   Adapted `src/app/jobs/[jobId]/page.tsx` (Server Component) and its `generateMetadata` function to correctly handle `params` being a Promise in Next.js 15 by awaiting it.
    *   Refactored the job detail page UI into a separate client component `JobDetailView.tsx` which receives fetched job data as props.
*   **Fix: `SelectItem` Value Prop in Job Filters**
    *   Resolved runtime error in `JobSearchAndFilters.tsx` by ensuring the "All Types" `SelectItem` uses a unique non-empty string value, and adjusted state management accordingly.
*   **Fix: `debounce` Utility Typing**
    *   Corrected the TypeScript signature for the `debounce` utility in `src/lib/utils.ts` to remove the use of `any`.

### Iteration: Public Job Browsing & Details (Options A & B Complete) - [Approx. Date Range]

*   **Feature: Public Job Listing Page (`/jobs`)**
    *   Created `src/app/jobs/page.tsx` (Server Component) to display all 'APPROVED' jobs.
    *   Page is now public (added to `publicPaths` in `middleware.ts`).
    *   Implemented `getPublishedJobs` server action in `jobQueryActions.ts`:
        *   Handles text search (title, company name).
        *   Handles filtering by location, job type, and remote status.
        *   Implements server-side pagination.
        *   Returns `PaginatedJobsResult` (jobs, totalCount, totalPages, currentPage).
    *   Created UI components:
        *   `JobSearchAndFilters.tsx`: Client component with inputs for search/filters, updates URL `searchParams`. Includes debouncing for text inputs.
        *   `JobList.tsx`: Client component to render `JobCard` components. Includes basic animations.
        *   `JobsPagination.tsx`: Client component for page navigation.
    *   Adapted page for Next.js 15 `searchParams` (if error encountered, by defining local page props).
*   **Feature: Public Job Detail Page (`/jobs/[jobId]`)**
    *   Created dynamic route `src/app/jobs/[jobId]/page.tsx` (Server Component).
    *   Implemented `getJobDetailsById` server action in `jobDetailActions.ts` to fetch data for a single 'APPROVED' job.
    *   Handles `notFound()` for non-existent or non-approved jobs.
    *   Implemented `generateMetadata` for dynamic page titles and descriptions.
    *   Created `JobDetailView.tsx` (Client Component) to display job information and the "Apply Now" button.
    *   Fixed Next.js `<Image>` component errors by adding `width` and `height` props.
*   **Refactor: Server Actions Organization**
    *   Split original `jobActions.ts` into:
        *   `src/app/actions/jobQueryActions.ts` (for `getRecentJobs`, `getPublishedJobs`).
        *   `src/app/actions/jobDetailActions.ts` (for `getJobDetailsById`).
    *   Moved `getSupabaseServerClient` to a shared utility `src/lib/supabase/serverClient.ts`.
*   **Type Definitions:** Added `FetchJobsParams`, `PaginatedJobsResult`, `JobTypeOption`, `JobDetailData` to `src/types/index.ts`.

### Iteration: Employer Job Management MVP (Post Job, View Jobs) - [Approx. Date Range]

*   **Feature: Employer Post New Job**
    *   Created `/dashboard/post-job` page.
    *   Developed `PostJobForm.tsx` (decomposed into `JobPrimaryDetailsFields`, `JobDescriptionFields`, `JobSalaryFields`, `JobApplicationFields` sub-components).
        *   Uses `react-hook-form` and `zodResolver` with `JobPostSchema` for client-side validation.
        *   Handles form submission, loading/error/success states.
    *   Created `JobPostSchema` in `src/lib/formSchemas.ts`.
    *   Implemented `createJobPost` server action in `employerJobActions.ts`:
        *   Authenticates employer.
        *   Inserts job data into Supabase `jobs` table with default status `PENDING_APPROVAL`.
    *   Resolved complex TypeScript errors with Zod schema and RHF resolver by simplifying schema and managing defaults in RHF.
*   **Feature: Employer View "My Job Postings"**
    *   Created `/dashboard/job-listings` (or chosen name, e.g., `/my-jobs`) page.
    *   Implemented `getEmployerJobs` server action in `employerJobActions.ts` to fetch jobs for the authenticated employer.
    *   Created `EmployerJobTable.tsx` client component to display jobs using `shadcn/ui Table` and `Badge` for status.
    *   Page fetches data and passes to the table; handles empty/error states.
    *   Corrected `Badge` component variant usage for status display.
*   **Refinement: Server Action File Structure**
    *   Created `employerJobActions.ts` to house actions specific to employer job management.

### Iteration: Core Authentication & System Setup (Supabase Pivot) - [Approx. Date Range]

*   **Strategic Pivot: Adopted Supabase for Backend**
    *   Decision made to use Supabase for Auth, Database (PostgreSQL), and potentially Storage to accelerate MVP development, reduce backend complexity, and focus on UI/UX.
    *   Parked initial Docker/Prisma/Custom JWT backend approach for post-MVP consideration.
*   **Project Cleanup:**
    *   Removed Docker configurations, Prisma ORM, old custom auth utilities, and Prisma-tied API routes.
*   **Supabase Project Setup:**
    *   Created Supabase project, configured `.env.local`.
    *   Installed `@supabase/supabase-js` and `@supabase/ssr`.
    *   Created browser client (`src/lib/supabaseClient.ts`) and initial server client logic (later refined into `src/lib/supabase/serverClient.ts`).
*   **Authentication Implementation (Supabase Auth):**
    *   Implemented Sign Up, Sign In, Sign Out flows.
    *   Created `AuthContext.tsx` for client-side session management.
    *   Developed `AuthForm.tsx` for login/registration UI.
    *   Created `/login` and `/register` pages.
    *   Implemented `middleware.ts` using `@supabase/ssr` for server-side route protection (protecting `/dashboard`, redirecting authenticated users from auth pages).
*   **Database Schema Setup (Supabase):**
    *   Defined and created core tables: `profiles`, `jobs`, `applications`.
    *   Established foreign key relationships (e.g., linking to `auth.users.id`).
    *   Set up default values (e.g., `profiles.role` to 'JOB_SEEKER', `jobs.status` to 'PENDING_APPROVAL', `applications.status` to 'SUBMITTED', `profiles.has_made_role_choice` to `false`).
    *   Implemented database trigger (`handle_new_user`) to automatically create a `profiles` row upon new user signup in `auth.users`.
    *   Implemented initial Row Level Security (RLS) policies for `profiles` (users can insert/select/update own), `jobs`, and `applications`.
*   **User Profile & Role Selection (Initial):**
    *   Created `UserProfileContext.tsx` to fetch and manage user profile data (including role).
    *   Developed `RoleSelection.tsx` component for users to choose 'JOB_SEEKER' or 'EMPLOYER' on their first dashboard visit.
    *   Updated `DashboardPage.tsx` to display `RoleSelection` or role-specific views.
    *   Modified Header to show role-aware navigation links.
*   **New Design Direction:**
    *   Shifted from dark-mode default to **light-mode first**.
    *   Aimed for a modern, colorful, engaging, and professional aesthetic.
    *   Updated Tailwind CSS configuration (`tailwind.config.ts`, `globals.css`) with new color palettes.
    *   Functional theme toggle (`ThemeToggleButton.tsx`).
*   **Fixes & Adaptations for Next.js 15 (Canary):**
    *   Adapted server actions and Supabase client setup to handle asynchronous `cookies()` from `next/headers`.

---

## Pre-Pivot Phase: Initial Project Vision & Setup (Docker, Prisma) - [Start Date of Project] - [Date of Pivot]

*   **Initial Project Goal:** Build a general-purpose job portal with a modern SaaS look (Vercel/Linear inspired), defaulting to dark mode.
*   **Technology Choices (Original):**
    *   Frontend: Next.js, Tailwind CSS.
    *   Backend: Node.js (TypeScript), Prisma ORM, PostgreSQL.
    *   Authentication: In-house JWT.
    *   Development Environment: Docker and Docker Compose for local app and database.
*   **Progress Made:**
    *   **Project Setup:** Next.js, TypeScript, Tailwind CSS (initially v4, then downgraded to v3 for stability), ESLint, Prettier.
    *   **Docker Environment:** `Dockerfile` (multi-stage builds), `docker-compose.yml` for app and Postgres DB.
    *   **Database (Prisma):** Initial `schema.prisma` for User, Job, Application models; migrations created.
    *   **Basic CI/CD:** GitHub Actions for linting, type checking, building.
    *   **Landing Page UI (Significant Visual Development):**
        *   Implemented multiple animated sections using Framer Motion: Hero (with Aurora background), How It Works, Features, Stats, Featured Companies (marquee), Testimonials, Recent Jobs (mock data), Final CTA.
        *   Developed sophisticated Header with scroll-triggered transparency/blur and mobile menu.
        *   Created initial shared UI components (`AnimatedGradientBackground.tsx`, `Badge.tsx`, several `shadcn/ui` components).
    *   **Core Layout:** Font setup (Inter, GeistSans), `ThemeProvider` (`next-themes`).
*   **Challenges & Rationale for Pivot:**
    *   Encountered significant complexities and slowdowns debugging Docker configurations, Prisma Client generation within Docker, and `DATABASE_URL` management.
    *   Development velocity for UI and core features was impacted by time spent on backend infrastructure.
    *   Decision made to pivot to Supabase to accelerate MVP and focus on user-facing functionality.

---