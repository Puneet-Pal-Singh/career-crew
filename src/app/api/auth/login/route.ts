// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path
import { comparePassword } from '@/lib/authUtils'; // Adjust path
import jwt, { SignOptions } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // --- Input Validation ---
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    // --- End Input Validation ---

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); // User not found
    }

    // Compare submitted password with stored hash
    const passwordMatch = await comparePassword(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); // Password doesn't match
    }

    // --- Credentials Valid - Generate JWT ---
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET is not set in environment variables.");
        return NextResponse.json({ error: 'Internal server error: JWT configuration missing.' }, { status: 500 });
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn']; // Default to 1 day

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      // Add other non-sensitive data if needed
    };

    const signOptions: SignOptions = {
        expiresIn: expiresIn,
        // You might specify algorithm if needed, though HS256 is default
        // algorithm: 'HS256'
    };

    const token = jwt.sign(payload, secret, signOptions);

    // Return user data (excluding password hash)
    const { ...userWithoutPassword } = user;
    // 1. Create the base response
    const response = NextResponse.json(userWithoutPassword, { status: 200 });

    // 2. Set the cookie on the response object's cookies collection
    response.cookies.set('authToken', token, {
      httpOnly: true, // Important: Prevents client-side JS access
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/', // Cookie available site-wide
      sameSite: 'lax', // Good default for preventing CSRF ('strict' is safer but can have UX impacts)
      // Calculate maxAge in seconds based on expiresInDuration
      // This is a simple example, you might want a more robust parser if using various units
      maxAge: calculateMaxAge(expiresIn?.toString() || '1d'), // Use a helper function (see below)
      // Consider adding 'domain' if needed for subdomains in production
    });

    // 3. Return the modified response with the cookie set
    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'An error occurred during login.' }, { status: 500 });
  }
}

// --- Helper function to calculate maxAge in seconds ---
function calculateMaxAge(expiresIn: string): number {
    // Simple parser for formats like '1d', '7d', '1h', '24h' etc.
    const unit = expiresIn.charAt(expiresIn.length - 1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    if (isNaN(value)) return 7 * 24 * 60 * 60; // Default to 7 days if parse fails

    switch (unit) {
      case 'd': return value * 24 * 60 * 60;
      case 'h': return value * 60 * 60;
      case 'm': return value * 60;
      case 's': return value;
      default: return 7 * 24 * 60 * 60; // Default to 7 days
    }
}