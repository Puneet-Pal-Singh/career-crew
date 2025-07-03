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
    *   [x] `AnimatedHeroSection.tsx`
    *   [x] `AnimatedHowItWorksSection.tsx` & `HowItWorksStep.tsx`
    *   [x] `AnimatedFeaturesSection.tsx`
    *   [x] `AnimatedStatsSection.tsx` & `StatItem.tsx`
    *   [x] `AnimatedFeaturedCompanies.tsx`
    *   [x] `AnimatedTestimonialsSection.tsx` & `TestimonialCard.tsx`
    *   [x] `AnimatedRecentJobsSection.tsx` & `JobCard.tsx` (Now fetches live data)
    *   [x] `ForJobSeekersSection.tsx`
    *   [x] `ForEmployersSection.tsx`
    *   [x] `AnimatedFinalCTASection.tsx`
*   [x] **Shared UI Components (Initial Set):**
    *   [x] `AnimatedGradientBackground.tsx`
    *   [x] `Badge.tsx` (custom)
    *   [x] `shadcn/ui` components integrated (Button, Input, Textarea, Label, Checkbox, Select, Dialog, Table, Alert).

## Phase 1: Strategic Pivot to Supabase & Core Auth Implementation (DONE)

*   [x] **Decision:** Pivot to Supabase for BaaS.
*   [x] **New Design Direction:** Light-mode first.
    *   [x] Updated `tailwind.config.ts` & `globals.css`.
*   [x] **Project Cleanup:** Removed Docker, Prisma, old auth.
*   [x] **Supabase Project Setup:** Project, env vars, SDKs.
    *   [x] `src/lib/supabase/serverClient.ts` (shared server client created). <!-- UPDATED/ADDED -->
    *   [x] `src/lib/supabaseClient.ts` (browser client).
*   [x] **Client-Side Authentication Setup:**
    *   [x] `AuthContext.tsx` for session management.
    *   [x] `AppProviders.tsx` for wrapping.
    *   [x] Login/Register pages & `AuthForm.tsx`.
    *   [x] Tested Sign Up, Sign In, Logout.
*   [x] **Core Layout Adjustments:** Header (scroll, mobile, theme toggle, conditional links), Footer.
*   [x] **Server-Side Route Protection (Middleware):**
    *   [x] `src/middleware.ts` implemented and configured for public/protected routes (including `/jobs`).

## Phase 2: Supabase Database & MVP Feature Implementation (Largely DONE / Core Loop Complete)

*   [x] **Supabase Database Schema Setup:**
    *   [x] **`profiles` table created:** (with `id`, `email`, `role` default 'JOB_SEEKER', `has_made_role_choice` default false, etc.)
    *   [x] **`jobs` table created:** (with `employer_id`, `status` default 'PENDING_APPROVAL', etc.)
    *   [x] **`applications` table created:** (with `seeker_id`, `job_id`, `status` default 'SUBMITTED', etc.)
    *   [x] **Define Relationships:** Foreign Keys set up.
    *   [x] **Create Database Triggers/Functions:**
        *   [x] Trigger `handle_new_user` on `auth.users` to create a `profile` row with defaults.
        *   [x] Trigger `handle_job_update` for `jobs.updated_at`.
    *   [x] **Implement Row Level Security (RLS) Policies (Initial Set):**
        *   [x] `profiles`: Users can INSERT own, SELECT own, UPDATE own.
        *   [x] `jobs`: Basic policies for employer CRUD, public read for 'APPROVED'.
        *   [x] `applications`: Basic policies for seeker CRUD, employer read for their jobs.
        _Further RLS review scheduled for Phase 3._

*   [x] **Landing Page Data Integration:**
    *   [x] `getRecentJobs` server action (in `jobQueryActions.ts`) fetches N recent `APPROVED` jobs.
    *   [x] `AnimatedRecentJobsSection.tsx` on `src/app/page.tsx` displays these jobs.

*   [x] **User Profile Creation & Persistent Role Handling:**
    *   [x] DB trigger creates `profile` row with `role: 'JOB_SEEKER'` and `has_made_role_choice: false`.
    *   [x] `UserProfileContext.tsx` fetches and manages `role` and `has_made_role_choice`.
    *   [x] `RoleSelection.tsx` allows first-time role choice (Seeker/Employer).
    *   [x] `updateUserProfileRole` action in context sets `has_made_role_choice: true` in DB.
    *   [x] `DashboardPage.tsx` uses `has_made_role_choice` to show role selection only once persistently.

