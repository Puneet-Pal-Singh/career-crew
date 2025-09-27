// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Debounces a function, ensuring it's only called after a certain amount of time
 * has passed without further invocations.
 * This version is strictly typed without using 'any'.
 *
 * @template F - The type of the function to debounce. Must be a function that takes any arguments and returns a value.
 * @param {F} func - The function to debounce.
 * @param {number} waitFor - The debounce delay in milliseconds.
 * @returns {(...args: Parameters<F>) => Promise<ReturnType<F>>} A new debounced function that returns a Promise resolving with the original function's return value.
 */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => Promise<ReturnType<F>> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise<ReturnType<F>>((resolve) => { // Explicitly type the Promise resolution
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        // When the timeout executes, call the original function
        // and resolve the promise with its result.
        const result = func(...args);
        resolve(result);
      }, waitFor);
    });
  };
}

// --- NEW: Add this slug generation function ---
/**
 * Generates a URL-friendly slug from a job ID and title.
 * e.g., (123, "Senior Software Engineer!") => "123-senior-software-engineer"
 * @param id - The job ID (string or number).
 * @param title - The job title.
 * @returns {string} The generated SEO-friendly slug.
 */
export function generateJobSlug(id: string | number, title: string): string {
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s/g, '-')         // Replace spaces with hyphens
    .replace(/-/g, '-')          // Replace multiple hyphens with a single one
    .trim();
  return `${id}-${sanitizedTitle}`;
}

// --- NEW: Add this security utility function ---
/**
 * Validates a URL path to ensure it is a safe, internal redirect target.
 * Protects against Open Redirect and Path Traversal vulnerabilities.
 * @param path - The URL path to validate.
 * @returns {boolean} True if the path is a safe internal redirect, false otherwise.
 */
export function isValidInternalPath(path: string | null | undefined): path is string {
  if (!path) return false;

  return (
    // Must start with '/'
    path.startsWith('/') &&
    // Must NOT start with '//' or '/\' (protocol-relative URLs)
    !path.startsWith('//') &&
    !path.startsWith('/\\') &&
    // Must NOT contain '..' or '.\' (path traversal)
    !path.includes('..') &&
    !path.includes('.\\')
  );
}

/**
 * Gets the post-authentication redirect URL with proper validation and fallbacks.
 * @param intendedRedirect - The URL to redirect to after auth
 * @returns The validated redirect URL or default dashboard
 */
export function getPostAuthRedirectUrl(intendedRedirect?: string | null): string {
  if (isValidInternalPath(intendedRedirect)) {
    return intendedRedirect;
  }
  return '/dashboard';
}

/**
 * Formats an ISO date string into a human-readable relative time format (e.g., "X days ago").
 * @param {string} dateStr - The ISO date string to format.
 * @returns {string} The formatted, human-readable date string.
 */
export function formatDatePosted(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())){ 
    return "Invalid date";
  }
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / msPerDay);

  if (diffDays < 0) return "Posted today"; // future dates due to clock skew
  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted yesterday";
  if (diffDays <= 30) return `Posted ${diffDays} days ago`;

  const sameYear = now.getFullYear() === date.getFullYear();
  const opts: Intl.DateTimeFormatOptions = sameYear
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
  return `Posted on ${date.toLocaleDateString('en-US', opts)}`;
}