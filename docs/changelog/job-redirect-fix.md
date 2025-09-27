# Job Seeker Redirect Fix Documentation

## Issue Description
When job seekers attempted to apply to a job while unauthenticated, they were redirected to the login page but after completing authentication and onboarding, they were incorrectly redirected to the dashboard instead of back to the specific job page they were trying to apply to.

## Root Causes
1. **Incorrect URL Format**: The `ApplicationModal` component was constructing redirect URLs using `/jobs/${jobId}` instead of the proper slug format `/jobs/${jobSlug}`.
2. **Parameter Name Mismatch**: The auth callback route was looking for the parameter `redirect_to` (with underscore), while the rest of the codebase used `redirectTo` (camelCase), causing the redirect parameter to be lost during OAuth flows.

## Files Modified

### 1. `src/components/jobs/ApplicationModal.tsx`
**Changes Made**:
- Added import for `generateJobSlug` from `@/lib/utils`
- Updated the redirect URL construction to use the proper job slug format:
  ```tsx
  // Before
  const loginUrl = `/login?redirectTo=/jobs/${jobId}`;

  // After
  const jobSlug = generateJobSlug(jobId, jobTitle);
  const loginUrl = `/login?redirectTo=/jobs/${jobSlug}`;
  ```

**Purpose**: Ensures the redirect URL matches the actual job page URL structure (`/jobs/123-senior-software-engineer` instead of `/jobs/123`).

### 2. `src/app/auth/callback/route.ts`
**Changes Made**:
- Changed parameter name from `redirect_to` to `redirectTo` for consistency:
  ```tsx
  // Before
  const redirectTo = searchParams.get('redirect_to');
  redirectParams.set('redirect_to', redirectTo);

  // After
  const redirectTo = searchParams.get('redirectTo');
  redirectParams.set('redirectTo', redirectTo);
  ```

**Purpose**: Fixes the parameter name mismatch so that the redirect URL is properly passed through the OAuth callback flow.

### 3. `src/app/onboarding/complete-profile/page.tsx`
**Changes Made**:
- Updated the type definition to use `redirectTo` instead of `redirect_to`:
  ```tsx
  // Before
  searchParams: Promise<{ intended_role?: string; redirect_to?: string; }>;

  // After
  searchParams: Promise<{ intended_role?: string; redirectTo?: string; }>;
  ```
- Updated the usage to match:
  ```tsx
  // Before
  afterSignIn={resolvedSearchParams.redirect_to || null}

  // After
  afterSignIn={resolvedSearchParams.redirectTo || null}
  ```

**Purpose**: Ensures consistency in parameter naming throughout the onboarding flow.

## Security Considerations
- All redirects continue to use the `getPostAuthRedirectUrl()` function for validation
- The `isValidInternalPath()` function ensures only safe internal paths are allowed
- No security vulnerabilities were introduced; the fixes maintain protection against open redirect and path traversal attacks

## Solution Overview
The fix ensures that:
1. When a user clicks "Apply Now" on a job while unauthenticated, they're redirected to `/login?redirectTo=/jobs/123-senior-software-engineer`
2. After successful authentication (via email/password or OAuth), the redirect parameter is properly preserved
3. If onboarding is required, the parameter is passed through to the onboarding form
4. After completing onboarding, the user is redirected back to the exact job page they were trying to apply to

## Verification
- ✅ Linting: No ESLint errors
- ✅ Build: Successful compilation
- ✅ Type checking: All TypeScript types correct
- ✅ Parameter consistency: All components now use `redirectTo`

## Result
Job seekers now correctly return to the specific job page after login/onboarding, providing a seamless user experience and maintaining the intended application flow.