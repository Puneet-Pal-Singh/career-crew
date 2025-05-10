# Career Crew - Implementation Plan (MVP)

**Project:** CareerCrew
**Goal:** Launch a minimal, modern job portal MVP connecting Job Seekers, Employers, and Admins.

---

## Phase 0: Setup & Foundations (Done)

This phase focused on establishing the core project structure, development environment, and essential tooling based on best practices.

*   [x] **Version Control:**
    *   [x] Initialize Git repository.
    *   [x] Create GitHub repository.
    *   [x] Configure `.gitignore`.
    *   [x] Establish basic branching strategy (main/develop/feature).
*   [x] **Project Initialization:**
    *   [x] Set up Next.js project (`create-next-app`).
    *   [x] Configure TypeScript.
    *   [x] Integrate Tailwind CSS.
    *   [x] Use App Router (`/app`).
*   [x] **Code Quality & Formatting:**
    *   [x] Configure ESLint.
    *   [x] Configure Prettier.
    *   [x] Integrate ESLint + Prettier.
    *   [x] Add `lint` and `format` scripts to `package.json`.
*   [x] **Development Environment (Docker):**
    *   [x] Create `Dockerfile` for Next.js app (using `node:22-alpine`).
    *   [x] Create `docker-compose.yml` defining `app` and `db` (Postgres) services.
    *   [x] Define custom network (`careercrew_network`).
    *   [x] Define persistent volume for Postgres data (`postgres_data`).
    *   [x] Create and configure `.env` file for local variables (DB credentials, `DATABASE_URL`).
    *   [x] Ensure `.env` is added to `.gitignore`.
    *   [x] Test local environment (`docker-compose up --build`).
*   [x] **Database ORM (Prisma):**
    *   [x] Install Prisma and Prisma Client.
    *   [x] Initialize Prisma (`prisma init`).
    *   [x] Define initial Prisma schema (`prisma/schema.prisma`) for `User`, `Job`, `Application` models and related `Enums`.
    *   [x] Create initial database migration (`prisma migrate dev --name init`) and apply via Docker.
    *   [x] Create reusable Prisma client instance (`src/lib/prisma.ts`).
    *   [x] Add `prisma/migrations` and `prisma/migration_lock.toml` to Git.
*   [x] **Design Foundation:**
    *   [x] Define aesthetic design.
    *   [x] Create initial design concepts/inspirations for Landing Page and potentially Job Listing page.
    *   [x] Define basic color palette, typography, and component guidelines (from initial prompt).
*   [x] **Basic CI/CD Pipeline (GitHub Actions):**
    *   [x] Create `.github/workflows/ci.yml`.
    *   [x] Define triggers (`push`, `pull_request` to main/develop, `workflow_dispatch`).
    *   [x] Implement `lint` job.
    *   [x] Implement `typecheck` job (`tsc --noEmit`).
    *   [x] Implement `build` job (`npm run build`).

---

## Phase 1: Core Authentication (In Progress)

Implementing the custom JWT-based authentication system.

*   [x] **Backend Setup:**
    *   [x] Install dependencies (`bcrypt`, `jsonwebtoken`, `jose`, types).
    *   [x] Add JWT secrets/config to `.env`.
    *   [x] Create password hashing/comparison utilities (`src/lib/authUtils.ts`).
    *   [x] Create API Route: User Registration (`/api/auth/register`).
        *   [x] Input validation.
        *   [x] Check for existing user.
        *   [x] Hash password.
        *   [x] Create user via Prisma.
    *   [x] Create API Route: User Login (`/api/auth/login`).
        *   [x] Input validation.
        *   [x] Find user & verify password.
        *   [x] Generate JWT.
        *   [x] Set JWT in HTTP-Only cookie.
    *   [x] Create basic Authentication Middleware (`src/middleware.ts`) using `jose`.
        *   [x] Read and verify token from cookie.
        *   [x] Define basic public/protected path logic.
        *   [x] Configure matcher.
*   [ ] **Frontend Implementation:**
    *   [x] Create Login Page UI (`src/app/login/page.tsx`).
    *   [x] Create Registration Page UI (`src/app/register/page.tsx`).
    *   [x] Build reusable Auth Form component (optional).
    *   [x] Connect Login form to `/api/auth/login` endpoint (handle loading, errors, success redirect).
    *   [x] Connect Register form to `/api/auth/register` endpoint (handle loading, errors, success message/redirect).
    *   [x] Implement logic for redirects after login/logout.
    *   [x] Add basic UI feedback for auth actions.

---

## Phase 2: MVP Feature Implementation (To Do)

Building the core user-facing features defined in the MVP requirements.

*   [ ] **Core Layout & UI:**
    *   [ ] Create main Layout component (`src/components/Layout.tsx` or similar) including Header and Footer structure.
    *   [ ] Implement Header navigation (Logo, Jobs, Post a Job, Dashboard links - conditional based on auth state/role).
    *   [ ] Implement Light/Dark Theme Toggle functionality (using Tailwind dark mode class, `localStorage`, and potentially a context provider).
*   [ ] **Landing Page:**
    *   [ ] Build Landing Page UI (`src/app/page.tsx`) based on design concept.
        *   [ ] Hero section with heading, subtext, CTAs ("Browse Jobs", "Post a Job").
        *   [ ] Features grid section.
        *   [ ] "Recent Job Listings" section (placeholder first).
    *   [ ] API Route: Fetch recent/featured jobs (`/api/jobs/recent`).
    *   [ ] Connect "Recent Job Listings" section to API.
