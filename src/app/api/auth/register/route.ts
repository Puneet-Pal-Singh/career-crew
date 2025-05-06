// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path if necessary
import { hashPassword } from '@/lib/authUtils'; // Adjust path if necessary
import { UserRole } from '@prisma/client'; // Import the enum

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // --- Input Validation ---
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 });
    }

    // Validate email format (basic)
    if (!/\S+@\S+\.\S+/.test(email)) {
       return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password length (example)
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
         return NextResponse.json({ error: 'Invalid user role specified' }, { status: 400 });
    }
    // --- End Input Validation ---

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }, // Store emails consistently
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        role: role as UserRole, // Cast role to the enum type after validation
        name: name, // Include name if provided
        // Add other fields like phone, linkedin later if needed
      },
      // Select only the fields safe to return (exclude passwordHash)
      select: {
          id: true,
          email: true,
          role: true,
          name: true,
          createdAt: true,
      }
    });

    return NextResponse.json(user, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Registration Error:", error);
    // Check for specific Prisma errors if needed, otherwise generic error
    return NextResponse.json({ error: 'An error occurred during registration.' }, { status: 500 });
  }
}