# Project Log: careerCrewConsulting.com - Chat Session 1

This document serves as a detailed log of the development progress, challenges, and solutions implemented during the first major development session for the `careerCrewConsulting.com` project.

**Session Goal:** To establish a production-grade project foundation, implement a complete in-house authentication system, and set up the core UI layout.

---

## I. Initial Project Setup & Foundations

The session began with the goal of setting up the entire project from scratch, following a pre-defined "Big Prompt" specification.

### 1.1. Core Project Structure (Phase 0)

*   **Version Control:** Initialized Git and connected to a GitHub repository. A comprehensive `.gitignore` was established.
*   **Next.js Initialization:** Created a Next.js project using `create-next-app` with TypeScript, Tailwind CSS, and the App Router (`/src/app`).
*   **Code Quality:** Configured ESLint and Prettier for consistent code formatting and quality checks. Added `lint` and `format` scripts to `package.json`.

### 1.2. Dockerized Development Environment (Phase 0)

A significant portion of the session was dedicated to creating a robust, containerized local development environment.

*   **Files Created:**
    *   `Dockerfile`: A multi-stage `Dockerfile` was created to handle different build environments (development, production).
    *   `docker-compose.yml`: Defined two primary services: `app` (for the Next.js application) and `db` (for a PostgreSQL 15 database). It included configurations for ports, volumes, environment variables, a custom network (`careercrew_network`), and a healthcheck for the database.
    *   `.env`: Created to store local environment variables, including database credentials, `DATABASE_URL`, and JWT secrets.
    *   `.dockerignore`: Established to optimize the Docker build context.

*   **Challenges & Solutions:**
    *   **Challenge:** Initial `Dockerfile` base image (`node:18-alpine`) had a reported high-severity vulnerability.
    *   **Solution:** Upgraded the base image to `node:22-alpine` (and later to `node:23-alpine`), which was reported as having no high-severity vulnerabilities, aligning with the "production grade" goal.
    *   **Challenge:** Docker image size was initially large.
    *   **Solution:** The `Dockerfile` was significantly refactored to use multi-stage builds (`base`, `deps`, `builder`, `runner`, `development`). This, combined with updating `next.config.mjs` to use `output: 'standalone'`, drastically reduced the final production image size from a potential ~1.3GB to **~241MB**.

### 1.3. Database & CI/CD Setup (Phase 0)

*   **Prisma ORM:**
    *   Installed and initialized Prisma.
    *   Defined the initial schema (`prisma/schema.prisma`) for `User`, `Job`, and `Application` models, including `enum` types for roles and statuses.
    *   Successfully created and applied the initial database migration against the Dockerized Postgres instance.
    *   Created a singleton Prisma Client instance (`src/lib/prisma.ts`) to prevent connection issues in a hot-reloading environment.
*   **CI/CD Pipeline:**
    *   Created a basic CI workflow file (`.github/workflows/ci.yml`).
    *   The workflow runs on push/PR to `main`/`develop` and includes parallel jobs for **linting**, **type checking** (`tsc --noEmit`), and **building** (`npm run build`).

---

## II. In-House Authentication System (Phase 1)

This was the first major feature implementation, built from scratch.

### 2.1. Backend Implementation

