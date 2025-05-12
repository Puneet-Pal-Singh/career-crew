// src/lib/auth.ts
import { cookies } from 'next/headers';
import { jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import { UserRole } from '@prisma/client'; // Assuming UserRole enum from Prisma

// Define your specific JWT payload structure, extending JOSE's type
export interface CareerCrewJWTPayload extends JoseJWTPayload {
  userId: string;
  role: UserRole; // Use the Prisma enum type directly
  name?: string;
  // Add other custom claims if you have them, e.g., email: string;
}

// Define the structure of the user object within your session
export interface SessionUser {
  userId: string;
  role: UserRole;
  name?: string;
  // email?: string; // if included in JWT and session
}

// Define the overall session structure
export interface Session {
  user?: SessionUser;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies(); // Get the cookie store instance
  const token = cookieStore.get('session_token')?.value; // Call .get() on the instance

  if (!token) {
    // console.log("No session token found in cookies.");
    return null;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("CRITICAL: JWT_SECRET is not defined in environment variables.");
    return null; 
  }
  
  const secretKey = new TextEncoder().encode(jwtSecret);

  try {
    // Perform JWT verification and cast the payload to your specific JWT payload type
    const { payload } = await jwtVerify(token, secretKey) as { payload: CareerCrewJWTPayload };
    
    // Validate the structure of the decoded payload thoroughly
    if (
      !payload || 
      typeof payload.userId !== 'string' || 
      !payload.role || 
      !Object.values(UserRole).includes(payload.role) // Ensure role is a valid UserRole enum member
    ) {
      console.error("Invalid JWT payload structure, missing fields, or invalid role:", payload);
      return null;
    }

    const sessionUser: SessionUser = {
      userId: payload.userId,
      role: payload.role, // This is now correctly typed as UserRole
      name: typeof payload.name === 'string' ? payload.name : undefined,
      // email: typeof payload.email === 'string' ? payload.email : undefined, // Example
    };

    return { user: sessionUser };

  } catch (error: unknown) { // Catch unknown error type for better type safety
    // More specific error logging for JWT issues using jose error codes
    // jose errors have a 'code' property, e.g., 'ERR_JWT_EXPIRED'
    if (error instanceof Error && 'code' in error) {
        const joseErrorCode = (error as { code: string }).code;
        if (joseErrorCode === 'ERR_JWT_EXPIRED') {
            console.warn("JWT Expired:", error.message);
        } else if (joseErrorCode === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || joseErrorCode === 'ERR_JWS_INVALID' || joseErrorCode === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
            console.warn(`JWT Verification Error (${joseErrorCode}): ${error.message}`);
        } else {
            console.error("JWT verification failed with a known JOSE error code but unhandled type:", error);
        }
    } else if (error instanceof Error) {
        console.error("JWT verification failed with a generic error:", error.message);
    } else {
        console.error("JWT verification failed with an unexpected non-error object:", error);
    }
    return null;
  }
}