*   [ ] **Jobs Listing Page:**
    *   [ ] Build Jobs Listing Page UI (`src/app/jobs/page.tsx`).
        *   [ ] Search bar component.
        *   [ ] Filter components (Location, Remote, Experience, Salary - initially simple checkboxes/inputs).
        *   [ ] Job Card component to display individual job summary.
        *   [ ] Layout for filters (e.g., sidebar) and job list.
        *   [ ] Loading state indicator (e.g., skeletons).
        *   [ ] "No results" state display.
    *   [ ] API Route: Fetch multiple jobs (`/api/jobs`) with support for:
        *   [ ] Search query parameter.
        *   [ ] Filter parameters (location, remote, etc.).
        *   [ ] Pagination parameters (page, limit).
    *   [ ] Connect frontend search/filters to the API route.
    *   [ ] Implement frontend pagination logic.
*   [ ] **Job Detail Page:**
    *   [ ] Build Job Detail Page UI (`src/app/jobs/[jobId]/page.tsx`).
        *   [ ] Layout (e.g., description left, details/apply box right).
        *   [ ] Display job title, company, location, description, etc.
        *   [ ] Prominent "Apply Now" button/area.
    *   [ ] API Route: Fetch single job by ID (`/api/jobs/[jobId]`).
    *   [ ] Connect frontend page to the API route.
*   [ ] **Apply Modal:**
    *   [ ] Build Apply Modal UI component.
        *   [ ] Form fields (Name, Email, Phone, LinkedIn URL, Resume Upload - start with URL?).
    *   [ ] API Route: Handle application submission (`/api/applications`).
        *   [ ] Input validation.
        *   [ ] Create `Application` record in Prisma, linking Job and User (if logged in, or capture details if not).
        *   [ ] Handle resume upload logic (V1/V2 - for MVP maybe just capture info).
    *   [ ] Connect "Apply Now" button on Job Detail page to open the modal.
    *   [ ] Connect modal form submission to the API route.
*   [ ] **Employer Dashboard:**
    *   [ ] Protect route (`/dashboard/employer` or similar) using Middleware (check for EMPLOYER role).
    *   [ ] Build Employer Dashboard UI.
        *   [ ] Job Submission Form component.
        *   [ ] Table/List component to display posted jobs.
        *   [ ] Status badges (Pending, Approved, Rejected) based on design.
    *   [ ] API Route: Submit/Create a new job (`/api/employer/jobs`).
        *   [ ] Validate input.
        *   [ ] Create `Job` record with `PENDING` status, linked to the logged-in employer.
    *   [ ] API Route: Fetch jobs posted by the logged-in employer (`/api/employer/jobs`).
    *   [ ] Connect Job Submission form to its API route.
    *   [ ] Connect Job Table/List to its API route.
*   [ ] **Admin Dashboard:**
    *   [ ] Protect route (`/admin` or `/dashboard/admin`) using Middleware (check for ADMIN role).
    *   [ ] Build Admin Dashboard UI.
        *   [ ] Table/List to display jobs (default to Pending).
        *   [ ] Tabs or filters for Pending/All/Approved/Rejected jobs.
        *   [ ] Action buttons (Approve, Reject, Edit - maybe just Approve/Reject for MVP).
    *   [ ] API Route: Fetch jobs for admin view (`/api/admin/jobs`) with filtering by status.
    *   [ ] API Route: Update job status (`/api/admin/jobs/[jobId]/status`).
        *   [ ] Validate input (status change).
        *   [ ] Update `Job` record status via Prisma.
    *   [ ] Connect Admin Job List/Table to its API route.
    *   [ ] Connect Action buttons to the update status API route.

---

## Phase 3: Polish & MVP Deployment (To Do)

Final checks, refinements, and deployment to production.

*   [ ] **Refinement & Testing:**
    *   [ ] Test core user flows thoroughly (Seeker apply, Employer post, Admin approve).
    *   [ ] Test responsiveness across different screen sizes (Mobile, Tablet, Desktop).
    *   [ ] Basic accessibility check (keyboard navigation, color contrast).
    *   [ ] Cross-browser check (Chrome, Firefox, Safari - latest versions).
    *   [ ] Final UI polish based on design guidelines.
    *   [ ] Code cleanup and review.
*   [ ] **Deployment Preparation:**
    *   [ ] Set up Supabase project for hosted PostgreSQL database.
    *   [ ] Configure Production environment variables in Vercel (DATABASE_URL pointing to Supabase, JWT_SECRET, etc.).
    *   [ ] Run Prisma migrations against the production (Supabase) database (`prisma migrate deploy`).
    *   [ ] Configure Vercel project settings (link GitHub repo).
*   [ ] **Deployment:**
    *   [ ] Deploy `main` branch (or designated release branch) to Vercel production.
    *   [ ] Perform post-deployment smoke tests on the live site.
    *   [ ] Purchase and configure custom domain (`careerCrewConsulting.com`) if desired.

---

## Post-MVP (Future)

Features planned for V1/V2 based on initial PRD.

*   [ ] **V1:** Messaging/Chat, Job Bookmarks, Employer & User Analytics, Refine Dashboards, Resume Upload.
*   [ ] **V2:** On-platform Resume Builder, Public User Profiles, Referral Payouts, AI Resume-Job Matching.
*   [ ] **Monitoring:** Fully configure Prometheus + Grafana dashboards.

---