*   **Dependencies:** Switched from `bcrypt` to `bcryptjs` to resolve persistent native module compilation errors (`Exec format error`) related to architecture mismatches between the host and Docker container. Installed `jsonwebtoken` for token creation and `jose` for middleware token verification (as it's Edge-compatible).
*   **API Routes:**
    *   `POST /api/auth/register`: A robust endpoint with input validation, checks for existing users, password hashing via `bcryptjs`, and user creation in the database.
    *   `POST /api/auth/login`: An endpoint that validates credentials, compares passwords, generates a JWT, and securely sets it in an **HTTP-Only cookie** on the `NextResponse` object.
*   **Middleware:** Created `src/middleware.ts` to protect routes. It reads and verifies the JWT from the `authToken` cookie. Unauthenticated users attempting to access protected routes are redirected to `/login`.

*   **Challenges & Solutions:**
    *   **Challenge:** Persistent `bcrypt` native module compilation errors (`Exec format error`) inside Docker.
    *   **Solution:** After multiple attempts to fix the build environment, we made the pragmatic decision to switch to `bcryptjs`, the pure-JavaScript implementation, which completely resolved the architecture-specific build issues.
    *   **Challenge:** A series of `500 Internal Server Error`, `405 Method Not Allowed`, and `@prisma/client did not initialize` errors during API testing.
    *   **Solution:** These were debugged systematically by:
        1.  **Checking Docker logs (`docker compose logs -f app`)** to identify the root cause.
        2.  **Fixing `node_modules` state:** The "nuke and pave" method (deleting host `node_modules`, rebuilding the image with `--no-cache`, and restarting containers) was used to resolve inconsistencies.
        3.  **Running `prisma generate`:** Explicitly running `docker compose exec app npx prisma generate` was required to regenerate the Prisma client after `node_modules` was cleared.
        4.  **Debugging Postman vs. cURL:** A `405` error unique to Postman was traced back to a configuration/state issue within Postman itself, not a server-side bug.
    *   **Challenge:** `jwt.sign` and cookie-setting TypeScript errors.
    *   **Solution:** Refined the code to use explicit type definitions (`SignOptions`) and correctly set cookies on the outgoing `NextResponse` object rather than trying to use the read-only request `cookies()` store.

### 2.2. Frontend Implementation

*   **Reusable `AuthForm` Component:** Created `src/components/auth/AuthForm.tsx` to handle both login and registration, managing state for inputs, loading, errors, and success messages.
*   **Login & Register Pages:** Created `src/app/login/page.tsx` and `src/app/register/page.tsx` which utilize the `AuthForm` component.
*   **Frontend-Backend Integration:** The forms were successfully connected to the API endpoints and tested for user registration and login flows from the browser.

*   **Challenges & Solutions:**
    *   **Challenge:** `TypeError: Cannot read properties of undefined (reading 'JOB_SEEKER')` in the `AuthForm` client component.
    *   **Solution:** Identified that Prisma enums from `@prisma/client` are not directly available in the browser. The fix was to create a client-side mirror enum (`ClientUserRole`) in the component itself to manage state and form values, which are then sent as strings to the backend.

---

## III. Core UI Layout (Partial Implementation - Phase 2)

The foundational UI shell was built to wrap the entire application.

*   **Layout & Fonts:** The root `src/app/layout.tsx` was configured to use `Inter` and `GeistSans` fonts via CSS variables. `tailwind.config.js` was updated to use these fonts.
*   **Components:** Basic `Header` and `Footer` components were created. The header includes static links and placeholders for conditional auth-based links.
*   **Theme Toggle:**
    *   Implemented a fully functional light/dark mode theme toggle using the `next-themes` library.
    *   This involved creating a `ThemeProvider` wrapper and a `ThemeToggleButton` component.
*   **Global Styles (`globals.css`):**
    *   Refined `globals.css` to use standard `@tailwind` directives and work seamlessly with Tailwind's `darkMode: 'class'` strategy and the `next-themes` library.

*   **Challenges & Solutions:**
    *   **Challenge:** A React hydration error related to whitespace and font variables in `layout.tsx`.
    *   **Solution:** Resolved by carefully constructing the `className` string on the `<html>` tag and ensuring correct font object usage.
    *   **Challenge:** The initial "minimal" `globals.css` was *too* minimal, causing a loss of all styling and the rendering of the default Next.js starter page.
    *   **Solution:** A more robust `globals.css` was created, and a thorough review of the entire styling chain (from `globals.css` -> `tailwind.config.js` -> `layout.tsx`) was conducted to ensure styles were being applied correctly. This fixed the "ugly" default page issue.

---

## IV. State at End of Session & Future Work

The project is now in a very solid state with a robust, optimized foundation and a complete, functional authentication system.

**Features Left for MVP:**

*   **Landing Page:** The full UI needs to be built out based on the drafted code and design concepts.
*   **Jobs Listing & Detail Pages:** The core feature for job seekers.
*   **Apply Modal:** The primary interaction for job application.
*   **Employer & Admin Dashboards:** The core feature for job posters and site managers.
*   **Conditional UI:** The Header needs to be updated to reflect the user's authentication state.
*   **Deployment:** The entire process of setting up Supabase, Vercel, and deploying the MVP.

The immediate next step is to **fully implement the Landing Page UI (`src/app/page.tsx`)**.