*   [x] **Dashboard Core (`src/app/dashboard/...`):**
    *   [x] `layout.tsx` (basic, ready for sidebar).
    *   [x] `page.tsx`: Conditionally renders `RoleSelection` or role-specific views. Placeholder views for Seeker, Employer, Admin.

*   [x] **Employer Dashboard & Functionality:**
    *   [x] `EmployerView.tsx` (placeholder with links to post/view jobs).
    *   [x] **Post New Job (`/dashboard/post-job`):**
        *   [x] `JobPostSchema` in `formSchemas.ts`.
        *   [x] `PostJobForm.tsx` (decomposed into sub-components) with `react-hook-form`, `zodResolver`.
        *   [x] `createJobPost` server action in `employerJobActions.ts` saves job to Supabase (default status: `PENDING_APPROVAL`).
    *   [x] **My Jobs (`/dashboard/job-listings` - or chosen name):**
        *   [x] `getEmployerJobs` server action in `employerJobActions.ts`.
        *   [x] `EmployerJobTable.tsx` displays employer's jobs with status.
        *   [x] `/dashboard/job-listings/page.tsx` fetches and renders the table.

*   [x] **Job Seeker Core Flow:**
    *   [x] **Jobs Listing Page (`/jobs` - Public):**
        *   [x] `getPublishedJobs` server action (in `jobQueryActions.ts`) fetches `APPROVED` jobs with filters (text, location, type, remote) and pagination.
        *   [x] UI: `JobSearchAndFilters.tsx`, `JobList.tsx` (using `JobCard`), `JobsPagination.tsx`.
        *   [x] `src/app/jobs/page.tsx` integrates these, handles `searchParams` (adapted for Next.js 15).
    *   [x] **Job Detail Page (`/jobs/[jobId]` - Public):**
        *   [x] `getJobDetailsById` server action (in `jobDetailActions.ts`) fetches full job details.
        *   [x] `src/app/jobs/[jobId]/page.tsx` (Server Component) fetches data, handles `params` (adapted for Next.js 15), `generateMetadata`.
        *   [x] `JobDetailView.tsx` (Client Component) displays details and "Apply Now" button.
        *   [x] Handles `notFound()`.
    *   [x] **Application Process (Modal):**
        *   [x] `ApplicationFormSchema` in `formSchemas.ts`.
        *   [x] `submitApplication` server action in `applicationActions.ts` saves application to Supabase (links `job_id`, `seeker_id`, default status `SUBMITTED`). Includes checks for existing applications and job status.
        *   [x] `ApplicationModal.tsx` component with form, pre-fill for logged-in users, success/error states.
        *   [x] Integrated into `JobDetailView.tsx`; logged-out users redirected to login.

*   [ ] **Admin Dashboard (Basic for MVP):** <!-- THIS IS THE NEXT MAJOR AREA -->
    *   [ ] `AdminView.tsx` (Placeholder exists, needs implementation).
    *   [ ] Server action to fetch `PENDING_APPROVAL` jobs.
    *   [ ] UI Table to display pending jobs.
    *   [ ] Server actions & UI buttons for "Approve" / "Reject" a job post (updates status in Supabase).

*   [x] **UI Polish & Component Consistency (Ongoing):**
    *   [x] Using `shadcn/ui` for new dashboard/form components.
    *   [x] Basic responsiveness addressed for new pages.
    *   [x] Basic loading/error states implemented for new features.

## Phase 3: Final Polish & MVP Deployment (TO DO)

*   [ ] **Thorough End-to-End Testing:**
    *   [x] Auth flows (Sign Up, Sign In, Sign Out).
    *   [x] Job posting by employer.
    *   [x] Job application by seeker.
    *   [ ] Admin job approval/rejection. <!-- TO BE TESTED -->
    *   [x] All protected routes and public routes.
    *   [x] Responsiveness on different devices (initial pass done, needs focused testing).
*   [ ] **Row Level Security (RLS) Policy - Final Review & Testing:**
    *   [x] Initial RLS policies implemented.
    *   [ ] Rigorously test all RLS policies with different user roles and scenarios.
*   [ ] **Accessibility (A11y) Check:** (Basic considerations made, needs focused testing).
*   [ ] **Performance Review:**
*   [ ] **Code Cleanup & Refinement:**
*   [ ] **Environment Variables for Production:**
*   [ ] **Deployment to Vercel:**
*   [ ] **Custom Domain Configuration (if applicable).**
*   [ ] **Post-Deployment Smoke Testing.**

## Post-MVP / V1 Enhancements (Future Considerations)