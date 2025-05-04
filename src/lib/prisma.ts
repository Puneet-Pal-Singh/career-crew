// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma Client instance.
// Using 'declare global' ensures TypeScript recognizes the 'prisma' property on 'globalThis'.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate PrismaClient.
// In development, reuse the existing instance attached to 'globalThis' to avoid
// creating too many connections due to hot-reloading.
// In production, always create a new instance.
const prisma = globalThis.prisma || new PrismaClient({
  // Optional: Add logging configuration if needed
  // log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Attach the instance to 'globalThis' only in development.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Export the singleton instance.
export default prisma;