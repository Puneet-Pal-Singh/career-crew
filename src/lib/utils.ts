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